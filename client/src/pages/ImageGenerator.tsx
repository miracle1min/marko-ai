import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { ImageGenerationRequest, ImageGenerationResponse } from "@/lib/types";
import { generateImage } from "@/lib/geminiApi";
import { useToast } from "@/hooks/use-toast";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Image } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import AnimatedPage from "@/components/AnimatedPage";

export default function ImageGenerator() {
  const { toast } = useToast();
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ImageGenerationRequest>({
    defaultValues: {
      prompt: "",
      sampleCount: 1,
      aspectRatio: "square",
      negativePrompt: "",
      stylePreset: ""
    }
  });

  const formValues = watch();

  const mutation = useMutation({
    mutationFn: async (request: ImageGenerationRequest) => {
      setIsLoading(true);
      return await generateImage(request);
    },
    onSuccess: (data: ImageGenerationResponse) => {
      setGeneratedImages(data.images);
      setPrompt(data.prompt);
      setIsLoading(false);
      toast({
        title: "Sukses!",
        description: "Gambar berhasil dibuat",
      });
    },
    onError: (error: Error) => {
      setIsLoading(false);
      toast({
        title: "Error!",
        description: error.message || "Gagal membuat gambar. Silakan coba lagi.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: ImageGenerationRequest) => {
    mutation.mutate(data);
  };

  return (
    <AnimatedPage>
      <div className="container max-w-5xl mx-auto px-4 py-6">
        <Breadcrumb items={[
          { label: "Beranda", path: "/" },
          { label: "Tools", path: "/tools" },
          { label: "Image Generator", path: "/tools/image-generator", isActive: true }
        ]} />

        <div className="flex flex-col gap-6 mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Image className="h-6 w-6" /> 
                Generator Gambar AI
              </CardTitle>
              <CardDescription>
                Buat gambar berkualitas tinggi dari teks deskripsi menggunakan model AI Imagen 3.0
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="prompt">Deskripsi Gambar</Label>
                  <Textarea 
                    id="prompt"
                    placeholder="Contoh: Robot mengendarai skateboard merah di taman kota futuristik"
                    {...register("prompt", { required: "Deskripsi gambar diperlukan" })}
                    className="min-h-[100px]"
                  />
                  {errors.prompt && (
                    <p className="text-sm text-red-500">{errors.prompt.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Berikan deskripsi yang detail tentang gambar yang ingin Anda buat.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="advanced">Opsi Lanjutan</Label>
                    <Switch 
                      id="advanced" 
                      checked={advancedOptions}
                      onCheckedChange={setAdvancedOptions}
                    />
                  </div>

                  {advancedOptions && (
                    <div className="space-y-4 border p-4 rounded-md">
                      <div className="space-y-2">
                        <Label htmlFor="sampleCount">Jumlah Gambar (1-4)</Label>
                        <div className="flex items-center gap-4">
                          <Slider 
                            id="sampleCount"
                            min={1} 
                            max={4} 
                            step={1} 
                            value={[formValues.sampleCount || 1]}
                            onValueChange={(value) => setValue("sampleCount", value[0])}
                            className="flex-1"
                          />
                          <span className="font-medium text-sm w-4">{formValues.sampleCount}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="aspectRatio">Rasio Aspek</Label>
                        <Select 
                          value={formValues.aspectRatio} 
                          onValueChange={(value) => setValue("aspectRatio", value as "square" | "portrait" | "landscape")}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih rasio aspek" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="square">Persegi (1:1)</SelectItem>
                            <SelectItem value="portrait">Potret (3:4)</SelectItem>
                            <SelectItem value="landscape">Lanskap (4:3)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="negativePrompt">Prompt Negatif (Opsional)</Label>
                        <Textarea
                          id="negativePrompt"
                          placeholder="Gambarkan apa yang tidak ingin Anda lihat dalam gambar"
                          {...register("negativePrompt")}
                        />
                        <p className="text-xs text-muted-foreground">
                          Jelaskan elemen yang ingin Anda hindari dalam gambar.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="stylePreset">Gaya Visual (Opsional)</Label>
                        <Select 
                          value={formValues.stylePreset || ""} 
                          onValueChange={(value) => setValue("stylePreset", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih gaya visual" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="anime">Anime</SelectItem>
                            <SelectItem value="photographic">Fotografis</SelectItem>
                            <SelectItem value="digital-art">Digital Art</SelectItem>
                            <SelectItem value="cinematic">Sinematik</SelectItem>
                            <SelectItem value="pixel-art">Pixel Art</SelectItem>
                            <SelectItem value="isometric">Isometrik</SelectItem>
                            <SelectItem value="line-art">Line Art</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Membuat Gambar..." : "Buat Gambar"}
                </Button>

                {isLoading && (
                  <div className="space-y-2">
                    <p className="text-sm text-center">Membuat gambar, harap tunggu...</p>
                    <Progress value={45} className="h-2" />
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {generatedImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Hasil Gambar</CardTitle>
                <CardDescription>
                  Deskripsi: {prompt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {generatedImages.map((imageData, index) => (
                    <div key={index} className="relative group border rounded-md overflow-hidden">
                      <img 
                        src={`data:image/png;base64,${imageData}`}
                        alt={`Generated image ${index + 1}`}
                        className="w-full h-auto"
                      />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = `data:image/png;base64,${imageData}`;
                              link.download = `generated-image-${index + 1}.png`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                          >
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Panduan Penggunaan</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="tips">
                <TabsList className="mb-4">
                  <TabsTrigger value="tips">Tips Prompt</TabsTrigger>
                  <TabsTrigger value="examples">Contoh</TabsTrigger>
                </TabsList>
                
                <TabsContent value="tips" className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Tips Membuat Prompt yang Baik:</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Berikan deskripsi yang spesifik dan detail</li>
                      <li>Tentukan gaya visual yang diinginkan (fotorealistik, kartun, lukisan, dll.)</li>
                      <li>Jelaskan pencahayaan, warna, dan suasana</li>
                      <li>Berikan konteks atau latar tempat</li>
                      <li>Gunakan prompt negatif untuk menghindari elemen yang tidak diinginkan</li>
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Struktur Prompt yang Efektif:</h3>
                    <p className="text-sm mb-2">
                      [Subjek] + [Aksi] + [Penampilan] + [Gaya] + [Pencahayaan] + [Komposisi]
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Contoh: "Kucing persia putih bermain dengan bola wol merah, gaya fotografi portrait, pencahayaan lembut, latar belakang rumah modern yang buram"
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="examples" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border rounded-md p-3 space-y-2">
                      <h3 className="font-medium">Potret Hewan</h3>
                      <p className="text-sm">
                        "Kucing Siberian dengan bulu tebal dalam pose elegan, fotografi profesional dengan pencahayaan studio, latar belakang hitam, detail tinggi"
                      </p>
                    </div>
                    
                    <div className="border rounded-md p-3 space-y-2">
                      <h3 className="font-medium">Pemandangan Alam</h3>
                      <p className="text-sm">
                        "Pemandangan gunung berapi aktif saat matahari terbenam, dengan lava mengalir, gaya fotografi lanskap dramatik, langit berwarna jingga kemerahan"
                      </p>
                    </div>
                    
                    <div className="border rounded-md p-3 space-y-2">
                      <h3 className="font-medium">Karakter Fantasi</h3>
                      <p className="text-sm">
                        "Prajurit naga humanoid dengan sisik hijau berkilau, mengenakan baju zirah perak dan pedang api, gaya ilustrasi digital fantasi, pencahayaan dramatis"
                      </p>
                    </div>
                    
                    <div className="border rounded-md p-3 space-y-2">
                      <h3 className="font-medium">Makanan</h3>
                      <p className="text-sm">
                        "Hidangan pasta Italia dengan saus tomat, keju parmesan, dan daun basil segar di atas piring putih, fotografi makanan profesional, pencahayaan lembut"
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </AnimatedPage>
  );
}