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
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Folder
} from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
}

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Category name is too long'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug is too long')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase, contain only letters, numbers and hyphens'),
  description: z.string().nullable().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function CategoryList() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all categories
  const { data: categories, isLoading, error } = useQuery<Category[]>({
    queryKey: ['/api/blog/categories'],
    enabled: true,
  });

  // Create category form
  const createForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
    },
  });

  // Edit category form
  const editForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
    },
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: (data: CategoryFormValues) => apiRequest('/api/blog/categories', { method: 'POST', data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/categories'] });
      setIsCreateDialogOpen(false);
      createForm.reset();
      toast({
        title: 'Success',
        description: 'Category created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create category',
        variant: 'destructive',
      });
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: (data: CategoryFormValues & { id: number }) => 
      apiRequest(`/api/blog/categories/${data.id}`, { method: 'PUT', data: { name: data.name, slug: data.slug, description: data.description } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/categories'] });
      setIsEditDialogOpen(false);
      setCategoryToEdit(null);
      editForm.reset();
      toast({
        title: 'Success',
        description: 'Category updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update category',
        variant: 'destructive',
      });
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/blog/categories/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/categories'] });
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete category. It may have associated posts.',
        variant: 'destructive',
      });
    },
  });

  // Handle create category submission
  const onCreateSubmit = (data: CategoryFormValues) => {
    createCategoryMutation.mutate(data);
  };

  // Handle edit category submission
  const onEditSubmit = (data: CategoryFormValues) => {
    if (categoryToEdit) {
      updateCategoryMutation.mutate({ ...data, id: categoryToEdit.id });
    }
  };

  // Open edit dialog and populate form
  const handleEditCategory = (category: Category) => {
    setCategoryToEdit(category);
    editForm.reset({
      name: category.name,
      slug: category.slug,
      description: category.description,
    });
    setIsEditDialogOpen(true);
  };

  // Handle delete category
  const handleDeleteCategory = (id: number) => {
    if (window.confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      deleteCategoryMutation.mutate(id);
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

  // Filter categories by search query
  const filteredCategories = React.useMemo(() => {
    if (!categories) return [];
    if (!searchQuery) return categories;
    
    return categories.filter(category => 
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [categories, searchQuery]);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Manage your blog categories</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setLocation("/blog/manage")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Category
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>All Categories</CardTitle>
              <CardDescription>
                {categories ? `${filteredCategories.length} categories in total` : "Loading categories..."}
              </CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search categories..."
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
              <p className="text-muted-foreground">Loading categories...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-destructive">Failed to load categories. Please try again.</p>
            </div>
          ) : filteredCategories.length > 0 ? (
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
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Folder className="h-4 w-4 mr-2 text-amber-500" />
                          {category.name}
                        </div>
                      </TableCell>
                      <TableCell>{category.slug}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {category.description || "-"}
                      </TableCell>
                      <TableCell>
                        {new Date(category.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category.id)}>
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
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                {searchQuery ? 'No categories matching your search criteria' : 'No categories found. Create your first category!'}
              </p>
              {!searchQuery && (
                <Button 
                  className="mt-4"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Category
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Category Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Add a new category to organize your blog posts.
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
                      <Input {...field} placeholder="Enter category name" />
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
                      <Input {...field} placeholder="Enter category slug" />
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
                          placeholder="Enter category description"
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
                <Button type="submit" disabled={createCategoryMutation.isPending}>
                  {createCategoryMutation.isPending ? 'Creating...' : 'Create Category'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the details for this category.
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
                      <Input {...field} placeholder="Enter category name" />
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
                      <Input {...field} placeholder="Enter category slug" />
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
                          placeholder="Enter category description"
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
                <Button type="submit" disabled={updateCategoryMutation.isPending}>
                  {updateCategoryMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}