import { Sparkles, Wand2, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function FeaturedTools() {
  const featuredTools = [
    {
      title: "SEO Optimizer AI",
      description: "Optimasi SEO website Anda secara otomatis dengan teknologi AI mutakhir.",
      badge: { text: "Popular", color: "bg-green-100 text-green-800" },
      icon: <Sparkles className="h-4 w-4 mr-2" />,
      buttonText: "Gunakan Tool",
      image: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" className="w-full h-full">
          <rect width="800" height="400" fill="#f0f9ff" />
          <path d="M0,200 Q200,100 400,200 T800,200" stroke="#1a73e8" strokeWidth="5" fill="none" />
          <circle cx="200" cy="150" r="30" fill="#34a853" />
          <circle cx="400" cy="200" r="40" fill="#1a73e8" />
          <circle cx="600" cy="150" r="20" fill="#fbbc05" />
          <polygon points="100,300 300,250 500,300 700,250" fill="#ea4335" fillOpacity="0.3" />
        </svg>
      )
    },
    {
      title: "Artikel Generator",
      description: "Buat artikel berkualitas tinggi dalam hitungan detik dengan bantuan Gemini Flash 2.0.",
      badge: { text: "New", color: "bg-blue-100 text-blue-800" },
      icon: <Wand2 className="h-4 w-4 mr-2" />,
      buttonText: "Gunakan Tool",
      image: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" className="w-full h-full">
          <rect width="800" height="400" fill="#eff6ff" />
          <rect x="50" y="50" width="700" height="50" rx="5" fill="#1a73e8" fillOpacity="0.2" />
          <rect x="50" y="120" width="600" height="20" rx="5" fill="#1a73e8" fillOpacity="0.1" />
          <rect x="50" y="150" width="640" height="20" rx="5" fill="#1a73e8" fillOpacity="0.1" />
          <rect x="50" y="180" width="590" height="20" rx="5" fill="#1a73e8" fillOpacity="0.1" />
          <rect x="50" y="210" width="620" height="20" rx="5" fill="#1a73e8" fillOpacity="0.1" />
          <rect x="50" y="240" width="580" height="20" rx="5" fill="#1a73e8" fillOpacity="0.1" />
          <rect x="50" y="270" width="650" height="20" rx="5" fill="#1a73e8" fillOpacity="0.1" />
          <rect x="50" y="300" width="630" height="20" rx="5" fill="#1a73e8" fillOpacity="0.1" />
          <rect x="50" y="330" width="600" height="20" rx="5" fill="#1a73e8" fillOpacity="0.1" />
        </svg>
      )
    },
    {
      title: "Keyword Research Pro",
      description: "Temukan keyword dengan potensi traffic tinggi dan kompetisi rendah untuk website Anda.",
      badge: { text: "Premium", color: "bg-yellow-100 text-yellow-800" },
      icon: <Key className="h-4 w-4 mr-2" />,
      buttonText: "Gunakan Tool",
      image: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" className="w-full h-full">
          <rect width="800" height="400" fill="#fef9c3" />
          <text x="100" y="100" fontSize="24" fill="#1a73e8" fontWeight="bold">Keywords</text>
          <rect x="100" y="120" width="200" height="20" rx="5" fill="#34a853" fillOpacity="0.8" />
          <text x="310" y="135" fontSize="14" fill="#333">5,400</text>
          <rect x="100" y="150" width="150" height="20" rx="5" fill="#1a73e8" fillOpacity="0.7" />
          <text x="260" y="165" fontSize="14" fill="#333">3,200</text>
          <rect x="100" y="180" width="250" height="20" rx="5" fill="#fbbc05" fillOpacity="0.9" />
          <text x="360" y="195" fontSize="14" fill="#333">8,100</text>
          <rect x="100" y="210" width="120" height="20" rx="5" fill="#1a73e8" fillOpacity="0.6" />
          <text x="230" y="225" fontSize="14" fill="#333">2,400</text>
          <rect x="100" y="240" width="180" height="20" rx="5" fill="#34a853" fillOpacity="0.6" />
          <text x="290" y="255" fontSize="14" fill="#333">4,600</text>
          <circle cx="600" cy="200" r="100" fill="none" stroke="#1a73e8" strokeWidth="3" />
          <path d="M570,170 L630,230" stroke="#1a73e8" strokeWidth="3" />
          <path d="M630,170 L570,230" stroke="#1a73e8" strokeWidth="3" />
          <circle cx="600" cy="200" r="70" fill="none" stroke="#fbbc05" strokeWidth="2" />
        </svg>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-gray-900">Tools Favorit Pengguna</h2>
        <p className="text-gray-600 mt-2">Tools AI terpopuler untuk mengoptimasi website Anda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredTools.map((tool, index) => (
          <Card key={index} className="feature-card overflow-hidden border-0 shadow-md">
            <div className="h-48 overflow-hidden bg-gray-100">
              {tool.image}
            </div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">{tool.title}</h3>
                <Badge 
                  variant="outline" 
                  className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${tool.badge.color}`}
                >
                  {tool.badge.text}
                </Badge>
              </div>
              <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
              <Button className="w-full bg-primary hover:bg-primary/90">
                {tool.icon} {tool.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
