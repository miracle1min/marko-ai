import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedPageProps {
  children: React.ReactNode;
}

const AnimatedPage: React.FC<AnimatedPageProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Tunggu sebentar untuk trigger animasi masuk
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={cn(
        "transition-all duration-500 transform",
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-4"
      )}
    >
      {children}
    </div>
  );
};

export default AnimatedPage;