import { GoogleGenerativeAI } from "@google/generative-ai";

// Gunakan GEMINI_API_KEY yang sudah didefinisikan di file geminiApi.ts untuk konsistensi
const GEMINI_API_KEY = "AIzaSyCcIbEEtr5S1IMchbiaGWRBWMZjgOOeA5s";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * Generate recipe using Google Gemini AI
 * @param ingredients List of ingredients
 * @param dishType Type of dish (e.g., main_course, appetizer)
 * @param cuisine Type of cuisine (e.g., indonesian, italian)
 * @param dietaryRestrictions Dietary restrictions (e.g., vegetarian, gluten_free)
 * @param cookingTime Cooking time preference (e.g., under_30_min)
 * @param skillLevel Skill level (e.g., beginner, intermediate)
 * @param calories Calorie restrictions
 * @param mealType Meal type (e.g., breakfast, dinner)
 * @param servings Number of servings
 * @param taste Taste preferences (e.g., sweet, spicy)
 * @param occasion Special occasion (e.g., birthday, holiday)
 * @param includeNutrition Whether to include nutrition information
 * @param includeStepByStep Whether to include step by step instructions
 * @param includeVariations Whether to include recipe variations
 * @param language Language for the recipe
 * @param additionalInstructions Additional instructions for the recipe
 * @returns Generated recipe with details
 */
export async function generateRecipe(
  ingredients: string[] = [],
  dishType?: string,
  cuisine?: string,
  dietaryRestrictions: string[] = [],
  cookingTime?: string,
  skillLevel?: string,
  calories?: string,
  mealType?: string,
  servings?: number,
  taste: string[] = [],
  occasion?: string,
  includeNutrition: boolean = true,
  includeStepByStep: boolean = true,
  includeVariations: boolean = true,
  language: string = "id",
  additionalInstructions?: string
) {
  try {
    // Use the Gemini Pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Construct the prompt based on given parameters
    let prompt = `Buatkan saya resep masakan dengan kriteria berikut:`;

    // Add ingredients if provided
    if (ingredients.length > 0) {
      prompt += `\n\nBahan-bahan: ${ingredients.join(", ")}`;
    }

    // Add additional constraints
    if (dishType) prompt += `\nJenis hidangan: ${dishType}`;
    if (cuisine) prompt += `\nMasakan: ${cuisine}`;
    if (dietaryRestrictions.length > 0) prompt += `\nPembatasan diet: ${dietaryRestrictions.join(", ")}`;
    if (cookingTime) prompt += `\nWaktu memasak: ${cookingTime}`;
    if (skillLevel) prompt += `\nTingkat kesulitan: ${skillLevel}`;
    if (calories) prompt += `\nBatasan kalori: ${calories}`;
    if (mealType) prompt += `\nJenis makanan: ${mealType}`;
    if (servings) prompt += `\nJumlah porsi: ${servings}`;
    if (taste.length > 0) prompt += `\nPreferensi rasa: ${taste.join(", ")}`;
    if (occasion) prompt += `\nUntuk acara: ${occasion}`;
    if (additionalInstructions) prompt += `\nInstruksi tambahan: ${additionalInstructions}`;

    // Add formatting instructions
    prompt += `\n\nHarap berikan resep dengan format berikut:
1. Judul resep yang menarik
2. Deskripsi singkat tentang resep tersebut
3. Daftar bahan-bahan dengan ukuran yang jelas
4. Langkah-langkah memasak yang detail${includeStepByStep ? " dan terurut" : ""}
5. Perkiraan waktu persiapan, waktu memasak, dan total waktu
6. Jumlah porsi yang dihasilkan
${includeNutrition ? "7. Informasi nutrisi (kalori, protein, karbohidrat, lemak, gula, serat)" : ""}
${includeVariations ? "8. Beberapa variasi atau alternatif dari resep ini" : ""}
9. Tips memasak untuk hasil terbaik

Berikan resep dalam bahasa ${language === "id" ? "Indonesia" : "Inggris"} yang jelas dan mudah diikuti.
Jangan memasukkan bagian apapun dalam output terkait disclaimer atau batasan model AI.`;

    // Generate content using Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Cleanup text before parsing - remove markdown code blocks if present
    let cleanText = text;
    
    // Hapus markdown code blocks jika ada
    if (text.includes('```json') || text.includes('```')) {
      // Ekstrak konten di antara blok kode (jika ada)
      const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (codeBlockMatch && codeBlockMatch[1]) {
        cleanText = codeBlockMatch[1].trim();
      } else {
        cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      }
    }
    
    // Parse the generated recipe text
    return parseRecipeResponse(cleanText);
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw error;
  }
}

