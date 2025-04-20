import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import PageContainer from "@/components/PageContainer";
import LoadingAnimation from "@/components/LoadingAnimation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AiCharacter } from "@/lib/types";
import AnimatedPage from "@/components/AnimatedPage";
import Breadcrumb from "@/components/Breadcrumb";
import { 
  ChevronRight, 
  ChevronLeft, 
  Bot, 
  Sparkles, 
  Stars, 
  BrainCircuit, 
  Atom, 
  Globe, 
  Code, 
  MessageSquare, 
  ScanSearch,
  Cpu,
  Rocket
} from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';

// Utility for grouping characters by category
const groupByCategory = (characters: AiCharacter[]) => {
  const grouped: { [key: string]: AiCharacter[] } = {};
  
  characters.forEach(character => {
    const category = character.category || "Popular Bots";
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(character);
  });
  
  return grouped;
};

// Color palette for cards based on AI themes
const colorPalettes = [
  {
    gradient: "bg-gradient-to-br from-blue-500 to-purple-600",
    patternColor: "from-blue-400/20 to-purple-500/20",
    textColor: "text-white",
    glowColor: "shadow-blue-500/20"
  },
  {
    gradient: "bg-gradient-to-br from-emerald-500 to-teal-600",
    patternColor: "from-emerald-400/20 to-teal-500/20",
    textColor: "text-white",
    glowColor: "shadow-emerald-500/20"
  },
  {
    gradient: "bg-gradient-to-br from-indigo-500 to-violet-600",
    patternColor: "from-indigo-400/20 to-violet-500/20",
    textColor: "text-white",
    glowColor: "shadow-indigo-500/20"
  },
  {
    gradient: "bg-gradient-to-br from-pink-500 to-rose-600",
    patternColor: "from-pink-400/20 to-rose-500/20",
    textColor: "text-white",
    glowColor: "shadow-pink-500/20"
  },
  {
    gradient: "bg-gradient-to-br from-amber-500 to-orange-600",
    patternColor: "from-amber-400/20 to-orange-500/20",
    textColor: "text-white",
    glowColor: "shadow-amber-500/20"
  }
];

// Function to get the logo URL based on AI model name
const getAILogoURL = (characterName: string): string => {
  const name = characterName.toLowerCase();
  
  if (name.includes("gemini")) {
    return "https://lh3.googleusercontent.com/vXOHBFDHAv96HbvBLh5KzxxKgLxeRPyHJ9BfRQCgS_JlA_ikPLOpQTx_o5mwk9Q2S7_PVCc2C4SgV03ZSG5D93Ul7xbx5Ch_JMsNdg";
  }
  if (name.includes("llama")) {
    return "https://blog.meta.com/wp-content/uploads/2023/07/Llama-2_thumb.jpg";
  }
  if (name.includes("mistral")) {
    return "https://admin.mistral.ai/app-icon.png";
  }
  if (name.includes("gpt-4") || name.includes("gpt4")) {
    return "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/512px-ChatGPT_logo.svg.png";
  }
  if (name.includes("gpt-3") || name.includes("gpt3") || name.includes("openai")) {
    return "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/512px-ChatGPT_logo.svg.png";
  }
  if (name.includes("claude") || name.includes("anthropic")) {
    return "https://avatars.githubusercontent.com/u/99884888";
  }
  if (name.includes("code") || name.includes("codex")) {
    return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRUNE_Z5SpGx-Jvi3NULQNMU79BlMJLo-Whwl_n-adGJ-w2eMVqXgDOYwTNQ&s";
  }
  if (name.includes("google")) {
    return "https://cdn.iconscout.com/icon/free/png-256/free-google-160-189824.png";
  }
  if (name.includes("personal") || name.includes("assistant")) {
    return "https://cloud.google.com/static/ai-platform/images/ai-platform-assistant.svg";
  }
  
  // Default icon for other AI characters - use a generic AI icon
  return "https://cdn-icons-png.flaticon.com/512/4616/4616734.png";
};

