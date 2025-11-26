// api/create-checkout-session.ts
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('❌ STRIPE_SECRET_KEY manquant dans les variables d’environnement Vercel');
}

const stripe = new Stripe(stripeSecretKey || '', {
  // On laisse Stripe utiliser la version par défaut du compte
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!stripeSecretKey) {
    return res
      .status(500)
      .json({ error: 'Stripe n’est pas configuré côté serveur.' });
  }

  try {
    const { priceId, mode } = req.body as {
      priceId?: string;
      mode?: 'payment' | 'subscription';
    };

    if (!priceId) {
      return res.status(400).json({ error: 'priceId manquant' });
    }

    // On récupère l'origin pour les URLs de redirection
    const origin =
      req.headers.origin ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:5173');

    const session = await stripe.checkout.sessions.create({
      mode: mode || 'payment', // par défaut payment
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/?checkout=cancel`,
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('❌ Erreur Stripe côté serveur :', error);
    return res
      .status(500)
      .json({ error: error.message || 'Erreur interne Stripe' });
  }
}