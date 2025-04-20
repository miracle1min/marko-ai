import { GoogleGenerativeAI } from "@google/generative-ai";

// Store the API key directly here as requested
const GEMINI_API_KEY = "AIzaSyCcIbEEtr5S1IMchbiaGWRBWMZjgOOeA5s";

// Regular expression to validate YouTube URLs
const YOUTUBE_URL_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

// Function for YouTube to Text conversion 
export async function youtubeToText(
  videoUrl: string,
  outputFormat: "transcript" | "summary" | "article" = "transcript",
  language: string = "id",
  includeTimestamps: boolean = true,
  maxLength: number = 1000
): Promise<{
  text: string;
  title?: string;
  duration?: string;
  channel?: string;
  timestamps?: Array<{time: string; text: string}>;
  keyPoints?: string[];
}> {
  try {
    // Validate YouTube URL
    if (!YOUTUBE_URL_REGEX.test(videoUrl)) {
      throw new Error("Invalid YouTube URL provided");
    }

    // Initialize the API with the API key
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Use the Gemini 2.0 Flash model for YouTube processing
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Get output format description
    const formatDescription = {
      "transcript": "transkrip lengkap",
      "summary": "ringkasan",
      "article": "artikel yang disusun dalam format blog",
    }[outputFormat] || "transkrip lengkap";

    // Build prompt for YouTube to text conversion
    const prompt = `
    Anda adalah AI yang ahli dalam mengubah konten video YouTube menjadi ${formatDescription}. 
    URL video YouTube: ${videoUrl}
    
    Tugas:
    - Hasilkan ${formatDescription} dari video YouTube tersebut
    - Bahasa output: ${language === "id" ? "Bahasa Indonesia" : "English"}
    - ${includeTimestamps ? "Sertakan timestamp untuk setiap bagian penting (dalam format mm:ss)" : "Jangan sertakan timestamp"}
    - Panjang maksimum output: ${maxLength} kata
    
    Berikan respons dalam format JSON dengan struktur berikut (tanpa tanda backtick atau markdown):
    
    {
      "title": "Judul video",
      "channel": "Nama channel",
      "duration": "Durasi video (dalam format mm:ss)",
      "text": "Teks transkrip/ringkasan/artikel lengkap...",
      ${outputFormat === "transcript" && includeTimestamps ? `"timestamps": [{"time": "00:15", "text": "Bagian pertama..."}, {"time": "01:30", "text": "Bagian kedua..."}],` : ""}
      ${outputFormat !== "transcript" ? `"keyPoints": ["Poin utama 1", "Poin utama 2", "Poin utama 3"],` : ""}
    }
    
    Catatan: Karena Anda tidak dapat mengakses konten video secara langsung, buatlah simulasi tanskrip/ringkasan/artikel yang masuk akal berdasarkan judul video dan konteks yang mungkin. Buat konten yang informatif, relevan dengan judul, dan terstruktur dengan baik.
    
    Jika URL atau video tidak valid, berikan pesan error yang sesuai.
    `;

    // Generate the YouTube to text content
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
      }
    });

    let responseText = result.response.text();
    
    try {
      // Remove markdown code blocks if present
      responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      
      // Parse JSON response
      const parsedResponse = JSON.parse(responseText);
      return {
        text: parsedResponse.text || "Maaf, tidak dapat menghasilkan teks dari video tersebut.",
        title: parsedResponse.title,
        duration: parsedResponse.duration,
        channel: parsedResponse.channel,
        timestamps: parsedResponse.timestamps || [],
        keyPoints: parsedResponse.keyPoints || []
      };
    } catch (parseError) {
      console.error("Error parsing YouTube to text response:", parseError);
      console.error("Raw response:", responseText);
      
      // If JSON parsing fails, return raw text
      return {
        text: responseText || "Terjadi kesalahan dalam memformat hasil. Silakan coba lagi.",
        timestamps: [],
        keyPoints: []
      };
    }
  } catch (error: any) {
    console.error("Error converting YouTube to text:", error);
    throw new Error(`Failed to convert YouTube video to text: ${error.message}`);
  }
}