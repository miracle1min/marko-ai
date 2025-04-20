import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { 
  Book, 
  BookOpen, 
  ChevronRight, 
  FileText, 
  LoaderCircle, 
  School, 
  BookMarked,
  BookOpenCheck,
  User,
  MessageSquareQuote,
  ListTodo,
  BookText,
  Link2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Breadcrumb from "@/components/Breadcrumb";
import AnimatedPage from "@/components/AnimatedPage";
import { useToast } from "@/hooks/use-toast";
import { BookSummaryRequest, BookSummaryResponse } from "@/lib/types";
import { generateBookSummary } from "@/lib/geminiApi";

export default function RingkasanBuku() {
  const { toast } = useToast();
  
  // Form state
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [educationLevel, setEducationLevel] = useState<string>("sma");
  const [summaryLength, setSummaryLength] = useState<string>("medium");
  const [includeChapterBreakdown, setIncludeChapterBreakdown] = useState<boolean>(true);
  const [includeKeyLessons, setIncludeKeyLessons] = useState<boolean>(true);
  const [includeQuestions, setIncludeQuestions] = useState<boolean>(false);
  const [additionalInstructions, setAdditionalInstructions] = useState<string>("");
  
  // Response state
  const [result, setResult] = useState<BookSummaryResponse | null>(null);
  const [activeTab, setActiveTab] = useState<string>("summary");
  
  // Education level options
  const educationLevelOptions = [
    { value: "sd", label: "Sekolah Dasar (SD)" },
    { value: "smp", label: "Sekolah Menengah Pertama (SMP)" },
    { value: "sma", label: "Sekolah Menengah Atas (SMA)" },
    { value: "universitas", label: "Universitas" },
    { value: "umum", label: "Umum" }
  ];
  
  // Summary length options
  const summaryLengthOptions = [
    { value: "short", label: "Ringkas (200-300 kata)" },
    { value: "medium", label: "Sedang (500-700 kata)" },
    { value: "long", label: "Panjang (1000-1500 kata)" }
  ];
  
  // Genre options
  const genreOptions = [
    { value: "novel", label: "Novel" },
    { value: "biografi", label: "Biografi" },
    { value: "sejarah", label: "Sejarah" },
    { value: "sains", label: "Sains & Teknologi" },
    { value: "filsafat", label: "Filsafat" },
    { value: "ekonomi", label: "Ekonomi & Bisnis" },
    { value: "pendidikan", label: "Pendidikan" },
    { value: "psikologi", label: "Psikologi" },
    { value: "agama", label: "Agama & Spiritualitas" }
  ];
  
  // Handle API mutation
  const generateMutation = useMutation({
    mutationFn: async (request: BookSummaryRequest) => {
      return await generateBookSummary(request);
    },
    onSuccess: (data: BookSummaryResponse) => {
      setResult(data);
      toast({
        title: "Ringkasan berhasil dibuat",
        description: `Ringkasan untuk "${title}" telah berhasil dibuat.`
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal membuat ringkasan",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Handle form submission
  const handleSubmit = () => {
    if (!title) {
      toast({
        title: "Judul buku diperlukan",
        description: "Silakan masukkan judul buku untuk membuat ringkasan.",
        variant: "destructive"
      });
      return;
    }
    
    const request: BookSummaryRequest = {
      title,
      author: author || undefined,
      genre: genre || undefined,
      educationLevel,
      summaryLength,
      includeChapterBreakdown,
      includeKeyLessons,
      includeQuestions,
      additionalInstructions: additionalInstructions || undefined
    };
    
    generateMutation.mutate(request);
  };
  
  return (
    <AnimatedPage>
      <div className="container mx-auto py-6 max-w-7xl">
        <Breadcrumb
        items={[
          { label: "Beranda", path: "/" },
          { label: "Tools", path: "/tools" },
          { label: "Ringkasan Buku", path: "/tools/ringkasan-buku", isActive: true }
        ]}
      />
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <BookOpenCheck className="h-5 w-5 mr-2 text-primary" />
                Pembuat Ringkasan Buku
              </CardTitle>
              <CardDescription>
                Dapatkan ringkasan komprehensif dari berbagai buku dalam hitungan detik
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Buku <span className="text-red-500">*</span></Label>
                  <Input 
                    id="title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Masukkan judul buku"
                    disabled={generateMutation.isPending}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="author">Penulis</Label>
                  <Input 
                    id="author" 
                    value={author} 
                    onChange={(e) => setAuthor(e.target.value)} 
                    placeholder="Nama penulis buku"
                    disabled={generateMutation.isPending}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="genre">Genre / Kategori</Label>
                  <Select
                    value={genre}
                    onValueChange={setGenre}
                    disabled={generateMutation.isPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih genre buku" />
                    </SelectTrigger>
                    <SelectContent>
                      {genreOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="educationLevel">Tingkat Pendidikan Target</Label>
                  <Select
                    value={educationLevel}
                    onValueChange={setEducationLevel}
                    disabled={generateMutation.isPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tingkat pendidikan" />
                    </SelectTrigger>
                    <SelectContent>
                      {educationLevelOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="summaryLength">Panjang Ringkasan</Label>
                  <Select
                    value={summaryLength}
                    onValueChange={setSummaryLength}
                    disabled={generateMutation.isPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih panjang ringkasan" />
                    </SelectTrigger>
                    <SelectContent>
                      {summaryLengthOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label>Opsi Tambahan</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeChapterBreakdown" 
                      checked={includeChapterBreakdown} 
                      onCheckedChange={(checked) => setIncludeChapterBreakdown(checked as boolean)}
                      disabled={generateMutation.isPending}
                    />
                    <Label htmlFor="includeChapterBreakdown" className="cursor-pointer">
                      Sertakan breakdown per bab
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeKeyLessons" 
                      checked={includeKeyLessons} 
                      onCheckedChange={(checked) => setIncludeKeyLessons(checked as boolean)}
                      disabled={generateMutation.isPending}
                    />
                    <Label htmlFor="includeKeyLessons" className="cursor-pointer">
                      Sertakan pelajaran kunci
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeQuestions" 
                      checked={includeQuestions} 
                      onCheckedChange={(checked) => setIncludeQuestions(checked as boolean)}
                      disabled={generateMutation.isPending}
                    />
                    <Label htmlFor="includeQuestions" className="cursor-pointer">
                      Sertakan pertanyaan studi
                    </Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="additionalInstructions">Instruksi Tambahan (Opsional)</Label>
                  <Textarea 
                    id="additionalInstructions" 
                    value={additionalInstructions} 
                    onChange={(e) => setAdditionalInstructions(e.target.value)} 
                    placeholder="Tambahkan instruksi atau permintaan khusus untuk ringkasan"
                    rows={3}
                    disabled={generateMutation.isPending}
                  />
                </div>
                
                <Button 
                  type="button" 
                  onClick={handleSubmit} 
                  className="w-full"
                  disabled={generateMutation.isPending}
                >
                  {generateMutation.isPending ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Membuat Ringkasan...
                    </>
                  ) : (
                    <>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Buat Ringkasan Buku
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Manfaat Ringkasan Buku</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex">
                  <ChevronRight className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                  <span>Hemat waktu dengan mendapatkan poin-poin utama buku</span>
                </li>
                <li className="flex">
                  <ChevronRight className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                  <span>Tingkatkan pemahaman dengan penjelasan terstruktur</span>
                </li>
                <li className="flex">
                  <ChevronRight className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                  <span>Persiapkan ujian atau diskusi dengan cepat</span>
                </li>
                <li className="flex">
                  <ChevronRight className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                  <span>Evaluasi buku sebelum memutuskan untuk membacanya</span>
                </li>
                <li className="flex">
                  <ChevronRight className="h-4 w-4 mr-2 text-primary mt-0.5 shrink-0" />
                  <span>Temukan koneksi dengan buku-buku terkait lainnya</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:w-2/3">
          {!result && !generateMutation.isPending && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] border rounded-lg p-8 bg-muted/30">
              <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Ringkasan Buku Otomatis</h3>
              <p className="text-center text-muted-foreground max-w-md mb-6">
                Masukkan detail buku di formulir sebelah kiri untuk mendapatkan ringkasan yang komprehensif, pelajaran kunci, dan analisis karakter dari buku tersebut.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Badge variant="outline" className="py-1.5 px-3">Novel</Badge>
                <Badge variant="outline" className="py-1.5 px-3">Biografi</Badge>
                <Badge variant="outline" className="py-1.5 px-3">Sejarah</Badge>
                <Badge variant="outline" className="py-1.5 px-3">Filsafat</Badge>
                <Badge variant="outline" className="py-1.5 px-3">Pendidikan</Badge>
                <Badge variant="outline" className="py-1.5 px-3">Psikologi</Badge>
              </div>
            </div>
          )}
          
          {generateMutation.isPending && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] border rounded-lg p-8">
              <LoaderCircle className="h-12 w-12 text-primary mb-4 animate-spin" />
              <h3 className="text-xl font-medium mb-2">Membuat Ringkasan...</h3>
              <p className="text-center text-muted-foreground max-w-md">
                Marko AI sedang membuat ringkasan untuk buku "{title}". Proses ini mungkin memerlukan waktu beberapa detik.
              </p>
            </div>
          )}
          
          {result && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{title}</CardTitle>
                    {author && <CardDescription className="mt-1">Oleh {author}</CardDescription>}
                  </div>
                  <Badge variant="outline" className="ml-2">{genre || "Umum"}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="summary" className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Ringkasan
                    </TabsTrigger>
                    
                    {result.chapterBreakdown && result.chapterBreakdown.length > 0 && (
                      <TabsTrigger value="chapters" className="flex items-center">
                        <BookText className="h-4 w-4 mr-2" />
                        Bab
                      </TabsTrigger>
                    )}
                    
                    {result.keyLessons && result.keyLessons.length > 0 && (
                      <TabsTrigger value="lessons" className="flex items-center">
                        <ListTodo className="h-4 w-4 mr-2" />
                        Pelajaran
                      </TabsTrigger>
                    )}
                    
                    {result.keyCharacters && result.keyCharacters.length > 0 && (
                      <TabsTrigger value="characters" className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Karakter
                      </TabsTrigger>
                    )}
                    
                    {result.studyQuestions && result.studyQuestions.length > 0 && (
                      <TabsTrigger value="questions" className="flex items-center">
                        <MessageSquareQuote className="h-4 w-4 mr-2" />
                        Pertanyaan
                      </TabsTrigger>
                    )}
                    
                    {result.relatedBooks && result.relatedBooks.length > 0 && (
                      <TabsTrigger value="related" className="flex items-center">
                        <Link2 className="h-4 w-4 mr-2" />
                        Terkait
                      </TabsTrigger>
                    )}
                  </TabsList>
                  
                  <TabsContent value="summary" className="mt-0">
                    <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert">
                      {result.summary.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </TabsContent>
                  
                  {result.chapterBreakdown && result.chapterBreakdown.length > 0 && (
                    <TabsContent value="chapters" className="mt-0">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Ringkasan per Bab</h3>
                        <div className="space-y-3">
                          {result.chapterBreakdown.map((chapter, index) => (
                            <div key={index} className="border p-3 rounded-md">
                              <p>{chapter}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  )}
                  
                  {result.keyLessons && result.keyLessons.length > 0 && (
                    <TabsContent value="lessons" className="mt-0">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Pelajaran Kunci</h3>
                        <div className="space-y-2">
                          {result.keyLessons.map((lesson, index) => (
                            <div key={index} className="flex">
                              <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                              <p>{lesson}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  )}
                  
                  {result.keyCharacters && result.keyCharacters.length > 0 && (
                    <TabsContent value="characters" className="mt-0">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Karakter Utama</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {result.keyCharacters.map((character, index) => (
                            <div key={index} className="border p-3 rounded-md flex">
                              <User className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                              <p>{character}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  )}
                  
                  {result.studyQuestions && result.studyQuestions.length > 0 && (
                    <TabsContent value="questions" className="mt-0">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Pertanyaan Studi</h3>
                        <div className="space-y-3">
                          {result.studyQuestions.map((question, index) => (
                            <div key={index} className="border p-3 rounded-md">
                              <p className="font-medium">Pertanyaan {index + 1}:</p>
                              <p>{question}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  )}
                  
                  {result.relatedBooks && result.relatedBooks.length > 0 && (
                    <TabsContent value="related" className="mt-0">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Buku-Buku Terkait</h3>
                        <div className="space-y-2">
                          {result.relatedBooks.map((book, index) => (
                            <div key={index} className="flex">
                              <BookMarked className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                              <p>{book}</p>
                            </div>
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