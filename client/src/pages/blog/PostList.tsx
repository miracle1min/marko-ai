import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import PageContainer from "@/components/PageContainer";
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Search,
  RefreshCw
} from "lucide-react";

// Types
interface BlogPost {
  id: number;
  title: string;
  slug: string;
  status: string;
  authorId: number;
  createdAt: string;
  categoryId: number | null;
}

export default function PostList() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [user, setUser] = useState<{ id: number, username: string, role: string } | null>(null);

  // Fetch user data to ensure admin access
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          
          if (userData.role !== 'admin') {
            // Redirect non-admin users
            toast({
              title: "Akses Ditolak",
              description: "Anda tidak memiliki izin admin",
              variant: "destructive"
            });
            navigate('/');
          }
        } else {
          // Redirect unauthenticated users
          toast({
            title: "Login Diperlukan",
            description: "Silakan login untuk mengakses halaman admin",
          });
          navigate('/admin/login');
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        navigate('/admin/login');
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  // Fetch posts
  const { data: posts = [], isLoading, error, refetch } = useQuery({
    queryKey: ['/api/blog/posts'],
    queryFn: async () => {
      const response = await fetch('/api/blog/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      
      // Handle different response structures
      if (data.data) return data.data;
      if (Array.isArray(data)) return data;
      if (data.posts) return data.posts;
      return [];
    },
    enabled: !!user && user.role === 'admin'
  });

  // Filter posts based on search term
  useEffect(() => {
    if (posts.length > 0) {
      if (searchTerm.trim() === '') {
        setFilteredPosts(posts);
      } else {
        const filtered = posts.filter(post => 
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.slug.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPosts(filtered);
      }
    } else {
      setFilteredPosts([]);
    }
  }, [posts, searchTerm]);

  // Handle publish/unpublish post
  const togglePublishStatus = async (postId: number, currentStatus: string) => {
    try {
      const endpoint = currentStatus === "published" 
        ? `/api/blog/posts/${postId}/unpublish` 
        : `/api/blog/posts/${postId}/publish`;
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (response.ok) {
        refetch(); // Refresh post list
        toast({
          title: "Status diperbarui",
          description: currentStatus === "published" 
            ? "Artikel berhasil dibatalkan publikasinya" 
            : "Artikel berhasil dipublikasikan",
        });
      } else {
        throw new Error("Failed to update post status");
      }
    } catch (error) {
      console.error("Error updating post status:", error);
      toast({
        title: "Error",
        description: "Gagal memperbarui status artikel",
        variant: "destructive"
      });
    }
  };

  // Handle delete post
  const deletePost = async (postId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/blog/posts/${postId}`, {
        method: "DELETE"
      });
      
      if (response.ok) {
        refetch(); // Refresh post list
        toast({
          title: "Artikel dihapus",
          description: "Artikel berhasil dihapus",
        });
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Gagal menghapus artikel",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <PageContainer 
      title="Daftar Artikel"
      breadcrumbs={[
        { label: "Beranda", href: "/" },
        { label: "Admin", href: "/admin/dashboard" },
        { label: "Daftar Artikel", current: true }
      ]}
      containerClassName="py-4"
    >
      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => navigate('/admin/dashboard')} variant="outline">
          Kembali ke Dashboard
        </Button>
        <Button onClick={() => navigate('/admin/posts/new')} className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" /> Buat Artikel Baru
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Daftar Artikel</CardTitle>
          <CardDescription>
            Kelola semua artikel blog Anda di sini
          </CardDescription>
          <div className="flex items-center gap-2 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari artikel..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => refetch()}
              title="Muat ulang daftar"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-4 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-2 text-sm text-muted-foreground">Memuat artikel...</p>
            </div>
          ) : error ? (
            <div className="py-4 text-center text-red-500">
              <p>Terjadi kesalahan saat memuat daftar artikel.</p>
              <Button variant="outline" className="mt-2" onClick={() => refetch()}>
                Coba Lagi
              </Button>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="py-4 text-center">
              {searchTerm ? (
                <p className="text-muted-foreground">Tidak ada artikel yang cocok dengan pencarian Anda.</p>
              ) : (
                <div>
                  <p className="text-muted-foreground">Belum ada artikel.</p>
                  <Button 
                    className="mt-4 flex items-center gap-1" 
                    onClick={() => navigate('/admin/posts/new')}
                  >
                    <PlusCircle className="h-4 w-4" /> Buat Artikel Pertama
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map(post => (
                <div key={post.id} className="p-4 border rounded-lg flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{post.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {post.status === "published" ? (
                        <span className="text-green-600">Dipublikasikan</span>
                      ) : (
                        <span className="text-amber-600">Draft</span>
                      )}
                      <span className="mx-2">•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString('id-ID')}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => togglePublishStatus(post.id, post.status)}
                      title={post.status === "published" ? "Batalkan publikasi" : "Publikasikan"}
                    >
                      {post.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                      title="Edit artikel"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => deletePost(post.id)}
                      title="Hapus artikel"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}