import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { youtubeToText } from "@/lib/geminiApi";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area"; 
import { Copy, AlertCircle, Youtube, FileText, FileSearch, BookText, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import Breadcrumb from "@/components/Breadcrumb";
import { YouTubeToTextResponse } from "@/lib/types";

// Form schema
const formSchema = z.object({
  videoUrl: z.string()
    .min(1, { message: "URL video YouTube harus diisi" })
    .regex(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/, {
      message: "Masukkan URL video YouTube yang valid"
    }),
  outputFormat: z.enum(["transcript", "summary", "article"], {
    required_error: "Pilih format output"
  }),
  language: z.enum(["id", "en"], {
    required_error: "Pilih bahasa output"
  }),
  includeTimestamps: z.boolean().default(true),
  maxLength: z.number().min(100).max(5000).default(1000)
});

type FormValues = z.infer<typeof formSchema>;

export default function YouTubeToText() {
  const [result, setResult] = useState<YouTubeToTextResponse | null>(null);
  const { toast } = useToast();
  
  const breadcrumbItems = [
    { label: "Beranda", path: "/" },
    { label: "Alat", path: "/tools" },
    { label: "YouTube to Text", path: "/tools/youtube-to-text", isActive: true }
  ];
  
  // Default form values
  const defaultValues: FormValues = {
    videoUrl: "",
    outputFormat: "transcript",
    language: "id",
    includeTimestamps: true,
    maxLength: 1000
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });
  
  // Mutation for YouTube to Text processing
  const mutation = useMutation({
    mutationFn: async (request: FormValues) => {
      const response = await youtubeToText({
        videoUrl: request.videoUrl,
        outputFormat: request.outputFormat,
        language: request.language,
        includeTimestamps: request.includeTimestamps,
        maxLength: request.maxLength
      });
      return response;
    },
    onSuccess: (data: YouTubeToTextResponse) => {
      setResult(data);
      toast({
        title: "Berhasil",
        description: "Konversi YouTube ke teks berhasil dilakukan",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Kesalahan",
        description: error.message || "Gagal mengkonversi YouTube ke teks. Silakan coba lagi",
      });
    }
  });
  
  // Form submit handler
  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };
  
  // Copy result to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Disalin",
      description: "Teks telah disalin ke clipboard",
    });
  };
  
  // Format labels
  const formatLabels = {
    transcript: "Transkrip",
    summary: "Ringkasan",
    article: "Artikel"
  };
  
  const languageLabels = {
    id: "Bahasa Indonesia",
    en: "English"
  };
  
  return (
    <div className="container mx-auto py-4 px-4 md:px-6">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="max-w-5xl mx-auto mt-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight">YouTube ke Teks</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Ubah video YouTube menjadi teks dengan mudah. Dapatkan transkrip, ringkasan, atau artikel dari video YouTube favorit Anda.
          </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-5">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Pengaturan Konversi</CardTitle>
              <CardDescription>
                Masukkan URL video YouTube dan pilih opsi konversi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Video YouTube</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Youtube className="h-5 w-5 text-muted-foreground" />
                            <Input 
                              placeholder="https://www.youtube.com/watch?v=..." 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Tempel URL video YouTube yang ingin dikonversi
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="outputFormat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Format Output</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih format output" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="transcript">
                              <div className="flex items-center">
                                <FileText className="mr-2 h-4 w-4" />
                                <span>Transkrip</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="summary">
                              <div className="flex items-center">
                                <FileSearch className="mr-2 h-4 w-4" />
                                <span>Ringkasan</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="article">
                              <div className="flex items-center">
                                <BookText className="mr-2 h-4 w-4" />
                                <span>Artikel</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {field.value === "transcript" && "Konversi menjadi transkrip lengkap dari video"}
                          {field.value === "summary" && "Konversi menjadi ringkasan singkat dari video"}
                          {field.value === "article" && "Konversi menjadi artikel yang terstruktur baik"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bahasa Output</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih bahasa" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="id">Bahasa Indonesia</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Pilih bahasa untuk teks hasil konversi
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch("outputFormat") === "transcript" && (
                    <FormField
                      control={form.control}
                      name="includeTimestamps"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Timestamp
                            </FormLabel>
                            <FormDescription>
                              Sertakan waktu (timestamp) pada transkrip
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
                  )}
                  
                  <FormField
                    control={form.control}
                    name="maxLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Panjang Maksimum (kata)</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <Slider
                              min={100}
                              max={5000}
                              step={100}
                              defaultValue={[field.value]}
                              onValueChange={(values) => field.onChange(values[0])}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>100</span>
                              <span>{field.value}</span>
                              <span>5000</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Batasi panjang output dalam jumlah kata
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Memproses..." : "Konversi YouTube ke Teks"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Hasil Konversi</span>
                {result && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => copyToClipboard(result.text)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Salin
                  </Button>
                )}
              </CardTitle>
              <CardDescription>
                {result?.title && (
                  <div className="flex flex-col gap-1 mt-2">
                    <span className="font-medium">{result.title}</span>
                    {result.channel && <span className="text-sm text-muted-foreground">Channel: {result.channel}</span>}
                    {result.duration && (
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> {result.duration}
                      </span>
                    )}
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mutation.isPending && (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-full" />
                </div>
              )}
              
              {mutation.isError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {mutation.error.message || "Gagal mengkonversi YouTube ke teks. Silakan coba lagi."}
                  </AlertDescription>
                </Alert>
              )}
              
              {!mutation.isPending && !mutation.isError && !result && (
                <div className="flex flex-col items-center justify-center h-[400px] text-center text-muted-foreground">
                  <Youtube className="h-16 w-16 mb-4 opacity-20" />
                  <p>
                    Masukkan URL video YouTube dan klik tombol Konversi untuk mendapatkan hasil.
                  </p>
                </div>
              )}
              
              {result && (
                <div>
                  <Tabs defaultValue="content" className="mt-2">
                    <TabsList className="mb-4">
                      <TabsTrigger value="content">
                        {formatLabels[form.getValues("outputFormat") as keyof typeof formatLabels]}
                      </TabsTrigger>
                      {result.keyPoints && result.keyPoints.length > 0 && (
                        <TabsTrigger value="keypoints">Poin Utama</TabsTrigger>
                      )}
                      {result.timestamps && result.timestamps.length > 0 && (
                        <TabsTrigger value="timestamps">Timestamp</TabsTrigger>
                      )}
                    </TabsList>
                    
                    <TabsContent value="content" className="mt-0">
                      <ScrollArea className="h-[400px] rounded-md border p-4">
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          {result.text.split("\n").map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    
                    {result.keyPoints && result.keyPoints.length > 0 && (
                      <TabsContent value="keypoints" className="mt-0">
                        <ScrollArea className="h-[400px] rounded-md border p-4">
                          <ul className="space-y-2">
                            {result.keyPoints.map((point, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="font-bold">{i + 1}.</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </ScrollArea>
                      </TabsContent>
                    )}
                    
                    {result.timestamps && result.timestamps.length > 0 && (
                      <TabsContent value="timestamps" className="mt-0">
                        <ScrollArea className="h-[400px] rounded-md border p-4">
                          <div className="space-y-4">
                            {result.timestamps.map((timestamp, i) => (
                              <div key={i} className="flex">
                                <div className="w-16 font-mono text-sm">{timestamp.time}</div>
                                <div className="flex-1">{timestamp.text}</div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                    )}
                  </Tabs>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href="/tools">
                <Button variant="outline">
                  Kembali ke Alat
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}