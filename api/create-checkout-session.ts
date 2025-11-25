// api/create-checkout-session.ts
import Stripe from 'stripe';

export const config = {
  runtime: 'edge',
};

// ⚠️ Assure-toi d'avoir bien STRIPE_SECRET_KEY dans tes variables Vercel
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {});

type Plan = 'EXPLORATEUR' | 'BATISSEUR';

const PRICE_IDS: Record<Plan, string> = {
  EXPLORATEUR: 'price_1SXR8gF1yiAtAmIj0NQNnVmH', // L'Explorateur
  BATISSEUR:  'price_1SXR94F1yiAtAmIjmLg0JIkT', // Le Bâtisseur
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const body = await req.json().catch(() => ({} as any));
    const plan = (body.plan || 'EXPLORATEUR') as Plan;
    const priceId = PRICE_IDS[plan];

    if (!priceId) {
      return new Response(
        JSON.stringify({ error: 'Invalid plan' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Domaine d’origine (local ou Vercel)
    const origin =
      req.headers.get('origin') ||
      'https://sommet.tech'; // éventuellement remplace par ton domaine Vercel

    const session = await stripe.checkout.sessions.create({
      mode: plan === 'BATISSEUR' ? 'subscription' : 'payment',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/?checkout=success&plan=${plan.toLowerCase()}`,
      cancel_url: `${origin}/?checkout=cancelled`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      metadata: {
        plan,
      },
    });

    return new Response(
      JSON.stringify({ id: session.id, url: session.url }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    console.error('Stripe error:', err);

    return new Response(
      JSON.stringify({
        error: err?.message || 'Erreur Stripe lors de la création de la session',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}