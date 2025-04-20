import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { 
  Globe, 
  Key, 
  RefreshCw, 
  Search, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Settings, 
  ArrowRight, 
  Link as LinkIcon, 
  Calendar, 
  Clock,
  BookOpen,
  Tag,
  Loader2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AnimatedPage from "@/components/AnimatedPage";
import Breadcrumb from "@/components/Breadcrumb";
import { ask_secrets, check_secrets } from "../lib/secrets";

// Interface untuk parameter indexing
interface IndexParameters {
  sitemapUrl: string;
  googleApiKey: string;
  articleSelector: string;
  includeImages: boolean;
  includeMetadata: boolean;
  customUserAgent: string;
  indexDepth: number;
  priority: "high" | "medium" | "low";
  maxArticles: number;
  scheduleUpdate: boolean;
  updateFrequency: number;
}

// Interface untuk hasil indexing
interface IndexResult {
  success: boolean;
  articlesIndexed: number;
  articlesSkipped: number;
  totalUrls: number;
  processedUrls: string[];
  failedUrls: string[];
  metadata: {
    title: string;
    url: string;
    publishDate?: string;
    modifiedDate?: string;
    author?: string;
    categories?: string[];
    excerpt?: string;
    imageCount?: number;
  }[];
  elapsedTime: number;
}

export default function AutoIndexArtikel() {
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<{googleApiKey: string | null}>({
    googleApiKey: null
  });
  const [isApiKeyLoaded, setIsApiKeyLoaded] = useState(false);

  const [indexParams, setIndexParams] = useState<IndexParameters>({
    sitemapUrl: "",
    googleApiKey: "",
    articleSelector: "article, .post-content, .article-content, .entry-content, .content",
    includeImages: true,
    includeMetadata: true,
    customUserAgent: "MarkoAI IndexBot/1.0",
    indexDepth: 2,
    priority: "medium",
    maxArticles: 50,
    scheduleUpdate: false,
    updateFrequency: 24
  });

  const [result, setResult] = useState<IndexResult | null>(null);
  const [activeTab, setActiveTab] = useState("setup");

  // Periksa apakah API key Google sudah ada
  const checkApiKeys = async () => {
    try {
      const hasKeys = await check_secrets(["GOOGLE_INDEXING_API_KEY"]);
      if (hasKeys.GOOGLE_INDEXING_API_KEY) {
        setApiKeys({
          googleApiKey: "•••••••••••••••••••••••••••"
        });
        setIndexParams(prev => ({
          ...prev,
          googleApiKey: "API key tersimpan"
        }));
        setIsApiKeyLoaded(true);
      } else {
        requestApiKeys();
      }
    } catch (error) {
      console.error("Error checking API keys:", error);
      requestApiKeys();
    }
  };

  // Minta API key Google
  const requestApiKeys = async () => {
    try {
      await ask_secrets(
        ["GOOGLE_INDEXING_API_KEY"],
        "Kami membutuhkan Google Indexing API Key untuk menggunakan fitur Auto Index Artikel. " +
        "API key ini diperlukan untuk mengirimkan indexing request ke Google. " +
        "Anda dapat memperoleh API key dari Google Search Console atau Google Cloud Console."
      );
      
      // Setelah pengguna memasukkan API key, periksa lagi
      checkApiKeys();
    } catch (error) {
      console.error("Error requesting API keys:", error);
      toast({
        title: "Gagal meminta API key",
        description: "Tidak dapat meminta API key. Harap coba lagi nanti.",
        variant: "destructive"
      });
    }
  };

  // Check API keys when component loads
  useState(() => {
    checkApiKeys();
  });

  // Mutation untuk menjalankan indexing
  const indexMutation = useMutation({
    mutationFn: async (params: IndexParameters) => {
      // Simulasi API call - ini nanti akan diganti dengan implementasi aktual
      return new Promise<IndexResult>((resolve) => {
        // Simulasi delay processing
        const timeoutMs = 2000 + Math.random() * 3000;
        
        setTimeout(() => {
          // Simulasi response
          const processedUrls = [];
          const failedUrls = [];
          const metadata = [];
          
          // Simulasi beberapa URL yang ditemukan dari sitemap
          const totalUrls = Math.min(Math.floor(Math.random() * 100) + 10, params.maxArticles);
          
          for (let i = 0; i < totalUrls; i++) {
            const urlPath = `/article-${i+1}`;
            const fullUrl = new URL(urlPath, params.sitemapUrl).toString();
            
            // Simulasi success dan failure acak (80% success rate)
            if (Math.random() > 0.2) {
              processedUrls.push(fullUrl);
              
              // Tambahkan metadata terhadap URL yang berhasil diproses
              if (params.includeMetadata) {
                metadata.push({
                  title: `Artikel Contoh ${i+1}`,
                  url: fullUrl,
                  publishDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                  modifiedDate: new Date().toISOString(),
                  author: "Penulis Contoh",
                  categories: ["Kategori 1", "Kategori 2"],
                  excerpt: "Ini adalah ringkasan artikel yang akan ditampilkan dalam hasil pencarian...",
                  imageCount: params.includeImages ? Math.floor(Math.random() * 10) : 0
                });
              }
            } else {
              failedUrls.push(fullUrl);
            }
          }
          
          resolve({
            success: true,
            articlesIndexed: processedUrls.length,
            articlesSkipped: failedUrls.length,
            totalUrls,
            processedUrls,
            failedUrls,
            metadata,
            elapsedTime: timeoutMs / 1000
          });
        }, timeoutMs);
      });
    },
    onSuccess: (data) => {
      setResult(data);
      setActiveTab("results");
      toast({
        title: "Indexing berhasil",
        description: `Berhasil mengindeks ${data.articlesIndexed} artikel.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error saat mengindeks",
        description: `Terjadi kesalahan: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive"
      });
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setIndexParams(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSelectChange = (value: string, name: keyof IndexParameters) => {
    setIndexParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof IndexParameters) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setIndexParams(prev => ({
        ...prev,
        [fieldName]: value
      }));
    }
  };

  const startIndexing = () => {
    if (!indexParams.sitemapUrl) {
      toast({
        title: "URL Sitemap diperlukan",
        description: "Harap masukkan URL sitemap yang valid untuk melanjutkan",
        variant: "destructive"
      });
      return;
    }
    
    if (!isApiKeyLoaded) {
      toast({
        title: "API Key diperlukan",
        description: "Harap masukkan API key Google untuk melanjutkan",
        variant: "destructive"
      });
      return;
    }
    
    indexMutation.mutate(indexParams);
  };

  // Format tanggal untuk tampilan
  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <Breadcrumb 
          items={[
            { label: "Home", path: "/" },
            { label: "Tools", path: "/tools" },
            { label: "Auto Index Artikel", path: "/tools/auto-index-artikel", isActive: true }
          ]} 
        />
        
        <div className="flex flex-col space-y-2 mb-6">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Auto Index Artikel <Badge variant="outline" className="ml-2">SEO</Badge>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Indeks artikel Anda secara otomatis ke Google Search dengan mudah dan cepat
          </p>
        </div>
        
        <Tabs defaultValue="setup" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="setup">
              <Settings className="h-4 w-4 mr-2" />
              Setup
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!result}>
              <FileText className="h-4 w-4 mr-2" />
              Hasil
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Konfigurasi Utama */}
              <Card>
                <CardHeader>
                  <CardTitle>Konfigurasi Utama</CardTitle>
                  <CardDescription>
                    Masukkan informasi sitemap dan API key untuk mengindeks artikel
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="sitemapUrl">URL Sitemap <span className="text-red-500">*</span></Label>
                    <div className="flex gap-2 items-center">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <Input
                        id="sitemapUrl"
                        name="sitemapUrl"
                        placeholder="https://yourdomain.com/sitemap.xml"
                        value={indexParams.sitemapUrl}
                        onChange={handleChange}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      URL sitemap XML yang berisi daftar URL artikel Anda
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="googleApiKey">Google API Key <span className="text-red-500">*</span></Label>
                    <div className="flex gap-2 items-center">
                      <Key className="h-4 w-4 text-gray-500" />
                      <Input
                        id="googleApiKey"
                        name="googleApiKey"
                        placeholder="Masukkan API key Google"
                        value={indexParams.googleApiKey}
                        onChange={handleChange}
                        className="flex-1"
                        disabled={isApiKeyLoaded}
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={checkApiKeys}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Periksa API key</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      API key dari Google Search Console untuk indexing API
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="indexDepth">Kedalaman Index</Label>
                      <Select
                        value={indexParams.indexDepth.toString()}
                        onValueChange={(value) => handleSelectChange(value, "indexDepth")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kedalaman" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Level 1 (Sitemap saja)</SelectItem>
                          <SelectItem value="2">Level 2 (Sitemap + 1 level)</SelectItem>
                          <SelectItem value="3">Level 3 (Sitemap + 2 level)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="priority">Prioritas</Label>
                      <Select
                        value={indexParams.priority}
                        onValueChange={(value) => handleSelectChange(value as "high" | "medium" | "low", "priority")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih prioritas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">Tinggi</SelectItem>
                          <SelectItem value="medium">Sedang</SelectItem>
                          <SelectItem value="low">Rendah</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="maxArticles">Jumlah Artikel Maksimum</Label>
                    <Input
                      id="maxArticles"
                      type="number"
                      min="1"
                      max="1000"
                      value={indexParams.maxArticles}
                      onChange={(e) => handleNumberChange(e, "maxArticles")}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Jumlah maksimum artikel yang akan diindeks (1-1000)
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIndexParams({
                        sitemapUrl: "",
                        googleApiKey: isApiKeyLoaded ? "API key tersimpan" : "",
                        articleSelector: "article, .post-content, .article-content, .entry-content, .content",
                        includeImages: true,
                        includeMetadata: true,
                        customUserAgent: "MarkoAI IndexBot/1.0",
                        indexDepth: 2,
                        priority: "medium",
                        maxArticles: 50,
                        scheduleUpdate: false,
                        updateFrequency: 24
                      });
                    }}
                  >
                    Reset
                  </Button>
                  <Button 
                    onClick={startIndexing}
                    disabled={indexMutation.isPending || !indexParams.sitemapUrl || !isApiKeyLoaded}
                  >
                    {indexMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mengindeks...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Mulai Indexing
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Pengaturan Lanjutan */}
              <Card>
                <CardHeader>
                  <CardTitle>Pengaturan Lanjutan</CardTitle>
                  <CardDescription>
                    Konfigurasi tambahan untuk pengindeksan artikel
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="articleSelector">Selector Artikel</Label>
                    <Input
                      id="articleSelector"
                      name="articleSelector"
                      placeholder="article, .post-content, .entry-content"
                      value={indexParams.articleSelector}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      CSS selector untuk menemukan konten artikel di halaman
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="includeImages">Sertakan Gambar</Label>
                      <p className="text-xs text-gray-500">
                        Indeks gambar yang terdapat dalam artikel
                      </p>
                    </div>
                    <Switch
                      id="includeImages"
                      name="includeImages"
                      checked={indexParams.includeImages}
                      onCheckedChange={(checked) => setIndexParams(prev => ({...prev, includeImages: checked}))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="includeMetadata">Ambil Metadata</Label>
                      <p className="text-xs text-gray-500">
                        Ambil metadata seperti tanggal, penulis, kategori, dll.
                      </p>
                    </div>
                    <Switch
                      id="includeMetadata"
                      name="includeMetadata"
                      checked={indexParams.includeMetadata}
                      onCheckedChange={(checked) => setIndexParams(prev => ({...prev, includeMetadata: checked}))}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-1">
                    <Label htmlFor="customUserAgent">User Agent Kustom</Label>
                    <Input
                      id="customUserAgent"
                      name="customUserAgent"
                      placeholder="MarkoAI IndexBot/1.0"
                      value={indexParams.customUserAgent}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      User agent yang akan digunakan saat mengakses artikel
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="scheduleUpdate">Jadwalkan Update</Label>
                      <p className="text-xs text-gray-500">
                        Jadwalkan update otomatis dari sitemap
                      </p>
                    </div>
                    <Switch
                      id="scheduleUpdate"
                      name="scheduleUpdate"
                      checked={indexParams.scheduleUpdate}
                      onCheckedChange={(checked) => setIndexParams(prev => ({...prev, scheduleUpdate: checked}))}
                    />
                  </div>
                  
                  {indexParams.scheduleUpdate && (
                    <div className="space-y-1 pt-2">
                      <Label htmlFor="updateFrequency">Frekuensi Update (jam)</Label>
                      <Input
                        id="updateFrequency"
                        type="number"
                        min="1"
                        max="168"
                        value={indexParams.updateFrequency}
                        onChange={(e) => handleNumberChange(e, "updateFrequency")}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Seberapa sering sitemap harus diperbarui (dalam jam)
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Bantuan dan Panduan */}
            <div className="mt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Bagaimana cara kerja Auto Index Artikel?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm">
                      Auto Index Artikel bekerja dengan mengambil URL dari sitemap XML Anda, kemudian mengirimkan
                      permintaan indexing ke Google Search Console API. Ini membantu artikel Anda diindeks lebih cepat
                      oleh Google, sehingga bisa segera muncul dalam hasil pencarian. Tool ini juga mengambil metadata
                      artikel untuk memberikan wawasan tentang konten yang diindeks.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>Cara mendapatkan Google API Key</AccordionTrigger>
                  <AccordionContent>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>Buka <a href="https://console.cloud.google.com/" target="_blank" className="text-primary">Google Cloud Console</a></li>
                      <li>Buat project baru atau pilih project yang sudah ada</li>
                      <li>Aktifkan "Indexing API" di bagian "Library"</li>
                      <li>Buat kredensial (API key) untuk mengakses API</li>
                      <li>Pastikan website Anda telah diverifikasi di Google Search Console</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>Tips mengoptimalkan indexing</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>Pastikan sitemap XML Anda selalu up-to-date</li>
                      <li>Gunakan selector artikel yang tepat sesuai struktur halaman Anda</li>
                      <li>Jadwalkan update indexing secara berkala untuk konten baru</li>
                      <li>Batasi jumlah artikel per request untuk menghindari pembatasan rate limit API</li>
                      <li>Pastikan artikel Anda memiliki metadata yang lengkap (title, description, dll.)</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            {result && (
              <div className="space-y-6">
                {/* Ringkasan Hasil */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      Hasil Indexing
                    </CardTitle>
                    <CardDescription>
                      Ringkasan hasil proses indexing artikel
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-primary/10 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">Total URL</p>
                        <h3 className="text-2xl font-bold">{result.totalUrls}</h3>
                      </div>
                      
                      <div className="bg-green-500/10 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">Artikel Terindeks</p>
                        <h3 className="text-2xl font-bold text-green-600">{result.articlesIndexed}</h3>
                      </div>
                      
                      <div className="bg-yellow-500/10 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">Artikel Dilewati</p>
                        <h3 className="text-2xl font-bold text-yellow-600">{result.articlesSkipped}</h3>
                      </div>
                      
                      <div className="bg-blue-500/10 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">Waktu Proses</p>
                        <h3 className="text-2xl font-bold text-blue-600">{result.elapsedTime.toFixed(2)}s</h3>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Label className="mb-2">Status Indexing</Label>
                      <Progress value={(result.articlesIndexed / result.totalUrls) * 100} className="h-2" />
                      
                      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <span>{Math.round((result.articlesIndexed / result.totalUrls) * 100)}% Berhasil</span>
                        <span>{result.articlesIndexed} dari {result.totalUrls}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Detail Artikel Terindeks */}
                <Card>
                  <CardHeader>
                    <CardTitle>Artikel yang Berhasil Diindeks</CardTitle>
                    <CardDescription>
                      {result.articlesIndexed} artikel berhasil diindeks dari sitemap
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="list">
                      <TabsList className="mb-4">
                        <TabsTrigger value="list">
                          <FileText className="h-4 w-4 mr-2" />
                          Daftar
                        </TabsTrigger>
                        <TabsTrigger value="metadata" disabled={!result.metadata || result.metadata.length === 0}>
                          <Tag className="h-4 w-4 mr-2" />
                          Metadata
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="list">
                        <ScrollArea className="h-[400px]">
                          <div className="space-y-2">
                            {result.processedUrls.map((url, index) => (
                              <div key={index} className="flex items-center p-2 rounded-md hover:bg-muted">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 shrink-0" />
                                <a 
                                  href={url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm truncate hover:underline text-primary flex-1"
                                >
                                  {url}
                                </a>
                                <Badge variant="outline" className="ml-2">Terindeks</Badge>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                      
                      <TabsContent value="metadata">
                        <ScrollArea className="h-[400px]">
                          <div className="space-y-4">
                            {result.metadata && result.metadata.map((item, index) => (
                              <Card key={index}>
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold">{item.title}</h3>
                                    <Badge variant="outline">
                                      {item.imageCount} Gambar
                                    </Badge>
                                  </div>
                                  
                                  <div className="text-sm text-primary mb-2">
                                    <a 
                                      href={item.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="flex items-center hover:underline"
                                    >
                                      <LinkIcon className="h-3 w-3 mr-1" />
                                      {item.url}
                                    </a>
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-2 mb-2 text-xs text-muted-foreground">
                                    {item.publishDate && (
                                      <div className="flex items-center">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {formatDate(item.publishDate)}
                                      </div>
                                    )}
                                    
                                    {item.modifiedDate && (
                                      <div className="flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        Diubah: {formatDate(item.modifiedDate)}
                                      </div>
                                    )}
                                    
                                    {item.author && (
                                      <div className="flex items-center">
                                        <span>Penulis: {item.author}</span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {item.categories && item.categories.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-2">
                                      {item.categories.map((category, idx) => (
                                        <Badge key={idx} variant="secondary" className="text-xs">
                                          {category}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                  
                                  {item.excerpt && (
                                    <p className="text-sm text-muted-foreground mt-2">
                                      {item.excerpt}
                                    </p>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
                
                {/* Artikel yang Gagal */}
                {result.failedUrls.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        Artikel yang Gagal Diindeks
                      </CardTitle>
                      <CardDescription>
                        {result.failedUrls.length} artikel gagal diindeks karena berbagai alasan
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[200px]">
                        <div className="space-y-2">
                          {result.failedUrls.map((url, index) => (
                            <div key={index} className="flex items-center p-2 rounded-md hover:bg-muted">
                              <AlertCircle className="h-4 w-4 text-red-500 mr-2 shrink-0" />
                              <a 
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm truncate hover:underline flex-1"
                              >
                                {url}
                              </a>
                              <Badge variant="destructive" className="ml-2">Gagal</Badge>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Coba Lagi Indexing yang Gagal
                      </Button>
                    </CardFooter>
                  </Card>
                )}
                
                {/* Tombol Aksi */}
                <div className="flex gap-4 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("setup")}
                  >
                    Kembali ke Setup
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Mulai Indexing Baru
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Mulai Indexing Baru?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tindakan ini akan memulai proses indexing baru dengan parameter yang telah Anda atur.
                          Hasil indexing saat ini akan dihapus.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => {
                            setActiveTab("setup");
                            setTimeout(() => {
                              startIndexing();
                            }, 500);
                          }}
                        >
                          Lanjutkan
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AnimatedPage>
  );
}