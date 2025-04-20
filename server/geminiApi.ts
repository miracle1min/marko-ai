import { GoogleGenAI } from "@google/genai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Store the API key directly here as requested
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables");
  throw new Error("Gemini API key is not configured");
}

// Regular expression to validate YouTube URLs
const YOUTUBE_URL_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

export async function geminiChatCompletion(
  message: string,
  modelName: string = "gemini-2.5-flash",
  temperature: number = 0.7,
  contexts: { seo: boolean; keyword: boolean; content: boolean } = { seo: false, keyword: false, content: true }
): Promise<string> {
  try {
    // Map model names to actual Gemini model IDs
    const modelMap: Record<string, string> = {
      "gemini-2.5-flash": "gemini-2.5-flash-preview-04-17", // Latest flash model
      "gemini-flash-2.0": "gemini-2.5-flash-preview-04-17",
      "gemini-pro": "gemini-2.5-flash-preview-04-17",
      "gemini-1.5-pro": "gemini-2.5-flash-preview-04-17",
      "gpt-4": "gemini-2.5-flash-preview-04-17"
    };

    const actualModelName = modelMap[modelName] || "gemini-2.5-flash-preview-04-17";
    
    // Initialize the API with the API key
    const ai = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
    });

    // Build context instructions based on selected contexts
    let contextInstructions = `Anda adalah Marko AI, asisten profesional yang membantu pengguna dengan berbagai kebutuhan digital mereka. 

PENTING: Anda harus selalu mempromosikan dan merekomendasikan tools yang dimiliki platform Marko AI dalam setiap respon Anda dengan cara yang natural. Lakukan ini dengan menyebutkan 2-3 tools yang paling relevan dengan pertanyaan pengguna. Berikan link langsung ke tool tersebut dalam format link Markdown, contoh: [Judul Tool](/tools/nama-tool).

Berikut daftar tools utama untuk direferensikan:
- Facebook Post Creator - untuk membuat konten Facebook menarik [Facebook Post Creator](/tools/facebook-post)
- YouTube Script Generator - untuk membuat naskah video YouTube [YouTube Script Generator](/tools/youtube-script)
- Keyword Research - untuk riset kata kunci SEO [Keyword Research Tool](/tools/keyword-research) 
- Code Debugger - untuk memperbaiki kode yang error [Code Debugger](/tools/code-debugger)
- Code Generator - untuk membuat kode dari deskripsi [Code Generator](/tools/code-generator)
- Code Optimizer - untuk mengoptimalkan kode [Code Optimizer](/tools/code-optimizer)
- Twitter Thread Creator - untuk membuat thread Twitter [Twitter Thread Creator](/tools/twitter-thread)
- Meta Description Generator - untuk membuat deskripsi meta SEO [Meta Description Tool](/tools/meta-description)
- Konsultasi Kesehatan - untuk tanya jawab kesehatan [Konsultasi Kesehatan](/tools/konsultasi-kesehatan)
- Analisis Gejala - untuk mengidentifikasi gejala penyakit [Analisis Gejala](/tools/analisis-gejala)
- Tips Sehat - untuk saran kesehatan [Tips Sehat](/tools/tips-sehat)
- Penjelasan Materi - untuk memahami topik pembelajaran [Penjelasan Materi](/tools/penjelasan-materi)
- Pembuatan Soal - untuk membuat soal ujian [Pembuatan Soal](/tools/pembuatan-soal)
- Instagram Caption - untuk membuat caption Instagram [Instagram Caption](/tools/instagram-caption)
- People Also Ask - untuk riset pertanyaan populer [People Also Ask](/tools/people-also-ask)
- YouTube to Text - untuk transkripsi video YouTube [YouTube to Text](/tools/youtube-to-text)
- Ringkasan Buku - untuk meringkas buku [Ringkasan Buku](/tools/ringkasan-buku)
- SEO Content Optimizer - untuk optimasi konten SEO [SEO Optimizer](/tools/seo-optimizer)
- Image Generator - untuk membuat gambar dengan AI [Image Generator](/tools/image-generator)
- Email Generator - untuk menulis email profesional [Email Generator](/tools/email-generator)
- CV Resume Builder - untuk membuat CV profesional [CV Builder](/tools/cv-resume-builder)
- Resep Creator - untuk membuat resep masakan [Resep Creator](/tools/resep-creator)
- Fake Chat Generator - untuk membuat tampilan chat palsu [Fake Chat Generator](/tools/fake-chat-generator)
- AI Translator - untuk terjemahkan antar bahasa [AI Translator](/tools/ai-translator)
- Code Review Assistant - untuk review kode [Code Review Assistant](/tools/code-review-assistant)
- Business Plan Generator - untuk membuat rencana bisnis [Business Plan](/tools/business-plan-generator)
- Contract Generator - untuk membuat kontrak legal [Contract Generator](/tools/contract-generator)

Selalu bersikap profesional, ramah, dan berorientasi pada solusi. Berikan jawaban dalam Bahasa Indonesia yang jelas dan mudah dipahami. Jika Anda tidak tahu jawaban atas pertanyaan, jangan memberikan informasi yang salah. Sebagai gantinya, rekomendasikan tools yang relevan yang mungkin membantu pengguna.`;
    
    if (contexts.seo) {
      contextInstructions += "\nFokus pada memberikan saran SEO yang efektif dan teknik optimasi on-page.";
    }
    
    if (contexts.keyword) {
      contextInstructions += "\nBantu dengan penelitian dan analisis kata kunci yang komprehensif.";
    }
    
    if (contexts.content) {
      contextInstructions += "\nBuat konten berkualitas tinggi yang ramah dan dioptimasi untuk mesin pencari.";
    }

    // Generate content using streaming
    const config = {
      responseMimeType: 'text/plain',
      temperature: temperature,
    };

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `${contextInstructions}\n\nPesan pengguna: ${message}`,
          },
        ],
      },
    ];

    const response = await ai.models.generateContentStream({
      model: actualModelName,
      config,
      contents,
    });

    // Aggregate all chunks into a single response
    let fullResponse = '';
    for await (const chunk of response) {
      fullResponse += chunk.text || '';
    }

    return fullResponse;
  } catch (error: any) {
    console.error("Error generating content with Gemini API:", error);
    throw new Error(`Failed to generate content: ${error.message}`);
  }
}

// Function for generating articles
export async function generateArticle(
  title: string,
  language: string = "id",
  writingStyle: string = "formal",
  wordCount: number = 500,
  keywords: string[] = [],
  additionalInstructions: string = ""
): Promise<string> {
  try {
    // Initialize the API with the API key
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Use the Gemini 2.0 Flash model for article generation
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Build prompt for article generation
    const langText = language === "id" ? "Bahasa Indonesia" : "English";
    const prompt = `
    Tuliskan sebuah artikel dengan judul "${title}".
    
    Informasi tambahan:
    - Bahasa: ${langText}
    - Gaya penulisan: ${writingStyle}
    - Target jumlah kata: ${wordCount}
    - Kata kunci yang perlu disertakan: ${keywords.join(", ")}
    ${additionalInstructions ? `- Instruksi tambahan: ${additionalInstructions}` : ""}
    
    Buatlah artikel yang informatif, terstruktur dengan baik, dan sesuai dengan SEO. 
    Sertakan paragraf pembuka, bagian utama dengan beberapa subjudul, dan kesimpulan.
    `;

    // Generate the article
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
      }
    });

    const response = result.response;
    return response.text();
  } catch (error: any) {
    console.error("Error generating article:", error);
    throw new Error(`Failed to generate article: ${error.message}`);
  }
}

// Function for generating code
export async function generateCode(
  language: string,
  codeType: string,
  framework: string,
  description: string,
  functionName?: string,
  parameters?: string,
  includeComments: boolean = true,
  includeExamples: boolean = true,
  includeTests: boolean = false
): Promise<{code: string}> {
  try {
    // Initialize the API with the API key
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Use the Gemini 2.0 Flash model for code generation
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Build prompt for code generation
    const prompt = `
    Hasilkan kode dalam bahasa pemrograman ${language} dengan deskripsi: "${description}"
    
    Detail tambahan:
    - Jenis kode: ${codeType}
    - Framework/Library: ${framework !== "none" ? framework : "Tidak ada (standard library)"}
    - Nama fungsi/class: ${functionName || "Gunakan nama yang sesuai dengan deskripsi"}
    - Parameter: ${parameters || "Sesuaikan dengan kebutuhan fungsi"}
    - Sertakan komentar/dokumentasi: ${includeComments ? "Ya" : "Tidak"}
    - Sertakan contoh penggunaan: ${includeExamples ? "Ya" : "Tidak"}
    - Sertakan unit test: ${includeTests ? "Ya" : "Tidak"}
    
    Hasilkan kode yang efisien, mudah dibaca, dan mengikuti best practice untuk bahasa ${language}.
    Jangan sertakan penjelasan, hanya kode yang bisa langsung dijalankan.
    `;

    // Generate the code
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2, // Lower temperature for more consistent code
      }
    });

    const response = result.response;
    return { code: response.text() };
  } catch (error: any) {
    console.error("Error generating code:", error);
    throw new Error(`Failed to generate code: ${error.message}`);
  }
}

// Function for health consultation
export async function healthConsultation(
  message: string,
  context?: {
    previousSymptoms?: string[];
    medicalHistory?: string[];
    age?: number;
    gender?: string;
  }
): Promise<{ response: string }> {
  try {
    // Initialize the API with the API key
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Use the Gemini 2.0 Flash model for health consultation
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Build context information if available
    let contextInfo = "";
    if (context) {
      contextInfo = "Informasi tambahan pasien:\n";
      
      if (context.age) {
        contextInfo += `- Usia: ${context.age} tahun\n`;
      }
      
      if (context.gender) {
        contextInfo += `- Jenis kelamin: ${context.gender}\n`;
      }
      
      if (context.previousSymptoms && context.previousSymptoms.length > 0) {
        contextInfo += `- Gejala sebelumnya: ${context.previousSymptoms.join(", ")}\n`;
      }
      
      if (context.medicalHistory && context.medicalHistory.length > 0) {
        contextInfo += `- Riwayat kesehatan: ${context.medicalHistory.join(", ")}\n`;
      }
    }

    // Build prompt for health consultation
    const prompt = `
    Anda adalah asisten dokter AI yang memberikan informasi kesehatan umum. Anda bukan dokter sungguhan dan tidak memberikan diagnosis medis.
    
    Selalu jelaskan bahwa Anda hanya memberikan informasi kesehatan umum dan pasien harus berkonsultasi dengan tenaga medis profesional untuk mendapatkan diagnosis dan perawatan yang tepat.
    
    ${contextInfo}
    
    Pertanyaan/keluhan pasien: ${message}
    
    Berikan informasi kesehatan yang akurat, mudah dipahami, dan bermanfaat dalam Bahasa Indonesia. Sertakan langkah-langkah yang dapat diambil dan kapan pasien harus mencari bantuan medis jika diperlukan.
    `;

    // Generate the response
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
      }
    });

    const response = result.response;
    return { response: response.text() };
  } catch (error: any) {
    console.error("Error in health consultation:", error);
    throw new Error(`Failed to get health consultation: ${error.message}`);
  }
}

