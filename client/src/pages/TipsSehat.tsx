import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Heart,
  Utensils,
  Dumbbell,
  Brain,
  Moon,
  Sun,
  Shield,
  Repeat,
  RefreshCw,
  Search,
  Plus,
  Info,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Stethoscope
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Breadcrumb from "@/components/Breadcrumb";
import { useToast } from "@/hooks/use-toast";

// Kategori tips kesehatan
interface HealthCategory {
  id: string;
  name: string;
  icon: JSX.Element;
  description: string;
  color: string;
}

// Artikel kesehatan
interface HealthTip {
  id: string;
  category: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  tags: string[];
  isNew?: boolean;
  isPopular?: boolean;
}

const healthCategories: HealthCategory[] = [
  {
    id: "nutrition",
    name: "Nutrisi",
    icon: <Utensils className="h-5 w-5" />,
    description: "Tips pola makan sehat dan nutrisi seimbang",
    color: "bg-green-50 text-green-700 border-green-200"
  },
  {
    id: "exercise",
    name: "Olahraga",
    icon: <Dumbbell className="h-5 w-5" />,
    description: "Panduan aktivitas fisik untuk kesehatan optimal",
    color: "bg-blue-50 text-blue-700 border-blue-200"
  },
  {
    id: "mental",
    name: "Kesehatan Mental",
    icon: <Brain className="h-5 w-5" />,
    description: "Tips menjaga keseimbangan mental dan emosional",
    color: "bg-purple-50 text-purple-700 border-purple-200"
  },
  {
    id: "sleep",
    name: "Pola Tidur",
    icon: <Moon className="h-5 w-5" />,
    description: "Cara mendapatkan tidur berkualitas",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200"
  },
  {
    id: "wellness",
    name: "Kesehatan Umum",
    icon: <Heart className="h-5 w-5" />,
    description: "Tips umum untuk gaya hidup sehat",
    color: "bg-red-50 text-red-700 border-red-200"
  },
  {
    id: "prevention",
    name: "Pencegahan Penyakit",
    icon: <Shield className="h-5 w-5" />,
    description: "Langkah-langkah mencegah penyakit umum",
    color: "bg-amber-50 text-amber-700 border-amber-200"
  }
];

