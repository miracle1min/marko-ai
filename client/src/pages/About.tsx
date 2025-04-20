import React from "react";
import { 
  Bot, UserCheck, Cpu, PieChart, 
  FileText, Code, Brain, Heart, Languages, 
  Shield, Settings, Award, Fingerprint, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedPage from "@/components/AnimatedPage";
import Breadcrumb from "@/components/Breadcrumb";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function About() {
  const technologies = [
    { name: "React", description: "Library UI front-end" },
    { name: "TypeScript", description: "JavaScript dengan type-safe" },
    { name: "Tailwind CSS", description: "Framework CSS utility-first" },
    { name: "Shadcn UI", description: "Komponen yang dapat digunakan kembali" },
    { name: "Google Gemini AI", description: "Model AI canggih" },
    { name: "Express", description: "Framework web Node.js" },
    { name: "Vite", description: "Tools frontend generasi terbaru" },
  ];

  const teamMembers = [
    {
      name: "Tim Marko",
      role: "Tim Pengembang",
      avatar: <UserCheck className="h-16 w-16 text-blue-600" />,
      bio: "Tim pengembang yang berdedikasi untuk membuat AI dapat diakses oleh semua orang.",
    }
  ];

  return (
    <AnimatedPage>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-6">
        <Breadcrumb 
          items={[
            { label: "Beranda", path: "/" },
            { label: "Tentang Kami", path: "/about", isActive: true }
          ]} 
        />

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-5xl mb-4">
            Tentang Marko AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Platform AI yang dibuat untuk membantu semua orang mengoptimalkan produktivitas dan kreativitas dengan kecerdasan buatan yang mudah diakses.
          </p>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="story" className="w-full mb-12">
          <div className="flex justify-center mb-10">
            {/* Tambahkan padding-bottom untuk memberikan jarak pada tampilan mobile */}
            <TabsList className="grid grid-cols-1 md:grid-cols-3 w-full max-w-xl sticky top-16 z-10 bg-background/95 backdrop-blur-sm pb-2 pt-2">
              <TabsTrigger value="story" className="gap-2">
                <FileText className="h-4 w-4" />
                <span>Cerita Kami</span>
              </TabsTrigger>
              <TabsTrigger value="mission" className="gap-2">
                <Award className="h-4 w-4" />
                <span>Misi & Visi</span>
              </TabsTrigger>
              <TabsTrigger value="team" className="gap-2">
                <UserCheck className="h-4 w-4" />
                <span>Tim Kami</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tambahkan margin-top yang lebih besar untuk konten tab */}
          <TabsContent value="story" className="mt-6">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-50">Perjalanan Kami</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  Marko AI dimulai dengan visi sederhana: membuat teknologi AI yang canggih dapat diakses oleh semua orang. Kami percaya bahwa kecerdasan buatan seharusnya tidak hanya tersedia untuk perusahaan besar atau para ahli teknologi, tetapi untuk semua orang yang ingin meningkatkan produktivitas dan kreativitas mereka.
                </p>
                <p>
                  Didirikan pada tahun 2023, tim kami mulai mengembangkan solusi AI yang mudah digunakan dengan fokus pada pembuatan konten, analisis data, dan pemrograman. Dengan memanfaatkan kemajuan teknologi seperti Google Gemini Flash 2.0, kami berhasil menciptakan platform yang handal dan efektif untuk berbagai kebutuhan.
                </p>
                <p>
                  Hari ini, Marko AI telah berkembang menjadi ekosistem alat AI terpadu yang membantu ribuan pengguna setiap hari - dari penulis konten, pengembang perangkat lunak, hingga profesional kesehatan yang menggunakan fitur konsultasi kesehatan kami.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mission" className="mt-6">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-900 dark:text-gray-50">
                    <Award className="mr-2 h-5 w-5 text-orange-500" /> Misi Kami
                  </h2>
                  <div className="space-y-4 text-gray-600 dark:text-gray-400">
                    <p>
                      Misi kami adalah memberdayakan individu dan organisasi dengan alat AI yang mudah digunakan, dapat diandalkan, dan berharga. Kami berkomitmen untuk:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Membuat teknologi AI canggih dapat diakses untuk semua orang</li>
                      <li>Menyediakan solusi AI yang mendukung kreativitas dan produktivitas</li>
                      <li>Memastikan bahwa alat kami intuitif dan mudah digunakan</li>
                      <li>Memprioritaskan privasi dan keamanan data pengguna</li>
                      <li>Berevolusi terus-menerus seiring kemajuan teknologi AI</li>
                    </ul>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-900 dark:text-gray-50">
                    <Brain className="mr-2 h-5 w-5 text-blue-500" /> Visi Kami
                  </h2>
                  <div className="space-y-4 text-gray-600 dark:text-gray-400">
                    <p>
                      Visi kami adalah menjadi platform AI terkemuka yang mentransformasi cara orang bekerja, belajar, dan berkreasi. Kami membayangkan masa depan di mana:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>AI menjadi asisten pribadi yang dapat dipercaya untuk semua orang</li>
                      <li>Hambatan teknis untuk menggunakan AI berkurang secara dramatis</li>
                      <li>Produktivitas dan kreativitas manusia meningkat melalui kolaborasi dengan AI</li>
                      <li>Marko AI dikenal sebagai solusi AI multi-bahasa terkemuka di Indonesia dan Asia Tenggara</li>
                      <li>Pengguna kami mendapat manfaat nyata dari AI dalam kehidupan sehari-hari</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team" className="mt-6">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-50">Tim di Balik Marko AI</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member, index) => (
                  <Card key={index} className="overflow-hidden border-0 shadow-md">
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-blue-100 p-4">
                          {member.avatar}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-1">{member.name}</h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">{member.role}</p>
                      <p className="text-gray-600 dark:text-gray-400">{member.bio}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* What Sets Us Apart */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-gray-50">
            Apa yang Membuat Kami Berbeda
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Cpu className="h-8 w-8 text-blue-600" />,
                title: "AI Canggih",
                description: "Didukung oleh model AI terbaru Google Gemini Flash 2.0 untuk hasil yang akurat dan relevan."
              },
              {
                icon: <Languages className="h-8 w-8 text-blue-600" />,
                title: "Dukungan Bahasa Indonesia",
                description: "Dioptimalkan untuk Bahasa Indonesia, memahami nuansa dan konteks lokal."
              },
              {
                icon: <Code className="h-8 w-8 text-blue-600" />,
                title: "Alat untuk Pengembang",
                description: "AI Code Generator yang membantu Anda menulis, debug, dan optimasi kode dengan cepat."
              },
              {
                icon: <FileText className="h-8 w-8 text-blue-600" />,
                title: "Pembuatan Konten",
                description: "Buat artikel, caption media sosial, dan konten SEO dengan sekali klik."
              },
              {
                icon: <Heart className="h-8 w-8 text-blue-600" />,
                title: "Konsultasi Kesehatan",
                description: "Fitur AI Dokter untuk informasi kesehatan dan analisis gejala yang informatif."
              },
              {
                icon: <Shield className="h-8 w-8 text-blue-600" />,
                title: "Privasi & Keamanan",
                description: "Keamanan data Anda adalah prioritas utama kami dengan enkripsi dan perlindungan terbaik."
              },
            ].map((feature, index) => (
              <Card key={index} className={cn(
                "overflow-hidden hover:shadow-lg transition-all duration-300",
                "border-0 shadow-md"
              )}>
                <CardContent className="p-6">
                  <div className="rounded-full bg-blue-100 p-3 w-fit mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-50">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-gray-50">
            Dibangun dengan Teknologi Modern
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8">
            <div className="flex flex-wrap justify-center gap-4">
              {technologies.map((tech, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 shadow-sm rounded-lg px-5 py-3 flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-50">{tech.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{tech.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-gray-50">
            Marko AI dalam Angka
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Bot className="h-10 w-10 text-blue-600" />, value: "4+", label: "Alat AI" },
              { icon: <UserCheck className="h-10 w-10 text-blue-600" />, value: "1,000+", label: "Pengguna Aktif" },
              { icon: <Fingerprint className="h-10 w-10 text-blue-600" />, value: "10,000+", label: "Generasi Konten" },
              { icon: <RefreshCw className="h-10 w-10 text-blue-600" />, value: "99.9%", label: "Uptime" },
            ].map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-md hover:shadow-lg transition-all duration-200">
                <CardContent className="pt-8 pb-6">
                  <div className="flex justify-center mb-4">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center pb-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-50">Siap Meningkatkan Produktivitas Anda?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Jelajahi berbagai alat AI kami dan mulai tingkatkan kreativitas dan efisiensi Anda hari ini.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-700 hover:bg-blue-800 text-white">
              <Link href="/tools">Jelajahi Semua Tools</Link>
            </Button>
            <Button size="lg" variant="outline">
              <Link href="/chat">Coba AI Chat</Link>
            </Button>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}