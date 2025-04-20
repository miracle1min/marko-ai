import React from 'react';
import { useRoute, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import PageContainer from '@/components/PageContainer';
import Breadcrumb from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// PostDetail type
interface PostDetail {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  featuredImage?: string | null;
  authorId: number;
  categoryId?: number | null;
  status: string;
  publishedAt?: string | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  } | null;
  author?: {
    id: number;
    name: string;
    username: string;
  };
  tags?: {
    id: number;
    name: string;
    slug: string;
  }[];
}

export default function BlogDetail() {
  const [match, params] = useRoute('/blog/:slug');
  const [, setLocation] = useLocation();
  const slug = params?.slug;

  // Fetch post detail
  const { data: post, isLoading, error } = useQuery<PostDetail>({
    queryKey: [`/api/blog/posts/slug/${slug}`],
    enabled: !!slug,
  });

  // Format date
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <PageContainer>
      {post && (
        <Breadcrumb
          items={[
            { label: 'Blog', path: '/blog' },
            { label: post.title, path: `/blog/${post.slug}`, isActive: true }
          ]}
        />
      )}

      <div className="max-w-4xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-muted-foreground">Memuat artikel...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Artikel tidak ditemukan</h2>
            <p className="text-muted-foreground mb-6">
              Artikel yang Anda cari tidak ada atau telah dihapus.
            </p>
            <Button onClick={() => setLocation('/blog')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Blog
            </Button>
          </div>
        ) : post ? (
          <article className="py-4">
            {/* Post header */}
            <header className="mb-8">
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <time dateTime={post.publishedAt || post.createdAt}>
                    {formatDate(post.publishedAt || post.createdAt)}
                  </time>
                </div>
                
                {post.author && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{post.author.name || post.author.username}</span>
                  </div>
                )}
                
                {post.category && (
                  <Badge variant="outline" className="px-2 py-0">
                    {post.category.name}
                  </Badge>
                )}
              </div>
              
              {/* Featured image */}
              {post.featuredImage && (
                <div className="mb-8 rounded-lg overflow-hidden">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </header>
            
            {/* Post content */}
            <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
              {post.content.split('\n').map((paragraph, idx) => {
                // Skip empty paragraphs
                if (!paragraph.trim()) return null;
                
                // Heading detection (basic markdown parsing)
                if (paragraph.startsWith('# ')) {
                  return <h1 key={idx} className="text-3xl font-bold mt-6 mb-4">{paragraph.replace('# ', '')}</h1>;
                }
                if (paragraph.startsWith('## ')) {
                  return <h2 key={idx} className="text-2xl font-bold mt-6 mb-3">{paragraph.replace('## ', '')}</h2>;
                }
                if (paragraph.startsWith('### ')) {
                  return <h3 key={idx} className="text-xl font-bold mt-5 mb-3">{paragraph.replace('### ', '')}</h3>;
                }
                
                // Regular paragraph
                return <p key={idx} className="mb-4">{paragraph}</p>;
              })}
            </div>
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {post.tags.map(tag => (
                    <Badge 
                      key={tag.id} 
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => setLocation(`/blog?tag=${tag.slug}`)}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Back button */}
            <div className="mt-10">
              <Button variant="outline" onClick={() => setLocation('/blog')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Blog
              </Button>
            </div>
          </article>
        ) : null}
      </div>
    </PageContainer>
  );
}