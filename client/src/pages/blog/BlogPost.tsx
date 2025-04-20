import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  Calendar,
  User,
  Tag,
  FolderOpen,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import ReactMarkdown from 'react-markdown';

// Post types
interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  authorId: number;
  categoryId?: number | null;
  status: string;
  publishedAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  tags?: Tag[];
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

interface User {
  id: number;
  name: string;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Fetch post data
  const { data: post, isLoading, error } = useQuery<Post>({
    queryKey: [`/api/blog/posts/slug/${slug}`],
    enabled: !!slug,
  });

  // Fetch category if post has one
  const { data: category } = useQuery<Category>({
    queryKey: [`/api/blog/categories/${post?.categoryId}`],
    enabled: !!post?.categoryId,
  });

  // Set page metadata based on post SEO settings
  useEffect(() => {
    if (post) {
      // If we had server-side rendering, we'd update meta tags here
      document.title = post.seoTitle || post.title;
    }
  }, [post]);

  // Format date for display
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Share post
  const sharePost = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    if (!post) return;

    const url = window.location.href;
    const title = post.title;
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 flex justify-center">
        <p>Loading article...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => setLocation("/blog")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      {/* Back navigation */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => setLocation("/blog")}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Button>
      </div>

      {/* Article header */}
      <div className="mb-10">
        {post.featuredImage && (
          <div className="mb-8 aspect-video w-full overflow-hidden rounded-lg">
            <img 
              src={post.featuredImage} 
              alt={post.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          </div>
          
          {category && (
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              <a 
                href="#" 
                className="hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  setLocation(`/blog?category=${category.id}`);
                }}
              >
                {category.name}
              </a>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Author Name</span>
          </div>
        </div>
      </div>
      
      {/* Post content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Main content - 8 columns */}
        <div className="md:col-span-8">
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <ReactMarkdown>
                  {post.content}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <Badge key={tag.id} variant="outline" className="text-sm py-1">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Share buttons */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-2">Share This Article</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => sharePost('facebook')}>
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => sharePost('twitter')}>
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => sharePost('linkedin')}>
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Sidebar - 4 columns */}
        <div className="md:col-span-4 space-y-8">
          {/* About the author - placeholder*/}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">About the Author</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-full w-12 h-12 bg-muted flex items-center justify-center">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Author Name</p>
                  <p className="text-sm text-muted-foreground">Author Position</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                This is where author information would appear. The bio text would be stored in the user profile.
              </p>
            </CardContent>
          </Card>
          
          {/* Related posts - placeholder */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Related Posts</h3>
              <p className="text-sm text-muted-foreground">
                Related posts would be displayed here based on category or tags.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}