
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  GENERATOR = 'GENERATOR',
  VALIDATOR = 'VALIDATOR',
  DAILY = 'DAILY',
  BLUEPRINT = 'BLUEPRINT',
  CHANTIER = 'CHANTIER',
  SETTINGS = 'SETTINGS',
}

export interface GeneratedIdea {
  id: string;
  title: string;
  tagline: string;
  description: string;
  targetAudience: string;
  revenueModel: string;
  difficulty: 'Faible' | 'Moyenne' | 'Élevée';
  category: string;
}

export interface MarketAnalysis {
  score: number; // 0-100
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  competitors: string[];
  go_to_market: string;
  verdict: string;
}

export interface MVPBlueprint {
  coreFeature: {
    name: string;
    description: string;
    valueProp: string;
  };
  techStack: {
    category: string;
    toolName: string;
    website: string; // Used to fetch favicon/logo
    reason: string;
  }[];
  roadmap: {
    week: number;
    phase: string;
    tasks: string[];
  }[];
  successMetrics: string[];
}

export interface KanbanTask {
  id: string;
  content: string;
  columnId: 'todo' | 'in-progress' | 'done';
  week: number;
  phase: string;
}

export interface KanbanBoard {
  lastUpdated: number;
  tasks: KanbanTask[];
}

export interface SavedIdea {
  id: string;
  title: string;
  tagline: string;
  description: string;
  targetAudience: string;
  revenueModel: string;
  difficulty: 'Faible' | 'Moyenne' | 'Élevée';
  category: string;
  savedAt: number;
  analysis?: MarketAnalysis;
  blueprint?: MVPBlueprint;
  kanbanBoard?: KanbanBoard;
}

export interface DailySource {
  title: string;
  url: string;
}

export interface DailyArticle {
  date: string;
  title: string;
  category: 'Audit Tech' | 'Opportunité' | 'Interview CEO' | 'Podcast Résumé' | 'Tendance';
  readTime: string;
  content: string; // Markdown formatted text
  summary: string;
  keyTakeaways: string[];
  sources: DailySource[];
}

export interface ChatMessage {
    role: 'user' | 'sherpa';
    content: string;
    timestamp: number;
}

// Gemini Schema Interfaces
export interface GeminiIdeaResponse {
  ideas: {
    title: string;
    tagline: string;
    description: string;
    targetAudience: string;
    revenueModel: string;
    difficulty: string;
    category: string;
  }[];
}

export interface GeminiAnalysisResponse {
  score: number;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  competitors: string[];
  go_to_market: string;
  verdict: string;
}

export interface GeminiDailyResponse {
  title: string;
  category: string;
  readTime: string;
  content: string;
  summary: string;
  keyTakeaways: string[];
  sources: { title: string; url: string }[];
}

export interface GeminiBlueprintResponse {
  coreFeature: {
    name: string;
    description: string;
    valueProp: string;
  };
  techStack: {
    category: string;
    toolName: string;
    website: string;
    reason: string;
  }[];
  roadmap: {
    week: number;
    phase: string;
    tasks: string[];
  }[];
  successMetrics: string[];
}