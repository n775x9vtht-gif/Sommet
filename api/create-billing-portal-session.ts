// api/create-billing-portal-session.ts

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string,
  { auth: { persistSession: false } }
);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { accessToken } = req.body as { accessToken?: string };

  if (!accessToken) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  try {
    // 1️⃣ Vérifier l’utilisateur via le token (sécurisé)
    const {
      data: { user },
      error: userErr,
    } = await supabaseAdmin.auth.getUser(accessToken);

    if (userErr || !user) {
      console.error('❌ Erreur getUser dans create-billing-portal-session:', userErr);
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const userId = user.id;

    // 2️⃣ Récupérer la dernière subscription Stripe de cet user
    const { data: subRow, error: subErr } = await supabaseAdmin
      .from('stripe_subscriptions')
      .select('stripe_customer_id, stripe_subscription_id, status')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (subErr) {
      console.error('❌ Erreur lecture stripe_subscriptions:', subErr);
      return res.status(500).json({ error: 'Erreur lecture subscription' });
    }

    if (!subRow || !subRow.stripe_customer_id) {
      return res
        .status(404)
        .json({ error: "Aucun abonnement Stripe associé à ce compte." });
    }

    const customerId = subRow.stripe_customer_id;

    // 3️⃣ Créer la session de portail Stripe
    const origin =
      process.env.PUBLIC_SITE_URL ||
      (req.headers.origin as string | undefined) ||
      'http://localhost:5173';

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/?from=billing-portal`,
    });

    return res.status(200).json({ url: portalSession.url });
  } catch (err: any) {
    console.error('❌ Erreur create-billing-portal-session:', err);
    return res.status(500).json({ error: 'Erreur interne serveur' });
  }
}