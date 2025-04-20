import React from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Pencil,
  AlignLeft,
  Tags,
  FolderOpen,
  FileText,
  Eye,
  FilePlus2,
  Settings,
  BarChart3
} from 'lucide-react';

interface Stats {
  posts: number;
  categories: number;
  tags: number;
  published: number;
  draft: number;
}

const dummyActivityData = [
  { name: 'Mon', posts: 2, views: 10 },
  { name: 'Tue', posts: 1, views: 15 },
  { name: 'Wed', posts: 3, views: 32 },
  { name: 'Thu', posts: 0, views: 28 },
  { name: 'Fri', posts: 2, views: 40 },
  { name: 'Sat', posts: 1, views: 35 },
  { name: 'Sun', posts: 0, views: 25 },
];

export default function BlogManager() {
  const [, setLocation] = useLocation();
  
  // Fetch blog stats
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ['/api/blog/stats'],
    enabled: true,
  });
  
  // Define dashboard cards with actions
  const dashboardCards = [
    {
      title: 'All Posts',
      description: 'Manage your blog posts',
      icon: <FileText className="h-6 w-6" />,
      stats: stats ? `${stats.posts} posts` : 'Loading...',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      action: () => setLocation('/blog/manage/posts'),
    },
    {
      title: 'Categories',
      description: 'Organize content with categories',
      icon: <FolderOpen className="h-6 w-6" />,
      stats: stats ? `${stats.categories} categories` : 'Loading...',
      color: 'text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-950/30',
      action: () => setLocation('/blog/manage/categories'),
    },
    {
      title: 'Tags',
      description: 'Manage content tags',
      icon: <Tags className="h-6 w-6" />,
      stats: stats ? `${stats.tags} tags` : 'Loading...',
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950/30',
      action: () => setLocation('/blog/manage/tags'),
    },
    {
      title: 'Published',
      description: 'Posts live on your blog',
      icon: <Eye className="h-6 w-6" />,
      stats: stats ? `${stats.published} published` : 'Loading...',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
      action: () => setLocation('/blog/manage/posts?status=published'),
    },
    {
      title: 'Drafts',
      description: 'Posts in progress',
      icon: <Pencil className="h-6 w-6" />,
      stats: stats ? `${stats.draft} drafts` : 'Loading...',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
      action: () => setLocation('/blog/manage/posts?status=draft'),
    },
    {
      title: 'Analytics',
      description: 'View content analytics',
      icon: <BarChart3 className="h-6 w-6" />,
      stats: 'Coming soon',
      color: 'text-slate-500',
      bgColor: 'bg-slate-50 dark:bg-slate-950/30',
      action: () => alert('Analytics feature coming soon!'),
      disabled: true,
    },
  ];

  // Quick actions for the dashboard
  const quickActions = [
    {
      title: 'New Post',
      icon: <FilePlus2 className="h-5 w-5" />,
      action: () => setLocation('/blog/manage/posts/new'),
    },
    {
      title: 'View Blog',
      icon: <Eye className="h-5 w-5" />,
      action: () => setLocation('/blog'),
    },
    {
      title: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      action: () => alert('Blog settings feature coming soon!'),
      disabled: true,
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Blog Dashboard</h1>
          <p className="text-muted-foreground">Manage and monitor your blog content</p>
        </div>
        <div className="flex gap-2">
          {quickActions.map((action, index) => (
            <Button 
              key={index} 
              variant={index === 0 ? "default" : "outline"} 
              onClick={action.action}
              disabled={action.disabled}
            >
              {action.icon}
              <span className="ml-2">{action.title}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {dashboardCards.map((card, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className={`p-2 rounded-md ${card.bgColor}`}>
                  <div className={card.color}>{card.icon}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-2xl font-bold">{card.stats}</span>
                <Button 
                  variant="ghost" 
                  onClick={card.action}
                  disabled={card.disabled}
                >
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Posts and views over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dummyActivityData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="posts"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right" 
                    type="monotone"
                    dataKey="views"
                    stroke="#82ca9d"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Content</CardTitle>
            <CardDescription>Recently published and draft posts</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center">
                  <AlignLeft className="h-5 w-5 mr-2 text-muted-foreground" />
                  Recently Published
                </h3>
                {isLoading ? (
                  <p className="text-muted-foreground">Loading content...</p>
                ) : stats && stats.published > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      View all your published content in the Posts section.
                    </p>
                    <Button variant="outline" onClick={() => setLocation('/blog/manage/posts?status=published')}>
                      View Published Posts
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      No published posts yet. Create your first blog post to get started.
                    </p>
                    <Button variant="outline" onClick={() => setLocation('/blog/manage/posts/new')}>
                      Create New Post
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center">
                  <Pencil className="h-5 w-5 mr-2 text-muted-foreground" />
                  Draft Posts
                </h3>
                {isLoading ? (
                  <p className="text-muted-foreground">Loading drafts...</p>
                ) : stats && stats.draft > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      You have {stats.draft} draft{stats.draft !== 1 ? 's' : ''} in progress. Continue working on your content.
                    </p>
                    <Button variant="outline" onClick={() => setLocation('/blog/manage/posts?status=draft')}>
                      View Draft Posts
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No drafts at the moment. Start creating new content!
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}