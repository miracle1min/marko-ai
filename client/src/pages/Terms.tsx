import React from "react";
import { ArrowDown, ArrowRight, FileText, Check, AlertTriangle } from "lucide-react";
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

export default function Terms() {
  const lastUpdated = "15 April 2025";

  return (
    <div className="min-h-screen dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-6">
        <Breadcrumb
          items={[
            { label: "Beranda", path: "/" },
            { label: "Syarat Layanan", path: "/terms", isActive: true },
          ]}
        />

        {/* Hero Section */}
        <div className="text-center mb-12 mt-4 space-y-4">
          <div className="inline-block p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
            <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4 dark:text-white">Syarat Layanan</h1>
          <p className="text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
            Silakan baca syarat layanan ini dengan cermat sebelum menggunakan platform Marko AI. Dengan mengakses atau menggunakan layanan kami, Anda menyetujui untuk terikat oleh ketentuan ini.
          </p>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Terakhir diperbarui: {lastUpdated}
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg dark:text-white">Penggunaan Layanan</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="dark:text-slate-300">
                Ketentuan tentang cara penggunaan platform Marko AI yang diizinkan dan dibatasi.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg dark:text-white">Hak Kekayaan Intelektual</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="dark:text-slate-300">
                Informasi tentang kepemilikan konten dan perlindungan hak kekayaan intelektual.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg dark:text-white">Pembatasan Tanggung Jawab</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="dark:text-slate-300">
                Ketentuan tentang batas tanggung jawab dan kewajiban Marko AI sehubungan dengan layanan.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="umum" className="w-full mb-12">
          <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-4 h-auto">
            <TabsTrigger value="umum" className="py-2">Umum</TabsTrigger>
            <TabsTrigger value="akun" className="py-2">Akun</TabsTrigger>
            <TabsTrigger value="pembayaran" className="py-2">Pembayaran</TabsTrigger>
            <TabsTrigger value="lisensi" className="py-2">Lisensi</TabsTrigger>
          </TabsList>
          
          <TabsContent value="umum" className="mt-8">
            <div className="prose prose-slate dark:prose-invert max-w-none dark:text-slate-300">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">Ketentuan Umum</h2>
              
              <p>
                Selamat datang di Marko AI. Syarat Layanan ini ("Syarat") mengatur penggunaan Anda atas platform 
                Marko AI, termasuk situs web, aplikasi, produk, dan layanan lainnya (secara kolektif disebut "Layanan") 
                yang disediakan oleh PT Marko AI Indonesia ("Marko AI", "kami", "kita", atau "milik kami").
              </p>
              
              <p>
                Dengan mengakses atau menggunakan Layanan kami, Anda menyetujui bahwa Anda telah membaca, memahami, 
                dan menyetujui untuk terikat oleh Syarat ini. Jika Anda tidak menyetujui Syarat ini, Anda tidak boleh 
                mengakses atau menggunakan Layanan kami.
              </p>
              
              <h3 className="text-xl font-bold mt-6 mb-3 dark:text-white">Definisi</h3>
              <ul className="space-y-3 list-disc pl-6">
                <li>
                  <strong>Layanan</strong> mengacu pada platform Marko AI, termasuk situs web, aplikasi, 
                  produk, dan layanan lainnya yang disediakan oleh PT Marko AI Indonesia.
                </li>
                <li>
                  <strong>Pengguna</strong> mengacu pada individu atau entitas yang mengakses atau menggunakan Layanan.
                </li>
                <li>
                  <strong>Konten</strong> mengacu pada semua informasi, data, teks, perangkat lunak, musik, suara, 
                  foto, grafik, video, pesan, atau materi lainnya yang diakses melalui Layanan.
                </li>
                <li>
                  <strong>Konten Pengguna</strong> mengacu pada Konten yang diunggah, dibagikan, atau dikirimkan 
                  oleh Pengguna melalui Layanan.
                </li>
              </ul>
              
              <h3 className="text-xl font-bold mt-6 mb-3 dark:text-white">Perubahan pada Syarat Layanan</h3>
              <p>
                Kami berhak, atas kebijakan kami sendiri, untuk mengubah atau mengganti Syarat ini kapan saja. 
                Jika perubahan tersebut bersifat material, kami akan berusaha memberikan pemberitahuan setidaknya 
                30 hari sebelum syarat baru berlaku. Pemberitahuan tersebut akan diberikan melalui email ke alamat 
                yang terkait dengan akun Anda atau melalui pemberitahuan menonjol pada Layanan kami.
              </p>
              <p>
                Penggunaan Anda berkelanjutan atas Layanan setelah kami memposting perubahan akan merupakan 
                persetujuan Anda terhadap perubahan tersebut. Jika Anda tidak setuju dengan syarat baru, Anda 
                berhak untuk berhenti menggunakan Layanan.
              </p>
              
              <h3 className="text-xl font-bold mt-6 mb-3 dark:text-white">Yurisdiksi</h3>
              <p>
                Syarat ini akan diatur oleh dan ditafsirkan sesuai dengan hukum Indonesia, tanpa memperhatikan 
                prinsip-prinsip konflik hukum. Pengadilan yang memiliki yurisdiksi eksklusif atas segala 
                perselisihan yang timbul dari atau sehubungan dengan Syarat ini adalah Pengadilan Negeri Jakarta Pusat.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="akun" className="mt-8">
            <div className="prose prose-slate dark:prose-invert max-w-none dark:text-slate-300">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">Akun dan Pendaftaran</h2>
              
              <h3 className="text-xl font-bold mt-6 mb-3 dark:text-white">Persyaratan Akun</h3>
              <p>
                Untuk menggunakan beberapa fitur Layanan, Anda mungkin perlu membuat akun. Anda menyetujui untuk 
                memberikan informasi yang akurat, terkini, dan lengkap selama proses pendaftaran dan untuk memperbarui 
                informasi tersebut agar tetap akurat, terkini, dan lengkap. Ketidakakuratan, ketidaklengkapan, atau 
                ketidakbenaran informasi apa pun dapat mengakibatkan pengakhiran segera akun Anda atas Layanan.
              </p>
              
              <h3 className="text-xl font-bold mt-6 mb-3 dark:text-white">Keamanan Akun</h3>
              <p>
                Anda bertanggung jawab untuk menjaga kerahasiaan kata sandi Anda dan untuk semua aktivitas yang 
                terjadi di bawah akun Anda. Anda setuju untuk segera memberi tahu Marko AI tentang penggunaan 
                yang tidak sah dari akun atau kata sandi Anda atau pelanggaran keamanan lainnya.
              </p>
              <p>
                Marko AI tidak akan bertanggung jawab atas kerugian atau kerusakan apa pun yang timbul dari kegagalan 
                Anda untuk mematuhi ketentuan ini.
              </p>
              
              <h3 className="text-xl font-bold mt-6 mb-3 dark:text-white">Penangguhan dan Pengakhiran Akun</h3>
              <p>
                Marko AI berhak untuk menangguhkan atau mengakhiri akun Anda dan akses Anda ke Layanan kapan saja, 
                untuk alasan apa pun, tanpa pemberitahuan terlebih dahulu. Alasan untuk penghentian tersebut dapat 
                mencakup, tetapi tidak terbatas pada:
              </p>
              <ul className="space-y-3 list-disc pl-6">
                <li>Pelanggaran Syarat ini</li>
                <li>Permintaan dari penegak hukum atau instansi pemerintah lainnya</li>
                <li>Permintaan dari Anda (penghentian akun yang dimulai sendiri)</li>
                <li>Masalah atau masalah teknis yang tidak terduga</li>
                <li>Periode ketidakaktifan yang berkepanjangan</li>
              </ul>
              <p>
                Anda setuju bahwa semua penghentian untuk alasan apa pun dapat dilakukan atas kebijakan tunggal dan 
                absolut Marko AI dan bahwa Marko AI tidak akan bertanggung jawab kepada Anda atau pihak ketiga mana 
                pun untuk pengakhiran akun Anda atau akses ke Layanan.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="pembayaran" className="mt-8">
            <div className="prose prose-slate dark:prose-invert max-w-none dark:text-slate-300">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">Ketentuan Pembayaran</h2>
              
              <h3 className="text-xl font-bold mt-6 mb-3 dark:text-white">Paket Berlangganan</h3>
              <p>
                Marko AI menawarkan berbagai paket berlangganan, termasuk paket gratis dan paket berbayar dengan 
                fitur dan batasan yang berbeda. Rincian tentang apa yang termasuk dalam setiap paket akan ditampilkan 
                di halaman harga kami.
              </p>
              
              <h3 className="text-xl font-bold mt-6 mb-3 dark:text-white">Ketentuan Pembayaran</h3>
              <p>
                Untuk berlangganan paket berbayar, Anda harus memberikan metode pembayaran yang valid. Anda setuju 
                untuk membayar semua biaya yang terkait dengan akun Anda berdasarkan harga yang berlaku, ditambah 
                pajak yang berlaku, dan mengotorisasi Marko AI untuk menagih metode pembayaran yang Anda sediakan 
                selama proses pendaftaran.
              </p>
              <p>
                Semua pembayaran bersifat non-refundable, kecuali dinyatakan lain dalam Syarat ini atau diwajibkan 
                oleh hukum yang berlaku. Tidak ada pengembalian atau kredit untuk periode penggunaan sebagian, dan 
                tidak ada pengembalian atau kredit untuk periode yang tidak digunakan dengan akun aktif.
              </p>
              
              <h3 className="text-xl font-bold mt-6 mb-3 dark:text-white">Perpanjangan Otomatis</h3>
              <p>
                Berlangganan Anda akan secara otomatis diperpanjang pada harga yang berlaku, kecuali Anda membatalkan 
                berlangganan Anda sebelum akhir periode berlangganan saat ini. Anda dapat membatalkan perpanjangan 
                otomatis melalui pengaturan akun Anda kapan saja.
              </p>
              
              <h3 className="text-xl font-bold mt-6 mb-3 dark:text-white">Perubahan Harga</h3>
              <p>
                Marko AI berhak, atas kebijakannya sendiri, untuk mengubah harga berlangganan kapan saja. Perubahan 
                harga apa pun akan berlaku setelah akhir periode langganan saat ini. Kami akan memberi tahu Anda 
                tentang perubahan harga apa pun setidaknya 30 hari sebelum mereka berlaku.
              </p>
              <p>
                Penggunaan berkelanjutan atas Layanan setelah perubahan harga tersebut merupakan persetujuan Anda 
                untuk harga baru.
              </p>
              
              <h3 className="text-xl font-bold mt-6 mb-3 dark:text-white">Kode Promosi</h3>
              <p>
                Marko AI dapat, atas kebijakannya sendiri, menawarkan kode promosi yang dapat ditukarkan dengan 
                kredit akun atau fitur khusus lainnya. Kode promosi tersebut tunduk pada ketentuan tambahan yang 
                akan diberikan pada saat penerbitan.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="lisensi" className="mt-8">
            <div className="prose prose-slate dark:prose-invert max-w-none dark:text-slate-300">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">Lisensi dan Hak Kekayaan Intelektual</h2>
              
              <h3 className="text-xl font-bold mt-6 mb-3 dark:text-white">Lisensi untuk Menggunakan Layanan</h3>
              <p>
                Dengan tunduk pada kepatuhan Anda terhadap Syarat ini, Marko AI memberi Anda lisensi terbatas, 
                non-eksklusif, tidak dapat dialihkan, dan dapat dibatalkan untuk mengakses dan menggunakan Layanan 
                untuk tujuan pribadi atau bisnis internal Anda.
              </p>
              <p>
                Anda tidak boleh: (i) menjual kembali atau mendistribusikan ulang Layanan; (ii) mengubah atau membuat 
                karya turunan berdasarkan Layanan; (iii) melakukan reverse engineering, dekompilasi, atau membongkar 
                Layanan; atau (iv) menyalin, mereproduksi, atau mengekstrak bagian apa pun dari Layanan dengan cara apa pun 
                yang tidak secara tegas diizinkan oleh Syarat ini atau hukum yang berlaku.
              </p>
              
              <h3 className="text-xl font-bold mt-6 mb-3 dark:text-white">Kepemilikan Konten Marko AI</h3>
              <p>
                Layanan dan semua materi yang terdapat di dalamnya, termasuk, tetapi tidak terbatas pada, perangkat lunak, 
                gambar, teks, grafik, ilustrasi, logo, paten, merek dagang, merek layanan, hak cipta, foto, audio, video, 
                musik, dan konten Pengguna (secara kolektif, "Konten Marko AI"), dimiliki oleh atau dilisensikan ke 
                Marko AI, dan dilindungi oleh undang-undang hak cipta dan merek dagang, serta undang-undang properti 
                intelektual lainnya.
              </p>
              
              <h3 className="text-xl font-bold mt-6 mb-3 dark:text-white">Konten Pengguna</h3>
              <p>
                Anda mempertahankan semua hak, kepemilikan, dan kepentingan Anda dalam dan untuk Konten Pengguna Anda. 
                Dengan mengunggah, mengirimkan, atau membagikan Konten Pengguna di atau melalui Layanan, Anda memberi 
                Marko AI lisensi non-eksklusif, bebas royalti, di seluruh dunia, yang dapat disublisensikan, dan 
                dapat dialihkan untuk menggunakan, mereproduksi, memodifikasi, mengadaptasi, mendistribusikan, 
                menerjemahkan, membuat karya turunan dari, menampilkan, dan mempertunjukkan Konten Pengguna tersebut 
                sehubungan dengan pengoperasian dan penyediaan Layanan.
              </p>
              <p>
                Anda menyatakan dan menjamin bahwa: (i) Anda memiliki semua hak, lisensi, persetujuan, dan izin yang 
                diperlukan untuk memberi Marko AI hak dan lisensi yang disebutkan di atas; dan (ii) Konten Pengguna 
                Anda, dan penggunaan Konten Pengguna Anda oleh Marko AI, tidak akan melanggar, menyalahgunakan, atau 
                melanggar hak cipta, merek dagang, rahasia dagang, hak moral, atau hak kepemilikan lainnya dari pihak 
                ketiga, atau mengakibatkan pelanggaran hukum yang berlaku.
              </p>
              
              <h3 className="text-xl font-bold mt-6 mb-3 dark:text-white">Pemberitahuan DMCA dan Prosedur untuk Klaim Pelanggaran</h3>
              <p>
                Jika Anda percaya bahwa Konten di Layanan kami melanggar hak cipta Anda, silakan beri tahu kami 
                dengan memberikan informasi berikut secara tertulis:
              </p>
              <ul className="space-y-3 list-disc pl-6">
                <li>Tanda tangan fisik atau elektronik dari pemilik hak cipta atau orang yang berwenang untuk bertindak atas nama mereka</li>
                <li>Identifikasi karya berhak cipta yang diklaim telah dilanggar</li>
                <li>Identifikasi materi yang diklaim melanggar</li>
                <li>Informasi kontak Anda, termasuk alamat, nomor telepon, dan alamat email</li>
                <li>Pernyataan bahwa Anda memiliki keyakinan dengan itikad baik bahwa penggunaan materi dengan cara yang dikeluhkan tidak diizinkan oleh pemilik hak cipta, agennya, atau hukum</li>
                <li>Pernyataan, dibuat di bawah sumpah, bahwa informasi di atas akurat dan bahwa Anda adalah pemilik hak cipta atau berwenang untuk bertindak atas nama pemilik hak cipta</li>
              </ul>
              <p>
                Anda dapat mengirimkan pemberitahuan ini ke dmca@markoai.com.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Important Notices Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">Batasan & Penyangkalan Penting</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-100 dark:border-yellow-900/50">
              <div className="flex items-start">
                <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2 dark:text-white">Pembatasan Tanggung Jawab</h3>
                  <p className="text-gray-700 dark:text-slate-300">
                    Sejauh diizinkan oleh hukum, Marko AI tidak akan bertanggung jawab atas kerusakan tidak langsung, 
                    insidental, khusus, konsekuensial, atau teladan, termasuk kehilangan keuntungan, data, atau goodwill, 
                    yang timbul dari atau sehubungan dengan Syarat ini atau penggunaan atau ketidakmampuan untuk 
                    menggunakan Layanan.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-100 dark:border-yellow-900/50">
              <div className="flex items-start">
                <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2 dark:text-white">Penyangkalan Jaminan</h3>
                  <p className="text-gray-700 dark:text-slate-300">
                    Layanan disediakan "sebagaimana adanya" dan "sebagaimana tersedia" tanpa jaminan apa pun, 
                    baik tersurat maupun tersirat, termasuk, tetapi tidak terbatas pada, jaminan tersirat tentang 
                    kelayakan untuk diperdagangkan, kesesuaian untuk tujuan tertentu, nonpelanggaran, atau jalannya kinerja.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">Pertanyaan yang Sering Diajukan</h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border dark:border-slate-700">
              <AccordionTrigger className="hover:no-underline dark:text-white">
                Dapatkah saya membatalkan langganan saya kapan saja?
              </AccordionTrigger>
              <AccordionContent className="dark:text-slate-300">
                Ya, Anda dapat membatalkan langganan Anda kapan saja melalui pengaturan akun Anda. Pembatalan akan 
                berlaku pada akhir periode penagihan saat ini. Anda akan terus memiliki akses ke paket berbayar Anda 
                sampai akhir periode penagihan, dan tidak akan dikenakan biaya lagi setelahnya.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border dark:border-slate-700">
              <AccordionTrigger className="hover:no-underline dark:text-white">
                Bagaimana jika saya tidak setuju dengan perubahan pada Syarat Layanan?
              </AccordionTrigger>
              <AccordionContent className="dark:text-slate-300">
                Jika Anda tidak setuju dengan perubahan pada Syarat Layanan, Anda dapat berhenti menggunakan Layanan kami. 
                Penggunaan berkelanjutan atas Layanan setelah perubahan berlaku akan menunjukkan persetujuan Anda terhadap 
                perubahan tersebut. Jika perubahan bersifat material, kami akan memberikan pemberitahuan terlebih dahulu 
                untuk memberi Anda kesempatan mempertimbangkan perubahan tersebut.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border dark:border-slate-700">
              <AccordionTrigger className="hover:no-underline dark:text-white">
                Siapa yang memiliki konten yang dihasilkan menggunakan Marko AI?
              </AccordionTrigger>
              <AccordionContent className="dark:text-slate-300">
                Anda memiliki semua hak, kepemilikan, dan kepentingan dalam konten yang Anda hasilkan menggunakan Layanan kami, 
                dengan tunduk pada ketentuan lisensi yang dijelaskan dalam Syarat Layanan. Namun, perlu dicatat bahwa dalam beberapa 
                kasus, konten mungkin didasarkan pada data atau model yang dilisensikan ke Marko AI oleh pihak ketiga, yang dapat 
                memberlakukan batasan tambahan.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="border dark:border-slate-700">
              <AccordionTrigger className="hover:no-underline dark:text-white">
                Apakah ada batasan penggunaan untuk akun gratis?
              </AccordionTrigger>
              <AccordionContent className="dark:text-slate-300">
                Ya, akun gratis memiliki batasan tertentu, seperti jumlah permintaan per hari, jumlah karakter per permintaan, 
                dan fitur yang tersedia. Batasan spesifik untuk setiap paket ditampilkan di halaman harga kami. Anda dapat 
                meningkatkan ke paket berbayar untuk menghapus atau memperluas batasan ini.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5" className="border dark:border-slate-700">
              <AccordionTrigger className="hover:no-underline dark:text-white">
                Dapatkah saya menggunakan Marko AI untuk tujuan komersial?
              </AccordionTrigger>
              <AccordionContent className="dark:text-slate-300">
                Ya, Anda dapat menggunakan Marko AI untuk tujuan komersial, tergantung pada paket langganan Anda. Akun gratis 
                mungkin memiliki batasan penggunaan komersial, sementara paket berbayar umumnya mengizinkan penggunaan komersial 
                dengan batasan tertentu yang dijelaskan dalam Syarat Layanan. Untuk penggunaan skala besar atau kasus penggunaan 
                khusus, silakan hubungi tim penjualan kami untuk opsi lisensi khusus.
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
                Jika Anda memiliki pertanyaan atau kekhawatiran tentang Syarat Layanan kami, silakan hubungi kami melalui:
              </p>
              <ul className="space-y-3 list-none pl-0">
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-2" />
                  <span className="dark:text-slate-300">Email: legal@markoai.com</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-2" />
                  <span className="dark:text-slate-300">Telepon: +62 21 1234 5678</span>
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-2" />
                  <span className="dark:text-slate-300">Alamat: Gedung Marko, Jl. Teknologi No. 123, Jakarta 12345</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center justify-center p-6 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2 dark:text-white">Komitmen Transparansi Kami</h3>
                  <p className="text-gray-600 dark:text-slate-300">
                    Kami berkomitmen untuk berkomunikasi dengan jelas tentang hak dan kewajiban Anda saat menggunakan layanan kami.
                  </p>
                </div>
              </div>
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