import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { 
  BookOpen, 
  Brain, 
  CheckCircle, 
  ChevronRight, 
  Lightbulb, 
  LoaderCircle, 
  Rocket, 
  Book, 
  FileText 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Breadcrumb from "@/components/Breadcrumb";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/lib/types";

// Interface untuk permintaan penjelasan materi
interface MateriPenjelasanRequest {
  topic: string;
  complexity: string;
  targetAudience: string;
  additionalContext?: string;
  includeExamples: boolean;
  includeQuestions: boolean;
}

// Interface untuk respon penjelasan materi
interface MateriPenjelasanResponse {
  explanation: string;
  examples?: string[];
  questions?: string[];
  relatedTopics?: string[];
}

// Daftar mata pelajaran
const subjectAreas = [
  { id: "matematika", name: "Matematika", icon: <Brain className="h-5 w-5" /> },
  { id: "sains", name: "Sains", icon: <Rocket className="h-5 w-5" /> },
  { id: "sejarah", name: "Sejarah", icon: <Book className="h-5 w-5" /> },
  { id: "bahasa", name: "Bahasa", icon: <FileText className="h-5 w-5" /> },
  { id: "komputer", name: "Komputer & IT", icon: <Lightbulb className="h-5 w-5" /> },
];

export default function PenjelasanMateri() {
  const { toast } = useToast();
  
  // State untuk input form
  const [topic, setTopic] = useState("");
  const [subjectArea, setSubjectArea] = useState("");
  const [complexity, setComplexity] = useState("menengah");
  const [targetAudience, setTargetAudience] = useState("siswa_sma");
  const [additionalContext, setAdditionalContext] = useState("");
  const [includeExamples, setIncludeExamples] = useState(true);
  const [includeQuestions, setIncludeQuestions] = useState(false);
  
  // State untuk hasil penjelasan
  const [explanation, setExplanation] = useState<MateriPenjelasanResponse | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Mutation untuk mendapatkan penjelasan materi
  const explainMutation = useMutation({
    mutationFn: async (request: MateriPenjelasanRequest) => {
      const response = await fetch("/api/gemini/explain-material", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        throw new Error("Gagal mendapatkan penjelasan materi");
      }
      
      return response.json() as Promise<MateriPenjelasanResponse>;
    },
    onSuccess: (data) => {
      setExplanation(data);
      
      // Tambahkan ke history chat
      const userMessage: Message = {
        role: "user",
        content: `Tolong jelaskan tentang "${topic}" untuk ${getAudienceText()} dengan level kompleksitas ${complexity}.`
      };
      
      const botMessage: Message = {
        role: "assistant",
        content: data.explanation
      };
      
      setMessages([...messages, userMessage, botMessage]);
      
      // Tampilkan notifikasi sukses
      toast({
        title: "Penjelasan berhasil dibuat",
        description: "Materi pembelajaran telah berhasil dijelaskan menggunakan AI.",
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
  
  // Function untuk mengambil teks target audiens yang lebih manusiawi
  const getAudienceText = () => {
    switch (targetAudience) {
      case "anak_sd":
        return "siswa sekolah dasar";
      case "siswa_smp":
        return "siswa sekolah menengah pertama";
      case "siswa_sma":
        return "siswa sekolah menengah atas";
      case "mahasiswa":
        return "mahasiswa";
      case "umum":
        return "masyarakat umum";
      default:
        return "siswa";
    }
  };
  
  // Function untuk submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi input
    if (!topic) {
      toast({
        title: "Input tidak lengkap",
        description: "Harap isi topik yang ingin dijelaskan",
        variant: "destructive",
      });
      return;
    }
    
    // Data untuk dikirim ke API
    const requestData: MateriPenjelasanRequest = {
      topic,
      complexity,
      targetAudience,
      additionalContext,
      includeExamples,
      includeQuestions
    };
    
    // Kirim ke API
    explainMutation.mutate(requestData);
  };
  
  // Reset form
  const handleReset = () => {
    setTopic("");
    setSubjectArea("");
    setComplexity("menengah");
    setTargetAudience("siswa_sma");
    setAdditionalContext("");
    setIncludeExamples(true);
    setIncludeQuestions(false);
  };

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <Breadcrumb
        items={[
          { label: "Beranda", path: "/" },
          { label: "Tools", path: "/tools" },
          { label: "Penjelasan Materi Pembelajaran", path: "/tools/penjelasan-materi", isActive: true }
        ]}
      />
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                Penjelasan Materi Pembelajaran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Gunakan AI untuk membuat penjelasan materi pembelajaran yang mudah dipahami sesuai dengan level pemahaman yang diinginkan.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Topik Materi <span className="text-red-500">*</span></Label>
                  <Input
                    id="topic"
                    placeholder="Contoh: Teori Relativitas Einstein"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Bidang Pelajaran</Label>
                  <Select value={subjectArea} onValueChange={setSubjectArea}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih bidang pelajaran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Semua Bidang</SelectItem>
                      {subjectAreas.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          <div className="flex items-center">
                            {subject.icon}
                            <span className="ml-2">{subject.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="complexity">Tingkat Kompleksitas</Label>
                  <Select value={complexity} onValueChange={setComplexity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tingkat kompleksitas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dasar">Dasar (sangat sederhana)</SelectItem>
                      <SelectItem value="menengah">Menengah (umum)</SelectItem>
                      <SelectItem value="lanjutan">Lanjutan (detail)</SelectItem>
                      <SelectItem value="expert">Expert (sangat mendalam)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audiens</Label>
                  <Select value={targetAudience} onValueChange={setTargetAudience}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih target audiens" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="anak_sd">Siswa SD</SelectItem>
                      <SelectItem value="siswa_smp">Siswa SMP</SelectItem>
                      <SelectItem value="siswa_sma">Siswa SMA</SelectItem>
                      <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
                      <SelectItem value="umum">Umum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="additionalContext">Konteks Tambahan</Label>
                  <Textarea
                    id="additionalContext"
                    placeholder="Tambahkan konteks atau detail spesifik yang ingin disertakan (opsional)"
                    value={additionalContext}
                    onChange={(e) => setAdditionalContext(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Opsi Tambahan</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="include-examples"
                      checked={includeExamples}
                      onChange={(e) => setIncludeExamples(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="include-examples" className="text-sm font-normal">Sertakan contoh</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="include-questions"
                      checked={includeQuestions}
                      onChange={(e) => setIncludeQuestions(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="include-questions" className="text-sm font-normal">Sertakan pertanyaan latihan</Label>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    disabled={!topic || explainMutation.isPending}
                    className="w-full"
                  >
                    {explainMutation.isPending ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Buat Penjelasan
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    disabled={explainMutation.isPending}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tips Penggunaan</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 shrink-0" />
                  <span>Tentukan topik materi yang spesifik untuk hasil yang lebih baik</span>
                </li>
                <li className="flex">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 shrink-0" />
                  <span>Sesuaikan tingkat kompleksitas dengan kemampuan target audiens</span>
                </li>
                <li className="flex">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 shrink-0" />
                  <span>Tambahkan konteks spesifik untuk penjelasan yang lebih terarah</span>
                </li>
                <li className="flex">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 shrink-0" />
                  <span>Gunakan contoh dan pertanyaan latihan untuk meningkatkan pemahaman</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:w-2/3">
          {!explanation && !explainMutation.isPending && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] border rounded-lg p-8 bg-muted/30">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Buat Penjelasan Materi</h3>
              <p className="text-center text-muted-foreground max-w-md mb-4">
                Isi formulir di sebelah kiri untuk mendapatkan penjelasan materi pembelajaran yang disesuaikan dengan kebutuhan Anda.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg mt-4">
                {subjectAreas.map((subject) => (
                  <Badge 
                    key={subject.id} 
                    variant="outline" 
                    className="flex items-center justify-center p-3 cursor-pointer hover:bg-accent"
                    onClick={() => {
                      setSubjectArea(subject.id);
                      setTopic(subject.name + ": ");
                    }}
                  >
                    {subject.icon}
                    <span className="ml-2">{subject.name}</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {explainMutation.isPending && (
            <Card className="h-full min-h-[400px] flex flex-col items-center justify-center">
              <CardContent className="pt-6 text-center">
                <LoaderCircle className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">Menghasilkan Penjelasan...</h3>
                <p className="text-muted-foreground max-w-md">
                  Mohon tunggu sementara AI sedang menyusun penjelasan materi pembelajaran yang sesuai.
                </p>
              </CardContent>
            </Card>
          )}
          
          {explanation && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{topic}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  {targetAudience && (
                    <Badge variant="secondary">
                      Untuk {getAudienceText()}
                    </Badge>
                  )}
                  {complexity && (
                    <Badge variant="outline">
                      Level: {complexity}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="explanation" className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="explanation" className="flex-1">Penjelasan</TabsTrigger>
                    {explanation.examples && explanation.examples.length > 0 && (
                      <TabsTrigger value="examples" className="flex-1">Contoh</TabsTrigger>
                    )}
                    {explanation.questions && explanation.questions.length > 0 && (
                      <TabsTrigger value="questions" className="flex-1">Latihan</TabsTrigger>
                    )}
                  </TabsList>
                  
                  <TabsContent value="explanation" className="mt-4">
                    <div className="prose prose-sm max-w-none">
                      {explanation.explanation.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </TabsContent>
                  
                  {explanation.examples && explanation.examples.length > 0 && (
                    <TabsContent value="examples" className="mt-4">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Contoh</h3>
                        <ul className="space-y-3">
                          {explanation.examples.map((example, index) => (
                            <li key={index} className="bg-accent/40 p-3 rounded-md">
                              <div className="flex">
                                <div className="flex-shrink-0 mr-2">
                                  <Badge variant="outline" className="px-2 py-1 text-xs">
                                    {index + 1}
                                  </Badge>
                                </div>
                                <div>
                                  {example}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TabsContent>
                  )}
                  
                  {explanation.questions && explanation.questions.length > 0 && (
                    <TabsContent value="questions" className="mt-4">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Pertanyaan Latihan</h3>
                        <ul className="space-y-3">
                          {explanation.questions.map((question, index) => (
                            <li key={index} className="bg-muted p-3 rounded-md">
                              <div className="flex">
                                <div className="flex-shrink-0 mr-2">
                                  <Badge className="px-2 py-1 text-xs">
                                    {index + 1}
                                  </Badge>
                                </div>
                                <div>
                                  {question}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
                
                {explanation.relatedTopics && explanation.relatedTopics.length > 0 && (
                  <div className="pt-4">
                    <Separator className="my-4" />
                    <h3 className="text-sm font-medium mb-2">Topik Terkait</h3>
                    <div className="flex flex-wrap gap-2">
                      {explanation.relatedTopics.map((topic, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-accent"
                          onClick={() => setTopic(topic)}
                        >
                          {topic}
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-4">
                  <Separator className="my-4" />
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleReset}
                    >
                      Buat Penjelasan Baru
                    </Button>
                    
                    <Button 
                      size="sm"
                      onClick={() => {
                        if (typeof navigator.clipboard !== 'undefined') {
                          navigator.clipboard.writeText(explanation.explanation);
                          toast({
                            title: "Tersalin!",
                            description: "Penjelasan telah disalin ke clipboard",
                          });
                        }
                      }}
                    >
                      Salin Penjelasan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}