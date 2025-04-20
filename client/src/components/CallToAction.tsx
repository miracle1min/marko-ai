import { UserPlus, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <div className="bg-primary py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Mulai Optimasi Website Anda Sekarang</h2>
        <p className="text-white text-lg mb-8 max-w-3xl mx-auto">
          Gunakan kekuatan AI untuk meningkatkan peringkat website, menghasilkan konten berkualitas, dan mendapatkan lebih banyak trafik organik.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            variant="secondary" 
            className="bg-white text-primary hover:bg-gray-100"
            size="lg"
          >
            <UserPlus className="h-5 w-5 mr-2" /> Daftar Gratis
          </Button>
          <Button 
            variant="destructive" 
            className="bg-red-500 hover:bg-red-600 text-white"
            size="lg"
          >
            <Crown className="h-5 w-5 mr-2" /> Upgrade ke Premium
          </Button>
        </div>
      </div>
    </div>
  );
}
