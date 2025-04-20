import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Search,
  FileText,
  BarChart2,
  ArrowUpRight,
  Tag,
  RefreshCw,
  Copy,
  Check,
  Download,
  Users,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import Breadcrumb from "@/components/Breadcrumb";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Daftar niches/industries
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
  { value: "automotive", label: "Otomotif / Automotive" },
];

// Daftar jenis konten
const contentTypes = [
  { value: "blog", label: "Blog / Artikel" },
  { value: "product", label: "Halaman Produk" },
  { value: "service", label: "Halaman Layanan" },
  { value: "landing", label: "Landing Page" },
  { value: "homepage", label: "Homepage" },
  { value: "social", label: "Konten Media Sosial" },
];

// Sample keyword data for demonstration
interface KeywordData {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  cpc: number;
  competition: number;
}

export default function KeywordResearch() {
  const [mainKeyword, setMainKeyword] = useState("");
  const [industry, setIndustry] = useState("general");
  const [language, setLanguage] = useState("id");
  const [location, setLocation] = useState("id");
  const [contentType, setContentType] = useState("blog");
  const [includeQuestions, setIncludeQuestions] = useState(true);
  const [includeRelated, setIncludeRelated] = useState(true);
  const [includeLongTail, setIncludeLongTail] = useState(true);
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  
  const [keywordResults, setKeywordResults] = useState<KeywordData[]>([]);
  const [copied, setCopied] = useState(false);
  
  const { toast } = useToast();
  
  // Simulasi API untuk demo
  const keywordMutation = useMutation({
    mutationFn: async (data: any) => {
      // Simulasi delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Contoh data keyword (ini akan diganti dengan API asli)
      const results = [
        {
          keyword: `${mainKeyword}`,
          searchVolume: Math.floor(Math.random() * 10000) + 1000,
          difficulty: Math.floor(Math.random() * 100),
          cpc: parseFloat((Math.random() * 5).toFixed(2)),
          competition: parseFloat((Math.random() * 1).toFixed(2)),
        },
        {
          keyword: `cara ${mainKeyword}`,
          searchVolume: Math.floor(Math.random() * 5000) + 500,
          difficulty: Math.floor(Math.random() * 100),
          cpc: parseFloat((Math.random() * 5).toFixed(2)),
          competition: parseFloat((Math.random() * 1).toFixed(2)),
        },
        {
          keyword: `${mainKeyword} terbaik`,
          searchVolume: Math.floor(Math.random() * 3000) + 300,
          difficulty: Math.floor(Math.random() * 100),
          cpc: parseFloat((Math.random() * 5).toFixed(2)),
          competition: parseFloat((Math.random() * 1).toFixed(2)),
        },
        {
          keyword: `${mainKeyword} murah`,
          searchVolume: Math.floor(Math.random() * 2000) + 200,
          difficulty: Math.floor(Math.random() * 100),
          cpc: parseFloat((Math.random() * 5).toFixed(2)),
          competition: parseFloat((Math.random() * 1).toFixed(2)),
        },
        {
          keyword: `${mainKeyword} online`,
          searchVolume: Math.floor(Math.random() * 1500) + 100,
          difficulty: Math.floor(Math.random() * 100),
          cpc: parseFloat((Math.random() * 5).toFixed(2)),
          competition: parseFloat((Math.random() * 1).toFixed(2)),
        },
        {
          keyword: `${mainKeyword} vs`,
          searchVolume: Math.floor(Math.random() * 1200) + 50,
          difficulty: Math.floor(Math.random() * 100),
          cpc: parseFloat((Math.random() * 5).toFixed(2)),
          competition: parseFloat((Math.random() * 1).toFixed(2)),
        },
        {
          keyword: `apa itu ${mainKeyword}`,
          searchVolume: Math.floor(Math.random() * 1000) + 50,
          difficulty: Math.floor(Math.random() * 100),
          cpc: parseFloat((Math.random() * 5).toFixed(2)),
          competition: parseFloat((Math.random() * 1).toFixed(2)),
        },
        {
          keyword: `${mainKeyword} untuk pemula`,
          searchVolume: Math.floor(Math.random() * 900) + 30,
          difficulty: Math.floor(Math.random() * 100),
          cpc: parseFloat((Math.random() * 5).toFixed(2)),
          competition: parseFloat((Math.random() * 1).toFixed(2)),
        },
        {
          keyword: `manfaat ${mainKeyword}`,
          searchVolume: Math.floor(Math.random() * 800) + 20,
          difficulty: Math.floor(Math.random() * 100),
          cpc: parseFloat((Math.random() * 5).toFixed(2)),
          competition: parseFloat((Math.random() * 1).toFixed(2)),
        },
        {
          keyword: `${mainKeyword} gratis`,
          searchVolume: Math.floor(Math.random() * 700) + 10,
          difficulty: Math.floor(Math.random() * 100),
          cpc: parseFloat((Math.random() * 5).toFixed(2)),
          competition: parseFloat((Math.random() * 1).toFixed(2)),
        },
      ];
      
      return { 
        keywordData: results
      };
    },
    onSuccess: (data) => {
      setKeywordResults(data.keywordData);
      toast({
        title: "Keyword Research Selesai",
        description: `Berhasil menemukan ${data.keywordData.length} keyword terkait`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Gagal melakukan keyword research: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const handleKeywordResearch = () => {
    if (!mainKeyword) {
      toast({
        title: "Input Tidak Lengkap",
        description: "Harap isi keyword utama terlebih dahulu",
        variant: "destructive",
      });
      return;
    }
    
    const data = {
      mainKeyword,
      industry,
      language,
      location,
      contentType,
      includeQuestions,
      includeRelated,
      includeLongTail,
      additionalInstructions,
    };
    
    keywordMutation.mutate(data);
  };
  
  const handleExportCSV = () => {
    if (keywordResults.length === 0) return;
    
    const header = "Keyword,Search Volume,Difficulty,CPC,Competition\n";
    const csvContent = keywordResults.map(row => 
      `"${row.keyword}",${row.searchVolume},${row.difficulty},${row.cpc},${row.competition}`
    ).join("\n");
    
    const blob = new Blob([header + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `keyword-research-${mainKeyword}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "CSV Diunduh",
      description: "File CSV berhasil diunduh",
    });
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-6">
      <Breadcrumb 
        items={[
          { label: "Tools", path: "/tools" },
          { label: "Keyword Research", path: "/tools/keyword-research", isActive: true }
        ]} 
      />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
          <Search className="text-amber-600 mr-2" /> 
          Keyword Research Tool
        </h1>
        <p className="text-gray-600 mt-2">
          Temukan keyword potensial untuk meningkatkan visibilitas konten Anda di mesin pencari
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Search className="mr-2 text-amber-600" /> Opsi Riset Keyword
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="main-keyword" className="flex items-center">
                    <Tag className="h-4 w-4 mr-2" /> Keyword Utama
                  </Label>
                  <Input 
                    id="main-keyword"
                    value={mainKeyword}
                    onChange={(e) => setMainKeyword(e.target.value)}
                    placeholder="Misalnya: SEO, digital marketing, etc."
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="industry" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" /> Industri / Niche
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
                    <Globe className="h-4 w-4 mr-2" /> Bahasa
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
                  <Label htmlFor="location" className="flex items-center">
                    <Globe className="h-4 w-4 mr-2" /> Lokasi
                  </Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger id="location" className="mt-1">
                      <SelectValue placeholder="Pilih lokasi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="id">Indonesia</SelectItem>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="global">Global</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="content-type" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" /> Jenis Konten
                  </Label>
                  <Select value={contentType} onValueChange={setContentType}>
                    <SelectTrigger id="content-type" className="mt-1">
                      <SelectValue placeholder="Pilih jenis konten" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="include-questions" className="flex items-center">
                    <Users className="h-4 w-4 mr-2" /> Sertakan Keywords Pertanyaan
                  </Label>
                  <Switch
                    id="include-questions"
                    checked={includeQuestions}
                    onCheckedChange={setIncludeQuestions}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="include-related" className="flex items-center">
                    <Tag className="h-4 w-4 mr-2" /> Sertakan Keywords Terkait
                  </Label>
                  <Switch
                    id="include-related"
                    checked={includeRelated}
                    onCheckedChange={setIncludeRelated}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="include-long-tail" className="flex items-center">
                    <Tag className="h-4 w-4 mr-2" /> Sertakan Long-tail Keywords
                  </Label>
                  <Switch
                    id="include-long-tail"
                    checked={includeLongTail}
                    onCheckedChange={setIncludeLongTail}
                  />
                </div>
                
                <div>
                  <Label htmlFor="additional-instructions" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" /> Instruksi Tambahan (opsional)
                  </Label>
                  <Textarea 
                    id="additional-instructions"
                    value={additionalInstructions}
                    onChange={(e) => setAdditionalInstructions(e.target.value)}
                    placeholder="Tambahkan instruksi spesifik lainnya untuk pencarian keyword..."
                    className="mt-1 resize-none"
                    rows={3}
                  />
                </div>
                
                <Button 
                  className="w-full mt-2 bg-amber-600 hover:bg-amber-700" 
                  onClick={handleKeywordResearch}
                  disabled={!mainKeyword || keywordMutation.isPending}
                >
                  {keywordMutation.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Sedang Mencari Keyword...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" /> Mulai Riset Keyword
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
                  <BarChart2 className="mr-2 text-amber-600" /> Hasil Keyword Research
                </h2>
                {keywordResults.length > 0 && (
                  <Button variant="outline" onClick={handleExportCSV} className="flex items-center">
                    <Download className="h-4 w-4 mr-2" /> Export CSV
                  </Button>
                )}
              </div>
              
              <Separator className="mb-4" />
              
              <div className="rounded-lg border">
                {keywordMutation.isPending ? (
                  <div className="text-center p-12">
                    <RefreshCw className="h-12 w-12 animate-spin text-amber-600 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Sedang mencari keyword dengan Marko AI...</p>
                    <p className="text-gray-400 text-sm mt-2">Hal ini mungkin membutuhkan beberapa detik</p>
                  </div>
                ) : keywordResults.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-bold">Keyword</TableHead>
                          <TableHead className="text-right font-bold">Search Volume</TableHead>
                          <TableHead className="text-right font-bold">Difficulty</TableHead>
                          <TableHead className="text-right font-bold">CPC ($)</TableHead>
                          <TableHead className="text-right font-bold">Competition</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {keywordResults.map((keyword, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{keyword.keyword}</TableCell>
                            <TableCell className="text-right">{keyword.searchVolume.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end">
                                <span>{keyword.difficulty}/100</span>
                                <div className="ml-2 w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${
                                      keyword.difficulty < 30 ? 'bg-green-500' : 
                                      keyword.difficulty < 60 ? 'bg-yellow-500' : 
                                      'bg-red-500'
                                    }`} 
                                    style={{width: `${keyword.difficulty}%`}}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">${keyword.cpc}</TableCell>
                            <TableCell className="text-right">{keyword.competition.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center p-12 text-gray-400">
                    <Search className="h-12 w-12 mx-auto mb-4 text-amber-200" />
                    <p className="font-medium">Hasil penelusuran keyword akan muncul di sini</p>
                    <p className="text-sm mt-2">Silakan isi form di sebelah kiri dan klik Mulai Riset Keyword</p>
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