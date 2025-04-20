import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from 'wouter';

interface LoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

// Membuat default value untuk context untuk menghindari nilai undefined
const defaultContextValue: LoadingContextType = {
  isLoading: false,
  startLoading: () => {},
  stopLoading: () => {},
};

const LoadingContext = createContext<LoadingContextType>(defaultContextValue);

// Custom hook untuk menggunakan LoadingContext
// Penting: Harus menggunakan named export yang konsisten untuk fast refresh
function useLoading() {
  return useContext(LoadingContext);
}

function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [location] = useLocation();

  // Saat lokasi berubah, mulai loading dengan penanganan error yang lebih baik
  useEffect(() => {
    try {
      setIsLoading(true);
      
      // Hentikan loading setelah beberapa waktu untuk simulasi
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 500); // Mengurangi waktu loading untuk pengalaman yang lebih baik

      return () => clearTimeout(timeout);
    } catch (error) {
      console.error("Error dalam LoadingContext:", error);
      setIsLoading(false);
    }
  }, [location]);

  const startLoading = () => {
    try {
      setIsLoading(true);
    } catch (error) {
      console.error("Error saat memulai loading:", error);
    }
  };

  const stopLoading = () => {
    try {
      setIsLoading(false);
    } catch (error) {
      console.error("Error saat menghentikan loading:", error);
    }
  };

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export { LoadingProvider, useLoading };