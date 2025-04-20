import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Calendar,
  Clock,
  FileText,
  List,
  MessageSquare,
  PanelLeft,
  RefreshCw,
  SendHorizontal,
  Stethoscope,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Breadcrumb from "@/components/Breadcrumb";
import { Message } from "@/lib/types";
import { healthConsultation } from "@/lib/geminiApi";
import { HealthConsultationRequest } from "@/lib/types";

// Daftar spesialisasi dokter
const medicalSpecialties = [
  {
    id: "umum",
    name: "Dokter Umum",
    icon: <User className="h-4 w-4 mr-2" />,
  },
  {
    id: "jantung",
    name: "Kardiologi",
    icon: <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>,
  },
  {
    id: "anak",
    name: "Pediatri",
    icon: <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12h6" />
      <path d="M11 18a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2z" />
      <path d="M15 10V6c0-1.1-.9-2-2-2H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10c0-1.1-.9-2-2-2h-6z" />
    </svg>,
  },
  {
    id: "tht",
    name: "THT",
    icon: <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 16a13.94 13.94 0 0 0 4 2c2 .56 4.24.56 7.46-2.53A13.94 13.94 0 0 0 16 13a14.31 14.31 0 0 0-.59-10.25A2.11 2.11 0 0 0 13.11 2h-2.22a2.11 2.11 0 0 0-2.3.75c-.4.65-.76 1.37-1.08 2.13" />
      <path d="M2 16c1.06.95 4.733 3.846 8 4 3.075.154 5-1 8-4" />
      <path d="M12.36 12a14.09 14.09 0 0 0-1.95-1.22c-2.25-1-4.54-.62-7.63 2.46" />
    </svg>,
  },
  {
    id: "kulit",
    name: "Dermatologi",
    icon: <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6c.5 0 .9.4.9.9v1.5c0 .8-1.1 1.1-1.7.6l-1-1c-.4-.4-.3-1 .1-1.3.4-.1.3-.3.8-.6l.9-.1Z" />
      <path d="M8 13c.5 0 .9.4.9.9v.2c0 .8-1.1 1.1-1.7.6l-1-1c-.4-.4-.3-1 .1-1.3.4-.1.3-.3.8-.6l.9 1.2Z" />
      <path d="M8 20c.5 0 .9.4.9.9v.2c0 .8-1.1 1.1-1.7.6l-1-1c-.4-.4-.3-1 .1-1.3.4-.3.7-.5 1.7-.4Z" />
      <path d="M16 6c-.5 0-.9.4-.9.9v1.5c0 .8 1.1 1.1 1.7.6l1-1c.4-.4.3-1-.1-1.3-.5-.3-.8-.6-1.7-.7Z" />
      <path d="M16 13c-.5 0-.9.4-.9.9v.2c0 .8 1.1 1.1 1.7.6l1-1c.4-.4.3-1-.1-1.3-.5-.3-.8-.5-1.7-.4Z" />
      <path d="M16 20c-.5 0-.9.4-.9.9v.2c0 .8 1.1 1.1 1.7.6l1-1c.4-.4.3-1-.1-1.3-.5-.3-.8-.5-1.7-.4Z" />
      <path d="M12 2v20" />
    </svg>,
  },
  {
    id: "otak",
    name: "Neurologi",
    icon: <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15.5 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 1 0 0-5z" />
      <path d="M20 13.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 1 0 0-5z" />
      <path d="M8.5 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 1 0 0-5z" />
      <path d="M4 13.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 1 0 0-5z" />
      <path d="M15.5 7c0 1.7-1.3 3-3 3S9.5 8.7 9.5 7s1.3-3 3-3 3 1.3 3 3z" />
      <path d="M15.5 17c0 1.7-1.3 3-3 3s-3-1.3-3-3 1.3-3 3-3 3 1.3 3 3z" />
      <path d="M8.5 7c-1.2 0-2 .5-3 1.5S3.9 10.8 4 13.5c.1 2.7 1 4.5 2.5 5.5 1.5.9 2.5 1 4 1" />
      <path d="M15.5 7c1.2 0 2 .5 3 1.5s1.6 2.3 1.5 5c-.1 2.7-1 4.5-2.5 5.5-1.5.9-2.5 1-4 1" />
    </svg>,
  },
];

