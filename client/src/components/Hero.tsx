import { ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useState } from "react";

export default function Hero() {
  const [inputValue, setInputValue] = useState("");
  const [, setLocation] = useLocation();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // Navigate to the chat page with the input as a query parameter using wouter
      setLocation(`/chat?message=${encodeURIComponent(inputValue)}`);
    }
  };
  
  return (
    <div className="bg-[#1A2136] min-h-[85vh] flex flex-col items-center justify-center relative overflow-hidden pt-6 pb-14">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A2136] via-[#1A2136] to-[#283352]/80 opacity-70"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        <div className="flex flex-col items-center">
          {/* Large centered hero text with gradient effect */}
          <div className="text-center mb-14 mt-6">
            <h1 className="text-7xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-gray-200 via-gray-400 to-gray-200 mb-4">
              Marko AI
            </h1>
          </div>
          
          {/* Chat input */}
          <div className="w-full max-w-3xl mx-auto mb-14">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Tanyakan pada Marko AI..."
                className="w-full p-4 pl-6 pr-16 rounded-full bg-[#111827] border border-[#2D3653] text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#3B4773] text-lg"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#283352] hover:bg-[#3B4773] transition-colors"
              >
                <ArrowRight className="h-5 w-5 text-white" />
              </button>
            </form>
          </div>
          
          {/* Scroll down button */}
          <Link href="#learn-more">
            <Button variant="ghost" className="bg-transparent text-white hover:bg-[#283352]/50 border border-[#2D3653] rounded-full p-3 transition-all">
              <ChevronDown className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Learn more section */}
      <div id="learn-more" className="absolute bottom-5 left-1/2 transform -translate-x-1/2">
        <Link href="/tools">
          <Button variant="outline" className="bg-transparent text-white hover:bg-[#283352]/50 border border-[#2D3653] rounded-full px-6 py-3">
            LIHAT SEMUA APLIKASI
          </Button>
        </Link>
      </div>
    </div>
  );
}