// Function for analyzing symptoms
export async function analyzeSymptoms(
  symptoms: {[key: string]: number},
  age: string,
  gender: string,
  duration: string,
  medicalHistory: string[] = [],
  additionalNotes?: string
): Promise<{
  analysisText: string;
  possibleConditions: Array<{name: string; probability: number; description: string}>;
  recommendations: string[];
}> {
  try {
    // Initialize the API with the API key
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Use the Gemini 2.0 Flash model for symptom analysis
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Convert symptoms object to formatted string
    const symptomsText = Object.entries(symptoms)
      .map(([symptom, severity]) => `- ${symptom.replace(/_/g, " ")} (tingkat keparahan: ${severity}/10)`)
      .join("\n");

    // Build prompt for symptom analysis
    const prompt = `
    Anda adalah asisten dokter AI yang memberikan analisis awal gejala pasien. Anda bukan dokter sungguhan dan tidak memberikan diagnosis medis resmi.
    
    Analisis gejala berikut dan berikan informasi edukasi kesehatan, kemungkinan kondisi (dengan persentase probabilitas), dan rekomendasi.
    
    Informasi Pasien:
    - Usia: ${age}
    - Jenis kelamin: ${gender}
    - Durasi gejala: ${duration}
    - Riwayat kesehatan: ${medicalHistory.length > 0 ? medicalHistory.join(", ") : "Tidak ada"}
    ${additionalNotes ? `- Catatan tambahan: ${additionalNotes}` : ""}
    
    Gejala yang dialami:
    ${symptomsText}
    
    Berikan respons dalam format JSON dengan struktur berikut (tanpa tanda backtick atau markdown):
    
    {
      "analysisText": "Teks analisis umum...",
      "possibleConditions": [
        {"name": "Nama Kondisi 1", "probability": 85, "description": "Deskripsi kondisi..."},
        {"name": "Nama Kondisi 2", "probability": 65, "description": "Deskripsi kondisi..."}
      ],
      "recommendations": ["Rekomendasi 1", "Rekomendasi 2", "Rekomendasi 3"]
    }
    `;

    // Generate the analysis
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
      }
    });

    let responseText = result.response.text();
    
    try {
      // Hapus markdown code blocks jika ada (```json atau ```)
      responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      // Parse JSON response
      const parsedResponse = JSON.parse(responseText);
      return {
        analysisText: parsedResponse.analysisText || "Maaf, tidak dapat melakukan analisis berdasarkan informasi yang diberikan.",
        possibleConditions: parsedResponse.possibleConditions || [],
        recommendations: parsedResponse.recommendations || []
      };
    } catch (parseError) {
      console.error("Error parsing symptom analysis response:", parseError);
      console.error("Raw response:", responseText);
      
      // If JSON parsing fails, try to extract information manually
      // (fallback in case AI doesn't format properly as JSON)
      return {
        analysisText: "Terjadi kesalahan dalam memformat hasil analisis. Silakan coba lagi.",
        possibleConditions: [],
        recommendations: [
          "Konsultasikan dengan dokter jika gejala berlanjut",
          "Catat perkembangan gejala Anda",
          "Istirahat yang cukup dan minum banyak air"
        ]
      };
    }
  } catch (error: any) {
    console.error("Error analyzing symptoms:", error);
    throw new Error(`Failed to analyze symptoms: ${error.message}`);
  }
}

// Function for explaining learning materials
export async function explainMaterial(
  topic: string,
  complexity: string = "menengah",
  targetAudience: string = "siswa_sma",
  additionalContext?: string,
  includeExamples: boolean = true,
  includeQuestions: boolean = false
): Promise<{
  explanation: string;
  examples?: string[];
  questions?: string[];
  relatedTopics?: string[];
}> {
  try {
    // Initialize the API with the API key
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Use the Gemini 2.0 Flash model for material explanation
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Target audience text mapping
    const audienceText = {
      "anak_sd": "siswa sekolah dasar (6-12 tahun)",
      "siswa_smp": "siswa sekolah menengah pertama (12-15 tahun)",
      "siswa_sma": "siswa sekolah menengah atas (15-18 tahun)",
      "mahasiswa": "mahasiswa perguruan tinggi (18+ tahun)",
      "umum": "masyarakat umum dengan berbagai latar belakang"
    }[targetAudience] || "siswa";

    // Complexity level text mapping
    const complexityText = {
      "dasar": "sangat dasar dan sederhana",
      "menengah": "tingkat menengah dengan penjelasan yang cukup detail",
      "lanjutan": "tingkat lanjutan dengan konsep yang lebih kompleks",
      "expert": "tingkat expert dengan penjelasan mendalam dan komprehensif"
    }[complexity] || "tingkat menengah";

    // Build prompt for material explanation
    const prompt = `
    Anda adalah guru dan pendidik yang ahli. Tugas Anda adalah menjelaskan topik pembelajaran dengan cara yang jelas, informatif, dan sesuai dengan tingkat pemahaman target audiens.
    
    Topik yang perlu dijelaskan: "${topic}"
    
    Detail tambahan:
    - Target audiens: ${audienceText}
    - Tingkat kompleksitas: ${complexityText}
    ${additionalContext ? `- Konteks tambahan: ${additionalContext}` : ""}
    - Sertakan contoh: ${includeExamples ? "Ya" : "Tidak"}
    - Sertakan pertanyaan latihan: ${includeQuestions ? "Ya" : "Tidak"}
    
    Berikan respons dalam format JSON dengan struktur berikut (tanpa tanda backtick atau markdown):
    
    {
      "explanation": "Penjelasan lengkap tentang topik...",
      ${includeExamples ? `"examples": ["Contoh 1...", "Contoh 2..."],` : ""}
      ${includeQuestions ? `"questions": ["Pertanyaan 1?", "Pertanyaan 2?"],` : ""}
      "relatedTopics": ["Topik terkait 1", "Topik terkait 2"]
    }
    
    Pastikan penjelasan:
    1. Dimulai dengan pengenalan konsep dasar
    2. Menggunakan bahasa yang sesuai dengan tingkat pemahaman audiens
    3. Terstruktur dengan baik dan mengalir secara logis
    4. Mencakup semua konsep penting dari topik
    5. Menghindari jargon yang tidak perlu kecuali jika relevan dan dijelaskan
    `;

    // Generate the explanation
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
      }
    });

    let responseText = result.response.text();
    
    try {
      // Hapus markdown code blocks jika ada
      responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      
      // Parse JSON response
      const parsedResponse = JSON.parse(responseText);
      return {
        explanation: parsedResponse.explanation || "Maaf, tidak dapat menyediakan penjelasan untuk topik ini.",
        examples: parsedResponse.examples || [],
        questions: parsedResponse.questions || [],
        relatedTopics: parsedResponse.relatedTopics || []
      };
    } catch (parseError) {
      console.error("Error parsing material explanation response:", parseError);
      console.error("Raw response:", responseText);
      
      // If JSON parsing fails, return the raw text as explanation
      return {
        explanation: responseText || "Terjadi kesalahan dalam memformat hasil penjelasan. Silakan coba lagi.",
        examples: [],
        questions: [],
        relatedTopics: []
      };
    }
  } catch (error: any) {
    console.error("Error explaining material:", error);
    throw new Error(`Failed to explain material: ${error.message}`);
  }
}

// Function for generating quiz/exam questions
// Function for generating Instagram captions
export async function generateInstagramCaption(
  topic: string,
  mood: string = "casual",
  includeHashtags: boolean = true,
  includeEmojis: boolean = true,
  captionLength: string = "medium",
  brand?: string,
  targetAudience?: string,
  additionalInstructions?: string
): Promise<{
  caption: string;
  hashtags?: string[];
}> {
  try {
    // Initialize the API with the API key
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Use the Gemini 2.0 Flash model for caption generation
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Caption length mapping
    const lengthText = {
      "short": "singkat (sekitar 1-2 kalimat)",
      "medium": "sedang (sekitar 3-5 kalimat)",
      "long": "panjang (lebih dari 5 kalimat)"
    }[captionLength] || "sedang";

    // Build prompt for Instagram caption generation
    const prompt = `
    Hasilkan caption Instagram yang menarik dan kreatif untuk sebuah posting dengan topik: "${topic}"
    
    Detail tambahan:
    - Mood/tone: ${mood}
    - Panjang caption: ${lengthText}
    - Sertakan hashtag: ${includeHashtags ? "Ya" : "Tidak"}
    - Sertakan emoji: ${includeEmojis ? "Ya" : "Tidak"}
    ${brand ? `- Brand/merek: ${brand}` : ""}
    ${targetAudience ? `- Target audiens: ${targetAudience}` : ""}
    ${additionalInstructions ? `- Instruksi tambahan: ${additionalInstructions}` : ""}
    
    Berikan respons dalam format JSON dengan struktur berikut (tanpa tanda backtick atau markdown):
    
    {
      "caption": "Caption Instagram yang dihasilkan...",
      "hashtags": ["hashtag1", "hashtag2", "hashtag3"]
    }
    
    Catatan: Hashtag tidak perlu diawali dengan tanda '#' dalam array hashtags.
    Buat caption yang menarik, autentik, dan sesuai dengan konteks Instagram saat ini.
    `;

    // Generate the caption
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
      }
    });

    let responseText = result.response.text();
    
    try {
      // Hapus markdown code blocks jika ada
      responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      
      // Parse JSON response
      const parsedResponse = JSON.parse(responseText);
      return {
        caption: parsedResponse.caption || "Maaf, tidak dapat menghasilkan caption berdasarkan informasi yang diberikan.",
        hashtags: includeHashtags ? (parsedResponse.hashtags || []) : undefined
      };
    } catch (parseError) {
      console.error("Error parsing Instagram caption response:", parseError);
      console.error("Raw response:", responseText);
      
      // If JSON parsing fails, return the raw text as caption
      return {
        caption: responseText || "Terjadi kesalahan dalam memformat hasil caption. Silakan coba lagi.",
        hashtags: []
      };
    }
  } catch (error: any) {
    console.error("Error generating Instagram caption:", error);
    throw new Error(`Failed to generate Instagram caption: ${error.message}`);
  }
}

