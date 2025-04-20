import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AnimatedPage from "@/components/AnimatedPage";
import LoadingAnimation from "@/components/LoadingAnimation";
import PageContainer from "@/components/PageContainer";
import CharacterChatInterface from "@/components/chat/CharacterChatInterface";
import { AiCharacter } from "@/lib/types";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function AICharacterChat() {
  // Use the route to get the slug from the URL
  const [, params] = useRoute("/ai-karakter/:slug");
  const slug = params?.slug;
  // State untuk mendeteksi apakah tampilan mobile atau tidak
  const [isMobile, setIsMobile] = useState(false);

  // Effect untuk mendeteksi apakah tampilan mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check initially
    checkIfMobile();
    
    // Add listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const { data: character, isLoading, error } = useQuery<AiCharacter>({
    queryKey: [`/api/ai-characters/slug/${slug}`],
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!slug, // Only run the query if we have a slug
  });

  if (!slug) {
    return (
      <AnimatedPage>
        <PageContainer>
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Karakter tidak ditemukan
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              URL tidak valid. Silakan kembali ke halaman AI Karakter.
            </p>
            <Button asChild className="mt-6">
              <Link to="/ai-karakter">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Daftar Karakter
              </Link>
            </Button>
          </div>
        </PageContainer>
      </AnimatedPage>
    );
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingAnimation />
        </div>
      </PageContainer>
    );
  }

  if (error || !character) {
    return (
      <AnimatedPage>
        <PageContainer>
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Karakter tidak ditemukan
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Karakter yang Anda cari tidak tersedia atau telah dihapus.
            </p>
            <Button asChild className="mt-6">
              <Link to="/ai-karakter">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Daftar Karakter
              </Link>
            </Button>
          </div>
        </PageContainer>
      </AnimatedPage>
    );
  }

  // Pada mobile view, kita sembunyikan PageContainer dan tampilkan langsung CharacterChatInterface
  return (
    <AnimatedPage>
      <div className={isMobile ? "md:hidden" : "hidden md:block"}>
        <CharacterChatInterface character={character} />
      </div>
      
      <div className={isMobile ? "hidden" : "block"}>
        <PageContainer className="max-w-md px-0 sm:px-0 mx-auto">
          <div className="bg-white dark:bg-gray-950 border rounded-lg shadow-sm overflow-hidden">
            <CharacterChatInterface character={character} />
          </div>
        </PageContainer>
      </div>
    </AnimatedPage>
  );
}