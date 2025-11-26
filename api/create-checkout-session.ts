// api/create-checkout-session.ts
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
    // Domaine du site (prod : ton Vercel, local : http://localhost:5173)
    const origin =
      process.env.PUBLIC_SITE_URL ||
      req.headers.origin ||
      'http://localhost:5173';

    // 🧠 On déduit le plan pour la SuccessPage
    const plan = mode === 'payment' ? 'explorateur' : 'batisseur';

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // ✅ Redirection vers /success avec le plan en query param
      success_url: `${origin}/success?plan=${plan}`,
      // Tu peux garder un petit flag sur la home si tu veux
      cancel_url: `${origin}/?checkout=cancel`,
      billing_address_collection: 'required',
      allow_promotion_codes: true,
    });

    if (!session.url) {
      return res
        .status(500)
        .json({ error: "Impossible de générer l'URL de paiement Stripe." });
    }

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return res
      .status(500)
      .json({ error: 'Erreur lors de la création de la session Stripe' });
  }
}