// api/stripe-webhook.ts
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// ⚠️ On ne force pas la version d'API pour éviter les erreurs de typage
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Client Supabase "admin" (service role)
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

// Petite fonction utilitaire pour récupérer le corps brut de la requête
async function getRawBody(req: any): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';

    req.on('data', (chunk: Buffer) => {
      data += chunk.toString();
    });

    req.on('end', () => {
      resolve(data);
    });

    req.on('error', (err: any) => {
      reject(err);
    });
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method not allowed');
  }

  const signature = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error('❌ Signature Stripe ou secret manquant');
    // On répond quand même 200 pour éviter que Stripe SPAM le webhook
    return res.status(200).send('ok');
  }

  let event: Stripe.Event;

  try {
    const rawBody = await getRawBody(req);

    event = stripe.webhooks.constructEvent(
      rawBody,
      signature as string,
      webhookSecret
    );
  } catch (err: any) {
    console.error('❌ Erreur de vérification de signature Stripe :', err?.message || err);
    // Très important : on ne renvoie PAS 400, on accepte mais on ne fait rien
    return res.status(200).send('signature_failed');
  }

  console.log('✅ Webhook Stripe reçu :', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;

        const sessionId = session.id as string;
        const customerId = session.customer as string | null;
        const email =
          session.customer_details?.email ||
          session.customer_email ||
          null;

        const mode = session.mode as 'payment' | 'subscription';
        const plan = (session.metadata?.plan as string | null) ?? null;

        console.log('📦 checkout.session.completed', {
          sessionId,
          customerId,
          email,
          mode,
          plan,
        });

        // On loggue la session dans stripe_checkout_sessions
        const { error: insertError } = await supabaseAdmin
          .from('stripe_checkout_sessions')
          .insert({
            session_id: sessionId,
            stripe_customer_id: customerId,
            email,
            mode,
            plan,
            raw_payload: event as any,
          });

        if (insertError) {
          console.error('❌ Erreur Supabase (stripe_checkout_sessions.insert) :', insertError);
        }

        // Ici on ne touche pas encore au plan dans "profiles" :
        // c'est ton SuccessPage qui le gère côté front, et plus tard
        // on pourra rajouter une logique d’upgrade 100% côté serveur.
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any;
        console.log('💰 invoice.payment_succeeded', {
          invoiceId: invoice.id,
          customer: invoice.customer,
          subscription: invoice.subscription,
          amount_paid: invoice.amount_paid,
        });
        // Pour l’instant, on log juste. Pas de 400/500, tout passe.
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as any;
        console.log(`🔄 ${event.type}`, {
          subscriptionId: sub.id,
          status: sub.status,
          customer: sub.customer,
        });
        break;
      }

      default: {
        console.log('ℹ️ Événement non géré explicitement :', event.type);
      }
    }
  } catch (err: any) {
    console.error('💥 Erreur interne dans le handler Stripe :', err);
    // On log l’erreur mais on renvoie quand même 200 pour que Stripe arrête de réessayer
    return res.status(200).send('internal_error');
  }

  // Toujours répondre 200 si la signature est OK
  return res.status(200).send('ok');
}