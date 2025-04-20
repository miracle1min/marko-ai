import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { 
  FileText, 
  BarChart2, 
  ArrowRight, 
  Search, 
  LoaderCircle, 
  Check, 
  Tag, 
  Code, 
  ListChecks, 
  FileCode,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Breadcrumb from "@/components/Breadcrumb";
import AnimatedPage from "@/components/AnimatedPage";
import { useToast } from "@/hooks/use-toast";
import { SEOContentRequest, SEOContentResponse } from "@/lib/types";
import { optimizeSEOContent } from "@/lib/geminiApi";

export default function SEOContentOptimizer() {
  const { toast } = useToast();
  
  // Form state
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [targetKeyword, setTargetKeyword] = useState<string>("");
  const [secondaryKeywords, setSecondaryKeywords] = useState<string>("");
  const [contentType, setContentType] = useState<string>("blog");
  const [targetWordCount, setTargetWordCount] = useState<string>("");
  const [includeMetaTags, setIncludeMetaTags] = useState<boolean>(true);
  const [includeSchemaMarkup, setIncludeSchemaMarkup] = useState<boolean>(false);
  const [includeTags, setIncludeTags] = useState<boolean>(true);
  const [additionalInstructions, setAdditionalInstructions] = useState<string>("");
  
  // Response state
  const [result, setResult] = useState<SEOContentResponse | null>(null);
  const [activeTab, setActiveTab] = useState<string>("content");
  
  // Content type options
  const contentTypeOptions = [
    { value: "blog", label: "Artikel Blog" },
    { value: "product", label: "Halaman Produk" },
    { value: "landing", label: "Landing Page" },
    { value: "article", label: "Artikel Berita" },
    { value: "category", label: "Halaman Kategori" },
    { value: "about", label: "Halaman Tentang Kami" },
    { value: "service", label: "Halaman Layanan" }
  ];
  
  // Handle API mutation
  const optimizeMutation = useMutation({
    mutationFn: async (request: SEOContentRequest) => {
      return await optimizeSEOContent(request);
    },
    onSuccess: (data: SEOContentResponse) => {
      setResult(data);
      toast({
        title: "Optimasi konten berhasil",
        description: "Konten berhasil dioptimalkan untuk SEO"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal mengoptimalkan konten",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Handle form submission
  const handleSubmit = () => {
    if (!content) {
      toast({
        title: "Konten diperlukan",
        description: "Silakan masukkan konten yang ingin dioptimalkan",
        variant: "destructive"
      });
      return;
    }
    
    if (!targetKeyword) {
      toast({
        title: "Kata kunci target diperlukan",
        description: "Silakan masukkan kata kunci utama untuk optimasi",
        variant: "destructive"
      });
      return;
    }
    
    if (!title) {
      toast({
        title: "Judul diperlukan",
        description: "Silakan masukkan judul konten Anda",
        variant: "destructive"
      });
      return;
    }
    
    const secondaryKeywordsArray = secondaryKeywords
      ? secondaryKeywords.split(',').map(keyword => keyword.trim()).filter(Boolean)
      : undefined;
    
    const wordCountNumber = targetWordCount ? parseInt(targetWordCount, 10) : undefined;
    
    const request: SEOContentRequest = {
      title,
      content,
      targetKeyword,
      secondaryKeywords: secondaryKeywordsArray,
      contentType,
      targetWordCount: wordCountNumber,
      includeMetaTags,
      includeSchemaMarkup,
      includeTags,
      additionalInstructions: additionalInstructions || undefined
    };
    
    optimizeMutation.mutate(request);
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Disalin ke clipboard",
      description: "Teks berhasil disalin ke clipboard"
    });
  };

  return (
    <AnimatedPage>
      <div className="container mx-auto py-6 max-w-7xl">
        <Breadcrumb
        items={[
          { label: "Beranda", path: "/" },
          { label: "Tools", path: "/tools" },
          { label: "SEO Content Optimizer", path: "/tools/seo-optimizer", isActive: true }
        ]}
      />
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Search className="h-5 w-5 mr-2 text-primary" />
                SEO Content Optimizer
              </CardTitle>
              <CardDescription>
                Optimalkan konten Anda untuk mesin pencari dan tingkatkan peringkat di Google
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Konten <span className="text-red-500">*</span></Label>
                  <Input 
                    id="title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Masukkan judul konten Anda"
                    disabled={optimizeMutation.isPending}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Konten <span className="text-red-500">*</span></Label>
                  <Textarea 
                    id="content" 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    placeholder="Tempel konten yang ingin dioptimalkan di sini"
                    rows={6}
                    disabled={optimizeMutation.isPending}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="targetKeyword">Kata Kunci Utama <span className="text-red-500">*</span></Label>
                  <Input 
                    id="targetKeyword" 
                    value={targetKeyword} 
                    onChange={(e) => setTargetKeyword(e.target.value)} 
                    placeholder="Kata kunci utama untuk target optimasi"
                    disabled={optimizeMutation.isPending}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondaryKeywords">Kata Kunci Sekunder (pisahkan dengan koma)</Label>
                  <Input 
                    id="secondaryKeywords" 
                    value={secondaryKeywords} 
                    onChange={(e) => setSecondaryKeywords(e.target.value)} 
                    placeholder="kata kunci 1, kata kunci 2, kata kunci 3"
                    disabled={optimizeMutation.isPending}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contentType">Tipe Konten</Label>
                  <Select
                    value={contentType}
                    onValueChange={setContentType}
                    disabled={optimizeMutation.isPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe konten" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="targetWordCount">Target Jumlah Kata (opsional)</Label>
                  <Input 
                    id="targetWordCount" 
                    value={targetWordCount} 
                    onChange={(e) => setTargetWordCount(e.target.value)} 
                    placeholder="Masukkan jumlah kata target"
                    type="number"
                    disabled={optimizeMutation.isPending}
                  />
                </div>
                
                <div className="space-y-3">
                  <Label>Opsi Tambahan</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeMetaTags" 
                      checked={includeMetaTags} 
                      onCheckedChange={(checked) => setIncludeMetaTags(checked as boolean)}
                      disabled={optimizeMutation.isPending}
                    />
                    <Label htmlFor="includeMetaTags" className="cursor-pointer">
                      Sertakan Meta Tags (title, description)
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeSchemaMarkup" 
                      checked={includeSchemaMarkup} 
                      onCheckedChange={(checked) => setIncludeSchemaMarkup(checked as boolean)}
                      disabled={optimizeMutation.isPending}
                    />
                    <Label htmlFor="includeSchemaMarkup" className="cursor-pointer">
                      Sertakan Schema Markup
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeTags" 
                      checked={includeTags} 
                      onCheckedChange={(checked) => setIncludeTags(checked as boolean)}
                      disabled={optimizeMutation.isPending}
                    />
                    <Label htmlFor="includeTags" className="cursor-pointer">
                      Sertakan Tags
                    </Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="additionalInstructions">Instruksi Tambahan (opsional)</Label>
                  <Textarea 
                    id="additionalInstructions" 
                    value={additionalInstructions} 
                    onChange={(e) => setAdditionalInstructions(e.target.value)} 
                    placeholder="Tambahkan instruksi atau permintaan khusus untuk optimasi"
                    rows={2}
                    disabled={optimizeMutation.isPending}
                  />
                </div>
                
                <Button 
                  type="button" 
                  onClick={handleSubmit} 
                  className="w-full"
                  disabled={optimizeMutation.isPending}
                >
                  {optimizeMutation.isPending ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Mengoptimalkan Konten...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Optimalkan untuk SEO
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Manfaat Optimasi SEO</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex">
                  <ArrowRight className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                  <span>Tingkatkan peringkat di hasil pencarian Google</span>
                </li>
                <li className="flex">
                  <ArrowRight className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                  <span>Dapatkan lebih banyak trafik organik ke website Anda</span>
                </li>
                <li className="flex">
                  <ArrowRight className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                  <span>Tingkatkan relevansi konten terhadap kata kunci target</span>
                </li>
                <li className="flex">
                  <ArrowRight className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                  <span>Perbaiki struktur dan keterbacaan konten</span>
                </li>
                <li className="flex">
                  <ArrowRight className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                  <span>Dapatkan rekomendasi untuk meningkatkan skor SEO</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:w-2/3">
          {!result && !optimizeMutation.isPending && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] border rounded-lg p-8 bg-muted/30">
              <Search className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Optimalkan Konten untuk SEO</h3>
              <p className="text-center text-muted-foreground max-w-md mb-6">
                Masukkan konten Anda di formulir sebelah kiri untuk mengoptimalkannya untuk mesin pencari. Anda akan mendapatkan versi yang dioptimasi beserta rekomendasi untuk meningkatkan peringkat di mesin pencari.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Badge variant="outline" className="py-1.5 px-3">Kata Kunci</Badge>
                <Badge variant="outline" className="py-1.5 px-3">Meta Tags</Badge>
                <Badge variant="outline" className="py-1.5 px-3">Headings</Badge>
                <Badge variant="outline" className="py-1.5 px-3">Struktur</Badge>
                <Badge variant="outline" className="py-1.5 px-3">Schema Markup</Badge>
                <Badge variant="outline" className="py-1.5 px-3">Tags</Badge>
              </div>
            </div>
          )}
          
          {optimizeMutation.isPending && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] border rounded-lg p-8">
              <LoaderCircle className="h-12 w-12 text-primary mb-4 animate-spin" />
              <h3 className="text-xl font-medium mb-2">Mengoptimalkan Konten Anda...</h3>
              <p className="text-center text-muted-foreground max-w-md">
                Sistem AI kami sedang menganalisis dan mengoptimalkan konten Anda untuk mesin pencari. Proses ini mungkin memerlukan waktu beberapa detik.
              </p>
            </div>
          )}
          
          {result && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription className="mt-1">
                      Kata kunci utama: <Badge variant="secondary">{targetKeyword}</Badge>
                    </CardDescription>
                  </div>
                  
                  {result.contentScore !== undefined && (
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">Skor SEO</div>
                      <div className="flex items-center gap-3">
                        <Progress value={result.contentScore} className="w-24 h-2" />
                        <span className="font-medium">{result.contentScore}/100</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4 flex flex-wrap">
                    <TabsTrigger value="content" className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Konten Optimal
                    </TabsTrigger>
                    
                    {result.metaTitle && (
                      <TabsTrigger value="meta" className="flex items-center">
                        <Tag className="h-4 w-4 mr-2" />
                        Meta Tags
                      </TabsTrigger>
                    )}
                    
                    {result.suggestedHeadings && result.suggestedHeadings.length > 0 && (
                      <TabsTrigger value="headings" className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        Headings
                      </TabsTrigger>
                    )}
                    
                    {result.recommendations && result.recommendations.length > 0 && (
                      <TabsTrigger value="recommendations" className="flex items-center">
                        <ListChecks className="h-4 w-4 mr-2" />
                        Rekomendasi
                      </TabsTrigger>
                    )}
                    
                    {result.schemaMarkup && (
                      <TabsTrigger value="schema" className="flex items-center">
                        <Code className="h-4 w-4 mr-2" />
                        Schema
                      </TabsTrigger>
                    )}
                    
                    {result.tags && result.tags.length > 0 && (
                      <TabsTrigger value="tags" className="flex items-center">
                        <Tag className="h-4 w-4 mr-2" />
                        Tags
                      </TabsTrigger>
                    )}
                  </TabsList>
                  
                  <TabsContent value="content" className="mt-0">
                    <div className="flex justify-end mb-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(result.optimizedContent)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Salin Konten
                      </Button>
                    </div>
                    <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert border p-4 rounded-md">
                      {result.optimizedContent.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </TabsContent>
                  
                  {result.metaTitle && (
                    <TabsContent value="meta" className="mt-0">
                      <div className="space-y-4">
                        <div className="border p-4 rounded-md space-y-2">
                          <div className="flex justify-between">
                            <Label>Meta Title</Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(result.metaTitle || "")}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Salin
                            </Button>
                          </div>
                          <div className="font-medium text-blue-600 dark:text-blue-400">{result.metaTitle}</div>
                          <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${result.metaTitle.length > 60 ? 'bg-red-500' : 'bg-green-500'}`} 
                              style={{ width: `${Math.min(100, (result.metaTitle.length / 60) * 100)}%` }}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {result.metaTitle.length}/60 karakter {result.metaTitle.length > 60 && "(terlalu panjang)"}
                          </div>
                        </div>
                        
                        {result.metaDescription && (
                          <div className="border p-4 rounded-md space-y-2">
                            <div className="flex justify-between">
                              <Label>Meta Description</Label>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(result.metaDescription || "")}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Salin
                              </Button>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{result.metaDescription}</div>
                            <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${result.metaDescription.length > 160 ? 'bg-red-500' : 'bg-green-500'}`} 
                                style={{ width: `${Math.min(100, (result.metaDescription.length / 160) * 100)}%` }}
                              />
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {result.metaDescription.length}/160 karakter {result.metaDescription.length > 160 && "(terlalu panjang)"}
                            </div>
                          </div>
                        )}
                        
                        {result.suggestedH1 && (
                          <div className="border p-4 rounded-md space-y-2">
                            <div className="flex justify-between">
                              <Label>Judul H1 yang Disarankan</Label>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(result.suggestedH1 || "")}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Salin
                              </Button>
                            </div>
                            <div className="font-semibold text-lg">{result.suggestedH1}</div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  )}
                  
                  {result.suggestedHeadings && result.suggestedHeadings.length > 0 && (
                    <TabsContent value="headings" className="mt-0">
                      <div className="space-y-4">
                        <div className="border p-4 rounded-md">
                          <h3 className="text-lg font-medium mb-3">Heading yang Disarankan</h3>
                          <div className="space-y-2">
                            {result.suggestedHeadings.map((heading, index) => (
                              <div key={index} className="flex items-start border p-3 rounded-md">
                                <div className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs mr-3 mt-0.5">H2</div>
                                <div className="flex-1">{heading}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {result.recommendedKeywords && result.recommendedKeywords.length > 0 && (
                          <div className="border p-4 rounded-md">
                            <h3 className="text-lg font-medium mb-3">Kata Kunci yang Direkomendasikan</h3>
                            <div className="flex flex-wrap gap-2">
                              {result.recommendedKeywords.map((keyword, index) => (
                                <Badge key={index} variant="secondary">{keyword}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  )}
                  
                  {result.recommendations && result.recommendations.length > 0 && (
                    <TabsContent value="recommendations" className="mt-0">
                      <div className="border p-4 rounded-md">
                        <h3 className="text-lg font-medium mb-3">Rekomendasi Peningkatan SEO</h3>
                        <ul className="space-y-2">
                          {result.recommendations.map((recommendation, index) => (
                            <li key={index} className="flex">
                              <AlertCircle className="h-5 w-5 text-blue-500 mr-2 shrink-0 mt-0.5" />
                              <span>{recommendation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TabsContent>
                  )}
                  
                  {result.schemaMarkup && (
                    <TabsContent value="schema" className="mt-0">
                      <div className="border p-4 rounded-md space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Schema Markup (JSON-LD)</h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(result.schemaMarkup || "")}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Salin Schema
                          </Button>
                        </div>
                        <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto font-mono text-sm">
                          <pre>{result.schemaMarkup}</pre>
                        </div>
                        <Alert>
                          <FileCode className="h-4 w-4" />
                          <AlertTitle>Cara Mengimplementasikan</AlertTitle>
                          <AlertDescription>
                            Tambahkan script ini di dalam tag <code>&lt;head&gt;</code> dari halaman website Anda untuk meningkatkan rich snippets di hasil pencarian.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </TabsContent>
                  )}
                  
                  {result.tags && result.tags.length > 0 && (
                    <TabsContent value="tags" className="mt-0">
                      <div className="border p-4 rounded-md">
                        <h3 className="text-lg font-medium mb-3">Tags yang Direkomendasikan</h3>
                        <div className="flex flex-wrap gap-2">
                          {result.tags.map((tag, index) => (
                            <Badge key={index}>{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
    </AnimatedPage>
  );
}