// AI-themed constellation pattern for card backgrounds
const ConstellationPattern = ({ className }: { className?: string }) => (
  <div className={`absolute inset-0 ${className || ""}`}>
    <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="1" fill="white" />
      <circle cx="40" cy="25" r="1" fill="white" />
      <circle cx="65" cy="10" r="1" fill="white" />
      <circle cx="85" cy="30" r="1" fill="white" />
      <circle cx="50" cy="50" r="1" fill="white" />
      <circle cx="15" cy="60" r="1" fill="white" />
      <circle cx="30" cy="80" r="1" fill="white" />
      <circle cx="70" cy="70" r="1" fill="white" />
      <circle cx="90" cy="85" r="1" fill="white" />
      
      <line x1="20" y1="20" x2="40" y2="25" stroke="white" strokeWidth="0.3" opacity="0.6" />
      <line x1="40" y1="25" x2="65" y2="10" stroke="white" strokeWidth="0.3" opacity="0.6" />
      <line x1="65" y1="10" x2="85" y2="30" stroke="white" strokeWidth="0.3" opacity="0.6" />
      <line x1="85" y1="30" x2="50" y2="50" stroke="white" strokeWidth="0.3" opacity="0.6" />
      <line x1="50" y1="50" x2="15" y2="60" stroke="white" strokeWidth="0.3" opacity="0.6" />
      <line x1="15" y1="60" x2="30" y2="80" stroke="white" strokeWidth="0.3" opacity="0.6" />
      <line x1="30" y1="80" x2="70" y2="70" stroke="white" strokeWidth="0.3" opacity="0.6" />
      <line x1="70" y1="70" x2="90" y2="85" stroke="white" strokeWidth="0.3" opacity="0.6" />
    </svg>
  </div>
);

