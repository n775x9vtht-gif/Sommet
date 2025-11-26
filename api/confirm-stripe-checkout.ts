// api/confirm-stripe-checkout.ts

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

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

  const { sessionId, email } = req.body as {
    sessionId?: string;
    email?: string;
  };

  if (!sessionId || !email) {
    return res.status(400).json({ error: 'sessionId ou email manquant' });
  }

  try {
    // 1️⃣ Récupérer la session Stripe côté serveur (clé secrète)
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

    const plan =
      (session.metadata?.plan as 'explorateur' | 'batisseur' | undefined) ??
      'explorateur';

    const stripeCustomerId = session.customer as string | null;
    const stripeSubscriptionId = session.subscription as string | null;

    // 2️⃣ Retrouver l'utilisateur Supabase par son email via l'API admin
    // (listUsers + filtrage, car getUserByEmail n'existe pas dans ton SDK)
    const { data: usersRes, error: usersErr } =
      await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });

    if (usersErr) {
      console.error('❌ Erreur listUsers:', usersErr);
      return res.status(500).json({ error: 'Erreur récupération utilisateur' });
    }

    const user =
      usersRes?.users?.find(
        (u) => u.email && u.email.toLowerCase() === email.toLowerCase()
      ) ?? null;

    if (!user) {
      console.error('❌ Aucun user avec cet email:', email);
      return res.status(400).json({ error: 'Utilisateur introuvable' });
    }

    const userId = user.id;

    // 3️⃣ Mettre à jour le profil en fonction du plan
    let updates: any = { plan };

    if (plan === 'explorateur') {
      updates = {
        ...updates,
        generation_credits: 20,
        analysis_credits: 1,
        mvp_blueprint_credits: 1,
      };
    } else if (plan === 'batisseur') {
      // Illimité (à ajuster si tu veux serrer plus tard)
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
      return res.status(500).json({ error: 'Erreur mise à jour profil' });
    }

    // 4️⃣ Log de la session de checkout
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
      // On continue quand même, ce n'est pas bloquant pour l'utilisateur
    }

    // 5️⃣ Upsert de la subscription (si abonnement Bâtisseur)
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
        // pas bloquant pour l'utilisateur non plus
      }
    }

    return res.status(200).json({ success: true, plan });
  } catch (err: any) {
    console.error('❌ Erreur confirm-stripe-checkout:', err);
    return res.status(500).json({ error: 'Erreur interne serveur' });
  }
}