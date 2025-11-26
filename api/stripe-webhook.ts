// api/stripe-webhook.ts
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// ⚠️ Utilise ton API version supportée par le SDK.
// Si TypeScript râle, laisse simplement "as any".
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20' as any,
});

// Client admin Supabase pour écrire dans la BDD côté serveur
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method not allowed');
  }

  const sig = req.headers['stripe-signature'];
  if (!sig) {
    return res.status(400).send('Missing Stripe-Signature header');
  }

  // 1) Récupérer le RAW body (obligatoire pour Stripe)
  let rawBody = '';
  try {
    await new Promise<void>((resolve, reject) => {
      req.on('data', (chunk: Buffer) => {
        rawBody += chunk.toString('utf8');
      });
      req.on('end', () => resolve());
      req.on('error', (err: any) => reject(err));
    });
  } catch (err) {
    console.error('Error reading raw body', err);
    return res.status(400).send('Could not read request body');
  }

  // 2) Vérifier la signature Stripe
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error('❌ Error verifying Stripe signature', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 3) Traiter seulement les events qui nous intéressent
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        const customerEmail =
          session.customer_email ||
          session.customer_details?.email ||
          null;

        // On essaie de récupérer le plan :
        const planFromMetadata = session.metadata?.plan as
          | 'explorateur'
          | 'batisseur'
          | undefined;

        const plan =
          planFromMetadata ??
          (session.mode === 'subscription' ? 'batisseur' : 'explorateur');

        const { error } = await supabaseAdmin
          .from('stripe_checkout_sessions')
          .insert({
            session_id: session.id,
            stripe_customer_id: session.customer as string | null,
            customer_email: customerEmail,
            plan,
            mode: session.mode,
            status: session.status,
            amount_total: session.amount_total,
            currency: session.currency,
            raw_event: event, // colonne de type jsonb côté Supabase
          });

        if (error) {
          console.error('❌ Supabase insert error:', error);
          throw error;
        }

        break;
      }

      default: {
        // Pour tous les autres événements, on log juste
        console.log(`ℹ️ Ignoring event ${event.type}`);
      }
    }

    // Important : toujours répondre 200 quand tout est OK
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('❌ Error handling webhook event', err);
    return res.status(500).send('Internal webhook error');
  }
}