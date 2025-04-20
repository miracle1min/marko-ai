import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Save,
  Eye,
  Trash2,
  ImageIcon,
  Code,
  Bold,
  Italic,
  Link,
  ListOrdered,
  List,
  Heading2,
  Heading3,
  ArrowUpRight,
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Schema for blog post form
const postFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  categoryId: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
});

type PostFormValues = z.infer<typeof postFormSchema>;

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

export default function PostEditor() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("content");
  const isEdit = !!id;

  // Form setup
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      featuredImage: "",
      categoryId: "",
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
    },
  });

  // Fetch categories
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/blog/categories'],
  });

  // Fetch existing post for edit mode
  const { data: post, isLoading: postLoading } = useQuery<Post>({
    queryKey: [`/api/blog/posts/${id}`],
    enabled: isEdit,
  });

  // Update form when post data is loaded
  useEffect(() => {
    if (post && isEdit) {
      form.reset({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt || "",
        featuredImage: post.featuredImage || "",
        categoryId: post.categoryId ? post.categoryId.toString() : "",
        seoTitle: post.seoTitle || "",
        seoDescription: post.seoDescription || "",
        seoKeywords: post.seoKeywords || "",
      });
    }
  }, [post, form, isEdit]);

  // Mutations for saving, publishing, deleting
  const saveMutation = useMutation({
    mutationFn: async (data: PostFormValues) => {
      if (isEdit) {
        return apiRequest(`/api/blog/posts/${id}`, {
          method: 'PUT',
          data: {
            ...data,
            categoryId: data.categoryId ? parseInt(data.categoryId) : null,
          }
        });
      } else {
        return apiRequest('/api/blog/posts', {
          method: 'POST',
          data: {
            ...data,
            categoryId: data.categoryId ? parseInt(data.categoryId) : null,
            status: 'draft',
            authorId: 1, // Menggunakan ID 1 sebagai default user/author
          }
        });
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      
      toast({
        title: isEdit ? "Post updated" : "Post created",
        description: isEdit 
          ? "The post has been successfully updated."
          : "The post has been successfully created.",
      });

      if (!isEdit) {
        // Navigate to edit page for the new post
        setLocation(`/blog/manage/posts/edit/${data.id}`);
      }
    },
    onError: (error) => {
      console.error("Error saving post:", error);
      toast({
        title: "Error",
        description: "Failed to save the post. Please try again.",
        variant: "destructive",
      });
    }
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/blog/posts/${id}/publish`, {
        method: 'POST',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/blog/posts/${id}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      
      toast({
        title: "Post published",
        description: "The post has been successfully published.",
      });
    },
    onError: (error) => {
      console.error("Error publishing post:", error);
      toast({
        title: "Error",
        description: "Failed to publish the post. Please try again.",
        variant: "destructive",
      });
    }
  });

  const unpublishMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/blog/posts/${id}/unpublish`, {
        method: 'POST',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/blog/posts/${id}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      
      toast({
        title: "Post unpublished",
        description: "The post has been returned to draft status.",
      });
    },
    onError: (error) => {
      console.error("Error unpublishing post:", error);
      toast({
        title: "Error",
        description: "Failed to unpublish the post. Please try again.",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/blog/posts/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      
      toast({
        title: "Post deleted",
        description: "The post has been successfully deleted.",
      });

      // Navigate back to posts list
      setLocation("/blog/manage/posts");
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete the post. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    // Only auto-generate slug if it's empty or if it was auto-generated before
    if (!form.getValues("slug") || form.getValues("slug") === form.getValues("title").toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')) {
      form.setValue("slug", value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    }
  };

  // Form submit handler
  const onSubmit = (data: PostFormValues) => {
    saveMutation.mutate(data);
  };

  // Handle Delete
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      deleteMutation.mutate();
    }
  };

  // Simple text formatting functions for the editor
  const insertFormatting = (format: string) => {
    const contentField = form.getValues("content");
    let newContent = contentField;

    switch (format) {
      case 'bold':
        newContent += "**bold text**";
        break;
      case 'italic':
        newContent += "*italic text*";
        break;
      case 'link':
        newContent += "[link text](https://example.com)";
        break;
      case 'h2':
        newContent += "\n## Heading 2\n";
        break;
      case 'h3':
        newContent += "\n### Heading 3\n";
        break;
      case 'ol':
        newContent += "\n1. First item\n2. Second item\n3. Third item\n";
        break;
      case 'ul':
        newContent += "\n- First item\n- Second item\n- Third item\n";
        break;
      case 'code':
        newContent += "\n```\ncode block\n```\n";
        break;
      case 'image':
        newContent += "![Alt text](https://example.com/image.jpg)";
        break;
      default:
        break;
    }

    form.setValue("content", newContent);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{isEdit ? "Edit Post" : "Create New Post"}</h1>
          <p className="text-muted-foreground">
            {isEdit ? "Make changes to your blog post" : "Create a new blog post"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setLocation("/blog/manage/posts")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Posts
          </Button>
          {isEdit && post?.status === "published" && (
            <Button variant="outline" onClick={() => window.open(`/blog/${post.slug}`, '_blank')}>
              <Eye className="h-4 w-4 mr-2" />
              View Post
            </Button>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-6">
            {/* Main content area - 4 columns */}
            <div className="md:col-span-4 space-y-6">
              {/* Basic info card */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Enter the basic information about your post
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter post title" 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e);
                              handleTitleChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          The title of your blog post
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="enter-post-slug" {...field} />
                        </FormControl>
                        <FormDescription>
                          The URL-friendly version of the title
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief summary of the post" 
                            className="min-h-[100px]"
                            {...field} 
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          A short summary of your post (optional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Content editor card */}
              <Card>
                <CardHeader>
                  <CardTitle>Post Content</CardTitle>
                  <CardDescription>
                    Write your post content using Markdown
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md p-1 mb-4">
                    <div className="flex flex-wrap gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('bold')}
                      >
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('italic')}
                      >
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('link')}
                      >
                        <Link className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('h2')}
                      >
                        <Heading2 className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('h3')}
                      >
                        <Heading3 className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('ol')}
                      >
                        <ListOrdered className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('ul')}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('code')}
                      >
                        <Code className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('image')}
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea 
                            placeholder="Write your content here using Markdown..." 
                            className="min-h-[400px] font-mono"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - 2 columns */}
            <div className="md:col-span-2 space-y-6">
              {/* Status and actions card */}
              <Card>
                <CardHeader>
                  <CardTitle>Post Status</CardTitle>
                  {isEdit && post && (
                    <CardDescription>
                      Current status: <span className="font-medium capitalize">{post.status}</span>
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={saveMutation.isPending}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    {isEdit && post?.status === "draft" ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => publishMutation.mutate()}
                        disabled={publishMutation.isPending}
                      >
                        <ArrowUpRight className="h-4 w-4 mr-2" />
                        Publish
                      </Button>
                    ) : isEdit && post?.status === "published" ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => unpublishMutation.mutate()}
                        disabled={unpublishMutation.isPending}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Unpublish
                      </Button>
                    ) : null}

                    {isEdit && (
                      <Button
                        type="button"
                        variant="destructive"
                        className="w-full col-span-2 mt-4"
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Post
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Categories card */}
              <Card>
                <CardHeader>
                  <CardTitle>Category</CardTitle>
                  <CardDescription>
                    Assign your post to a category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {categories?.map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* SEO card */}
              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                  <CardDescription>
                    Optimize your post for search engines
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="seoTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="SEO title" 
                            {...field} 
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Title for search engines (optional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="seoDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Meta description" 
                            {...field} 
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Description for search engines (optional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="seoKeywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Keywords</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Comma-separated keywords" 
                            {...field} 
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Keywords for search engines (optional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Featured image card */}
              <Card>
                <CardHeader>
                  <CardTitle>Featured Image</CardTitle>
                  <CardDescription>
                    Add a featured image for your post
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="featuredImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            placeholder="Image URL" 
                            {...field} 
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the URL of the featured image (optional)
                        </FormDescription>
                        {field.value && (
                          <div className="mt-2 border rounded-md overflow-hidden">
                            <img 
                              src={field.value} 
                              alt="Featured" 
                              className="w-full h-auto object-cover"
                              onError={(e) => {
                                // Display a fallback image or text if the image fails to load
                                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";
                                e.currentTarget.style.padding = "2rem";
                                e.currentTarget.style.opacity = "0.5";
                              }}
                            />
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}