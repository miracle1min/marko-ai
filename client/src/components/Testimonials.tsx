import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Testimonials() {
  const testimonials = [
    {
      rating: 5,
      text: "Marko AI membantu website saya naik ke halaman pertama Google hanya dalam waktu 3 bulan. Artikel yang dihasilkan sangat berkualitas dan SEO friendly.",
      name: "Budi Santoso",
      title: "Pemilik TokoOnline.id",
      initials: "BS"
    },
    {
      rating: 4.5,
      text: "Tool keyword research Marko AI sangat membantu saya menemukan peluang kata kunci yang belum dimanfaatkan kompetitor. Hasilnya, traffic website meningkat 200%!",
      name: "Siti Nurhayati",
      title: "Content Manager",
      initials: "SN"
    },
    {
      rating: 5,
      text: "Saya tidak punya waktu untuk menulis konten, tapi dengan Marko AI, saya bisa menghasilkan 10 artikel berkualitas setiap hari. Tool yang sangat direkomendasikan!",
      name: "Arief Wijaya",
      title: "Blogger",
      initials: "AW"
    }
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-amber-400 text-amber-400" />);
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="h-4 w-4 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <defs>
            <linearGradient id="halfGradient">
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <polygon fill="url(#halfGradient)" points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-amber-400" />);
    }

    return stars;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-gray-900">Apa Kata Pengguna Kami</h2>
        <p className="text-gray-600 mt-2">Pengalaman pengguna yang telah merasakan manfaat Marko AI</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex gap-0.5 text-amber-400">
                  {renderStars(testimonial.rating)}
                </div>
                <div className="ml-2 text-gray-600 text-sm">{testimonial.rating}</div>
              </div>
              <p className="text-gray-700 mb-4">{testimonial.text}</p>
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarFallback className="bg-gray-300 text-gray-700">{testimonial.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
