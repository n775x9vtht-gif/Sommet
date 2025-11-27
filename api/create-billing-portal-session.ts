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

  if (
    !process.env.STRIPE_SECRET_KEY ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_KEY
  ) {
    console.error('❌ Config manquante pour create-billing-portal-session');
    return res
      .status(500)
      .json({ error: 'Configuration serveur incomplète (Stripe/Supabase).' });
  }

  const { userId } = req.body as { userId?: string };

  if (!userId) {
    return res.status(400).json({ error: 'userId manquant dans la requête.' });
  }

  try {
    // 1️⃣ On récupère la dernière subscription pour cet utilisateur
    const { data: subRows, error: subErr } = await supabaseAdmin
      .from('stripe_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (subErr) {
      console.error('❌ Erreur lecture stripe_subscriptions:', subErr);
      return res
        .status(500)
        .json({ error: 'Erreur lors de la récupération de la souscription.' });
    }

    const subRow = subRows && subRows[0];
    if (!subRow || !subRow.stripe_customer_id) {
      console.warn('⚠️ Aucun stripe_customer_id trouvé pour user_id =', userId);
      return res.status(400).json({
        error:
          "Aucun abonnement Stripe associé à ce compte. Impossible d'ouvrir le portail.",
      });
    }

    const stripeCustomerId = subRow.stripe_customer_id as string;

    // 2️⃣ Création de la session de portail Stripe
    const origin =
      process.env.BILLING_PORTAL_RETURN_URL ||
      req.headers.origin ||
      'http://localhost:5173';

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: origin,
    });

    return res.status(200).json({ url: portalSession.url });
  } catch (err: any) {
    console.error('❌ Erreur create-billing-portal-session:', err);
    return res
      .status(500)
      .json({ error: "Erreur interne lors de la création de la session." });
  }
}