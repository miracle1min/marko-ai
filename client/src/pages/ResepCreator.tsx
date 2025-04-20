import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  ChefHat,
  Clock,
  FileText,
  Sparkles,
  UtensilsCrossed,
  Gauge,
  RefreshCw,
  Copy,
  Download,
  ExternalLink,
  Check,
  Tag,
  Heart,
  Bookmark,
  Pill,
  Utensils,
  Users,
  Flame,
  Scale,
  Lightbulb,
  Share2,
  Coffee,
  Plus,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Breadcrumb from "@/components/Breadcrumb";
import { useToast } from "@/hooks/use-toast";
import { generateRecipe } from "@/lib/geminiApi";
import { RecipeGenerationRequest, RecipeGenerationResponse } from "@/lib/types";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";

// Interface untuk resep
interface Recipe {
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
}

// Opsi pilihan untuk form
const cuisineOptions = [
  { value: "indonesian", label: "Indonesia" },
  { value: "chinese", label: "Tiongkok" },
  { value: "italian", label: "Italia" },
  { value: "japanese", label: "Jepang" },
  { value: "korean", label: "Korea" },
  { value: "thai", label: "Thailand" },
  { value: "indian", label: "India" },
  { value: "american", label: "Amerika" },
  { value: "mexican", label: "Meksiko" },
  { value: "french", label: "Prancis" },
  { value: "turkish", label: "Turki" },
  { value: "lebanese", label: "Lebanon" },
  { value: "spanish", label: "Spanyol" },
  { value: "vietnamese", label: "Vietnam" },
  { value: "brazilian", label: "Brasil" }
];

const dishTypeOptions = [
  { value: "main_course", label: "Hidangan Utama" },
  { value: "appetizer", label: "Hidangan Pembuka" },
  { value: "side_dish", label: "Hidangan Pendamping" },
  { value: "soup", label: "Sup" },
  { value: "salad", label: "Salad" },
  { value: "dessert", label: "Makanan Penutup" },
  { value: "breakfast", label: "Sarapan" },
  { value: "snack", label: "Camilan" },
  { value: "drink", label: "Minuman" },
  { value: "sandwich", label: "Sandwich" },
  { value: "sauce", label: "Saus" },
  { value: "baked_goods", label: "Kue & Roti" }
];

const dietaryRestrictionsOptions = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten_free", label: "Bebas Gluten" },
  { value: "dairy_free", label: "Bebas Susu" },
  { value: "low_carb", label: "Rendah Karbohidrat" },
  { value: "low_fat", label: "Rendah Lemak" },
  { value: "low_sodium", label: "Rendah Sodium" },
  { value: "low_sugar", label: "Rendah Gula" },
  { value: "keto", label: "Keto" },
  { value: "paleo", label: "Paleo" }
];

const skillLevelOptions = [
  { value: "beginner", label: "Pemula" },
  { value: "intermediate", label: "Menengah" },
  { value: "advanced", label: "Mahir" }
];

const cookingTimeOptions = [
  { value: "under_15_min", label: "Kurang dari 15 menit" },
  { value: "under_30_min", label: "Kurang dari 30 menit" },
  { value: "30_to_60_min", label: "30-60 menit" },
  { value: "1_to_2_hours", label: "1-2 jam" },
  { value: "over_2_hours", label: "Lebih dari 2 jam" }
];

const mealTypeOptions = [
  { value: "breakfast", label: "Sarapan" },
  { value: "lunch", label: "Makan Siang" },
  { value: "dinner", label: "Makan Malam" },
  { value: "brunch", label: "Brunch" },
  { value: "snack", label: "Cemilan" },
  { value: "dessert", label: "Makanan Penutup" }
];

const tasteOptions = [
  { value: "sweet", label: "Manis" },
  { value: "salty", label: "Asin" },
  { value: "spicy", label: "Pedas" },
  { value: "sour", label: "Asam" },
  { value: "bitter", label: "Pahit" },
  { value: "savory", label: "Gurih" },
  { value: "umami", label: "Umami" }
];

