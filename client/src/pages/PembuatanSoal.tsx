import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { 
  FileQuestion, 
  School, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  DownloadCloud, 
  Copy, 
  LoaderCircle, 
  CheckCircle2, 
  BarChart, 
  Lightbulb,
  Puzzle,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Breadcrumb from "@/components/Breadcrumb";
import { useToast } from "@/hooks/use-toast";

// Interface untuk pertanyaan
interface Question {
  id: string;
  type: "multiple_choice" | "essay" | "true_false";
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
}

// Data mata pelajaran
const subjectOptions = [
  { value: "matematika", label: "Matematika", icon: <BarChart className="h-4 w-4" /> },
  { value: "fisika", label: "Fisika", icon: <Lightbulb className="h-4 w-4" /> },
  { value: "kimia", label: "Kimia", icon: <Puzzle className="h-4 w-4" /> },
  { value: "biologi", label: "Biologi", icon: <Puzzle className="h-4 w-4" /> },
  { value: "sejarah", label: "Sejarah", icon: <BookOpen className="h-4 w-4" /> },
  { value: "geografi", label: "Geografi", icon: <BookOpen className="h-4 w-4" /> },
  { value: "ekonomi", label: "Ekonomi", icon: <BarChart className="h-4 w-4" /> },
  { value: "bahasa_indonesia", label: "Bahasa Indonesia", icon: <BookOpen className="h-4 w-4" /> },
  { value: "bahasa_inggris", label: "Bahasa Inggris", icon: <BookOpen className="h-4 w-4" /> },
  { value: "other", label: "Lainnya", icon: <Layers className="h-4 w-4" /> }
];

export default function PembuatanSoal() {
  const { toast } = useToast();
  
  // State untuk form
  const [subject, setSubject] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [questionType, setQuestionType] = useState("mixed");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [educationLevel, setEducationLevel] = useState("sma");
  const [includeAnswers, setIncludeAnswers] = useState(true);
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  
  // State untuk hasil
  const [result, setResult] = useState<{questions: Question[], summary?: string} | null>(null);
  
  // Mutation untuk menghasilkan soal
  const generateMutation = useMutation({
    mutationFn: async (data: {
      subject: string;
      topic: string;
      difficulty: string;
      questionType: string;
      numberOfQuestions: number;
      includeAnswers: boolean;
      educationLevel: string;
      additionalInstructions?: string;
    }) => {
      const response = await fetch("/api/gemini/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Gagal menghasilkan soal");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: "Soal berhasil dibuat",
        description: `${data.questions.length} soal telah berhasil dibuat.`,
      });
    },
    onError: (error: Error) => {
      console.error("Error:", error);
      toast({
        title: "Terjadi kesalahan",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Fungsi untuk generate soal
  const handleGenerateQuestions = () => {
    if (!topic || !(subject || customSubject)) {
      toast({
        title: "Input tidak lengkap",
        description: "Harap isi mata pelajaran dan topik",
        variant: "destructive",
      });
      return;
    }
    
    const actualSubject = subject === "other" ? customSubject : subject;
    
    const data = {
      subject: actualSubject,
      topic,
      difficulty,
      questionType,
      numberOfQuestions,
      includeAnswers,
      educationLevel,
      additionalInstructions: additionalInstructions || undefined
    };
    
    generateMutation.mutate(data);
  };
  
  // Function untuk menyalin teks ke clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Tersalin!",
      description: "Teks telah disalin ke clipboard",
    });
  };
  
  // Function untuk download sebagai file teks
  const downloadAsText = () => {
    if (!result) return;
    
    let content = `# Soal ${topic}\n\n`;
    content += result.summary ? `${result.summary}\n\n` : "";
    
    result.questions.forEach((q, index) => {
      content += `## Soal ${index + 1}\n\n`;
      content += `${q.question}\n\n`;
      
      if (q.type === "multiple_choice" && q.options) {
        q.options.forEach((option, i) => {
          content += `${String.fromCharCode(65 + i)}. ${option}\n`;
        });
        content += "\n";
      }
      
      if (includeAnswers) {
        content += `Jawaban: ${q.answer}\n\n`;
        if (q.explanation) {
          content += `Penjelasan: ${q.explanation}\n\n`;
        }
      }
      
      content += "\n";
    });
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Soal_${topic.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Render the badge based on difficulty
  const renderDifficultyBadge = (diff: string) => {
    switch (diff) {
      case "easy":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Mudah</Badge>;
      case "medium":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Sedang</Badge>;
      case "hard":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Sulit</Badge>;
      case "expert":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Expert</Badge>;
      default:
        return <Badge variant="outline">Sedang</Badge>;
    }
  };
  
  // Render the badge based on question type
  const renderTypeBadge = (type: string) => {
    switch (type) {
      case "multiple_choice":
        return <Badge variant="secondary">Pilihan Ganda</Badge>;
      case "essay":
        return <Badge variant="secondary">Esai</Badge>;
      case "true_false":
        return <Badge variant="secondary">Benar/Salah</Badge>;
      default:
        return <Badge variant="secondary">Campuran</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <Breadcrumb
        items={[
          { label: "Beranda", path: "/" },
          { label: "Tools", path: "/tools" },
          { label: "Pembuat Soal", path: "/tools/pembuatan-soal", isActive: true }
        ]}
      />
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <FileQuestion className="h-5 w-5 mr-2 text-primary" />
                Pembuat Soal Otomatis
              </CardTitle>
              <CardDescription>
                Buat soal ujian, kuis, atau latihan berkualitas tinggi dalam hitungan detik
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Mata Pelajaran <span className="text-red-500">*</span></Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih mata pelajaran" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center">
                            {option.icon}
                            <span className="ml-2">{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {subject === "other" && (
                    <div className="mt-2">
                      <Input 
                        type="text" 
                        placeholder="Masukkan mata pelajaran" 
                        value={customSubject}
                        onChange={(e) => setCustomSubject(e.target.value)}
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="topic">Topik/Materi <span className="text-red-500">*</span></Label>
                  <Input
                    id="topic"
                    placeholder="Contoh: Teorema Pythagoras, Fotosintesis, dll."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="education-level">Tingkat Pendidikan</Label>
                  <Select value={educationLevel} onValueChange={setEducationLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tingkat pendidikan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sd">Sekolah Dasar (SD)</SelectItem>
                      <SelectItem value="smp">Sekolah Menengah Pertama (SMP)</SelectItem>
                      <SelectItem value="sma">Sekolah Menengah Atas (SMA)</SelectItem>
                      <SelectItem value="universitas">Universitas</SelectItem>
                      <SelectItem value="profesional">Profesional/Spesialis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label htmlFor="difficulty">Tingkat Kesulitan</Label>
                    <span className="text-sm text-muted-foreground">
                      {difficulty === "easy" && "Mudah"}
                      {difficulty === "medium" && "Sedang"}
                      {difficulty === "hard" && "Sulit"}
                      {difficulty === "expert" && "Expert"}
                    </span>
                  </div>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tingkat kesulitan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Mudah (Dasar)</SelectItem>
                      <SelectItem value="medium">Sedang (Menengah)</SelectItem>
                      <SelectItem value="hard">Sulit (Lanjutan)</SelectItem>
                      <SelectItem value="expert">Expert (Profesional)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="question-type">Tipe Soal</Label>
                  <Select value={questionType} onValueChange={setQuestionType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe soal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mixed">Campuran</SelectItem>
                      <SelectItem value="multiple_choice">Pilihan Ganda</SelectItem>
                      <SelectItem value="essay">Esai/Uraian</SelectItem>
                      <SelectItem value="true_false">Benar/Salah</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label htmlFor="numQuestions">Jumlah Soal</Label>
                    <span className="text-sm text-muted-foreground">{numberOfQuestions} soal</span>
                  </div>
                  <Slider
                    id="numQuestions"
                    min={1}
                    max={20}
                    step={1}
                    value={[numberOfQuestions]}
                    onValueChange={(value) => setNumberOfQuestions(value[0])}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="includeAnswer"
                    checked={includeAnswers}
                    onCheckedChange={setIncludeAnswers}
                  />
                  <Label htmlFor="includeAnswer">Sertakan jawaban dan penjelasan</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="additionalInstructions">Instruksi Tambahan (Opsional)</Label>
                  <Textarea
                    id="additionalInstructions"
                    placeholder="Instruksi khusus untuk pembuatan soal"
                    value={additionalInstructions}
                    onChange={(e) => setAdditionalInstructions(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <Button
                  type="button"
                  onClick={handleGenerateQuestions}
                  disabled={generateMutation.isPending || !topic || !(subject || customSubject)}
                  className="w-full"
                >
                  {generateMutation.isPending ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Sedang Membuat Soal...
                    </>
                  ) : (
                    <>
                      <FileQuestion className="mr-2 h-4 w-4" />
                      Buat Soal
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <School className="h-5 w-5 mr-2 text-primary" />
                Tips Pembuatan Soal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5 shrink-0" />
                  <span>Tentukan topik yang spesifik untuk menghasilkan soal yang lebih fokus</span>
                </li>
                <li className="flex">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5 shrink-0" />
                  <span>Gunakan fitur instruksi tambahan untuk kebutuhan khusus</span>
                </li>
                <li className="flex">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5 shrink-0" />
                  <span>Variasikan tipe soal untuk menguji berbagai aspek pemahaman</span>
                </li>
                <li className="flex">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5 shrink-0" />
                  <span>Sesuaikan tingkat kesulitan dengan kemampuan peserta didik</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:w-2/3">
          {!result && !generateMutation.isPending && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] border rounded-lg p-8 bg-muted/30">
              <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Buat Soal Otomatis</h3>
              <p className="text-center text-muted-foreground max-w-md mb-6">
                Isi formulir di sebelah kiri untuk membuat soal ujian, kuis, atau latihan yang disesuaikan dengan kebutuhan Anda.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Badge variant="outline" className="py-1.5 px-3">Matematika</Badge>
                <Badge variant="outline" className="py-1.5 px-3">Fisika</Badge>
                <Badge variant="outline" className="py-1.5 px-3">Bahasa</Badge>
                <Badge variant="outline" className="py-1.5 px-3">Ekonomi</Badge>
                <Badge variant="outline" className="py-1.5 px-3">IPA</Badge>
                <Badge variant="outline" className="py-1.5 px-3">IPS</Badge>
              </div>
            </div>
          )}
          
          {generateMutation.isPending && (
            <Card className="h-full min-h-[400px] flex flex-col items-center justify-center">
              <CardContent className="pt-6 text-center">
                <LoaderCircle className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">Sedang Membuat Soal...</h3>
                <p className="text-muted-foreground max-w-md">
                  Mohon tunggu sementara AI sedang menyusun soal berkualitas sesuai dengan kriteria yang Anda tentukan.
                </p>
              </CardContent>
            </Card>
          )}
          
          {result && result.questions.length > 0 && (
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-1">{topic}</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        {renderDifficultyBadge(difficulty)}
                        {renderTypeBadge(questionType)}
                        <Badge variant="outline">{numberOfQuestions} Soal</Badge>
                        <Badge variant="outline" className="capitalize">
                          {educationLevel === "sd" ? "SD" : 
                           educationLevel === "smp" ? "SMP" : 
                           educationLevel === "sma" ? "SMA" : 
                           educationLevel === "universitas" ? "Universitas" : "Profesional"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={downloadAsText}
                      >
                        <DownloadCloud className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const allText = result.questions.map((q, i) => {
                            let text = `Soal ${i+1}: ${q.question}\n`;
                            if (q.type === "multiple_choice" && q.options) {
                              q.options.forEach((opt, j) => {
                                text += `${String.fromCharCode(65 + j)}. ${opt}\n`;
                              });
                            }
                            if (includeAnswers) {
                              text += `\nJawaban: ${q.answer}\n`;
                              if (q.explanation) text += `Penjelasan: ${q.explanation}\n`;
                            }
                            return text;
                          }).join("\n\n");
                          copyToClipboard(allText);
                        }}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Salin Semua
                      </Button>
                    </div>
                  </div>
                  
                  {result.summary && (
                    <div className="mt-4 text-sm text-muted-foreground border-l-4 border-primary/20 pl-4 py-2 bg-muted/20 rounded-sm">
                      {result.summary}
                    </div>
                  )}
                </CardHeader>
                
                <CardContent>
                  <Tabs defaultValue="questions">
                    <TabsList className="w-full">
                      <TabsTrigger value="questions" className="flex-1">Semua Soal</TabsTrigger>
                      <TabsTrigger value="answers" className="flex-1" disabled={!includeAnswers}>
                        Dengan Jawaban
                      </TabsTrigger>
                      <TabsTrigger value="print" className="flex-1">Mode Cetak</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="questions" className="pt-4">
                      <Accordion type="multiple" className="space-y-4">
                        {result.questions.map((question, index) => (
                          <AccordionItem 
                            key={question.id} 
                            value={question.id}
                            className="border rounded-lg p-4 shadow-sm"
                          >
                            <div className="flex items-start">
                              <Badge className="mr-3 mt-1">
                                {index + 1}
                              </Badge>
                              <div className="flex-1">
                                <AccordionTrigger className="text-left font-medium hover:no-underline py-0">
                                  <div dangerouslySetInnerHTML={{ __html: question.question }} />
                                </AccordionTrigger>
                                
                                {question.type === "multiple_choice" && question.options && (
                                  <div className="ml-6 mt-3 space-y-2">
                                    {question.options.map((option, idx) => (
                                      <div key={idx} className="flex items-start">
                                        <span className="mr-2 font-medium">{String.fromCharCode(65 + idx)}.</span>
                                        <div dangerouslySetInnerHTML={{ __html: option }} />
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                <AccordionContent className="pt-4">
                                  {includeAnswers && (
                                    <div className="space-y-3 border-t pt-3 mt-1">
                                      <div>
                                        <span className="font-medium text-sm">Jawaban:</span>
                                        <div className="mt-1 text-sm bg-muted/30 p-2 rounded">
                                          {question.answer}
                                        </div>
                                      </div>
                                      
                                      {question.explanation && (
                                        <div>
                                          <span className="font-medium text-sm">Penjelasan:</span>
                                          <div className="mt-1 text-sm">
                                            {question.explanation}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  
                                  <div className="flex justify-end mt-3">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        let text = `${question.question}\n`;
                                        if (question.type === "multiple_choice" && question.options) {
                                          question.options.forEach((opt, i) => {
                                            text += `${String.fromCharCode(65 + i)}. ${opt}\n`;
                                          });
                                        }
                                        if (includeAnswers) {
                                          text += `\nJawaban: ${question.answer}\n`;
                                          if (question.explanation) text += `Penjelasan: ${question.explanation}\n`;
                                        }
                                        copyToClipboard(text);
                                      }}
                                    >
                                      <Copy className="h-4 w-4 mr-1" />
                                      Salin
                                    </Button>
                                  </div>
                                </AccordionContent>
                              </div>
                            </div>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </TabsContent>
                    
                    <TabsContent value="answers" className="pt-4">
                      <div className="space-y-6">
                        {result.questions.map((question, index) => (
                          <div key={question.id} className="border rounded-lg p-4 shadow-sm">
                            <div className="flex items-start">
                              <Badge className="mr-3 mt-1">
                                {index + 1}
                              </Badge>
                              <div>
                                <div className="font-medium mb-2" dangerouslySetInnerHTML={{ __html: question.question }} />
                                
                                {question.type === "multiple_choice" && question.options && (
                                  <div className="ml-6 mb-4 space-y-2">
                                    {question.options.map((option, idx) => (
                                      <div key={idx} className="flex items-start">
                                        <span className={`mr-2 font-medium ${question.answer.includes(String.fromCharCode(65 + idx)) ? 'text-green-600' : ''}`}>
                                          {String.fromCharCode(65 + idx)}.
                                        </span>
                                        <div dangerouslySetInnerHTML={{ __html: option }} />
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                <div className="mt-3 space-y-3 border-t pt-3">
                                  <div>
                                    <span className="font-medium text-sm">Jawaban:</span>
                                    <div className="mt-1 text-sm bg-green-50 border border-green-100 p-2 rounded">
                                      {question.answer}
                                    </div>
                                  </div>
                                  
                                  {question.explanation && (
                                    <div>
                                      <span className="font-medium text-sm">Penjelasan:</span>
                                      <div className="mt-1 text-sm bg-muted/30 p-2 rounded">
                                        {question.explanation}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="print" className="pt-4">
                      <div className="space-y-6 print:space-y-10">
                        <div className="text-center print:mb-6 mb-4 pb-4 border-b not-prose">
                          <h1 className="text-2xl font-bold mb-1">{topic}</h1>
                          <p className="text-sm text-muted-foreground">
                            {result.summary || `Soal ${subject || customSubject} - ${topic}`}
                          </p>
                          <div className="flex justify-center gap-2 mt-3 print:hidden">
                            <Button
                              size="sm"
                              onClick={() => window.print()}
                            >
                              Print / Simpan PDF
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-8">
                          {result.questions.map((question, index) => (
                            <div key={question.id} className="break-inside-avoid-page">
                              <div className="flex items-start gap-3">
                                <div className="font-bold">{index + 1}.</div>
                                <div className="flex-1">
                                  <div dangerouslySetInnerHTML={{ __html: question.question }} />
                                  
                                  {question.type === "multiple_choice" && question.options && (
                                    <div className="ml-5 mt-3 space-y-2">
                                      {question.options.map((option, idx) => (
                                        <div key={idx} className="flex items-start">
                                          <span className="mr-2 font-medium">{String.fromCharCode(65 + idx)}.</span>
                                          <div dangerouslySetInnerHTML={{ __html: option }} />
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {includeAnswers && (
                          <div className="print:page-break-before border-t pt-8 mt-8">
                            <h2 className="text-xl font-bold mb-4">Kunci Jawaban</h2>
                            <div className="space-y-4">
                              {result.questions.map((question, index) => (
                                <div key={`answer-${question.id}`} className="mb-4">
                                  <div className="font-medium">
                                    {index + 1}. {question.answer}
                                  </div>
                                  {question.explanation && (
                                    <div className="text-sm mt-1 ml-6 text-gray-600">
                                      {question.explanation}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setResult(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Buat Soal Baru
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            margin: 2cm;
          }
          body {
            font-size: 12pt;
          }
          nav, header, footer, button, .print\\:hidden {
            display: none !important;
          }
          .container {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}} />
    </div>
  );
}