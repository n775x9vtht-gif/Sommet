// api/stripe-webhook.ts

import Stripe from 'stripe';

// ⚠️ Ne PAS fixer apiVersion pour éviter les erreurs de typage
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

async function getRawBody(req: any): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  await new Promise<void>((resolve, reject) => {
    req.on('data', (chunk: Uint8Array) => chunks.push(chunk));
    req.on('end', () => resolve());
    req.on('error', reject);
  });
  return Buffer.concat(chunks);
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method not allowed');
  }

  const sig = req.headers['stripe-signature'] as string;

  try {
    const buf = await getRawBody(req);

    const event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    console.log('✅ Webhook Stripe reçu :', event.type);

    // Pour l’instant on ne fait *rien* en base ici
    return res.status(200).send('ok');
  } catch (err: any) {
    console.error('❌ Erreur webhook Stripe :', err.message);
    // Erreur de signature → Stripe verra un 400
    return res.status(400).send(`Webhook error: ${err.message}`);
  }
}