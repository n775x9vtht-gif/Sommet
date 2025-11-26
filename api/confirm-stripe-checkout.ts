// api/confirm-stripe-checkout.ts
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

type PlanType = 'explorateur' | 'batisseur';

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

  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if (!STRIPE_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Variables env manquantes', {
      hasStripe: !!STRIPE_SECRET_KEY,
      hasUrl: !!SUPABASE_URL,
      hasServiceKey: !!SUPABASE_SERVICE_KEY,
    });
    return res.status(500).json({
      error:
        'Configuration serveur incomplète (STRIPE_SECRET_KEY / NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_KEY).',
    });
  }

  // ⚠️ Création *après* vérification des env
  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false },
  });

  try {
    console.log('🔎 Vérification Stripe sessionId:', sessionId, 'email:', email);

    // 1️⃣ Récupérer la session Stripe côté serveur (clé secrète)
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer'],
    });

    console.log('✅ Session Stripe récupérée:', {
      id: session.id,
      payment_status: session.payment_status,
      mode: session.mode,
      metadata: session.metadata,
    });

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Paiement non confirmé' });
    }

    const customerEmail = session.customer_details?.email;

    if (!customerEmail) {
      console.error('❌ Pas de customer_email dans la session Stripe');
      return res.status(400).json({
        error: "Impossible de récupérer l'email du client côté Stripe.",
      });
    }

    if (customerEmail.toLowerCase() !== email.toLowerCase()) {
      console.error('❌ Email mismatch:', { customerEmail, email });
      return res.status(400).json({
        error:
          "L'email utilisé pour le paiement ne correspond pas à celui saisi sur Sommet.",
      });
    }

    // 2️⃣ Déterminer le plan
    let plan: PlanType = 'explorateur';

    const metadataPlan = session.metadata?.plan as PlanType | undefined;
    if (metadataPlan === 'explorateur' || metadataPlan === 'batisseur') {
      plan = metadataPlan;
    } else if (session.mode === 'subscription') {
      plan = 'batisseur';
    } else {
      plan = 'explorateur';
    }

    const stripeCustomerId = (session.customer as string) || null;
    const stripeSubscriptionId = (session.subscription as string) || null;

    // 3️⃣ Retrouver l'utilisateur Supabase par son email via l'API admin
    const { data: usersRes, error: usersErr } =
      await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });

    if (usersErr) {
      console.error('❌ Erreur listUsers:', usersErr);
      return res.status(500).json({ error: 'Erreur récupération utilisateur' });
    }

    const users = (usersRes?.users || []) as any[];

    const user =
      users.find(
        (u) =>
          u.email &&
          typeof u.email === 'string' &&
          u.email.toLowerCase() === email.toLowerCase()
      ) ?? null;

    if (!user) {
      console.error('❌ Aucun user avec cet email:', email);
      return res.status(400).json({ error: 'Utilisateur introuvable' });
    }

    const userId: string = user.id;
    console.log('✅ Utilisateur Supabase trouvé:', userId);

    // 4️⃣ Mettre à jour le profil en fonction du plan
    let updates: any = { plan };

    if (plan === 'explorateur') {
      updates = {
        ...updates,
        generation_credits: 20,
        analysis_credits: 1,
        mvp_blueprint_credits: 1,
      };
    } else if (plan === 'batisseur') {
      // Illimité (ou très large)
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

    console.log('✅ Profil mis à jour pour', userId, 'avec', updates);

    // 5️⃣ Log de la session de checkout
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
        '⚠️ Erreur insert stripe_checkout_sessions (non bloquant):',
        sessionErr
      );
    } else {
      console.log('✅ Session Stripe logguée dans stripe_checkout_sessions');
    }

    // 6️⃣ Upsert de la subscription (si abonnement Bâtisseur)
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
        console.error(
          '⚠️ Erreur upsert stripe_subscriptions (non bloquant):',
          subErr
        );
      } else {
        console.log(
          '✅ Subscription logguée / mise à jour dans stripe_subscriptions'
        );
      }
    }

    return res.status(200).json({ success: true, plan });
  } catch (err: any) {
    console.error('❌ Erreur confirm-stripe-checkout (catch):', err);
    return res.status(500).json({
      error:
        err?.message ||
        'Erreur interne serveur dans confirm-stripe-checkout (catch)',
    });
  }
}