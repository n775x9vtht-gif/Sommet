// api/complete-signup.ts
import Stripe from 'stripe';
import { supabaseAdmin } from '../services/supabaseAdmin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-11-17.clover' as any,
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée' });
    return;
  }

  try {
    const { sessionId, password, fullName } = req.body as {
      sessionId?: string;
      password?: string;
      fullName?: string;
    };

    if (!sessionId || !password) {
      res.status(400).json({ error: 'sessionId ou password manquant' });
      return;
    }

    // 1️⃣ On récupère la session Stripe pour vérifier que le paiement est OK
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      res.status(400).json({ error: 'Paiement non confirmé' });
      return;
    }

    const email = session.customer_details?.email;
    const planType = (session.metadata?.planType as 'explorer' | 'builder' | undefined) || 'explorer';

    if (!email) {
      res.status(400).json({ error: "Email introuvable sur la session Stripe" });
      return;
    }

    // 2️⃣ On crée l'utilisateur dans Supabase Auth
    const { data: userCreation, error: userError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // on considère l'email validé (Stripe l'a déjà)
        user_metadata: {
          full_name: fullName || null,
          plan: planType,
          stripe_session_id: session.id,
        },
      });

    if (userError) {
      console.error('Erreur création user Supabase:', userError);
      res.status(500).json({ error: 'Erreur lors de la création du compte' });
      return;
    }

    // 3️⃣ (Optionnel) On peut stocker l'info du plan dans une table "profiles"
    //    si tu en as déjà une.
    // Exemple (à adapter si tu as une table différente) :
    //
    // await supabaseAdmin
    //   .from('profiles')
    //   .upsert({
    //     id: userCreation.user?.id,
    //     email,
    //     plan: planType,
    //   });

    res.status(200).json({
      success: true,
      email,
      plan: planType,
    });
  } catch (error: any) {
    console.error('Erreur complete-signup:', error);
    res.status(500).json({
      error: 'Erreur serveur lors de la finalisation du compte',
      details: error?.message,
    });
  }
}