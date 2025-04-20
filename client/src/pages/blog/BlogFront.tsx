import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Clock,
  Filter,
  FolderOpen,
  Search,
  User,
  Calendar,
  ArrowRight,
  ChevronRight,
  Layout,
  LayoutGrid,
  MessageSquare,
} from "lucide-react";

// Post types
interface Post {
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
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface PostsResponse {
  data: Post[];
  pagination: PaginationInfo;
}

export default function BlogFront() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Filters and pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const limit = 6;
  
  // Fetch published posts with filters and pagination
  const { data: postsData, isLoading: postsLoading } = useQuery<PostsResponse>({
    queryKey: ['/api/blog/posts', { page: currentPage, limit, status: 'published', categoryId: categoryFilter, search: searchTerm }],
    enabled: true,
  });

  // Fetch categories for filter dropdown
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/blog/categories'],
    enabled: true,
  });

  // Format date for display
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Create an array of page numbers for pagination
  const getPageNumbers = (currentPage: number, totalPages: number) => {
    const pages = [];
    const maxPagesToShow = 5;
    
    // Always show first page
    pages.push(1);
    
    // Calculate range of pages to show around current page
    let startPage = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 2);
    
    // Adjust startPage if endPage is too small
    if (endPage - startPage < maxPagesToShow - 2) {
      startPage = Math.max(2, endPage - (maxPagesToShow - 2) + 1);
    }
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push("ellipsis-start");
    }
    
    // Add page numbers between start and end
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push("ellipsis-end");
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  // Truncate text with ellipsis
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Blog</h1>
        <p className="text-xl text-muted-foreground">Explore our latest articles and insights</p>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search articles..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          {categories && categories.length > 0 && (
            <Select 
              value={categoryFilter?.toString() || "all"} 
              onValueChange={val => {
                setCategoryFilter(val === "all" ? null : parseInt(val));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  <span>{categoryFilter && categories
                    ? `${categories.find(c => c.id === categoryFilter)?.name || ''}`
                    : "All categories"}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div>
          {categories && categoryFilter && (
            <Button variant="ghost" onClick={() => setCategoryFilter(null)}>
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Blog posts grid */}
      {postsLoading ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-muted-foreground">Loading posts...</p>
        </div>
      ) : postsData && postsData.data.length > 0 ? (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {postsData.data.map((post) => (
              <Card key={post.id} className="overflow-hidden h-full flex flex-col">
                {post.featuredImage && (
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={post.featuredImage} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                  </div>
                  <CardTitle className="line-clamp-2">
                    <a 
                      href={`/blog/${post.slug}`} 
                      className="hover:underline cursor-pointer text-xl"
                      onClick={(e) => {
                        e.preventDefault();
                        setLocation(`/blog/${post.slug}`);
                      }}
                    >
                      {post.title}
                    </a>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground line-clamp-3">
                    {post.excerpt || truncateText(post.content.replace(/[#*_>`~\[\]\(\)]/g, ''), 150)}
                  </p>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between items-center">
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto font-medium text-primary hover:text-primary/80"
                    onClick={() => setLocation(`/blog/${post.slug}`)}
                  >
                    Read more
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {postsData.pagination.totalPages > 1 && (
            <Pagination className="mt-10">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                      }
                    }}
                    className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {getPageNumbers(currentPage, postsData.pagination.totalPages).map((page, i) => (
                  <PaginationItem key={i}>
                    {page === "ellipsis-start" || page === "ellipsis-end" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink 
                        href="#" 
                        isActive={currentPage === page}
                        onClick={(e) => {
                          e.preventDefault();
                          if (typeof page === 'number') {
                            setCurrentPage(page);
                          }
                        }}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < postsData.pagination.totalPages) {
                        setCurrentPage(currentPage + 1);
                      }
                    }}
                    className={currentPage >= postsData.pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <div className="text-center py-20 border rounded-lg bg-muted/10">
          <h3 className="text-xl font-medium mb-2">No posts found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || categoryFilter
              ? "Try changing your search criteria or browse all posts"
              : "We haven't published any posts yet. Check back soon!"}
          </p>
          {(searchTerm || categoryFilter) && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter(null);
                setCurrentPage(1);
              }}
            >
              View all posts
            </Button>
          )}
        </div>
      )}
    </div>
  );
}