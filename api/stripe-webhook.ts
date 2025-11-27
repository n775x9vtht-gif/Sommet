// api/stripe-webhook.ts

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// ⚠️ Pas d'apiVersion ici, pour éviter le souci "2025-11-17.clover"
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
        // 👉 Tu gères déjà le créditage/plan dans /api/confirm-stripe-checkout
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('✅ checkout.session.completed reçu (webhook) :', session.id);
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const stripeSubscriptionId = subscription.id;
        const stripeCustomerId = subscription.customer as string;
        const status = subscription.status; // active, past_due, canceled, unpaid...

        console.log('🔔 Event subscription:', event.type, {
          stripeSubscriptionId,
          stripeCustomerId,
          status,
        });

        // Convertir quelques timestamps Unix → ISO string (via any pour éviter TS chiant)
        const cancelAtUnix = (subscription as any).cancel_at as number | null | undefined;
        const currentPeriodEndUnix = (subscription as any)
          .current_period_end as number | null | undefined;

        const cancel_at = cancelAtUnix
          ? new Date(cancelAtUnix * 1000).toISOString()
          : null;
        const current_period_end = currentPeriodEndUnix
          ? new Date(currentPeriodEndUnix * 1000).toISOString()
          : null;
        const cancel_at_period_end =
          (subscription as any).cancel_at_period_end ?? false;

        // 1️⃣ On essaie de retrouver la souscription par son id
        const { data: subRows, error: subSelectErr } = await supabaseAdmin
          .from('stripe_subscriptions')
          .select('id, user_id, plan')
          .eq('stripe_subscription_id', stripeSubscriptionId)
          .limit(1);

        if (subSelectErr) {
          console.error('❌ Erreur lecture stripe_subscriptions:', subSelectErr);
          break; // on évite de faire planter le webhook
        }

        let userId: string | null = null;
        let existingPlan: string | null = null;

        if (subRows && subRows.length > 0) {
          // ✅ On a déjà une row pour cette subscription
          userId = subRows[0].user_id as string;
          existingPlan = subRows[0].plan as string | null;
        } else {
          // ❓ Pas encore de row pour cette subscription (cas réabonnement / nouvelle sub)
          // → On essaie de retrouver l'user via le stripe_customer_id sur une ancienne sub
          const { data: rowsByCustomer, error: byCustomerErr } =
            await supabaseAdmin
              .from('stripe_subscriptions')
              .select('user_id, plan')
              .eq('stripe_customer_id', stripeCustomerId)
              .limit(1);

          if (byCustomerErr) {
            console.error(
              '❌ Erreur lecture stripe_subscriptions par customer_id:',
              byCustomerErr
            );
            break;
          }

          if (!rowsByCustomer || rowsByCustomer.length === 0) {
            console.warn(
              '⚠️ Aucune subscription associée à ce customer Stripe :',
              stripeCustomerId
            );
            // On ne peut pas deviner quel user c'est → on log et on sort
            break;
          }

          userId = rowsByCustomer[0].user_id as string;
          existingPlan = rowsByCustomer[0].plan as string | null;
        }

        if (!userId) {
          console.warn(
            '⚠️ Impossible de déterminer user_id pour cette subscription :',
            stripeSubscriptionId
          );
          break;
        }

        // On considère que toutes les subscriptions Stripe ici sont pour Bâtisseur
        const plan = (existingPlan as 'camp_de_base' | 'explorateur' | 'batisseur') || 'batisseur';

        // 2️⃣ Upsert propre de la subscription
        const { error: subUpsertErr } = await supabaseAdmin
          .from('stripe_subscriptions')
          .upsert(
            {
              user_id: userId,
              stripe_customer_id: stripeCustomerId,
              stripe_subscription_id: stripeSubscriptionId,
              plan,
              status,
              cancel_at,
              cancel_at_period_end,
              current_period_end,
            },
            {
              onConflict: 'stripe_subscription_id',
            }
          );

        if (subUpsertErr) {
          console.error('❌ Erreur upsert stripe_subscriptions:', subUpsertErr);
          break;
        }

        // 3️⃣ Vérifier si l'utilisateur a encore AU MOINS UNE subscription active
        const { data: activeSubs, error: activeErr } = await supabaseAdmin
          .from('stripe_subscriptions')
          .select('id')
          .eq('user_id', userId)
          .eq('status', 'active');

        if (activeErr) {
          console.error(
            '❌ Erreur lecture des subscriptions actives pour user:',
            activeErr
          );
          break;
        }

        if (activeSubs && activeSubs.length > 0) {
          // ✅ Au moins un abonnement actif → maintenir / repasser en Bâtisseur
          console.log(
            '✅ User a au moins une sub active, on le garde en Bâtisseur :',
            userId
          );
          const { error: profileErr } = await supabaseAdmin
            .from('profiles')
            .update({
              plan: 'batisseur',
              generation_credits: 999999,
              analysis_credits: 999999,
              mvp_blueprint_credits: 999999,
            })
            .eq('id', userId);

          if (profileErr) {
            console.error(
              '❌ Erreur update profiles (maintien Bâtisseur):',
              profileErr
            );
          }
        } else {
          // ❌ Plus aucune sub active → downgrade en Camp de Base
          console.log(
            '🔻 Aucune sub active restante, downgrade en Camp de Base pour user_id =',
            userId
          );

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
            console.error(
              '❌ Erreur update profiles (downgrade):',
              profileErr
            );
          }
        }

        break;
      }

      default: {
        // Pour éviter les erreurs 400 "unexpected event", on accepte le reste
        console.log(`ℹ️ Event Stripe non géré: ${event.type}`);
      }
    }

    return res.status(200).json({ received: true });
  } catch (err: any) {
    console.error('❌ Erreur interne stripe-webhook:', err);
    return res.status(500).send('Internal Server Error');
  }
}