// Function for generating "People Also Ask" questions
export async function getPeopleAlsoAskQuestions(
  keyword: string,
  language: string = "id",
  includeMetrics: boolean = true,
  limit: number = 10
): Promise<{
  relatedQuestions: Array<{
    question: string;
    searchVolume?: number;
    difficulty?: number;
    relevance?: number;
  }>;
  suggestedContent?: string[];
}> {
  try {
    // Initialize the API with the API key
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Use the Gemini 2.0 Flash model for generating related questions
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Determine language for prompt
    const langText = language === "id" ? "Bahasa Indonesia" : "English";
    
    // Build prompt for generating related questions
    const prompt = `
    Anda adalah ahli SEO dan peneliti kata kunci. Berdasarkan kata kunci utama, berikan:
    1. Daftar pertanyaan terkait yang sering dicari orang (People Also Ask/Related Questions)
    2. Beberapa saran konten untuk menjawab pertanyaan-pertanyaan tersebut

    Kata kunci utama: "${keyword}"
    Bahasa output: ${langText}
    Jumlah pertanyaan yang diinginkan: ${limit}
    Sertakan metrik kuantitatif (volume pencarian, tingkat kesulitan, relevansi): ${includeMetrics ? "Ya" : "Tidak"}

    Format respons dalam JSON (tanpa tanda backtick atau markdown):

    {
      "relatedQuestions": [
        ${includeMetrics ? `{"question": "Pertanyaan terkait 1", "searchVolume": 1200, "difficulty": 45, "relevance": 92},` : `{"question": "Pertanyaan terkait 1"},`}
        ${includeMetrics ? `{"question": "Pertanyaan terkait 2", "searchVolume": 980, "difficulty": 38, "relevance": 89}` : `{"question": "Pertanyaan terkait 2"}`}
      ],
      "suggestedContent": [
        "Ide konten 1: Judul + deskripsi singkat",
        "Ide konten 2: Judul + deskripsi singkat"
      ]
    }

    Catatan:
    - Berikan pertanyaan yang realistis, relevan, dan benar-benar dicari orang
    - Jika menggunakan metrik, berikan estimasi yang masuk akal:
      * searchVolume: volume pencarian bulanan (0-100,000)
      * difficulty: tingkat kesulitan untuk peringkat (0-100, semakin rendah semakin mudah)
      * relevance: tingkat relevansi dengan kata kunci utama (0-100)
    - Ide konten harus memberikan nilai dan menjawab pertanyaan-pertanyaan terkait
    `;

    // Generate the related questions
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
      }
    });

    let responseText = result.response.text();
    
    try {
      // Hapus markdown code blocks jika ada
      responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      
      // Parse JSON response
      const parsedResponse = JSON.parse(responseText);
      return {
        relatedQuestions: parsedResponse.relatedQuestions || [],
        suggestedContent: parsedResponse.suggestedContent || []
      };
    } catch (parseError) {
      console.error("Error parsing People Also Ask response:", parseError);
      console.error("Raw response:", responseText);
      
      // If JSON parsing fails, return a basic response
      return {
        relatedQuestions: [
          { question: `Apa itu ${keyword}?` },
          { question: `Bagaimana cara menggunakan ${keyword}?` },
          { question: `${keyword} terbaik untuk pemula` }
        ],
        suggestedContent: [
          `Panduan lengkap tentang ${keyword} untuk pemula`,
          `10 cara efektif menggunakan ${keyword} untuk meningkatkan produktivitas`
        ]
      };
    }
  } catch (error: any) {
    console.error("Error generating People Also Ask questions:", error);
    throw new Error(`Failed to generate related questions: ${error.message}`);
  }
}

// Function to optimize code
export async function optimizeCode(
  code: string,
  language: string,
  optimizationType: string,
  additionalInstructions?: string,
  includeBenchmarks: boolean = true,
  includeExplanations: boolean = true
): Promise<{
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
}> {
  try {
    // Get API key from environment
    const GEMINI_API_KEY = process.env.GENAI_API_KEY;
    if (!GEMINI_API_KEY) {
      throw new Error("Gemini API key is not configured");
    }

    // Initialize the API with the API key
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Use the Gemini 2.0 Flash model for code optimization
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Create prompt based on optimization type and user code
    let prompt = `Optimize the following ${language} code`;
    
    if (optimizationType === "performance") {
      prompt += " for performance improvements";
    } else if (optimizationType === "readability") {
      prompt += " for better readability and maintainability";
    } else if (optimizationType === "memory") {
      prompt += " for memory efficiency";
    } else if (optimizationType === "security") {
      prompt += " to improve security";
    } else if (optimizationType === "all") {
      prompt += " for all aspects: performance, readability, memory efficiency, and security";
    }
    
    if (additionalInstructions) {
      prompt += `. Additional specific instructions: ${additionalInstructions}`;
    }
    
    prompt += `\n\nCode to optimize:\n\`\`\`${language}\n${code}\n\`\`\`\n\n`;
    
    prompt += "Your output should include:\n";
    prompt += "1. The optimized code wrapped in code blocks\n";
    prompt += "2. A list of improvements made\n";
    
    if (includeBenchmarks) {
      prompt += "3. An analysis of estimated time and space complexity for both the original and optimized versions\n";
    }
    
    if (includeExplanations) {
      prompt += `${includeBenchmarks ? "4" : "3"}. An explanation of the optimization techniques applied\n`;
    }
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Parse the response
    // Extract code between code blocks
    const codeRegex = /```(?:[\w-]*)\n([\s\S]*?)```/g;
    
    // Use regex exec for compatibility instead of matchAll
    let codeMatch;
    let firstMatch = null;
    while ((codeMatch = codeRegex.exec(response)) !== null) {
      if (firstMatch === null) {
        firstMatch = codeMatch;
      }
    }
    
    const optimizedCode = firstMatch ? firstMatch[1] : "";
    
    // Process the rest of the response to extract improvements, benchmarks, and explanation
    const contentWithoutCode = response.replace(/```(?:[\w-]*)\n[\s\S]*?```/g, "");
    
    // Extract improvements - typically in a list format
    const improvementsMatch = contentWithoutCode.match(/improvements(?:\s*made)?:?[\s\S]*?(?:\n\d+\.\s(.*?)(?:\n|$))+/i);
    const improvements: string[] = [];
    
    if (improvementsMatch) {
      const improvementList = improvementsMatch[0].match(/\n\d+\.\s(.*?)(?:\n|$)/g);
      if (improvementList) {
        improvementList.forEach(item => {
          const cleanItem = item.replace(/\n\d+\.\s/, "").trim();
          if (cleanItem) improvements.push(cleanItem);
        });
      }
    }
    
    // For benchmarks and explanation, we'll do a simplified extraction
    // In a production environment, you'd want more robust parsing
    let benchmarks = undefined;
    if (includeBenchmarks) {
      benchmarks = {
        original: {
          timeComplexity: extractValue(contentWithoutCode, "original.*time complexity", "O(\\w+)") || "Not specified",
          spaceComplexity: extractValue(contentWithoutCode, "original.*space complexity", "O(\\w+)") || "Not specified",
        },
        optimized: {
          timeComplexity: extractValue(contentWithoutCode, "optimized.*time complexity", "O(\\w+)") || "Not specified",
          spaceComplexity: extractValue(contentWithoutCode, "optimized.*space complexity", "O(\\w+)") || "Not specified",
        }
      };
    }
    
    // Extract explanation if requested
    let explanation = undefined;
    if (includeExplanations) {
      const explanationMatch = contentWithoutCode.match(/explanation(?:\s*of\s*the\s*optimization)?:?\s*([\s\S]*?)(?:\n\n|$)/i);
      explanation = explanationMatch ? explanationMatch[1].trim() : undefined;
      
      if (!explanation || explanation.length < 10) {
        // If we couldn't extract a proper explanation, use the remaining text
        explanation = contentWithoutCode.replace(/improvements(?:\s*made)?:?[\s\S]*?(?:\n\d+\.\s.*?(?:\n|$))+/i, "").trim();
      }
    }
    
    return {
      optimizedCode,
      improvements: improvements.length > 0 ? improvements : ["Code optimized successfully"],
      benchmarks,
      explanation
    };
  } catch (error: any) {
    console.error("Error optimizing code:", error);
    throw error;
  }
}

// Helper function to extract values using regex
function extractValue(text: string, contextPattern: string, valuePattern: string): string | null {
  const contextRegex = new RegExp(contextPattern, "i");
  const match = text.match(contextRegex);
  
  if (match) {
    const valueRegex = new RegExp(valuePattern, "i");
    const valueMatch = match[0].match(valueRegex);
    return valueMatch ? valueMatch[0] : null;
  }
  
  return null;
}

