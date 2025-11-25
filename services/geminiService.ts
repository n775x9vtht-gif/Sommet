
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeminiIdeaResponse, GeminiAnalysisResponse, GeminiDailyResponse, GeminiBlueprintResponse, ChatMessage } from "../types";

// Safe environment variable access to prevent "undefined is not an object" crash
// @ts-ignore
const metaEnv = typeof import.meta !== 'undefined' ? import.meta.env || {} : {};
// @ts-ignore
const processEnv = typeof process !== 'undefined' ? process.env || {} : {};

// Try all possible sources for the API Key
const apiKey = metaEnv.VITE_GEMINI_API_KEY || metaEnv.API_KEY || processEnv.VITE_GEMINI_API_KEY || processEnv.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: apiKey });

const ideaSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    ideas: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          tagline: { type: Type.STRING },
          description: { type: Type.STRING },
          targetAudience: { type: Type.STRING },
          revenueModel: { type: Type.STRING },
          difficulty: { type: Type.STRING, enum: ["Faible", "Moyenne", "Élevée"] },
          category: { type: Type.STRING }
        },
        required: ["title", "tagline", "description", "targetAudience", "revenueModel", "difficulty", "category"]
      }
    }
  }
};

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.INTEGER, description: "Score de viabilité de 0 à 100" },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
    opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
    threats: { type: Type.ARRAY, items: { type: Type.STRING } },
    competitors: { type: Type.ARRAY, items: { type: Type.STRING } },
    go_to_market: { type: Type.STRING, description: "Stratégie de lancement concise" },
    verdict: { type: Type.STRING, description: "Un résumé final encourageant ou prudent" }
  },
  required: ["score", "strengths", "weaknesses", "opportunities", "threats", "competitors", "go_to_market", "verdict"]
};

const blueprintSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    coreFeature: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "Nom catchy de la fonctionnalité principale unique" },
        description: { type: Type.STRING, description: "Description technique mais claire" },
        valueProp: { type: Type.STRING, description: "Pourquoi c'est indispensable pour le MVP" }
      },
      required: ["name", "description", "valueProp"]
    },
    techStack: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: "Ex: Frontend, Database, Auth, Payment" },
          toolName: { type: Type.STRING },
          website: { type: Type.STRING, description: "Domain name only, e.g., 'supabase.com' or 'stripe.com'" },
          reason: { type: Type.STRING, description: "Pourquoi cet outil précisément" }
        },
        required: ["category", "toolName", "website", "reason"]
      }
    },
    roadmap: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          week: { type: Type.INTEGER },
          phase: { type: Type.STRING, description: "Nom de la phase, ex: 'Fondations'" },
          tasks: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["week", "phase", "tasks"]
      }
    },
    successMetrics: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["coreFeature", "techStack", "roadmap", "successMetrics"]
};

// NOTE: We do not use dailyArticleSchema in the config anymore because 'googleSearch' tool is incompatible with 'responseSchema'.
// Instead, we prompt the model to output JSON text and parse it manually.

export const generateIdeas = async (
  keywords: string,
  domain: string
): Promise<GeminiIdeaResponse> => {
  try {
    const prompt = `
      Génère 4 idées de Micro-SaaS ou de produits numériques innovants.
      Domaine d'intérêt : ${domain}
      Mots-clés ou compétences : ${keywords}
      
      Les idées doivent être réalistes pour un développeur indépendant ou une petite équipe.
      Le résultat doit être en Français.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: ideaSchema,
        temperature: 0.8,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Pas de réponse de l'IA");
    
    return JSON.parse(text) as GeminiIdeaResponse;
  } catch (error) {
    console.error("Erreur Gemini Generator:", error);
    throw error;
  }
};

export const analyzeIdea = async (ideaDescription: string): Promise<GeminiAnalysisResponse> => {
  try {
    const prompt = `
      Agis comme un expert en Business Analyst et Product Manager.
      Analyse cette idée de startup SaaS : "${ideaDescription}"
      
      Fournis une analyse SWOT, une liste de concurrents potentiels (génériques ou spécifiques), 
      une note de viabilité sur 100, et une stratégie de Go-To-Market.
      Réponds uniquement en Français.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.6,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Pas de réponse de l'IA");

    return JSON.parse(text) as GeminiAnalysisResponse;
  } catch (error) {
    console.error("Erreur Gemini Analyzer:", error);
    throw error;
  }
};

