import AnimatedPage from "@/components/AnimatedPage";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExampleWithAnimation() {
  return (
    <AnimatedPage>
      <div className="container max-w-5xl mx-auto px-4 py-6">
        <Breadcrumb items={[
          { label: "Beranda", path: "/" },
          { label: "Contoh", path: "/example", isActive: true }
        ]} />

        <div className="flex flex-col gap-6 mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl">Halaman dengan Animasi</CardTitle>
              <CardDescription>
                Contoh halaman yang menggunakan komponen AnimatedPage untuk transisi masuk yang mulus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Halaman ini menunjukkan cara menggunakan komponen AnimatedPage.
                Setiap halaman akan memiliki efek fade-in dan slide-up saat pertama kali dimuat.
              </p>
              <p className="mt-4">
                Untuk mengimplementasikan animasi ini di halaman lain, cukup bungkus konten halaman dengan komponen AnimatedPage.
              </p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-slide-in" style={{ animationDelay: `${i * 100}ms` }}>
                    <CardContent className="p-4">
                      <p className="font-medium">Item {i}</p>
                      <p className="text-sm text-muted-foreground">
                        Item ini muncul dengan delay {i * 100}ms
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AnimatedPage>
  );
}