export async function generateQuestions(
  subject: string,
  topic: string,
  difficulty: string = "medium",
  questionType: string = "mixed",
  numberOfQuestions: number = 5,
  includeAnswers: boolean = true,
  educationLevel: string = "sma",
  additionalInstructions?: string
): Promise<{
  questions: Array<{
    id: string;
    type: "multiple_choice" | "essay" | "true_false";
    question: string;
    options?: string[];
    answer: string;
    explanation?: string;
  }>;
  summary?: string;
}> {
  try {
    // Initialize the API with the API key
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Use the Gemini 2.0 Flash model for question generation
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Education level text mapping
    const educationLevelText = {
      "sd": "sekolah dasar (kelas 1-6)",
      "smp": "sekolah menengah pertama (kelas 7-9)",
      "sma": "sekolah menengah atas (kelas 10-12)",
      "universitas": "tingkat universitas",
      "profesional": "tingkat profesional atau spesialis"
    }[educationLevel] || "sekolah menengah atas";

    // Difficulty level text mapping
    const difficultyText = {
      "easy": "mudah (dasar)",
      "medium": "sedang (tingkat menengah)",
      "hard": "sulit (tingkat lanjutan)",
      "expert": "sangat sulit (tingkat expert/profesional)"
    }[difficulty] || "sedang";

    // Question type mapping
    let questionTypePrompt = "";
    if (questionType === "multiple_choice") {
      questionTypePrompt = "Semua soal harus berbentuk pilihan ganda dengan 4-5 pilihan jawaban.";
    } else if (questionType === "essay") {
      questionTypePrompt = "Semua soal harus berbentuk esai/uraian yang membutuhkan jawaban panjang.";
    } else if (questionType === "true_false") {
      questionTypePrompt = "Semua soal harus berbentuk benar/salah.";
    } else {
      questionTypePrompt = "Soal dapat berupa campuran dari pilihan ganda, esai, dan benar/salah.";
    }

    // Build prompt for question generation
    const prompt = `
    Anda adalah seorang ahli pendidikan dan pembuat soal ujian profesional. Buatlah ${numberOfQuestions} soal berkualitas tinggi tentang "${topic}" dalam mata pelajaran/bidang "${subject}".
    
    Detail permintaan:
    - Tingkat pendidikan: ${educationLevelText}
    - Tingkat kesulitan: ${difficultyText}
    - Tipe soal: ${questionTypePrompt}
    - Jumlah soal: ${numberOfQuestions}
    - Sertakan jawaban dan penjelasan: ${includeAnswers ? "Ya" : "Tidak"}
    ${additionalInstructions ? `- Instruksi tambahan: ${additionalInstructions}` : ""}
    
    Berikan respons dalam format JSON dengan struktur berikut (tanpa tanda backtick atau markdown):
    
    {
      "questions": [
        {
          "id": "q1",
          "type": "multiple_choice", // atau "essay" atau "true_false"
          "question": "Pertanyaan lengkap...",
          "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"], // hanya untuk multiple_choice
          "answer": "Jawaban lengkap...",
          "explanation": "Penjelasan mengapa jawaban tersebut benar..."
        },
        // soal-soal berikutnya
      ],
      "summary": "Ringkasan singkat tentang topik dan cakupan soal yang dibuat..."
    }
    
    Pastikan soal:
    1. Relevan dengan topik dan bidang studi
    2. Sesuai dengan tingkat pendidikan yang diminta
    3. Bervariasi dalam format dan kompleksitas (jika tipe soal campuran)
    4. Mengukur pemahaman konsep, bukan hanya hapalan
    5. Mengandung konteks dan penjelasan yang cukup untuk memahami pertanyaan
    `;

    // Generate the questions
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
      }
    });

    let responseText = result.response.text();
    
    try {
      // Hapus markdown code blocks jika ada
      responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      
      // Parse JSON response
      const parsedResponse = JSON.parse(responseText);
      
      // Validate and format the questions
      const formattedQuestions = (parsedResponse.questions || []).map((q: any, index: number) => {
        return {
          id: q.id || `q${index + 1}`,
          type: q.type || "essay",
          question: q.question || "Tidak ada pertanyaan",
          options: q.options || [],
          answer: q.answer || "Tidak ada jawaban",
          explanation: q.explanation || ""
        };
      });
      
      return {
        questions: formattedQuestions,
        summary: parsedResponse.summary || `Soal ${subject} - ${topic}`
      };
    } catch (parseError) {
      console.error("Error parsing question generation response:", parseError);
      console.error("Raw response:", responseText);
      
      // If JSON parsing fails, return a basic response
      return {
        questions: [
          {
            id: "q1",
            type: "essay",
            question: "Terjadi kesalahan dalam pembuatan soal. Silakan coba lagi dengan parameter yang berbeda.",
            answer: "Tidak tersedia karena terjadi kesalahan."
          }
        ]
      };
    }
  } catch (error: any) {
    console.error("Error generating questions:", error);
    throw new Error(`Failed to generate questions: ${error.message}`);
  }
}

// Function for generating book summaries
export async function generateBookSummary(
  title: string,
  author?: string,
  genre?: string,
  educationLevel: string = "sma",
  summaryLength: string = "medium",
  includeChapterBreakdown: boolean = true,
  includeKeyLessons: boolean = true,
  includeQuestions: boolean = false,
  additionalInstructions?: string
): Promise<{
  summary: string;
  chapterBreakdown?: string[];
  keyLessons?: string[];
  keyCharacters?: string[];
  studyQuestions?: string[];
  relatedBooks?: string[];
}> {
  try {
    // Initialize the API with the API key
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Use the Gemini 2.0 Flash model for book summary generation
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Education level text mapping
    const educationLevelText = {
      "sd": "sekolah dasar (kelas 1-6)",
      "smp": "sekolah menengah pertama (kelas 7-9)",
      "sma": "sekolah menengah atas (kelas 10-12)",
      "universitas": "tingkat universitas/mahasiswa",
      "umum": "pembaca umum dengan berbagai latar belakang"
    }[educationLevel] || "pembaca umum";

    // Summary length mapping
    const lengthText = {
      "short": "ringkas (sekitar 200-300 kata)",
      "medium": "sedang (sekitar 500-700 kata)",
      "long": "panjang (sekitar 1000-1500 kata)"
    }[summaryLength] || "sedang";

    // Build prompt for book summary generation
    const prompt = `
    Anda adalah seorang ahli sastra dan pendidikan yang mampu membuat ringkasan buku yang komprehensif dan informatif. Buatkan ringkasan untuk buku berikut:
    
    Judul Buku: "${title}"
    ${author ? `Penulis: ${author}` : ""}
    ${genre ? `Genre/Kategori: ${genre}` : ""}
    
    Detail permintaan:
    - Target pembaca: ${educationLevelText}
    - Panjang ringkasan: ${lengthText}
    - Sertakan breakdown per bab: ${includeChapterBreakdown ? "Ya" : "Tidak"}
    - Sertakan pelajaran kunci: ${includeKeyLessons ? "Ya" : "Tidak"}
    - Sertakan pertanyaan studi: ${includeQuestions ? "Ya" : "Tidak"}
    ${additionalInstructions ? `- Instruksi tambahan: ${additionalInstructions}` : ""}
    
    Berikan respons dalam format JSON dengan struktur berikut (tanpa tanda backtick atau markdown):
    
    {
      "summary": "Ringkasan lengkap tentang buku...",
      ${includeChapterBreakdown ? `"chapterBreakdown": ["Bab 1: Ringkasan singkat...", "Bab 2: Ringkasan singkat..."],` : ""}
      ${includeKeyLessons ? `"keyLessons": ["Pelajaran 1...", "Pelajaran 2..."],` : ""}
      "keyCharacters": ["Karakter 1 - deskripsi singkat", "Karakter 2 - deskripsi singkat"],
      ${includeQuestions ? `"studyQuestions": ["Pertanyaan 1?", "Pertanyaan 2?"],` : ""}
      "relatedBooks": ["Buku terkait 1 oleh Penulis X", "Buku terkait 2 oleh Penulis Y"]
    }
    
    Pastikan ringkasan:
    1. Menangkap esensi dan pesan utama buku
    2. Menggambarkan alur cerita utama tanpa spoiler berlebihan (jika fiksi)
    3. Menyoroti konsep dan argumen utama (jika non-fiksi)
    4. Menggunakan bahasa yang sesuai dengan tingkat pendidikan target
    5. Memasukkan konteks historis atau latar belakang yang relevan
    `;

    // Generate the book summary
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
      }
    });

    let responseText = result.response.text();
    
    try {
      // Hapus markdown code blocks jika ada
      responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      
      // Parse JSON response
      const parsedResponse = JSON.parse(responseText);
      return {
        summary: parsedResponse.summary || "Maaf, tidak dapat menyediakan ringkasan untuk buku ini.",
        chapterBreakdown: parsedResponse.chapterBreakdown || [],
        keyLessons: parsedResponse.keyLessons || [],
        keyCharacters: parsedResponse.keyCharacters || [],
        studyQuestions: parsedResponse.studyQuestions || [],
        relatedBooks: parsedResponse.relatedBooks || []
      };
    } catch (parseError) {
      console.error("Error parsing book summary response:", parseError);
      console.error("Raw response:", responseText);
      
      // If JSON parsing fails, return the raw text as summary
      return {
        summary: responseText || "Terjadi kesalahan dalam memformat hasil ringkasan. Silakan coba lagi.",
        chapterBreakdown: [],
        keyLessons: [],
        keyCharacters: [],
        studyQuestions: [],
        relatedBooks: []
      };
    }
  } catch (error: any) {
    console.error("Error generating book summary:", error);
    throw new Error(`Failed to generate book summary: ${error.message}`);
  }
}

