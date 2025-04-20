import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, AlignRight, User, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ id: number; username: string; role: string } | null>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Fetch current user on component mount
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
    
    fetchCurrentUser();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setUser(null);
        toast({
          title: "Berhasil Logout",
          description: "Anda telah keluar dari akun admin",
        });
        
        // Redirect to home if on admin page
        if (window.location.pathname.startsWith('/admin')) {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Gagal Logout",
        description: "Terjadi kesalahan saat mencoba logout",
        variant: "destructive"
      });
    }
  };

  return (
    <nav className="bg-black py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-white font-bold text-2xl flex items-center">
                <svg className="mr-1 h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 4L20 7L17 10M12 4L6 20M7 4L4 7L7 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="ml-1">AI</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex ml-6 space-x-4">
              <Link href="/chat" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                Chat
              </Link>
              <Link href="/tools" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                Tools
              </Link>
              <Link href="/blog" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                Blog
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Admin Login/Logout Button */}
            {user && user.role === 'admin' ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-2 rounded-full text-white hover:bg-white/10">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-sm text-gray-500 font-medium">
                    {user.username}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onSelect={() => navigate('/admin/dashboard')}>
                    Admin Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onSelect={handleLogout}>
                    Logout <LogOut className="ml-2 h-4 w-4" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/admin/login">
                <Button variant="ghost" className="p-2 rounded-full text-white hover:bg-white/10">
                  <LogIn className="h-5 w-5" />
                </Button>
              </Link>
            )}
            
            {/* Try MARKO AI Button */}
            <Link href="/chat">
              <Button variant="outline" className="hidden md:flex bg-transparent text-white border border-white/20 hover:bg-white/10 rounded-full px-5 py-5 h-auto">
                COBA MARKO AI
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu */}
          <div className="flex items-center md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="p-2 rounded-full text-white hover:bg-white/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-black text-white border-l border-white/20">
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-white">
                    <Link href="/" className="text-white font-bold text-xl flex items-center" onClick={() => setIsOpen(false)}>
                      <svg className="mr-1 h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 4L20 7L17 10M12 4L6 20M7 4L4 7L7 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="ml-1">AI</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4">
                  <Link 
                    href="/chat" 
                    className="p-2 rounded-md hover:bg-white/10 text-white font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Chat
                  </Link>
                  <Link 
                    href="/tools/content-generator" 
                    className="p-2 rounded-md hover:bg-white/10 text-white font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Content Generator
                  </Link>
                  <Link 
                    href="/tools" 
                    className="p-2 rounded-md hover:bg-white/10 text-white font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Tools
                  </Link>
                  <Link 
                    href="/blog" 
                    className="p-2 rounded-md hover:bg-white/10 text-white font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Blog
                  </Link>
                  
                  {/* Admin Login in Mobile Menu */}
                  {user && user.role === 'admin' ? (
                    <>
                      <Link 
                        href="/admin/dashboard" 
                        className="p-2 rounded-md hover:bg-white/10 text-white font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                      <button 
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="p-2 text-left rounded-md hover:bg-white/10 text-white font-medium flex items-center"
                      >
                        Logout <LogOut className="ml-2 h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <Link 
                      href="/admin/login" 
                      className="p-2 rounded-md hover:bg-white/10 text-white font-medium flex items-center"
                      onClick={() => setIsOpen(false)}
                    >
                      LOGIN <LogIn className="ml-2 h-4 w-4" />
                    </Link>
                  )}
                  
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      className="w-full bg-transparent text-white border border-white/20 hover:bg-white/10 rounded-full"
                      onClick={() => {
                        navigate('/chat');
                        setIsOpen(false);
                      }}
                    >
                      COBA MARKO AI
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
