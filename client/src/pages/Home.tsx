import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ChevronRight, BrainCircuit, PencilRuler, Code, Globe, BookOpen, Sparkles, MessageSquare, FileCode, Newspaper, FileText, Palette, PenTool, School, Stethoscope, Bot, TextQuote, MoveRight, GraduationCap } from "lucide-react";

export default function Home() {
  // Daftar fitur sederhana dalam Bahasa Indonesia
  const features = [
    {
      icon: <BrainCircuit className="h-8 w-8 text-white/80" />,
      title: "Asisten AI",
      description: "Dapatkan jawaban instan untuk pertanyaan Anda dengan sistem AI canggih kami."
    },
    {
      icon: <PencilRuler className="h-8 w-8 text-white/80" />,
      title: "Pembuatan Konten",
      description: "Hasilkan artikel berkualitas tinggi, naskah pemasaran, dan konten kreatif."
    },
    {
      icon: <Code className="h-8 w-8 text-white/80" />,
      title: "Pembuatan Kode",
      description: "Tulis, perbaiki bug, dan optimalkan kode dalam berbagai bahasa pemrograman."
    },
    {
      icon: <Globe className="h-8 w-8 text-white/80" />,
      title: "Dukungan Multi Bahasa",
      description: "Berkomunikasi dalam berbagai bahasa dengan terjemahan akurat dan nuansa budaya."
    },
    {
      icon: <BookOpen className="h-8 w-8 text-white/80" />,
      title: "Alat Pendidikan",
      description: "Buat materi belajar, penjelasan, dan konten pendidikan dengan mudah."
    }
  ];
  
  // Daftar kategori tools dengan icon dan rute
  const toolCategories = [
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: "Chatbot AI",
      route: "/chat"
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Pembuat Konten",
      route: "/tools/gemini-konten"
    },
    {
      icon: <Newspaper className="h-5 w-5" />,
      title: "Generator SEO",
      route: "/tools/seo-optimizer"
    },
    {
      icon: <FileCode className="h-5 w-5" />,
      title: "Coding Assistant",
      route: "/tools/code-generator"
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "Pembuat Gambar",
      route: "/tools/image-generator"
    },
    {
      icon: <Palette className="h-5 w-5" />,
      title: "Post Facebook",
      route: "/tools/facebook-post"
    },
    {
      icon: <TextQuote className="h-5 w-5" />,
      title: "Caption Instagram",
      route: "/tools/instagram-caption"
    },
    {
      icon: <Bot className="h-5 w-5" />,
      title: "Chat Generator",
      route: "/tools/fake-chat-generator"
    },
    {
      icon: <PenTool className="h-5 w-5" />,
      title: "Thread Twitter",
      route: "/tools/twitter-thread"
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: "AI Translator",
      route: "/tools/ai-translator"
    },
    {
      icon: <Stethoscope className="h-5 w-5" />,
      title: "Konsultasi Kesehatan",
      route: "/tools/konsultasi-kesehatan"
    },
    {
      icon: <GraduationCap className="h-5 w-5" />,
      title: "Ringkasan Buku",
      route: "/tools/ringkasan-buku"
    },
    {
      icon: <School className="h-5 w-5" />,
      title: "Penjelasan Materi",
      route: "/tools/penjelasan-materi"
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "CV & Resume",
      route: "/tools/cv-resume-builder"
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Email Generator",
      route: "/tools/email-generator"
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Kontrak Generator",
      route: "/tools/contract-generator"
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-[#1A2136] text-white">
      <main>
        <Hero />
        
        {/* Features section */}
        <section className="py-16 bg-[#1A2136] border-t border-[#2D3653]/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                AI Asisten terbaik untuk kebutuhan Anda
              </h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Marko AI dirancang untuk membantu segala kebutuhan Anda dengan memberikan solusi cepat dan akurat dalam berbagai tugas.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-[#111827] p-6 rounded-lg border border-[#2D3653] hover:border-[#3B4773] transition-all">
                  <div className="p-3 mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <Link href="/tools">
                <Button className="bg-transparent hover:bg-[#283352]/50 text-white border border-[#2D3653] rounded-full px-8 py-6 text-lg">
                  Jelajahi Semua Alat
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Example usage section */}
        <section className="py-14 bg-[#111827]/90 border-t border-[#2D3653]/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Kemungkinan tanpa batas
              </h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Dari menjawab pertanyaan kompleks hingga menghasilkan konten kreatif, Marko AI akan membantu semua kebutuhan Anda.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
              <div className="p-6 rounded-lg border border-[#2D3653] bg-gradient-to-br from-[#1A2136] to-[#283352]/80 hover:border-[#3B4773] transition-all">
                <h3 className="text-xl font-bold text-white mb-3">Tanyakan apa saja</h3>
                <p className="text-gray-400 mb-4">Dapatkan penjelasan detail tentang topik kompleks, ide kreatif, atau sekadar mengobrol tentang minat Anda.</p>
                <Link href="/chat">
                  <Button variant="ghost" className="text-white hover:bg-[#283352]/50 group">
                    Coba Chat <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              
              <div className="p-6 rounded-lg border border-[#2D3653] bg-gradient-to-br from-[#1A2136] to-[#283352]/80 hover:border-[#3B4773] transition-all">
                <h3 className="text-xl font-bold text-white mb-3">Buat konten</h3>
                <p className="text-gray-400 mb-4">Hasilkan artikel, postingan media sosial, konten marketing, dan konten kreatif lainnya dalam hitungan detik.</p>
                <Link href="/tools/content-generator">
                  <Button variant="ghost" className="text-white hover:bg-[#283352]/50 group">
                    Coba Generator Konten <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Tools Categories Grid */}
        <section className="py-14 bg-[#1A2136] border-t border-[#2D3653]/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-3">
                Alat-alat AI Kami
              </h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Pilih dari berbagai alat AI kami yang dirancang untuk membantu tugas spesifik Anda
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {toolCategories.map((tool, index) => (
                <Link key={index} href={tool.route}>
                  <div className="bg-[#111827] p-4 rounded-lg border border-[#2D3653] hover:border-[#3B4773] hover:bg-[#1e293b] transition-all flex items-center gap-3 h-full">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#283352]">
                      <div className="text-white">{tool.icon}</div>
                    </div>
                    <span className="text-sm font-medium text-white">{tool.title}</span>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <Link href="/tools">
                <Button variant="outline" className="bg-transparent text-white hover:bg-[#283352]/50 border border-[#2D3653] rounded-lg px-6 py-2 flex items-center gap-2">
                  Lihat semua tools <MoveRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-14 bg-[#1A2136] text-white border-t border-[#2D3653]/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Rasakan kekuatan Marko AI sekarang
            </h2>
            <p className="text-xl text-gray-400 mb-6">
              Bergabung dengan ribuan pengguna yang telah meningkatkan produktivitas mereka dengan Marko AI.
            </p>
            <Link href="/chat">
              <Button size="lg" className="bg-transparent hover:bg-[#283352]/50 text-white border border-[#2D3653] rounded-full px-8 py-6 text-lg">
                Mulai Sekarang
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
