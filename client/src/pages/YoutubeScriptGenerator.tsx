import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Youtube,
  FileText,
  LanguagesIcon,
  Clock,
  Target,
  Video,
  RefreshCw,
  Copy,
  Check,
  Layout,
  Users
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

// Daftar jenis konten
const contentTypes = [
  { value: "tutorial", label: "Tutorial / How-To" },
  { value: "review", label: "Review Produk" },
  { value: "vlog", label: "Vlog / Daily Life" },
  { value: "edukasi", label: "Edukasi / Informasi" },
  { value: "entertainment", label: "Hiburan" },
  { value: "gaming", label: "Gaming" },
  { value: "reaction", label: "Reaction" },
  { value: "story_time", label: "Story Time" },
  { value: "interview", label: "Wawancara" },
];

// Daftar gaya konten
const contentStyles = [
  { value: "formal", label: "Formal - Serius dan profesional" },
  { value: "casual", label: "Casual - Santai dan akrab" },
  { value: "humor", label: "Humor - Lucu dan menghibur" },
  { value: "dramatic", label: "Dramatis - Mengesankan dan intens" },
  { value: "educational", label: "Edukatif - Berfokus pada pembelajaran" },
  { value: "inspirational", label: "Inspiratif - Memotivasi dan menyemangati" },
];

// Daftar target audiens
const targetAudiences = [
  { value: "umum", label: "Umum - Semua Kalangan" },
  { value: "remaja", label: "Remaja (13-19 tahun)" },
  { value: "dewasa_muda", label: "Dewasa Muda (20-35 tahun)" },
  { value: "paruh_baya", label: "Paruh Baya (36-55 tahun)" },
  { value: "anak", label: "Anak-anak" },
  { value: "profesional", label: "Profesional/Pekerja" },
  { value: "pebisnis", label: "Pebisnis/Entrepreneur" },
  { value: "pelajar", label: "Pelajar/Mahasiswa" },
];

