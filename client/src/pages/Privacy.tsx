import React from "react";
import { ArrowDown, ArrowRight, Check, Shield } from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";

export default function Privacy() {
  const lastUpdated = "15 April 2025";

  return (
    <div className="min-h-screen dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-6">
        <Breadcrumb
          items={[
            { label: "Beranda", path: "/" },
            { label: "Kebijakan Privasi", path: "/privacy", isActive: true },
          ]}
        />

        {/* Hero Section */}
        <div className="text-center mb-12 mt-4 space-y-4">
          <div className="inline-block p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4 dark:text-white">Kebijakan Privasi</h1>
          <p className="text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
            Kami menghargai privasi Anda. Halaman ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda saat menggunakan layanan Marko AI.
          </p>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Terakhir diperbarui: {lastUpdated}
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg dark:text-white">Data yang Kami Kumpulkan</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="dark:text-slate-300">
                Informasi yang kami kumpulkan saat Anda menggunakan layanan Marko AI, termasuk data pribadi dan penggunaan.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg dark:text-white">Penggunaan Data</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="dark:text-slate-300">
                Bagaimana kami menggunakan data Anda untuk meningkatkan layanan dan memberikan pengalaman yang lebih baik.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg dark:text-white">Perlindungan Data</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="dark:text-slate-300">
                Langkah-langkah yang kami ambil untuk melindungi data pribadi Anda dan menjaga keamanannya.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="umum" className="w-full mb-12">
          <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 h-auto">
            <TabsTrigger value="umum" className="py-2">Umum</TabsTrigger>
            <TabsTrigger value="layanan" className="py-2">Layanan</TabsTrigger>
            <TabsTrigger value="keamanan" className="py-2">Keamanan</TabsTrigger>
          </TabsList>
          
          <TabsContent value="umum" className="mt-8">
            <div className="prose prose-slate dark:prose-invert max-w-none dark:text-slate-300">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">Informasi Umum</h2>
              
              <p>
                PT Marko AI Indonesia ("kami", "kita", atau "Marko AI") berkomitmen untuk melindungi privasi Anda. 
                Kebijakan Privasi ini menjelaskan kebijakan kami mengenai pengumpulan, penggunaan, dan pengungkapan 
                informasi pribadi Anda saat Anda menggunakan layanan kami dan pilihan yang telah Anda kaitkan dengan informasi tersebut.
              </p>
              
              <p>
                Kami menggunakan data Anda untuk menyediakan dan meningkatkan layanan. Dengan menggunakan layanan, 
                Anda menyetujui pengumpulan dan penggunaan informasi sesuai dengan kebijakan ini.
              </p>
              
              <h3 className="text-xl font-bold mt-6 mb-3 dark:text-white">Definisi</h3>
              <ul className="space-y-3 list-disc pl-6">
                <li><strong>Layanan</strong> mengacu pada situs web dan aplikasi Marko AI.</li>
                <li><strong>Data Pribadi</strong> adalah data tentang individu yang hidup yang dapat diidentifikasi dari data tersebut.</li>
                <li><strong>Data Penggunaan</strong> adalah data yang dikumpulkan secara otomatis yang dihasilkan dari penggunaan Layanan.</li>
                <li><strong>Cookies</strong> adalah file kecil yang ditempatkan di perangkat Anda.</li>
              </ul>
              
              <h3 className="text-xl font-bold mt-6 mb-3 dark:text-white">Perubahan pada Kebijakan Privasi Ini</h3>
              <p>
                Kami dapat memperbarui Kebijakan Privasi kami dari waktu ke waktu. Kami akan memberi tahu Anda 
                tentang perubahan apa pun dengan memposting Kebijakan Privasi baru di halaman ini dan, jika 
                perubahannya signifikan, kami akan memberi tahu Anda melalui email atau pemberitahuan menonjol 
                tentang Layanan kami.
              </p>
              <p>
                Anda disarankan untuk meninjau Kebijakan Privasi ini secara berkala untuk setiap perubahan. 
                Perubahan pada Kebijakan Privasi ini berlaku ketika diposting di halaman ini.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="layanan" className="mt-8">
            <div className="prose prose-slate dark:prose-invert max-w-none dark:text-slate-300">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">Penggunaan Layanan</h2>
              
              <h3 className="text-xl font-bold mt-6 mb-3 dark:text-white">Pengumpulan dan Penggunaan Informasi</h3>
              <p>
                Kami mengumpulkan beberapa jenis informasi untuk berbagai keperluan guna menyediakan dan 
                meningkatkan Layanan kami kepada Anda.
              </p>
              
              <h4 className="text-lg font-bold mt-4 mb-2 dark:text-white">Jenis Data yang Dikumpulkan</h4>
              
              <h5 className="text-md font-bold mt-4 mb-2 dark:text-white">Data Pribadi</h5>
              <p>
                Saat menggunakan Layanan kami, kami mungkin meminta Anda untuk memberikan kami informasi 
                pengenal pribadi tertentu yang dapat digunakan untuk menghubungi atau mengidentifikasi Anda 
                ("Data Pribadi"). Informasi pengenal pribadi dapat mencakup, tetapi tidak terbatas pada:
              </p>
              <ul className="space-y-3 list-disc pl-6">
                <li>Alamat email</li>
                <li>Nama depan dan nama belakang</li>
                <li>Nomor telepon</li>
                <li>Alamat, Negara, Negara Bagian, Provinsi, ZIP/Kode Pos, Kota</li>
                <li>Cookies dan Data Penggunaan</li>
              </ul>
              
              <h5 className="text-md font-bold mt-4 mb-2 dark:text-white">Data Penggunaan</h5>
              <p>
                Kami juga dapat mengumpulkan informasi tentang bagaimana Layanan diakses dan digunakan 
                ("Data Penggunaan"). Data Penggunaan ini dapat mencakup informasi seperti alamat Protokol 
                Internet komputer Anda (misalnya alamat IP), jenis browser, versi browser, halaman Layanan 
                kami yang Anda kunjungi, waktu dan tanggal kunjungan Anda, waktu yang dihabiskan untuk 
                halaman tersebut, pengidentifikasi perangkat unik dan data diagnostik lainnya.
              </p>
              
              <h3 className="text-xl font-bold mt-6 mb-3 dark:text-white">Penggunaan Data</h3>
              <p>
                Marko AI menggunakan data yang dikumpulkan untuk berbagai keperluan:
              </p>
              <ul className="space-y-3 list-disc pl-6">
                <li>Untuk menyediakan dan memelihara Layanan</li>
                <li>Untuk memberi tahu Anda tentang perubahan pada Layanan kami</li>
                <li>Untuk memungkinkan Anda berpartisipasi dalam fitur interaktif Layanan kami ketika Anda memilih untuk melakukannya</li>
                <li>Untuk memberikan dukungan pelanggan</li>
                <li>Untuk mengumpulkan analisis atau informasi berharga sehingga kami dapat meningkatkan Layanan</li>
                <li>Untuk memantau penggunaan Layanan</li>
                <li>Untuk mendeteksi, mencegah, dan mengatasi masalah teknis</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="keamanan" className="mt-8">
            <div className="prose prose-slate dark:prose-invert max-w-none dark:text-slate-300">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">Keamanan Data</h2>
              
              <p>
                Keamanan data Anda penting bagi kami, tetapi ingat bahwa tidak ada metode transmisi melalui 
                Internet, atau metode penyimpanan elektronik yang 100% aman. Meskipun kami berusaha untuk 
                menggunakan cara yang dapat diterima secara komersial untuk melindungi Data Pribadi Anda, 
                kami tidak dapat menjamin keamanan absolutnya.
              </p>
              
              <h3 className="text-xl font-bold mt-6 mb-3 dark:text-white">Langkah-langkah Keamanan yang Kami Implementasikan</h3>
              <ul className="space-y-5 pl-0 mt-6">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 p-1 mr-3">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </span>
                  <div>
                    <h4 className="text-md font-bold dark:text-white">Enkripsi End-to-End</h4>
                    <p className="text-gray-600 dark:text-slate-300">
                      Semua data sensitif dienkripsi saat transit dan saat disimpan menggunakan standar enkripsi industri.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 p-1 mr-3">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </span>
                  <div>
                    <h4 className="text-md font-bold dark:text-white">Sistem Deteksi Intrusi</h4>
                    <p className="text-gray-600 dark:text-slate-300">
                      Kami menerapkan sistem deteksi intrusi untuk memantau dan mencegah akses tidak sah.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 p-1 mr-3">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </span>
                  <div>
                    <h4 className="text-md font-bold dark:text-white">Audit Keamanan Berkala</h4>
                    <p className="text-gray-600 dark:text-slate-300">
                      Kami melakukan audit keamanan secara teratur untuk mengidentifikasi dan mengatasi potensi kerentanan.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 p-1 mr-3">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </span>
                  <div>
                    <h4 className="text-md font-bold dark:text-white">Akses Terbatas</h4>
                    <p className="text-gray-600 dark:text-slate-300">
                      Hanya personel yang berwenang yang memiliki akses ke data pribadi, dan kami memberlakukan kontrol akses yang ketat.
                    </p>
                  </div>
                </li>
              </ul>
              
              <h3 className="text-xl font-bold mt-6 mb-3 dark:text-white">Pelanggaran Data</h3>
              <p>
                Dalam kejadian pelanggaran data yang melibatkan informasi pribadi Anda, kami akan memberi 
                tahu Anda sesuai dengan persyaratan hukum. Kami telah menetapkan prosedur untuk menangani 
                dugaan pelanggaran data dan akan memberi tahu otoritas terkait tentang pelanggaran tersebut 
                ketika secara hukum diwajibkan untuk melakukannya.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">Pertanyaan yang Sering Diajukan</h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border dark:border-slate-700">
              <AccordionTrigger className="hover:no-underline dark:text-white">
                Bagaimana cara Marko AI melindungi data saya?
              </AccordionTrigger>
              <AccordionContent className="dark:text-slate-300">
                Marko AI mengimplementasikan berbagai langkah keamanan untuk melindungi data Anda, termasuk enkripsi end-to-end, 
                autentikasi multi-faktor, dan kontrol akses yang ketat. Kami secara teratur melakukan audit keamanan dan 
                memperbarui protokol kami untuk memastikan data Anda tetap aman.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border dark:border-slate-700">
              <AccordionTrigger className="hover:no-underline dark:text-white">
                Apakah Marko AI menjual data saya ke pihak ketiga?
              </AccordionTrigger>
              <AccordionContent className="dark:text-slate-300">
                Tidak, Marko AI tidak menjual data pribadi pengguna ke pihak ketiga. Kami hanya menggunakan data Anda untuk 
                menyediakan dan meningkatkan layanan kami. Dalam beberapa kasus, kami mungkin berbagi data dengan penyedia 
                layanan pihak ketiga yang membantu kami menjalankan bisnis, tetapi mereka terikat oleh perjanjian kerahasiaan.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border dark:border-slate-700">
              <AccordionTrigger className="hover:no-underline dark:text-white">
                Berapa lama Marko AI menyimpan data saya?
              </AccordionTrigger>
              <AccordionContent className="dark:text-slate-300">
                Marko AI menyimpan data pribadi Anda selama yang dibutuhkan untuk menyediakan layanan kami dan memenuhi tujuan 
                yang dijelaskan dalam Kebijakan Privasi ini. Kami akan menyimpan dan menggunakan data Anda sejauh yang diperlukan 
                untuk mematuhi kewajiban hukum kami, menyelesaikan perselisihan, dan menegakkan perjanjian kami.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="border dark:border-slate-700">
              <AccordionTrigger className="hover:no-underline dark:text-white">
                Bagaimana cara saya mengakses, memperbarui, atau menghapus data pribadi saya?
              </AccordionTrigger>
              <AccordionContent className="dark:text-slate-300">
                Anda dapat mengakses, memperbarui, atau meminta penghapusan data pribadi Anda dengan masuk ke akun Anda dan 
                menggunakan pengaturan yang tersedia, atau dengan menghubungi tim dukungan kami melalui email di 
                privacy@markoai.com. Kami akan menanggapi permintaan Anda dalam waktu 30 hari.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5" className="border dark:border-slate-700">
              <AccordionTrigger className="hover:no-underline dark:text-white">
                Apakah anak-anak di bawah umur dapat menggunakan layanan Marko AI?
              </AccordionTrigger>
              <AccordionContent className="dark:text-slate-300">
                Layanan kami tidak ditujukan untuk anak-anak di bawah usia 13 tahun, dan kami tidak dengan sengaja mengumpulkan 
                informasi yang dapat diidentifikasi secara pribadi dari anak-anak di bawah 13 tahun. Jika Anda adalah orang tua 
                atau wali dan mengetahui bahwa anak Anda telah memberikan data pribadi kepada kami, silakan hubungi kami.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Contact Section */}
        <div className="p-6 bg-gray-50 dark:bg-slate-800 rounded-xl mb-12 border border-gray-100 dark:border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4 dark:text-white">Pertanyaan Lebih Lanjut?</h2>
              <p className="text-gray-600 dark:text-slate-300 mb-6">
                Jika Anda memiliki pertanyaan atau kekhawatiran tentang Kebijakan Privasi kami atau praktik 
                data kami, silakan hubungi kami melalui:
              </p>
              <ul className="space-y-3 list-none pl-0">
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="dark:text-slate-300">Email: privacy@markoai.com</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="dark:text-slate-300">Telepon: +62 21 1234 5678</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="dark:text-slate-300">Alamat: Gedung Marko, Jl. Teknologi No. 123, Jakarta 12345</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center justify-center p-6 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <div className="text-center">
                  <Shield className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2 dark:text-white">Komitmen Keamanan Kami</h3>
                  <p className="text-gray-600 dark:text-slate-300">
                    Kami berkomitmen untuk menjaga privasi dan keamanan data Anda sebagai prioritas utama kami.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Badges */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Kepatuhan & Sertifikasi</h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <div className="h-16 w-16 mx-auto bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center mb-2">
                <span className="text-xl font-bold dark:text-white">ISO</span>
              </div>
              <p className="text-sm dark:text-slate-300">ISO 27001</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 mx-auto bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center mb-2">
                <span className="text-xl font-bold dark:text-white">GDPR</span>
              </div>
              <p className="text-sm dark:text-slate-300">Compliant</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 mx-auto bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center mb-2">
                <span className="text-xl font-bold dark:text-white">SOC2</span>
              </div>
              <p className="text-sm dark:text-slate-300">Type II</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 mx-auto bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center mb-2">
                <span className="text-xl font-bold dark:text-white">HIPAA</span>
              </div>
              <p className="text-sm dark:text-slate-300">Compliant</p>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center mb-8">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            © {new Date().getFullYear()} Marko AI. Semua hak dilindungi undang-undang.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}