// Pertanyaan yang sering diajukan
const frequentQuestions = [
  "Bagaimana cara mengatasi sakit kepala yang sering kambuh?",
  "Apa saja gejala umum Covid-19 varian terbaru?",
  "Berapa banyak air yang harus diminum setiap hari?",
  "Apa perbedaan antara flu biasa dan flu berat?",
  "Bagaimana cara menjaga kesehatan mental?",
  "Kapan harus memeriksakan diri ke dokter untuk batuk berkepanjangan?",
];

// Panduan untuk pasien
const patientGuides = [
  "Jelaskan gejala Anda secara spesifik (seperti jenis nyeri, lokasi, durasi).",
  "Sebutkan kapan gejala mulai terjadi dan apakah memburuk atau membaik.",
  "Beritahu riwayat medis yang relevan (kondisi kronis, alergi, obat).",
  "Tanyakan tentang pilihan pengobatan, efek samping, dan alternatif.",
  "Jangan ragu untuk mengajukan pertanyaan lanjutan untuk klarifikasi.",
];

export default function KonsultasiKesehatan() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Halo, saya Dokter AI yang siap membantu. Silakan ajukan pertanyaan kesehatan Anda, dan saya akan memberikan informasi berdasarkan pengetahuan medis terkini. Perlu diingat bahwa konsultasi ini tidak menggantikan pemeriksaan dokter langsung."
    }
  ]);
  
  const [currentMessage, setCurrentMessage] = useState("");
  const [specialty, setSpecialty] = useState("umum");

  const { toast } = useToast();

  // Menggunakan API Gemini untuk konsultasi kesehatan
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      // Membangun konteks berdasarkan percakapan sebelumnya
      // Ambil 5 pesan terakhir untuk konteks (tidak termasuk pesan selamat datang)
      const recentMessages = messages.slice(1).slice(-5);
      
      // Ekstrak gejala dari pesan pengguna sebelumnya
      const previousSymptoms = recentMessages
        .filter(msg => msg.role === "user")
        .map(msg => msg.content);
      
      // Ekstrak konteks medis jika ada (dalam implementasi lengkap akan diambil dari profil pengguna)
      const context = {
        previousSymptoms: previousSymptoms.length > 0 ? previousSymptoms : undefined
      };
      
      // Kirim pesan untuk konsultasi
      const request: HealthConsultationRequest = {
        message,
        context
      };
      
      return await healthConsultation(request);
    },
    onSuccess: (data) => {
      // Tambahkan pesan AI ke dalam riwayat percakapan
      // Cek jika data atau data.response ada
      const responseText = typeof data === 'object' && data !== null
        ? (typeof data.response === 'string' 
           ? data.response 
           : (data.response as any)?.response || "Maaf, terjadi kesalahan dalam memproses respons.")
        : "Maaf, terjadi kesalahan dalam memproses respons.";
        
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: responseText },
      ]);
    },
    onError: () => {
      toast({
        title: "Gagal Mengirim Pesan",
        description: "Terjadi kesalahan saat menghubungi dokter AI. Silakan coba lagi.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!currentMessage.trim()) {
      toast({
        title: "Pesan Kosong",
        description: "Silakan masukkan pertanyaan Anda terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    // Tambahkan pesan pengguna ke dalam riwayat percakapan
    const newUserMessage: Message = {
      role: "user",
      content: currentMessage.trim(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setCurrentMessage("");

    // Kirim pesan ke API
    sendMessageMutation.mutate(currentMessage);
  };

  const handleQuickQuestion = (question: string) => {
    // Set pesan dan langsung kirim
    setCurrentMessage(question);
    
    // Tambahkan pesan pengguna ke dalam riwayat percakapan
    const newUserMessage: Message = {
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    
    // Kosongkan input dan kirim pesan
    setCurrentMessage("");
    sendMessageMutation.mutate(question);
  };

  const handleSpecialtyChange = (value: string) => {
    setSpecialty(value);
    
    // Tambahkan pesan sistem saat mengganti spesialisasi
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `Anda sekarang berkonsultasi dengan ${medicalSpecialties.find(s => s.id === value)?.name || 'Dokter Umum'}. Silakan ajukan pertanyaan Anda.`
      },
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-0">
      <Breadcrumb 
        items={[
          { label: "Tools", path: "/tools" },
          { label: "Konsultasi Kesehatan", path: "/tools/konsultasi-kesehatan", isActive: true }
        ]} 
      />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
          <Stethoscope className="text-green-600 mr-2" /> 
          Konsultasi Kesehatan
        </h1>
        <p className="text-gray-600 mt-2">
          Tanyakan informasi kesehatan dan dapatkan saran dari dokter AI kami
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Informasi */}
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <Tabs defaultValue="specialty">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="specialty">
                    <User className="h-4 w-4 mr-2" /> Spesialisasi
                  </TabsTrigger>
                  <TabsTrigger value="guide">
                    <List className="h-4 w-4 mr-2" /> Panduan
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="specialty" className="space-y-4">
                  <h3 className="font-medium text-gray-900 flex items-center mb-2">
                    <Users className="h-4 w-4 mr-2" /> Pilih Spesialisasi Dokter
                  </h3>
                  
                  <div className="space-y-2">
                    {medicalSpecialties.map((s) => (
                      <div 
                        key={s.id}
                        className={`p-2 rounded-md cursor-pointer flex items-center ${specialty === s.id ? 'bg-green-50 border border-green-200' : 'hover:bg-gray-50'}`}
                        onClick={() => handleSpecialtyChange(s.id)}
                      >
                        <div className={`${specialty === s.id ? 'text-green-600' : 'text-gray-600'}`}>
                          {s.icon}
                        </div>
                        <span className={`${specialty === s.id ? 'font-medium text-green-800' : 'text-gray-700'}`}>
                          {s.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <h3 className="font-medium text-gray-900 flex items-center mb-2">
                      <Clock className="h-4 w-4 mr-2" /> Riwayat Percakapan
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Percakapan Anda disimpan hanya selama sesi ini dan akan hilang saat halaman dimuat ulang.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="guide" className="space-y-4">
                  <h3 className="font-medium text-gray-900 flex items-center mb-2">
                    <FileText className="h-4 w-4 mr-2" /> Cara Berkonsultasi Efektif
                  </h3>
                  
                  <ul className="space-y-2">
                    {patientGuides.map((guide, i) => (
                      <li key={i} className="flex items-start">
                        <span className="bg-green-100 text-green-800 w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-gray-700 text-sm">{guide}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h3 className="font-medium text-gray-900 flex items-center mb-2">
                      <PanelLeft className="h-4 w-4 mr-2" /> Catatan Penting
                    </h3>
                    <p className="text-sm text-gray-700">
                      Dokter AI kami memberikan informasi umum untuk edukasi. Dalam keadaan darurat atau untuk diagnosis yang akurat, selalu konsultasikan dengan dokter atau tenaga medis nyata.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium text-gray-900 flex items-center mb-3">
                <Calendar className="h-4 w-4 mr-2" /> Pertanyaan Umum
              </h3>
              
              <div className="space-y-2">
                {frequentQuestions.map((question, i) => (
                  <div 
                    key={i}
                    className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
                    onClick={() => handleQuickQuestion(question)}
                  >
                    {question}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Area Konsultasi */}
        <div className="lg:col-span-2">
          <Card className="min-h-[600px] flex flex-col">
            <CardContent className="p-0 flex-grow flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Stethoscope className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {medicalSpecialties.find(s => s.id === specialty)?.name || 'Dokter Umum'}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Badge variant="outline" className="text-xs text-green-700 bg-green-50">Online</Badge>
                      <span className="ml-2">Siap Membantu</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Chat Area */}
              <div className="flex-grow p-4 overflow-y-auto flex flex-col space-y-4">
                {messages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-gray-100 text-gray-800 rounded-tl-none'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.content}</div>
                    </div>
                  </div>
                ))}
                
                {sendMessageMutation.isPending && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-800 rounded-tl-none">
                      <div className="flex items-center space-x-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Dokter AI sedang mengetik...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Textarea
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Ketik pertanyaan kesehatan Anda di sini..."
                    className="resize-none"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={sendMessageMutation.isPending || !currentMessage.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {sendMessageMutation.isPending ? (
                      <RefreshCw className="h-5 w-5 animate-spin" />
                    ) : (
                      <SendHorizontal className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Tekan Enter untuk mengirim, Shift + Enter untuk baris baru
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}