// api/confirm-stripe-checkout.ts

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// ⚠️ Variables à avoir dans Vercel :
// STRIPE_SECRET_KEY
// NEXT_PUBLIC_SUPABASE_URL
// SUPABASE_SERVICE_KEY

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

  // 🔒 Double check config
  if (
    !process.env.STRIPE_SECRET_KEY ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_KEY
  ) {
    console.error(
      '❌ Config serveur incomplète (STRIPE_SECRET_KEY / NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_KEY)'
    );
    return res
      .status(500)
      .json({ error: 'Configuration serveur incomplète' });
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

    // 2️⃣ Plan depuis les metadata Stripe
    const plan =
      (session.metadata?.plan as 'explorateur' | 'batisseur' | undefined) ??
      'explorateur';

    // 3️⃣ On récupère proprement les IDs Stripe (string) même si on a expand les objets
    let stripeCustomerId: string | null = null;
    if (typeof session.customer === 'string') {
      stripeCustomerId = session.customer;
    } else if (session.customer && typeof (session.customer as any).id === 'string') {
      stripeCustomerId = (session.customer as any).id;
    }

    let stripeSubscriptionId: string | null = null;
    if (typeof session.subscription === 'string') {
      stripeSubscriptionId = session.subscription;
    } else if (
      session.subscription &&
      typeof (session.subscription as any).id === 'string'
    ) {
      stripeSubscriptionId = (session.subscription as any).id;
    }

    // 4️⃣ Retrouver l'utilisateur Supabase par son email via l'API admin
    const { data: usersRes, error: usersErr } =
      await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });

    if (usersErr) {
      console.error('❌ Erreur listUsers:', usersErr);
      return res.status(500).json({ error: 'Erreur récupération utilisateur' });
    }

    const users = usersRes?.users ?? [];
    const user =
      users.find(
        (u: any) => u.email && u.email.toLowerCase() === email.toLowerCase()
      ) ?? null;

    if (!user) {
      console.error('❌ Aucun user avec cet email:', email);
      return res.status(400).json({ error: 'Utilisateur introuvable' });
    }

    const userId = user.id as string;

    // 5️⃣ Mettre à jour le profil en fonction du plan
    let updates: any = { plan };

    if (plan === 'explorateur') {
      updates = {
        ...updates,
        generation_credits: 20,
        analysis_credits: 1,
        mvp_blueprint_credits: 1,
      };
    } else if (plan === 'batisseur') {
      // Illimité (à ajuster si besoin)
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

    // 6️⃣ Log de la session de checkout → correspond EXACTEMENT à ton schéma
    const { error: sessionErr } = await supabaseAdmin
      .from('stripe_checkout_sessions')
      .insert({
        session_id: session.id,              // 🔹 colonne = session_id (pas stripe_session_id)
        stripe_customer_id: stripeCustomerId ?? null,
        email,
        plan,
        mode: session.mode,                 // "payment" ou "subscription"
        user_id: userId,
        raw_payload: session,               // jsonb
      });

    if (sessionErr) {
      console.error(
        '❌ Erreur insert stripe_checkout_sessions:',
        sessionErr
      );
      // On ne bloque pas l'utilisateur
    }

        // 7️⃣ Upsert de la subscription (Bâtisseur ou autre abonnement)
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
          {
            onConflict: 'stripe_subscription_id',
          }
        );

      if (subErr) {
        console.error('❌ Erreur upsert stripe_subscriptions:', subErr);
        // pas bloquant pour l'utilisateur
      }
    }

    return res.status(200).json({ success: true, plan });
  } catch (err: any) {
    console.error('❌ Erreur confirm-stripe-checkout:', err);
    return res.status(500).json({ error: 'Erreur interne serveur' });
  }
}