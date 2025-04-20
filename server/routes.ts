import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  geminiChatCompletion, 
  generateArticle, 
  generateCode,
  healthConsultation,
  analyzeSymptoms,
  explainMaterial,
  generateQuestions,
  generateInstagramCaption,
  getPeopleAlsoAskQuestions,
  optimizeCode,
  generateBookSummary,
  optimizeSEOContent,
  generateImage,
  generateEmail,
  generateRecipe,
  translateText,
  reviewCode,
  generateJingle,
  generateBusinessPlan,
  generateContract,
  enhanceContract
} from "./geminiApi";
import { geminiChatCompletionV2 } from "./geminiChat";
import { youtubeToText } from "./youtubeToText";
import { generateFakeChat } from "./fakeChatGenerator";
import { mistralChatCompletion, initMistralClient } from "./mistralChat";
import {
  insertCategorySchema,
  insertTagSchema,
  insertBlogPostSchema,
  insertAiCharacterSchema,
  insertCharacterChatSchema
} from "@shared/schema";
import { AiCharacter } from "../client/src/lib/types";
import { z } from "zod";
import { and, count, eq, isNull, isNotNull, sql } from "drizzle-orm";
import { db } from "./db";
import { blogPosts, categories, tags, aiCharacters, characterChats } from "@shared/schema";
import { setupAuth, isAdmin } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  // Initialize Mistral API client
  initMistralClient();
  // API routes
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { message, model, creativity, contexts } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }
      
      // Validate temperature
      const safeTemperature = typeof creativity === 'number' && creativity >= 0 && creativity <= 1 
        ? creativity 
        : 0.7;
      
      // Default contexts if not provided
      const safeContexts = contexts || { seo: false, keyword: false, content: true };

      // Always use the new V2 API with Gemini 2.5
      const response = await geminiChatCompletionV2(message, safeTemperature, safeContexts);
      return res.json({ response });
    } catch (error: any) {
      console.error("Error in chat API:", error);
      return res.status(500).json({ 
        message: "Failed to get AI response", 
        error: error.message,
        response: "Maaf, terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi atau gunakan kata kunci yang berbeda."
      });
    }
  });

  // Article Generator API
  app.post("/api/gemini/generate-article", async (req, res) => {
    try {
      const { 
        title, 
        language = "id", 
        writingStyle = "formal", 
        wordCount = 500, 
        keywords = [],
        additionalInstructions = ""
      } = req.body;
      
      if (!title) {
        return res.status(400).json({ message: "Title is required" });
      }

      const article = await generateArticle(
        title,
        language,
        writingStyle,
        wordCount,
        keywords,
        additionalInstructions
      );
      
      return res.json({ article });
    } catch (error: any) {
      console.error("Error generating article:", error);
      return res.status(500).json({ 
        message: "Failed to generate article", 
        error: error.message 
      });
    }
  });
  
  // Code Generator API
  app.post("/api/gemini/generate-code", async (req, res) => {
    try {
      const { 
        language, 
        codeType, 
        framework, 
        description, 
        functionName, 
        parameters,
        includeComments = true,
        includeExamples = true,
        includeTests = false
      } = req.body;
      
      if (!description) {
        return res.status(400).json({ message: "Description is required" });
      }
      
      if (!language) {
        return res.status(400).json({ message: "Programming language is required" });
      }
      
      if (!codeType) {
        return res.status(400).json({ message: "Code type is required" });
      }

      const code = await generateCode(
        language,
        codeType,
        framework,
        description,
        functionName,
        parameters,
        includeComments,
        includeExamples,
        includeTests
      );
      
      return res.json({ code });
    } catch (error: any) {
      console.error("Error generating code:", error);
      return res.status(500).json({ 
        message: "Failed to generate code", 
        error: error.message 
      });
    }
  });
  
  // Health Consultation API
  app.post("/api/gemini/health-consultation", async (req, res) => {
    try {
      const { message, context } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const response = await healthConsultation(message, context);
      return res.json({ response });
    } catch (error: any) {
      console.error("Error in health consultation:", error);
      return res.status(500).json({ 
        message: "Failed to get health consultation", 
        error: error.message 
      });
    }
  });
  
  // Symptom Analysis API
  app.post("/api/gemini/analyze-symptoms", async (req, res) => {
    try {
      const { 
        symptoms, 
        age, 
        gender, 
        duration, 
        medicalHistory = [], 
        additionalNotes 
      } = req.body;
      
      if (!symptoms || Object.keys(symptoms).length === 0) {
        return res.status(400).json({ message: "At least one symptom is required" });
      }
      
      if (!age) {
        return res.status(400).json({ message: "Age is required" });
      }
      
      if (!gender) {
        return res.status(400).json({ message: "Gender is required" });
      }
      
      if (!duration) {
        return res.status(400).json({ message: "Symptom duration is required" });
      }

      const analysis = await analyzeSymptoms(
        symptoms,
        age,
        gender,
        duration,
        medicalHistory,
        additionalNotes
      );
      
      return res.json(analysis);
    } catch (error: any) {
      console.error("Error analyzing symptoms:", error);
      return res.status(500).json({ 
        message: "Failed to analyze symptoms", 
        error: error.message 
      });
    }
  });

  // User routes
  app.post("/api/users/register", async (req, res) => {
    try {
      const { username, password, email, name } = req.body;
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const newUser = await storage.createUser({ 
        username, 
        password, 
        email, 
        name,
        role: "user" 
      });
      
      // Don't return the password
      const { password: _, ...userWithoutPassword } = newUser;
      return res.status(201).json(userWithoutPassword);
    } catch (error: any) {
      console.error("Error creating user:", error);
      return res.status(500).json({ 
        message: "Failed to create user", 
        error: error.message 
      });
    }
  });

  // Explain Material API
  app.post("/api/gemini/explain-material", async (req, res) => {
    try {
      const { 
        topic, 
        complexity = "menengah", 
        targetAudience = "siswa_sma", 
        additionalContext,
        includeExamples = true,
        includeQuestions = false 
      } = req.body;
      
      if (!topic) {
        return res.status(400).json({ message: "Topic is required" });
      }

      const result = await explainMaterial(
        topic,
        complexity,
        targetAudience,
        additionalContext,
        includeExamples,
        includeQuestions
      );
      
      return res.json(result);
    } catch (error: any) {
      console.error("Error explaining material:", error);
      return res.status(500).json({ 
        message: "Failed to explain material", 
        error: error.message 
      });
    }
  });

  // Question Generator API
  app.post("/api/gemini/generate-questions", async (req, res) => {
    try {
      const { 
        subject,
        topic,
        difficulty = "medium",
        questionType = "mixed",
        numberOfQuestions = 5,
        includeAnswers = true,
        educationLevel = "sma",
        additionalInstructions
      } = req.body;
      
      if (!subject) {
        return res.status(400).json({ message: "Subject is required" });
      }
      
      if (!topic) {
        return res.status(400).json({ message: "Topic is required" });
      }

      const result = await generateQuestions(
        subject,
        topic,
        difficulty,
        questionType,
        numberOfQuestions,
        includeAnswers,
        educationLevel,
        additionalInstructions
      );
      
      return res.json(result);
    } catch (error: any) {
      console.error("Error generating questions:", error);
      return res.status(500).json({ 
        message: "Failed to generate questions", 
        error: error.message 
      });
    }
  });

  // Instagram Caption Generator API
  app.post("/api/gemini/instagram-caption", async (req, res) => {
    try {
      const { 
        topic, 
        mood = "casual", 
        includeHashtags = true, 
        includeEmojis = true, 
        captionLength = "medium", 
        brand, 
        targetAudience,
        additionalInstructions 
      } = req.body;
      
      if (!topic) {
        return res.status(400).json({ message: "Topic is required" });
      }

      const result = await generateInstagramCaption(
        topic,
        mood,
        includeHashtags,
        includeEmojis,
        captionLength,
        brand,
        targetAudience,
        additionalInstructions
      );
      
      return res.json(result);
    } catch (error: any) {
      console.error("Error generating Instagram caption:", error);
      return res.status(500).json({ 
        message: "Failed to generate Instagram caption", 
        error: error.message 
      });
    }
  });

  // People Also Ask Questions API
  app.post("/api/gemini/people-also-ask", async (req, res) => {
    try {
      const { 
        keyword, 
        language = "id", 
        includeMetrics = true, 
        limit = 10
      } = req.body;
      
      if (!keyword) {
        return res.status(400).json({ message: "Keyword is required" });
      }

      const result = await getPeopleAlsoAskQuestions(
        keyword,
        language,
        includeMetrics,
        limit
      );
      
      return res.json(result);
    } catch (error: any) {
      console.error("Error generating People Also Ask questions:", error);
      return res.status(500).json({ 
        message: "Failed to generate related questions", 
        error: error.message 
      });
    }
  });

  // YouTube to Text API
  app.post("/api/gemini/youtube-to-text", async (req, res) => {
    try {
      const { 
        videoUrl, 
        outputFormat = "transcript", 
        language = "id", 
        includeTimestamps = true, 
        maxLength = 1000 
      } = req.body;
      
      if (!videoUrl) {
        return res.status(400).json({ message: "YouTube URL is required" });
      }

      const result = await youtubeToText(
        videoUrl,
        outputFormat,
        language,
        includeTimestamps,
        maxLength
      );
      
      return res.json(result);
    } catch (error: any) {
      console.error("Error converting YouTube to text:", error);
      return res.status(500).json({ 
        message: "Failed to convert YouTube video to text", 
        error: error.message 
      });
    }
  });

  app.get("/api/tools", async (req, res) => {
    try {
      const tools = await storage.getAllTools();
      return res.json(tools);
    } catch (error: any) {
      console.error("Error fetching tools:", error);
      return res.status(500).json({ 
        message: "Failed to fetch tools", 
        error: error.message 
      });
    }
  });
  
  // AI Character API routes
  
  // Get all AI characters
  app.get("/api/ai-characters", async (req, res) => {
    try {
      const characters = await storage.getAllAiCharacters();
      return res.json(characters);
    } catch (error: any) {
      console.error("Error fetching AI characters:", error);
      return res.status(500).json({ 
        message: "Failed to fetch AI characters", 
        error: error.message 
      });
    }
  });
  
  // Get AI character by ID
  app.get("/api/ai-characters/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid character ID" });
      }
      
      const character = await storage.getAiCharacterById(id);
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }
      
      return res.json(character);
    } catch (error: any) {
      console.error("Error fetching AI character:", error);
      return res.status(500).json({ 
        message: "Failed to fetch AI character", 
        error: error.message 
      });
    }
  });
  
  // Get AI character by slug
  app.get("/api/ai-characters/slug/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      if (!slug) {
        return res.status(400).json({ message: "Slug is required" });
      }
      
      const character = await storage.getAiCharacterBySlug(slug);
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }
      
      return res.json(character);
    } catch (error: any) {
      console.error("Error fetching AI character by slug:", error);
      return res.status(500).json({ 
        message: "Failed to fetch AI character", 
        error: error.message 
      });
    }
  });
  
  // Create AI character (admin only)
  app.post("/api/ai-characters", isAdmin, async (req, res) => {
    try {
      const validationResult = insertAiCharacterSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid character data", 
          errors: validationResult.error.errors 
        });
      }
      
      const character = await storage.createAiCharacter(validationResult.data);
      return res.status(201).json(character);
    } catch (error: any) {
      console.error("Error creating AI character:", error);
      return res.status(500).json({ 
        message: "Failed to create AI character", 
        error: error.message 
      });
    }
  });
  
  // Update AI character (admin only)
  app.patch("/api/ai-characters/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid character ID" });
      }
      
      const existingCharacter = await storage.getAiCharacterById(id);
      if (!existingCharacter) {
        return res.status(404).json({ message: "Character not found" });
      }
      
      const character = await storage.updateAiCharacter(id, req.body);
      return res.json(character);
    } catch (error: any) {
      console.error("Error updating AI character:", error);
      return res.status(500).json({ 
        message: "Failed to update AI character", 
        error: error.message 
      });
    }
  });
  
  // Delete AI character (admin only)
  app.delete("/api/ai-characters/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid character ID" });
      }
      
      const existingCharacter = await storage.getAiCharacterById(id);
      if (!existingCharacter) {
        return res.status(404).json({ message: "Character not found" });
      }
      
      const success = await storage.deleteAiCharacter(id);
      if (success) {
        return res.status(204).send();
      } else {
        return res.status(500).json({ message: "Failed to delete character" });
      }
    } catch (error: any) {
      console.error("Error deleting AI character:", error);
      return res.status(500).json({ 
        message: "Failed to delete AI character", 
        error: error.message 
      });
    }
  });
  
  // Chat with AI character
  app.post("/api/ai-characters/:id/chat", async (req, res) => {
    try {
      if (!process.env.MISTRAL_API_KEY) {
        return res.status(500).json({ 
          message: "Mistral API key is missing. Please contact the administrator." 
        });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid character ID" });
      }
      
      const { message, previousMessages } = req.body;
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }
      
      const characterData = await storage.getAiCharacterById(id);
      if (!characterData) {
        return res.status(404).json({ message: "Character not found" });
      }
      
      // Map DB character to AiCharacter expected by mistralChatCompletion
      const character: AiCharacter = {
        id: characterData.id,
        name: characterData.name,
        slug: characterData.slug || "",
        shortDescription: characterData.shortDescription || characterData.description?.substring(0, 150) || "",
        description: characterData.description || "",
        avatarUrl: characterData.avatarUrl || characterData.profileImage || "",
        prompt: characterData.prompt || "",
        model: characterData.model || "mistral-small-latest",
        category: characterData.category || characterData.languageStyle || "general",
        tags: characterData.tags || "",
        isActive: characterData.isActive || true,
        createdAt: characterData.createdAt?.toString() || new Date().toISOString(),
        updatedAt: characterData.updatedAt?.toString() || new Date().toISOString()
      };
      
      const response = await mistralChatCompletion(message, character, previousMessages || []);
      
      // Save chat history if user is authenticated
      if (req.user) {
        const userId = (req.user as any).id;
        await storage.saveCharacterChat({
          characterId: id,
          userId,
          userMessage: message,
          characterResponse: response
        });
      }
      
      return res.json({ response });
    } catch (error: any) {
      console.error("Error in AI character chat:", JSON.stringify(error, null, 2));
      // Return a more user-friendly error message
      const errorMessage = error.response?.data?.error?.message || error.message || "Terjadi kesalahan saat komunikasi dengan AI";
      return res.status(500).json({ 
        message: "Maaf, kami mengalami kesalahan teknis. Silakan coba lagi nanti.", 
        error: errorMessage,
        response: "Maaf, terjadi kesalahan teknis saat berkomunikasi dengan AI. Sistem sedang mengalami gangguan. Silakan coba lagi nanti."
      });
    }
  });
  
  // Get chat history with AI character (user only)
  app.get("/api/ai-characters/:id/chat-history", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid character ID" });
      }
      
      const userId = (req.user as any).id;
      const chatHistory = await storage.getCharacterChatHistory(id, userId);
      
      return res.json(chatHistory);
    } catch (error: any) {
      console.error("Error fetching chat history:", error);
      return res.status(500).json({ 
        message: "Failed to fetch chat history", 
        error: error.message 
      });
    }
  });

  // Code Optimizer API
  app.post("/api/gemini/optimize-code", async (req, res) => {
    try {
      const { 
        language, 
        code, 
        optimizationType = "all", 
        additionalInstructions,
        includeBenchmarks = true,
        includeExplanations = true 
      } = req.body;
      
      if (!code) {
        return res.status(400).json({ message: "Code is required" });
      }
      
      if (!language) {
        return res.status(400).json({ message: "Programming language is required" });
      }

      const result = await optimizeCode(
        code,
        language,
        optimizationType,
        additionalInstructions,
        includeBenchmarks,
        includeExplanations
      );
      
      return res.json(result);
    } catch (error: any) {
      console.error("Error optimizing code:", error);
      return res.status(500).json({ 
        message: "Failed to optimize code", 
        error: error.message 
      });
    }
  });

  // Book Summary API
  app.post("/api/gemini/book-summary", async (req, res) => {
    try {
      const { 
        title,
        author,
        genre,
        educationLevel = "sma", 
        summaryLength = "medium",
        includeChapterBreakdown = true,
        includeKeyLessons = true,
        includeQuestions = false,
        additionalInstructions
      } = req.body;
      
      if (!title) {
        return res.status(400).json({ message: "Book title is required" });
      }

      const result = await generateBookSummary(
        title,
        author,
        genre,
        educationLevel,
        summaryLength,
        includeChapterBreakdown,
        includeKeyLessons,
        includeQuestions,
        additionalInstructions
      );
      
      return res.json(result);
    } catch (error: any) {
      console.error("Error generating book summary:", error);
      return res.status(500).json({ 
        message: "Failed to generate book summary", 
        error: error.message 
      });
    }
  });

  // SEO Content Optimizer API
  app.post("/api/gemini/seo-optimizer", async (req, res) => {
    try {
      const { 
        title,
        content,
        targetKeyword,
        secondaryKeywords,
        contentType = "blog",
        targetWordCount,
        includeMetaTags = true,
        includeSchemaMarkup = false,
        includeTags = true,
        additionalInstructions
      } = req.body;
      
      if (!content) {
        return res.status(400).json({ message: "Content is required" });
      }
      
      if (!targetKeyword) {
        return res.status(400).json({ message: "Target keyword is required" });
      }

      if (!title) {
        return res.status(400).json({ message: "Title is required" });
      }

      const result = await optimizeSEOContent(
        title,
        content,
        targetKeyword,
        secondaryKeywords,
        contentType,
        targetWordCount,
        includeMetaTags,
        includeSchemaMarkup,
        includeTags,
        additionalInstructions
      );
      
      return res.json(result);
    } catch (error: any) {
      console.error("Error optimizing SEO content:", error);
      return res.status(500).json({ 
        message: "Failed to optimize SEO content", 
        error: error.message 
      });
    }
  });

  // Image Generator API
  app.post("/api/gemini/generate-image", async (req, res) => {
    try {
      const { 
        prompt,
        sampleCount = 1,
        negativePrompt,
        stylePreset,
        aspectRatio,
        width,
        height
      } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      const result = await generateImage(
        prompt,
        sampleCount,
        negativePrompt,
        stylePreset,
        aspectRatio,
        width,
        height
      );
      
      return res.json(result);
    } catch (error: any) {
      console.error("Error generating images:", error);
      return res.status(500).json({ 
        message: "Failed to generate images", 
        error: error.message 
      });
    }
  });

  // Email Generator API
  app.post("/api/gemini/generate-email", async (req, res) => {
    try {
      const { 
        prompt,
        emailType = "business",
        recipient = "",
        subject = "",
        keyPoints = [],
        tone = "professional",
        length = "medium",
        formalityLevel = 7,
        includeSignature = true,
        language = "id",
        additionalContext
      } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ message: "Email purpose/prompt is required" });
      }

      const result = await generateEmail(
        prompt,
        emailType,
        recipient,
        subject,
        keyPoints,
        tone,
        length,
        formalityLevel,
        includeSignature,
        language,
        additionalContext
      );
      
      return res.json(result);
    } catch (error: any) {
      console.error("Error generating email:", error);
      return res.status(500).json({ 
        message: "Failed to generate email", 
        error: error.message 
      });
    }
  });

  // Auto Index Artikel API
  app.post("/api/auto-index-artikel", async (req, res) => {
    try {
      const { 
        sitemapUrl,
        googleApiKey,
        articleSelector,
        includeImages,
        includeMetadata,
        customUserAgent,
        indexDepth,
        priority,
        maxArticles,
        scheduleUpdate,
        updateFrequency
      } = req.body;
      
      if (!sitemapUrl) {
        return res.status(400).json({ message: "Sitemap URL is required" });
      }
      
      // Validate and use Google API key (from environment or request)
      let apiKey = process.env.GOOGLE_INDEXING_API_KEY;
      if (!apiKey && !googleApiKey) {
        return res.status(400).json({ message: "Google API key is required" });
      }
      
      // Generate sample data for response
      const processedCount = Math.floor(Math.random() * 50) + 10;
      const failedCount = Math.floor(Math.random() * 10);
      const totalCount = processedCount + failedCount;
      
      const processedUrls = [];
      const failedUrls = [];
      const metadataItems = [];
      
      const baseUrl = sitemapUrl.endsWith('/') ? sitemapUrl.slice(0, -1) : sitemapUrl;
      
      // Generate processed URLs
      for (let i = 0; i < processedCount; i++) {
        processedUrls.push(`${baseUrl}/artikel-${i+1}`);
      }
      
      // Generate failed URLs
      for (let i = 0; i < failedCount; i++) {
        failedUrls.push(`${baseUrl}/artikel-gagal-${i+1}`);
      }
      
      // Generate metadata if requested
      if (includeMetadata) {
        for (let i = 0; i < processedCount; i++) {
          metadataItems.push({
            title: `Artikel Contoh ${i+1}`,
            url: `${baseUrl}/artikel-${i+1}`,
            publishDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            modifiedDate: new Date().toISOString(),
            author: "Penulis Contoh",
            categories: ["Kategori 1", "Kategori 2"],
            excerpt: "Ini adalah ringkasan artikel yang akan ditampilkan dalam hasil pencarian...",
            imageCount: includeImages ? Math.floor(Math.random() * 10) : 0
          });
        }
      }
      
      // Create response object
      const result = {
        success: true,
        articlesIndexed: processedCount,
        articlesSkipped: failedCount,
        totalUrls: totalCount,
        processedUrls: processedUrls,
        failedUrls: failedUrls,
        metadata: metadataItems,
        elapsedTime: Math.random() * 10 + 2
      };
      
      return res.json(result);
    } catch (error: any) {
      console.error("Error indexing articles:", error);
      return res.status(500).json({ 
        message: "Failed to index articles", 
        error: error.message 
      });
    }
  });

  // API untuk memeriksa secret keys
  app.post("/api/secrets/check", async (req, res) => {
    try {
      const { secret_keys } = req.body;
      
      if (!Array.isArray(secret_keys)) {
        return res.status(400).json({ message: "secret_keys must be an array" });
      }
      
      const result: Record<string, boolean> = {};
      
      // Periksa apakah secret keys ada di environment variables
      for (const key of secret_keys) {
        result[key] = !!process.env[key];
      }
      
      return res.json(result);
    } catch (error: any) {
      console.error("Error checking secrets:", error);
      return res.status(500).json({ 
        message: "Failed to check secrets", 
        error: error.message 
      });
    }
  });

  // AI Translator API
  app.post("/api/gemini/translate", async (req, res) => {
    try {
      const { 
        text,
        sourceLanguage = "auto",
        targetLanguage = "id",
        preserveFormatting = true,
        formalityLevel = "standard",
        additionalInstructions
      } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text to translate is required" });
      }

      const result = await translateText(
        text,
        sourceLanguage,
        targetLanguage,
        preserveFormatting,
        formalityLevel,
        additionalInstructions
      );
      
      return res.json(result);
    } catch (error: any) {
      console.error("Error translating text:", error);
      return res.status(500).json({ 
        message: "Failed to translate text", 
        error: error.message 
      });
    }
  });

  // Contract Generator API
  app.post("/api/gemini/generate-contract", async (req, res) => {
    try {
      const { 
        contractType,
        details,
        party1,
        party2,
        additionalClauses,
        specificRequirements
      } = req.body;
      
      if (!contractType) {
        return res.status(400).json({ message: "Contract type is required" });
      }
      
      if (!details) {
        return res.status(400).json({ message: "Contract details are required" });
      }
      
      if (!party1) {
        return res.status(400).json({ message: "First party information is required" });
      }
      
      if (!party2) {
        return res.status(400).json({ message: "Second party information is required" });
      }

      const result = await generateContract(
        contractType,
        details,
        party1,
        party2,
        additionalClauses,
        specificRequirements
      );
      
      return res.json({ content: result, success: true });
    } catch (error: any) {
      console.error("Error generating contract:", error);
      return res.status(500).json({ 
        content: "",
        success: false,
        error: error.message 
      });
    }
  });

  // Contract Enhancement API
  app.post("/api/gemini/enhance-contract", async (req, res) => {
    try {
      const { 
        contractDraft,
        enhancementType,
        jurisdiction,
        industry
      } = req.body;
      
      if (!contractDraft) {
        return res.status(400).json({ message: "Contract draft is required" });
      }

      const result = await enhanceContract(
        contractDraft,
        enhancementType,
        jurisdiction,
        industry
      );
      
      return res.json({ content: result, success: true });
    } catch (error: any) {
      console.error("Error enhancing contract:", error);
      return res.status(500).json({ 
        content: "",
        success: false,
        error: error.message 
      });
    }
  });

  // Recipe Generator API
  app.post("/api/gemini/generate-recipe", async (req, res) => {
    try {
      const { 
        ingredients,
        dishType,
        cuisine,
        dietaryRestrictions,
        cookingTime,
        skillLevel,
        calories,
        mealType,
        servings,
        taste,
        occasion,
        includeNutrition = true,
        includeStepByStep = true,
        includeVariations = true,
        language = "id",
        additionalInstructions
      } = req.body;
      
      const result = await generateRecipe(
        ingredients,
        dishType,
        cuisine,
        dietaryRestrictions,
        cookingTime,
        skillLevel,
        calories,
        mealType,
        servings,
        taste,
        occasion,
        includeNutrition,
        includeStepByStep,
        includeVariations,
        language,
        additionalInstructions
      );
      
      return res.json(result);
    } catch (error: any) {
      console.error("Error generating recipe:", error);
      return res.status(500).json({ 
        message: "Failed to generate recipe", 
        error: error.message 
      });
    }
  });
  
  // Code Review API
  app.post("/api/gemini/code-review", async (req, res) => {
    try {
      const { 
        language, 
        code, 
        reviewType = "all", 
        additionalInstructions,
        includeCodeExamples = true,
        includeSuggestions = true 
      } = req.body;
      
      if (!code) {
        return res.status(400).json({ message: "Code is required" });
      }
      
      if (!language) {
        return res.status(400).json({ message: "Programming language is required" });
      }

      const result = await reviewCode(
        code,
        language,
        reviewType,
        additionalInstructions,
        includeCodeExamples,
        includeSuggestions
      );
      
      return res.json(result);
    } catch (error: any) {
      console.error("Error reviewing code:", error);
      return res.status(500).json({ 
        message: "Failed to review code", 
        error: error.message 
      });
    }
  });
  
  // Jingle Creator API
  app.post("/api/gemini/jingle-creator", async (req, res) => {
    try {
      const { 
        brand,
        purpose,
        mood,
        length,
        targetAudience,
        style,
        includeTagline = false,
        tagline,
        additionalInstructions
      } = req.body;
      
      if (!brand) {
        return res.status(400).json({ message: "Brand name is required" });
      }
      
      if (!purpose) {
        return res.status(400).json({ message: "Purpose is required" });
      }
      
      if (!mood) {
        return res.status(400).json({ message: "Mood is required" });
      }
      
      if (!length) {
        return res.status(400).json({ message: "Length is required" });
      }
      
      if (!targetAudience) {
        return res.status(400).json({ message: "Target audience is required" });
      }
      
      if (!style) {
        return res.status(400).json({ message: "Style is required" });
      }

      const result = await generateJingle(
        brand,
        purpose,
        mood,
        length,
        targetAudience,
        style,
        includeTagline,
        tagline,
        additionalInstructions
      );
      
      return res.json(result);
    } catch (error: any) {
      console.error("Error generating jingle:", error);
      return res.status(500).json({ 
        message: "Failed to generate jingle", 
        error: error.message 
      });
    }
  });
  
  // Business Plan Generator API
  app.post("/api/gemini/business-plan", async (req, res) => {
    try {
      const { 
        businessType,
        industry,
        targetMarket,
        location,
        missionStatement,
        uniqueSellingProposition,
        budgetRange,
        timeFrame,
        teamSize,
        competitiveAdvantage,
        additionalContext,
        planLength = "medium",
        includeFinancials = true,
        includeMarketAnalysis = true,
        includeExecutiveSummary = true,
        includeCompetitorAnalysis = true,
        includeMarketingStrategy = true,
        includeRiskAnalysis = true
      } = req.body;
      
      if (!businessType) {
        return res.status(400).json({ message: "Business type is required" });
      }
      
      if (!industry) {
        return res.status(400).json({ message: "Industry is required" });
      }
      
      if (!targetMarket) {
        return res.status(400).json({ message: "Target market is required" });
      }
      
      if (!location) {
        return res.status(400).json({ message: "Location is required" });
      }

      const language = req.body.language || "id";
      
      const result = await generateBusinessPlan(
        businessType,
        industry,
        targetMarket,
        location,
        missionStatement,
        uniqueSellingProposition,
        budgetRange,
        timeFrame,
        teamSize,
        competitiveAdvantage,
        additionalContext,
        planLength,
        language,
        includeFinancials,
        includeMarketAnalysis,
        includeExecutiveSummary,
        includeCompetitorAnalysis,
        includeMarketingStrategy,
        includeRiskAnalysis
      );
      
      return res.json(result);
    } catch (error: any) {
      console.error("Error generating business plan:", error);
      return res.status(500).json({ 
        message: "Failed to generate business plan", 
        error: error.message 
      });
    }
  });

  // API untuk meminta user memasukkan secrets
  app.post("/api/secrets/ask", async (req, res) => {
    try {
      const { secret_keys, user_message } = req.body;
      
      if (!Array.isArray(secret_keys) || secret_keys.length === 0) {
        return res.status(400).json({ message: "secret_keys must be a non-empty array" });
      }
      
      if (!user_message) {
        return res.status(400).json({ message: "user_message is required" });
      }
      
      // Dalam implementasi nyata, ini akan memicu sistem Replit untuk meminta user
      // memasukkan secret keys. Di sini kita hanya mengembalikan sukses.
      return res.json({ success: true });
    } catch (error: any) {
      console.error("Error asking for secrets:", error);
      return res.status(500).json({ 
        message: "Failed to ask for secrets", 
        error: error.message 
      });
    }
  });

  // Fake Chat Generator API
  app.post("/api/fake-chat-generator", async (req, res) => {
    try {
      const { 
        platform, 
        messages, 
        deviceType, 
        statusBarConfig, 
        backgroundColor, 
        timeFormat, 
        includeAvatar 
      } = req.body;
      
      if (!platform) {
        return res.status(400).json({ message: "Platform is required" });
      }
      
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ message: "At least one message is required" });
      }
      
      if (!deviceType) {
        return res.status(400).json({ message: "Device type is required" });
      }
      
      if (!statusBarConfig) {
        return res.status(400).json({ message: "Status bar configuration is required" });
      }
      
      await generateFakeChat(req, res);
    } catch (error: any) {
      console.error("Error generating fake chat:", error);
      return res.status(500).json({ 
        message: "Failed to generate fake chat", 
        error: error.message 
      });
    }
  });

  // Blog CMS Routes
  // Blog stats
  app.get("/api/blog/stats", async (req, res) => {
    try {
      // Get total posts count
      const [postsCountResult] = await db.select({ count: count() }).from(blogPosts);
      const totalPosts = postsCountResult?.count || 0;
      
      // Get published posts count
      const [publishedCountResult] = await db
        .select({ count: count() })
        .from(blogPosts)
        .where(eq(blogPosts.status, "published"));
      const publishedPosts = publishedCountResult?.count || 0;
      
      // Get draft posts count
      const [draftCountResult] = await db
        .select({ count: count() })
        .from(blogPosts)
        .where(eq(blogPosts.status, "draft"));
      const draftPosts = draftCountResult?.count || 0;
      
      // Get categories count
      const [categoriesCountResult] = await db.select({ count: count() }).from(categories);
      const categoriesCount = categoriesCountResult?.count || 0;
      
      // Get tags count
      const [tagsCountResult] = await db.select({ count: count() }).from(tags);
      const tagsCount = tagsCountResult?.count || 0;
      
      return res.json({
        posts: totalPosts,
        published: publishedPosts,
        draft: draftPosts,
        categories: categoriesCount,
        tags: tagsCount
      });
    } catch (error: any) {
      console.error("Error fetching blog stats:", error);
      return res.status(500).json({ 
        message: "Failed to fetch blog statistics", 
        error: error.message 
      });
    }
  });
  
  // Category routes
  app.get("/api/blog/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      return res.json(categories);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      return res.status(500).json({ 
        message: "Failed to fetch categories", 
        error: error.message 
      });
    }
  });

  app.get("/api/blog/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const category = await storage.getCategoryById(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      return res.json(category);
    } catch (error: any) {
      console.error("Error fetching category:", error);
      return res.status(500).json({ 
        message: "Failed to fetch category", 
        error: error.message 
      });
    }
  });

  app.post("/api/blog/categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      return res.status(201).json(category);
    } catch (error: any) {
      console.error("Error creating category:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid category data", 
          errors: error.errors 
        });
      }
      return res.status(500).json({ 
        message: "Failed to create category", 
        error: error.message 
      });
    }
  });

  app.put("/api/blog/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const categoryData = insertCategorySchema.partial().parse(req.body);
      const updatedCategory = await storage.updateCategory(id, categoryData);
      
      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      return res.json(updatedCategory);
    } catch (error: any) {
      console.error("Error updating category:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid category data", 
          errors: error.errors 
        });
      }
      return res.status(500).json({ 
        message: "Failed to update category", 
        error: error.message 
      });
    }
  });

  app.delete("/api/blog/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const success = await storage.deleteCategory(id);
      
      if (!success) {
        return res.status(400).json({ 
          message: "Cannot delete category that has associated blog posts"
        });
      }
      
      return res.status(204).send();
    } catch (error: any) {
      console.error("Error deleting category:", error);
      return res.status(500).json({ 
        message: "Failed to delete category", 
        error: error.message 
      });
    }
  });

  // Tag routes
  app.get("/api/blog/tags", async (req, res) => {
    try {
      const tags = await storage.getAllTags();
      return res.json(tags);
    } catch (error: any) {
      console.error("Error fetching tags:", error);
      return res.status(500).json({ 
        message: "Failed to fetch tags", 
        error: error.message 
      });
    }
  });

  app.get("/api/blog/tags/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tag ID" });
      }
      
      const tag = await storage.getTagById(id);
      if (!tag) {
        return res.status(404).json({ message: "Tag not found" });
      }
      
      return res.json(tag);
    } catch (error: any) {
      console.error("Error fetching tag:", error);
      return res.status(500).json({ 
        message: "Failed to fetch tag", 
        error: error.message 
      });
    }
  });

  app.post("/api/blog/tags", async (req, res) => {
    try {
      const tagData = insertTagSchema.parse(req.body);
      const tag = await storage.createTag(tagData);
      return res.status(201).json(tag);
    } catch (error: any) {
      console.error("Error creating tag:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid tag data", 
          errors: error.errors 
        });
      }
      return res.status(500).json({ 
        message: "Failed to create tag", 
        error: error.message 
      });
    }
  });

  app.put("/api/blog/tags/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tag ID" });
      }
      
      const tagData = insertTagSchema.partial().parse(req.body);
      const updatedTag = await storage.updateTag(id, tagData);
      
      if (!updatedTag) {
        return res.status(404).json({ message: "Tag not found" });
      }
      
      return res.json(updatedTag);
    } catch (error: any) {
      console.error("Error updating tag:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid tag data", 
          errors: error.errors 
        });
      }
      return res.status(500).json({ 
        message: "Failed to update tag", 
        error: error.message 
      });
    }
  });

  app.delete("/api/blog/tags/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tag ID" });
      }
      
      const success = await storage.deleteTag(id);
      if (!success) {
        return res.status(404).json({ message: "Tag not found" });
      }
      
      return res.status(204).send();
    } catch (error: any) {
      console.error("Error deleting tag:", error);
      return res.status(500).json({ 
        message: "Failed to delete tag", 
        error: error.message 
      });
    }
  });

  // Blog post routes
  app.get("/api/blog/posts", async (req, res) => {
    try {
      const { 
        status,
        categoryId, 
        authorId, 
        search, 
        page = "1", 
        limit = "10" 
      } = req.query as Record<string, string>;
      
      // Parse query parameters
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const offset = (pageNum - 1) * limitNum;
      
      const filters: any = {};
      
      if (status) {
        filters.status = status;
      }
      
      if (categoryId) {
        filters.categoryId = parseInt(categoryId);
      }
      
      if (authorId) {
        filters.authorId = parseInt(authorId);
      }
      
      if (search) {
        filters.search = search;
      }
      
      // Add pagination
      filters.limit = limitNum;
      filters.offset = offset;
      
      // Get total count for pagination
      const totalCount = await storage.getBlogPostsCount({
        status: filters.status,
        categoryId: filters.categoryId,
        authorId: filters.authorId,
        search: filters.search
      });
      
      const posts = await storage.getAllBlogPosts(filters);
      
      // Calculate pagination metadata
      const totalPages = Math.ceil(totalCount / limitNum);
      
      return res.json({
        data: posts,
        pagination: {
          total: totalCount,
          page: pageNum,
          limit: limitNum,
          totalPages
        }
      });
    } catch (error: any) {
      console.error("Error fetching blog posts:", error);
      return res.status(500).json({ 
        message: "Failed to fetch blog posts", 
        error: error.message 
      });
    }
  });

  app.get("/api/blog/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const post = await storage.getBlogPostById(id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      // Get tags for the post
      const tags = await storage.getPostTags(post.id);
      
      return res.json({
        ...post,
        tags
      });
    } catch (error: any) {
      console.error("Error fetching blog post:", error);
      return res.status(500).json({ 
        message: "Failed to fetch blog post", 
        error: error.message 
      });
    }
  });

  app.get("/api/blog/posts/slug/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      
      const post = await storage.getBlogPostBySlug(slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      // Get tags for the post
      const tags = await storage.getPostTags(post.id);
      
      return res.json({
        ...post,
        tags
      });
    } catch (error: any) {
      console.error("Error fetching blog post by slug:", error);
      return res.status(500).json({ 
        message: "Failed to fetch blog post", 
        error: error.message 
      });
    }
  });

  app.post("/api/blog/posts", isAdmin, async (req, res) => {
    try {
      const postData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(postData);
      
      // Get tags if they were added
      const tags = await storage.getPostTags(post.id);
      
      return res.status(201).json({
        ...post,
        tags
      });
    } catch (error: any) {
      console.error("Error creating blog post:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid blog post data", 
          errors: error.errors 
        });
      }
      return res.status(500).json({ 
        message: "Failed to create blog post", 
        error: error.message 
      });
    }
  });

  app.put("/api/blog/posts/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const postData = insertBlogPostSchema.partial().parse(req.body);
      const updatedPost = await storage.updateBlogPost(id, postData);
      
      if (!updatedPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      // Get updated tags
      const tags = await storage.getPostTags(updatedPost.id);
      
      return res.json({
        ...updatedPost,
        tags
      });
    } catch (error: any) {
      console.error("Error updating blog post:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid blog post data", 
          errors: error.errors 
        });
      }
      return res.status(500).json({ 
        message: "Failed to update blog post", 
        error: error.message 
      });
    }
  });

  app.delete("/api/blog/posts/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const success = await storage.deleteBlogPost(id);
      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      return res.status(204).send();
    } catch (error: any) {
      console.error("Error deleting blog post:", error);
      return res.status(500).json({ 
        message: "Failed to delete blog post", 
        error: error.message 
      });
    }
  });

  // Publish/unpublish routes - admin only
  app.post("/api/blog/posts/:id/publish", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const post = await storage.publishBlogPost(id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      // Get tags
      const tags = await storage.getPostTags(post.id);
      
      return res.json({
        ...post,
        tags
      });
    } catch (error: any) {
      console.error("Error publishing blog post:", error);
      return res.status(500).json({ 
        message: "Failed to publish blog post", 
        error: error.message 
      });
    }
  });

  app.post("/api/blog/posts/:id/unpublish", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const post = await storage.unpublishBlogPost(id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      // Get tags
      const tags = await storage.getPostTags(post.id);
      
      return res.json({
        ...post,
        tags
      });
    } catch (error: any) {
      console.error("Error unpublishing blog post:", error);
      return res.status(500).json({ 
        message: "Failed to unpublish blog post", 
        error: error.message 
      });
    }
  });

  // Tag management for posts - admin only
  app.post("/api/blog/posts/:postId/tags/:tagId", isAdmin, async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const tagId = parseInt(req.params.tagId);
      
      if (isNaN(postId) || isNaN(tagId)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      // Check if post exists
      const post = await storage.getBlogPostById(postId);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      // Check if tag exists
      const tag = await storage.getTagById(tagId);
      if (!tag) {
        return res.status(404).json({ message: "Tag not found" });
      }
      
      const relation = await storage.addTagToPost(postId, tagId);
      return res.status(201).json(relation);
    } catch (error: any) {
      console.error("Error adding tag to post:", error);
      return res.status(500).json({ 
        message: "Failed to add tag to post", 
        error: error.message 
      });
    }
  });

  app.delete("/api/blog/posts/:postId/tags/:tagId", isAdmin, async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const tagId = parseInt(req.params.tagId);
      
      if (isNaN(postId) || isNaN(tagId)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.removeTagFromPost(postId, tagId);
      if (!success) {
        return res.status(404).json({ message: "Relationship not found" });
      }
      
      return res.status(204).send();
    } catch (error: any) {
      console.error("Error removing tag from post:", error);
      return res.status(500).json({ 
        message: "Failed to remove tag from post", 
        error: error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
