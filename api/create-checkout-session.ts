import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

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
    // On récupère l'origine (prod : ton domaine Vercel, local : http://localhost:5173)
    const origin =
      process.env.PUBLIC_SITE_URL ||
      req.headers.origin ||
      'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // ✅ On renvoie toujours vers la racine, avec un paramètre dans l'URL
      success_url: `${origin}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
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