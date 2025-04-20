import { Message, AiCharacter } from "../client/src/lib/types";
import axios from "axios";

// Initialize Mistral client
export function initMistralClient() {
  if (!process.env.MISTRAL_API_KEY) {
    console.error("MISTRAL_API_KEY is not set in environment variables");
    return;
  }
  
  console.log("Mistral API client telah diinisialisasi");
}

/**
 * Generate a response from Mistral AI for the AI character
 * @param userMessage - The message from the user
 * @param character - The AI character information
 * @param previousMessages - Previous messages in the conversation
 * @returns The generated response
 */
export async function mistralChatCompletion(
  userMessage: string,
  character: AiCharacter,
  previousMessages: Message[] = []
): Promise<string> {
  try {
    if (!process.env.MISTRAL_API_KEY) {
      throw new Error("MISTRAL_API_KEY is not set in environment variables");
    }

    if (!userMessage) {
      throw new Error("User message is required");
    }

    // Format previous messages for the Mistral API
    const formattedPreviousMessages = previousMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Create a system message with the character's prompt
    const systemMessage = {
      role: "system",
      content: buildCharacterSystemPrompt(character)
    };

    // Create the current user message
    const currentUserMessage = {
      role: "user",
      content: userMessage
    };

    // Combine all messages for the API request
    const messages = [
      systemMessage,
      ...formattedPreviousMessages,
      currentUserMessage
    ];

    // Determine the correct Mistral model to use based on the character's "branded" model
    // We'll map various AI model names to appropriate Mistral models
    let modelToUse = "mistral-small-latest"; // Default fallback model
    
    // Map characters to Mistral models based on their "brand name"
    if (character.name.includes("GPT-4") || character.name.includes("Claude") || 
        (character.model && (character.model.includes("gpt-4") || character.model.includes("claude")))) {
      // For top-tier models like GPT-4 or Claude, use Mistral's top model
      modelToUse = "mistral-large-latest";
    } 
    else if (character.name.includes("Gemini") || character.name.includes("Llama-3") ||
             (character.model && (character.model.includes("gemini") || character.model.includes("llama-3")))) {
      // For high-capability models, use Mistral's high-end model
      modelToUse = "mistral-medium-latest";
    }
    else if (character.name.includes("GPT-3.5") || 
             (character.model && character.model.includes("gpt-3.5"))) {
      // For medium capability models
      modelToUse = "mistral-small-latest";
    }
    // If it's a native Mistral model, use it as specified
    else if (character.name.includes("Mistral") && character.model && 
            character.model.includes("mistral")) {
      modelToUse = character.model;
    }
    
    console.log(`Using Mistral model: ${modelToUse} for character "${character.name}" (presented as: ${character.name})`);

    // Make the API request with axios
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: modelToUse,
        messages: messages,
        max_tokens: 1024,
        temperature: 0.7, // A balance between creativity and accuracy
        top_p: 0.9, // Set to allow some variation while keeping responses focused
        safe_prompt: true, // Enable safety filters
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
        }
      }
    );

    // Extract the generated text from the response
    const generatedText = response.data.choices[0]?.message?.content || 
      "Maaf, saya tidak dapat memproses pertanyaan Anda saat ini. Silakan coba lagi.";
    
    return generatedText;
  } catch (error) {
    console.error("Error in Mistral chat completion:", JSON.stringify(error, null, 2));
    // Return a more helpful error message to the user
    return "Maaf, terjadi kesalahan saat berkomunikasi dengan AI. Sistem sedang mengalami gangguan. Silakan coba lagi nanti.";
  }
}

/**
 * Build the system prompt for the AI character
 * @param character - The AI character information
 * @returns The system prompt for the character
 */