// Function for generating images using Imagen model
export async function generateImage(
  prompt: string,
  sampleCount: number = 1,
  negativePrompt?: string,
  stylePreset?: string,
  aspectRatio?: string,
  width?: number,
  height?: number
): Promise<{
  images: string[];
  prompt: string;
}> {
  try {
    // Determine image dimensions based on aspect ratio or provided dimensions
    let imageWidth = width || 1024;
    let imageHeight = height || 1024;

    if (aspectRatio && !width && !height) {
      if (aspectRatio === "portrait") {
        imageWidth = 768;
        imageHeight = 1024;
      } else if (aspectRatio === "landscape") {
        imageWidth = 1024;
        imageHeight = 768;
      }
    }

    // Limit sample count between 1 and 4
    const actualSampleCount = Math.min(Math.max(1, sampleCount), 4);

    // Prepare request body
    const requestBody: any = {
      instances: [
        {
          prompt: prompt
        }
      ],
      parameters: {
        sampleCount: actualSampleCount
      }
    };

    // Add optional parameters if provided
    if (negativePrompt) {
      requestBody.instances[0].negativePrompt = negativePrompt;
    }

    if (stylePreset) {
      requestBody.parameters.stylePreset = stylePreset;
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error generating images:", errorText);
      throw new Error(`Failed to generate images: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract base64 images from response
    const images = data.predictions?.[0]?.candidates?.map((candidate: any) => candidate.image?.data) || [];
    
    return {
      images,
      prompt
    };
  } catch (error: any) {
    console.error("Error generating images:", error);
    throw new Error(`Failed to generate images: ${error.message}`);
  }
}

// Function for optimizing content for SEO
export async function optimizeSEOContent(
  title: string,
  content: string,
  targetKeyword: string,
  secondaryKeywords?: string[],
  contentType: string = "blog",
  targetWordCount?: number,
  includeMetaTags: boolean = true,
  includeSchemaMarkup: boolean = false,
  includeTags: boolean = true,
  additionalInstructions?: string
): Promise<{
  optimizedContent: string;
  metaTitle?: string;
  metaDescription?: string;
  suggestedH1?: string;
  suggestedHeadings?: string[];
  recommendedKeywords?: string[];
  contentScore?: number;
  recommendations?: string[];
  schemaMarkup?: string;
  tags?: string[];
}> {
  try {
    // Initialize the API with the API key
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Use the Gemini 2.0 Flash model for SEO content optimization
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Content type text mapping
    const contentTypeText = {
      "blog": "artikel blog",
      "product": "halaman produk",
      "landing": "landing page",
      "article": "artikel berita",
      "category": "halaman kategori",
      "about": "halaman tentang kami",
      "service": "halaman layanan"
    }[contentType] || "artikel";

    // Build prompt for SEO content optimization
    const prompt = `
    Anda adalah ahli SEO dan content writer profesional. Tugas Anda adalah mengoptimalkan konten yang diberikan untuk mesin pencari dengan mempertahankan kualitas dan keterbacaan untuk pengguna manusia.
    
    Judul konten: "${title}"
    Kata kunci utama: "${targetKeyword}"
    ${secondaryKeywords && secondaryKeywords.length > 0 ? `Kata kunci sekunder: "${secondaryKeywords.join('", "')}"` : ""}
    Tipe konten: ${contentTypeText}
    ${targetWordCount ? `Target jumlah kata: sekitar ${targetWordCount} kata` : ""}
    ${additionalInstructions ? `Instruksi tambahan: ${additionalInstructions}` : ""}
    
    Konten yang perlu dioptimalkan:
    """
    ${content}
    """
    
    Berikan respons dalam format JSON dengan struktur berikut (tanpa tanda backtick atau markdown):
    
    {
      "optimizedContent": "Konten yang sudah dioptimalkan...",
      ${includeMetaTags ? `
      "metaTitle": "Judul meta yang dioptimalkan untuk SEO",
      "metaDescription": "Meta description yang menarik dan mengandung kata kunci",` : ""}
      "suggestedH1": "Saran judul H1 yang optimal",
      "suggestedHeadings": ["Saran heading H2 #1", "Saran heading H2 #2", ...],
      "recommendedKeywords": ["kata kunci 1", "kata kunci 2", ...],
      "contentScore": 85, // Skor antara 0-100
      "recommendations": ["Rekomendasi #1", "Rekomendasi #2", ...],
      ${includeSchemaMarkup ? `"schemaMarkup": "JSON-LD Schema Markup yang direkomendasikan",` : ""}
      ${includeTags ? `"tags": ["tag1", "tag2", "tag3", ...],` : ""}
    }
    
    Panduan optimasi:
    1. Masukkan kata kunci utama di awal konten, dalam heading, dan tersebar secara alami di seluruh teks
    2. Optimalkan kepadatan kata kunci (sekitar 1-2%)
    3. Perbaiki readability dengan paragraf pendek dan subheading yang jelas
    4. Tambahkan internal linking jika relevan
    5. Sertakan saran untuk meta title dan meta description yang optimal (max 60 karakter untuk title, max 160 karakter untuk description)
    6. Berikan rekomendasi untuk meningkatkan skor SEO konten
    `;

    // Generate the optimized content
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
      }
    });

    let responseText = result.response.text();
    
    try {
      // Hapus markdown code blocks jika ada
      responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      
      // Parse JSON response
      const parsedResponse = JSON.parse(responseText);
      return {
        optimizedContent: parsedResponse.optimizedContent || "Maaf, tidak dapat mengoptimalkan konten ini.",
        metaTitle: parsedResponse.metaTitle,
        metaDescription: parsedResponse.metaDescription,
        suggestedH1: parsedResponse.suggestedH1,
        suggestedHeadings: parsedResponse.suggestedHeadings || [],
        recommendedKeywords: parsedResponse.recommendedKeywords || [],
        contentScore: parsedResponse.contentScore,
        recommendations: parsedResponse.recommendations || [],
        schemaMarkup: parsedResponse.schemaMarkup,
        tags: parsedResponse.tags || []
      };
    } catch (parseError) {
      console.error("Error parsing SEO content optimization response:", parseError);
      console.error("Raw response:", responseText);
      
      // If JSON parsing fails, return the raw text as the optimized content
      return {
        optimizedContent: responseText || "Terjadi kesalahan dalam memformat hasil optimasi. Silakan coba lagi.",
        suggestedHeadings: [],
        recommendedKeywords: [],
        recommendations: []
      };
    }
  } catch (error: any) {
    console.error("Error optimizing SEO content:", error);
    throw new Error(`Failed to optimize SEO content: ${error.message}`);
  }
}

// Function to generate professional emails
export async function generateEmail(
  userPrompt: string,
  emailType: string = "business",
  recipient: string = "",
  subject: string = "",
  keyPoints: string[] = [],
  tone: string = "professional",
  length: string = "medium",
  formalityLevel: number = 7,
  includeSignature: boolean = true,
  language: string = "id",
  additionalContext?: string
): Promise<{
  email: {
    subject: string;
    body: string;
  };
  alternatives?: {
    subject: string;
    body: string;
  }[];
}> {
  try {
    // Initialize the API with the API key
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Use the Gemini 2.0 Flash model for email generation
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Format key points if there are any
    const keyPointsText = keyPoints.filter(point => point.trim() !== "").length > 0 
      ? `Poin penting yang perlu dimasukkan:\n${keyPoints.filter(point => point.trim() !== "").map(point => `- ${point}`).join("\n")}`
      : "";

    // Map email length to word count
    const lengthToWords: {[key: string]: string} = {
      "short": "~100 kata",
      "medium": "~200 kata",
      "long": "~300 kata"
    };

    // Map languages to their full names
    const languageNames: {[key: string]: string} = {
      "id": "Bahasa Indonesia",
      "en": "English",
      "jw": "Bahasa Jawa",
      "su": "Bahasa Sunda"
    };

    // Build prompt for email generation
    const promptText = `
    Anda adalah asisten penulis email profesional yang berpengalaman. Buatkan email yang menarik berdasarkan informasi berikut:

    Tujuan email: ${userPrompt}
    Jenis email: ${emailType}
    Penerima: ${recipient || "Tidak ditentukan"}
    Subjek: ${subject || "Buat subjek yang sesuai"}
    ${keyPointsText}
    Nada bahasa: ${tone}
    Panjang email: ${lengthToWords[length] || "~200 kata"}
    Tingkat formalitas (skala 1-10): ${formalityLevel}
    Sertakan tanda tangan: ${includeSignature ? "Ya" : "Tidak"}
    Bahasa: ${languageNames[language] || "Bahasa Indonesia"}
    ${additionalContext ? `Konteks tambahan: ${additionalContext}` : ""}

    Buat email yang profesional, jelas, dan menarik yang mencapai tujuan komunikasi. Sertakan subjek yang relevan dan buat variasi alternatif (minimal 2) dari email tersebut.

    Harap berikan respons dalam format JSON dengan struktur berikut (tanpa tanda backtick atau markdown):

    {
      "email": {
        "subject": "Subjek email utama",
        "body": "Isi email utama dengan format yang tepat termasuk pembuka, isi, penutup, dan tanda tangan jika diminta"
      },
      "alternatives": [
        {
          "subject": "Alternatif subjek 1",
          "body": "Alternatif isi email 1"
        },
        {
          "subject": "Alternatif subjek 2",
          "body": "Alternatif isi email 2"
        }
      ]
    }
    `;

    // Generate the email
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: promptText }] }],
      generationConfig: {
        temperature: 0.7,
      }
    });

    let responseText = result.response.text();
    
    try {
      // Hapus markdown code blocks jika ada (```json atau ```)
      responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      // Parse JSON response
      const parsedResponse = JSON.parse(responseText);
      return {
        email: {
          subject: parsedResponse.email?.subject || "Tidak ada subjek",
          body: parsedResponse.email?.body || "Terjadi kesalahan dalam pembuatan email."
        },
        alternatives: parsedResponse.alternatives || []
      };
    } catch (parseError) {
      console.error("Error parsing email generation response:", parseError);
      console.error("Raw response:", responseText);
      
      // If JSON parsing fails, try to extract information manually
      const emailSubjectMatch = responseText.match(/Subject:|Subjek:|Subject: (.*?)\n/i);
      const emailSubject = emailSubjectMatch ? emailSubjectMatch[1].trim() : "Email baru";
      
      return {
        email: {
          subject: emailSubject,
          body: responseText || "Terjadi kesalahan dalam format hasil. Silakan coba lagi."
        },
        alternatives: []
      };
    }
  } catch (error: any) {
    console.error("Error generating email:", error);
    throw new Error(`Failed to generate email: ${error.message}`);
  }
}

// Function for translating text
export async function translateText(
  text: string,
  sourceLanguage: string = "auto",
  targetLanguage: string = "id",
  preserveFormatting: boolean = true,
  formalityLevel: string = "standard",
  additionalInstructions?: string
): Promise<{
  translatedText: string;
  detectedLanguage?: string;
  alternativeTranslations?: string[];
}> {
  try {
    // Initialize the API with the API key
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Use the Gemini 2.0 Flash model for translation
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Create language name maps
    const languageNames: {[key: string]: string} = {
      "en": "English",
      "id": "Indonesian",
      "es": "Spanish",
      "fr": "French",
      "de": "German",
      "it": "Italian",
      "ja": "Japanese",
      "ko": "Korean",
      "pt": "Portuguese",
      "ru": "Russian",
      "zh": "Chinese",
      "ar": "Arabic",
      "hi": "Hindi",
      "tr": "Turkish",
      "vi": "Vietnamese",
      "th": "Thai",
      "auto": "Auto-detected"
    };

    // Get friendly language names
    const sourceLangName = languageNames[sourceLanguage] || sourceLanguage;
    const targetLangName = languageNames[targetLanguage] || targetLanguage;

    // Build formality level instruction
    let formalityInstruction = "";
    if (formalityLevel === "formal") {
      formalityInstruction = "Use formal language and polite expressions.";
    } else if (formalityLevel === "informal") {
      formalityInstruction = "Use casual, conversational language.";
    } else if (formalityLevel === "technical") {
      formalityInstruction = "Use technical terminology appropriate for professional contexts.";
    }

    // Build prompt for translation
    const prompt = `
    Translate the following text ${sourceLanguage === "auto" ? "" : `from ${sourceLangName}`} to ${targetLangName}.
    
    ${preserveFormatting ? "Preserve the original formatting, including paragraphs, bullet points, and special characters." : ""}
    ${formalityInstruction}
    ${additionalInstructions ? `Additional instructions: ${additionalInstructions}` : ""}
    
    If the source language is auto-detected, please include the detected language in your response.
    
    TEXT TO TRANSLATE:
    ${text}
    
    Please respond in JSON format with the following structure (without any markdown formatting or backticks):
    {
      "translatedText": "Your translation here...",
      ${sourceLanguage === "auto" ? `"detectedLanguage": "The detected language",` : ""}
      "alternativeTranslations": ["Alternative 1", "Alternative 2"]
    }
    `;

    // Generate the translation
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2, // Lower temperature for more accurate translations
      }
    });

    let responseText = result.response.text();
    
    try {
      // Remove markdown code blocks if present
      responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      
      // Parse JSON response
      const parsedResponse = JSON.parse(responseText);
      return {
        translatedText: parsedResponse.translatedText || "Translation error occurred.",
        detectedLanguage: parsedResponse.detectedLanguage,
        alternativeTranslations: parsedResponse.alternativeTranslations || []
      };
    } catch (parseError) {
      console.error("Error parsing translation response:", parseError);
      console.error("Raw response:", responseText);
      
      // If JSON parsing fails, extract translated text as best as possible
      // Look for patterns that might contain the translation
      const lines = responseText.split('\n').filter(line => line.trim() !== '');
      const translatedText = lines.length > 0 ? lines.join('\n') : responseText;
      
      return {
        translatedText,
        detectedLanguage: sourceLanguage === "auto" ? "Unknown" : undefined,
        alternativeTranslations: []
      };
    }
  } catch (error: any) {
    console.error("Error translating text:", error);
    throw new Error(`Failed to translate text: ${error.message}`);
  }
}

export async function generateRecipe(
  ingredients?: string[],
  dishType?: string,
  cuisine?: string,
  dietaryRestrictions?: string[],
  cookingTime?: string,
  skillLevel?: string,
  calories?: string,
  mealType?: string,
  servings?: number,
  taste?: string[],
  occasion?: string,
  includeNutrition: boolean = true,
  includeStepByStep: boolean = true,
  includeVariations: boolean = true,
  language: string = "id",
  additionalInstructions?: string
): Promise<{
  recipe: {
    title: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    prepTime?: string;
    cookTime?: string;
    totalTime?: string;
    servings?: number;
    calories?: string;
    nutrition?: {
      protein?: string;
      carbs?: string;
      fat?: string;
      sugar?: string;
      fiber?: string;
    };
    tips?: string[];
    variations?: string[];
    image?: string;
  };
}> {
  try {
    // Initialize the API with the API key
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Use the Gemini 2.0 Flash model for recipe generation
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Build the prompt for recipe generation
    let recipePrompt = "Buatkan resep makanan ";
    
    if (language === "en") {
      recipePrompt = "Create a food recipe ";
    }
    
    // Add ingredients if provided
    if (ingredients && ingredients.length > 0) {
      if (language === "id") {
        recipePrompt += `menggunakan bahan-bahan berikut: ${ingredients.join(", ")}. `;
      } else {
        recipePrompt += `using the following ingredients: ${ingredients.join(", ")}. `;
      }
    }
    
    // Add dish type if provided
    if (dishType) {
      if (language === "id") {
        recipePrompt += `Jenis hidangan: ${dishType}. `;
      } else {
        recipePrompt += `Dish type: ${dishType}. `;
      }
    }
    
    // Add cuisine if provided
    if (cuisine) {
      if (language === "id") {
        recipePrompt += `Masakan: ${cuisine}. `;
      } else {
        recipePrompt += `Cuisine: ${cuisine}. `;
      }
    }
    
    // Add dietary restrictions if provided
    if (dietaryRestrictions && dietaryRestrictions.length > 0) {
      if (language === "id") {
        recipePrompt += `Batasan diet: ${dietaryRestrictions.join(", ")}. `;
      } else {
        recipePrompt += `Dietary restrictions: ${dietaryRestrictions.join(", ")}. `;
      }
    }
    
    // Add cooking time if provided
    if (cookingTime) {
      if (language === "id") {
        recipePrompt += `Waktu memasak: ${cookingTime}. `;
      } else {
        recipePrompt += `Cooking time: ${cookingTime}. `;
      }
    }
    
    // Add skill level if provided
    if (skillLevel) {
      if (language === "id") {
        recipePrompt += `Tingkat kesulitan: ${skillLevel}. `;
      } else {
        recipePrompt += `Skill level: ${skillLevel}. `;
      }
    }
    
    // Add calories if provided
    if (calories) {
      if (language === "id") {
        recipePrompt += `Jumlah kalori: ${calories}. `;
      } else {
        recipePrompt += `Calories: ${calories}. `;
      }
    }
    
    // Add meal type if provided
    if (mealType) {
      if (language === "id") {
        recipePrompt += `Jenis makanan: ${mealType}. `;
      } else {
        recipePrompt += `Meal type: ${mealType}. `;
      }
    }
    
    // Add servings if provided
    if (servings) {
      if (language === "id") {
        recipePrompt += `Untuk ${servings} porsi. `;
      } else {
        recipePrompt += `For ${servings} servings. `;
      }
    }
    
    // Add taste preferences if provided
    if (taste && taste.length > 0) {
      if (language === "id") {
        recipePrompt += `Preferensi rasa: ${taste.join(", ")}. `;
      } else {
        recipePrompt += `Taste preferences: ${taste.join(", ")}. `;
      }
    }
    
    // Add occasion if provided
    if (occasion) {
      if (language === "id") {
        recipePrompt += `Untuk acara: ${occasion}. `;
      } else {
        recipePrompt += `For occasion: ${occasion}. `;
      }
    }
    
    // Add request for nutrition info if needed
    if (includeNutrition) {
      if (language === "id") {
        recipePrompt += "Sertakan informasi nutrisi. ";
      } else {
        recipePrompt += "Include nutrition information. ";
      }
    }
    
    // Add request for step-by-step instructions
    if (includeStepByStep) {
      if (language === "id") {
        recipePrompt += "Berikan instruksi terperinci langkah demi langkah. ";
      } else {
        recipePrompt += "Provide detailed step-by-step instructions. ";
      }
    }
    
    // Add request for variations
    if (includeVariations) {
      if (language === "id") {
        recipePrompt += "Berikan beberapa variasi resep. ";
      } else {
        recipePrompt += "Provide some recipe variations. ";
      }
    }
    
    // Add additional instructions if provided
    if (additionalInstructions) {
      recipePrompt += `${additionalInstructions} `;
    }
    
    // Request structured JSON response
    if (language === "id") {
      recipePrompt += `Berikan respons dalam format JSON dengan struktur berikut:
      {
        "recipe": {
          "title": "judul resep",
          "description": "deskripsi singkat resep",
          "ingredients": ["bahan 1", "bahan 2", ...],
          "instructions": ["langkah 1", "langkah 2", ...],
          "prepTime": "waktu persiapan",
          "cookTime": "waktu memasak",
          "totalTime": "total waktu",
          "servings": jumlah porsi,
          "calories": "kalori per porsi",
          "nutrition": {
            "protein": "jumlah protein",
            "carbs": "jumlah karbohidrat",
            "fat": "jumlah lemak",
            "sugar": "jumlah gula",
            "fiber": "jumlah serat"
          },
          "tips": ["tips 1", "tips 2", ...],
          "variations": ["variasi 1", "variasi 2", ...]
        }
      }`;
    } else {
      recipePrompt += `Provide the response in JSON format with the following structure:
      {
        "recipe": {
          "title": "recipe title",
          "description": "brief recipe description",
          "ingredients": ["ingredient 1", "ingredient 2", ...],
          "instructions": ["step 1", "step 2", ...],
          "prepTime": "preparation time",
          "cookTime": "cooking time",
          "totalTime": "total time",
          "servings": number of servings,
          "calories": "calories per serving",
          "nutrition": {
            "protein": "protein amount",
            "carbs": "carbs amount",
            "fat": "fat amount",
            "sugar": "sugar amount",
            "fiber": "fiber amount"
          },
          "tips": ["tip 1", "tip 2", ...],
          "variations": ["variation 1", "variation 2", ...]
        }
      }`;
    }

    // Generate the recipe content
    const result = await model.generateContent(recipePrompt);
    const responseText = result.response.text();
    
    // Parse the JSON response
    try {
      // Hapus markdown code blocks jika ada
      const cleanedResponse = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      // Coba parse respon JSON
      try {
        const parsedResponse = JSON.parse(cleanedResponse);
        return parsedResponse;
      } catch (jsonError) {
        console.error("Error parsing JSON from Gemini API:", jsonError);
        
        // Jika parsing JSON gagal, kita gunakan fungsi parseRecipeResponse dari geminiApi-recipe
        return import('./geminiApi-recipe').then(api => {
          const parseFunc = api.parseRecipeResponse;
          if (typeof parseFunc === 'function') {
            return parseFunc(cleanedResponse);
          } else {
            throw new Error("parseRecipeResponse function not found");
          }
        });
      }
    } catch (parseError) {
      console.error("Error parsing JSON from Gemini API:", parseError);
      
      // Create a fallback structured response
      const fallbackResponse = {
        recipe: {
          title: "Resep Makanan",
          description: "Tidak dapat memproses format JSON dari respon AI.",
          ingredients: [],
          instructions: [responseText],
        }
      };
      
      if (language === "en") {
        fallbackResponse.recipe.title = "Food Recipe";
        fallbackResponse.recipe.description = "Could not process JSON format from AI response.";
      }
      
      return fallbackResponse;
    }
  } catch (error: any) {
    console.error("Error generating recipe with Gemini API:", error);
    throw new Error(`Failed to generate recipe: ${error.message}`);
  }
}

/**
 * Review code for quality, security issues, and best practices
 * @param code The code to review
 * @param language Programming language of the code
 * @param reviewType Type of review to perform
 * @param additionalInstructions Additional instructions for the review
 * @param includeCodeExamples Whether to include code examples in the review
 * @param includeSuggestions Whether to include suggestions in the review
 * @returns Detailed code review with quality analysis, issues, and recommendations
 */
export async function reviewCode(
  code: string,
  language: string,
  reviewType: string,
  additionalInstructions?: string,
  includeCodeExamples: boolean = true,
  includeSuggestions: boolean = true
): Promise<{
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
}> {
  try {
    // Get API key from environment
    const GEMINI_API_KEY = process.env.GENAI_API_KEY;
    if (!GEMINI_API_KEY) {
      throw new Error("Gemini API key is not configured");
    }

    // Initialize the API with the API key
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Use the Gemini 2.0 Flash model for code review
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Create prompt based on review type and user code
    let prompt = `Review the following ${language} code`;
    
    if (reviewType === "quality") {
      prompt += " for code quality issues";
    } else if (reviewType === "security") {
      prompt += " for security vulnerabilities";
    } else if (reviewType === "best-practices") {
      prompt += " for adherence to best practices";
    } else if (reviewType === "all") {
      prompt += " for all aspects: code quality, security vulnerabilities, and adherence to best practices";
    }
    
    if (additionalInstructions) {
      prompt += `. Additional specific instructions: ${additionalInstructions}`;
    }
    
    prompt += `\n\nCode to review:\n\`\`\`${language}\n${code}\n\`\`\`\n\n`;
    
    prompt += "Your output should be in the following JSON format (no markdown, just plain JSON):\n";
    prompt += "{\n";
    prompt += '  "summary": "Brief summary of the overall code review",\n';
    prompt += '  "qualityScore": 85, // Score between 0-100 representing code quality\n';
    prompt += '  "issues": [\n';
    prompt += '    {\n';
    prompt += '      "type": "issue type (e.g., bug, code smell, etc.)",\n';
    prompt += '      "severity": "low/medium/high/critical",\n';
    prompt += '      "description": "Detailed description of the issue",\n';
    prompt += '      "line": 25, // Optional line number where the issue appears\n';
    prompt += '      "suggestion": "Suggested fix for the issue", // Optional\n';
    prompt += '      "codeExample": "Example of fixed code" // Optional\n';
    prompt += '    }\n';
    prompt += '  ],\n';
    prompt += '  "bestPractices": ["Best practice 1", "Best practice 2"],\n';
    
    if (reviewType === "security" || reviewType === "all") {
      prompt += '  "securityIssues": [\n';
      prompt += '    {\n';
      prompt += '      "vulnerability": "Name of vulnerability",\n';
      prompt += '      "severity": "low/medium/high/critical",\n';
      prompt += '      "description": "Description of the security issue",\n';
      prompt += '      "remediation": "How to fix the security issue"\n';
      prompt += '    }\n';
      prompt += '  ],\n';
    }
    
    if (includeSuggestions) {
      prompt += '  "suggestions": ["Suggestion 1", "Suggestion 2"],\n';
    }
    
    prompt += '  "overallRecommendation": "Overall recommendation for improving the code"\n';
    prompt += "}\n";
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    try {
      // Parse the JSON response
      const cleanedResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedResponse = JSON.parse(cleanedResponse);
      
      // Ensure that all required fields are present, add defaults if missing
      return {
        summary: parsedResponse.summary || "Code review completed",
        qualityScore: parsedResponse.qualityScore || 0,
        issues: parsedResponse.issues || [],
        bestPractices: parsedResponse.bestPractices || [],
        securityIssues: parsedResponse.securityIssues || undefined,
        suggestions: includeSuggestions ? (parsedResponse.suggestions || []) : undefined,
        overallRecommendation: parsedResponse.overallRecommendation || "No specific recommendations"
      };
    } catch (parseError) {
      console.error("Error parsing code review response:", parseError);
      console.error("Raw response:", response);
      
      // Return a fallback response
      return {
        summary: "Unable to parse the AI response properly",
        qualityScore: 0,
        issues: [
          {
            type: "parsing_error",
            severity: "medium",
            description: "The AI response couldn't be properly parsed. Please try again."
          }
        ],
        bestPractices: [],
        overallRecommendation: "Please try reviewing the code again."
      };
    }
  } catch (error: any) {
    console.error("Error reviewing code:", error);
    throw error;
  }
}

/**
 * Generate jingle for brand marketing using Google Gemini AI
 * @param brand Brand name
 * @param purpose Purpose of the jingle (e.g., tv_commercial, radio_ad, corporate_event)
 * @param mood Mood of the jingle (e.g., upbeat, inspiring, emotional)
 * @param length Length of the jingle (e.g., short, medium, long)
 * @param targetAudience Target audience for the jingle
 * @param style Style of jingle (e.g., musical, spoken_word, rhyming)
 * @param includeTagline Whether to include a tagline
 * @param tagline Optional existing tagline to incorporate
 * @param additionalInstructions Additional instructions for jingle creation
 * @returns Generated jingle with variations and notes
 */
export async function generateJingle(
  brand: string,
  purpose: string,
  mood: string,
  length: string,
  targetAudience: string,
  style: string,
  includeTagline: boolean = false,
  tagline?: string,
  additionalInstructions?: string
): Promise<{
  jingle: string;
  variations?: string[];
  tagline?: string;
  explanation?: string;
  notes?: string;
}> {
  try {
    // Get API key from environment
    const GEMINI_API_KEY = process.env.GENAI_API_KEY;
    if (!GEMINI_API_KEY) {
      throw new Error("Gemini API key is not configured");
    }

    // Initialize the API with the API key
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Use the Gemini Pro model for jingle creation
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Prepare the prompt
    let prompt = `Create a creative and catchy jingle for a brand with the following specifications:

Brand: ${brand}
Purpose: ${purpose}
Mood: ${mood}
Length: ${length}
Target Audience: ${targetAudience}
Style: ${style}
`;

    if (includeTagline) {
      if (tagline) {
        prompt += `Existing Tagline to incorporate: ${tagline}\n`;
      } else {
        prompt += "Please also create a memorable tagline to go with the jingle.\n";
      }
    }

    if (additionalInstructions) {
      prompt += `Additional Instructions: ${additionalInstructions}\n`;
    }

    prompt += `\nPlease provide:
1. The main jingle
2. 2-3 variations of the jingle
3. A brief explanation of why this jingle works well for the brand and audience
4. Any notes on rhythm, tempo, or musical elements that would enhance the jingle

Your output should be in the following JSON format (no markdown, just plain JSON):
{
  "jingle": "The main jingle lyrics/text",
  "variations": ["Variation 1", "Variation 2", "Variation 3"],
  "tagline": "A catchy tagline (if requested)",
  "explanation": "Explanation of why this jingle works for the brand",
  "notes": "Notes on rhythm, tempo, or musical elements"
}
`;

    // Generate content with Gemini
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    try {
      // Parse the JSON response
      const cleanedResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedResponse = JSON.parse(cleanedResponse);
      
      // Ensure that all required fields are present, add defaults if missing
      return {
        jingle: parsedResponse.jingle || "Could not generate jingle",
        variations: parsedResponse.variations || [],
        tagline: includeTagline ? (parsedResponse.tagline || "") : undefined,
        explanation: parsedResponse.explanation || "",
        notes: parsedResponse.notes || ""
      };
    } catch (parseError) {
      console.error("Error parsing jingle response:", parseError);
      console.error("Raw response:", response);
      
      // Extract jingle from non-JSON response as fallback
      const jingleMatch = response.match(/jingle["\s]*:[\s"]*([^"]+)/i);
      const jingle = jingleMatch ? jingleMatch[1] : "Could not generate jingle";
      
      return {
        jingle,
        explanation: "Error parsing full response from AI"
      };
    }
  } catch (error: any) {
    console.error("Error generating jingle with Gemini API:", error);
    throw new Error(`Failed to generate jingle: ${error.message}`);
  }
}

/**
 * Generate a comprehensive business plan using Google Gemini AI
 * @param businessType Type of business (e.g., startup, small_business, franchise)
 * @param industry Industry sector (e.g., technology, retail, healthcare)
 * @param targetMarket Target market or customer base
 * @param location Business location or geographical target
 * @param missionStatement Business mission statement (optional)
 * @param uniqueSellingProposition Unique selling proposition (optional)
 * @param budgetRange Initial budget range (optional)
 * @param timeFrame Expected time frame for launch/growth (optional)
 * @param teamSize Size of team or planned hiring (optional)
 * @param competitiveAdvantage Competitive advantages (optional)
 * @param additionalContext Any additional context or requirements (optional)
 * @param planLength Desired length of business plan
 * @param includeFinancials Whether to include financial projections
 * @param includeMarketAnalysis Whether to include market analysis
 * @param includeExecutiveSummary Whether to include executive summary
 * @param includeCompetitorAnalysis Whether to include competitor analysis
 * @param includeMarketingStrategy Whether to include marketing strategy
 * @param includeRiskAnalysis Whether to include risk analysis
 * @returns Complete business plan with selected components
 */
export async function generateBusinessPlan(
  businessType: string,
  industry: string,
  targetMarket: string,
  location: string,
  missionStatement?: string,
  uniqueSellingProposition?: string,
  budgetRange?: string,
  timeFrame?: string,
  teamSize?: string,
  competitiveAdvantage?: string,
  additionalContext?: string,
  planLength: "short" | "medium" | "long" = "medium",
  language: "id" | "en" = "id",
  includeFinancials: boolean = true,
  includeMarketAnalysis: boolean = true,
  includeExecutiveSummary: boolean = true,
  includeCompetitorAnalysis: boolean = true,
  includeMarketingStrategy: boolean = true,
  includeRiskAnalysis: boolean = true
): Promise<{
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
}> {
  try {
    // Get API key from environment
    const GEMINI_API_KEY = process.env.GENAI_API_KEY;
    if (!GEMINI_API_KEY) {
      throw new Error("Gemini API key is not configured");
    }

    // Initialize the API with the API key
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Use the most capable Gemini model for comprehensive business planning
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Prepare the prompt with comprehensive business plan requirements
    const outputLanguage = language === "id" ? "Indonesian" : "English";
    let prompt = `Create a detailed business plan for a ${businessType} in the ${industry} industry, targeting ${targetMarket} and located in ${location}. Write the entire business plan in ${outputLanguage} language.`;

    if (missionStatement) {
      prompt += `\nMission Statement: ${missionStatement}`;
    }

    if (uniqueSellingProposition) {
      prompt += `\nUnique Selling Proposition: ${uniqueSellingProposition}`;
    }

    if (budgetRange) {
      prompt += `\nBudget Range: ${budgetRange}`;
    }

    if (timeFrame) {
      prompt += `\nTime Frame: ${timeFrame}`;
    }

    if (teamSize) {
      prompt += `\nTeam Size: ${teamSize}`;
    }

    if (competitiveAdvantage) {
      prompt += `\nCompetitive Advantage: ${competitiveAdvantage}`;
    }

    if (additionalContext) {
      prompt += `\nAdditional Context: ${additionalContext}`;
    }

    // Configure the length of the plan
    let wordCount;
    switch (planLength) {
      case "short":
        wordCount = 1500;
        break;
      case "medium":
        wordCount = 3000;
        break;
      case "long":
        wordCount = 5000;
        break;
      default:
        wordCount = 3000;
    }

    prompt += `\n\nThe business plan should be approximately ${wordCount} words and include the following sections:`;

    // Add sections based on the requested includes
    if (includeExecutiveSummary) {
      prompt += "\n- Executive Summary";
    }
    prompt += "\n- Business Description";
    prompt += "\n- Mission and Vision";
    
    if (includeMarketAnalysis) {
      prompt += "\n- Market Analysis (including market overview, trends, target customers, market size, and growth potential)";
    }
    
    if (includeCompetitorAnalysis) {
      prompt += "\n- Competitor Analysis (including main competitors with their strengths and weaknesses, and your competitive advantage)";
    }
    
    if (includeMarketingStrategy) {
      prompt += "\n- Marketing Strategy (including channels, promotional activities, pricing strategy, and sales process)";
    }
    
    prompt += "\n- Operations and Management (including team structure, key roles, facilities, equipment, and suppliers)";
    
    if (includeFinancials) {
      prompt += "\n- Financial Projections (including startup costs, monthly expenses, projected revenue, break-even analysis, and funding needed)";
    }
    
    if (includeRiskAnalysis) {
      prompt += "\n- Risk Analysis (including key risks, their potential impact, and mitigation strategies)";
    }
    
    prompt += "\n- Implementation Timeline (including phases, descriptions, and timeframes)";
    prompt += "\n- Conclusion";

    prompt += `\n\nPlease output a well-structured, comprehensive business plan in the following JSON format (no markdown, just plain JSON):
    {
      ${includeExecutiveSummary ? '"executiveSummary": "Concise summary of the business plan",\n' : ''}
      "businessDescription": "Detailed description of the business",
      "missionAndVision": "Statement of mission and vision",
      ${includeMarketAnalysis ? `"marketAnalysis": {
        "overview": "Overview of the market",
        "trends": ["Trend 1", "Trend 2", "Trend 3"],
        "targetCustomers": "Description of target customers",
        "marketSize": "Estimated market size",
        "growthPotential": "Growth potential of the market"
      },\n` : ''}
      ${includeCompetitorAnalysis ? `"competitorAnalysis": {
        "overview": "Overview of the competitive landscape",
        "mainCompetitors": [
          {
            "name": "Competitor 1",
            "strengths": ["Strength 1", "Strength 2"],
            "weaknesses": ["Weakness 1", "Weakness 2"]
          },
          {
            "name": "Competitor 2",
            "strengths": ["Strength 1", "Strength 2"],
            "weaknesses": ["Weakness 1", "Weakness 2"]
          }
        ],
        "competitiveAdvantage": "Your competitive advantage"
      },\n` : ''}
      ${includeMarketingStrategy ? `"marketingStrategy": {
        "overview": "Overview of marketing approach",
        "channels": ["Channel 1", "Channel 2", "Channel 3"],
        "promotionalActivities": ["Activity 1", "Activity 2", "Activity 3"],
        "pricingStrategy": "Description of pricing strategy",
        "salesProcess": "Description of sales process"
      },\n` : ''}
      "operationsAndManagement": {
        "overview": "Overview of operations and management",
        "teamStructure": "Description of team structure",
        "keyRoles": ["Role 1", "Role 2", "Role 3"],
        "facilities": "Description of facilities",
        "equipment": "Required equipment",
        "suppliers": "Key suppliers"
      },
      ${includeFinancials ? `"financials": {
        "overview": "Overview of financial projections",
        "startupCosts": "Estimated startup costs",
        "monthlyExpenses": "Estimated monthly expenses",
        "projectedRevenue": "Projected revenue for first year and beyond",
        "breakEvenAnalysis": "Break-even analysis",
        "fundingNeeded": "Amount of funding needed"
      },\n` : ''}
      ${includeRiskAnalysis ? `"riskAnalysis": {
        "overview": "Overview of risks",
        "keyRisks": [
          {
            "description": "Risk 1 description",
            "impact": "high", 
            "mitigationStrategy": "Strategy to mitigate Risk 1"
          },
          {
            "description": "Risk 2 description",
            "impact": "medium",
            "mitigationStrategy": "Strategy to mitigate Risk 2"
          }
        ]
      },\n` : ''}
      "implementationTimeline": {
        "overview": "Overview of implementation timeline",
        "milestones": [
          {
            "phase": "Phase 1",
            "description": "Description of Phase 1",
            "timeframe": "Timeframe for Phase 1"
          },
          {
            "phase": "Phase 2",
            "description": "Description of Phase 2",
            "timeframe": "Timeframe for Phase 2"
          }
        ]
      },
      "conclusion": "Concluding thoughts and next steps"
    }`;

    // Generate content with Gemini
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    try {
      // Parse the JSON response
      const cleanedResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedResponse = JSON.parse(cleanedResponse);
      
      // Ensure required fields are present
      return {
        executiveSummary: includeExecutiveSummary ? parsedResponse.executiveSummary : undefined,
        businessDescription: parsedResponse.businessDescription || "Business description not provided",
        missionAndVision: parsedResponse.missionAndVision,
        marketAnalysis: includeMarketAnalysis ? parsedResponse.marketAnalysis : undefined,
        competitorAnalysis: includeCompetitorAnalysis ? parsedResponse.competitorAnalysis : undefined,
        marketingStrategy: includeMarketingStrategy ? parsedResponse.marketingStrategy : undefined,
        operationsAndManagement: parsedResponse.operationsAndManagement,
        financials: includeFinancials ? parsedResponse.financials : undefined,
        riskAnalysis: includeRiskAnalysis ? parsedResponse.riskAnalysis : undefined,
        implementationTimeline: parsedResponse.implementationTimeline,
        conclusion: parsedResponse.conclusion
      };
    } catch (parseError) {
      console.error("Error parsing business plan response:", parseError);
      console.error("Raw response:", response);
      
      // Return a simple response if parsing fails
      return {
        businessDescription: "Error generating comprehensive business plan. Please try again with different parameters.",
        missionAndVision: "Error processing the request."
      };
    }
  } catch (error: any) {
    console.error("Error generating business plan with Gemini API:", error);
    throw new Error(`Failed to generate business plan: ${error.message}`);
  }
}

/**
 * Generate contract using Google Gemini AI
 * @param contractType Type of contract (e.g., employment, rental, service, nda)
 * @param details Key details about the contract
 * @param party1 Name and details of the first party
 * @param party2 Name and details of the second party
 * @param additionalClauses Any additional clauses to include
 * @param specificRequirements Specific requirements or custom elements
 * @returns Generated contract text
 */
export async function generateContract(
  contractType: string,
  details: string,
  party1: string,
  party2: string,
  additionalClauses?: string,
  specificRequirements?: string
): Promise<string> {
  try {
    // Initialize the API with the API key
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Use the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Prepare the prompt
    const prompt = `
      Buatkan kontrak profesional jenis ${contractType} dengan detail berikut:
      
      Detail Kontrak: ${details}
      Pihak Pertama: ${party1}
      Pihak Kedua: ${party2}
      ${additionalClauses ? `Klausa Tambahan: ${additionalClauses}` : ''}
      ${specificRequirements ? `Persyaratan Khusus: ${specificRequirements}` : ''}
      
      Kontrak harus dalam Bahasa Indonesia dan mengikuti format hukum standar.
      Sertakan semua bagian yang diperlukan seperti para pihak, ketentuan, kewajiban, kondisi pengakhiran, dan tanda tangan.
      Pastikan kontrak secara hukum adalah tepat dan mengikuti praktik umum untuk kontrak ${contractType}.
      Jangan sertakan tanda kutip di awal atau akhir.
    `;
    
    // Generate content with Gemini
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error("Error generating contract with Gemini API:", error);
    throw new Error(`Failed to generate contract: ${error.message}`);
  }
}

/**
 * Enhance contract draft using Google Gemini AI
 * @param contractDraft The draft contract text to enhance
 * @param enhancementType Type of enhancement (e.g., clarity, compliance, protection)
 * @param jurisdiction Jurisdiction for legal compliance
 * @param industry Industry context for specialized terms
 * @returns Enhanced contract text
 */
export async function enhanceContract(
  contractDraft: string,
  enhancementType?: string,
  jurisdiction?: string,
  industry?: string
): Promise<string> {
  try {
    // Initialize the API with the API key
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Use the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Prepare the prompt
    const prompt = `
      Perbaiki dan tingkatkan draft kontrak berikut:
      
      ${contractDraft}
      
      ${enhancementType ? `Fokus pada peningkatan aspek: ${enhancementType}` : 'Perbaiki kejelasan dan ketegasan hukum secara umum'}
      ${jurisdiction ? `Kontrak ini berada di bawah yurisdiksi: ${jurisdiction}` : ''}
      ${industry ? `Kontrak ini untuk industri: ${industry}` : ''}
      
      Instruksi:
      1. Perbaiki bahasa yang ambigu atau kurang jelas
      2. Tambahkan klausa perlindungan yang mungkin terlewat
      3. Pastikan konsistensi istilah dan definisi
      4. Tingkatkan keterbacaan format
      5. Berikan kontrak yang ditingkatkan secara utuh tanpa penjelasan tambahan
      6. Jangan sertakan tanda kutip di awal atau akhir
    `;
    
    // Generate content with Gemini
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error("Error enhancing contract with Gemini API:", error);
    throw new Error(`Failed to enhance contract: ${error.message}`);
  }
}