// Data tips kesehatan (mock data untuk demo)
const healthTips: HealthTip[] = [
  {
    id: "nut-1",
    category: "nutrition",
    title: "Pola Makan Seimbang untuk Kesehatan Optimal",
    summary: "Panduan praktis menyusun menu seimbang untuk kebutuhan nutrisi harian",
    content: `# Pola Makan Seimbang untuk Kesehatan Optimal

Pola makan seimbang adalah kunci untuk menjaga kesehatan dan mencegah berbagai penyakit. Berikut adalah panduan praktis untuk menyusun menu seimbang sehari-hari:

## Prinsip Dasar Pola Makan Seimbang

1. **Konsumsi Beragam Jenis Makanan**
   - Setiap kelompok makanan menyediakan nutrisi berbeda yang dibutuhkan tubuh
   - Variasikan pilihan dalam setiap kelompok makanan

2. **Proporsi yang Tepat**
   - 50% piring: sayuran dan buah-buahan
   - 25% piring: karbohidrat kompleks (biji-bijian utuh)
   - 25% piring: protein (daging tanpa lemak, ikan, telur, kacang-kacangan)

3. **Kecukupan dan Tidak Berlebihan**
   - Perhatikan ukuran porsi
   - Hindari makan berlebihan, bahkan untuk makanan sehat

## Panduan Kelompok Makanan

### Karbohidrat
- Pilih karbohidrat kompleks: nasi merah, roti gandum, oatmeal, quinoa
- Batasi karbohidrat olahan: roti putih, nasi putih, pasta biasa

### Protein
- Pilih sumber protein tanpa lemak: ayam tanpa kulit, ikan, telur
- Protein nabati: tahu, tempe, kacang-kacangan
- Batasi daging merah dan daging olahan

### Sayuran dan Buah
- Makan minimal 5 porsi sayur dan buah setiap hari
- Pilih yang beragam warna untuk mendapatkan berbagai nutrisi
- Utamakan buah utuh daripada jus buah

### Lemak Sehat
- Sumber lemak sehat: alpukat, kacang-kacangan, minyak zaitun, ikan berlemak
- Batasi lemak jenuh dan lemak trans

### Cairan
- Minum 8 gelas air putih setiap hari
- Batasi minuman manis dan berkafein

## Menu Harian yang Disarankan

### Sarapan
- Oatmeal dengan buah-buahan dan kacang almond
- Telur rebus dengan roti gandum
- Smoothie dengan yogurt, buah, dan bayam

### Makan Siang
- Salad dengan protein (ayam/tahu) dan vinaigrette
- Sandwich gandum dengan protein dan sayuran
- Nasi merah dengan tumis sayur dan protein

### Makan Malam
- Ikan panggang dengan sayuran panggang dan quinoa
- Sup kacang-kacangan dengan roti gandum
- Stir-fry sayuran dengan tahu dan beras merah

### Camilan Sehat
- Buah segar
- Yogurt tanpa gula dengan buah
- Kacang-kacangan tanpa garam

Ingat, pola makan seimbang harus disesuaikan dengan kebutuhan individu. Konsultasikan dengan ahli gizi untuk mendapatkan rekomendasi yang lebih personal sesuai dengan kondisi kesehatan Anda.`,
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
    tags: ["nutrisi", "pola makan", "kesehatan"],
    isPopular: true
  },
  {
    id: "ex-1",
    category: "exercise",
    title: "Panduan Olahraga untuk Pemula",
    summary: "Cara memulai rutinitas olahraga yang konsisten dan efektif",
    content: `# Panduan Olahraga untuk Pemula

Memulai perjalanan kebugaran bisa terasa menantang bagi pemula. Panduan ini akan membantu Anda memulai rutinitas olahraga yang konsisten dan efektif.

## Persiapan Awal

1. **Konsultasi Medis**
   - Lakukan pemeriksaan kesehatan sebelum memulai program olahraga
   - Identifikasi keterbatasan atau kondisi khusus yang perlu diperhatikan

2. **Tetapkan Tujuan Realistis**
   - Mulai dengan target kecil dan bertahap
   - Contoh: berjalan 15 menit, 3x seminggu

3. **Siapkan Perlengkapan yang Sesuai**
   - Sepatu yang nyaman dan mendukung
   - Pakaian yang menyerap keringat
   - Botol air minum

## Program Olahraga untuk Pemula

### Minggu 1-2: Membangun Dasar
- **Senin, Rabu, Jumat**: Berjalan cepat 15-20 menit
- **Selasa, Kamis**: Peregangan ringan 10-15 menit
- **Sabtu, Minggu**: Istirahat atau aktivitas ringan seperti berjalan santai

### Minggu 3-4: Peningkatan Intensitas
- **Senin, Rabu, Jumat**: Jalan cepat 25-30 menit atau jogging ringan 15 menit
- **Selasa, Kamis**: Latihan kekuatan dasar (squat, push-up dengan bantuan, plank 15 detik)
- **Sabtu**: Aktivitas outdoor ringan (bersepeda, berenang)
- **Minggu**: Istirahat

### Minggu 5-6: Kombinasi Kardio dan Kekuatan
- **Senin, Jumat**: Kardio 30 menit (jalan cepat/jogging/bersepeda)
- **Selasa, Kamis**: Latihan kekuatan (tambahkan repetisi dan variasi)
- **Rabu**: Yoga atau peregangan 20-30 menit
- **Sabtu**: Aktivitas outdoor 45-60 menit
- **Minggu**: Istirahat

## Tips Konsistensi

1. **Jadwalkan Olahraga**
   - Tetapkan jadwal tetap seperti janji penting
   - Siapkan peralatan/pakaian olahraga dari malam sebelumnya

2. **Temukan Aktivitas yang Menyenangkan**
   - Coba berbagai jenis olahraga hingga menemukan yang Anda nikmati
   - Bergabung dengan kelas atau komunitas olahraga

3. **Pantau Kemajuan**
   - Catat aktivitas dan bagaimana perasaan Anda
   - Rayakan pencapaian kecil

4. **Hindari Overtraining**
   - Perhatikan tanda-tanda kelelahan berlebih
   - Istirahat adalah bagian penting dari proses kebugaran

## Tanda untuk Berhenti atau Mengurangi Intensitas

- Nyeri dada
- Sesak napas berlebihan
- Pusing atau mual
- Nyeri sendi atau otot yang tajam (berbeda dengan rasa nyeri normal)

Ingat, perjalanan kebugaran adalah maraton, bukan sprint. Konsistensi jangka panjang lebih penting daripada intensitas tinggi yang tidak berkelanjutan. Sesuaikan program ini dengan kebutuhan dan kemampuan Anda.`,
    imageUrl: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
    tags: ["olahraga", "fitness", "pemula"]
  },
  {
    id: "men-1",
    category: "mental",
    title: "Teknik Manajemen Stres dalam Keseharian",
    summary: "Cara efektif mengelola stres untuk kesehatan mental yang lebih baik",
    content: `# Teknik Manajemen Stres dalam Keseharian

Stres adalah respon alami tubuh terhadap tuntutan dan tekanan. Namun, stres berkelanjutan dapat berdampak negatif pada kesehatan fisik dan mental. Berikut adalah teknik efektif untuk mengelola stres sehari-hari.

## Mengenali Tanda Stres

Penting untuk mengenali tanda-tanda stres pada diri sendiri, seperti:

- Perubahan suasana hati (mudah marah, cemas, depresi)
- Gangguan tidur
- Sakit kepala atau nyeri tubuh
- Kelelahan
- Sulit berkonsentrasi
- Perubahan nafsu makan

## Teknik Pernapasan

1. **Pernapasan Diafragma**
   - Tarik napas melalui hidung selama 4 hitungan
   - Tahan selama 2 hitungan
   - Hembuskan melalui mulut selama 6 hitungan
   - Ulangi 5-10 kali

2. **Pernapasan Kotak**
   - Tarik napas selama 4 hitungan
   - Tahan selama 4 hitungan
   - Hembuskan selama 4 hitungan
   - Tahan selama 4 hitungan
   - Ulangi siklus ini selama 3-5 menit

## Mindfulness dan Meditasi

1. **Meditasi Singkat**
   - Luangkan 5-10 menit setiap hari
   - Fokus pada pernapasan atau sensasi tubuh
   - Jika pikiran berkelana, kembalikan fokus dengan lembut

2. **Mindful Activity**
   - Pilih aktivitas rutin (makan, berjalan, mandi)
   - Lakukan dengan penuh kesadaran
   - Perhatikan sensasi, suara, dan pengalaman saat ini

## Manajemen Waktu

1. **Prioritas**
   - Daftar tugas berdasarkan urgensi dan kepentingan
   - Fokus pada 3 prioritas utama setiap hari

2. **Batasi Multitasking**
   - Selesaikan satu tugas sebelum beralih ke tugas lain
   - Tetapkan batas waktu untuk setiap tugas

3. **Belajar Mengatakan Tidak**
   - Kenali batasan Anda
   - Jangan berkomitmen berlebihan

## Aktivitas Fisik

1. **Olahraga Teratur**
   - 30 menit aktivitas moderat, 5x seminggu
   - Pilih aktivitas yang menyenangkan

2. **Peregangan Singkat**
   - Lakukan peregangan 5 menit setiap 1-2 jam
   - Terutama saat bekerja di depan komputer

## Hubungan Sosial

1. **Luangkan Waktu dengan Orang Terdekat**
   - Jadwalkan waktu bersama keluarga dan teman
   - Berbagi perasaan dan kekhawatiran

2. **Bergabung dengan Komunitas**
   - Kelompok hobi, keagamaan, atau sosial
   - Volunteer untuk kegiatan yang bermakna

## Kebiasaan Sehat

1. **Pola Tidur**
   - Tidur 7-8 jam setiap malam
   - Buat rutinitas tidur yang konsisten

2. **Nutrisi Seimbang**
   - Batasi kafein dan gula
   - Konsumsi makanan kaya antioksidan dan omega-3

3. **Batasi Media dan Berita**
   - Tetapkan batas waktu untuk konsumsi berita dan media sosial
   - Pertimbangkan "digital detox" berkala

## Kapan Mencari Bantuan Profesional

Jika stres mengganggu fungsi sehari-hari atau berlangsung lebih dari beberapa minggu, pertimbangkan untuk berkonsultasi dengan profesional kesehatan mental.

Ingat, manajemen stres adalah keterampilan yang dapat dikembangkan dengan latihan. Eksperimen dengan berbagai teknik dan temukan yang paling efektif untuk Anda.`,
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
    tags: ["kesehatan mental", "stres", "mindfulness"]
  },
  {
    id: "sle-1",
    category: "sleep",
    title: "7 Kebiasaan untuk Tidur Berkualitas",
    summary: "Tips meningkatkan kualitas tidur untuk kesehatan optimal",
    content: `# 7 Kebiasaan untuk Tidur Berkualitas

Tidur berkualitas sangat penting untuk kesehatan dan kesejahteraan secara keseluruhan. Berikut adalah 7 kebiasaan yang dapat membantu Anda meningkatkan kualitas tidur.

## 1. Pertahankan Jadwal Tidur yang Konsisten

- Tidurlah dan bangunlah pada waktu yang sama setiap hari, termasuk akhir pekan
- Konsistensi membantu mengatur jam biologis tubuh (ritme sirkadian)
- Target 7-8 jam tidur untuk orang dewasa

## 2. Ciptakan Lingkungan Tidur yang Optimal

- **Suhu**: Pertahankan suhu kamar sekitar 18-20°C (65-68°F)
- **Cahaya**: Gunakan tirai gelap atau penutup mata untuk meminimalkan paparan cahaya
- **Suara**: Gunakan penyumbat telinga atau mesin suara putih jika diperlukan
- **Kenyamanan**: Investasikan pada kasur dan bantal yang nyaman

## 3. Batasi Paparan Cahaya Biru di Malam Hari

- Matikan perangkat elektronik (ponsel, tablet, komputer) 1-2 jam sebelum tidur
- Gunakan fitur "night mode" atau kacamata anti cahaya biru jika harus menggunakan perangkat
- Cahaya biru menekan produksi melatonin, hormon yang mengatur tidur

## 4. Perhatikan Asupan Makanan dan Minuman

- Hindari kafein 6 jam sebelum tidur
- Batasi alkohol menjelang tidur (meskipun dapat membantu tertidur, alkohol mengganggu kualitas tidur)
- Hindari makan berat 2-3 jam sebelum tidur
- Camilan ringan yang mengandung triptofan (susu, pisang, kacang almond) dapat membantu

## 5. Aktivitas Fisik Teratur

- Berolahraga secara teratur dapat meningkatkan kualitas tidur
- Hindari olahraga intensif 2-3 jam sebelum tidur
- Aktivitas ringan seperti yoga atau peregangan di malam hari dapat membantu rileksasi

## 6. Kembangkan Rutinitas Sebelum Tidur

Lakukan aktivitas menenangkan 30-60 menit sebelum tidur, seperti:
- Mandi air hangat
- Membaca buku (hindari e-reader)
- Meditasi atau pernapasan dalam
- Journaling
- Minum teh herbal tanpa kafein (kamomil, lavender, valerian)

## 7. Manajemen Stres dan Kecemasan

- Praktek mindfulness atau meditasi sebelum tidur
- Catat kekhawatiran atau tugas untuk esok hari untuk "melepaskannya" dari pikiran
- Teknik pernapasan 4-7-8: tarik napas selama 4 detik, tahan selama 7 detik, hembuskan selama 8 detik

## Tips Tambahan

- Jika tidak bisa tidur setelah 20 menit, bangun dan lakukan aktivitas menenangkan hingga merasa mengantuk
- Batasi tidur siang hingga 20-30 menit dan hindari tidur siang setelah pukul 3 sore
- Paparan sinar matahari di pagi hari membantu mengatur ritme sirkadian

## Kapan Harus Berkonsultasi dengan Dokter

Jika Anda telah mencoba tips di atas namun masih mengalami masalah tidur yang signifikan selama lebih dari sebulan, pertimbangkan untuk berkonsultasi dengan profesional kesehatan. Gangguan tidur seperti insomnia, sleep apnea, atau restless leg syndrome memerlukan penanganan medis.

Ingat, tidur berkualitas adalah investasi untuk kesehatan jangka panjang Anda.`,
    imageUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
    tags: ["tidur", "insomnia", "kesehatan"],
    isNew: true
  },
  {
    id: "wel-1",
    category: "wellness",
    title: "Keseimbangan Hidup Sehat: Fisik, Mental dan Sosial",
    summary: "Panduan mencapai keseimbangan optimal untuk kesehatan holistik",
    content: `# Keseimbangan Hidup Sehat: Fisik, Mental dan Sosial

Kesehatan yang optimal tidak hanya tentang kesehatan fisik, tetapi juga mencakup kesejahteraan mental dan sosial. Artikel ini membahas pendekatan holistik untuk mencapai keseimbangan dalam semua aspek kesehatan.

## Pilar Kesehatan Holistik

### 1. Kesehatan Fisik
- **Nutrisi Seimbang**
- **Aktivitas Fisik Teratur**
- **Tidur Berkualitas**
- **Pemeriksaan Kesehatan Rutin**

### 2. Kesehatan Mental
- **Manajemen Stres**
- **Mindfulness dan Meditasi**
- **Pengembangan Diri**
- **Regulasi Emosi**

### 3. Kesehatan Sosial
- **Hubungan Berkualitas**
- **Dukungan Sosial**
- **Keterlibatan Komunitas**
- **Keseimbangan Kerja dan Kehidupan**

## Panduan Praktis Mencapai Keseimbangan

### Kesehatan Fisik

#### Nutrisi Seimbang
- Konsumsi makanan bervariasi dari semua kelompok makanan
- Makan cukup, tidak berlebihan
- Fokus pada makanan utuh, bukan makanan olahan
- Minum air yang cukup (8 gelas/hari)

#### Aktivitas Fisik
- Minimal 150 menit aktivitas moderat per minggu
- Kombinasikan latihan kardio, kekuatan, dan fleksibilitas
- Temukan aktivitas yang Anda nikmati
- Kurangi waktu duduk dan tidak aktif

#### Tidur Berkualitas
- Usahakan 7-8 jam tidur setiap malam
- Buat rutinitas tidur yang konsisten
- Ciptakan lingkungan tidur yang optimal
- Prioritaskan tidur sebagai kebutuhan kesehatan, bukan kemewahan

### Kesehatan Mental

#### Manajemen Stres
- Kenali pemicu stres personal
- Kembangkan strategi coping yang sehat
- Praktekkan teknik relaksasi (pernapasan dalam, PMR)
- Tetapkan batasan yang sehat

#### Mindfulness dan Pengembangan Diri
- Luangkan waktu untuk refleksi harian
- Kembangkan hobi dan minat baru
- Tetapkan tujuan pribadi yang bermakna
- Praktek gratitude

#### Kesehatan Emosional
- Kenali dan ungkapkan emosi dengan cara yang sehat
- Cari bantuan profesional jika diperlukan
- Kembangkan resiliensi
- Praktek self-compassion

### Kesehatan Sosial

#### Hubungan Berkualitas
- Investasikan waktu untuk hubungan dekat
- Kembangkan keterampilan komunikasi
- Berikan dan terima dukungan
- Tetapkan batasan yang sehat dalam hubungan

#### Keterlibatan Komunitas
- Volunteer untuk kegiatan bermakna
- Bergabung dengan kelompok dengan minat serupa
- Kontribusikan keahlian Anda
- Bangun koneksi beragam

#### Keseimbangan Kerja-Kehidupan
- Tetapkan batasan antara waktu kerja dan pribadi
- Prioritaskan waktu untuk orang tercinta dan aktivitas bermakna
- Belajar mengatakan "tidak"
- Evaluasi prioritas secara berkala

## Memulai Perjalanan Kesehatan Holistik

1. **Evaluasi Status Saat Ini**
   - Nilai keseimbangan dalam berbagai aspek kesehatan
   - Identifikasi area yang perlu perhatian

2. **Tetapkan Tujuan Realistis**
   - Fokus pada perubahan kecil dan bertahap
   - Buat tujuan SMART (Specific, Measurable, Achievable, Relevant, Time-bound)

3. **Kembangkan Rencana**
   - Identifikasi langkah konkret untuk mencapai tujuan
   - Antisipasi tantangan dan strategi untuk mengatasinya

4. **Pantau Kemajuan**
   - Catat perubahan dan bagaimana perasaan Anda
   - Sesuaikan rencana sesuai kebutuhan

5. **Jaga Konsistensi dan Fleksibilitas**
   - Konsisten dengan rutinitas sehat
   - Fleksibel saat menghadapi tantangan

Ingat, kesehatan holistik adalah perjalanan, bukan tujuan. Fokus pada kemajuan bertahap dan keseimbangan, bukan kesempurnaan.`,
    imageUrl: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
    tags: ["wellness", "keseimbangan", "holistik"],
    isPopular: true
  },
  {
    id: "pre-1",
    category: "prevention",
    title: "Mencegah Penyakit Kardiovaskular: Panduan Lengkap",
    summary: "Strategi efektif untuk menurunkan risiko penyakit jantung dan pembuluh darah",
    content: `# Mencegah Penyakit Kardiovaskular: Panduan Lengkap

Penyakit kardiovaskular (PKV) tetap menjadi penyebab utama kematian di seluruh dunia. Namun, dengan modifikasi gaya hidup dan pemantauan kesehatan yang tepat, banyak risiko PKV dapat dikurangi secara signifikan.

## Memahami Penyakit Kardiovaskular

Penyakit kardiovaskular mencakup berbagai kondisi yang mempengaruhi jantung dan pembuluh darah, termasuk:
- Penyakit jantung koroner
- Penyakit arteri perifer
- Stroke
- Gagal jantung
- Hipertensi
- Aritmia

## Faktor Risiko

### Faktor Risiko yang Tidak Dapat Dimodifikasi
- Usia (risiko meningkat seiring bertambahnya usia)
- Jenis kelamin (pria memiliki risiko lebih tinggi sampai usia tertentu)
- Riwayat keluarga
- Etnis

### Faktor Risiko yang Dapat Dimodifikasi
- Hipertensi (tekanan darah tinggi)
- Kadar kolesterol tinggi
- Merokok
- Diabetes
- Obesitas
- Gaya hidup tidak aktif
- Pola makan tidak sehat
- Stres berlebihan
- Konsumsi alkohol berlebihan

## Strategi Pencegahan

### 1. Pola Makan Sehat untuk Jantung

#### Prinsip Utama
- Batasi lemak jenuh dan trans fat
- Fokus pada lemak sehat (omega-3, minyak zaitun)
- Perbanyak serat (buah, sayur, biji-bijian utuh)
- Batasi garam (sodium)
- Batasi gula tambahan

#### Pola Makan yang Direkomendasikan
- **Pola Makan Mediterania**
  - Tinggi buah, sayur, biji-bijian utuh
  - Minyak zaitun sebagai sumber lemak utama
  - Konsumsi ikan yang tinggi
  - Konsumsi daging merah terbatas

- **Pola Makan DASH (Dietary Approaches to Stop Hypertension)**
  - Dirancang khusus untuk menurunkan tekanan darah
  - Kaya buah, sayur, produk susu rendah lemak
  - Rendah sodium

### 2. Aktivitas Fisik Teratur

- Minimal 150 menit aktivitas intensitas sedang per minggu
- Atau 75 menit aktivitas intensitas tinggi
- Kombinasikan latihan kardiovaskular dan latihan kekuatan
- Kurangi waktu tidak aktif
- Aktivitas sehari-hari (naik tangga, berkebun) juga bermanfaat

### 3. Manajemen Berat Badan

- Pertahankan BMI dalam rentang normal (18.5-24.9)
- Fokus pada penurunan berat badan bertahap dan berkelanjutan
- Penurunan 5-10% dari berat badan awal sudah memberikan manfaat kesehatan
- Kombinasikan diet dan olahraga

### 4. Berhenti Merokok

- Risiko PKV mulai menurun dalam waktu 24 jam setelah berhenti
- Setelah 1 tahun berhenti, risiko PKV turun hingga 50%
- Pertimbangkan terapi penggantian nikotin, konseling, atau bantuan profesional
- Hindari juga paparan asap rokok pasif

### 5. Manajemen Stres

- Praktek teknik relaksasi (meditasi, pernapasan dalam)
- Aktivitas fisik membantu mengurangi stres
- Cukup tidur (7-8 jam per malam)
- Pertimbangkan konseling jika stres berkepanjangan

### 6. Pemantauan Kesehatan Rutin

- Pemeriksaan tekanan darah regular
- Cek kolesterol dan gula darah
- Pemeriksaan fisik tahunan
- Evaluasi risiko PKV secara berkala

## Kondisi Medis yang Memerlukan Perhatian Khusus

### Hipertensi
- Target tekanan darah: <130/80 mmHg untuk kebanyakan orang
- Pola makan rendah garam, olahraga teratur
- Kepatuhan pada pengobatan jika diresepkan

### Kolesterol Tinggi
- Pantau kadar LDL, HDL, dan trigliserida
- Pola makan rendah lemak jenuh dan trans
- Obat penurun kolesterol jika diindikasikan

### Diabetes
- Kontrol kadar gula darah
- Pemantauan HbA1c rutin
- Manajemen diabetes yang baik mengurangi risiko komplikasi kardiovaskular

## Kapan Harus Mencari Bantuan Medis

Segera cari pertolongan medis jika mengalami:
- Nyeri dada, terutama yang menjalar ke lengan, leher, atau rahang
- Sesak napas yang tiba-tiba
- Kelemahan, mati rasa, atau kesemutan pada satu sisi tubuh
- Gangguan berbicara atau kebingungan mendadak
- Sakit kepala parah yang tiba-tiba

## Kesimpulan

Pencegahan penyakit kardiovaskular adalah tentang perubahan gaya hidup menyeluruh dan pemantauan kesehatan regular. Meskipun beberapa faktor risiko tidak dapat diubah, banyak yang dapat dimodifikasi melalui pilihan hidup sehat. Konsultasikan dengan penyedia layanan kesehatan Anda untuk rencana pencegahan yang disesuaikan dengan faktor risiko individual Anda.`,
    imageUrl: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
    tags: ["jantung", "pencegahan", "kardiovaskular"]
  }
];

