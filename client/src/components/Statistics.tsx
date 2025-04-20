import { Card, CardContent } from "@/components/ui/card";

export default function Statistics() {
  const stats = [
    { value: "50,000+", label: "Pengguna Aktif" },
    { value: "1.5 Juta+", label: "Artikel Dihasilkan" },
    { value: "98%", label: "Kepuasan Pengguna" },
    { value: "75%", label: "Peningkatan Traffic" }
  ];

  return (
    <div className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900">Dipercaya Oleh Ribuan Pengguna</h2>
          <p className="text-gray-600 mt-2">Marko AI telah membantu banyak website meningkatkan peringkat di mesin pencari</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white border-0 shadow-md">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