// Character List Item Component - Simplified version of previous list design
const CharacterListItem = ({ character }: { character: AiCharacter }) => {
  // Pick a consistent color palette based on character ID
  const colorIndex = character.id % colorPalettes.length;
  const palette = colorPalettes[colorIndex];
  
  return (
    <Link to={`/ai-karakter/${character.slug}`} className="block">
      <div className={`my-4 ${palette.gradient} rounded-xl overflow-hidden relative group
          transition-all duration-300 transform hover:shadow-lg hover:scale-[1.01] ${palette.glowColor}`}>
        {/* Decorative AI pattern background */}
        <div className={`absolute top-0 left-0 w-full h-full opacity-20 bg-[url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]`}></div>
        
        <div className="flex items-center justify-between p-4 relative z-10">
          <div className="flex items-center gap-4">
            <Avatar className={`w-14 h-14 ring-[3px] ring-white/30 bg-white/20 shadow-lg`}>
              <AvatarImage src={character.avatarUrl} alt={character.name} />
              <AvatarFallback className="text-xl font-bold text-white">
                {character.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center">
                <h3 className="font-bold text-xl text-white drop-shadow-sm">{character.name}</h3>
              </div>
              <p className="text-sm text-white/90 line-clamp-1 mt-1">
                {character.shortDescription || character.description.substring(0, 90)}
              </p>
            </div>
          </div>
          <Button className="rounded-full bg-white/90 text-gray-900 hover:bg-white font-medium
            transform transition-all group-hover:shadow-lg">
            Chat
          </Button>
        </div>
      </div>
    </Link>
  );
};

// Character Card Component for grid layout with modern AI theme
const CharacterCard = ({ character }: { character: AiCharacter }) => {
  // Pick a consistent color palette based on character ID
  const colorIndex = character.id % colorPalettes.length;
  const palette = colorPalettes[colorIndex];
  
  // Get AI logo URL based on character name
  const logoUrl = getAILogoURL(character.name);
  
  return (
    <div className="w-full">
      <Link to={`/ai-karakter/${character.slug}`}>
        <div 
          className={`${palette.gradient} rounded-lg p-4 pb-5 h-full overflow-hidden relative group
            transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl ${palette.glowColor}`}
        >
          {/* Decorative AI pattern backgrounds */}
          <div className={`absolute top-0 left-0 w-full h-full opacity-10 bg-[url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]`}></div>
          
          {/* Add constellation pattern */}
          <ConstellationPattern className="opacity-25" />
          
          {/* Add soft radial glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-white/20 opacity-20"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col items-center text-center">
              <div className={`w-14 h-14 rounded-full ring-1 ring-white/30 bg-white shadow-lg mb-3 flex items-center justify-center overflow-hidden`}>
                <img 
                  src={logoUrl} 
                  alt={`${character.name} logo`} 
                  className="w-11 h-11 object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-base text-white drop-shadow-sm line-clamp-1">{character.name}</h3>
              </div>
            </div>
            
            <Button className="w-full rounded-full bg-white/90 text-gray-900 hover:bg-white font-medium text-sm h-9 mt-4
              transform transition-all group-hover:shadow-lg">
              Chat
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};

// Responsive grid display for characters
// - Mobile: 2 columns, 3 rows (2x3)
// - Desktop: 3 columns, 2 rows (3x2)
const CharacterGrid = ({ characters }: { characters: AiCharacter[] }) => {
  // Configure grid layout - show maximum 6 characters
  const displayCharacters = characters.slice(0, 6);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 w-full">
      {displayCharacters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  );
};

// Category Section Component
const CategorySection = ({ 
  title, 
  characters, 
  showSeeAll = true 
}: { 
  title: string; 
  characters: AiCharacter[]; 
  showSeeAll?: boolean;
}) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center">
        <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full mr-2"></div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50 tracking-tight">{title}</h2>
        <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
          {characters.length}
        </span>
      </div>
      {showSeeAll && (
        <Button variant="ghost" size="sm" className="text-primary gap-1 font-medium text-xs h-8 px-2">
          Lihat Semua <ChevronRight className="h-3 w-3" />
        </Button>
      )}
    </div>

    <CharacterGrid characters={characters} />
  </div>
);

export default function AICharacters() {
  const { data: characters, isLoading, error } = useQuery<AiCharacter[]>({
    queryKey: ['/api/ai-characters'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Group characters by category
  const groupedCharacters = useMemo(() => {
    if (!characters) return {};
    return groupByCategory(characters);
  }, [characters]);

  // Sort categories in specific order with OFFICIAL MODELS first, then Popular Bots
  const categories = useMemo(() => {
    if (!groupedCharacters) return [];
    
    // Define the priority order of categories
    const categoryOrder = ["OFFICIAL MODELS", "Popular Bots"];
    
    // Get all categories from grouped characters
    const availableCategories = Object.keys(groupedCharacters);
    
    // Sort categories based on the priority order
    return availableCategories.sort((a, b) => {
      const indexA = categoryOrder.indexOf(a);
      const indexB = categoryOrder.indexOf(b);
      
      // If both categories are in our priority list, sort by priority
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      
      // If only one is in our priority list, prioritize it
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      // For categories not in our priority list, keep alphabetical
      return a.localeCompare(b);
    });
  }, [groupedCharacters]);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingAnimation />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Gagal memuat karakter AI
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Terjadi kesalahan saat memuat daftar karakter AI. Silakan coba lagi nanti.
          </p>
        </div>
      </PageContainer>
    );
  }

  return (
    <AnimatedPage>
      <PageContainer className="max-w-4xl px-4 sm:px-6">
        <Breadcrumb
          items={[
            { label: "Beranda", path: "/" },
            { label: "AI Karakter", path: "/ai-karakter", isActive: true },
          ]}
        />
        
        <div className="mb-6 mt-2">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 p-4 mb-4">
            {/* Abstract AI Pattern Background */}
            <div className="absolute inset-0 opacity-15 bg-[url('data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.5\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'1.5\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'1.5\'/%3E%3C/g%3E%3C/svg%3E')]"></div>
            
            {/* Neural Network Decorative Lines */}
            <div className="absolute top-0 right-0 w-40 h-full opacity-10">
              <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="4" fill="white" />
                <circle cx="120" cy="20" r="4" fill="white" />
                <circle cx="180" cy="80" r="4" fill="white" />
                <circle cx="140" cy="140" r="4" fill="white" />
                <circle cx="60" cy="180" r="4" fill="white" />
                <circle cx="80" cy="60" r="4" fill="white" />
                <line x1="20" y1="20" x2="120" y2="20" stroke="white" strokeWidth="1" />
                <line x1="120" y1="20" x2="180" y2="80" stroke="white" strokeWidth="1" />
                <line x1="180" y1="80" x2="140" y2="140" stroke="white" strokeWidth="1" />
                <line x1="140" y1="140" x2="60" y2="180" stroke="white" strokeWidth="1" />
                <line x1="60" y1="180" x2="80" y2="60" stroke="white" strokeWidth="1" />
                <line x1="80" y1="60" x2="20" y2="20" stroke="white" strokeWidth="1" />
              </svg>
            </div>
            
            <div className="relative z-10">
              <h1 className="text-2xl font-bold text-white mb-1 tracking-tight drop-shadow-sm">
                AI Chatbots
              </h1>
              <p className="text-white/90 max-w-2xl text-sm">
                Pilih model AI favorit Anda dan mulai percakapan dengan chatbot untuk membantu kebutuhan Anda.
              </p>
            </div>
          </div>
        </div>

        {characters && characters.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200">
              Belum ada karakter AI yang tersedia
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Kami sedang mengembangkan karakter-karakter baru. Silakan kembali lagi nanti.
            </p>
          </div>
        ) : (
          <div>
            {categories.map(category => {
              // Determine number of characters to show based on category
              let charactersToShow;
              
              if (category === "OFFICIAL MODELS") {
                // Show all OFFICIAL MODELS
                charactersToShow = groupedCharacters[category];
              } else {
                // For other categories, limit to 6 characters
                charactersToShow = groupedCharacters[category].slice(0, 6);
              }
              
              return (
                <CategorySection 
                  key={category} 
                  title={category} 
                  characters={charactersToShow} 
                  showSeeAll={charactersToShow.length < groupedCharacters[category].length}
                />
              );
            })}
          </div>
        )}
      </PageContainer>
    </AnimatedPage>
  );
}