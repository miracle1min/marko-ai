import { Link } from "wouter";
import { Twitter, Linkedin, Github } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const footerLinks = {
    produk: [
      { name: "AI Chat", href: "/chat" },
      { name: "Pembuat Konten", href: "/tools/content-generator" },
      { name: "Pembuat Kode", href: "/tools/code-generator" },
      { name: "Semua Alat", href: "/tools" },
      { name: "Harga", href: "/pricing" },
    ],
    perusahaan: [
      { name: "Tentang Kami", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Karir", href: "/careers" },
      { name: "Kontak", href: "/kontak" },
    ],
    sumber: [
      { name: "Dokumentasi", href: "/docs" },
      { name: "API", href: "/api-docs" },
      { name: "Status", href: "/status" },
    ],
    legal: [
      { name: "Privasi", href: "/privacy" },
      { name: "Ketentuan", href: "/terms" },
      { name: "Cookies", href: "/cookies" },
    ],
  };

  const socialLinks = [
    { name: "Twitter", icon: <Twitter className="h-5 w-5" /> },
    { name: "LinkedIn", icon: <Linkedin className="h-5 w-5" /> },
    { name: "GitHub", icon: <Github className="h-5 w-5" /> },
  ];

  return (
    <footer className="bg-[#1A2136] border-t border-[#2D3653]/50 pt-12 pb-8 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          <div>
            <Link href="/" className="text-white font-bold text-xl flex items-center mb-4">
              <svg className="mr-1 h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 4L20 7L17 10M12 4L6 20M7 4L4 7L7 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="ml-1">AI</span>
            </Link>
            <div className="flex space-x-3 mt-4">
              {socialLinks.map((social, index) => (
                <Link key={index} href="/" className="text-white/60 hover:text-white transition">
                  {social.icon}
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white/80 mb-4">Produk</h3>
            <ul className="space-y-3">
              {footerLinks.produk.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-white/60 hover:text-white text-sm transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white/80 mb-4">Perusahaan</h3>
            <ul className="space-y-3">
              {footerLinks.perusahaan.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-white/60 hover:text-white text-sm transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white/80 mb-4">Sumber Daya</h3>
            <ul className="space-y-3">
              {footerLinks.sumber.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-white/60 hover:text-white text-sm transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white/80 mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-white/60 hover:text-white text-sm transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <Separator className="bg-[#2D3653]/50 my-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">© {new Date().getFullYear()} Marko AI. Seluruh hak cipta dilindungi.</p>
          <div className="mt-4 md:mt-0 text-sm text-white/60">
            Dikembangkan dengan teknologi AI canggih
          </div>
        </div>
      </div>
    </footer>
  );
}
