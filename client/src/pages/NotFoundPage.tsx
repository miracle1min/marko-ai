import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Halaman Tidak Ditemukan</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600 mb-6">
            Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
          </p>
          
          <Link href="/">
            <Button className="w-full bg-primary hover:bg-primary/90">
              Kembali ke Beranda
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
