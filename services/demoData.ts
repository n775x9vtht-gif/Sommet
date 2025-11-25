
import { SavedIdea } from '../types';

export const DEMO_DATA: SavedIdea[] = [
  {
    id: 'demo_1',
    title: 'ProprioZen AI',
    tagline: 'Automatisez la gestion locative pour les particuliers.',
    description: 'Une plateforme SaaS qui aide les propriétaires bailleurs indépendants à gérer leurs biens sans agence. Elle utilise l\'IA pour scanner les dossiers locataires, vérifier la solvabilité via OpenBanking, générer les baux automatiquement et gérer les relances de paiement.',
    targetAudience: 'Propriétaires bailleurs gérant 1 à 10 biens en direct.',
    revenueModel: 'Abonnement mensuel (9€/bien) + Frais sur encaissement loyers (optionnel).',
    difficulty: 'Moyenne',
    category: 'Immobilier',
    savedAt: Date.now() - 86400000, // Hier
    analysis: {
      score: 94,
      verdict: "Excellente opportunité de niche. La douleur (gestion administrative) est forte et la cible est prête à payer pour gagner du temps.",
      swot: {
        strengths: ["Automatisation complète", "UX supérieure aux syndics pros", "Coût réduit"],
        weaknesses: ["Dépendance aux API bancaires", "Confiance nécessaire (données sensibles)"],
        opportunities: ["Marché de l'immobilier locatif en croissance", "Partenariats assurances impayés"],
        threats: ["Agences immobilières en ligne", "Évolution législation"]
      },
      competitors: ["Rentila", "GestionLocative", "Agences classiques"],
      go_to_market: "SEO sur 'gestion locative gratuite', Publicités Facebook ciblées propriétaires, Partenariats avec blogs immo."
    },
    blueprint: {
      coreFeature: {
        name: "Le 'Bail-Express' IA",
        description: "Un générateur de contrat de location intelligent qui se remplit tout seul en scannant la pièce d'identité et les fiches de paie du locataire. Vérification anti-fraude incluse.",
        valueProp: "Réduit le temps de création du dossier de 2 heures à 5 minutes. Sécurise le propriétaire contre les faux dossiers."
      },
      techStack: [
        { category: "Frontend", toolName: "Next.js", website: "nextjs.org", reason: "Framework React performant pour le SEO et la réactivité du dashboard." },
        { category: "Database", toolName: "Supabase", website: "supabase.com", reason: "PostgreSQL géré avec authentification et stockage fichiers intégrés." },
        { category: "AI / OCR", toolName: "Mindee", website: "mindee.com", reason: "API spécialisée dans l'extraction de données de documents officiels (CNI, Bulletins)." },
        { category: "Paiement", toolName: "Stripe", website: "stripe.com", reason: "Gestion robuste des abonnements récurrents et facturation." }
      ],
      roadmap: [
        { 
            week: 1, 
            phase: "Fondations & Architecture", 
            tasks: [
                "Initialisation projet Next.js 14 + Tailwind CSS + Shadcn/ui pour les composants.",
                "Configuration Supabase : Tables 'Owners', 'Properties', 'Tenants' et Row Level Security (RLS).",
                "Mise en place de l'authentification (Magic Link & Google Auth).",
                "Création de la Landing Page statique avec formulaire de capture d'emails (Waitlist)."
            ] 
        },
        { 
            week: 2, 
            phase: "Le Moteur d'Analyse (Core)", 
            tasks: [
                "Intégration de l'API Mindee pour le parsing des PDFs (CNI, Fiches de paie).",
                "Développement du composant 'Drag & Drop' sécurisé pour l'upload des pièces justificatives.",
                "Logique Backend : Algorithme de vérification de cohérence (Revenu vs Loyer).",
                "Création de la vue Dashboard : Liste des biens et statut des candidats."
            ] 
        },
        { 
            week: 3, 
            phase: "Génération de Contrat", 
            tasks: [
                "Intégration d'une librairie de génération PDF (ex: react-pdf) côté serveur.",
                "Création du template juridique de bail meublé/nu conforme loi ALUR.",
                "Injection dynamique des données extraites par l'IA dans le template.",
                "Système d'envoi automatique par email du bail généré au locataire."
            ] 
        },
        { 
            week: 4, 
            phase: "Monétisation & Lancement", 
            tasks: [
                "Intégration Stripe Checkout : Création des produits (Abonnement Mensuel).",
                "Gestion des Webhooks Stripe pour activer/désactiver l'accès Premium.",
                "Tests E2E complets (création compte -> upload -> génération bail).",
                "Déploiement sur Vercel et lancement sur Product Hunt."
            ] 
        }
      ],
      successMetrics: ["10 Baux générés sans erreur", "5 Abonnés payants la première semaine", "Taux de conversion Landing > 5%"]
    },
    kanbanBoard: {
        lastUpdated: Date.now(),
        tasks: [
            { id: 't1', content: "Initialisation projet Next.js 14 + Tailwind CSS + Shadcn/ui", columnId: 'done', week: 1, phase: "Fondations" },
            { id: 't2', content: "Configuration Supabase : Tables 'Owners', 'Properties', 'Tenants'", columnId: 'done', week: 1, phase: "Fondations" },
            { id: 't3', content: "Mise en place de l'authentification (Magic Link)", columnId: 'in-progress', week: 1, phase: "Fondations" },
            { id: 't4', content: "Création de la Landing Page statique", columnId: 'todo', week: 1, phase: "Fondations" },
            { id: 't5', content: "Intégration API Mindee pour parsing PDF", columnId: 'todo', week: 2, phase: "Le Moteur d'Analyse" },
        ]
    }
  },
  {
    id: 'demo_2',
    title: 'FitNiche : Calisthenics Pro',
    tagline: 'La progression gamifiée pour le Street Workout.',
    description: 'Une application mobile dédiée exclusivement à la Callisthénie (Street Workout). Contrairement aux apps de fitness généralistes, elle propose des programmes de progression basés sur des compétences spécifiques (ex: réussir le Muscle-up, le Human Flag) avec un système de niveaux RPG.',
    targetAudience: 'Jeunes hommes 16-35 ans, pratiquants urbains.',
    revenueModel: 'Freemium (Contenu base gratuit, Programmes avancés payants).',
    difficulty: 'Faible',
    category: 'Fitness',
    savedAt: Date.now() - 172800000, // Avant-hier
    analysis: {
      score: 82,
      verdict: "Très bon potentiel viral. La communauté Calisthenics est passionnée et mal servie par les apps généralistes.",
      swot: {
        strengths: ["Niche très engagée", "Approche gamification unique", "Contenu visuel fort"],
        weaknesses: ["Monétisation difficile sur cible jeune", "Concurrence YouTube gratuit"],
        opportunities: ["Vente de matériel (élastiques, barres)", "Influenceurs partenaires"],
        threats: ["Freeletics", "Thenx"]
      },
      competitors: ["Thenx", "Madbarz", "Freeletics"],
      go_to_market: "TikTok & Instagram Reels montrant des transformations 'Avant/Après' des figures. Challenge 30 jours Muscle-up."
    },
    blueprint: {
      coreFeature: {
        name: "L'Arbre de Compétences (Skill Tree)",
        description: "Une visualisation interactive type jeu vidéo (RPG) où chaque figure débloquée (ex: Pull-up) ouvre l'accès à la suivante (ex: Muscle-up).",
        valueProp: "Rend la progression addictive et visuelle. L'utilisateur veut 'compléter' son arbre comme dans un jeu, augmentant la rétention."
      },
      techStack: [
        { category: "Mobile App", toolName: "React Native", website: "reactnative.dev", reason: "Permet de déployer sur iOS et Android avec une seule base de code JavaScript." },
        { category: "Backend", toolName: "Firebase", website: "firebase.google.com", reason: "Infrastructure serverless parfaite pour le temps réel, l'auth sociale et les notifications push." },
        { category: "Animations", toolName: "Rive", website: "rive.app", reason: "Pour créer des animations d'interface fluides et légères (l'arbre de compétences)." },
        { category: "Achats In-App", toolName: "RevenueCat", website: "revenuecat.com", reason: "Simplifie drastiquement la gestion des abonnements stores (Apple/Google)." }
      ],
      roadmap: [
        { 
            week: 1, 
            phase: "Structure Mobile & Data", 
            tasks: [
                "Initialisation Expo (React Native) avec TypeScript.",
                "Configuration Firebase : Auth (Google/Apple) et Firestore (Users, Progress).",
                "Modélisation de la donnée 'Skill' (prérequis, difficulté, vidéo tuto).",
                "Mise en place de la navigation (React Navigation) : Home, Tree, Profile."
            ] 
        },
        { 
            week: 2, 
            phase: "L'Arbre RPG (UI/UX)", 
            tasks: [
                "Développement du composant 'SkillTree' interactif (SVG ou Canvas).",
                "Logique de déblocage : Si parent validé -> enfant accessible.",
                "Intégration des animations Rive pour le feedback visuel (Succès !).",
                "Écran de détail d'une figure : Intégration player vidéo optimisé."
            ] 
        },
        { 
            week: 3, 
            phase: "Progression & Social", 
            tasks: [
                "Système de validation : L'utilisateur coche ses répétitions (Workout Log).",
                "Calcul automatique de l'XP et des niveaux (Level 1 -> Level 50).",
                "Page Profil avec statistiques et badges débloqués.",
                "Stockage local (AsyncStorage) pour fonctionnement hors-ligne partiel."
            ] 
        },
        { 
            week: 4, 
            phase: "Monétisation & Store", 
            tasks: [
                "Intégration SDK RevenueCat pour gérer le plan 'Pro' (Programmes avancés).",
                "Création de l'écran Paywall (Design persuasif).",
                "Beta test interne via TestFlight (iOS) et Google Play Console.",
                "Création des screenshots stores et rédaction ASO (App Store Optimization)."
            ] 
        }
      ],
      successMetrics: ["100 Utilisateurs Actifs Quotidiens (DAU)", "Retention J+7 > 40%", "50 avis 5 étoiles le premier mois"]
    },
    kanbanBoard: {
        lastUpdated: Date.now(),
        tasks: [
            { id: 'tk1', content: "Initialisation Expo (React Native)", columnId: 'done', week: 1, phase: "Structure" },
            { id: 'tk2', content: "Configuration Firebase Auth", columnId: 'in-progress', week: 1, phase: "Structure" },
            { id: 'tk3', content: "Modélisation donnée 'Skill'", columnId: 'todo', week: 1, phase: "Structure" },
        ]
    }
  }
];
