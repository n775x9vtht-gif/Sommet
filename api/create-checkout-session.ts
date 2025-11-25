import Stripe from "stripe";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Méthode non autorisée" });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const { priceId } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: "priceId manquant" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin}/dashboard?success=true`,
      cancel_url: `${req.headers.origin}/pricing?canceled=true`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Erreur Stripe :", error);
    return res.status(500).json({ error: "Erreur serveur Stripe" });
  }
}