// api/stripe-webhook.ts
import Stripe from 'stripe';
import { supabaseAdmin } from '../services/supabaseAdminClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// 🔧 Helper pour lire le body brut (Stripe en a besoin pour vérifier la signature)
async function getRawBody(req: any): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk: any) => {
      data += chunk;
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
    return res.status(405).send('Method Not Allowed');
  }

  if (!endpointSecret) {
    console.error('❌ STRIPE_WEBHOOK_SECRET manquant');
    return res.status(500).send('Webhook non configuré');
  }

  let event: Stripe.Event;

  try {
    const rawBody = await getRawBody(req);
    const sig = req.headers['stripe-signature'];

    if (!sig || Array.isArray(sig)) {
      return res.status(400).send('Signature Stripe manquante');
    }

    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err: any) {
    console.error('❌ Erreur de vérification du webhook Stripe:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        const plan = session.metadata?.plan as 'explorateur' | 'batisseur' | undefined;
        const mode = session.mode; // 'payment' ou 'subscription'
        const email =
          session.customer_details?.email ||
          (session.customer_email as string | null) ||
          null;

        if (!plan || !mode) {
          console.warn('checkout.session.completed sans plan ou mode', session.id);
          break;
        }

        await supabaseAdmin
          .from('stripe_checkout_sessions')
          .upsert(
            {
              stripe_session_id: session.id,
              stripe_customer_id: (session.customer as string) ?? null,
              stripe_subscription_id: (session.subscription as string) ?? null,
              email,
              plan,
              mode,
              payment_status: session.payment_status ?? null,
            },
            { onConflict: 'stripe_session_id' }
          );

        console.log('✅ checkout.session.completed loggée pour', email, plan);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice: any = event.data.object;
        const subscriptionId = invoice.subscription ?? null;
        const customerId = invoice.customer ?? null;

        console.log('💰 Facture payée', {
          subscriptionId,
          customerId,
          amount: invoice.amount_paid,
        });

        // Plus tard : synchro fine des abonnements ici
        break;
      }

      case 'customer.subscription.deleted':
      case 'customer.subscription.updated': {
        const subscription: any = event.data.object;
        const customerId = subscription.customer ?? null;

        console.log('🔄 Subscription event', event.type, {
          customerId,
          status: subscription.status,
        });

        // Plus tard : downgrade automatique du plan Bâtisseur -> Camp de base
        break;
      }

      default: {
        console.log(`ℹ️ Event Stripe non géré: ${event.type}`);
      }
    }

    return res.status(200).json({ received: true });
  } catch (err: any) {
    console.error('❌ Erreur dans le traitement du webhook Stripe:', err);
    return res.status(500).send('Erreur interne');
  }
}