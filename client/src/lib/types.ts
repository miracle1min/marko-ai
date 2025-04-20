import { 
  Package, Sparkles, Zap, Video, Key, Server, 
  Newspaper, Eye, Image, Search, Bot, HelpCircle,
  MessageSquare
} from "lucide-react";

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface ToolCategory {
  name: string;
  path: string;
  icon: JSX.Element;
  bgColor: string;
}

export interface GeminiChatRequest {
  message: string;
  model: string;
  creativity: number;
  contexts: {
    seo: boolean;
    keyword: boolean;
    content: boolean;
  };
}

export interface GeminiChatResponse {
  response: string;
}

export interface ArticleGenerationRequest {
  title: string;
  language: string;
  writingStyle: string;
  wordCount: number;
  keywords: string[];
  additionalInstructions?: string;
}

export interface ArticleGenerationResponse {
  article: string;
}

export interface CodeGenerationRequest {
  language: string;
  codeType: string;
  framework: string;
  description: string;
  functionName?: string;
  parameters?: string;
  includeComments: boolean;
  includeExamples: boolean;
  includeTests: boolean;
}

export interface CodeGenerationResponse {
  code: string;
}

export interface HealthConsultationRequest {
  message: string;
  context?: {
    previousSymptoms?: string[];
    medicalHistory?: string[];
    age?: number;
    gender?: string;
  };
}

export interface HealthConsultationResponse {
  response: string;
}

export interface SymptomAnalysisRequest {
  symptoms: {[key: string]: number};
  age: string;
  gender: string;
  duration: string;
  medicalHistory: string[];
  additionalNotes?: string;
}

export interface SymptomAnalysisResponse {
  analysisText: string;
  possibleConditions: Array<{
    name: string;
    probability: number;
    description: string;
  }>;
  recommendations: string[];
}

export interface InstagramCaptionRequest {
  topic: string;
  mood: string;
  includeHashtags: boolean;
  includeEmojis: boolean;
  captionLength: "short" | "medium" | "long";
  brand?: string;
  targetAudience?: string;
  additionalInstructions?: string;
}

export interface InstagramCaptionResponse {
  caption: string;
  hashtags?: string[];
}

export interface PeopleAlsoAskRequest {
  keyword: string;
  language: string;
  includeMetrics?: boolean;
  limit?: number;
}

export interface PeopleAlsoAskResponse {
  relatedQuestions: Array<{
    question: string;
    searchVolume?: number;
    difficulty?: number;
    relevance?: number;
  }>;
  suggestedContent?: string[];
}

export interface YouTubeToTextRequest {
  videoUrl: string;
  outputFormat: "transcript" | "summary" | "article";
  language?: string;
  includeTimestamps?: boolean;
  maxLength?: number;
}

export interface YouTubeToTextResponse {
  text: string;
  title?: string;
  duration?: string;
  channel?: string;
  timestamps?: Array<{
    time: string;
    text: string;
  }>;
  keyPoints?: string[];
}

export interface CodeOptimizationRequest {
  language: string;
  code: string;
  optimizationType: string;
  additionalInstructions?: string;
  includeBenchmarks: boolean;
  includeExplanations: boolean;
}

export interface CodeOptimizationResponse {
  optimizedCode: string;
  improvements: string[];
  benchmarks?: {
    original: {
      timeComplexity: string;
      spaceComplexity: string;
      performance?: string;
    };
    optimized: {
      timeComplexity: string;
      spaceComplexity: string;
      performance?: string;
      improvement?: string;
    }
  };
  explanation?: string;
}

export interface BookSummaryRequest {
  title: string;
  author?: string;
  language: string;
  summaryLength: "short" | "medium" | "long";
  includeKeyInsights: boolean;
  includeQuotes: boolean;
}

export interface BookSummaryResponse {
  summary: string;
  keyInsights?: string[];
  quotes?: string[];
  recommendedBooks?: string[];
}

export interface SEOContentRequest {
  keyword: string;
  contentType: string;
  language: string;
  toneOfVoice: string;
  targetAudience?: string;
  contentLength: "short" | "medium" | "long";
  includeFAQs: boolean;
}

export interface SEOContentResponse {
  content: string;
  title?: string;
  metaDescription?: string;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  keywords?: string[];
}

export interface ImageGenerationRequest {
  prompt: string;
  stylePreset?: string;
  aspectRatio?: string;
  numberOfImages?: number;
}

export interface ImageGenerationResponse {
  images: string[];
  prompt: string;
}

export interface RecipeGenerationRequest {
  ingredients: string[];
  dishType?: string;
  cuisine?: string;
  dietaryRestrictions?: string[];
  cookingTime?: string;
  skillLevel?: string;
  calories?: string;
  mealType?: string;
  servings?: number;
  taste?: string[];
  occasion?: string;
  includeNutrition?: boolean;
  includeStepByStep?: boolean;
  includeVariations?: boolean;
  language?: string;
  additionalInstructions?: string;
}

