// api/stripe-webhook.ts

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// ⚠️ Pas d'apiVersion ici, pour ne pas avoir l'erreur "2025-11-17.clover"
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string,
  { auth: { persistSession: false } }
);

// Vercel a besoin du body brut pour vérifier la signature Stripe
export const config = {
  api: {
    bodyParser: false,
  },
};

// Petite fonction utilitaire pour lire le body brut
async function getRawBody(req: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    req.on('data', (chunk: any) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', (err: any) => reject(err));
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'];
  if (!sig) {
    return res.status(400).send('Missing Stripe signature');
  }

  let event: Stripe.Event;

  try {
    const rawBody = await getRawBody(req);

    event = stripe.webhooks.constructEvent(
      rawBody,
      sig.toString(),
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error('❌ Erreur vérification webhook Stripe :', err?.message);
    return res.status(400).send(`Webhook Error: ${err?.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('✅ checkout.session.completed reçu (webhook) :', session.id);
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        // Cast en any pour récupérer les champs epoch (cancel_at, current_period_end, etc.)
        const subscription = event.data.object as any;

        const stripeSubscriptionId = subscription.id as string;
        const stripeCustomerId = subscription.customer as string;
        const status = subscription.status as string; // active, past_due, canceled, unpaid...

        // Champs chrono envoyés par Stripe (epoch seconds → ISO string)
        const cancelAtPeriodEnd: boolean =
          subscription.cancel_at_period_end ?? false;

        const cancelAt: string | null = subscription.cancel_at
          ? new Date(subscription.cancel_at * 1000).toISOString()
          : null;

        const currentPeriodEnd: string | null = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000).toISOString()
          : null;

        console.log('🔔 Event subscription:', event.type, {
          stripeSubscriptionId,
          stripeCustomerId,
          status,
          cancelAtPeriodEnd,
          cancelAt,
          currentPeriodEnd,
        });

        // 1️⃣ On récupère la row stripe_subscriptions existante
        const { data: subRows, error: subSelectErr } = await supabaseAdmin
          .from('stripe_subscriptions')
          .select('id, user_id, plan')
          .eq('stripe_subscription_id', stripeSubscriptionId)
          .limit(1);

        if (subSelectErr) {
          console.error('❌ Erreur lecture stripe_subscriptions:', subSelectErr);
          break;
        }

        const subscriptionRow = subRows && subRows[0];
        if (!subscriptionRow) {
          console.warn(
            '⚠️ Aucune row stripe_subscriptions pour cette subscription :',
            stripeSubscriptionId
          );
          break;
        }

        const { user_id: userId, plan } = subscriptionRow;

        // 2️⃣ Mise à jour des métadonnées d’abonnement dans stripe_subscriptions
        const { error: subUpdateErr } = await supabaseAdmin
          .from('stripe_subscriptions')
          .update({
            status,
            stripe_customer_id: stripeCustomerId,
            cancel_at: cancelAt,
            cancel_at_period_end: cancelAtPeriodEnd,
            current_period_end: currentPeriodEnd,
          })
          .eq('stripe_subscription_id', stripeSubscriptionId);

        if (subUpdateErr) {
          console.error('❌ Erreur update stripe_subscriptions:', subUpdateErr);
        }

        // 3️⃣ Downgrade du profil UNIQUEMENT si l'abo est réellement terminé
        if (status === 'canceled' || status === 'unpaid' || status === 'past_due') {
          console.log('🔻 Abonnement terminé, downgrade du profil user_id =', userId);

          const { error: profileErr } = await supabaseAdmin
            .from('profiles')
            .update({
              plan: 'camp_de_base',
              generation_credits: 3,
              analysis_credits: 1,
              mvp_blueprint_credits: 0,
            })
            .eq('id', userId);

          if (profileErr) {
            console.error('❌ Erreur update profiles (downgrade):', profileErr);
          }
        }

        break;
      }

      default: {
        console.log(`ℹ️ Event Stripe non géré: ${event.type}`);
      }
    }

    return res.status(200).json({ received: true });
  } catch (err: any) {
    console.error('❌ Erreur interne stripe-webhook:', err);
    return res.status(500).send('Internal Server Error');
  }
}