export default function YoutubeScriptGenerator() {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("id");
  const [contentType, setContentType] = useState("tutorial");
  const [contentStyle, setContentStyle] = useState("casual");
  const [targetAudience, setTargetAudience] = useState("umum");
  const [videoDuration, setVideoDuration] = useState(5);
  const [includeHook, setIncludeHook] = useState(true);
  const [includeCallToAction, setIncludeCallToAction] = useState(true);
  const [channelName, setChannelName] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  
  const [generatedScript, setGeneratedScript] = useState("");
  const [copied, setCopied] = useState(false);
  
  const { toast } = useToast();
  
  // Simulasi API untuk demo
  const scriptMutation = useMutation({
    mutationFn: async (data: any) => {
      // Simulasi delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Contoh script (ini akan diganti dengan API asli)
      return { 
        script: `
# ${title || "Judul Video"} - Script YouTube (Durasi: ${videoDuration} menit)

## INTRO (0:00 - 0:30)
${includeHook ? 
`[Hook Pembuka]
Halo Semuanya! Apa kabar? Kembali lagi di channel ${channelName}! 👋

[Pertanyaan Menarik Perhatian]
Kalian pernah gak sih penasaran tentang ${title.toLowerCase()}? Nah, hari ini kita bakal bahas secara lengkap!` : 
`Halo Semuanya! Kembali lagi di channel ${channelName}!

Hari ini kita akan membahas tentang ${title.toLowerCase()}.`}

## BUMPER/LOGO (0:30 - 0:35)
[Masukkan Animasi Logo Channel]

## KONTEN UTAMA (0:35 - ${videoDuration-1}:30)

### Bagian 1: Pengenalan
- ${keyPoints.split('\n')[0] || 'Penjelasan singkat tentang topik yang dibahas'}
- Mengapa topik ini penting untuk ditonton

### Bagian 2: Pembahasan Utama
${keyPoints.split('\n').map((point, index) => `- ${point}`).join('\n')}

### Bagian 3: Tips dan Trik
- Tips praktis yang bisa langsung diterapkan
- Hal-hal yang perlu dihindari

## PENUTUP (${videoDuration-1}:30 - ${videoDuration}:00)
${includeCallToAction ? 
`[Kesimpulan]
Jadi itu tadi pembahasan kita tentang ${title.toLowerCase()}. Semoga bermanfaat dan membantu kalian semua!

[Call to Action]
Jangan lupa like, comment, share, dan subscribe ya! Tekan juga tombol lonceng biar dapat notifikasi video terbaru dari channel ini.

Sampai jumpa di video selanjutnya! Byeee! ✌️` : 
`Demikian pembahasan kita tentang ${title.toLowerCase()}. Semoga bermanfaat!

Sampai jumpa di video selanjutnya!`}
`
      };
    },
    onSuccess: (data) => {
      setGeneratedScript(data.script);
      toast({
        title: "Script Berhasil Dibuat",
        description: "Script YouTube telah berhasil digenerate menggunakan Marko AI",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Gagal membuat script: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const handleGenerateScript = () => {
    if (!title) {
      toast({
        title: "Input Tidak Lengkap",
        description: "Harap isi judul video terlebih dahulu",
        variant: "destructive",
      });
      return;
    }
    
    const data = {
      title,
      language,
      contentType,
      contentStyle,
      targetAudience,
      videoDuration,
      includeHook,
      includeCallToAction,
      channelName,
      keyPoints,
      additionalInstructions,
    };
    
    scriptMutation.mutate(data);
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedScript);
    setCopied(true);
    toast({
      title: "Disalin!",
      description: "Script telah disalin ke clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-0">
      <Breadcrumb 
        items={[
          { label: "Tools", path: "/tools" },
          { label: "YouTube Script Generator", path: "/tools/youtube-script", isActive: true }
        ]} 
      />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
          <Youtube className="text-red-600 mr-2" /> 
          YouTube Script Generator
        </h1>
        <p className="text-gray-600 mt-2">
          Buat script video YouTube yang profesional dan menarik dengan bantuan Marko AI
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="mr-2 text-red-600" /> Opsi Pembuatan Script
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" /> Judul Video
                  </Label>
                  <Input 
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Misalnya: 5 Tips Efektif Belajar Bahasa Inggris"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="channel-name" className="flex items-center">
                    <Youtube className="h-4 w-4 mr-2" /> Nama Channel
                  </Label>
                  <Input 
                    id="channel-name"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    placeholder="Masukkan nama channel YouTube Anda"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="content-type" className="flex items-center">
                    <Layout className="h-4 w-4 mr-2" /> Jenis Konten
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
                  <Label htmlFor="content-style" className="flex items-center">
                    <Video className="h-4 w-4 mr-2" /> Gaya Konten
                  </Label>
                  <Select value={contentStyle} onValueChange={setContentStyle}>
                    <SelectTrigger id="content-style" className="mt-1">
                      <SelectValue placeholder="Pilih gaya konten" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentStyles.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="target-audience" className="flex items-center">
                    <Users className="h-4 w-4 mr-2" /> Target Audiens
                  </Label>
                  <Select value={targetAudience} onValueChange={setTargetAudience}>
                    <SelectTrigger id="target-audience" className="mt-1">
                      <SelectValue placeholder="Pilih target audiens" />
                    </SelectTrigger>
                    <SelectContent>
                      {targetAudiences.map((audience) => (
                        <SelectItem key={audience.value} value={audience.value}>
                          {audience.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="video-duration" className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" /> Durasi Video ({videoDuration} menit)
                  </Label>
                  <Slider
                    id="video-duration"
                    value={[videoDuration]}
                    onValueChange={(value) => setVideoDuration(value[0])}
                    min={3}
                    max={20}
                    step={1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>3 menit</span>
                    <span>10 menit</span>
                    <span>20 menit</span>
                  </div>
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
                  <Label htmlFor="key-points" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" /> Poin-poin Utama (1 per baris)
                  </Label>
                  <Textarea 
                    id="key-points"
                    value={keyPoints}
                    onChange={(e) => setKeyPoints(e.target.value)}
                    placeholder="Masukkan poin-poin utama yang ingin dibahas dalam video"
                    className="mt-1 resize-none"
                    rows={3}
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
                    placeholder="Tambahkan instruksi spesifik lainnya untuk script Anda..."
                    className="mt-1 resize-none"
                    rows={3}
                  />
                </div>
                
                <Button 
                  className="w-full mt-2 bg-red-600 hover:bg-red-700" 
                  onClick={handleGenerateScript}
                  disabled={!title || scriptMutation.isPending}
                >
                  {scriptMutation.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Sedang Membuat Script...
                    </>
                  ) : (
                    <>
                      <Youtube className="h-4 w-4 mr-2" /> Generate Script YouTube
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
                  <Youtube className="mr-2 text-red-600" /> Hasil Script Video
                </h2>
                {generatedScript && (
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
              
              <div className="rounded-lg border p-4 bg-white">
                <div className="prose max-w-none">
                  {scriptMutation.isPending ? (
                    <div className="text-center p-12">
                      <RefreshCw className="h-12 w-12 animate-spin text-red-600 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">Sedang membuat script dengan Marko AI...</p>
                      <p className="text-gray-400 text-sm mt-2">Hal ini mungkin membutuhkan beberapa detik</p>
                    </div>
                  ) : generatedScript ? (
                    <div className="whitespace-pre-wrap">
                      <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto">{generatedScript}</pre>
                    </div>
                  ) : (
                    <div className="text-center p-12 text-gray-400">
                      <Youtube className="h-12 w-12 mx-auto mb-4 text-red-200" />
                      <p className="font-medium">Script YouTube akan muncul di sini</p>
                      <p className="text-sm mt-2">Silakan isi form di sebelah kiri dan klik Generate Script YouTube</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}