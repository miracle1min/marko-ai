import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  // Menghapus penggunaan framer-motion dan transisi yang kompleks
  // untuk menyederhanakan rendering dan menghindari potensi error
  
  return (
    <div className="animate-fadeIn">
      {children}
    </div>
  );
};