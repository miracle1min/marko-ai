import { Link } from "wouter";
import React, { useState, useEffect } from "react";
import { 
  MessagesSquare, MessageSquare, PenLine, Instagram, Facebook, Youtube, 
  User, Code, GraduationCap, Stethoscope, 
  ArrowRight, Image, FileText, Video, Music, 
  Search, Tag, Sparkles, Zap, Mail, Globe, ChefHat,
  X, FolderSearch, Smartphone, Download, Languages, Shield, 
  Briefcase, BarChart, PieChart, Calculator, QrCode
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";

// Tool Category interface
interface ToolGroup {
  name: string;
  icon: React.ReactNode;
  tools: Tool[];
}

interface Tool {
  name: string;
  icon: React.ReactNode;
  description: string;
  path: string;
  isNew?: boolean;
  isPopular?: boolean;
  bgColor: string;
}

// Extended tool interface for search results
interface SearchResultTool extends Tool {
  category: string;
  categoryIcon: React.ReactNode;
}

export default function Tools() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  // Parse URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    if (category) {
      setCategoryFilter(category);
      // Set active tab to "all" since we're filtering by category
      setActiveTab("all"); 
    }
  }, []);
  
  // Definisikan toolGroups terlebih dahulu
  const toolGroups: ToolGroup[] = [
    {
      name: "Alat Utilitas",
      icon: <Globe className="h-5 w-5" />,
      tools: [
        {
          name: "QR Code Generator",
          icon: <Code className="h-5 w-5" />,
          description: "Buat QR code untuk URL, teks, kontak, WiFi, dan lainnya dengan mudah dan kustomisasi",
          path: "/tools/qr-code-generator",
          isNew: true,
          isPopular: true,
          bgColor: "bg-gradient-to-br from-emerald-500 to-cyan-600"
        },
        {
          name: "AI Translator",
          icon: <Globe className="h-5 w-5" />,
          description: "Terjemahkan teks ke lebih dari 30 bahasa berbeda dengan cepat dan akurat",
          path: "/tools/ai-translator",
          isNew: true,
          isPopular: true,
          bgColor: "bg-gradient-to-br from-blue-600 to-blue-800"
        },
        {
          name: "Base64 Encoder/Decoder",
          icon: <Code className="h-5 w-5" />,
          description: "Konversi teks atau file ke format Base64 dan sebaliknya secara instan",
          path: "/tools/base64",
          isNew: true,
          bgColor: "bg-gradient-to-br from-purple-600 to-indigo-700"
        },
      ]
    },
    {
      name: "Sosial Media",
      icon: <MessagesSquare className="h-5 w-5" />,
      tools: [
        {
          name: "Fake Chat Generator",
          icon: <MessagesSquare className="h-5 w-5" />,
          description: "Buat screenshot chat palsu untuk WhatsApp, Facebook, Instagram, Telegram, dan lainnya",
          path: "/tools/fake-chat-generator",
          isNew: true,
          isPopular: true,
          bgColor: "bg-gradient-to-br from-green-500 to-teal-600"
        },
        {
          name: "Email Generator",
          icon: <Mail className="h-5 w-5" />,
          description: "Buat email profesional yang menarik untuk berbagai kebutuhan",
          path: "/tools/email-generator",
          isNew: true,
          isPopular: true,
          bgColor: "bg-gradient-to-br from-orange-500 to-amber-600"
        },
        {
          name: "Instagram Caption Generator",
          icon: <Instagram className="h-5 w-5" />,
          description: "Buat caption Instagram yang menarik untuk meningkatkan engagement",
          path: "/tools/instagram-caption",
          isNew: true,
          bgColor: "bg-gradient-to-br from-pink-500 to-purple-500"
        },
        {
          name: "Facebook Post Creator",
          icon: <Facebook className="h-5 w-5" />,
          description: "Buat konten Facebook yang viral dan menarik banyak interaksi",
          path: "/tools/facebook-post",
          bgColor: "bg-gradient-to-br from-blue-500 to-blue-600"
        },
        {
          name: "YouTube Script Generator",
          icon: <Youtube className="h-5 w-5" />,
          description: "Hasilkan script video YouTube yang mengikat penonton dari awal hingga akhir",
          path: "/tools/youtube-script",
          isPopular: true,
          bgColor: "bg-gradient-to-br from-red-500 to-red-600"
        },
        {
          name: "Twitter Thread Creator",
          icon: <X className="h-5 w-5" />,
          description: "Buat thread Twitter yang informatif dan mudah dibagikan",
          path: "/tools/twitter-thread",
          bgColor: "bg-gradient-to-br from-blue-400 to-blue-500"
        }
      ]
    },
    {
      name: "Tanya Dokter AI",
      icon: <Stethoscope className="h-5 w-5" />,
      tools: [
        {
          name: "Konsultasi Kesehatan",
          icon: <Stethoscope className="h-5 w-5" />,
          description: "Dapatkan informasi kesehatan umum dari AI dokter kami",
          path: "/tools/konsultasi-kesehatan",
          isNew: true,
          bgColor: "bg-gradient-to-br from-green-500 to-emerald-600"
        },
        {
          name: "Analisis Gejala",
          icon: <User className="h-5 w-5" />,
          description: "Analisis gejala yang Anda alami dan dapatkan informasi awal",
          path: "/tools/analisis-gejala",
          bgColor: "bg-gradient-to-br from-blue-500 to-cyan-600"
        },
        {
          name: "Tips Hidup Sehat",
          icon: <User className="h-5 w-5" />,
          description: "Dapatkan tips dan saran untuk gaya hidup sehat sehari-hari",
          path: "/tools/tips-sehat",
          bgColor: "bg-gradient-to-br from-indigo-500 to-purple-600"
        }
      ]
    },
    {
      name: "Tanya Coding AI",
      icon: <Code className="h-5 w-5" />,
      tools: [
        {
          name: "Live Editor Pro",
          icon: <div className="flex gap-1"><Code className="h-5 w-5" /><Zap className="h-5 w-5" /></div>,
          description: "Editor kode interaktif dengan preview real-time untuk HTML, CSS, JS, dan 30+ bahasa pemrograman lainnya",
          path: "/tools/live-editor",
          isNew: true,
          isPopular: true,
          bgColor: "bg-gradient-to-br from-violet-600 to-indigo-800"
        },
        {
          name: "Code Debugger",
          icon: <Code className="h-5 w-5" />,
          description: "Bantu menemukan dan memperbaiki bug dalam kode Anda",
          path: "/tools/code-debugger",
          isPopular: true,
          bgColor: "bg-gradient-to-br from-gray-700 to-gray-900"
        },
        {
          name: "Code Generator",
          icon: <Code className="h-5 w-5" />,
          description: "Buat snippet kode untuk berbagai bahasa pemrograman",
          path: "/tools/code-generator",
          bgColor: "bg-gradient-to-br from-blue-700 to-blue-900"
        },
        {
          name: "Code Optimizer",
          icon: <Zap className="h-5 w-5" />,
          description: "Optimalkan kode yang sudah ada untuk performa lebih baik",
          path: "/tools/code-optimizer",
          isNew: true,
          bgColor: "bg-gradient-to-br from-emerald-700 to-emerald-900"
        },
        {
          name: "Code Review Assistant",
          icon: <Code className="h-5 w-5" />,
          description: "Analisis kode untuk menemukan masalah kualitas, keamanan, dan best practices",
          path: "/tools/code-review-assistant",
          isNew: true,
          isPopular: true,
          bgColor: "bg-gradient-to-br from-indigo-600 to-indigo-900"
        }
      ]
    },
    {
      name: "Tanya Guru AI",
      icon: <GraduationCap className="h-5 w-5" />,
      tools: [
        {
          name: "Penjelasan Materi Pelajaran",
          icon: <GraduationCap className="h-5 w-5" />,
          description: "Dapatkan penjelasan detail tentang topik pelajaran apa saja",
          path: "/tools/penjelasan-materi",
          bgColor: "bg-gradient-to-br from-yellow-500 to-orange-600"
        },
        {
          name: "Pembuatan Soal",
          icon: <FileText className="h-5 w-5" />,
          description: "Buat berbagai jenis soal latihan untuk belajar",
          path: "/tools/pembuatan-soal",
          isPopular: true,
          bgColor: "bg-gradient-to-br from-pink-600 to-rose-700"
        },
        {
          name: "Ringkasan Buku",
          icon: <FileText className="h-5 w-5" />,
          description: "Dapatkan ringkasan dari berbagai buku pelajaran",
          path: "/tools/ringkasan-buku",
          bgColor: "bg-gradient-to-br from-purple-600 to-indigo-700"
        },
        {
          name: "CV Resume Builder",
          icon: <FileText className="h-5 w-5" />,
          description: "Buat CV profesional dengan mudah dan ekspor ke PDF",
          path: "/tools/cv-resume-builder",
          isNew: true,
          isPopular: true,
          bgColor: "bg-gradient-to-br from-blue-600 to-indigo-800"
        }
      ]
    },
    {
      name: "Content Creator",
      icon: <PenLine className="h-5 w-5" />,
      tools: [
        {
          name: "GEMINI KONTEN GENERATOR",
          icon: <Sparkles className="h-5 w-5" />,
          description: "Buat artikel berkualitas tinggi secara instan dengan AI terbaru",
          path: "/tools/gemini-konten",
          isNew: true,
          isPopular: true,
          bgColor: "bg-gradient-to-br from-blue-500 to-blue-700"
        },
        {
          name: "Image Generator",
          icon: <Image className="h-5 w-5" />,
          description: "Buat gambar dari teks deskripsi menggunakan AI Imagen 3.0",
          path: "/tools/image-generator",
          isNew: true,
          isPopular: true,
          bgColor: "bg-gradient-to-br from-purple-500 to-purple-700"
        },
        {
          name: "Video Script",
          icon: <Video className="h-5 w-5" />,
          description: "Buat script untuk video berdasarkan topik pilihan",
          path: "/tools/video-script",
          bgColor: "bg-gradient-to-br from-red-500 to-red-700"
        },
        {
          name: "Jingle Creator",
          icon: <Music className="h-5 w-5" />,
          description: "Buat jingle untuk brand atau iklan Anda",
          path: "/tools/jingle-creator",
          isNew: true,
          bgColor: "bg-gradient-to-br from-green-500 to-green-700"
        }
      ]
    },
    {
      name: "Food & Recipe",
      icon: <ChefHat className="h-5 w-5" />,
      tools: [
        {
          name: "AI Resep Creator",
          icon: <ChefHat className="h-5 w-5" />,
          description: "Buat berbagai resep masakan dengan bantuan AI berdasarkan bahan yang tersedia",
          path: "/tools/resep-creator",
          isNew: true,
          isPopular: true,
          bgColor: "bg-gradient-to-br from-amber-500 to-amber-700"
        },
      ]
    },
    {
      name: "Business & Finance",
      icon: <BarChart className="h-5 w-5" />,
      tools: [
        {
          name: "Business Plan Generator",
          icon: <Briefcase className="h-5 w-5" />,
          description: "Buat rencana bisnis lengkap dengan analisis pasar, kompetitor, dan proyeksi keuangan",
          path: "/tools/business-plan-generator",
          isNew: true,
          isPopular: true,
          bgColor: "bg-gradient-to-br from-blue-600 to-blue-900"
        },
        {
          name: "Financial Calculator",
          icon: <Calculator className="h-5 w-5" />,
          description: "Hitung ROI, Break Even Point, Profit Margin, dan metrik keuangan bisnis lainnya",
          path: "/tools/financial-calculator",
          isNew: true,
          isPopular: true,
          bgColor: "bg-gradient-to-br from-green-600 to-green-900"
        },
        {
          name: "Contract Generator",
          icon: <FileText className="h-5 w-5" />,
          description: "Buat draft kontrak dan perjanjian hukum dengan mudah dan cepat menggunakan AI",
          path: "/tools/contract-generator",
          isNew: true,
          isPopular: true,
          bgColor: "bg-gradient-to-br from-purple-600 to-indigo-800"
        },
      ]
    },
    {
      name: "SEO Tools",
      icon: <Search className="h-5 w-5" />,
      tools: [
        {
          name: "Keyword Research",
          icon: <Tag className="h-5 w-5" />,
          description: "Temukan keyword potensial untuk konten Anda",
          path: "/tools/keyword-research",
          isPopular: true,
          bgColor: "bg-gradient-to-br from-amber-500 to-amber-700"
        },
        {
          name: "People Also Ask",
          icon: <Search className="h-5 w-5" />,
          description: "Temukan pertanyaan terkait yang sering dicari orang",
          path: "/tools/people-also-ask",
          isNew: true,
          isPopular: true,
          bgColor: "bg-gradient-to-br from-purple-500 to-blue-600"
        },
        {
          name: "Rich Snippet Creator",
          icon: <Code className="h-5 w-5" />,
          description: "Buat schema markup untuk meningkatkan tampilan di hasil pencarian Google",
          path: "/tools/rich-snippet-creator",
          isNew: true,
          isPopular: true,
          bgColor: "bg-gradient-to-br from-blue-500 to-indigo-700"
        },
        {
          name: "Auto Index Artikel",
          icon: <Globe className="h-5 w-5" />,
          description: "Indeks artikel Anda secara otomatis ke Google Search dengan API key Google",
          path: "/tools/auto-index-artikel",
          isNew: true,
          isPopular: true,
          bgColor: "bg-gradient-to-br from-green-600 to-blue-800"
        },
        {
          name: "SEO Content Optimizer",
          icon: <FileText className="h-5 w-5" />,
          description: "Optimalkan konten Anda untuk mesin pencari",
          path: "/tools/seo-optimizer",
          bgColor: "bg-gradient-to-br from-teal-500 to-teal-700"
        },
        {
          name: "Meta Description Generator",
          icon: <Tag className="h-5 w-5" />,
          description: "Buat meta description yang menarik dan optimal untuk SEO",
          path: "/tools/meta-description",
          bgColor: "bg-gradient-to-br from-cyan-500 to-cyan-700"
        }
      ]
    }
  ];
  
  // Fungsi untuk mencari tool berdasarkan keyword
  const searchTools = () => {
    if (!searchTerm.trim()) return [];
    
    const searchTermLower = searchTerm.toLowerCase();
    const results = toolGroups.flatMap(group => {
      // Mencari berdasarkan nama kategori
      if (group.name.toLowerCase().includes(searchTermLower)) {
        return group.tools.map(tool => ({
          ...tool,
          category: group.name,
          categoryIcon: group.icon
        }));
      }
      
      // Mencari berdasarkan nama tool atau deskripsi
      return group.tools
        .filter(tool => 
          tool.name.toLowerCase().includes(searchTermLower) || 
          tool.description.toLowerCase().includes(searchTermLower)
        )
        .map(tool => ({
          ...tool,
          category: group.name,
          categoryIcon: group.icon
        }));
    });
    
    return results;
  };
  
  // Set hasil pencarian
  const searchResults = searchTools();
  
  // Efek untuk mengubah tab ke hasil pencarian jika pencarian aktif
  useEffect(() => {
    if (searchTerm.trim()) {
      setActiveTab("search-results");
    } else if (activeTab === "search-results") {
      setActiveTab("all");
    }
  }, [searchTerm, activeTab]);

  return (
    <div className="flex flex-col min-h-screen dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-0 w-full">
        <Breadcrumb 
          items={[
            { label: "Tools", path: "/tools", isActive: !categoryFilter },
            ...(categoryFilter ? [{ label: categoryFilter, path: `/tools?category=${encodeURIComponent(categoryFilter)}`, isActive: true }] : [])
          ]} 
        />
        <div className="text-center mb-6 mt-4">
          <h1 className="text-3xl font-bold mb-2 dark:text-slate-50">Tools Gratis Marko AI</h1>
          <p className="text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
            Kumpulan tools AI canggih gratis untuk berbagai kebutuhan Anda. Dari pembuatan konten hingga analisis SEO, semua tersedia di sini.
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Cari tools atau kategori..."
              className="pl-10 pr-10 py-2 border rounded-full focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
          <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-2 md:grid-cols-4 h-auto">
            <TabsTrigger value="all" className="py-2">Semua Tools</TabsTrigger>
            <TabsTrigger value="new" className="py-2">Terbaru</TabsTrigger>
            <TabsTrigger value="popular" className="py-2">Populer</TabsTrigger>
            <TabsTrigger value="free" className="py-2">Gratis</TabsTrigger>
            {searchTerm && searchResults.length > 0 && (
              <TabsTrigger value="search-results" className="py-2 md:col-span-4 bg-blue-100 dark:bg-blue-900">
                Hasil Pencarian ({searchResults.length})
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="all" className="mt-8">
            {toolGroups
              // Filter groups based on category filter if applied
              .filter(group => categoryFilter ? group.name === categoryFilter : true)
              .map((group, groupIndex) => (
                <div key={groupIndex} className="mb-12">
                  <div className="flex items-center mb-4">
                    <div className="bg-gray-100 p-2 rounded-lg mr-3 dark:bg-slate-700">
                      {group.icon}
                    </div>
                    <h2 className="text-xl font-bold dark:text-slate-100">{group.name}</h2>
                    {categoryFilter && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        onClick={() => {
                          setCategoryFilter(null);
                          window.history.pushState({}, '', '/tools');
                        }}
                      >
                        Tampilkan Semua Kategori
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {group.tools.map((tool, toolIndex) => (
                    <a key={toolIndex} href={tool.path} className="h-full no-underline">
                      <div className="h-full">
                        <Card className="h-full hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
                          <CardContent className="p-0 card-content">
                            <div className={`${tool.bgColor} text-white p-4`}>
                              <div className="flex justify-between items-start">
                                <div className="rounded-full bg-white/20 p-2">
                                  {tool.icon}
                                </div>
                                <div>
                                  {tool.isNew && (
                                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                      Baru
                                    </span>
                                  )}
                                  {tool.isPopular && (
                                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 ml-2">
                                      Populer
                                    </span>
                                  )}
                                </div>
                              </div>
                              <h3 className="text-lg font-semibold mt-3 text-white">{tool.name}</h3>
                            </div>
                            <div className="p-4 dark:bg-slate-800">
                              <p className="text-gray-600 dark:text-slate-300 text-sm mb-4">{tool.description}</p>
                              <Button variant="ghost" size="sm" className="w-full justify-between dark:text-slate-200 dark:hover:bg-slate-700">
                                Gunakan Tool <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="new" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {toolGroups.flatMap(group => 
                group.tools.filter(tool => tool.isNew).map((tool, toolIndex) => (
                  <a key={toolIndex} href={tool.path} className="h-full no-underline">
                    <div className="h-full">
                      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
                        <CardContent className="p-0">
                          <div className={`${tool.bgColor} text-white p-4`}>
                            <div className="flex justify-between items-start">
                              <div className="rounded-full bg-white/20 p-2">
                                {tool.icon}
                              </div>
                              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                Baru
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold mt-3 text-white">{tool.name}</h3>
                          </div>
                          <div className="p-4">
                            <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                            <Button variant="ghost" size="sm" className="w-full justify-between">
                              Gunakan Tool <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </a>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="popular" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {toolGroups.flatMap(group => 
                group.tools.filter(tool => tool.isPopular).map((tool, toolIndex) => (
                  <a key={toolIndex} href={tool.path} className="h-full no-underline">
                    <div className="h-full">
                      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
                        <CardContent className="p-0">
                          <div className={`${tool.bgColor} text-white p-4`}>
                            <div className="flex justify-between items-start">
                              <div className="rounded-full bg-white/20 p-2">
                                {tool.icon}
                              </div>
                              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                Populer
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold mt-3 text-white">{tool.name}</h3>
                          </div>
                          <div className="p-4">
                            <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                            <Button variant="ghost" size="sm" className="w-full justify-between">
                              Gunakan Tool <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </a>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="free" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {toolGroups.flatMap(group => 
                group.tools.slice(0, 2).map((tool, toolIndex) => (
                  <a key={toolIndex} href={tool.path} className="h-full no-underline">
                    <div className="h-full">
                      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
                        <CardContent className="p-0">
                          <div className={`${tool.bgColor} text-white p-4`}>
                            <div className="flex justify-between items-start">
                              <div className="rounded-full bg-white/20 p-2">
                                {tool.icon}
                              </div>
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                Gratis
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold mt-3 text-white">{tool.name}</h3>
                          </div>
                          <div className="p-4">
                            <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                            <Button variant="ghost" size="sm" className="w-full justify-between">
                              Gunakan Tool <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </a>
                ))
              )}
            </div>
          </TabsContent>
          
          {/* Tab Hasil Pencarian */}
          <TabsContent value="search-results" className="mt-8">
            {searchResults.length > 0 ? (
              <>
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                    <FolderSearch className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <h2 className="text-xl font-bold ml-3 dark:text-slate-100">
                    Hasil Pencarian: "{searchTerm}"
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {searchResults.map((tool: SearchResultTool, toolIndex: number) => (
                    <a key={toolIndex} href={tool.path} className="h-full no-underline">
                      <div className="h-full">
                        <Card className="h-full hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
                          <CardContent className="p-0 card-content">
                            <div className={`${tool.bgColor} text-white p-4`}>
                              <div className="flex justify-between items-start">
                                <div className="rounded-full bg-white/20 p-2">
                                  {tool.icon}
                                </div>
                                <div className="flex gap-2">
                                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                    {tool.category}
                                  </span>
                                  {tool.isNew && (
                                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                      Baru
                                    </span>
                                  )}
                                  {tool.isPopular && (
                                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                      Populer
                                    </span>
                                  )}
                                </div>
                              </div>
                              <h3 className="text-lg font-semibold mt-3 text-white">{tool.name}</h3>
                            </div>
                            <div className="p-4 dark:bg-slate-800">
                              <p className="text-gray-600 dark:text-slate-300 text-sm mb-4">{tool.description}</p>
                              <Button variant="ghost" size="sm" className="w-full justify-between dark:text-slate-200 dark:hover:bg-slate-700">
                                Gunakan Tool <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </a>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-full inline-block mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 dark:text-slate-100">Tidak ada tool yang ditemukan</h3>
                <p className="text-gray-600 dark:text-slate-300 max-w-md mx-auto">
                  Coba gunakan kata kunci lain atau periksa kategori yang tersedia untuk menemukan tool yang Anda butuhkan.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}