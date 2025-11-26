import Stripe from 'stripe';

type Req = {
  method?: string;
  body?: any;
};

type Res = {
  status: (code: number) => Res;
  json: (data: any) => void;
  setHeader: (name: string, value: string) => void;
};

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const stripe = new Stripe(stripeSecretKey || '', {});

// Tes price IDs
const EXPLORER_PRICE_ID = 'price_1SXR8gF1yiAtAmIj0NQNnVmH';
const BUILDER_PRICE_ID = 'price_1SXR94F1yiAtAmIjmLg0JIkT';

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!stripeSecretKey) {
    console.error('❌ STRIPE_SECRET_KEY manquant dans les variables d’environnement Vercel');
    return res.status(500).json({ error: 'Stripe non configuré côté serveur.' });
  }

  try {
    const { planType } = req.body as { planType?: 'explorer' | 'builder' };

    let priceId: string;
    let mode: 'payment' | 'subscription';

    if (planType === 'explorer') {
      priceId = EXPLORER_PRICE_ID;
      mode = 'payment';
    } else if (planType === 'builder') {
      priceId = BUILDER_PRICE_ID;
      mode = 'subscription';
    } else {
      return res.status(400).json({ error: 'planType invalide ou manquant' });
    }

    const baseUrl = process.env.SOMMET_BASE_URL || 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?canceled=1`,
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('❌ Stripe checkout error:', error);
    return res.status(500).json({ error: 'Erreur lors de la création de la session Stripe.' });
  }
}