export default function TipsSehat() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTip, setSelectedTip] = useState<HealthTip | null>(null);
  const [recommendedTips, setRecommendedTips] = useState<HealthTip[]>([]);
  
  const { toast } = useToast();

  // Simulasi generasi rekomendasi tips kesehatan
  const generateRecommendationsMutation = useMutation({
    mutationFn: async (query: string) => {
      // Simulasi delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulasi rekomendasi berdasarkan query
      // Dalam implementasi asli, ini akan memanggil API AI
      const filteredTips = healthTips.filter(tip => 
        tip.title.toLowerCase().includes(query.toLowerCase()) ||
        tip.summary.toLowerCase().includes(query.toLowerCase()) ||
        tip.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      
      // Jika tidak ada hasil yang ditemukan
      if (filteredTips.length === 0) {
        return { recommendations: healthTips.slice(0, 3) };
      }
      
      return { recommendations: filteredTips.slice(0, 3) };
    },
    onSuccess: (data) => {
      setRecommendedTips(data.recommendations);
      
      toast({
        title: "Rekomendasi Siap",
        description: "Kami telah menemukan artikel yang sesuai untuk Anda",
      });
    },
    onError: () => {
      toast({
        title: "Gagal Menghasilkan Rekomendasi",
        description: "Terjadi kesalahan saat mencari tips kesehatan. Silakan coba lagi.",
        variant: "destructive",
      });
    },
  });

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Input Kosong",
        description: "Silakan masukkan kata kunci untuk mencari",
        variant: "destructive",
      });
      return;
    }
    
    generateRecommendationsMutation.mutate(searchQuery);
  };

  // Filter tips berdasarkan kategori yang dipilih
  const filteredTips = selectedCategory 
    ? healthTips.filter(tip => tip.category === selectedCategory)
    : healthTips;

  // Render konten artikel terpilih dengan format markdown sederhana
  const renderContent = (content: string) => {
    // Render heading dan paragraphs sederhana
    const formattedContent = content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-2xl font-bold mt-4 mb-3">{line.substring(2)}</h1>;
        } else if (line.startsWith('## ')) {
          return <h2 key={index} className="text-xl font-semibold mt-4 mb-2">{line.substring(3)}</h2>;
        } else if (line.startsWith('### ')) {
          return <h3 key={index} className="text-lg font-medium mt-3 mb-2">{line.substring(4)}</h3>;
        } else if (line.startsWith('#### ')) {
          return <h4 key={index} className="text-base font-medium mt-2 mb-1">{line.substring(5)}</h4>;
        } else if (line.startsWith('- ')) {
          return <li key={index} className="ml-5 list-disc my-1">{line.substring(2)}</li>;
        } else if (line.match(/^\d+\. /)) {
          const text = line.replace(/^\d+\. /, '');
          return <li key={index} className="ml-5 list-decimal my-1">{text}</li>;
        } else if (line === '') {
          return <br key={index} />;
        } else {
          return <p key={index} className="my-2">{line}</p>;
        }
      });
    
    return <div className="prose prose-slate max-w-none">{formattedContent}</div>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-6">
      <Breadcrumb 
        items={[
          { label: "Tools", path: "/tools" },
          { label: "Tips Hidup Sehat", path: "/tools/tips-sehat", isActive: true }
        ]} 
      />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
          <Heart className="text-red-600 mr-2" /> 
          Tips Hidup Sehat
        </h1>
        <p className="text-gray-600 mt-2">
          Dapatkan informasi kesehatan terpercaya untuk gaya hidup sehat sehari-hari
        </p>
      </div>
      
      {selectedTip ? (
        // Tampilan artikel detail
        <div>
          <Button 
            variant="outline" 
            onClick={() => setSelectedTip(null)}
            className="mb-4"
          >
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" /> Kembali ke Daftar Artikel
          </Button>
          
          <Card>
            <CardContent className="p-6">
              {selectedTip.imageUrl && (
                <div className="rounded-lg overflow-hidden mb-6 max-h-[300px]">
                  <img
                    src={selectedTip.imageUrl}
                    alt={selectedTip.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedTip.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="bg-gray-100">
                      {tag}
                    </Badge>
                  ))}
                  {selectedTip.isNew && (
                    <Badge className="bg-green-600">Baru</Badge>
                  )}
                  {selectedTip.isPopular && (
                    <Badge className="bg-amber-600">Populer</Badge>
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-2">{selectedTip.title}</h2>
                <p className="text-gray-600 mb-6">{selectedTip.summary}</p>
                
                {/* Render konten artikel */}
                {renderContent(selectedTip.content)}
                
                {/* Bagian bawah artikel */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="font-medium mb-3">Artikel Terkait</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {healthTips
                      .filter(tip => 
                        tip.id !== selectedTip.id && 
                        (tip.category === selectedTip.category || 
                         tip.tags.some(tag => selectedTip.tags.includes(tag)))
                      )
                      .slice(0, 3)
                      .map(tip => (
                        <div 
                          key={tip.id}
                          className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedTip(tip)}
                        >
                          <h4 className="font-medium">{tip.title}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2 mt-1">{tip.summary}</p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Tampilan daftar artikel
        <>
          {/* Search Bar dan Filter */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="md:col-span-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Cari tips kesehatan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                />
                <Button 
                  onClick={handleSearch}
                  disabled={generateRecommendationsMutation.isPending}
                >
                  {generateRecommendationsMutation.isPending ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div>
              <Select 
                value={selectedCategory || ""} 
                onValueChange={(value) => setSelectedCategory(value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {healthCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Kategori */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Kategori Kesehatan</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {healthCategories.map(category => (
                <Card 
                  key={category.id} 
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    selectedCategory === category.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${category.color}`}>
                      {category.icon}
                    </div>
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{category.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Rekomendasi */}
          {recommendedTips.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-amber-500" /> 
                Rekomendasi untuk Anda
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendedTips.map(tip => (
                  <Card 
                    key={tip.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
                    onClick={() => setSelectedTip(tip)}
                  >
                    {tip.imageUrl && (
                      <div className="h-40 overflow-hidden">
                        <img
                          src={tip.imageUrl}
                          alt={tip.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="flex gap-2 mb-2">
                        {tip.isNew && (
                          <Badge className="bg-green-600">Baru</Badge>
                        )}
                        {tip.isPopular && (
                          <Badge className="bg-amber-600">Populer</Badge>
                        )}
                      </div>
                      <h3 className="font-semibold mb-1 line-clamp-2">{tip.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{tip.summary}</p>
                      <div className="flex flex-wrap gap-1">
                        {tip.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* Artikel Kesehatan */}
          <Tabs defaultValue="all" className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Artikel Kesehatan</h2>
              <TabsList>
                <TabsTrigger value="all">Semua</TabsTrigger>
                <TabsTrigger value="new">Terbaru</TabsTrigger>
                <TabsTrigger value="popular">Populer</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTips.map(tip => (
                  <Card 
                    key={tip.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
                    onClick={() => setSelectedTip(tip)}
                  >
                    {tip.imageUrl && (
                      <div className="h-40 overflow-hidden">
                        <img
                          src={tip.imageUrl}
                          alt={tip.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="flex gap-2 mb-2">
                        {tip.isNew && (
                          <Badge className="bg-green-600">Baru</Badge>
                        )}
                        {tip.isPopular && (
                          <Badge className="bg-amber-600">Populer</Badge>
                        )}
                      </div>
                      <h3 className="font-semibold mb-1 line-clamp-2">{tip.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{tip.summary}</p>
                      <div className="flex flex-wrap gap-1">
                        {tip.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="new">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTips
                  .filter(tip => tip.isNew)
                  .map(tip => (
                    <Card 
                      key={tip.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
                      onClick={() => setSelectedTip(tip)}
                    >
                      {tip.imageUrl && (
                        <div className="h-40 overflow-hidden">
                          <img
                            src={tip.imageUrl}
                            alt={tip.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <div className="flex gap-2 mb-2">
                          <Badge className="bg-green-600">Baru</Badge>
                        </div>
                        <h3 className="font-semibold mb-1 line-clamp-2">{tip.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{tip.summary}</p>
                        <div className="flex flex-wrap gap-1">
                          {tip.tags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="popular">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTips
                  .filter(tip => tip.isPopular)
                  .map(tip => (
                    <Card 
                      key={tip.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
                      onClick={() => setSelectedTip(tip)}
                    >
                      {tip.imageUrl && (
                        <div className="h-40 overflow-hidden">
                          <img
                            src={tip.imageUrl}
                            alt={tip.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <div className="flex gap-2 mb-2">
                          <Badge className="bg-amber-600">Populer</Badge>
                        </div>
                        <h3 className="font-semibold mb-1 line-clamp-2">{tip.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{tip.summary}</p>
                        <div className="flex flex-wrap gap-1">
                          {tip.tags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Banner Informasi */}
          <div className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-semibold mb-2">Butuh Konsultasi Kesehatan?</h2>
              <p className="max-w-lg">
                Hubungkan dengan Asisten Dokter AI kami untuk mendapatkan informasi kesehatan yang lebih personal dan jawaban atas pertanyaan kesehatan Anda.
              </p>
            </div>
            <Button 
              variant="secondary" 
              className="whitespace-nowrap"
              onClick={() => window.open("/tools/konsultasi-kesehatan", "_self")}
            >
              <Stethoscope className="h-4 w-4 mr-2" />
              Konsultasi Sekarang
            </Button>
          </div>
        </>
      )}
    </div>
  );
}