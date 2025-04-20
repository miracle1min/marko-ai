import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { 
  Facebook, 
  FileText,
  LanguagesIcon, 
  PenTool,
  Target,
  UserCircle,
  RefreshCw,
  Copy,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Breadcrumb from "@/components/Breadcrumb";

// Daftar tema postingan
const postThemes = [
  { value: "promosi_produk", label: "Promosi Produk atau Layanan" },
  { value: "tips_trik", label: "Tips dan Trik" },
  { value: "edukasi", label: "Edukasi atau Pengetahuan" },
  { value: "inspirasi", label: "Kisah Inspirasi" },
  { value: "peristiwa_terkini", label: "Peristiwa Terkini" },
  { value: "hiburan", label: "Hiburan atau Meme" },
  { value: "pertanyaan", label: "Pertanyaan untuk Audiens" },
  { value: "testimoni", label: "Testimoni Pelanggan" },
  { value: "ucapan", label: "Ucapan Hari Besar/Spesial" },
];

// Daftar gaya bahasa
const languageStyles = [
  { value: "formal", label: "Formal - Bahasa resmi dan profesional" },
  { value: "casual", label: "Casual - Santai dan akrab" },
  { value: "fun", label: "Fun - Ceria dan menghibur" },
  { value: "motivational", label: "Motivasional - Menginspirasi dan memotivasi" },
  { value: "informative", label: "Informatif - Jelas dan faktual" },
  { value: "storytelling", label: "Storytelling - Bercerita dengan alur" },
  { value: "viral", label: "Viral - Menarik dan cepat tersebar" },
];

// Daftar target audiens
const targetAudiences = [
  { value: "umum", label: "Umum - Semua Kalangan" },
  { value: "remaja", label: "Remaja (13-19 tahun)" },
  { value: "dewasa_muda", label: "Dewasa Muda (20-35 tahun)" },
  { value: "paruh_baya", label: "Paruh Baya (36-55 tahun)" },
  { value: "lansia", label: "Lansia (56+ tahun)" },
  { value: "orang_tua", label: "Orang Tua" },
  { value: "profesional", label: "Profesional/Pekerja" },
  { value: "pebisnis", label: "Pebisnis/Entrepreneur" },
  { value: "pelajar", label: "Pelajar/Mahasiswa" },
];

export default function FacebookPostCreator() {
  const [theme, setTheme] = useState("promosi_produk");
  const [language, setLanguage] = useState("id");
  const [languageStyle, setLanguageStyle] = useState("casual");
  const [targetAudience, setTargetAudience] = useState("umum");
  const [brandName, setBrandName] = useState("");
  const [productInfo, setProductInfo] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [emojiCount, setEmojiCount] = useState(3);
  
  const [generatedPost, setGeneratedPost] = useState("");
  const [copied, setCopied] = useState(false);
  
  const { toast } = useToast();
  
  // Simulasi API untuk demo
  const postMutation = useMutation({
    mutationFn: async (data: any) => {
      // Simulasi delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Contoh post (ini akan diganti dengan API asli)
      return { 
        post: `🔥 PROMO SPESIAL HARI INI! 🔥\n\nHai Sahabat ${brandName}! 👋\n\nKami punya kabar gembira buat kamu yang ingin ${productInfo}! Hari ini ada PROMO SPESIAL yang sayang banget untuk dilewatkan! 😍\n\n✨ ${productInfo} kini hadir dengan kualitas premium namun dengan harga yang terjangkau!\n\n💯 Keunggulan produk kami:\n- Kualitas terjamin\n- Hasil maksimal\n- Proses cepat\n- Pelayanan ramah\n\nSudah banyak yang membuktikan! Yuk, jangan sampai ketinggalan promo spesial ini! Hubungi kami sekarang juga di link di bio atau DM langsung ya! 📲\n\n#${brandName.replace(/\s+/g, '')} #PromoSpesial #JanganSampaiKehabisan`
      };
    },
    onSuccess: (data) => {
      setGeneratedPost(data.post);
      toast({
        title: "Post Berhasil Dibuat",
        description: "Post Facebook telah berhasil digenerate menggunakan Marko AI",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Gagal membuat post: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const handleGeneratePost = () => {
    if (!brandName || !productInfo) {
      toast({
        title: "Input Tidak Lengkap",
        description: "Harap isi nama brand dan informasi produk terlebih dahulu",
        variant: "destructive",
      });
      return;
    }
    
    const data = {
      theme,
      language,
      languageStyle,
      targetAudience,
      brandName,
      productInfo,
      additionalInstructions,
      emojiCount,
    };
    
    postMutation.mutate(data);
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPost);
    setCopied(true);
    toast({
      title: "Disalin!",
      description: "Post telah disalin ke clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-0">
      <Breadcrumb 
        items={[
          { label: "Tools", path: "/tools" },
          { label: "Facebook Post Creator", path: "/tools/facebook-post", isActive: true }
        ]} 
      />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
          <Facebook className="text-blue-600 mr-2" /> 
          Facebook Post Creator
        </h1>
        <p className="text-gray-600 mt-2">
          Buat postingan Facebook yang menarik dan mengundang engagement dengan bantuan Marko AI
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <PenTool className="mr-2 text-blue-600" /> Opsi Pembuatan Post
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="brand-name" className="flex items-center">
                    <UserCircle className="h-4 w-4 mr-2" /> Nama Brand/Bisnis
                  </Label>
                  <Input 
                    id="brand-name"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Misalnya: Toko Elektronik Makmur"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="theme" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" /> Tema Postingan
                  </Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger id="theme" className="mt-1">
                      <SelectValue placeholder="Pilih tema postingan" />
                    </SelectTrigger>
                    <SelectContent>
                      {postThemes.map((theme) => (
                        <SelectItem key={theme.value} value={theme.value}>
                          {theme.label}
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
                  <Label htmlFor="language-style" className="flex items-center">
                    <PenTool className="h-4 w-4 mr-2" /> Gaya Bahasa
                  </Label>
                  <Select value={languageStyle} onValueChange={setLanguageStyle}>
                    <SelectTrigger id="language-style" className="mt-1">
                      <SelectValue placeholder="Pilih gaya bahasa" />
                    </SelectTrigger>
                    <SelectContent>
                      {languageStyles.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="target-audience" className="flex items-center">
                    <Target className="h-4 w-4 mr-2" /> Target Audiens
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
                  <Label htmlFor="emoji-count" className="flex items-center">
                    <span className="mr-2">😀</span> Jumlah Emoji ({emojiCount})
                  </Label>
                  <Slider
                    id="emoji-count"
                    value={[emojiCount]}
                    onValueChange={(value) => setEmojiCount(value[0])}
                    min={0}
                    max={10}
                    step={1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>5</span>
                    <span>10</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="product-info" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" /> Informasi Produk/Jasa
                  </Label>
                  <Textarea 
                    id="product-info"
                    value={productInfo}
                    onChange={(e) => setProductInfo(e.target.value)}
                    placeholder="Masukkan deskripsi produk atau jasa yang ingin dipromosikan"
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
                    placeholder="Tambahkan instruksi spesifik lainnya untuk postingan Anda..."
                    className="mt-1 resize-none"
                    rows={3}
                  />
                </div>
                
                <Button 
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700" 
                  onClick={handleGeneratePost}
                  disabled={!brandName || !productInfo || postMutation.isPending}
                >
                  {postMutation.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Sedang Membuat Post...
                    </>
                  ) : (
                    <>
                      <Facebook className="h-4 w-4 mr-2" /> Generate Facebook Post
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
                  <Facebook className="mr-2 text-blue-600" /> Hasil Postingan
                </h2>
                {generatedPost && (
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
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-3">
                    {brandName ? brandName.charAt(0) : "B"}
                  </div>
                  <div>
                    <p className="font-semibold">{brandName || "Nama Brand Anda"}</p>
                    <p className="text-xs text-gray-500">Baru saja · <span className="text-gray-400">🌎</span></p>
                  </div>
                </div>
                
                <div className="prose max-w-none">
                  {postMutation.isPending ? (
                    <div className="text-center p-12">
                      <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">Sedang membuat post dengan Marko AI...</p>
                      <p className="text-gray-400 text-sm mt-2">Hal ini mungkin membutuhkan beberapa detik</p>
                    </div>
                  ) : generatedPost ? (
                    <div className="whitespace-pre-wrap">{generatedPost}</div>
                  ) : (
                    <div className="text-center p-12 text-gray-400">
                      <Facebook className="h-12 w-12 mx-auto mb-4 text-blue-200" />
                      <p className="font-medium">Postingan Facebook akan muncul di sini</p>
                      <p className="text-sm mt-2">Silakan isi form di sebelah kiri dan klik Generate Facebook Post</p>
                    </div>
                  )}
                </div>
                
                {generatedPost && (
                  <div className="mt-4 border-t pt-3 flex justify-between text-gray-500">
                    <span>👍 Like</span>
                    <span>💬 Comment</span>
                    <span>↗️ Share</span>
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