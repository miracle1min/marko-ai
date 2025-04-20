import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { 
  FileText, 
  PencilLine, 
  Sparkles, 
  LanguagesIcon, 
  PenTool, 
  Hash, 
  Info, 
  Copy, 
  Check, 
  RefreshCw 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { generateArticle } from "@/lib/geminiApi";
import { ArticleGenerationRequest } from "@/lib/types";

// Writing styles
const writingStyles = [
  { value: "formal", label: "Formal - Gaya penulisan resmi dan profesional" },
  { value: "casual", label: "Casual - Gaya penulisan santai dan akrab" },
  { value: "academic", label: "Academic - Gaya penulisan akademis dan ilmiah" },
  { value: "persuasive", label: "Persuasive - Gaya penulisan yang membujuk" },
  { value: "storytelling", label: "Storytelling - Gaya bercerita naratif" },
];

export default function ContentGenerator() {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("id");
  const [writingStyle, setWritingStyle] = useState("formal");
  const [wordCount, setWordCount] = useState(500);
  const [keywords, setKeywords] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [generatedArticle, setGeneratedArticle] = useState("");
  const [copied, setCopied] = useState(false);
  
  const { toast } = useToast();
  
  const articleMutation = useMutation({
    mutationFn: async (request: ArticleGenerationRequest) => {
      return generateArticle(request);
    },
    onSuccess: (data) => {
      setGeneratedArticle(data.article);
      toast({
        title: "Artikel Berhasil Dibuat",
        description: "Artikel telah berhasil digenerate menggunakan Marko AI",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Gagal membuat artikel: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const handleGenerateArticle = () => {
    const keywordsArray = keywords
      .split(',')
      .map(keyword => keyword.trim())
      .filter(keyword => keyword !== "");
      
    const request: ArticleGenerationRequest = {
      title,
      language,
      writingStyle,
      wordCount,
      keywords: keywordsArray,
      additionalInstructions: additionalInstructions.trim() || undefined,
    };
    
    articleMutation.mutate(request);
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedArticle);
    setCopied(true);
    toast({
      title: "Disalin!",
      description: "Artikel telah disalin ke clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-0">
      <Breadcrumb 
        items={[
          { label: "Tools", path: "/tools" },
          { label: "Content Generator", path: "/tools/gemini-konten", isActive: true }
        ]} 
      />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
          <Sparkles className="text-primary mr-2" /> 
          Marko AI Konten Generator
        </h1>
        <p className="text-gray-600 mt-2">
          Buat artikel berkualitas tinggi dengan teknologi AI canggih Marko
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <PencilLine className="mr-2 text-primary" /> Opsi Pembuatan Artikel
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" /> Judul Artikel
                  </Label>
                  <Input 
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Masukkan judul artikel"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="language" className="flex items-center">
                    <LanguagesIcon className="h-4 w-4 mr-2" /> Bahasa
                  </Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language" className="mt-1">
                      <SelectValue placeholder="Pilih bahasa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="id">Bahasa Indonesia</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="writing-style" className="flex items-center">
                    <PenTool className="h-4 w-4 mr-2" /> Gaya Penulisan
                  </Label>
                  <Select value={writingStyle} onValueChange={setWritingStyle}>
                    <SelectTrigger id="writing-style" className="mt-1">
                      <SelectValue placeholder="Pilih gaya penulisan" />
                    </SelectTrigger>
                    <SelectContent>
                      {writingStyles.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="word-count" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" /> Jumlah Kata ({wordCount})
                  </Label>
                  <Slider
                    id="word-count"
                    value={[wordCount]}
                    onValueChange={(value) => setWordCount(value[0])}
                    min={300}
                    max={2000}
                    step={100}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>300</span>
                    <span>1000</span>
                    <span>2000</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="keywords" className="flex items-center">
                    <Hash className="h-4 w-4 mr-2" /> Kata Kunci (pisahkan dengan koma)
                  </Label>
                  <Input 
                    id="keywords"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="SEO, konten, website, optimasi"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="additional-instructions" className="flex items-center">
                    <Info className="h-4 w-4 mr-2" /> Instruksi Tambahan (opsional)
                  </Label>
                  <Textarea 
                    id="additional-instructions"
                    value={additionalInstructions}
                    onChange={(e) => setAdditionalInstructions(e.target.value)}
                    placeholder="Tambahkan instruksi spesifik lainnya di sini..."
                    className="mt-1 resize-none"
                    rows={3}
                  />
                </div>
                
                <Button 
                  className="w-full mt-2" 
                  onClick={handleGenerateArticle}
                  disabled={!title || articleMutation.isPending}
                >
                  {articleMutation.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Sedang Membuat Artikel...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" /> Generate Artikel
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <FileText className="mr-2 text-primary" /> Hasil Artikel
                </h2>
                {generatedArticle && (
                  <Button variant="ghost" onClick={handleCopy} className="flex items-center">
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" /> Disalin!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" /> Salin
                      </>
                    )}
                  </Button>
                )}
              </div>
              
              <Separator className="mb-4" />
              
              <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
                {articleMutation.isPending ? (
                  <div className="text-center p-12">
                    <RefreshCw className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Sedang membuat artikel dengan Marko AI...</p>
                    <p className="text-gray-400 text-sm mt-2">Hal ini mungkin membutuhkan beberapa detik</p>
                  </div>
                ) : generatedArticle ? (
                  <div className="whitespace-pre-wrap">{generatedArticle}</div>
                ) : (
                  <div className="text-center p-12 text-gray-400">
                    <FileText className="h-12 w-12 mx-auto mb-4" />
                    <p className="font-medium">Artikel akan muncul di sini</p>
                    <p className="text-sm mt-2">Silakan isi form di sebelah kiri dan klik Generate Artikel</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}