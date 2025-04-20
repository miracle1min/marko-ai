import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { 
  Send, Copy, Download, FileText, Clipboard, Mail, 
  CheckCircle2, Loader2, Plus, Trash2, Settings, AlertCircle 
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import AnimatedPage from "@/components/AnimatedPage";
import Breadcrumb from "@/components/Breadcrumb";

// Interface untuk tipe email
interface EmailTemplate {
  id: string;
  name: string;
  description: string;
}

// Interface untuk request pembuatan email
interface EmailGenerationRequest {
  prompt: string;
  emailType: string;
  recipient: string;
  subject: string;
  keyPoints: string[];
  tone: string;
  length: string;
  formalityLevel: number;
  includeSignature: boolean;
  language: string;
  additionalContext?: string;
}

// Interface untuk response dari API
interface EmailGenerationResponse {
  email: {
    subject: string;
    body: string;
  };
  alternatives?: {
    subject: string;
    body: string;
  }[];
}

export default function EmailGenerator() {
  const { toast } = useToast();
  const [form, setForm] = useState<EmailGenerationRequest>({
    prompt: "",
    emailType: "business",
    recipient: "",
    subject: "",
    keyPoints: [""],
    tone: "professional",
    length: "medium",
    formalityLevel: 7,
    includeSignature: true,
    language: "id",
    additionalContext: ""
  });
  
  const [generatedEmail, setGeneratedEmail] = useState<EmailGenerationResponse | null>(null);
  const [selectedEmailIndex, setSelectedEmailIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  // Data template email
  const emailTypes: EmailTemplate[] = [
    { id: "business", name: "Bisnis", description: "Email formal untuk komunikasi profesional" },
    { id: "networking", name: "Networking", description: "Email untuk membangun & menjaga koneksi profesional" },
    { id: "sales", name: "Penjualan", description: "Email persuasif untuk menawarkan produk atau layanan" },
    { id: "follow-up", name: "Follow-up", description: "Email lanjutan setelah pertemuan atau diskusi sebelumnya" },
    { id: "introduction", name: "Perkenalan", description: "Email untuk memperkenalkan diri atau orang lain" },
    { id: "request", name: "Permintaan", description: "Email untuk meminta informasi atau bantuan" },
    { id: "thank-you", name: "Ucapan Terima Kasih", description: "Email untuk mengekspresikan terima kasih" },
    { id: "invitation", name: "Undangan", description: "Email untuk mengundang ke acara atau pertemuan" },
    { id: "apology", name: "Permintaan Maaf", description: "Email untuk menyampaikan penyesalan atau permintaan maaf" },
    { id: "congratulation", name: "Ucapan Selamat", description: "Email untuk mengucapkan selamat atas pencapaian" },
  ];

  // Data tone email
  const toneOptions = [
    { value: "professional", label: "Profesional" },
    { value: "friendly", label: "Ramah" },
    { value: "enthusiastic", label: "Antusias" },
    { value: "formal", label: "Formal" },
    { value: "persuasive", label: "Persuasif" },
    { value: "urgent", label: "Mendesak" },
    { value: "respectful", label: "Hormat" },
    { value: "appreciative", label: "Apresiatif" },
    { value: "confident", label: "Percaya Diri" },
    { value: "empathetic", label: "Empatik" },
  ];

  // Data panjang email
  const lengthOptions = [
    { value: "short", label: "Pendek (~100 kata)" },
    { value: "medium", label: "Sedang (~200 kata)" },
    { value: "long", label: "Panjang (~300 kata)" },
  ];

  // Data bahasa
  const languageOptions = [
    { value: "id", label: "Bahasa Indonesia" },
    { value: "en", label: "English" },
    { value: "jw", label: "Bahasa Jawa" },
    { value: "su", label: "Bahasa Sunda" },
  ];

  // Mutation untuk generate email dengan AI
  const emailMutation = useMutation({
    mutationFn: async (data: EmailGenerationRequest) => {
      // Panggil API Gemini untuk menghasilkan email
      const response = await fetch('/api/gemini/generate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal membuat email');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedEmail(data);
      setSelectedEmailIndex(0);
      toast({
        title: "Email berhasil dibuat",
        description: "Email telah berhasil digenerate dan siap digunakan.",
      });
    },
    onError: () => {
      toast({
        title: "Gagal membuat email",
        description: "Terjadi kesalahan saat mencoba membuat email. Silakan coba lagi.",
        variant: "destructive"
      });
    }
  });

  // Handle form change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle select change
  const handleSelectChange = (value: string, name: keyof EmailGenerationRequest) => {
    setForm({ ...form, [name]: value });
  };

  // Handle key points change
  const handleKeyPointChange = (index: number, value: string) => {
    const newKeyPoints = [...form.keyPoints];
    newKeyPoints[index] = value;
    setForm({ ...form, keyPoints: newKeyPoints });
  };

  // Add new key point
  const addKeyPoint = () => {
    setForm({ ...form, keyPoints: [...form.keyPoints, ""] });
  };

  // Remove key point
  const removeKeyPoint = (index: number) => {
    const newKeyPoints = [...form.keyPoints];
    newKeyPoints.splice(index, 1);
    setForm({ ...form, keyPoints: newKeyPoints.length > 0 ? newKeyPoints : [""] });
  };

  // Generate email
  const generateEmail = () => {
    if (!form.prompt.trim()) {
      toast({
        title: "Mohon isi tujuan email",
        description: "Silakan isi tujuan email Anda untuk melanjutkan.",
        variant: "destructive"
      });
      return;
    }
    
    emailMutation.mutate(form);
  };

  // Copy email to clipboard
  const copyEmailToClipboard = () => {
    if (!generatedEmail) return;
    
    const emailText = getSelectedEmail().body;
    navigator.clipboard.writeText(emailText);
    
    setIsCopied(true);
    toast({
      title: "Email disalin",
      description: "Email telah disalin ke clipboard.",
    });
    
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Download email as text file
  const downloadAsTxt = () => {
    if (!generatedEmail) return;
    
    const emailText = getSelectedEmail().body;
    const blob = new Blob([emailText], { type: "text/plain;charset=utf-8" });
    
    saveAs(blob, `email-${new Date().toISOString().slice(0, 10)}.txt`);
    
    toast({
      title: "Email diunduh",
      description: "Email telah diunduh sebagai file text.",
    });
  };

  // Download email as PDF
  const downloadAsPdf = () => {
    if (!generatedEmail) return;
    
    const doc = new jsPDF();
    const emailSubject = getSelectedEmail().subject;
    const emailBody = getSelectedEmail().body;
    
    const splitTitle = doc.splitTextToSize(emailSubject, 180);
    const splitText = doc.splitTextToSize(emailBody, 180);
    
    doc.setFontSize(16);
    doc.text(splitTitle, 15, 20);
    
    doc.setFontSize(12);
    doc.text(splitText, 15, 40);
    
    doc.save(`email-${new Date().toISOString().slice(0, 10)}.pdf`);
    
    toast({
      title: "Email diunduh",
      description: "Email telah diunduh sebagai file PDF.",
    });
  };

  // Helper function to get selected email
  const getSelectedEmail = () => {
    if (!generatedEmail) {
      return { subject: "", body: "" };
    }
    
    if (selectedEmailIndex === 0) {
      return generatedEmail.email;
    }
    
    return generatedEmail.alternatives?.[selectedEmailIndex - 1] || generatedEmail.email;
  };

  // Reset form
  const resetForm = () => {
    setForm({
      prompt: "",
      emailType: "business",
      recipient: "",
      subject: "",
      keyPoints: [""],
      tone: "professional",
      length: "medium",
      formalityLevel: 7,
      includeSignature: true,
      language: "id",
      additionalContext: ""
    });
    setGeneratedEmail(null);
  };

  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <Breadcrumb 
          items={[
            { label: "Home", path: "/" },
            { label: "Tools", path: "/tools" },
            { label: "Email Generator", path: "/tools/email-generator", isActive: true }
          ]} 
        />
        
        <div className="flex flex-col space-y-2 mb-6">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Email Generator <Badge variant="outline" className="ml-2">AI</Badge>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Buat email profesional dengan mudah menggunakan AI canggih
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="prompt">Tujuan Email <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="prompt"
                      name="prompt"
                      placeholder="Contoh: Mengirim penawaran untuk proyek website ke calon klien"
                      rows={3}
                      value={form.prompt}
                      onChange={handleChange}
                      className="resize-none mt-1.5"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="emailType">Jenis Email</Label>
                    <Select
                      value={form.emailType}
                      onValueChange={(value) => handleSelectChange(value, "emailType")}
                    >
                      <SelectTrigger id="emailType" className="mt-1.5">
                        <SelectValue placeholder="Pilih jenis email" />
                      </SelectTrigger>
                      <SelectContent>
                        {emailTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            <div className="flex flex-col">
                              <span>{type.name}</span>
                              <span className="text-xs text-gray-500">{type.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="recipient">Penerima</Label>
                      <Input
                        id="recipient"
                        name="recipient"
                        placeholder="Nama penerima"
                        value={form.recipient}
                        onChange={handleChange}
                        className="mt-1.5"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="subject">Subjek (opsional)</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="Subjek email"
                        value={form.subject}
                        onChange={handleChange}
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Poin Penting</Label>
                    <div className="space-y-2 mt-1.5">
                      {form.keyPoints.map((point, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder={`Poin ${index + 1}`}
                            value={point}
                            onChange={(e) => handleKeyPointChange(index, e.target.value)}
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            type="button"
                            onClick={() => removeKeyPoint(index)}
                            disabled={form.keyPoints.length === 1 && !point}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={addKeyPoint}
                      >
                        <Plus className="h-4 w-4 mr-2" /> Tambah Poin
                      </Button>
                    </div>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="advanced-options">
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <Settings className="h-4 w-4 mr-2" />
                          <span>Pengaturan Lanjutan</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <div>
                            <Label htmlFor="tone">Nada Bahasa</Label>
                            <Select
                              value={form.tone}
                              onValueChange={(value) => handleSelectChange(value, "tone")}
                            >
                              <SelectTrigger id="tone" className="mt-1.5">
                                <SelectValue placeholder="Pilih nada bahasa" />
                              </SelectTrigger>
                              <SelectContent>
                                {toneOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="length">Panjang Email</Label>
                            <Select
                              value={form.length}
                              onValueChange={(value) => handleSelectChange(value, "length")}
                            >
                              <SelectTrigger id="length" className="mt-1.5">
                                <SelectValue placeholder="Pilih panjang email" />
                              </SelectTrigger>
                              <SelectContent>
                                {lengthOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="language">Bahasa</Label>
                            <Select
                              value={form.language}
                              onValueChange={(value) => handleSelectChange(value, "language")}
                            >
                              <SelectTrigger id="language" className="mt-1.5">
                                <SelectValue placeholder="Pilih bahasa" />
                              </SelectTrigger>
                              <SelectContent>
                                {languageOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1.5">
                              <Label htmlFor="formalityLevel">Tingkat Formalitas</Label>
                              <span className="text-sm text-gray-500">
                                {form.formalityLevel <= 3
                                  ? "Kasual"
                                  : form.formalityLevel <= 7
                                  ? "Normal"
                                  : "Sangat Formal"}
                              </span>
                            </div>
                            <Slider
                              id="formalityLevel"
                              min={1}
                              max={10}
                              step={1}
                              value={[form.formalityLevel]}
                              onValueChange={(value) =>
                                setForm({ ...form, formalityLevel: value[0] })
                              }
                              className="mt-1.5"
                            />
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="includeSignature"
                              checked={form.includeSignature}
                              onCheckedChange={(checked) =>
                                setForm({ ...form, includeSignature: checked })
                              }
                            />
                            <Label htmlFor="includeSignature">Sertakan tanda tangan</Label>
                          </div>
                          
                          <div>
                            <Label htmlFor="additionalContext">Konteks Tambahan (opsional)</Label>
                            <Textarea
                              id="additionalContext"
                              name="additionalContext"
                              placeholder="Tambahan informasi yang perlu dipertimbangkan"
                              rows={3}
                              value={form.additionalContext}
                              onChange={handleChange}
                              className="resize-none mt-1.5"
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      type="button"
                      onClick={generateEmail}
                      disabled={emailMutation.isPending}
                      className="flex-1"
                    >
                      {emailMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Membuat Email...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Buat Email
                        </>
                      )}
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          type="button" 
                          variant="outline"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reset formulir?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tindakan ini akan menghapus semua data yang telah Anda masukkan dan tidak dapat dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={resetForm}>Reset</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Result Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                {generatedEmail ? (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">Email yang Dihasilkan</h2>
                      <div className="flex gap-2">
                        <Button
                          onClick={copyEmailToClipboard}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          {isCopied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          <span>{isCopied ? "Disalin" : "Salin"}</span>
                        </Button>
                        
                        <Select
                          value="download"
                          onValueChange={(value) => {
                            if (value === "txt") downloadAsTxt();
                            if (value === "pdf") downloadAsPdf();
                          }}
                        >
                          <SelectTrigger className="w-[130px]">
                            <span className="flex items-center">
                              <Download className="h-4 w-4 mr-2" />
                              Unduh
                            </span>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="txt">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                Text (.txt)
                              </div>
                            </SelectItem>
                            <SelectItem value="pdf">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                PDF (.pdf)
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Tabs defaultValue="preview">
                      <TabsList className="w-full mb-4">
                        <TabsTrigger value="preview" className="flex-1">
                          Preview
                        </TabsTrigger>
                        <TabsTrigger value="variants" className="flex-1">
                          Variasi ({(generatedEmail.alternatives?.length || 0) + 1})
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="preview">
                        <div className="mb-2">
                          <Label className="text-sm text-gray-500">Subject:</Label>
                          <div className="font-medium">
                            {getSelectedEmail().subject}
                          </div>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <ScrollArea className="h-[400px] border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
                          <pre className="whitespace-pre-wrap font-sans">
                            {getSelectedEmail().body}
                          </pre>
                        </ScrollArea>
                      </TabsContent>
                      
                      <TabsContent value="variants">
                        <div className="grid grid-cols-1 gap-2">
                          <Button
                            variant={selectedEmailIndex === 0 ? "default" : "outline"}
                            className="justify-start h-auto py-2 px-4"
                            onClick={() => setSelectedEmailIndex(0)}
                          >
                            <div className="flex flex-col items-start">
                              <div className="font-medium">
                                {generatedEmail.email.subject}
                              </div>
                              <div className="text-sm truncate w-full">
                                {generatedEmail.email.body.split('\n')[0]}
                              </div>
                            </div>
                          </Button>
                          
                          {generatedEmail.alternatives?.map((alt, index) => (
                            <Button
                              key={index}
                              variant={selectedEmailIndex === index + 1 ? "default" : "outline"}
                              className="justify-start h-auto py-2 px-4"
                              onClick={() => setSelectedEmailIndex(index + 1)}
                            >
                              <div className="flex flex-col items-start">
                                <div className="font-medium">
                                  {alt.subject}
                                </div>
                                <div className="text-sm truncate w-full">
                                  {alt.body.split('\n')[0]}
                                </div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center">
                    <Mail className="h-16 w-16 mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold mb-2">Buat Email Profesional</h3>
                    <p className="text-gray-500 max-w-md mb-4">
                      Isi formulir di sebelah kiri dan klik "Buat Email" untuk menghasilkan email yang profesional 
                      dan sesuai dengan kebutuhan Anda.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-lg">
                      <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="rounded-full bg-primary/10 p-2 mb-2">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <h4 className="font-medium text-sm">Berbagai Jenis Email</h4>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="rounded-full bg-primary/10 p-2 mb-2">
                          <AlertCircle className="h-5 w-5 text-primary" />
                        </div>
                        <h4 className="font-medium text-sm">Mudah Disesuaikan</h4>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="rounded-full bg-primary/10 p-2 mb-2">
                          <Clipboard className="h-5 w-5 text-primary" />
                        </div>
                        <h4 className="font-medium text-sm">Eksport dengan Mudah</h4>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Tips Menulis Email yang Efektif</h2>
          <div className="space-y-3">
            <p className="flex items-start">
              <span className="inline-block bg-primary text-white rounded-full w-6 h-6 text-center mr-2 flex-shrink-0">1</span>
              <span>Tulis subjek yang jelas dan informatif untuk meningkatkan kemungkinan email Anda dibaca.</span>
            </p>
            <p className="flex items-start">
              <span className="inline-block bg-primary text-white rounded-full w-6 h-6 text-center mr-2 flex-shrink-0">2</span>
              <span>Gunakan sapaan yang tepat dan sesuaikan nada email dengan hubungan Anda dengan penerima.</span>
            </p>
            <p className="flex items-start">
              <span className="inline-block bg-primary text-white rounded-full w-6 h-6 text-center mr-2 flex-shrink-0">3</span>
              <span>Tetap singkat dan fokus pada pesan utama; hindari paragraf panjang yang sulit dibaca.</span>
            </p>
            <p className="flex items-start">
              <span className="inline-block bg-primary text-white rounded-full w-6 h-6 text-center mr-2 flex-shrink-0">4</span>
              <span>Tutup email dengan ajakan bertindak yang jelas dan tanda tangan profesional.</span>
            </p>
            <p className="flex items-start">
              <span className="inline-block bg-primary text-white rounded-full w-6 h-6 text-center mr-2 flex-shrink-0">5</span>
              <span>Periksa ulang tata bahasa, ejaan, dan format sebelum mengirim email Anda.</span>
            </p>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}