const occasionOptions = [
  { value: "everyday", label: "Sehari-hari" },
  { value: "special_occasion", label: "Acara Khusus" },
  { value: "party", label: "Pesta" },
  { value: "holiday", label: "Liburan" },
  { value: "dinner_party", label: "Makan Malam" },
  { value: "picnic", label: "Piknik" },
  { value: "potluck", label: "Potluck" },
  { value: "bbq", label: "BBQ" }
];

export default function ResepCreator() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [cuisine, setCuisine] = useState<string>("");
  const [dishType, setDishType] = useState<string>("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [cookingTime, setCookingTime] = useState<string>("");
  const [skillLevel, setSkillLevel] = useState<string>("");
  const [calories, setCalories] = useState<string>("");
  const [mealType, setMealType] = useState<string>("");
  const [servings, setServings] = useState<number>(2);
  const [taste, setTaste] = useState<string[]>([]);
  const [occasion, setOccasion] = useState<string>("");
  const [additionalInstructions, setAdditionalInstructions] = useState<string>("");
  const [includeNutrition, setIncludeNutrition] = useState<boolean>(true);
  const [includeStepByStep, setIncludeStepByStep] = useState<boolean>(true);
  const [includeVariations, setIncludeVariations] = useState<boolean>(true);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [isSimpleMode, setIsSimpleMode] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Mutation untuk generate resep dengan AI
  const recipeMutation = useMutation({
    mutationFn: async (data: RecipeGenerationRequest) => {
      return generateRecipe(data);
    },
    onSuccess: (data) => {
      setGeneratedRecipe(data.recipe);
      toast({
        title: "Resep berhasil dibuat!",
        description: "Resep telah berhasil digenerate dan siap digunakan.",
      });
    },
    onError: () => {
      toast({
        title: "Gagal membuat resep",
        description: "Terjadi kesalahan saat mencoba membuat resep. Silakan coba lagi.",
        variant: "destructive"
      });
    }
  });

  // Handle tambah bahan
  const handleAddIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient("");
    }
  };

  // Handle remove bahan
  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(ing => ing !== ingredient));
  };

  // Handle restrict diet
  const handleDietaryRestrictionToggle = (restriction: string) => {
    if (dietaryRestrictions.includes(restriction)) {
      setDietaryRestrictions(dietaryRestrictions.filter(r => r !== restriction));
    } else {
      setDietaryRestrictions([...dietaryRestrictions, restriction]);
    }
  };

  // Handle taste preferences
  const handleTasteToggle = (tasteValue: string) => {
    if (taste.includes(tasteValue)) {
      setTaste(taste.filter(t => t !== tasteValue));
    } else {
      setTaste([...taste, tasteValue]);
    }
  };

  // Generate resep
  const handleGenerateRecipe = () => {
    // Validasi minimal requirement
    if (ingredients.length === 0 && !cuisine && !dishType) {
      toast({
        title: "Data tidak lengkap",
        description: "Minimal isi bahan-bahan, jenis masakan, atau jenis hidangan.",
        variant: "destructive"
      });
      return;
    }

    const request: RecipeGenerationRequest = {
      ingredients: ingredients.length > 0 ? ingredients : undefined,
      cuisine: cuisine || undefined,
      dishType: dishType || undefined,
      dietaryRestrictions: dietaryRestrictions.length > 0 ? dietaryRestrictions : undefined,
      cookingTime: cookingTime || undefined,
      skillLevel: skillLevel || undefined,
      calories: calories || undefined,
      mealType: mealType || undefined,
      servings: servings || undefined,
      taste: taste.length > 0 ? taste : undefined,
      occasion: occasion || undefined,
      includeNutrition,
      includeStepByStep,
      includeVariations,
      language: "id",
      additionalInstructions: additionalInstructions || undefined
    };

    recipeMutation.mutate(request);
  };

  // Reset form
  const handleResetForm = () => {
    setIngredients([]);
    setCurrentIngredient("");
    setCuisine("");
    setDishType("");
    setDietaryRestrictions([]);
    setCookingTime("");
    setSkillLevel("");
    setCalories("");
    setMealType("");
    setServings(2);
    setTaste([]);
    setOccasion("");
    setAdditionalInstructions("");
    setIncludeNutrition(true);
    setIncludeStepByStep(true);
    setIncludeVariations(true);
  };

  // Copy resep
  const handleCopyRecipe = () => {
    if (!generatedRecipe) return;
    
    let text = `${generatedRecipe.title}\n\n`;
    text += `${generatedRecipe.description}\n\n`;
    
    text += "Bahan-bahan:\n";
    generatedRecipe.ingredients.forEach(ing => {
      text += `- ${ing}\n`;
    });
    
    text += "\nLangkah-langkah:\n";
    generatedRecipe.instructions.forEach((step, index) => {
      text += `${index + 1}. ${step}\n`;
    });
    
    if (generatedRecipe.prepTime || generatedRecipe.cookTime || generatedRecipe.totalTime) {
      text += "\nWaktu:\n";
      if (generatedRecipe.prepTime) text += `Persiapan: ${generatedRecipe.prepTime}\n`;
      if (generatedRecipe.cookTime) text += `Memasak: ${generatedRecipe.cookTime}\n`;
      if (generatedRecipe.totalTime) text += `Total: ${generatedRecipe.totalTime}\n`;
    }
    
    if (generatedRecipe.nutrition) {
      text += "\nInformasi Nutrisi:\n";
      if (generatedRecipe.calories) text += `Kalori: ${generatedRecipe.calories}\n`;
      const nutrition = generatedRecipe.nutrition;
      if (nutrition.protein) text += `Protein: ${nutrition.protein}\n`;
      if (nutrition.carbs) text += `Karbohidrat: ${nutrition.carbs}\n`;
      if (nutrition.fat) text += `Lemak: ${nutrition.fat}\n`;
      if (nutrition.sugar) text += `Gula: ${nutrition.sugar}\n`;
      if (nutrition.fiber) text += `Serat: ${nutrition.fiber}\n`;
    }
    
    if (generatedRecipe.tips && generatedRecipe.tips.length > 0) {
      text += "\nTips:\n";
      generatedRecipe.tips.forEach(tip => {
        text += `- ${tip}\n`;
      });
    }
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Disalin!",
      description: "Resep telah disalin ke clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  // Save as PDF
  const handleExportPDF = () => {
    if (!generatedRecipe) return;
    
    const pdf = new jsPDF();
    const lineHeight = 8;
    let yPosition = 20;
    
    // Title
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(generatedRecipe.title, 20, yPosition);
    yPosition += lineHeight + 5;
    
    // Description
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    const descriptionLines = pdf.splitTextToSize(generatedRecipe.description, 170);
    pdf.text(descriptionLines, 20, yPosition);
    yPosition += (descriptionLines.length * lineHeight) + 5;
    
    // Basic info
    pdf.setFontSize(10);
    let infoText = '';
    if (generatedRecipe.prepTime) infoText += `Persiapan: ${generatedRecipe.prepTime} | `;
    if (generatedRecipe.cookTime) infoText += `Memasak: ${generatedRecipe.cookTime} | `;
    if (generatedRecipe.totalTime) infoText += `Total: ${generatedRecipe.totalTime} | `;
    if (generatedRecipe.servings) infoText += `Porsi: ${generatedRecipe.servings} | `;
    if (generatedRecipe.calories) infoText += `Kalori: ${generatedRecipe.calories}`;
    if (infoText) {
      pdf.text(infoText, 20, yPosition);
      yPosition += lineHeight;
    }
    
    // Line separator
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, yPosition, 190, yPosition);
    yPosition += lineHeight;
    
    // Ingredients
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Bahan-bahan:', 20, yPosition);
    yPosition += lineHeight;
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    generatedRecipe.ingredients.forEach(ingredient => {
      pdf.text(`• ${ingredient}`, 20, yPosition);
      yPosition += lineHeight;
      
      // Check if we need a new page
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
    });
    
    yPosition += 5;
    
    // Instructions
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Langkah-langkah:', 20, yPosition);
    yPosition += lineHeight;
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    generatedRecipe.instructions.forEach((instruction, index) => {
      const instructionLines = pdf.splitTextToSize(`${index + 1}. ${instruction}`, 170);
      pdf.text(instructionLines, 20, yPosition);
      yPosition += (instructionLines.length * lineHeight) + 2;
      
      // Check if we need a new page
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
    });
    
    // Nutrition info (if available)
    if (generatedRecipe.nutrition && Object.keys(generatedRecipe.nutrition).length > 0) {
      yPosition += 5;
      
      // Check if we need a new page
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Informasi Nutrisi:', 20, yPosition);
      yPosition += lineHeight;
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      if (generatedRecipe.calories) {
        pdf.text(`• Kalori: ${generatedRecipe.calories}`, 20, yPosition);
        yPosition += lineHeight;
      }
      
      const nutrition = generatedRecipe.nutrition;
      if (nutrition.protein) {
        pdf.text(`• Protein: ${nutrition.protein}`, 20, yPosition);
        yPosition += lineHeight;
      }
      if (nutrition.carbs) {
        pdf.text(`• Karbohidrat: ${nutrition.carbs}`, 20, yPosition);
        yPosition += lineHeight;
      }
      if (nutrition.fat) {
        pdf.text(`• Lemak: ${nutrition.fat}`, 20, yPosition);
        yPosition += lineHeight;
      }
      if (nutrition.sugar) {
        pdf.text(`• Gula: ${nutrition.sugar}`, 20, yPosition);
        yPosition += lineHeight;
      }
      if (nutrition.fiber) {
        pdf.text(`• Serat: ${nutrition.fiber}`, 20, yPosition);
        yPosition += lineHeight;
      }
    }
    
    // Tips (if available)
    if (generatedRecipe.tips && generatedRecipe.tips.length > 0) {
      yPosition += 5;
      
      // Check if we need a new page
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Tips:', 20, yPosition);
      yPosition += lineHeight;
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      generatedRecipe.tips.forEach(tip => {
        const tipLines = pdf.splitTextToSize(`• ${tip}`, 170);
        pdf.text(tipLines, 20, yPosition);
        yPosition += (tipLines.length * lineHeight);
        
        // Check if we need a new page
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }
      });
    }
    
    // Variations (if available)
    if (generatedRecipe.variations && generatedRecipe.variations.length > 0) {
      yPosition += 5;
      
      // Check if we need a new page
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Variasi Resep:', 20, yPosition);
      yPosition += lineHeight;
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      generatedRecipe.variations.forEach(variation => {
        const variationLines = pdf.splitTextToSize(`• ${variation}`, 170);
        pdf.text(variationLines, 20, yPosition);
        yPosition += (variationLines.length * lineHeight);
        
        // Check if we need a new page
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }
      });
    }
    
    // Footer
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setTextColor(150);
      pdf.text(`Dibuat dengan Marko AI Resep Creator - Halaman ${i} dari ${pageCount}`, 20, 285);
    }
    
    // Save PDF
    pdf.save(`${generatedRecipe.title.replace(/\s+/g, '_')}.pdf`);
    
    toast({
      title: "PDF berhasil dibuat!",
      description: "Resep telah berhasil diekspor ke format PDF.",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-0">
      <Breadcrumb 
        items={[
          { label: "Tools", path: "/tools" },
          { label: "Resep Creator", path: "/tools/resep-creator", isActive: true }
        ]} 
      />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center">
          <ChefHat className="text-primary mr-2" /> 
          AI Resep Creator
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Buat berbagai resep masakan dengan bantuan AI berdasarkan bahan yang Anda miliki
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={`${generatedRecipe ? "lg:col-span-1" : "lg:col-span-2"}`}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold mb-0 flex items-center">
                  <Utensils className="mr-2 text-primary" /> Buat Resep Baru
                </h2>
                <div className="flex items-center space-x-2 text-sm">
                  <span>Mode Simpel</span>
                  <Switch
                    checked={isSimpleMode}
                    onCheckedChange={setIsSimpleMode}
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Bahan-bahan */}
                <div className="space-y-2">
                  <Label className="flex items-center">
                    <UtensilsCrossed className="h-4 w-4 mr-2" /> Bahan-bahan
                  </Label>
                  
                  <div className="flex items-center gap-2">
                    <Input
                      value={currentIngredient}
                      onChange={(e) => setCurrentIngredient(e.target.value)}
                      placeholder="Masukkan bahan (mis. 200g tepung)"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddIngredient();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddIngredient}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {ingredients.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {ingredients.map((ingredient, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {ingredient}
                          <button
                            onClick={() => handleRemoveIngredient(ingredient)}
                            className="text-gray-500 hover:text-red-500 ml-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Jenis Masakan & Hidangan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cuisine">Jenis Masakan</Label>
                    <Select value={cuisine} onValueChange={setCuisine}>
                      <SelectTrigger id="cuisine">
                        <SelectValue placeholder="Pilih jenis masakan" />
                      </SelectTrigger>
                      <SelectContent>
                        {cuisineOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dishType">Jenis Hidangan</Label>
                    <Select value={dishType} onValueChange={setDishType}>
                      <SelectTrigger id="dishType">
                        <SelectValue placeholder="Pilih jenis hidangan" />
                      </SelectTrigger>
                      <SelectContent>
                        {dishTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {!isSimpleMode && (
                  <>
                    {/* Batasan Diet */}
                    <div className="space-y-2">
                      <Label className="mb-1 block">Batasan Diet</Label>
                      <div className="flex flex-wrap gap-2">
                        {dietaryRestrictionsOptions.map((option) => (
                          <Badge
                            key={option.value}
                            variant={dietaryRestrictions.includes(option.value) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => handleDietaryRestrictionToggle(option.value)}
                          >
                            {option.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Kesulitan & Waktu */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="skillLevel">Tingkat Kesulitan</Label>
                        <Select value={skillLevel} onValueChange={setSkillLevel}>
                          <SelectTrigger id="skillLevel">
                            <SelectValue placeholder="Pilih tingkat kesulitan" />
                          </SelectTrigger>
                          <SelectContent>
                            {skillLevelOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cookingTime">Waktu Memasak</Label>
                        <Select value={cookingTime} onValueChange={setCookingTime}>
                          <SelectTrigger id="cookingTime">
                            <SelectValue placeholder="Pilih waktu memasak" />
                          </SelectTrigger>
                          <SelectContent>
                            {cookingTimeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Jenis Makanan & Porsi */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="mealType">Jenis Makanan</Label>
                        <Select value={mealType} onValueChange={setMealType}>
                          <SelectTrigger id="mealType">
                            <SelectValue placeholder="Pilih jenis makanan" />
                          </SelectTrigger>
                          <SelectContent>
                            {mealTypeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="servings">Porsi ({servings} porsi)</Label>
                        <Slider
                          id="servings"
                          min={1}
                          max={10}
                          step={1}
                          value={[servings]}
                          onValueChange={(value) => setServings(value[0])}
                        />
                      </div>
                    </div>
                    
                    {/* Kalori & Rasa */}
                    <div className="space-y-2">
                      <Label htmlFor="calories">Batasan Kalori</Label>
                      <Input
                        id="calories"
                        placeholder="Misalnya: kurang dari 500 kal"
                        value={calories}
                        onChange={(e) => setCalories(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="mb-1 block">Preferensi Rasa</Label>
                      <div className="flex flex-wrap gap-2">
                        {tasteOptions.map((option) => (
                          <Badge
                            key={option.value}
                            variant={taste.includes(option.value) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => handleTasteToggle(option.value)}
                          >
                            {option.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Acara */}
                    <div className="space-y-2">
                      <Label htmlFor="occasion">Untuk Acara</Label>
                      <Select value={occasion} onValueChange={setOccasion}>
                        <SelectTrigger id="occasion">
                          <SelectValue placeholder="Pilih acara" />
                        </SelectTrigger>
                        <SelectContent>
                          {occasionOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Instruksi Tambahan */}
                    <div className="space-y-2">
                      <Label htmlFor="additionalInstructions">Instruksi Tambahan</Label>
                      <Textarea
                        id="additionalInstructions"
                        placeholder="Tambahkan detail lain yang Anda inginkan untuk resep"
                        value={additionalInstructions}
                        onChange={(e) => setAdditionalInstructions(e.target.value)}
                      />
                    </div>
                    
                    {/* Opsi Tambahan */}
                    <div className="space-y-3">
                      <Label>Opsi Tambahan</Label>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Sertakan informasi nutrisi</span>
                        <Switch
                          checked={includeNutrition}
                          onCheckedChange={setIncludeNutrition}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Sertakan instruksi langkah demi langkah</span>
                        <Switch
                          checked={includeStepByStep}
                          onCheckedChange={setIncludeStepByStep}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Sertakan variasi resep</span>
                        <Switch
                          checked={includeVariations}
                          onCheckedChange={setIncludeVariations}
                        />
                      </div>
                    </div>
                  </>
                )}
                
                <div className="flex items-center justify-between pt-2">
                  <Button variant="outline" onClick={handleResetForm}>
                    Reset
                  </Button>
                  
                  <Button 
                    onClick={handleGenerateRecipe}
                    disabled={recipeMutation.isPending}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {recipeMutation.isPending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Membuat Resep...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" /> Buat Resep
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className={`${generatedRecipe ? "lg:col-span-2" : "lg:col-span-1"}`}>
          {!generatedRecipe && !recipeMutation.isPending ? (
            <Card className="h-full">
              <CardContent className="pt-6 flex flex-col h-full justify-center items-center text-center py-10">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ChefHat className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Buat Resep Anda</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                  Masukkan bahan-bahan yang Anda miliki, pilih preferensi masakan atau hidangan, dan AI kami akan membuat resep yang sesuai dengan kebutuhan Anda.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-lg">
                  <Card className="border border-dashed bg-muted/50">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <UtensilsCrossed className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Masukkan bahan-bahan yang tersedia</p>
                    </CardContent>
                  </Card>
                  <Card className="border border-dashed bg-muted/50">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <ChefHat className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Atur preferensi masakan</p>
                    </CardContent>
                  </Card>
                  <Card className="border border-dashed bg-muted/50">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <FileText className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Terima resep lengkap</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full">
              <CardContent className="pt-6">
                {recipeMutation.isPending ? (
                  <div className="h-full flex flex-col justify-center items-center py-20">
                    <RefreshCw className="h-12 w-12 text-primary animate-spin mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Sedang Menyiapkan Resep...</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                      Tunggu sebentar, AI kami sedang bekerja untuk membuat resep yang sempurna berdasarkan kriteria Anda.
                    </p>
                    <Progress className="w-64 mt-0" value={recipeMutation.isPending ? Math.random() * 100 : 100} />
                  </div>
                ) : recipeMutation.isError ? (
                  <div className="h-full flex flex-col justify-center items-center py-20">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                      <X className="h-8 w-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Terjadi Kesalahan</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-4">
                      Maaf, terjadi kesalahan saat mencoba membuat resep. Silakan coba lagi dengan parameter yang berbeda.
                    </p>
                    <Button 
                      onClick={handleGenerateRecipe}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" /> Coba Lagi
                    </Button>
                  </div>
                ) : generatedRecipe ? (
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-2xl font-bold">{generatedRecipe.title}</h2>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleCopyRecipe}
                        >
                          {copied ? (
                            <>
                              <Check className="h-4 w-4 mr-2" /> Disalin
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" /> Salin
                            </>
                          )}
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleExportPDF}
                        >
                          <Download className="h-4 w-4 mr-2" /> PDF
                        </Button>
                      </div>
                    </div>
                    
                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                      {generatedRecipe.description}
                    </p>
                    
                    {/* Recipe meta info */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
                      {generatedRecipe.prepTime && (
                        <div className="bg-primary/10 rounded-lg p-2 text-center">
                          <p className="text-xs text-gray-600 dark:text-gray-400">Persiapan</p>
                          <p className="font-medium">{generatedRecipe.prepTime}</p>
                        </div>
                      )}
                      {generatedRecipe.cookTime && (
                        <div className="bg-primary/10 rounded-lg p-2 text-center">
                          <p className="text-xs text-gray-600 dark:text-gray-400">Memasak</p>
                          <p className="font-medium">{generatedRecipe.cookTime}</p>
                        </div>
                      )}
                      {generatedRecipe.totalTime && (
                        <div className="bg-primary/10 rounded-lg p-2 text-center">
                          <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
                          <p className="font-medium">{generatedRecipe.totalTime}</p>
                        </div>
                      )}
                      {generatedRecipe.servings && (
                        <div className="bg-primary/10 rounded-lg p-2 text-center">
                          <p className="text-xs text-gray-600 dark:text-gray-400">Porsi</p>
                          <p className="font-medium">{generatedRecipe.servings}</p>
                        </div>
                      )}
                      {generatedRecipe.calories && (
                        <div className="bg-primary/10 rounded-lg p-2 text-center">
                          <p className="text-xs text-gray-600 dark:text-gray-400">Kalori</p>
                          <p className="font-medium">{generatedRecipe.calories}</p>
                        </div>
                      )}
                    </div>
                    
                    <Tabs defaultValue="recipe">
                      <TabsList className="mb-4 w-full">
                        <TabsTrigger value="recipe" className="flex-1">
                          <UtensilsCrossed className="h-4 w-4 mr-2 hidden sm:inline" />
                          Resep
                        </TabsTrigger>
                        {generatedRecipe.nutrition && (
                          <TabsTrigger value="nutrition" className="flex-1">
                            <Gauge className="h-4 w-4 mr-2 hidden sm:inline" />
                            Nutrisi
                          </TabsTrigger>
                        )}
                        {generatedRecipe.tips && generatedRecipe.tips.length > 0 && (
                          <TabsTrigger value="tips" className="flex-1">
                            <Lightbulb className="h-4 w-4 mr-2 hidden sm:inline" />
                            Tips
                          </TabsTrigger>
                        )}
                        {generatedRecipe.variations && generatedRecipe.variations.length > 0 && (
                          <TabsTrigger value="variations" className="flex-1">
                            <Sparkles className="h-4 w-4 mr-2 hidden sm:inline" />
                            Variasi
                          </TabsTrigger>
                        )}
                      </TabsList>
                      
                      <TabsContent value="recipe">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-1">
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center">
                                  <UtensilsCrossed className="h-5 w-5 mr-2 text-primary" />
                                  Bahan-bahan
                                </CardTitle>
                                <CardDescription>
                                  {generatedRecipe.servings && `Untuk ${generatedRecipe.servings} porsi`}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <ScrollArea className="h-[300px] md:h-[500px] pr-4">
                                  <ul className="space-y-2">
                                    {Array.isArray(generatedRecipe.ingredients) && generatedRecipe.ingredients.length > 0 ? (
                                      generatedRecipe.ingredients.map((ingredient, index) => {
                                        // Remove any JSON formatting or quotes
                                        const cleanIngredient = typeof ingredient === 'string' 
                                          ? ingredient.replace(/^["']|["']$/g, '').trim() // Remove surrounding quotes
                                          : String(ingredient);
                                          
                                        return (
                                          <li key={index} className="flex items-start">
                                            <span className="inline-block w-4 h-4 rounded-full bg-primary/20 mt-1 mr-2"></span>
                                            <span>{cleanIngredient}</span>
                                          </li>
                                        );
                                      })
                                    ) : (
                                      <li className="text-gray-500 italic">Tidak ada bahan yang ditentukan</li>
                                    )}
                                  </ul>
                                </ScrollArea>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <div className="md:col-span-2">
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center">
                                  <FileText className="h-5 w-5 mr-2 text-primary" />
                                  Langkah-langkah
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ScrollArea className="h-[300px] md:h-[500px] pr-4">
                                  <ol className="space-y-4">
                                    {Array.isArray(generatedRecipe.instructions) && generatedRecipe.instructions.length > 0 ? (
                                      generatedRecipe.instructions.map((instruction, index) => {
                                        // Clean up the instruction text
                                        const cleanInstruction = typeof instruction === 'string'
                                          ? instruction.replace(/^["']|["']$/g, '').trim() // Remove surrounding quotes
                                          : String(instruction);
                                          
                                        return (
                                          <li key={index} className="flex items-start pb-4 border-b last:border-0">
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white font-medium mr-3 flex-shrink-0 text-sm">
                                              {index + 1}
                                            </span>
                                            <span className="flex-1">{cleanInstruction}</span>
                                          </li>
                                        );
                                      })
                                    ) : (
                                      <li className="text-gray-500 italic">Tidak ada langkah-langkah yang ditentukan</li>
                                    )}
                                  </ol>
                                </ScrollArea>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="nutrition">
                        {generatedRecipe.nutrition && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center">
                                <Gauge className="h-5 w-5 mr-2 text-primary" />
                                Informasi Nutrisi
                              </CardTitle>
                              {generatedRecipe.calories && (
                                <CardDescription>
                                  {generatedRecipe.calories} per porsi
                                </CardDescription>
                              )}
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                                {generatedRecipe.nutrition.protein && (
                                  <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-2">
                                      <span className="font-bold text-blue-600 dark:text-blue-300">Protein</span>
                                    </div>
                                    <p className="font-medium">{generatedRecipe.nutrition.protein}</p>
                                  </div>
                                )}
                                
                                {generatedRecipe.nutrition.carbs && (
                                  <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mx-auto mb-2">
                                      <span className="font-bold text-amber-600 dark:text-amber-300">Karbo</span>
                                    </div>
                                    <p className="font-medium">{generatedRecipe.nutrition.carbs}</p>
                                  </div>
                                )}
                                
                                {generatedRecipe.nutrition.fat && (
                                  <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mx-auto mb-2">
                                      <span className="font-bold text-red-600 dark:text-red-300">Lemak</span>
                                    </div>
                                    <p className="font-medium">{generatedRecipe.nutrition.fat}</p>
                                  </div>
                                )}
                                
                                {generatedRecipe.nutrition.sugar && (
                                  <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center mx-auto mb-2">
                                      <span className="font-bold text-pink-600 dark:text-pink-300">Gula</span>
                                    </div>
                                    <p className="font-medium">{generatedRecipe.nutrition.sugar}</p>
                                  </div>
                                )}
                                
                                {generatedRecipe.nutrition.fiber && (
                                  <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-2">
                                      <span className="font-bold text-green-600 dark:text-green-300">Serat</span>
                                    </div>
                                    <p className="font-medium">{generatedRecipe.nutrition.fiber}</p>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="tips">
                        {generatedRecipe.tips && generatedRecipe.tips.length > 0 && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center">
                                <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                                Tips Memasak
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-3">
                                {generatedRecipe.tips.map((tip, index) => {
                                  // Clean up the tip text
                                  const cleanTip = typeof tip === 'string'
                                    ? tip.replace(/^["']|["']$/g, '').trim() // Remove surrounding quotes
                                    : String(tip);
                                    
                                  return (
                                    <li key={index} className="flex items-start p-3 bg-primary/5 rounded-md">
                                      <Lightbulb className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                                      <span>{cleanTip}</span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </CardContent>
                          </Card>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="variations">
                        {generatedRecipe.variations && generatedRecipe.variations.length > 0 && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center">
                                <Sparkles className="h-5 w-5 mr-2 text-primary" />
                                Variasi Resep
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <Accordion type="single" collapsible>
                                {generatedRecipe.variations.map((variation, index) => {
                                  // Clean up the variation text
                                  const cleanVariation = typeof variation === 'string'
                                    ? variation.replace(/^["']|["']$/g, '').trim() // Remove surrounding quotes
                                    : String(variation);
                                  
                                  return (
                                    <AccordionItem key={index} value={`variation-${index}`}>
                                      <AccordionTrigger>Variasi {index + 1}</AccordionTrigger>
                                      <AccordionContent>
                                        <p>{cleanVariation}</p>
                                      </AccordionContent>
                                    </AccordionItem>
                                  );
                                })}
                              </Accordion>
                            </CardContent>
                          </Card>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}