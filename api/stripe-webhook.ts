// api/stripe-webhook.ts

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// ⚠️ Stripe : on ne fixe PAS apiVersion pour éviter les erreurs de typage
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// ⚠️ Client admin Supabase (SERVICE KEY, uniquement côté serveur)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string,
  { auth: { persistSession: false } }
);

// Petit helper pour lire le body brut (requis par Stripe pour vérifier la signature)
async function getRawBody(req: any): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  await new Promise<void>((resolve, reject) => {
    req.on('data', (chunk: Uint8Array) => chunks.push(chunk));
    req.on('end', () => resolve());
    req.on('error', reject);
  });
  return Buffer.concat(chunks);
}

// 🚀 Handler Vercel (pas de NextApiRequest)
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method not allowed');
  }

  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    const buf = await getRawBody(req);

    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error('❌ Signature webhook invalide :', err.message);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  // 🎯 ROUTAGE DES ÉVÉNEMENTS STRIPE
  switch (event.type) {
    // 1️⃣ Paiement terminé (explorateur ou bâtisseur)
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string | null;

      const plan = session.metadata?.plan || 'explorateur';

      const { error: upsertError } = await supabaseAdmin
        .from('stripe_subscriptions')
        .upsert(
          {
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId ?? '',
            plan,
            status: 'active',
          },
          { onConflict: 'stripe_subscription_id' }
        );

      if (upsertError) {
        console.error('❌ Erreur upsert stripe_subscriptions:', upsertError);
      }

      return res.status(200).send('OK checkout');
    }

    // 2️⃣ Subscription mise à jour (ex : cancel_at_period_end = true)
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;

      if (sub.cancel_at_period_end) {
        const { error } = await supabaseAdmin
          .from('stripe_subscriptions')
          .update({
            status: 'canceling',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', sub.id);

        if (error) {
          console.error('❌ Erreur update stripe_subscriptions (updated):', error);
        }
      }

      return res.status(200).send('OK sub updated');
    }

    // 3️⃣ Désabonnement (résiliation effective)
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      const subscriptionId = sub.id;

      const { data: row, error: subErr } = await supabaseAdmin
        .from('stripe_subscriptions')
        .select('user_id')
        .eq('stripe_subscription_id', subscriptionId)
        .maybeSingle();

      if (subErr) {
        console.error('❌ Erreur lecture stripe_subscriptions:', subErr);
        return res.status(200).send('OK');
      }

      if (!row?.user_id) {
        console.warn('⚠️ Aucun user_id trouvé pour sub:', subscriptionId);
        return res.status(200).send('OK');
      }

      const userId = row.user_id;

      // On repasse le profil en plan gratuit
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
        console.error('❌ Erreur update profiles (delete sub):', profileErr);
      }

      const { error: updateSubErr } = await supabaseAdmin
        .from('stripe_subscriptions')
        .update({
          status: 'canceled',
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscriptionId);

      if (updateSubErr) {
        console.error('❌ Erreur update stripe_subscriptions (delete):', updateSubErr);
      }

      return res.status(200).send('OK sub deleted');
    }

    default: {
      console.log('ℹ️ Événement Stripe ignoré :', event.type);
      return res.status(200).send('ignored');
    }
  }
}