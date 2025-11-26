// api/create-checkout-session.ts
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn('⚠️ STRIPE_SECRET_KEY manquant dans les variables d’environnement');
}

// On ne force pas apiVersion pour éviter les erreurs de typage
const stripe = new Stripe(stripeSecretKey || '');

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { priceId, mode } = req.body || {};

    if (!priceId) {
      console.error('❌ priceId manquant dans le body');
      return res.status(400).json({ error: 'priceId manquant' });
    }

    const checkoutMode: 'payment' | 'subscription' =
      mode === 'subscription' ? 'subscription' : 'payment';

    if (!stripeSecretKey) {
      console.error('❌ Stripe non configuré côté serveur');
      return res.status(500).json({ error: 'Stripe non configuré côté serveur' });
    }

    const origin =
      (req.headers.origin as string) ||
      process.env.PUBLIC_SITE_URL ||
      'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      mode: checkoutMode,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
    });

    console.log('✅ Session Stripe créée :', session.id);
    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('❌ Erreur Stripe Checkout :', error);
    return res.status(500).json({
      error: 'Erreur lors de la création de la session Stripe',
      details: error?.message,
    });
  }
}