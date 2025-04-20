import { useState, useCallback } from "react";
import { apiRequest } from "@/lib/queryClient";

interface SearchResult {
  id: number;
  title: string;
  description: string;
  link: string;
  type: "tool" | "blog" | "page";
  category?: string;
}

export function useSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSearchTime, setLastSearchTime] = useState<number>(0);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    // Update search time
    const currentTime = Date.now();
    setLastSearchTime(currentTime);
    
    console.log("useSearch: Searching for:", query);
    setLoading(true);
    setError(null);

    try {
      // Implementasi pencarian client-side untuk menghindari kebutuhan endpoint backend baru
      // Dalam implementasi sebenarnya, gunakan endpoint backend untuk pencarian
      await mockSearchDelay();
      
      let toolResults: SearchResult[] = [];
      let blogResults: SearchResult[] = [];
      
      console.log("useSearch: Starting search with query:", query);
      
      try {
        // Cari tools dari API
        const toolsResponse = await fetch("/api/tools", {
          method: "GET",
          credentials: "include"
        });
        
        if (toolsResponse.ok) {
          const tools = await toolsResponse.json();
          console.log("Tools API response:", tools);
          
          if (Array.isArray(tools)) {
            // Filter tools berdasarkan query
            toolResults = tools
              .filter((tool: any) => {
                const qLower = query.toLowerCase();
                const nameMatch = tool.name && tool.name.toLowerCase().includes(qLower);
                const descMatch = tool.description && tool.description.toLowerCase().includes(qLower);
                const catMatch = tool.category && tool.category.toLowerCase().includes(qLower);
                
                console.log(`Tool "${tool.name}" match: name=${nameMatch}, desc=${descMatch}, cat=${catMatch}`);
                
                return nameMatch || descMatch || catMatch;
              })
              .map((tool: any) => ({
                id: tool.id || 0,
                title: tool.name || "Tool AI",
                description: tool.description || "Tool AI untuk membantu kebutuhan Anda",
                link: `/tools/${tool.path || 'unknown'}`,
                type: "tool" as const,
                category: tool.category
              }));
            
            console.log("Filtered tools results:", toolResults);
          }
        }
      } catch (toolError) {
        console.error("Error fetching tools:", toolError);
      }
      
      try {
        // Cari blog dari API
        const blogResponse = await fetch("/api/blog/posts", {
          method: "GET",
          credentials: "include"
        });
        
        if (blogResponse.ok) {
          const blogData = await blogResponse.json();
          console.log("Blog API response:", blogData);
          
          const blogPosts = blogData.data || []; // Blog posts ada di dalam properti data
          
          if (Array.isArray(blogPosts)) {
            // Filter blog posts berdasarkan query
            blogResults = blogPosts
              .filter((post: any) => {
                const qLower = query.toLowerCase();
                const titleMatch = post.title && post.title.toLowerCase().includes(qLower);
                const excerptMatch = post.excerpt && post.excerpt.toLowerCase().includes(qLower);
                const contentMatch = post.content && post.content.toLowerCase().includes(qLower);
                
                console.log(`Blog "${post.title}" match: title=${titleMatch}, excerpt=${excerptMatch}, content=${contentMatch}`);
                
                return titleMatch || excerptMatch || contentMatch;
              })
              .map((post: any) => ({
                id: post.id || 0,
                title: post.title || "Blog Post",
                description: (post.excerpt || (post.content && post.content.substring(0, 150) + "...")) || "Blog post",
                link: `/blog/${post.slug || post.id}`,
                type: "blog" as const,
                category: post.category?.name
              }));
              
            console.log("Filtered blog results:", blogResults);
          }
        }
      } catch (blogError) {
        console.error("Error fetching blog posts:", blogError);
      }
      
      // Combine and sort results (tools first, then blog posts)
      const combinedResults = [...toolResults, ...blogResults];
      
      // Jika tidak ada hasil yang cocok, gunakan fallback pencarian untuk kata kunci populer
      if (combinedResults.length === 0) {
        console.log("No API results found, using fallback search");
        const fallbackResults = performFallbackSearch(query);
        
        // Filter lagi fallback berdasarkan relevansi dengan query
        const filteredFallbacks = fallbackResults.filter(result => {
          const qLower = query.toLowerCase();
          const titleRelevant = result.title.toLowerCase().includes(qLower);
          const descRelevant = result.description.toLowerCase().includes(qLower);
          const categoryRelevant = result.category && result.category.toLowerCase().includes(qLower);
          return titleRelevant || descRelevant || categoryRelevant;
        });
        
        console.log("Fallback search results:", filteredFallbacks);
        setResults(filteredFallbacks);
      } else {
        setResults(combinedResults);
      }
    } catch (err) {
      console.error("Error searching:", err);
      setError("Terjadi kesalahan saat mencari. Silakan coba lagi.");
      
      // Fallback ke pencarian dasar jika API gagal
      const fallbackResults = performFallbackSearch(query);
      setResults(fallbackResults);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add our refresh function to clear cache and perform a new search
  const refreshSearch = useCallback(async (query: string) => {
    // Clear results and force a new search
    setResults([]);
    
    // Set a small artificial delay
    await mockSearchDelay();
    
    // Perform a fresh search
    await search(query);
  }, [search]);

  return { results, loading, error, search, refreshSearch, lastSearchTime };
}

// Fungsi pencarian fallback jika API gagal atau tidak ada hasil
function performFallbackSearch(query: string): SearchResult[] {
  // Daftar tools dasar dan halaman untuk pencarian fallback
  const basicTools = [
    {
      id: 1,
      title: "AI Chat",
      description: "Chatbot AI untuk berbagai kebutuhan Anda",
      link: "/chat",
      type: "tool" as const
    },
    {
      id: 2,
      title: "Konsultasi Kesehatan",
      description: "Tanyakan informasi kesehatan dan dapatkan saran dari dokter AI kami",
      link: "/tools/konsultasi-kesehatan",
      type: "tool" as const,
      category: "Tanya Dokter AI"
    },
    {
      id: 3,
      title: "Content Generator",
      description: "Membuat artikel berkualitas tinggi dalam hitungan detik dengan bantuan Gemini Flash 2.0",
      link: "/tools/content-generator",
      type: "tool" as const,
      category: "Content Creator"
    },
    {
      id: 4,
      title: "Resep Makanan",
      description: "Dapatkan resep makanan berdasarkan bahan yang Anda miliki",
      link: "/tools/recipe-generator",
      type: "tool" as const,
      category: "Food & Recipe"
    },
    {
      id: 5,
      title: "Instagram Caption Creator",
      description: "Buat caption Instagram yang menarik untuk meningkatkan engagement followers",
      link: "/tools/instagram-caption",
      type: "tool" as const,
      category: "Sosial Media"
    },
    {
      id: 6,
      title: "Lowongan Kerja AI Generator",
      description: "Buat deskripsi lowongan kerja yang menarik dan profesional untuk mencari kandidat terbaik",
      link: "/tools/job-description",
      type: "tool" as const,
      category: "Business & Finance"
    }
  ];
  
  return basicTools.filter(
    tool => 
      tool.title.toLowerCase().includes(query.toLowerCase()) || 
      tool.description.toLowerCase().includes(query.toLowerCase()) ||
      (tool.category && tool.category.toLowerCase().includes(query.toLowerCase()))
  );
}

// Fungsi untuk mensimulasikan delay network
async function mockSearchDelay() {
  return new Promise(resolve => setTimeout(resolve, 300));
}