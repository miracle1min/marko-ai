import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { 
  Tag, 
  FileText,
  LanguagesIcon, 
  Sparkles,
  Search,
  RefreshCw,
  Copy,
  Check,
  Globe,
  Layout,
  MousePointer,
  Code
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Breadcrumb from "@/components/Breadcrumb";

// Daftar jenis halaman
const pageTypes = [
  { value: "homepage", label: "Homepage" },
  { value: "product", label: "Halaman Produk" },
  { value: "category", label: "Halaman Kategori" },
  { value: "blog_post", label: "Artikel Blog" },
  { value: "about", label: "Halaman Tentang Kami" },
  { value: "contact", label: "Halaman Kontak" },
  { value: "services", label: "Halaman Layanan" },
  { value: "landing", label: "Landing Page" }
];

// Daftar tone/nada
const tones = [
  { value: "professional", label: "Profesional - Formal dan terpercaya" },
  { value: "friendly", label: "Ramah - Akrab dan terbuka" },
  { value: "informative", label: "Informatif - Jelas dan faktual" },
  { value: "persuasive", label: "Persuasif - Meyakinkan dan membujuk" },
  { value: "urgent", label: "Urgensi - Menciptakan rasa mendesak" },
  { value: "question", label: "Pertanyaan - Memancing rasa ingin tahu" }
];

// Daftar industri/niche
const industries = [
  { value: "general", label: "Umum / General" },
  { value: "ecommerce", label: "E-Commerce / Toko Online" },
  { value: "finance", label: "Keuangan / Finance" },
  { value: "health", label: "Kesehatan / Health" },
  { value: "technology", label: "Teknologi / Technology" },
  { value: "education", label: "Pendidikan / Education" },
  { value: "travel", label: "Travel / Wisata" },
  { value: "food", label: "Makanan / Kuliner" },
  { value: "fashion", label: "Fashion / Pakaian" },
  { value: "property", label: "Properti / Real Estate" },
  { value: "automotive", label: "Otomotif / Automotive" }
];

export default function MetaDescriptionGenerator() {
  const [pageUrl, setPageUrl] = useState("");
  const [pageTitle, setPageTitle] = useState("");
  const [pageContent, setPageContent] = useState("");
  const [pageType, setPageType] = useState("homepage");
  const [targetKeywords, setTargetKeywords] = useState("");
  const [tone, setTone] = useState("professional");
  const [industry, setIndustry] = useState("general");
  const [language, setLanguage] = useState("id");
  const [descriptionLength, setDescriptionLength] = useState(150);
  const [includeCallToAction, setIncludeCallToAction] = useState(true);
  
  const [generatedDescriptions, setGeneratedDescriptions] = useState<string[]>([]);
  const [selectedDescription, setSelectedDescription] = useState<string>("");
  const [copied, setCopied] = useState(false);
  
  const { toast } = useToast();
  
  // Simulasi API untuk demo
  const descriptionMutation = useMutation({
    mutationFn: async (data: any) => {
      // Simulasi delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Extract primary keyword
      const primaryKeyword = targetKeywords.split(',')[0]?.trim() || pageTitle;
      
      // Contoh meta descriptions (ini akan diganti dengan API asli)
      let descriptions = [];
      
      // Variasi 1: Direct & Informative
      if (pageType === "homepage") {
        descriptions.push(`${pageTitle} - Platform terpercaya untuk ${primaryKeyword}. Temukan solusi terbaik untuk kebutuhan Anda ${includeCallToAction ? "sekarang juga!" : "."}`);
      } else if (pageType === "product") {
        descriptions.push(`Beli ${primaryKeyword} dengan harga terbaik dan kualitas terjamin di ${pageTitle}. ${includeCallToAction ? "Pesan sekarang untuk pengiriman cepat!" : ""}`);
      } else if (pageType === "blog_post") {
        descriptions.push(`Pelajari semua tentang ${primaryKeyword} dalam artikel ini. Tips, trik, dan panduan lengkap untuk memaksimalkan hasil. ${includeCallToAction ? "Baca sekarang!" : ""}`);
      } else {
        descriptions.push(`${pageTitle} - Solusi terbaik untuk ${primaryKeyword} dengan layanan profesional. ${includeCallToAction ? "Hubungi kami untuk konsultasi gratis!" : ""}`);
      }
      
      // Variasi 2: Question-based
      descriptions.push(`Mencari informasi tentang ${primaryKeyword}? ${pageTitle} menyediakan panduan lengkap dan solusi terpercaya untuk kebutuhan Anda. ${includeCallToAction ? "Kunjungi kami sekarang!" : ""}`);
      
      // Variasi 3: Benefit-focused
      descriptions.push(`Tingkatkan pengetahuan dan keahlian Anda tentang ${primaryKeyword} dengan ${pageTitle}. ${includeCallToAction ? "Mulai perjalanan Anda bersama kami hari ini!" : ""}`);
      
      // Variasi 4: Feature-based
      const features = pageContent.split(". ")[0] || primaryKeyword;
      descriptions.push(`${pageTitle} menawarkan ${features} dengan pendekatan yang unik dan profesional. ${includeCallToAction ? "Temukan lebih banyak sekarang!" : ""}`);
      
      // Variasi 5: Tailored to industry + tone
      let industryPhrase = "";
      if (industry === "ecommerce") {
        industryPhrase = "produk berkualitas";
      } else if (industry === "education") {
        industryPhrase = "pembelajaran berkualitas";
      } else if (industry === "health") {
        industryPhrase = "informasi kesehatan terpercaya";
      } else {
        industryPhrase = "solusi profesional";
      }
      
      let tonePhrase = "";
      if (tone === "professional") {
        tonePhrase = "dengan pendekatan profesional";
      } else if (tone === "friendly") {
        tonePhrase = "dengan cara yang ramah dan mudah dipahami";
      } else if (tone === "persuasive") {
        tonePhrase = "yang akan mengubah cara Anda melihat";
      } else {
        tonePhrase = "yang dirancang khusus untuk Anda";
      }
      
      descriptions.push(`${pageTitle} menyediakan ${industryPhrase} untuk ${primaryKeyword} ${tonePhrase}. ${includeCallToAction ? "Pelajari lebih lanjut sekarang!" : ""}`);
      
      // Trim descriptions to desired length
      descriptions = descriptions.map(desc => {
        if (desc.length > descriptionLength) {
          return desc.substring(0, descriptionLength - 3) + "...";
        }
        return desc;
      });
      
      return { 
        descriptions
      };
    },
    onSuccess: (data) => {
      setGeneratedDescriptions(data.descriptions);
      setSelectedDescription(data.descriptions[0] || "");
      toast({
        title: "Meta Descriptions Berhasil Dibuat",
        description: `${data.descriptions.length} variasi meta description telah dibuat`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Gagal membuat meta descriptions: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const handleGenerateDescriptions = () => {
    if (!pageTitle && !pageContent) {
      toast({
        title: "Input Tidak Lengkap",
        description: "Harap isi judul halaman atau konten halaman terlebih dahulu",
        variant: "destructive",
      });
      return;
    }
    
    const data = {
      pageUrl,
      pageTitle,
      pageContent,
      pageType,
      targetKeywords,
      tone,
      industry,
      language,
      descriptionLength,
      includeCallToAction,
    };
    
    descriptionMutation.mutate(data);
  };
  
  const handleCopy = (description: string = selectedDescription) => {
    navigator.clipboard.writeText(description);
    setCopied(true);
    toast({
      title: "Disalin!",
      description: "Meta description telah disalin ke clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const previewUrl = pageUrl || 'https://example.com/';
  const previewTitle = pageTitle || 'Judul Halaman - Nama Website';
  const previewDescription = selectedDescription || 'Meta description akan muncul di sini. Deskripsi ini akan ditampilkan di hasil pencarian Google dan membantu meningkatkan SEO halaman Anda.';
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-0">
      <Breadcrumb 
        items={[
          { label: "Tools", path: "/tools" },
          { label: "Meta Description Generator", path: "/tools/meta-description", isActive: true }
        ]} 
      />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
          <Tag className="text-cyan-600 mr-2" /> 
          Meta Description Generator
        </h1>
        <p className="text-gray-600 mt-2">
          Buat meta description yang optimal untuk SEO dan meningkatkan CTR di hasil pencarian
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="mr-2 text-cyan-600" /> Informasi Halaman
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="page-url" className="flex items-center">
                    <Globe className="h-4 w-4 mr-2" /> URL Halaman (opsional)
                  </Label>
                  <Input 
                    id="page-url"
                    value={pageUrl}
                    onChange={(e) => setPageUrl(e.target.value)}
                    placeholder="https://example.com/halaman"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="page-title" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" /> Judul Halaman
                  </Label>
                  <Input 
                    id="page-title"
                    value={pageTitle}
                    onChange={(e) => setPageTitle(e.target.value)}
                    placeholder="Masukkan judul halaman atau H1 utama"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="page-content" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" /> Konten Halaman (ringkasan)
                  </Label>
                  <Textarea 
                    id="page-content"
                    value={pageContent}
                    onChange={(e) => setPageContent(e.target.value)}
                    placeholder="Masukkan ringkasan konten halaman atau poin-poin utama"
                    className="mt-1 resize-none"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="target-keywords" className="flex items-center">
                    <Tag className="h-4 w-4 mr-2" /> Target Keywords (pisahkan dengan koma)
                  </Label>
                  <Input 
                    id="target-keywords"
                    value={targetKeywords}
                    onChange={(e) => setTargetKeywords(e.target.value)}
                    placeholder="Misalnya: SEO, meta description, tag"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="page-type" className="flex items-center">
                    <Layout className="h-4 w-4 mr-2" /> Jenis Halaman
                  </Label>
                  <Select value={pageType} onValueChange={setPageType}>
                    <SelectTrigger id="page-type" className="mt-1">
                      <SelectValue placeholder="Pilih jenis halaman" />
                    </SelectTrigger>
                    <SelectContent>
                      {pageTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="tone" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" /> Tone/Nada
                  </Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger id="tone" className="mt-1">
                      <SelectValue placeholder="Pilih tone/nada" />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map((tone) => (
                        <SelectItem key={tone.value} value={tone.value}>
                          {tone.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="industry" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" /> Industri/Niche
                  </Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger id="industry" className="mt-1">
                      <SelectValue placeholder="Pilih industri/niche" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((ind) => (
                        <SelectItem key={ind.value} value={ind.value}>
                          {ind.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="description-length" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" /> Panjang Description ({descriptionLength} karakter)
                  </Label>
                  <Slider
                    id="description-length"
                    value={[descriptionLength]}
                    onValueChange={(value) => setDescriptionLength(value[0])}
                    min={50}
                    max={160}
                    step={5}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>50</span>
                    <span>120</span>
                    <span>160</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="include-cta" className="flex items-center">
                    <MousePointer className="h-4 w-4 mr-2" /> Sertakan Call to Action
                  </Label>
                  <Switch
                    id="include-cta"
                    checked={includeCallToAction}
                    onCheckedChange={setIncludeCallToAction}
                  />
                </div>
                
                <Button 
                  className="w-full mt-2 bg-cyan-600 hover:bg-cyan-700" 
                  onClick={handleGenerateDescriptions}
                  disabled={(!pageTitle && !pageContent) || descriptionMutation.isPending}
                >
                  {descriptionMutation.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Sedang Membuat Meta Descriptions...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" /> Generate Meta Descriptions
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Search className="mr-2 text-cyan-600" /> Hasil & Preview
              </h2>
              
              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="preview">Preview SERP</TabsTrigger>
                  <TabsTrigger value="options">Variasi ({generatedDescriptions.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="preview" className="space-y-6">
                  <div className="border rounded-lg p-4 bg-white">
                    {descriptionMutation.isPending ? (
                      <div className="text-center p-12">
                        <RefreshCw className="h-12 w-12 animate-spin text-cyan-600 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">Sedang membuat meta descriptions dengan Marko AI...</p>
                        <p className="text-gray-400 text-sm mt-2">Hal ini mungkin membutuhkan beberapa detik</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-gray-400 text-xs truncate">{previewUrl}</div>
                        <div className="text-blue-700 text-xl font-medium hover:underline cursor-pointer">{previewTitle}</div>
                        <div className="text-gray-600 text-sm leading-relaxed">{previewDescription}</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="text-sm font-semibold mb-2 flex items-center">
                      <Code className="h-4 w-4 mr-2" /> HTML Meta Tag
                    </h3>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                      {`<meta name="description" content="${previewDescription}" />`}
                    </pre>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleCopy(`<meta name="description" content="${previewDescription}" />`)}
                      className="mt-2"
                    >
                      <Copy className="h-3 w-3 mr-2" /> Salin HTML
                    </Button>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold mb-2">SEO Info & Best Practices</h3>
                    <ul className="text-sm space-y-1 text-gray-600 list-disc pl-5">
                      <li>Meta description optimal antara 120-160 karakter</li>
                      <li>Sertakan keyword utama di awal description</li>
                      <li>Gunakan call-to-action yang jelas untuk meningkatkan CTR</li>
                      <li>Hindari duplikasi meta description di berbagai halaman</li>
                      <li>Pastikan deskripsi sesuai dengan konten halaman</li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="options">
                  {descriptionMutation.isPending ? (
                    <div className="text-center p-12">
                      <RefreshCw className="h-12 w-12 animate-spin text-cyan-600 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">Sedang membuat meta descriptions dengan Marko AI...</p>
                      <p className="text-gray-400 text-sm mt-2">Hal ini mungkin membutuhkan beberapa detik</p>
                    </div>
                  ) : generatedDescriptions.length > 0 ? (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                      {generatedDescriptions.map((description, index) => (
                        <div 
                          key={index} 
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedDescription === description ? 'border-cyan-600 bg-cyan-50' : 'hover:border-gray-400'}`}
                          onClick={() => setSelectedDescription(description)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-semibold text-gray-500">Variasi {index + 1}</span>
                            <div className="flex space-x-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(description);
                                }}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-gray-700">{description}</p>
                          <div className="flex justify-between mt-2">
                            <span className="text-xs text-gray-500">{description.length} karakter</span>
                            {selectedDescription === description && (
                              <span className="text-xs font-medium text-cyan-600">Terpilih</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-12 text-gray-400">
                      <Tag className="h-12 w-12 mx-auto mb-4 text-cyan-200" />
                      <p className="font-medium">Variasi meta description akan muncul di sini</p>
                      <p className="text-sm mt-2">Silakan isi form dan klik "Generate Meta Descriptions"</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}