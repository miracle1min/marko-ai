import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, LockKeyhole, Home } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Username dan password diperlukan",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Gunakan metode POST langsung tanpa objek options
      const data = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password }),
        credentials: "include"
      }).then(res => {
        if (!res.ok) {
          throw new Error(res.statusText || "Login gagal");
        }
        return res.json();
      });
      
      // Jika login berhasil
      toast({
        title: "Login Berhasil",
        description: `Selamat datang kembali, ${data.name}!`
      });
      
      // Redirect ke dashboard admin
      navigate("/admin/dashboard");
    } catch (error: any) {
      toast({
        title: "Login Gagal",
        description: error.message || "Terjadi kesalahan saat login",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          const user = await res.json();
          if (user && user.id) {
            // User is already logged in, redirect to dashboard
            navigate('/admin/dashboard');
          }
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };
    
    checkAuth();
  }, [navigate]);

  return (
    <div className="container px-4 mx-auto">
      {/* Breadcrumbs */}
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <Button 
            variant="link" 
            className="p-0 text-muted-foreground hover:text-primary"
            onClick={() => navigate('/')}
          >
            <Home className="h-4 w-4 mr-1" />
            Beranda
          </Button>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">LOGIN</span>
        </div>
      </div>
      
      {/* Title and subtitle */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">LOGIN</h1>
        <p className="text-muted-foreground mt-2">Masuk ke dashboard admin Miracle Marko</p>
      </div>
      
      {/* Login Form */}
      <div className="flex items-center justify-center py-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
              <LockKeyhole className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">ADMIN LOGIN</CardTitle>
            <CardDescription className="text-center">
              Masuk ke dashboard admin Miracle Marko
            </CardDescription>
          </CardHeader>
        
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username"
                type="text"
                placeholder="miraclemarko" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  </div>
  );
}