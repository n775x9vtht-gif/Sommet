// api/create-checkout-session.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-11-17.clover' as any,
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée' });
    return;
  }

  try {
    const { planType } = req.body as { planType?: 'explorer' | 'builder' };

    if (!planType) {
      res.status(400).json({ error: 'planType manquant' });
      return;
    }

    // 👉 Tes Price IDs Stripe
    const EXPLORER_PRICE_ID = 'price_1SXR8gF1yiAtAmIj0NQNnVmH';
    const BUILDER_PRICE_ID = 'price_1SXR94F1yiAtAmIjmLg0JIkT';

    const priceId =
      planType === 'explorer' ? EXPLORER_PRICE_ID : BUILDER_PRICE_ID;

    // On différencie paiement ponctuel / abonnement
    const mode: 'payment' | 'subscription' =
      planType === 'explorer' ? 'payment' : 'subscription';

    const origin =
      process.env.PUBLIC_APP_URL || 'https://sommet.vercel.app';

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        planType,
      },
      // IMPORTANT : on passe le session_id dans l'URL de success
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    });

    res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Erreur create-checkout-session:', error);
    res.status(500).json({
      error: 'Erreur lors de la création de la session Stripe',
      details: error?.message,
    });
  }
}