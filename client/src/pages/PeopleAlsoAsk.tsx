import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  PeopleAlsoAskRequest, 
  PeopleAlsoAskResponse 
} from "@/lib/types";
import { getPeopleAlsoAskQuestions } from "@/lib/geminiApi";
import { ArrowRight, Copy, Search, Sparkles, Share2, Bookmark } from "lucide-react";

export default function PeopleAlsoAsk() {
  const [keyword, setKeyword] = useState("");
  const [language, setLanguage] = useState<string>("id");
  const [includeMetrics, setIncludeMetrics] = useState<boolean>(true);
  const [limit, setLimit] = useState<number>(10);
  const [activeTab, setActiveTab] = useState<string>("questions");
  
  const askMutation = useMutation({
    mutationFn: async (request: PeopleAlsoAskRequest) => {
      return getPeopleAlsoAskQuestions(request);
    },
    onError: (error: Error) => {
      console.error("Error fetching related questions:", error);
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const request: PeopleAlsoAskRequest = {
      keyword,
      language,
      includeMetrics,
      limit
    };
    
    askMutation.mutate(request);
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Disalin ke clipboard!");
    }).catch(err => {
      console.error("Gagal menyalin teks: ", err);
    });
  };

  const relatedQuestions = askMutation.data?.relatedQuestions || [];
  const suggestedContent = askMutation.data?.suggestedContent || [];
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-4 mt-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/tools">Tools</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>People Also Ask</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span>People Also Ask</span>
              </CardTitle>
              <CardDescription>
                Temukan pertanyaan terkait yang sering dicari orang terkait dengan kata kunci Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="keyword">Kata Kunci</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <Input
                      id="keyword"
                      placeholder="Masukkan kata kunci pencarian"
                      className="pl-9"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Bahasa</Label>
                  <Select 
                    value={language} 
                    onValueChange={setLanguage}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Pilih bahasa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="id">Bahasa Indonesia</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="limit">Jumlah Pertanyaan (1-20)</Label>
                    <span className="text-sm">{limit}</span>
                  </div>
                  <Slider
                    id="limit"
                    min={1}
                    max={20}
                    step={1}
                    value={[limit]}
                    onValueChange={(values) => setLimit(values[0])}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="includeMetrics"
                    checked={includeMetrics}
                    onCheckedChange={setIncludeMetrics}
                  />
                  <Label htmlFor="includeMetrics">Sertakan metrik (volume pencarian, kesulitan)</Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={askMutation.isPending || !keyword.trim()}
                >
                  {askMutation.isPending ? (
                    <span className="flex items-center gap-1">
                      <span className="animate-spin">⏳</span> Proses...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Search className="h-4 w-4" /> Cari Pertanyaan Terkait
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Results */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                {askMutation.data ? (
                  <span className="flex items-center gap-2">
                    Hasil untuk: <span className="font-bold text-primary">{keyword}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                      ({relatedQuestions.length} pertanyaan ditemukan)
                    </span>
                  </span>
                ) : (
                  "Hasil Akan Muncul Di Sini"
                )}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pb-4">
              {askMutation.isPending ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
                  <div className="animate-pulse text-3xl">🔍</div>
                  <p className="text-muted-foreground">Sedang mencari pertanyaan terkait...</p>
                </div>
              ) : askMutation.isError ? (
                <div className="py-10 text-center">
                  <p className="text-red-500 mb-2">Terjadi kesalahan saat memproses permintaan</p>
                  <p className="text-muted-foreground text-sm">Silakan coba kata kunci yang berbeda</p>
                </div>
              ) : askMutation.data ? (
                <div>
                  <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="questions">Pertanyaan Terkait</TabsTrigger>
                      <TabsTrigger value="content">Ide Konten</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="questions" className="mt-4">
                      {includeMetrics ? (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[50%]">Pertanyaan</TableHead>
                                <TableHead className="text-right">Volume</TableHead>
                                <TableHead className="text-right">Kesulitan</TableHead>
                                <TableHead className="text-right">Relevansi</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {relatedQuestions.map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-medium">{item.question}</TableCell>
                                  <TableCell className="text-right">
                                    {item.searchVolume !== undefined ? (
                                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                                        {item.searchVolume}
                                      </div>
                                    ) : '-'}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {item.difficulty !== undefined ? (
                                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        item.difficulty < 33 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                                        item.difficulty < 66 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                                      }`}>
                                        {item.difficulty}
                                      </div>
                                    ) : '-'}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {item.relevance !== undefined ? (
                                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                                        {item.relevance}%
                                      </div>
                                    ) : '-'}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      variant="ghost" 
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => copyToClipboard(item.question)}
                                      title="Salin pertanyaan"
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <ul className="space-y-2 mt-2">
                          {relatedQuestions.map((item, index) => (
                            <li key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md flex justify-between items-center">
                              <span>{item.question}</span>
                              <Button
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => copyToClipboard(item.question)}
                                title="Salin pertanyaan"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="content" className="mt-4">
                      <div className="space-y-4">
                        {suggestedContent?.map((content, index) => (
                          <Card key={index} className="overflow-hidden">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start gap-2">
                                <div className="flex-1">
                                  <h3 className="font-medium text-base mb-1">{content}</h3>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost" 
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => copyToClipboard(content)}
                                    title="Salin ide konten"
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="py-10 text-center">
                  <div className="mb-4">
                    <Search className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Masukkan kata kunci untuk memulai</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Temukan pertanyaan terkait yang dicari orang berdasarkan kata kunci Anda dan 
                    dapatkan ide konten untuk menjawabnya
                  </p>
                </div>
              )}
            </CardContent>
            
            {askMutation.data && (
              <CardFooter className="pt-0 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(relatedQuestions.map(q => q.question).join('\n'))}>
                  <Copy className="mr-2 h-4 w-4" /> Salin Semua Pertanyaan
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" /> Bagikan Hasil
                </Button>
                <Button variant="outline" size="sm">
                  <Bookmark className="mr-2 h-4 w-4" /> Simpan
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}