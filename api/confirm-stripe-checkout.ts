// api/confirm-stripe-checkout.ts

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Client Supabase "admin" (service_key) côté serveur
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string,
  {
    auth: { persistSession: false },
  }
);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sessionId, email, userId } = req.body as {
    sessionId?: string;
    email?: string;
    userId?: string;
  };

  if (!sessionId || !email || !userId) {
    return res
      .status(400)
      .json({ error: 'sessionId, email ou userId manquant' });
  }

  try {
    // 1️⃣ Récupérer la session Stripe (côté serveur, avec la clé secrète)
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer'],
    });

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Paiement non confirmé' });
    }

    const customerEmail = session.customer_details?.email;

    if (!customerEmail || customerEmail.toLowerCase() !== email.toLowerCase()) {
      return res.status(400).json({
        error:
          "L'email utilisé pour le paiement ne correspond pas à celui du compte.",
      });
    }

    // 2️⃣ Vérifier que le userId correspond bien à cet email côté Supabase
    const { data: userData, error: userErr } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (userErr || !userData?.user) {
      console.error('❌ Erreur getUserById ou user manquant:', userErr);
      return res.status(400).json({ error: 'Utilisateur introuvable' });
    }

    const supaEmail = userData.user.email;
    if (!supaEmail || supaEmail.toLowerCase() !== email.toLowerCase()) {
      return res.status(400).json({
        error:
          "L'utilisateur Supabase ne correspond pas à l'email de paiement.",
      });
    }

    // 3️⃣ Déterminer le plan à partir des metadata Stripe
    const plan =
      (session.metadata?.plan as 'explorateur' | 'batisseur' | undefined) ??
      'explorateur';

    const stripeCustomerId = session.customer as string | null;
    const stripeSubscriptionId = session.subscription as string | null;

    // 4️⃣ Mettre à jour le profil en fonction du plan
    let updates: any = {
      plan,
    };

    if (plan === 'explorateur') {
      updates = {
        ...updates,
        generation_credits: 20,
        analysis_credits: 1,
        mvp_blueprint_credits: 1,
      };
    } else if (plan === 'batisseur') {
      // Illimité "virtuel" (tu pourras ajuster plus tard)
      updates = {
        ...updates,
        generation_credits: 999999,
        analysis_credits: 999999,
        mvp_blueprint_credits: 999999,
      };
    }

    const { error: profileErr } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (profileErr) {
      console.error('❌ Erreur update profiles:', profileErr);
      return res
        .status(500)
        .json({ error: 'Erreur lors de la mise à jour du profil' });
    }

    // 5️⃣ Log dans stripe_checkout_sessions
    const { error: sessionErr } = await supabaseAdmin
      .from('stripe_checkout_sessions')
      .insert({
        stripe_session_id: sessionId,
        email,
        plan,
        user_id: userId,
        stripe_customer_id: stripeCustomerId ?? undefined,
        stripe_subscription_id: stripeSubscriptionId ?? undefined,
      });

    if (sessionErr) {
      console.error(
        '❌ Erreur insert stripe_checkout_sessions:',
        sessionErr
      );
      // pas bloquant pour l'utilisateur
    }

    // 6️⃣ Upsert dans stripe_subscriptions si abonnement Bâtisseur
    if (stripeSubscriptionId && stripeCustomerId) {
      const { error: subErr } = await supabaseAdmin
        .from('stripe_subscriptions')
        .upsert(
          {
            user_id: userId,
            stripe_customer_id: stripeCustomerId,
            stripe_subscription_id: stripeSubscriptionId,
            plan,
            status: 'active',
          },
          { onConflict: 'stripe_subscription_id' }
        );

      if (subErr) {
        console.error('❌ Erreur upsert stripe_subscriptions:', subErr);
        // pas bloquant non plus
      }
    }

    return res.status(200).json({ success: true, plan });
  } catch (err: any) {
    console.error('❌ Erreur confirm-stripe-checkout:', err);
    return res.status(500).json({ error: 'Erreur interne serveur' });
  }
}