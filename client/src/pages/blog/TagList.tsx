import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Badge,
  BadgeProps,
} from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Tag,
  Hash,
  MoreHorizontal
} from 'lucide-react';

interface Tag {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
}

const tagSchema = z.object({
  name: z.string().min(1, 'Tag name is required').max(50, 'Tag name is too long'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug is too long')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase, contain only letters, numbers and hyphens'),
  description: z.string().nullable().optional(),
});

type TagFormValues = z.infer<typeof tagSchema>;

// Badge colors for tags
const tagColors: Record<number, BadgeProps['variant']> = {
  0: 'default',
  1: 'secondary',
  2: 'outline',
  3: 'destructive',
};

export default function TagList() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tagToEdit, setTagToEdit] = useState<Tag | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all tags
  const { data: tags, isLoading, error } = useQuery<Tag[]>({
    queryKey: ['/api/blog/tags'],
    enabled: true,
  });

  // Create tag form
  const createForm = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
    },
  });

  // Edit tag form
  const editForm = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
    },
  });

  // Create tag mutation
  const createTagMutation = useMutation({
    mutationFn: (data: TagFormValues) => apiRequest('/api/blog/tags', { method: 'POST', data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/tags'] });
      setIsCreateDialogOpen(false);
      createForm.reset();
      toast({
        title: 'Success',
        description: 'Tag created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create tag',
        variant: 'destructive',
      });
    },
  });

  // Update tag mutation
  const updateTagMutation = useMutation({
    mutationFn: (data: TagFormValues & { id: number }) => 
      apiRequest(`/api/blog/tags/${data.id}`, { method: 'PUT', data: { name: data.name, slug: data.slug, description: data.description } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/tags'] });
      setIsEditDialogOpen(false);
      setTagToEdit(null);
      editForm.reset();
      toast({
        title: 'Success',
        description: 'Tag updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update tag',
        variant: 'destructive',
      });
    },
  });

  // Delete tag mutation
  const deleteTagMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/blog/tags/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/tags'] });
      toast({
        title: 'Success',
        description: 'Tag deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete tag. It may have associated posts.',
        variant: 'destructive',
      });
    },
  });

  // Handle create tag submission
  const onCreateSubmit = (data: TagFormValues) => {
    createTagMutation.mutate(data);
  };

  // Handle edit tag submission
  const onEditSubmit = (data: TagFormValues) => {
    if (tagToEdit) {
      updateTagMutation.mutate({ ...data, id: tagToEdit.id });
    }
  };

  // Open edit dialog and populate form
  const handleEditTag = (tag: Tag) => {
    setTagToEdit(tag);
    editForm.reset({
      name: tag.name,
      slug: tag.slug,
      description: tag.description,
    });
    setIsEditDialogOpen(true);
  };

  // Handle delete tag
  const handleDeleteTag = (id: number) => {
    if (window.confirm("Are you sure you want to delete this tag? This action cannot be undone.")) {
      deleteTagMutation.mutate(id);
    }
  };

  // Generate slug from name for create form
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Auto-generate slug when name changes in create form
  const watchCreateName = createForm.watch('name');
  React.useEffect(() => {
    if (watchCreateName && !createForm.getValues('slug')) {
      createForm.setValue('slug', generateSlug(watchCreateName));
    }
  }, [watchCreateName, createForm]);

  // Filter tags by search query
  const filteredTags = React.useMemo(() => {
    if (!tags) return [];
    if (!searchQuery) return tags;
    
    return tags.filter(tag => 
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tag.description && tag.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [tags, searchQuery]);

  // Get tag badge variant
  const getTagBadgeVariant = (index: number): BadgeProps['variant'] => {
    const colorKey = index % Object.keys(tagColors).length;
    return tagColors[colorKey];
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Tags</h1>
          <p className="text-muted-foreground">Manage your blog tags</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setLocation("/blog/manage")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Tag
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>All Tags</CardTitle>
              <CardDescription>
                {tags ? `${filteredTags.length} tags in total` : "Loading tags..."}
              </CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tags..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Loading tags...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-destructive">Failed to load tags. Please try again.</p>
            </div>
          ) : filteredTags.length > 0 ? (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2 mb-6">
                {filteredTags.map((tag, index) => (
                  <div key={tag.id} className="relative group">
                    <Badge 
                      variant={getTagBadgeVariant(index)} 
                      className="p-2 text-sm flex items-center gap-1.5 group-hover:pr-7"
                    >
                      <Hash className="h-3 w-3" />
                      {tag.name}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-0.5 top-1/2 transform -translate-y-1/2 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleEditTag(tag)}
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Name</TableHead>
                      <TableHead className="w-[200px]">Slug</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[120px]">Created</TableHead>
                      <TableHead className="text-right w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTags.map((tag, index) => (
                      <TableRow key={tag.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Badge variant={getTagBadgeVariant(index)}>
                              <Hash className="h-3 w-3 mr-1" />
                              {tag.name}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{tag.slug}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {tag.description || "-"}
                        </TableCell>
                        <TableCell>
                          {new Date(tag.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditTag(tag)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteTag(tag.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                {searchQuery ? 'No tags matching your search criteria' : 'No tags found. Create your first tag!'}
              </p>
              {!searchQuery && (
                <Button 
                  className="mt-4"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Tag
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Tag Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Tag</DialogTitle>
            <DialogDescription>
              Add a new tag to categorize your blog posts.
            </DialogDescription>
          </DialogHeader>
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter tag name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter tag slug" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="description"
                render={({ field }) => {
                  // Handle null values in field.value
                  return (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter tag description"
                          {...field}
                          value={field.value === null ? '' : field.value} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createTagMutation.isPending}>
                  {createTagMutation.isPending ? 'Creating...' : 'Create Tag'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Tag Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
            <DialogDescription>
              Update the details for this tag.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter tag name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter tag slug" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => {
                  // Handle null values in field.value
                  return (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter tag description"
                          {...field}
                          value={field.value === null ? '' : field.value} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateTagMutation.isPending}>
                  {updateTagMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}