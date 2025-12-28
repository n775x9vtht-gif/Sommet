
import { SavedIdea } from '../types';

export const DEMO_DATA: SavedIdea[] = [
  {
    id: 'demo_1',
    title: 'Plateforme de retours visuels pour designers',
    tagline: 'Collectez les retours clients directement sur vos maquettes',
    description: 'Un SaaS qui permet aux équipes design de recueillir et organiser les retours clients directement sur des maquettes via captures d\'écran annotées. Simplifie la collaboration avec les clients et accélère les cycles de feedback.',
    targetAudience: 'Freelances designers, agences design, équipes produit de 2-20 personnes',
    revenueModel: 'Abonnement mensuel : 29€/mois (Starter), 79€/mois (Pro), 199€/mois (Team)',
    difficulty: 'Moyenne',
    category: 'Design & Productivité',
    savedAt: Date.now() - 86400000, // Hier
    analysis: {
      score: 87,
      verdict: "Très bon potentiel de marché. Les designers et équipes produit cherchent activement des solutions pour simplifier la collecte de feedback client. Faible concurrence directe.",
      swot: {
        strengths: ["Gain de temps immédiat", "Réduction des allers-retours emails", "Interface intuitive"],
        weaknesses: ["Marché de niche", "Dépendance à Figma/Sketch pour intégrations"],
        opportunities: ["Marché design en croissance (+23% annuel)", "Extensions vers gestion projet", "Intégrations Slack/Teams"],
        threats: ["Figma/Sketch pourraient ajouter cette fonctionnalité", "Outils collaboration généralistes"]
      },
      competitors: ["Marker.io", "Userback", "Pastel", "Feedback traditionnel par email"],
      go_to_market: "Content marketing sur Medium/Dev.to, Partenariats avec influenceurs design, Publicités LinkedIn ciblées UX/UI designers, Product Hunt launch"
    },
    blueprint: {
      coreFeature: {
        name: "Annotation visuelle en temps réel",
        description: "Un système d'annotation directe sur les captures d'écran de maquettes qui permet aux clients de pointer précisément leurs retours. Système de fils de discussion par zone annotée.",
        valueProp: "Réduit les allers-retours de 75% et accélère les cycles de feedback de plusieurs jours à quelques heures."
      },
      techStack: [
        { category: "Frontend", toolName: "React 18", website: "react.dev", reason: "Interface utilisateur interactive pour l'annotation en temps réel avec Tailwind CSS." },
        { category: "Backend complet", toolName: "Supabase", website: "supabase.com", reason: "Base de données PostgreSQL + APIs automatiques + Authentification + Stockage images." },
        { category: "Canvas / Annotations", toolName: "Fabric.js", website: "fabricjs.com", reason: "Bibliothèque pour dessiner et annoter directement sur les images uploadées." },
        { category: "Paiements", toolName: "Stripe", website: "stripe.com", reason: "Gestion des abonnements récurrents et facturation multi-paliers." }
      ],
      roadmap: [
        {
            week: 1,
            phase: "Fondations & Architecture",
            tasks: [
                "Initialisation projet React 18 + Vite + Tailwind CSS",
                "Configuration Supabase : Tables 'Projects', 'Screenshots', 'Comments' avec Row Level Security",
                "Mise en place authentification (Google + Email Magic Link)",
                "Création Landing Page avec formulaire waitlist"
            ]
        },
        {
            week: 2,
            phase: "Upload & Annotation (Core)",
            tasks: [
                "Développement composant Drag & Drop pour upload d'images",
                "Intégration Fabric.js pour système d'annotation visuelle",
                "Logique de sauvegarde annotations en temps réel (Supabase Realtime)",
                "Interface Dashboard : Liste projets et screenshots"
            ]
        },
        {
            week: 3,
            phase: "Collaboration & Notifications",
            tasks: [
                "Système de commentaires par zone annotée",
                "Notifications email automatiques (nouveau commentaire)",
                "Partage de projet via lien sécurisé (invitations)",
                "Historique des modifications et versions"
            ]
        },
        {
            week: 4,
            phase: "Monétisation & Lancement",
            tasks: [
                "Intégration Stripe Checkout (3 paliers d'abonnement)",
                "Gestion Webhooks Stripe pour activation comptes",
                "Tests E2E complets (upload → annotation → partage)",
                "Déploiement Vercel et lancement Product Hunt"
            ]
        }
      ],
      successMetrics: ["50 screenshots annotés", "10 clients payants première semaine", "Taux conversion > 5%"]
    },
    kanbanBoard: {
        lastUpdated: Date.now(),
        tasks: [
            { id: 't1', content: "Initialisation projet React 18 + Vite + Tailwind", columnId: 'done', week: 1, phase: "Fondations" },
            { id: 't2', content: "Configuration Supabase : Tables principales", columnId: 'done', week: 1, phase: "Fondations" },
            { id: 't3', content: "Mise en place de l'authentification", columnId: 'in-progress', week: 1, phase: "Fondations" },
            { id: 't4', content: "Création Landing Page", columnId: 'todo', week: 1, phase: "Fondations" },
            { id: 't5', content: "Intégration Fabric.js pour annotations", columnId: 'todo', week: 2, phase: "Upload & Annotation" },
        ]
    }
  },
  {
    id: 'demo_2',
    title: 'Assistant email IA pour freelances',
    tagline: 'Rédigez vos emails professionnels en 10 secondes',
    description: 'Un SaaS qui utilise l\'IA pour générer des réponses emails professionnelles personnalisées. L\'assistant analyse le contexte, comprend le ton souhaité et rédige des emails adaptés à chaque situation (relance client, proposition commerciale, négociation).',
    targetAudience: 'Freelances, consultants, TPE/PME',
    revenueModel: 'Freemium : 100 emails/mois gratuits, puis 19€/mois (illimité)',
    difficulty: 'Faible',
    category: 'Productivité & IA',
    savedAt: Date.now() - 172800000, // Avant-hier
    analysis: {
      score: 72,
      verdict: "Bon potentiel avec un marché large. Les freelances cherchent à optimiser leur temps administratif. La concurrence existe mais le positionnement niche (freelances) peut créer la différence.",
      swot: {
        strengths: ["Gain de temps massif", "Besoin universel", "IA accessible"],
        weaknesses: ["Concurrence ChatGPT gratuit", "Marché saturé outils IA"],
        opportunities: ["Intégrations Gmail/Outlook", "Modèles métiers spécifiques", "Upsell coaching email"],
        threats: ["ChatGPT", "Jasper", "Copy.ai"]
      },
      competitors: ["ChatGPT", "Jasper", "Copy.ai", "Grammarly"],
      go_to_market: "Content marketing (blog freelance), Publicités LinkedIn, YouTube (tutoriels freelance), Partenariat plateformes freelance"
    }
  }
];
