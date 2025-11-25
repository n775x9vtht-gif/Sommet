import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { priceId, mode } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: 'priceId manquant' });
    }

    if (mode !== 'payment' && mode !== 'subscription') {
      return res.status(400).json({ error: 'mode invalide' });
    }

    const origin =
      (req.headers && (req.headers.origin || req.headers.referer)) ||
      'https://sommet.tech';

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}?checkout=success`,
      cancel_url: `${origin}?checkout=cancel`,
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Erreur Stripe:', error);
    return res.status(500).json({
      error: 'Erreur serveur Stripe',
      details: error?.message || 'Erreur inconnue',
    });
  }
}