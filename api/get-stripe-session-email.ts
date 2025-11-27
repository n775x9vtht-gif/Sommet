// api/get-stripe-session-email.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sessionId } = req.body as { sessionId?: string };

  if (!sessionId) {
    return res.status(400).json({ error: 'sessionId manquant' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer'],
    });

    const email =
      session.customer_details?.email ||
      (typeof session.customer === 'object' &&
        session.customer &&
        'email' in session.customer
        ? (session.customer as any).email
        : null);

    if (!email) {
      return res
        .status(404)
        .json({ error: "Email introuvable pour cette session Stripe." });
    }

    return res.status(200).json({ email });
  } catch (err: any) {
    console.error('Erreur get-stripe-session-email:', err);
    return res.status(500).json({ error: 'Erreur interne serveur' });
  }
}