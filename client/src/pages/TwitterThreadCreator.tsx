import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { 
  Twitter, 
  FileText,
  LanguagesIcon, 
  PenTool,
  Target,
  User,
  RefreshCw,
  Copy,
  Check,
  List,
  Hash,
  MessageSquare
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
import { useToast } from "@/hooks/use-toast";
import Breadcrumb from "@/components/Breadcrumb";

// Daftar tema thread
const threadThemes = [
  { value: "educational", label: "Edukatif - Berbagi pengetahuan atau keahlian" },
  { value: "storytelling", label: "Cerita - Membagikan pengalaman atau cerita" },
  { value: "tutorial", label: "Tutorial - Panduan langkah demi langkah" },
  { value: "opinion", label: "Opini - Pandangan atau tanggapan tentang suatu topik" },
  { value: "industry_news", label: "Berita Industri - Perkembangan terbaru" },
  { value: "personal_growth", label: "Pengembangan Diri - Tips dan motivasi" },
  { value: "case_study", label: "Studi Kasus - Analisis mendalam tentang suatu kasus" },
  { value: "research", label: "Riset - Temuan atau penelitian" }
];

// Daftar gaya penulisan
const writingStyles = [
  { value: "formal", label: "Formal - Profesional dan akademis" },
  { value: "casual", label: "Casual - Santai dan percakapan" },
  { value: "humorous", label: "Humoris - Ringan dan menghibur" },
  { value: "inspirational", label: "Inspiratif - Memotivasi dan memberi semangat" },
  { value: "informative", label: "Informatif - Jelas dan faktual" },
  { value: "persuasive", label: "Persuasif - Meyakinkan pembaca" }
];

// Daftar audiens target
const audiences = [
  { value: "general", label: "Umum - Semua kalangan" },
  { value: "professionals", label: "Profesional - Pekerja di bidang tertentu" },
  { value: "students", label: "Pelajar/Mahasiswa" },
  { value: "entrepreneurs", label: "Pengusaha dan Pebisnis" },
  { value: "tech_enthusiasts", label: "Penggemar Teknologi" },
  { value: "beginners", label: "Pemula di bidang tertentu" },
  { value: "experts", label: "Ahli dan pakar" }
];

export default function TwitterThreadCreator() {
  const [topic, setTopic] = useState("");
  const [mainPoints, setMainPoints] = useState("");
  const [theme, setTheme] = useState("educational");
  const [writingStyle, setWritingStyle] = useState("casual");
  const [audience, setAudience] = useState("general");
  const [tweetCount, setTweetCount] = useState(5);
  const [hashtags, setHashtags] = useState("");
  const [includeHook, setIncludeHook] = useState(true);
  const [includeCallToAction, setIncludeCallToAction] = useState(true);
  const [twitterHandle, setTwitterHandle] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  
  const [generatedThread, setGeneratedThread] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  
  const { toast } = useToast();
  
  // Simulasi API untuk demo
  const threadMutation = useMutation({
    mutationFn: async (data: any) => {
      // Simulasi delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Contoh thread (ini akan diganti dengan API asli)
      const hashtagsArray = hashtags.split(',').map(tag => tag.trim()).filter(Boolean);
      const hashtagsString = hashtagsArray.length > 0 
        ? hashtagsArray.map(tag => `#${tag.replace(/^#/, '')}`).join(' ') 
        : '#MarkoAI #Thread';
      
      const thread = [];
      
      // Tweet pembuka
      if (includeHook) {
        thread.push(`🧵 ${topic.toUpperCase()} - THREAD 🧵\n\nHai Twitter! Hari ini saya akan berbagi tentang ${topic}. Thread ini akan membahas poin-poin penting yang perlu Anda ketahui.\n\nSimak 🔽`);
      } else {
        thread.push(`${topic} - THREAD\n\nBerikut adalah thread tentang ${topic}.`);
      }
      
      // Parse main points
      const points = mainPoints.split('\n').filter(p => p.trim().length > 0);
      
      // Generate tweets for each point with limited character count
      const maxPoints = Math.min(points.length, tweetCount - 2); // -2 for intro and conclusion
      for (let i = 0; i < maxPoints; i++) {
        thread.push(`${i+1}/${maxPoints} ${points[i]}\n\n${i === maxPoints-1 ? '' : '🧵👇'}`);
      }
      
      // Fill any remaining tweets with generated content
      for (let i = points.length; i < tweetCount - 2; i++) {
        thread.push(`${i+1}/${tweetCount-2} Poin tambahan tentang ${topic}... 👇`);
      }
      
      // Closing tweet
      if (includeCallToAction) {
        const handle = twitterHandle ? ` Follow ${twitterHandle} untuk konten serupa!` : '';
        thread.push(`Itulah tadi thread tentang ${topic}. Semoga bermanfaat!${handle}\n\nJika Anda suka thread ini, jangan lupa RT dan Like untuk membantu orang lain menemukannya.\n\n${hashtagsString}`);
      } else {
        thread.push(`Demikian thread tentang ${topic}. Terima kasih sudah membaca!\n\n${hashtagsString}`);
      }
      
      return {
        thread
      };
    },
    onSuccess: (data) => {
      setGeneratedThread(data.thread);
      toast({
        title: "Thread Berhasil Dibuat",
        description: `Thread Twitter dengan ${data.thread.length} tweet telah berhasil dibuat`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Gagal membuat thread: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const handleGenerateThread = () => {
    if (!topic) {
      toast({
        title: "Input Tidak Lengkap",
        description: "Harap isi topik thread terlebih dahulu",
        variant: "destructive",
      });
      return;
    }
    
    const data = {
      topic,
      mainPoints,
      theme,
      writingStyle,
      audience,
      tweetCount,
      hashtags,
      includeHook,
      includeCallToAction,
      twitterHandle,
      additionalInstructions,
    };
    
    threadMutation.mutate(data);
  };
  
  const handleCopyAll = () => {
    navigator.clipboard.writeText(generatedThread.join('\n\n---\n\n'));
    setCopied(true);
    toast({
      title: "Thread Disalin!",
      description: "Thread telah disalin ke clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleCopyTweet = (index: number) => {
    navigator.clipboard.writeText(generatedThread[index]);
    toast({
      title: "Tweet Disalin!",
      description: `Tweet #${index + 1} telah disalin ke clipboard`,
    });
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-0">
      <Breadcrumb 
        items={[
          { label: "Tools", path: "/tools" },
          { label: "Twitter Thread Creator", path: "/tools/twitter-thread", isActive: true }
        ]} 
      />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
          <Twitter className="text-blue-500 mr-2" /> 
          Twitter Thread Creator
        </h1>
        <p className="text-gray-600 mt-2">
          Buat thread Twitter yang viral dan informatif dengan bantuan Marko AI
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="mr-2 text-blue-500" /> Opsi Pembuatan Thread
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="topic" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" /> Topik Thread
                  </Label>
                  <Input 
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Misalnya: 10 Tips Produktivitas untuk Pekerja Remote"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="main-points" className="flex items-center">
                    <List className="h-4 w-4 mr-2" /> Poin Utama (1 per baris)
                  </Label>
                  <Textarea 
                    id="main-points"
                    value={mainPoints}
                    onChange={(e) => setMainPoints(e.target.value)}
                    placeholder="Masukkan poin-poin utama yang ingin dibahas dalam thread"
                    className="mt-1 resize-none"
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label htmlFor="theme" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" /> Tema Thread
                  </Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger id="theme" className="mt-1">
                      <SelectValue placeholder="Pilih tema thread" />
                    </SelectTrigger>
                    <SelectContent>
                      {threadThemes.map((theme) => (
                        <SelectItem key={theme.value} value={theme.value}>
                          {theme.label}
                        </SelectItem>
                      ))}
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
                  <Label htmlFor="audience" className="flex items-center">
                    <Target className="h-4 w-4 mr-2" /> Target Audiens
                  </Label>
                  <Select value={audience} onValueChange={setAudience}>
                    <SelectTrigger id="audience" className="mt-1">
                      <SelectValue placeholder="Pilih target audiens" />
                    </SelectTrigger>
                    <SelectContent>
                      {audiences.map((audience) => (
                        <SelectItem key={audience.value} value={audience.value}>
                          {audience.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="tweet-count" className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" /> Jumlah Tweet ({tweetCount})
                  </Label>
                  <Slider
                    id="tweet-count"
                    value={[tweetCount]}
                    onValueChange={(value) => setTweetCount(value[0])}
                    min={3}
                    max={15}
                    step={1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>3</span>
                    <span>10</span>
                    <span>15</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="hashtags" className="flex items-center">
                    <Hash className="h-4 w-4 mr-2" /> Hashtags (pisahkan dengan koma)
                  </Label>
                  <Input 
                    id="hashtags"
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    placeholder="Misalnya: MarkoAI, ThreadTwitter, Tips"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="twitter-handle" className="flex items-center">
                    <User className="h-4 w-4 mr-2" /> Twitter Handle (opsional)
                  </Label>
                  <Input 
                    id="twitter-handle"
                    value={twitterHandle}
                    onChange={(e) => setTwitterHandle(e.target.value)}
                    placeholder="Misalnya: @username"
                    className="mt-1"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="include-hook" className="flex items-center">
                    <Target className="h-4 w-4 mr-2" /> Sertakan Hook Pembuka
                  </Label>
                  <Switch
                    id="include-hook"
                    checked={includeHook}
                    onCheckedChange={setIncludeHook}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="include-cta" className="flex items-center">
                    <Target className="h-4 w-4 mr-2" /> Sertakan Call to Action
                  </Label>
                  <Switch
                    id="include-cta"
                    checked={includeCallToAction}
                    onCheckedChange={setIncludeCallToAction}
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
                    placeholder="Tambahkan instruksi spesifik lainnya untuk thread Anda..."
                    className="mt-1 resize-none"
                    rows={3}
                  />
                </div>
                
                <Button 
                  className="w-full mt-2 bg-blue-500 hover:bg-blue-600" 
                  onClick={handleGenerateThread}
                  disabled={!topic || threadMutation.isPending}
                >
                  {threadMutation.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Sedang Membuat Thread...
                    </>
                  ) : (
                    <>
                      <Twitter className="h-4 w-4 mr-2" /> Generate Twitter Thread
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
                  <Twitter className="mr-2 text-blue-500" /> Hasil Thread
                </h2>
                {generatedThread.length > 0 && (
                  <Button variant="outline" onClick={handleCopyAll} className="flex items-center">
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" /> Disalin!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" /> Salin Semua
                      </>
                    )}
                  </Button>
                )}
              </div>
              
              <Separator className="mb-4" />
              
              <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
                {threadMutation.isPending ? (
                  <div className="text-center p-12">
                    <RefreshCw className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Sedang membuat thread dengan Marko AI...</p>
                    <p className="text-gray-400 text-sm mt-2">Hal ini mungkin membutuhkan beberapa detik</p>
                  </div>
                ) : generatedThread.length > 0 ? (
                  generatedThread.map((tweet, index) => (
                    <div key={index} className="border rounded-xl p-4 bg-white shadow-sm relative">
                      <div className="flex items-start mb-3">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
                          {twitterHandle ? twitterHandle.charAt(1) : "T"}
                        </div>
                        <div>
                          <p className="font-semibold">{twitterHandle || "Your Twitter"}</p>
                          <p className="text-xs text-gray-500">@{twitterHandle ? twitterHandle.substring(1) : "username"}</p>
                        </div>
                      </div>
                      <div className="whitespace-pre-wrap mb-2">{tweet}</div>
                      <div className="flex justify-between text-gray-500 text-sm mt-3">
                        <span>Tweet {index + 1} dari {generatedThread.length}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="absolute top-2 right-2" 
                          onClick={() => handleCopyTweet(index)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-12 text-gray-400">
                    <Twitter className="h-12 w-12 mx-auto mb-4 text-blue-200" />
                    <p className="font-medium">Twitter Thread akan muncul di sini</p>
                    <p className="text-sm mt-2">Silakan isi form di sebelah kiri dan klik Generate Twitter Thread</p>
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