export const generateDailyBriefing = async (): Promise<GeminiDailyResponse> => {
  try {
    const prompt = `
      Tu es un journaliste tech senior pour "Sommet Daily" (Style The New York Times).
      
      TA MISSION :
      Utilise Google Search pour trouver une véritable tendance, une nouvelle technologie ou une opportunité business émergente (SaaS, IA, NoCode) datant de moins de 48h.
      Choisis le sujet le plus pertinent pour des entrepreneurs.

      Rédige un article de fond (environ 800 mots) sur ce sujet réel.

      RÈGLES DE FORMAT DE SORTIE (TRES IMPORTANT) :
      Tu ne peux PAS utiliser de schema JSON car tu utilises l'outil de recherche.
      Tu dois donc répondre avec un BLOC DE CODE JSON valide.
      
      Format attendu :
      \`\`\`json
      {
        "title": "Titre percutant style presse",
        "category": "Une catégorie parmi: Audit Tech, Opportunité, Interview CEO, Podcast Résumé, Tendance",
        "readTime": "Ex: 5 min",
        "summary": "Accroche de 2 phrases pour la page d'accueil.",
        "content": "Le contenu de l'article en format Markdown...",
        "keyTakeaways": ["Point 1", "Point 2", "Point 3"]
      }
      \`\`\`

      RÈGLES RÉDACTIONNELLES POUR LE CHAMP 'content' :
      1. INTERDICTION d'utiliser des listes à puces (* ou -) dans le corps du texte. Prose uniquement.
      2. Pas de gras (**) inutile.
      3. Utilise ## pour les intertitres.
      4. Ton sophistiqué, données chiffrées réelles issues de la recherche.
      5. Langue : Français.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        // We enable Google Search
        tools: [{ googleSearch: {} }],
        // We CANNOT use responseMimeType or responseSchema with tools
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Pas de réponse de l'IA");

    // Extract JSON from the text response (since we couldn't use Schema mode)
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
    let parsedData: any = {};
    
    if (jsonMatch && jsonMatch[1]) {
      parsedData = JSON.parse(jsonMatch[1]);
    } else {
      // Fallback if no code blocks, try parsing the whole text
      try {
        parsedData = JSON.parse(text);
      } catch (e) {
        // If parsing fails, construct a basic object from text
        parsedData = {
            title: "Analyse du Marché Tech",
            category: "Tendance",
            readTime: "3 min",
            summary: "Analyse des dernières données disponibles.",
            content: text, // Use the raw text as content
            keyTakeaways: ["Analyse en temps réel", "Données Google Search", "Opportunité à saisir"]
        };
      }
    }

    // EXTRACT REAL SOURCES from Grounding Metadata
    const sources: { title: string; url: string }[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          // Avoid duplicates
          if (!sources.some(s => s.url === chunk.web.uri)) {
            sources.push({
              title: chunk.web.title,
              url: chunk.web.uri
            });
          }
        }
      });
    }

    // Add the real sources to the parsed data
    parsedData.sources = sources;

    return parsedData as GeminiDailyResponse;

  } catch (error) {
    console.error("Erreur Gemini Daily:", error);
    throw error;
  }
};

export const generateMVPBlueprint = async (ideaContext: string): Promise<GeminiBlueprintResponse> => {
  try {
    const prompt = `
      Agis comme un CTO expert et un Product Manager senior.
      Ton but est de créer un PLAN D'ACTION MVP (Minimum Viable Product) radical pour cette idée :
      "${ideaContext}"

      Philosophie : "Moins mais Mieux". Coupe tout ce qui n'est pas essentiel.
      
      1. Définis LA fonctionnalité unique (Killer Feature) qui doit marcher parfaitement.
      2. Suggère une Stack Technique précise (No-Code ou Code selon la complexité). Pour chaque outil, donne le nom de domaine (ex: 'bubble.io', 'supabase.com') pour que je puisse récupérer le logo.
      3. Crée une Roadmap de 4 semaines (Semaine 1 à 4) avec des tâches concrètes.
      4. Liste 3 métriques de succès (KPIs).

      Réponds en JSON strict. Langue: Français.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: blueprintSchema,
        temperature: 0.5,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Pas de réponse de l'IA");

    return JSON.parse(text) as GeminiBlueprintResponse;
  } catch (error) {
    console.error("Erreur Gemini Blueprint:", error);
    throw error;
  }
};

export const askSherpa = async (task: string, projectContext: string): Promise<string> => {
    try {
      const prompt = `
        Tu es "Le Sherpa", un assistant technique expert pour développeurs et entrepreneurs (CTO Senior).
        
        CONTEXTE DU PROJET :
        ${projectContext}
        
        TÂCHE BLOQUANTE DE L'UTILISATEUR :
        "${task}"
        
        MISSION :
        Fournis une solution concrète, technique et immédiate pour réaliser cette tâche.
        
        RÈGLES DE RÉPONSE :
        1. Si la tâche nécessite du code, fournis le code exact (Snippet).
        2. Si la tâche est une configuration, donne les étapes pas à pas.
        3. Si la tâche est stratégique, donne 3 points clés.
        4. Sois concis, encourageant et direct. Utilise le format Markdown.
        5. IMPORTANT : Utilise la syntaxe ### pour les titres. N'utilise PAS de gras (**Titre**) pour les titres.
        6. Langue : Français.
      `;
  
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          temperature: 0.4,
        },
      });
  
      const text = response.text;
      if (!text) throw new Error("Pas de réponse du Sherpa");
  
      return text;
    } catch (error) {
      console.error("Erreur Sherpa:", error);
      throw error;
    }
  };

export const continueSherpaConversation = async (
    history: ChatMessage[], 
    newMessage: string, 
    projectContext: string
): Promise<string> => {
    try {
        // Construct conversation history for context
        let conversationHistory = history.map(msg => 
            `${msg.role === 'user' ? 'Utilisateur' : 'Le Sherpa'}: ${msg.content}`
        ).join('\n');

        const prompt = `
          Tu es "Le Sherpa", un assistant technique expert (CTO Senior).
          
          CONTEXTE DU PROJET :
          ${projectContext}
          
          HISTORIQUE DE LA CONVERSATION :
          ${conversationHistory}
          
          NOUVELLE QUESTION DE L'UTILISATEUR :
          "${newMessage}"
          
          Réponds directement à l'utilisateur de manière concise et technique.
          IMPORTANT : Utilise la syntaxe ### pour les titres. N'utilise PAS de gras (**Titre**) pour les titres.
          Langue : Français. Format : Markdown.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.4,
            },
        });

        const text = response.text;
        if (!text) throw new Error("Pas de réponse du Sherpa");

        return text;
    } catch (error) {
        console.error("Erreur Sherpa Chat:", error);
        throw error;
    }
};
