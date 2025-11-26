// api/stripe-webhook.ts
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // ne pas forcer apiVersion → on laisse Stripe utiliser celle du compte
});

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method not allowed');
  }

  const sig = req.headers['stripe-signature'] as string | undefined;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error('❌ Missing Stripe signature or webhook secret');
    return res.status(400).send('Missing Stripe signature or webhook secret');
  }

  let event: Stripe.Event;

  // Vercel fournit le body déjà parsé : on doit récupérer le raw body
  // → on utilise req.body directement si Stripe est déjà en mode JSON
  try {
    const payload = req.body as any;
    const rawBody =
      typeof payload === 'string' ? payload : JSON.stringify(payload);

    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Error verifying Stripe signature:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        const stripeCustomerId =
          typeof session.customer === 'string'
            ? session.customer
            : session.customer?.id || null;

        const subscriptionId =
          typeof session.subscription === 'string'
            ? session.subscription
            : (session.subscription as any)?.id || null;

        const email =
          session.customer_details?.email || session.customer_email || null;

        const planMeta = session.metadata?.plan as
          | 'explorateur'
          | 'batisseur'
          | undefined;

        // fallback au cas où
        const plan: string =
          planMeta ||
          (session.mode === 'subscription' ? 'batisseur' : 'explorateur');

        if (!email) {
          console.error(
            '❌ checkout.session.completed sans email, on ne peut pas lier à un profil.',
            session.id
          );
          break;
        }

        // 1️⃣ On loggue la session brute (table stripe_checkout_sessions)
        const { error: insertSessionError } = await supabase
          .from('stripe_checkout_sessions')
          .insert({
            stripe_session_id: session.id,
            stripe_customer_id: stripeCustomerId,
            stripe_subscription_id: subscriptionId,
            email,
            amount_total: session.amount_total,
            currency: session.currency,
            plan,
            mode: session.mode,
            raw_payload: session, // JSONB
          });

        if (insertSessionError) {
          console.error(
            '❌ Erreur insert stripe_checkout_sessions:',
            insertSessionError
          );
        } else {
          console.log('✅ Session Stripe loggée dans stripe_checkout_sessions');
        }

        // 2️⃣ On crédite / crée le profil Supabase
        //    (camp_de_base par défaut + upgrade en fonction du plan)
        const isExplorer = plan === 'explorateur';
        const isBuilder = plan === 'batisseur';

        // crédits selon plan – adapte ici si besoin
        const generationCredits = isExplorer ? 20 : isBuilder ? 9999 : 3;
        const analysisCredits = isExplorer ? 1 : isBuilder ? 9999 : 1;
        const mvpBlueprintCredits = isExplorer ? 1 : isBuilder ? 9999 : 0;

        const { data: existingProfiles, error: fetchProfileError } =
          await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .limit(1);

        if (fetchProfileError) {
          console.error('❌ Erreur fetch profil Supabase:', fetchProfileError);
          break;
        }

        const existingProfile = existingProfiles?.[0];

        if (!existingProfile) {
          // ➕ Création du profil avec le bon plan
          const { error: insertProfileError } = await supabase
            .from('profiles')
            .insert({
              email,
              full_name: session.customer_details?.name || null,
              plan: isExplorer ? 'explorateur' : isBuilder ? 'batisseur' : 'camp_de_base',
              generation_credits: generationCredits,
              analysis_credits: analysisCredits,
              mvp_blueprint_credits: mvpBlueprintCredits,
              stripe_customer_id: stripeCustomerId,
              stripe_subscription_id: subscriptionId,
            });

          if (insertProfileError) {
            console.error(
              '❌ Erreur insert profil Supabase:',
              insertProfileError
            );
          } else {
            console.log('✅ Profil créé avec plan', plan);
          }
        } else {
          // 🔄 Mise à jour du profil existant (upgrade)
          const { error: updateProfileError } = await supabase
            .from('profiles')
            .update({
              plan: isExplorer ? 'explorateur' : isBuilder ? 'batisseur' : existingProfile.plan,
              generation_credits:
                (existingProfile.generation_credits || 0) + generationCredits,
              analysis_credits:
                (existingProfile.analysis_credits || 0) + analysisCredits,
              mvp_blueprint_credits:
                (existingProfile.mvp_blueprint_credits || 0) +
                mvpBlueprintCredits,
              stripe_customer_id: stripeCustomerId,
              stripe_subscription_id: subscriptionId,
            })
            .eq('id', existingProfile.id);

          if (updateProfileError) {
            console.error(
              '❌ Erreur update profil Supabase:',
              updateProfileError
            );
          } else {
            console.log('✅ Profil mis à jour avec plan', plan);
          }
        }

        break;
      }

      default:
        // on ignore le reste pour l’instant
        console.log(`ℹ️ Event Stripe ignoré: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (err: any) {
    console.error('❌ Erreur dans le handler Stripe webhook:', err);
    return res.status(500).send('Webhook handler error');
  }
}