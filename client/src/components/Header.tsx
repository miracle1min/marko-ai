import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  Menu, X, User, Search, 
  Bot, ChevronDown, ChevronRight, 
  Wrench, BookOpen, Heart, Sparkles, 
  Bell, MessageCircle, Globe, Code, GraduationCap,
  PenLine, ChefHat, BarChart, Stethoscope, MessagesSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toolsSubmenuOpen, setToolsSubmenuOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check login status with error handling
  useEffect(() => {
    async function checkLoginStatus() {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setIsLoggedIn(true);
        } else {
          // Jika respons 401 "Not authenticated", ini adalah respons normal
          // jika pengguna belum login, jadi tidak perlu log error
          if (response.status !== 401) {
            console.log('User not authenticated yet');
          }
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setUser(null);
        setIsLoggedIn(false);
      }
    }

    checkLoginStatus();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setToolsSubmenuOpen(false); // Reset submenu when main menu is toggled
  };
  
  const toggleToolsSubmenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setToolsSubmenuOpen(!toolsSubmenuOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        setUser(null);
        setIsLoggedIn(false);
        setLocation('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled 
        ? "bg-[#0F172A] shadow-lg text-white backdrop-blur-sm" 
        : "bg-[#0F172A]/90 text-white backdrop-blur-sm"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative before:absolute before:inset-x-0 before:bottom-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-gray-500/20 before:to-transparent">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <Bot className="h-6 w-6 text-blue-500 mr-2" />
                <span className="text-2xl font-bold text-blue-500">Marko AI</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            <Link href="/chat">
              <div className={`px-3 py-2 text-sm font-medium rounded-md cursor-pointer hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-colors ${location === "/chat" ? "text-primary font-semibold bg-primary/5 dark:bg-primary/20" : "text-gray-700 dark:text-gray-200"} flex items-center gap-1.5`}>
                <MessageCircle className="h-4 w-4" /> AI CHAT
              </div>
            </Link>
            
            <Link href="/ai-karakter">
              <div className={`px-3 py-2 text-sm font-medium rounded-md cursor-pointer hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-colors ${location === "/ai-karakter" || location.startsWith("/ai-karakter/") ? "text-primary font-semibold bg-primary/5 dark:bg-primary/20" : "text-gray-700 dark:text-gray-200"} flex items-center gap-1.5`}>
                <Bot className="h-4 w-4" /> AI KARAKTER
              </div>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className={`px-3 py-2 text-sm font-medium rounded-md cursor-pointer hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-colors flex items-center ${(location === "/tools" || location.startsWith("/tools/")) ? "text-primary font-semibold bg-primary/5 dark:bg-primary/20" : "text-gray-700 dark:text-gray-200"}`}>
                  <Wrench className="h-4 w-4 mr-1.5" /> TOOLS AI <ChevronDown className="ml-1 h-4 w-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56">
                <Link href="/tools">
                  <DropdownMenuItem className="cursor-pointer">
                    <Wrench className="mr-2 h-4 w-4 text-blue-500" />
                    <span>SEMUA TOOLS</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link href="/tools?category=Alat%20Utilitas">
                  <DropdownMenuItem className="cursor-pointer">
                    <Globe className="mr-2 h-4 w-4 text-blue-500" />
                    <span>ALAT UTILITAS</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/tools?category=Sosial%20Media">
                  <DropdownMenuItem className="cursor-pointer">
                    <MessagesSquare className="mr-2 h-4 w-4 text-green-500" />
                    <span>SOSIAL MEDIA</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/tools?category=Tanya%20Dokter%20AI">
                  <DropdownMenuItem className="cursor-pointer">
                    <Stethoscope className="mr-2 h-4 w-4 text-emerald-500" />
                    <span>TANYA DOKTER AI</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/tools?category=Tanya%20Coding%20AI">
                  <DropdownMenuItem className="cursor-pointer">
                    <Code className="mr-2 h-4 w-4 text-indigo-500" />
                    <span>TANYA CODING AI</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/tools?category=Tanya%20Guru%20AI">
                  <DropdownMenuItem className="cursor-pointer">
                    <GraduationCap className="mr-2 h-4 w-4 text-yellow-500" />
                    <span>TANYA GURU AI</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/tools?category=Content%20Creator">
                  <DropdownMenuItem className="cursor-pointer">
                    <PenLine className="mr-2 h-4 w-4 text-blue-500" />
                    <span>CONTENT CREATOR</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/tools?category=Food%20%26%20Recipe">
                  <DropdownMenuItem className="cursor-pointer">
                    <ChefHat className="mr-2 h-4 w-4 text-amber-500" />
                    <span>FOOD & RECIPE</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/tools?category=Business%20%26%20Finance">
                  <DropdownMenuItem className="cursor-pointer">
                    <BarChart className="mr-2 h-4 w-4 text-blue-500" />
                    <span>BUSINESS & FINANCE</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/tools?category=SEO%20Tools">
                  <DropdownMenuItem className="cursor-pointer">
                    <Search className="mr-2 h-4 w-4 text-purple-500" />
                    <span>SEO TOOLS</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
            
            
            
            <Link href="/kontak">
              <div className={`px-3 py-2 text-sm font-medium rounded-md cursor-pointer hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-colors ${location === "/kontak" ? "text-primary font-semibold bg-primary/5 dark:bg-primary/20" : "text-gray-700 dark:text-gray-200"} flex items-center gap-1.5`}>
                <MessageCircle className="h-4 w-4" /> KONTAK
              </div>
            </Link>
            
            <Link href="/about">
              <div className={`px-3 py-2 text-sm font-medium rounded-md cursor-pointer hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-colors ${location === "/about" ? "text-primary font-semibold bg-primary/5 dark:bg-primary/20" : "text-gray-700 dark:text-gray-200"} flex items-center gap-1.5`}>
                <Heart className="h-4 w-4" /> ABOUT
              </div>
            </Link>
          </nav>

          {/* Search and Login Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <form 
              className="relative" 
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  // Bersihkan query string dan reset form
                  const query = searchQuery.trim();
                  setSearchQuery("");
                  
                  // Navigasi ke halaman pencarian dengan query dari header desktop
                  console.log("Desktop search for:", query);
                  window.location.href = `/search?q=${encodeURIComponent(query)}`;
                }
              }}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                className="pl-10 pr-8 h-9 w-48 rounded-full bg-gray-100 border-transparent focus:border-gray-300 focus:ring-primary" 
                placeholder="Cari tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary h-5 w-5">
                <ChevronRight className="h-4 w-4" />
              </button>
            </form>
            
            {/* Theme Toggle removed as dark mode is default */}
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                {/* Admin tombol dashboard */}
                {user && user.role === 'admin' && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-700 dark:text-gray-200"
                    onClick={() => setLocation('/admin/dashboard')}
                  >
                    Dashboard
                  </Button>
                )}
                
                {/* Tombol Logout */}
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="text-white"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-700 dark:text-gray-200"
                  onClick={() => setLocation('/admin/login')}
                >
                  LOGIN
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0F172A] text-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/chat">
              <div className={`block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${location === "/chat" ? "bg-blue-500 text-white" : "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"} flex items-center gap-2`} onClick={() => setIsMenuOpen(false)}>
                <MessageCircle className="h-5 w-5" /> AI CHAT
              </div>
            </Link>
            
            <Link href="/ai-karakter">
              <div className={`block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${location === "/ai-karakter" || location.startsWith("/ai-karakter/") ? "bg-blue-500 text-white" : "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"} flex items-center gap-2`} onClick={() => setIsMenuOpen(false)}>
                <Bot className="h-5 w-5" /> AI KARAKTER
              </div>
            </Link>
            
            <div>
              <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100/10 flex items-center justify-between" onClick={toggleToolsSubmenu}>
                <div className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" /> TOOLS AI
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${toolsSubmenuOpen ? 'rotate-180' : ''}`} />
              </div>
              {toolsSubmenuOpen && (
                <div className="pl-5 space-y-1 mt-1">
                  <Link href="/tools">
                    <div className="block px-3 py-1.5 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center" onClick={() => setIsMenuOpen(false)}>
                      <Wrench className="mr-2 h-4 w-4 text-blue-500" /> SEMUA TOOLS
                    </div>
                  </Link>
                  <Link href="/tools?category=Alat%20Utilitas">
                    <div className="block px-3 py-1.5 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center" onClick={() => setIsMenuOpen(false)}>
                      <Globe className="mr-2 h-4 w-4 text-blue-500" /> ALAT UTILITAS
                    </div>
                  </Link>
                  <Link href="/tools?category=Sosial%20Media">
                    <div className="block px-3 py-1.5 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center" onClick={() => setIsMenuOpen(false)}>
                      <MessagesSquare className="mr-2 h-4 w-4 text-green-500" /> SOSIAL MEDIA
                    </div>
                  </Link>
                  <Link href="/tools?category=Tanya%20Dokter%20AI">
                    <div className="block px-3 py-1.5 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center" onClick={() => setIsMenuOpen(false)}>
                      <Stethoscope className="mr-2 h-4 w-4 text-emerald-500" /> TANYA DOKTER AI
                    </div>
                  </Link>
                  <Link href="/tools?category=Tanya%20Coding%20AI">
                    <div className="block px-3 py-1.5 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center" onClick={() => setIsMenuOpen(false)}>
                      <Code className="mr-2 h-4 w-4 text-indigo-500" /> TANYA CODING AI
                    </div>
                  </Link>
                  <Link href="/tools?category=Tanya%20Guru%20AI">
                    <div className="block px-3 py-1.5 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center" onClick={() => setIsMenuOpen(false)}>
                      <GraduationCap className="mr-2 h-4 w-4 text-yellow-500" /> TANYA GURU AI
                    </div>
                  </Link>
                  <Link href="/tools?category=Content%20Creator">
                    <div className="block px-3 py-1.5 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center" onClick={() => setIsMenuOpen(false)}>
                      <PenLine className="mr-2 h-4 w-4 text-blue-500" /> CONTENT CREATOR
                    </div>
                  </Link>
                  <Link href="/tools?category=Food%20%26%20Recipe">
                    <div className="block px-3 py-1.5 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center" onClick={() => setIsMenuOpen(false)}>
                      <ChefHat className="mr-2 h-4 w-4 text-amber-500" /> FOOD & RECIPE
                    </div>
                  </Link>
                  <Link href="/tools?category=Business%20%26%20Finance">
                    <div className="block px-3 py-1.5 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center" onClick={() => setIsMenuOpen(false)}>
                      <BarChart className="mr-2 h-4 w-4 text-blue-500" /> BUSINESS & FINANCE
                    </div>
                  </Link>
                  <Link href="/tools?category=SEO%20Tools">
                    <div className="block px-3 py-1.5 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center" onClick={() => setIsMenuOpen(false)}>
                      <Search className="mr-2 h-4 w-4 text-purple-500" /> SEO TOOLS
                    </div>
                  </Link>
                </div>
              )}
            </div>
            
            
            
            <Link href="/kontak">
              <div className={`block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${location === "/kontak" ? "bg-primary text-white" : "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"} flex items-center gap-2`} onClick={() => setIsMenuOpen(false)}>
                <MessageCircle className="h-5 w-5" /> KONTAK
              </div>
            </Link>
            
            <Link href="/about">
              <div className={`block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${location === "/about" ? "bg-primary text-white" : "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"} flex items-center gap-2`} onClick={() => setIsMenuOpen(false)}>
                <Heart className="h-5 w-5" /> ABOUT
              </div>
            </Link>
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            
            {isLoggedIn ? (
              <div className="px-5 py-3">
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800 dark:text-gray-200">{user?.username || 'User'}</div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{user?.email || ''}</div>
                  </div>
                </div>
                <div className="space-y-1">
                  {user && user.role === 'admin' && (
                    <div 
                      className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" 
                      onClick={() => {
                        setIsMenuOpen(false);
                        setLocation('/admin/dashboard');
                      }}
                    >
                      Admin Dashboard
                    </div>
                  )}
                  <div 
                    className="block px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" 
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    Logout
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-4 flex flex-col space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setLocation('/admin/login');
                  }}
                >
                  LOGIN
                </Button>
              </div>
            )}
            
            <div className="mt-3 px-2">
              <form 
                className="relative"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    // Simpan query saat ini dan bersihkan form
                    const query = searchQuery.trim();
                    setSearchQuery("");
                    setIsMenuOpen(false);
                    
                    // Navigasi ke halaman pencarian dengan query dari mobile header
                    console.log("Mobile search for:", query);
                    window.location.href = `/search?q=${encodeURIComponent(query)}`;
                  }
                }}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  className="pl-10 w-full bg-gray-100 dark:bg-gray-700 border-transparent focus:border-gray-300 dark:focus:border-gray-600" 
                  placeholder="Cari tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary h-5 w-5">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}