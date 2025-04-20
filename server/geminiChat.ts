import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Store the API key directly here as requested
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables");
  throw new Error("Gemini API key is not configured");
}

/**
 * Generate a chat completion using the latest Gemini model
 */
export async function geminiChatCompletionV2(
  message: string,
  temperature: number = 0.7,
  contexts: { seo: boolean; keyword: boolean; content: boolean } = { seo: false, keyword: false, content: true }
): Promise<string> {
  try {
    // Initialize the API with the API key
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Use the most reliable model that we know works
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro",
      generationConfig: {
        temperature: temperature,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    });
    
    // Build context instructions based on selected contexts
    let contextInstructions = "Anda adalah Marko AI, asisten AI yang membantu pengguna dengan optimasi website dan konten digital. ";
    
    if (contexts.seo) {
      contextInstructions += "Fokus pada memberikan saran SEO yang efektif dan teknik optimasi on-page. ";
    }
    
    if (contexts.keyword) {
      contextInstructions += "Bantu dengan penelitian dan analisis kata kunci yang komprehensif. ";
    }
    
    if (contexts.content) {
      contextInstructions += "Buat konten berkualitas tinggi yang ramah dan dioptimasi untuk mesin pencari. ";
    }
    
    contextInstructions += "Berikan jawaban dalam Bahasa Indonesia yang jelas dan mudah dipahami.";

    // Get a chat session
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Siapa kamu?" }],
        },
        {
          role: "model",
          parts: [{ text: "Saya adalah Marko AI, asisten yang akan membantu Anda dengan pertanyaan dan kebutuhan seputar konten digital, optimasi website, dan teknologi internet." }],
        },
      ],
    });

    // Use this more reliable approach with known library
    const result = await chat.sendMessage(`${contextInstructions}\n\nPesan pengguna: ${message}`);
    const response = result.response;
    return response.text();
  } catch (error: any) {
    console.error("Error generating content with Gemini API:", error);
    throw new Error(`Failed to generate content: ${error.message}`);
  }
}