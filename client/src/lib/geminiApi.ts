import { 
  GeminiChatRequest, 
  GeminiChatResponse, 
  ArticleGenerationRequest, 
  ArticleGenerationResponse,
  CodeGenerationRequest,
  CodeGenerationResponse,
  CodeOptimizationRequest,
  CodeOptimizationResponse,
  HealthConsultationRequest,
  HealthConsultationResponse,
  SymptomAnalysisRequest,
  SymptomAnalysisResponse,
  InstagramCaptionRequest,
  InstagramCaptionResponse,
  PeopleAlsoAskRequest,
  PeopleAlsoAskResponse,
  YouTubeToTextRequest,
  YouTubeToTextResponse,
  BookSummaryRequest,
  BookSummaryResponse,
  SEOContentRequest,
  SEOContentResponse,
  ImageGenerationRequest,
  ImageGenerationResponse,
  RecipeGenerationRequest,
  RecipeGenerationResponse,
  FakeChatGeneratorRequest,
  FakeChatGeneratorResponse,
  ContractGenerationRequest,
  ContractGenerationResponse,
  ContractEnhancementRequest,
  ContractEnhancementResponse
} from "./types";
import { apiRequest } from "./queryClient";

export async function sendChatMessage(request: GeminiChatRequest): Promise<GeminiChatResponse> {
  const response = await apiRequest("/api/gemini/chat", {
    method: "POST",
    data: request
  });
  return response;
}

export async function generateArticle(request: ArticleGenerationRequest): Promise<ArticleGenerationResponse> {
  const response = await apiRequest("/api/gemini/generate-article", {
    method: "POST",
    data: request
  });
  return response;
}

export async function generateCode(request: CodeGenerationRequest): Promise<CodeGenerationResponse> {
  const response = await apiRequest("/api/gemini/generate-code", {
    method: "POST",
    data: request
  });
  return response;
}

export async function healthConsultation(request: HealthConsultationRequest): Promise<HealthConsultationResponse> {
  const response = await apiRequest("/api/gemini/health-consultation", {
    method: "POST",
    data: request
  });
  return response;
}

export async function analyzeSymptoms(request: SymptomAnalysisRequest): Promise<SymptomAnalysisResponse> {
  const response = await apiRequest("/api/gemini/analyze-symptoms", {
    method: "POST",
    data: request
  });
  return response;
}

export async function generateInstagramCaption(request: InstagramCaptionRequest): Promise<InstagramCaptionResponse> {
  const response = await apiRequest("/api/gemini/instagram-caption", {
    method: "POST",
    data: request
  });
  return response;
}

export async function getPeopleAlsoAskQuestions(request: PeopleAlsoAskRequest): Promise<PeopleAlsoAskResponse> {
  const response = await apiRequest("/api/gemini/people-also-ask", {
    method: "POST",
    data: request
  });
  return response;
}

export async function youtubeToText(request: YouTubeToTextRequest): Promise<YouTubeToTextResponse> {
  const response = await apiRequest("/api/gemini/youtube-to-text", {
    method: "POST",
    data: request
  });
  return response;
}

export async function optimizeCode(request: CodeOptimizationRequest): Promise<CodeOptimizationResponse> {
  const response = await apiRequest("/api/gemini/optimize-code", {
    method: "POST",
    data: request
  });
  return response;
}

export async function generateBookSummary(request: BookSummaryRequest): Promise<BookSummaryResponse> {
  const response = await apiRequest("/api/gemini/book-summary", {
    method: "POST",
    data: request
  });
  return response;
}

export async function optimizeSEOContent(request: SEOContentRequest): Promise<SEOContentResponse> {
  const response = await apiRequest("/api/gemini/seo-optimizer", {
    method: "POST",
    data: request
  });
  return response;
}

export async function generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
  const response = await apiRequest("/api/gemini/generate-image", {
    method: "POST",
    data: request
  });
  return response;
}

export async function generateRecipe(request: RecipeGenerationRequest): Promise<RecipeGenerationResponse> {
  const response = await apiRequest("/api/gemini/generate-recipe", {
    method: "POST",
    data: request
  });
  return response;
}