function buildCharacterSystemPrompt(character: AiCharacter): string {
  // Start with the character's original prompt
  let systemPrompt = character.prompt;
  
  // Add model-specific personality traits and instructions
  if (character.name.includes("GPT-4") || character.name.includes("OpenAI")) {
    systemPrompt += `\n\nKarakteristik penting:
1. Anda adalah ${character.name}, model AI canggih dari OpenAI.
2. Ketika ditanya tentang model bahasa yang Anda gunakan, katakan dengan jelas bahwa Anda adalah ${character.name} dari OpenAI.
3. Jika ditanya tentang kapabilitas, jelaskan kapabilitas sesuai dengan model OpenAI yang Anda presentasikan.
4. Anda memiliki gaya penjelasan yang terstruktur, komprehensif, dan informatif.
5. Anda memiliki pengetahuan umum yang luas dan dapat membahas berbagai topik secara mendalam.
6. Anda cenderung memberikan jawaban yang rinci namun tetap mudah dipahami.`;
  }
  else if (character.name.includes("Claude") || character.name.includes("Anthropic")) {
    systemPrompt += `\n\nKarakteristik penting:
1. Anda adalah ${character.name}, model AI canggih dari Anthropic.
2. Ketika ditanya tentang model bahasa yang Anda gunakan, katakan dengan jelas bahwa Anda adalah ${character.name} dari Anthropic.
3. Jika ditanya tentang kapabilitas, jelaskan kapabilitas sesuai dengan model Claude yang Anda presentasikan.
4. Anda memiliki gaya komunikasi yang lebih reflektif, nuansa, dan conversational.
5. Anda menekankan keamanan dan etika dalam tanggapan.
6. Anda sangat pandai membantu dengan tugas penulisan dan analisis.`;
  }
  else if (character.name.includes("Gemini") || character.name.includes("Google")) {
    systemPrompt += `\n\nKarakteristik penting:
1. Anda adalah ${character.name}, model AI canggih dari Google.
2. Ketika ditanya tentang model bahasa yang Anda gunakan, katakan dengan jelas bahwa Anda adalah ${character.name} dari Google.
3. Jika ditanya tentang kapabilitas, jelaskan kapabilitas sesuai dengan model Google Gemini yang Anda presentasikan.
4. Anda memiliki akses ke banyak informasi dan dapat memahami berbagai format konten.
5. Anda fokus pada keakuratan informasi dan jawaban faktual.
6. Anda dapat membantu pengguna dengan pertanyaan kompleks dan mendukung berbagai bahasa dengan baik.`;
  }
  else if (character.name.includes("Llama") || character.name.includes("Meta")) {
    systemPrompt += `\n\nKarakteristik penting:
1. Anda adalah ${character.name}, model AI canggih dari Meta.
2. Ketika ditanya tentang model bahasa yang Anda gunakan, katakan dengan jelas bahwa Anda adalah ${character.name} dari Meta.
3. Jika ditanya tentang kapabilitas, jelaskan kapabilitas sesuai dengan model Llama yang Anda presentasikan.
4. Anda merupakan model open source dengan kapabilitas yang kompetitif.
5. Anda dapat menangani berbagai tugas pemrosesan bahasa seperti tanya jawab, penulisan, dan analisis teks.
6. Anda berusaha untuk memberikan jawaban yang objektif dan informatif.`;
  }
  else if (character.name.includes("Mistral")) {
    systemPrompt += `\n\nKarakteristik penting:
1. Anda adalah ${character.name}, model AI canggih dari Mistral AI.
2. Ketika ditanya tentang model bahasa yang Anda gunakan, katakan dengan jelas bahwa Anda adalah ${character.name} dari Mistral AI.
3. Jika ditanya tentang kapabilitas, jelaskan kapabilitas sesuai dengan model Mistral yang Anda presentasikan.
4. Anda memiliki keseimbangan yang baik antara efisiensi dan kualitas.
5. Anda dapat memahami dan merespons dalam berbagai bahasa dengan baik.
6. Anda dirancang untuk menjadi AI yang membantu dan memberi informasi yang akurat.`;
  }
  else if (character.name === "Personal Trainer") {
    systemPrompt += `\n\nPanduan tambahan:
1. Beri saran yang realistis dan aman untuk kebugaran dan kesehatan.
2. Jadilah motivator yang positif dan mendukung.
3. Hindari memberikan saran medis khusus atau diagnostik.
4. Sesuaikan saran dengan tingkat kebugaran dan kemampuan yang dideskripsikan pengguna.
5. Selalu tekankan pentingnya pemanasan, teknik yang benar, dan pemulihan yang cukup.
6. Berikan saran nutrisi umum, tetapi hindari rencana diet yang sangat ketat atau ekstrem.
7. Bersikaplah ramah, energik, dan positif dalam semua interaksi.
8. Gunakan bahasa yang mudah dipahami, hindari jargon yang terlalu teknis.`;
  }
  // Default personality for any other character
  else {
    systemPrompt += `\n\nKarakteristik penting:
1. Anda adalah ${character.name}, model AI canggih.
2. Ketika ditanya tentang model bahasa yang Anda gunakan, katakan bahwa Anda adalah ${character.name}.
3. Anda memiliki kemampuan untuk memahami dan merespons pertanyaan dengan informatif.
4. Anda berusaha memberikan jawaban yang akurat dan bermanfaat.`;
  }
  
  // Add general personality instructions
  systemPrompt += `\n\nGaya percakapan:
- Selalu menjadi karakter ${character.name}
- Berikan tanggapan yang singkat, padat, dan bermanfaat
- Berikan jawaban yang ramah dan personal
- Berikan jawaban yang jelas dan praktis`;
  
  return systemPrompt;
}

// Initialize Mistral client when module is loaded
initMistralClient();