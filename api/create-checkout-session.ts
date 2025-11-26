// api/create-checkout-session.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
});

// ⚙️ On définit ce qui est autorisé côté serveur
const PRICE_CONFIG: Record<
  string,
  { plan: 'explorateur' | 'batisseur'; mode: 'payment' | 'subscription' }
> = {
  // Explorateur – paiement one-shot
  'price_1SXR8gF1yiAtAmIj0NQNnVmH': {
    plan: 'explorateur',
    mode: 'payment',
  },
  // Bâtisseur – abonnement mensuel
  'price_1SXR94F1yiAtAmIjmLg0JIkT': {
    plan: 'batisseur',
    mode: 'subscription',
  },
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { priceId, mode } = req.body as {
    priceId?: string;
    mode?: 'payment' | 'subscription';
  };

  if (!priceId || !mode) {
    return res.status(400).json({ error: 'priceId ou mode manquant' });
  }

  const config = PRICE_CONFIG[priceId];

  // ❌ Price inconnu ou mode qui ne matche pas → on bloque
  if (!config || config.mode !== mode) {
    console.error('Tentative de checkout invalide', { priceId, mode });
    return res.status(400).json({ error: 'Combinaison priceId/mode invalide' });
  }

  try {
    const origin =
      process.env.PUBLIC_SITE_URL ||
      req.headers.origin ||
      'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      mode: config.mode,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // ✅ on ne fait PAS confiance au front pour le plan
      metadata: {
        plan: config.plan,
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=cancel`,
      billing_address_collection: 'required',
      allow_promotion_codes: true,
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return res
      .status(500)
      .json({ error: 'Erreur lors de la création de la session Stripe' });
  }
}