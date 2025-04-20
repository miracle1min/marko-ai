import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Music, Loader2, Sparkles, Info, CheckCircle2, Copy, FileAudio, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import Breadcrumb from "@/components/Breadcrumb";
import { JingleCreatorRequest, JingleCreatorResponse } from "@/lib/types";

// Schema validasi form
const formSchema = z.object({
  brand: z.string().min(2, { message: "Nama brand harus minimal 2 karakter" }),
  purpose: z.string().min(2, { message: "Tujuan jingle harus diisi" }),
  mood: z.string().min(2, { message: "Mood jingle harus diisi" }),
  length: z.string().min(2, { message: "Panjang jingle harus diisi" }),
  targetAudience: z.string().min(2, { message: "Target audiens harus diisi" }),
  style: z.string().min(2, { message: "Gaya jingle harus diisi" }),
  includeTagline: z.boolean().default(false),
  tagline: z.string().optional(),
  additionalInstructions: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function JingleCreator() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<JingleCreatorResponse | null>(null);
  const [activeTab, setActiveTab] = useState("form");

  // Inisialisasi form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand: "",
      purpose: "",
      mood: "",
      length: "",
      targetAudience: "",
      style: "",
      includeTagline: false,
      tagline: "",
      additionalInstructions: "",
    },
  });

  const { watch, setValue } = form;
  const includeTagline = watch("includeTagline");

  // Fungsi untuk mengirim form ke API
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      // Hanya kirim tagline jika includeTagline true
      const payload: JingleCreatorRequest = {
        ...values,
        tagline: includeTagline ? values.tagline : undefined,
      };

      const response = await fetch("/api/gemini/jingle-creator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Gagal membuat jingle. Silakan coba lagi.");
      }

      const data = await response.json();
      setResult(data);
      setActiveTab("hasil");
      
      toast({
        title: "Jingle berhasil dibuat!",
        description: "Jingle untuk brand Anda telah berhasil dibuat.",
      });
    } catch (error) {
      console.error("Error creating jingle:", error);
      toast({
        variant: "destructive",
        title: "Gagal membuat jingle",
        description: error instanceof Error ? error.message : "Terjadi kesalahan. Silakan coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk menyalin teks ke clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Disalin ke clipboard!",
      description: "Teks telah disalin ke clipboard.",
    });
  };

  // Fungsi untuk mengunduh jingle sebagai file teks
  const downloadAsText = (content: string, filename: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-0 dark:bg-slate-900 min-h-screen">
      <Breadcrumb
        items={[
          { label: "Home", path: "/" },
          { label: "Tools", path: "/tools" },
          { label: "Jingle Creator", path: "/tools/jingle-creator", isActive: true },
        ]}
      />

      <div className="my-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight dark:text-white">Jingle Creator</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Buat jingle kreatif dan catchy untuk brand atau iklan Anda dengan bantuan AI
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
            <Music className="h-4 w-4" />
            <span>Ayo Berkreasi Dengan Marko AI !</span>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form">Buat Jingle</TabsTrigger>
          <TabsTrigger value="hasil" disabled={!result}>
            Hasil
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Music className="mr-2 h-5 w-5 text-primary" />
                Buat Jingle Kreatif
              </CardTitle>
              <CardDescription>
                Lengkapi form di bawah untuk membuat jingle yang sesuai dengan brand Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Brand</FormLabel>
                          <FormControl>
                            <Input placeholder="Contoh: Aqua, Indomie, Netflix" {...field} />
                          </FormControl>
                          <FormDescription>
                            Masukkan nama brand atau produk Anda
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="purpose"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tujuan Jingle</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih tujuan jingle" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="tv_commercial">Iklan TV</SelectItem>
                              <SelectItem value="radio_ad">Iklan Radio</SelectItem>
                              <SelectItem value="social_media">Media Sosial</SelectItem>
                              <SelectItem value="corporate_event">Acara Perusahaan</SelectItem>
                              <SelectItem value="product_launch">Peluncuran Produk</SelectItem>
                              <SelectItem value="app_notification">Notifikasi Aplikasi</SelectItem>
                              <SelectItem value="podcast_intro">Intro Podcast</SelectItem>
                              <SelectItem value="youtube_channel">Channel YouTube</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Tujuan penggunaan jingle ini
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mood</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih mood jingle" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="upbeat">Ceria (Upbeat)</SelectItem>
                              <SelectItem value="serious">Serius</SelectItem>
                              <SelectItem value="inspirational">Inspiratif</SelectItem>
                              <SelectItem value="emotional">Emosional</SelectItem>
                              <SelectItem value="funny">Lucu</SelectItem>
                              <SelectItem value="energetic">Energik</SelectItem>
                              <SelectItem value="relaxed">Santai</SelectItem>
                              <SelectItem value="mysterious">Misterius</SelectItem>
                              <SelectItem value="adventurous">Petualangan</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Mood atau nuansa jingle yang diinginkan
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="length"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Panjang Jingle</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih panjang jingle" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="very_short">Sangat Pendek (5-10 detik)</SelectItem>
                              <SelectItem value="short">Pendek (10-15 detik)</SelectItem>
                              <SelectItem value="medium">Sedang (15-30 detik)</SelectItem>
                              <SelectItem value="long">Panjang (30-60 detik)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Durasi jingle yang diinginkan
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="targetAudience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Audiens</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih target audiens" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="children">Anak-anak</SelectItem>
                              <SelectItem value="teenagers">Remaja</SelectItem>
                              <SelectItem value="young_adults">Dewasa Muda (18-25)</SelectItem>
                              <SelectItem value="adults">Dewasa (25-40)</SelectItem>
                              <SelectItem value="older_adults">Dewasa Lanjut (40+)</SelectItem>
                              <SelectItem value="families">Keluarga</SelectItem>
                              <SelectItem value="professionals">Profesional</SelectItem>
                              <SelectItem value="students">Pelajar</SelectItem>
                              <SelectItem value="general">Umum</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Audiens yang ditargetkan oleh jingle ini
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="style"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gaya Jingle</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih gaya jingle" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="musical">Musikal (dengan melodi)</SelectItem>
                              <SelectItem value="spoken_word">Spoken Word</SelectItem>
                              <SelectItem value="rhyming">Berirama/Rhyming</SelectItem>
                              <SelectItem value="call_and_response">Call and Response</SelectItem>
                              <SelectItem value="sound_effects">Dengan Efek Suara</SelectItem>
                              <SelectItem value="sing_along">Sing Along</SelectItem>
                              <SelectItem value="pop">Pop</SelectItem>
                              <SelectItem value="rock">Rock</SelectItem>
                              <SelectItem value="folk">Folk/Tradisional</SelectItem>
                              <SelectItem value="electronic">Elektronik</SelectItem>
                              <SelectItem value="rap">Rap/Hip Hop</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Gaya atau style jingle yang diinginkan
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <FormField
                    control={form.control}
                    name="includeTagline"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Sertakan Tagline</FormLabel>
                          <FormDescription>
                            Apakah Anda ingin menyertakan tagline dalam jingle?
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {includeTagline && (
                    <FormField
                      control={form.control}
                      name="tagline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tagline (Opsional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Contoh: Just Do It, Think Different" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Masukkan tagline yang ingin digunakan dalam jingle (opsional)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="additionalInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instruksi Tambahan (Opsional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Contoh: Sertakan nama produk minimal 3 kali, gunakan kata-kata yang mudah diingat"
                            className="resize-y min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Berikan instruksi khusus lainnya untuk jingle Anda (opsional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Alert className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <AlertTitle className="text-blue-600 dark:text-blue-400">Tips</AlertTitle>
                    <AlertDescription className="text-blue-600 dark:text-blue-400">
                      Jingle yang baik biasanya singkat, mudah diingat, dan mencerminkan nilai brand. 
                      Sertakan instruksi spesifik untuk mendapatkan hasil terbaik.
                    </AlertDescription>
                  </Alert>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Membuat Jingle...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" /> Buat Jingle
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hasil" className="mt-0">
          {result && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Music className="mr-2 h-5 w-5 text-primary" />
                    Jingle untuk {form.getValues().brand}
                  </CardTitle>
                  <CardDescription>
                    Berikut adalah jingle yang dibuat sesuai dengan spesifikasi Anda
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Jingle Utama</h3>
                      <div className="flex gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(result.jingle)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Salin ke clipboard</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadAsText(result.jingle, `jingle-${form.getValues().brand.toLowerCase().replace(/\s+/g, '-')}.txt`)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Unduh sebagai file teks</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    <div className="relative p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800 whitespace-pre-wrap">
                      {result.jingle}
                    </div>
                  </div>

                  {result.variations && result.variations.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Variasi Jingle</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {result.variations.map((variation, index) => (
                          <div key={index} className="relative">
                            <div className="absolute top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded-full">
                              Variasi {index + 1}
                            </div>
                            <div className="p-6 pt-10 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 whitespace-pre-wrap">
                              {variation}
                            </div>
                            <div className="mt-2 flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(variation)}
                              >
                                <Copy className="h-4 w-4 mr-1" /> Salin
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {includeTagline && result.tagline && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Tagline</h3>
                      <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 whitespace-pre-wrap">
                        {result.tagline}
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(result.tagline || "")}
                        >
                          <Copy className="h-4 w-4 mr-1" /> Salin Tagline
                        </Button>
                      </div>
                    </div>
                  )}

                  {result.explanation && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Penjelasan</h3>
                      <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 whitespace-pre-wrap">
                        {result.explanation}
                      </div>
                    </div>
                  )}

                  {result.notes && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Catatan Musik</h3>
                      <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800 whitespace-pre-wrap">
                        {result.notes}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Alert className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertTitle className="text-green-600 dark:text-green-400">Kreasi Jingle Berhasil</AlertTitle>
                    <AlertDescription className="text-green-600 dark:text-green-400">
                      Jingle telah berhasil dibuat. Anda dapat menggunakannya untuk keperluan marketing atau periklanan brand Anda.
                    </AlertDescription>
                  </Alert>
                  <div className="flex gap-3 w-full">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setActiveTab("form")}
                    >
                      Kembali ke Form
                    </Button>
                    <Button 
                      className="w-full"
                      onClick={() => {
                        const allContent = `JINGLE UNTUK: ${form.getValues().brand}
                          
JINGLE UTAMA:
${result.jingle}

${result.variations && result.variations.length > 0 ? `VARIASI JINGLE:
${result.variations.map((v, i) => `Variasi ${i+1}:
${v}`).join('\n\n')}` : ''}

${result.tagline ? `TAGLINE:
${result.tagline}` : ''}

${result.explanation ? `PENJELASAN:
${result.explanation}` : ''}

${result.notes ? `CATATAN MUSIK:
${result.notes}` : ''}

Mari berkolaborasi bersama Marko AI!`;
                        
                        downloadAsText(allContent, `complete-jingle-${form.getValues().brand.toLowerCase().replace(/\s+/g, '-')}.txt`);
                        
                        toast({
                          title: "Jingle diunduh!",
                          description: "File jingle telah diunduh ke perangkat Anda.",
                        });
                      }}
                    >
                      <FileAudio className="mr-2 h-4 w-4" /> Unduh Semua
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}