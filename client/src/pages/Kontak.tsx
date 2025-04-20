import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import AnimatedPage from "@/components/AnimatedPage";

export default function Kontak() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      // In a real application, you would send this data to your server
      // For now, we'll just show a success message
      toast({
        title: "Pesan Terkirim",
        description: "Terima kasih telah menghubungi kami. Kami akan segera membalas pesan Anda.",
      });
      
      // Reset form
      setName("");
      setEmail("");
      setMessage("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl mb-4">
            Hubungi Kami
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            Kami siap membantu Anda dengan semua pertanyaan dan kebutuhan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="border border-gray-200 hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-primary" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                <a href="mailto:demarkoblog@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                  demarkoblog@gmail.com
                </a>
              </CardDescription>
              <p className="text-sm text-gray-500 mt-1">
                Kami akan membalas email Anda dalam 24 jam.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-primary" />
                Telepon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                +62 812 3456 7890
              </CardDescription>
              <p className="text-sm text-gray-500 mt-1">
                Tersedia Senin-Jumat, 09:00 - 17:00 WIB
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-primary" />
                Lokasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Jakarta, Indonesia
              </CardDescription>
              <p className="text-sm text-gray-500 mt-1">
                Silahkan membuat janji temu terlebih dahulu
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Kirim Pesan
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nama Lengkap
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama lengkap Anda"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan alamat email Anda"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Pesan
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tulis pesan Anda di sini..."
                    rows={6}
                    required
                  />
                </div>
                
                <div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Mengirim...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="mr-2 h-4 w-4" />
                        Kirim Pesan
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-6 px-4 py-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
          <h2 className="text-2xl font-bold text-center mb-8">
            Pertanyaan yang Sering Diajukan
          </h2>
          <div className="max-w-3xl mx-auto grid grid-cols-1 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Apa saja jenis layanan yang ditawarkan?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Kami menawarkan berbagai layanan AI termasuk pembuatan konten, pembuatan kode, analisis kesehatan, dan banyak alat AI inovatif lainnya yang dirancang untuk meningkatkan produktivitas Anda.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Bagaimana cara berlangganan layanan premium?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Anda dapat berlangganan layanan premium melalui halaman Pricing. Kami menawarkan berbagai paket yang dapat disesuaikan dengan kebutuhan dan anggaran Anda.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Apakah ada uji coba gratis yang tersedia?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Ya, kami menyediakan uji coba gratis selama 7 hari untuk semua paket premium. Anda dapat menjelajahi semua fitur tanpa batas selama periode uji coba.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}