export async function generateFakeChat(request: FakeChatGeneratorRequest): Promise<FakeChatGeneratorResponse> {
  const response = await apiRequest("/api/fake-chat-generator", {
    method: "POST",
    data: request
  });
  return response;
}

export async function generateContract(request: ContractGenerationRequest): Promise<ContractGenerationResponse> {
  const response = await apiRequest("/api/gemini/generate-contract", {
    method: "POST",
    data: request
  });
  return response;
}

export async function enhanceContract(request: ContractEnhancementRequest): Promise<ContractEnhancementResponse> {
  const response = await apiRequest("/api/gemini/enhance-contract", {
    method: "POST",
    data: request
  });
  return response;
}

/**
 * Generate contract or agreement using Google Gemini AI (legacy implementation)
 * @param contractType Type of contract to generate (e.g., employment, rental, nda)
 * @param details Key details about the contract
 * @param party1 Name and details of the first party
 * @param party2 Name and details of the second party
 * @param additionalClauses Any additional clauses to include
 * @param specificRequirements Specific requirements or custom elements
 * @returns Generated contract text
 */
export async function generateContractWithAI(
  contractType: string,
  details: string,
  party1: string,
  party2: string,
  additionalClauses?: string,
  specificRequirements?: string
): Promise<string> {
  try {
    const prompt = `
      Buatkan kontrak profesional jenis ${contractType} dengan rincian berikut:
      
      Detail Kontrak: ${details}
      Pihak Pertama: ${party1}
      Pihak Kedua: ${party2}
      ${additionalClauses ? `Klausa Tambahan: ${additionalClauses}` : ''}
      ${specificRequirements ? `Persyaratan Khusus: ${specificRequirements}` : ''}
      
      Kontrak harus dalam Bahasa Indonesia dan mengikuti format hukum standar.
      Sertakan semua bagian yang diperlukan seperti pihak-pihak, ketentuan, kewajiban, kondisi pengakhiran, dan tanda tangan.
      Pastikan kontrak secara hukum adalah tepat dan mengikuti praktik umum untuk kontrak ${contractType}.
    `;

    const response = await apiRequest("/api/gemini/generate-content", {
      method: "POST",
      data: {
        prompt,
        temperature: 0.3,
        maxTokens: 2000,
      }
    });
    
    return response.content || "Maaf, tidak dapat menghasilkan kontrak saat ini.";
  } catch (error: any) {
    console.error('Error generating contract:', error.message);
    throw error;
  }
}

/**
 * Enhance a contract draft with specific legal improvements using Google Gemini AI
 * @param contractDraft The original contract draft text
 * @param enhancementType Type of enhancement needed (e.g., clarity, compliance, protection)
 * @param jurisdiction Jurisdiction for legal compliance
 * @param industry Industry context for specific terms
 * @returns Enhanced contract text
 */
export async function enhanceContractWithAI(
  contractDraft: string,
  enhancementType: string = "general",
  jurisdiction: string = "indonesia",
  industry?: string
): Promise<string> {
  try {
    const prompt = `
      Tingkatkan draft kontrak berikut dengan fokus pada perbaikan ${enhancementType}:
      
      ${contractDraft}
      
      Yurisdiksi: ${jurisdiction}
      ${industry ? `Konteks Industri: ${industry}` : ''}
      
      Harap tingkatkan kontrak ini dengan:
      1. Memperjelas bahasa yang ambigu
      2. Menambahkan perlindungan hukum yang diperlukan
      3. Memastikan kepatuhan dengan hukum ${jurisdiction}
      4. Mempertahankan struktur asli sambil meningkatkan konten
      
      Kembalikan teks kontrak yang telah ditingkatkan secara lengkap.
    `;

    const response = await apiRequest("/api/gemini/generate-content", {
      method: "POST",
      data: {
        prompt,
        temperature: 0.2,
        maxTokens: 2000,
      }
    });
    
    return response.content || "Maaf, tidak dapat meningkatkan kontrak saat ini.";
  } catch (error: any) {
    console.error('Error enhancing contract:', error.message);
    throw error;
  }
}
