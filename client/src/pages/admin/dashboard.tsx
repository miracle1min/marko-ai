import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import PageContainer from "@/components/PageContainer";
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  ListChecks, 
  Eye, 
  EyeOff,
  FileText, 
  Tag, 
  FolderOpen 
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

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [user, setUser] = useState<{ id: number, username: string, role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data
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

  // Fetch blog data
  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== 'admin') return;
      
      setLoading(true);
      try {
        // Fetch posts
        const postsResponse = await fetch('/api/blog/posts');
        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          // Check structure of the response and adapt accordingly
          if (postsData.data) {
            setPosts(postsData.data);
          } else if (Array.isArray(postsData)) {
            setPosts(postsData);
          } else if (postsData.posts) {
            setPosts(postsData.posts);
          } else {
            console.error("Unexpected posts data structure:", postsData);
            setPosts([]);
          }
        }
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/blog/categories');
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        }
        
        // Fetch tags
        const tagsResponse = await fetch('/api/blog/tags');
        if (tagsResponse.ok) {
          const tagsData = await tagsResponse.json();
          setTags(tagsData);
        }
      } catch (error) {
        console.error("Error fetching blog data:", error);
        toast({
          title: "Error",
          description: "Gagal memuat data blog",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, toast]);

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
        // Update local state
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, status: currentStatus === "published" ? "draft" : "published" } 
            : post
        ));
        
        toast({
          title: "Sukses",
          description: currentStatus === "published" 
            ? "Artikel berhasil dibatalkan publikasi" 
            : "Artikel berhasil dipublikasikan",
        });
      } else {
        throw new Error("Failed to update post status");
      }
    } catch (error) {
      console.error("Error toggling post status:", error);
      toast({
        title: "Error",
        description: "Gagal mengubah status artikel",
        variant: "destructive"
      });
    }
  };

  // Handle post deletion
  const deletePost = async (postId: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/blog/posts/${postId}`, {
        method: "DELETE"
      });
      
      if (response.ok) {
        // Update local state
        setPosts(posts.filter(post => post.id !== postId));
        
        toast({
          title: "Sukses",
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

  if (!user || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <PageContainer 
      title="Admin Dashboard"
      breadcrumbs={[
        { label: "Beranda", href: "/" },
        { label: "Admin Dashboard", current: true }
      ]}
      containerClassName="py-4"
    >
      <div className="flex justify-end mb-6">
        <Button onClick={() => navigate('/')}>Kembali ke Situs</Button>
      </div>
      
      <Tabs defaultValue="posts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts" className="flex items-center gap-1">
            <FileText className="h-4 w-4" /> Artikel
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-1">
            <FolderOpen className="h-4 w-4" /> Kategori
          </TabsTrigger>
          <TabsTrigger value="tags" className="flex items-center gap-1">
            <Tag className="h-4 w-4" /> Tag
          </TabsTrigger>
        </TabsList>
        
        {/* Posts Tab */}
        <TabsContent value="posts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Manajemen Artikel</h2>
            <Button onClick={() => navigate('/admin/posts/new')} className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" /> Buat Artikel Baru
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Daftar Artikel</CardTitle>
              <CardDescription>
                Mengelola semua artikel blog
              </CardDescription>
            </CardHeader>
            <CardContent>
              {posts.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">Belum ada artikel</p>
              ) : (
                <div className="space-y-2">
                  {posts.map(post => (
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
        </TabsContent>
        
        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Manajemen Kategori</h2>
            <Button onClick={() => navigate('/admin/categories/new')} className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" /> Tambah Kategori
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Daftar Kategori</CardTitle>
              <CardDescription>
                Mengelola kategori untuk artikel blog
              </CardDescription>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">Belum ada kategori</p>
              ) : (
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category.id} className="p-4 border rounded-lg flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">Slug: {category.slug}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => navigate(`/admin/categories/edit/${category.id}`)}
                          title="Edit kategori"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          title="Hapus kategori"
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
        </TabsContent>
        
        {/* Tags Tab */}
        <TabsContent value="tags" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Manajemen Tag</h2>
            <Button onClick={() => navigate('/admin/tags/new')} className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" /> Tambah Tag
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Daftar Tag</CardTitle>
              <CardDescription>
                Mengelola tag untuk artikel blog
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tags.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">Belum ada tag</p>
              ) : (
                <div className="space-y-2">
                  {tags.map(tag => (
                    <div key={tag.id} className="p-4 border rounded-lg flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{tag.name}</h3>
                        <p className="text-sm text-muted-foreground">Slug: {tag.slug}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => navigate(`/admin/tags/edit/${tag.id}`)}
                          title="Edit tag"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          title="Hapus tag"
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
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}