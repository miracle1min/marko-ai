import React, { useState, useEffect } from 'react';
import { useLoading } from '@/contexts/LoadingContext';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

const LoadingAnimation: React.FC = () => {
  const { isLoading } = useLoading();
  const [visible, setVisible] = useState(false);

  // Menggunakan effect untuk menghindari masalah dengan render awal
  useEffect(() => {
    // Menanggapi perubahan state isLoading dengan aman
    if (isLoading) {
      setVisible(true);
    } else {
      // Memberikan delay kecil saat menghilangkan loading
      // untuk mencegah flashing
      const timeout = setTimeout(() => {
        setVisible(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  // Jika tidak dalam proses loading, gunakan rendering minimal
  if (!visible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 bg-background/80 backdrop-blur-sm"
    >
      <div className="relative flex flex-col items-center">
        <div className="flex items-center justify-center">
          <Sparkles
            className="h-12 w-12 text-primary animate-pulse"
            style={{ animationDuration: '1s' }}
          />
        </div>
        <div className="mt-4 relative w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-primary rounded-full animate-shimmer"
            style={{
              width: "30%",
              backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
              backgroundSize: "200% 100%"
            }}
          />
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Memuat...</p>
      </div>
    </div>
  );
};

export default LoadingAnimation;