/**
 * Parse the raw recipe text from Gemini into structured data
 * @param recipeText Raw recipe text from Gemini
 * @returns Structured recipe data
 */
export function parseRecipeResponse(recipeText: string) {
  try {
    // Coba parse sebagai JSON terlebih dahulu jika formatnya ada
    try {
      // Periksa apakah teks sepertinya adalah JSON
      if (recipeText.trim().startsWith('{') && recipeText.trim().endsWith('}')) {
        const jsonResult = JSON.parse(recipeText);
        // Struktur sesuai yang diharapkan
        if (jsonResult.title && (jsonResult.ingredients || jsonResult.bahan) && (jsonResult.instructions || jsonResult.langkah || jsonResult.cara)) {
          return {
            recipe: {
              title: jsonResult.title,
              description: jsonResult.description || jsonResult.deskripsi || "",
              ingredients: jsonResult.ingredients || jsonResult.bahan || [],
              instructions: jsonResult.instructions || jsonResult.langkah || jsonResult.cara || [],
              prepTime: jsonResult.prepTime || jsonResult.waktuPersiapan,
              cookTime: jsonResult.cookTime || jsonResult.waktuMerasak,
              totalTime: jsonResult.totalTime || jsonResult.totalWaktu,
              servings: jsonResult.servings || jsonResult.porsi,
              calories: jsonResult.calories || jsonResult.kalori,
              nutrition: jsonResult.nutrition || jsonResult.nutrisi,
              tips: jsonResult.tips || [],
              variations: jsonResult.variations || jsonResult.variasi || []
            }
          };
        }
      }
    } catch (jsonError) {
      console.log("Response tidak dalam format JSON, melanjutkan dengan parsing text biasa.");
    }
    
    // Jika parsing JSON gagal, gunakan metode text parsing
    // Extract title (first line or content before first newline)
    const lines = recipeText.split("\n").filter(line => line.trim() !== "");
    const title = lines[0].trim();
    
    // Extract description (usually the second paragraph)
    let descriptionLines = [];
    let i = 1;
    while (i < lines.length && !lines[i].toLowerCase().includes("bahan") && !lines[i].toLowerCase().includes("ingredient")) {
      descriptionLines.push(lines[i]);
      i++;
    }
    const description = descriptionLines.join("\n").trim();
    
    // Extract ingredients
    const ingredients: string[] = [];
    while (i < lines.length && 
           !lines[i].toLowerCase().includes("langkah") && 
           !lines[i].toLowerCase().includes("instruction") && 
           !lines[i].toLowerCase().includes("cara")) {
      // If the line contains a bullet point, dash, or number followed by dot/bracket, it's likely an ingredient
      if (lines[i].match(/^(\*|\-|\d+[\.\)]|•)/)) {
        ingredients.push(lines[i].replace(/^(\*|\-|\d+[\.\)]|•)\s*/, "").trim());
      }
      i++;
    }
    
    // Extract instructions
    const instructions: string[] = [];
    while (i < lines.length && 
           !lines[i].toLowerCase().includes("waktu") && 
           !lines[i].toLowerCase().includes("time") &&
           !lines[i].toLowerCase().includes("porsi") &&
           !lines[i].toLowerCase().includes("serving") &&
           !lines[i].toLowerCase().includes("nutrisi") &&
           !lines[i].toLowerCase().includes("nutrition") &&
           !lines[i].toLowerCase().includes("tips")) {
      // If the line contains a number followed by dot/bracket, it's likely an instruction
      if (lines[i].match(/^(\d+[\.\)]|•)/)) {
        instructions.push(lines[i].replace(/^(\d+[\.\)]|•)\s*/, "").trim());
      }
      i++;
    }
    
    // Extract time information
    let prepTime: string | undefined;
    let cookTime: string | undefined;
    let totalTime: string | undefined;
    let extractedServings: number | undefined;
    let extractedCalories: string | undefined;
    
    while (i < lines.length) {
      const line = lines[i].toLowerCase();
      if (line.includes("persiapan") || line.includes("prep")) {
        prepTime = extractTimeValue(lines[i]);
      } else if (line.includes("memasak") || line.includes("cook")) {
        cookTime = extractTimeValue(lines[i]);
      } else if (line.includes("total waktu") || line.includes("total time")) {
        totalTime = extractTimeValue(lines[i]);
      }
      
      // Extract servings
      if (line.includes("porsi") || line.includes("serving")) {
        const servingsMatch = lines[i].match(/(\d+)/);
        if (servingsMatch) {
          extractedServings = parseInt(servingsMatch[1]);
        }
      }
      
      // Extract calories
      if (line.includes("kalori") || line.includes("calorie")) {
        const caloriesMatch = lines[i].match(/(\d+)/);
        if (caloriesMatch) {
          extractedCalories = `${caloriesMatch[1]} kkal`;
        }
      }
      
      i++;
    }
    
    // Try to extract nutrition information
    const nutritionInfo: {
      protein?: string;
      carbs?: string;
      fat?: string;
      sugar?: string;
      fiber?: string;
    } = {};
    
    for (let j = 0; j < lines.length; j++) {
      const line = lines[j].toLowerCase();
      
      if (line.includes("protein")) {
        nutritionInfo.protein = extractNutritionValue(lines[j], "protein");
      } else if (line.includes("karbohidrat") || line.includes("carb")) {
        nutritionInfo.carbs = extractNutritionValue(lines[j], "karbohidrat");
      } else if (line.includes("lemak") || line.includes("fat")) {
        nutritionInfo.fat = extractNutritionValue(lines[j], "lemak");
      } else if (line.includes("gula") || line.includes("sugar")) {
        nutritionInfo.sugar = extractNutritionValue(lines[j], "gula");
      } else if (line.includes("serat") || line.includes("fiber")) {
        nutritionInfo.fiber = extractNutritionValue(lines[j], "serat");
      }
    }
    
    // Extract tips if available
    const tips: string[] = [];
    const tipsIndex = recipeText.toLowerCase().indexOf("tips");
    if (tipsIndex !== -1) {
      const tipsText = recipeText.substring(tipsIndex);
      const tipsLines = tipsText.split("\n").filter(line => line.trim() !== "");
      
      for (let j = 1; j < tipsLines.length; j++) {
        if (tipsLines[j].match(/^(\*|\-|\d+[\.\)]|•)/)) {
          tips.push(tipsLines[j].replace(/^(\*|\-|\d+[\.\)]|•)\s*/, "").trim());
        }
        // Stop if we reach variations section
        if (tipsLines[j].toLowerCase().includes("variasi") || tipsLines[j].toLowerCase().includes("variation")) {
          break;
        }
      }
    }
    
    // Extract variations if available
    const variations: string[] = [];
    const variationsIndex = recipeText.toLowerCase().indexOf("variasi");
    if (variationsIndex !== -1) {
      const variationsText = recipeText.substring(variationsIndex);
      const variationsLines = variationsText.split("\n").filter(line => line.trim() !== "");
      
      for (let j = 1; j < variationsLines.length; j++) {
        if (variationsLines[j].match(/^(\*|\-|\d+[\.\)]|•)/)) {
          variations.push(variationsLines[j].replace(/^(\*|\-|\d+[\.\)]|•)\s*/, "").trim());
        }
      }
    }
    
    // Construct the response object
    const recipe = {
      title,
      description,
      ingredients,
      instructions,
      prepTime,
      cookTime,
      totalTime,
      servings: extractedServings,
      calories: extractedCalories,
      nutrition: Object.keys(nutritionInfo).length > 0 ? nutritionInfo : undefined,
      tips: tips.length > 0 ? tips : undefined,
      variations: variations.length > 0 ? variations : undefined
    };
    
    return { recipe };
  } catch (error) {
    console.error("Error parsing recipe response:", error);
    // Return a simplified version if parsing fails
    return {
      recipe: {
        title: "Resep Makanan",
        description: "Resep ini dibuat berdasarkan permintaan Anda.",
        ingredients: ["Bahan 1", "Bahan 2"],
        instructions: ["Langkah 1", "Langkah 2"]
      }
    };
  }
}

/**
 * Extract time value from a string
 * @param text String containing time information
 * @returns Extracted time value or undefined
 */
function extractTimeValue(text: string): string | undefined {
  // Look for patterns like "10 menit", "1 jam 30 menit", etc.
  const timeMatch = text.match(/(\d+\s*(?:jam|hour|menit|minute)(?:\s+\d+\s*(?:jam|hour|menit|minute))?)/i);
  if (timeMatch) {
    return timeMatch[1];
  }
  return undefined;
}

/**
 * Extract nutrition value from a string
 * @param text String containing nutrition information
 * @param nutrientType Type of nutrient to extract
 * @returns Extracted nutrition value or undefined
 */
function extractNutritionValue(text: string, nutrientType: string): string | undefined {
  // Remove the nutrient type from the text
  const valueText = text.replace(new RegExp(`.*${nutrientType}\\s*:?\\s*`, 'i'), '').trim();
  
  // Look for patterns like "20g", "5 gram", etc.
  const valueMatch = valueText.match(/^([\d.,]+\s*(?:g|gram|mg|kcal|kalori|%|mcg))/i);
  if (valueMatch) {
    return valueMatch[1];
  }
  return valueText || undefined;
}