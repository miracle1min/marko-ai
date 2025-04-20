import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search, Wrench, ArrowUpRight, Loader2, FileText, File, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Breadcrumb from "@/components/Breadcrumb";
import { Link } from "wouter";
import { useSearch } from "@/hooks/useSearch";

interface SearchResultIcon {
  [key: string]: JSX.Element;
}

export default function SearchResults() {
  const [location, setLocation] = useLocation();
  
  // Perbaikan parsing URL dengan window.location untuk mendapatkan query parameter langsung
  const urlParams = new URLSearchParams(window.location.search);
  const urlQuery = urlParams.get("q") || "";
  
  // Debug logs
  console.log("DEBUG SearchResults - window.location.href:", window.location.href);
  console.log("DEBUG SearchResults - window.location.search:", window.location.search);
  console.log("DEBUG SearchResults - urlQuery:", urlQuery);
  
  // State untuk input pencarian
  const [query, setQuery] = useState(urlQuery);
  
  // State untuk menampung waktu refresh terakhir
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(Date.now());
  
  // Gunakan hook useSearch dengan fitur refresh
  const { results, loading, error, search, refreshSearch, lastSearchTime } = useSearch();
  
  // Log untuk debugging detail
  useEffect(() => {
    console.log("SearchResults mounted/updated");
    console.log("Current location:", location);
    console.log("URL Query parameter:", urlQuery);
    console.log("Current search results:", results);
  }, [location, urlQuery, results]);
  
  // Icons for different result types
  const resultIcons: SearchResultIcon = {
    tool: <Wrench className="h-5 w-5" />,
    blog: <FileText className="h-5 w-5" />,
    page: <File className="h-5 w-5" />
  };

  // Fungsi untuk melakukan pencarian
  const performSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      
      // Check if we have recent search results, if not do a refresh search to ensure
      // we get the latest data including newly created blog posts
      const now = Date.now();
      if (now - lastSearchTime > 60000) { // If more than 1 minute has passed, refresh data
        console.log("Performing a refresh search to get latest data");
        refreshSearch(searchQuery);
        setLastRefreshTime(now);
      } else {
        search(searchQuery);
      }
    }
  };

  // Lakukan pencarian saat komponen dimount atau URL berubah
  useEffect(() => {
    if (urlQuery) {
      console.log("SearchResults useEffect: Detected urlQuery change:", urlQuery);
      setQuery(urlQuery); // Sync input field with URL query
      performSearch(urlQuery);
    }
  }, [urlQuery]); // Hanya bergantung pada urlQuery, tidak pada search atau performSearch

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Update URL dengan query pencarian
      const searchUrl = `/search?q=${encodeURIComponent(query.trim())}`;
      console.log("Local search form submitted with query:", query.trim());
      window.location.href = searchUrl;
      // performSearch akan dijalankan setelah komponen dimount dengan URL baru
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-0">
      <Breadcrumb 
        items={[
          { label: "Beranda", path: "/" },
          { label: "Hasil Pencarian", path: "/search", isActive: true }
        ]} 
      />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-6">
          <Search className="text-primary mr-2" /> 
          Hasil Pencarian
        </h1>
        
        <form onSubmit={handleSearch} className="relative max-w-xl mx-auto mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input 
            className="pl-10 h-12 text-lg border-2 focus:border-primary" 
            placeholder="Cari tools, artikel, atau halaman..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button 
            type="submit"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10"
          >
            Cari
          </Button>
        </form>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Mencari...</span>
        </div>
      ) : urlQuery ? (
        <>
          <div className="text-gray-600 mb-4">
            {results.length > 0 
              ? `Ditemukan ${results.length} hasil untuk "${urlQuery}"`
              : `Tidak ditemukan hasil untuk "${urlQuery}"`
            }
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            {results.length > 0 ? (
              results.map((result) => (
                <div 
                  key={`${result.type}-${result.id}`}
                  className="border border-gray-200 rounded-lg p-4 transition-all hover:shadow-md"
                >
                  <div className="flex items-start">
                    <div className={`mr-4 p-2 rounded-md ${
                      result.type === 'tool' 
                        ? 'bg-blue-100 text-blue-700' 
                        : result.type === 'blog' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-purple-100 text-purple-700'
                    }`}>
                      {resultIcons[result.type] || <File className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <Link href={result.link}>
                        <h3 className="text-lg font-medium hover:text-primary cursor-pointer flex items-center">
                          {result.title}
                          <ArrowUpRight className="ml-1 h-4 w-4" />
                        </h3>
                      </Link>
                      {result.category && (
                        <div className="text-sm text-gray-500 mb-1">
                          Kategori: {result.category}
                        </div>
                      )}
                      <p className="text-gray-600">{result.description}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    console.log("Force refreshing search for:", urlQuery);
                    refreshSearch(urlQuery);
                    setLastRefreshTime(Date.now());
                  }}
                  className="mb-4"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Pencarian
                </Button>
                <p className="text-sm text-gray-500">
                  Jika Anda baru menambahkan konten, klik refresh untuk menyegarkan hasil pencarian
                </p>
              </div>
            )}
          </div>
          
          {!error && results.length === 0 && (
            <div className="py-8 text-center">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak menemukan apa yang Anda cari?</h3>
              <p className="text-gray-600 mb-4">Coba dengan kata kunci lain atau jelajahi kategori tools kami</p>
              <Button 
                variant="outline" 
                onClick={() => setLocation('/tools')}
              >
                Lihat Semua Tools
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="py-8 text-center">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Masukkan kata kunci untuk mulai mencari</h3>
          <p className="text-gray-600">Cari tools AI, artikel blog, atau halaman dengan memasukkan kata kunci di atas</p>
        </div>
      )}
    </div>
  );
}