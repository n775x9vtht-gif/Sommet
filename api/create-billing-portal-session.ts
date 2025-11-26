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

  const { email } = req.body as { email?: string };

  if (!email) {
    return res.status(400).json({ error: 'Email manquant' });
  }

  try {
    // 1️⃣ Retrouver l'utilisateur Supabase par email via l'API admin
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
        (u: any) =>
          u.email && u.email.toLowerCase() === email.toLowerCase()
      ) ?? null;

    if (!user) {
      console.error('❌ Aucun user avec cet email:', email);
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    const userId = user.id;

    // 2️⃣ Récupérer stripe_customer_id depuis stripe_subscriptions
    const { data: subRows, error: subErr } = await supabaseAdmin
      .from('stripe_subscriptions')
      .select('stripe_customer_id, status')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (subErr) {
      console.error('❌ Erreur lecture stripe_subscriptions:', subErr);
      return res.status(500).json({ error: 'Erreur lecture abonnement' });
    }

    const sub = subRows && subRows[0];

    if (!sub || !sub.stripe_customer_id) {
      return res
        .status(404)
        .json({ error: "Aucun abonnement Stripe actif n'a été trouvé." });
    }

    const stripeCustomerId = sub.stripe_customer_id as string;

    // 3️⃣ Créer une session de Billing Portal Stripe
    const origin =
      process.env.PUBLIC_SITE_URL ||
      req.headers.origin ||
      'http://localhost:5173';

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: origin,
    });

    return res.status(200).json({ url: portalSession.url });
  } catch (err: any) {
    console.error('❌ Erreur create-billing-portal-session:', err);
    return res.status(500).json({ error: 'Erreur interne serveur' });
  }
}