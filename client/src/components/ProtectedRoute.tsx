import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/user");
        if (response.ok) {
          const userData = await response.json();
          setIsAuthenticated(true);
          setIsAdmin(userData.role === "admin");
          
          // Jika halaman membutuhkan admin dan user bukan admin
          if (adminOnly && userData.role !== "admin") {
            toast({
              title: "Akses Ditolak",
              description: "Anda tidak memiliki izin admin untuk mengakses halaman ini",
              variant: "destructive"
            });
            setLocation("/");
          }
        } else {
          // Tidak terautentikasi, arahkan ke halaman login
          toast({
            title: "Login Diperlukan",
            description: "Silakan login untuk melanjutkan",
          });
          setLocation("/admin/login");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setLocation("/admin/login");
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [setLocation, toast, adminOnly]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Jika memerlukan admin, periksa apakah user adalah admin
  if (adminOnly && !isAdmin) {
    return null; // akan redirect di useEffect
  }

  // Jika hanya memerlukan login biasa
  if (!adminOnly && isAuthenticated) {
    return <>{children}</>;
  }

  // Jika memerlukan admin dan user adalah admin
  if (adminOnly && isAdmin) {
    return <>{children}</>;
  }

  return null; // akan redirect di useEffect
}