export interface RecipeGenerationResponse {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  servings?: number;
  nutrition?: {
    calories?: string;
    protein?: string;
    carbs?: string;
    fat?: string;
    [key: string]: string | undefined;
  };
  tips?: string[];
  variations?: string[];
  image?: string;
}

export interface FakeChatGeneratorRequest {
  platform: string;
  messages: Array<{
    role: "user" | "contact";
    content: string;
    timestamp?: string;
    status?: "sent" | "delivered" | "read";
    username?: string;
    avatar?: string;
  }>;
  deviceType: string;
  statusBarConfig: {
    batteryPercentage: number;
    showBatteryPercentage: boolean;
    signalStrength: number;
    wifiStrength: number;
    carrierName: string;
    time: string;
  };
  backgroundColor?: string;
  timeFormat?: "12h" | "24h";
  includeAvatar?: boolean;
}

export interface FakeChatGeneratorResponse {
  imageBase64: string;
}

// Contract Generator Types
export interface ContractGenerationRequest {
  contractType: string; // employment, rental, service, nda, etc.
  details: string;
  party1: string;
  party2: string;
  additionalClauses?: string;
  specificRequirements?: string;
}

export interface ContractGenerationResponse {
  content: string;
  success: boolean;
  error?: string;
}

export interface ContractEnhancementRequest {
  contractDraft: string;
  enhancementType?: string; // clarity, compliance, protection, etc.
  jurisdiction?: string;
  industry?: string;
}

export interface ContractEnhancementResponse {
  content: string;
  success: boolean;
  error?: string;
}

export interface CodeReviewRequest {
  language: string;
  code: string;
  reviewType: string;
  additionalInstructions?: string;
  includeCodeExamples: boolean;
  includeSuggestions: boolean;
}

export interface CodeReviewResponse {
  summary: string;
  qualityScore: number;
  issues: Array<{
    type: string;
    severity: "low" | "medium" | "high" | "critical";
    description: string;
    line?: number;
    suggestion?: string;
    codeExample?: string;
  }>;
  bestPractices: string[];
  securityIssues?: Array<{
    vulnerability: string;
    severity: "low" | "medium" | "high" | "critical";
    description: string;
    remediation: string;
  }>;
  suggestions?: string[];
  overallRecommendation: string;
}

export interface JingleCreatorRequest {
  brand: string;
  purpose: string;
  mood: string;
  length: string;
  targetAudience: string;
  style: string;
  includeTagline: boolean;
  tagline?: string;
  additionalInstructions?: string;
}

export interface JingleCreatorResponse {
  jingle: string;
  variations?: string[];
  tagline?: string;
  explanation?: string;
  notes?: string;
}

export interface BusinessPlanRequest {
  businessType: string;
  industry: string;
  targetMarket: string;
  location: string;
  missionStatement?: string;
  uniqueSellingProposition?: string;
  budgetRange?: string;
  timeFrame?: string;
  teamSize?: string;
  competitiveAdvantage?: string;
  additionalContext?: string;
  planLength: "short" | "medium" | "long";
  language: "id" | "en";
  includeFinancials: boolean;
  includeMarketAnalysis: boolean;
  includeExecutiveSummary: boolean;
  includeCompetitorAnalysis: boolean;
  includeMarketingStrategy: boolean;
  includeRiskAnalysis: boolean;
}

export interface BusinessPlanResponse {
  executiveSummary?: string;
  businessDescription: string;
  missionAndVision?: string;
  marketAnalysis?: {
    overview: string;
    trends: string[];
    targetCustomers: string;
    marketSize?: string;
    growthPotential?: string;
  };
  competitorAnalysis?: {
    overview: string;
    mainCompetitors: Array<{
      name: string;
      strengths: string[];
      weaknesses: string[];
    }>;
    competitiveAdvantage: string;
  };
  marketingStrategy?: {
    overview: string;
    channels: string[];
    promotionalActivities: string[];
    pricingStrategy: string;
    salesProcess?: string;
  };
  operationsAndManagement?: {
    overview: string;
    teamStructure?: string;
    keyRoles?: string[];
    facilities?: string;
    equipment?: string;
    suppliers?: string;
  };
  financials?: {
    overview: string;
    startupCosts?: string;
    monthlyExpenses?: string;
    projectedRevenue?: string;
    breakEvenAnalysis?: string;
    fundingNeeded?: string;
  };
  riskAnalysis?: {
    overview: string;
    keyRisks: Array<{
      description: string;
      impact: "low" | "medium" | "high";
      mitigationStrategy: string;
    }>;
  };
  implementationTimeline?: {
    overview: string;
    milestones: Array<{
      phase: string;
      description: string;
      timeframe: string;
    }>;
  };
  conclusion?: string;
}

// AI Character types
export interface AiCharacter {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  avatarUrl: string;
  model: string;
  prompt: string;
  category?: string;
  tags?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AiCharacterChatRequest {
  message: string;
  previousMessages?: Message[];
}

export interface AiCharacterChatResponse {
  response: string;
}

export interface CharacterChat {
  id: number;
  characterId: number;
  userId: number;
  userMessage: string;
  characterResponse: string;
  createdAt: string;
}