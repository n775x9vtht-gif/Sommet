// api/create-checkout-session.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
});

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

  try {
    const origin =
      process.env.PUBLIC_SITE_URL ||
      req.headers.origin ||
      'http://localhost:5173';

    // 🔥 On dérive le plan à partir du mode
    const plan = mode === 'payment' ? 'explorateur' : 'batisseur';

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // ✅ On reste sur / avec des query params
      success_url: `${origin}/?checkout=success&plan=${plan}&session_id={CHECKOUT_SESSION_ID}`,
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