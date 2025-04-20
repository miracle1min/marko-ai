import { 
  users, tools, chatMessages, blogPosts, categories, tags, postTags, aiCharacters, characterChats,
  type User, type InsertUser,
  type Tool, type InsertTool,
  type ChatMessage, type InsertChatMessage,
  type BlogPost, type InsertBlogPost,
  type Category, type InsertCategory,
  type Tag, type InsertTag,
  type PostTag, type InsertPostTag,
  type AiCharacter, type InsertAiCharacter,
  type CharacterChat, type InsertCharacterChat
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, like, inArray, isNull, isNotNull } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Tool operations
  getAllTools(): Promise<Tool[]>;
  getToolById(id: number): Promise<Tool | undefined>;
  getToolByPath(path: string): Promise<Tool | undefined>;
  createTool(tool: InsertTool): Promise<Tool>;
  
  // Chat operations
  saveChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getUserChatHistory(userId: number): Promise<ChatMessage[]>;
  
  // AI Character operations
  getAllAiCharacters(): Promise<AiCharacter[]>;
  getAiCharacterById(id: number): Promise<AiCharacter | undefined>;
  getAiCharacterBySlug(slug: string): Promise<AiCharacter | undefined>;
  createAiCharacter(character: InsertAiCharacter): Promise<AiCharacter>;
  updateAiCharacter(id: number, data: Partial<InsertAiCharacter>): Promise<AiCharacter | undefined>;
  deleteAiCharacter(id: number): Promise<boolean>;
  
  // Character Chat operations
  saveCharacterChat(chat: InsertCharacterChat): Promise<CharacterChat>;
  getCharacterChatHistory(characterId: number, userId?: number): Promise<CharacterChat[]>;

  // Blog operations
  // Category operations
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, data: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Tag operations
  getAllTags(): Promise<Tag[]>;
  getTagById(id: number): Promise<Tag | undefined>;
  getTagBySlug(slug: string): Promise<Tag | undefined>;
  createTag(tag: InsertTag): Promise<Tag>;
  updateTag(id: number, data: Partial<InsertTag>): Promise<Tag | undefined>;
  deleteTag(id: number): Promise<boolean>;
  
  // Blog post operations
  getAllBlogPosts(filters?: {
    status?: string;
    categoryId?: number;
    authorId?: number;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<BlogPost[]>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, data: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  publishBlogPost(id: number): Promise<BlogPost | undefined>;
  unpublishBlogPost(id: number): Promise<BlogPost | undefined>;
  getPostTags(postId: number): Promise<Tag[]>;
  addTagToPost(postId: number, tagId: number): Promise<PostTag>;
  removeTagFromPost(postId: number, tagId: number): Promise<boolean>;
  getBlogPostsCount(filters?: { status?: string; categoryId?: number; authorId?: number; search?: string }): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }
  
  // Tool operations
  async getAllTools(): Promise<Tool[]> {
    return await db.select().from(tools);
  }
  
  async getToolById(id: number): Promise<Tool | undefined> {
    const [tool] = await db.select().from(tools).where(eq(tools.id, id));
    return tool;
  }
  
  async getToolByPath(path: string): Promise<Tool | undefined> {
    const [tool] = await db.select().from(tools).where(eq(tools.path, path));
    return tool;
  }
  
  async createTool(toolData: InsertTool): Promise<Tool> {
    const [tool] = await db.insert(tools).values(toolData).returning();
    return tool;
  }
  
  // Chat operations
  async saveChatMessage(messageData: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db.insert(chatMessages).values(messageData).returning();
    return message;
  }
  
  async getUserChatHistory(userId: number): Promise<ChatMessage[]> {
    return await db.select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(chatMessages.createdAt);
  }
  
  // AI Character operations
  async getAllAiCharacters(): Promise<AiCharacter[]> {
    return await db.select().from(aiCharacters).where(eq(aiCharacters.isActive, true));
  }
  
  async getAiCharacterById(id: number): Promise<AiCharacter | undefined> {
    const [character] = await db.select().from(aiCharacters).where(eq(aiCharacters.id, id));
    return character;
  }
  
  async getAiCharacterBySlug(slug: string): Promise<AiCharacter | undefined> {
    const [character] = await db.select().from(aiCharacters).where(eq(aiCharacters.slug, slug));
    return character;
  }
  
  async createAiCharacter(characterData: InsertAiCharacter): Promise<AiCharacter> {
    const [character] = await db.insert(aiCharacters).values({
      ...characterData,
      updatedAt: new Date()
    }).returning();
    return character;
  }
  
  async updateAiCharacter(id: number, data: Partial<InsertAiCharacter>): Promise<AiCharacter | undefined> {
    const [character] = await db.update(aiCharacters)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(aiCharacters.id, id))
      .returning();
    return character;
  }
  
  async deleteAiCharacter(id: number): Promise<boolean> {
    const result = await db.delete(aiCharacters).where(eq(aiCharacters.id, id)).returning();
    return result.length > 0;
  }
  
  // Character Chat operations
  async saveCharacterChat(chatData: InsertCharacterChat): Promise<CharacterChat> {
    const [chat] = await db.insert(characterChats).values(chatData).returning();
    return chat;
  }
  
  async getCharacterChatHistory(characterId: number, userId?: number): Promise<CharacterChat[]> {
    let query = db.select()
      .from(characterChats)
      .where(eq(characterChats.characterId, characterId));
      
    if (userId) {
      query = query.where(eq(characterChats.userId, userId));
    }
    
    return await query.orderBy(characterChats.createdAt);
  }

  // Blog operations
  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.name);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async createCategory(categoryData: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values({
      ...categoryData,
      updatedAt: new Date()
    }).returning();
    return category;
  }

  async updateCategory(id: number, data: Partial<InsertCategory>): Promise<Category | undefined> {
    const [category] = await db.update(categories)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(categories.id, id))
      .returning();
    return category;
  }

  async deleteCategory(id: number): Promise<boolean> {
    // First check if there are blog posts with this category
    const [relatedPost] = await db.select({ id: blogPosts.id })
      .from(blogPosts)
      .where(eq(blogPosts.categoryId, id))
      .limit(1);
    
    if (relatedPost) {
      // If there are posts, don't delete the category
      return false;
    }

    const result = await db.delete(categories).where(eq(categories.id, id)).returning();
    return result.length > 0;
  }

  // Tag operations
  async getAllTags(): Promise<Tag[]> {
    return await db.select().from(tags).orderBy(tags.name);
  }

  async getTagById(id: number): Promise<Tag | undefined> {
    const [tag] = await db.select().from(tags).where(eq(tags.id, id));
    return tag;
  }

  async getTagBySlug(slug: string): Promise<Tag | undefined> {
    const [tag] = await db.select().from(tags).where(eq(tags.slug, slug));
    return tag;
  }

  async createTag(tagData: InsertTag): Promise<Tag> {
    const [tag] = await db.insert(tags).values(tagData).returning();
    return tag;
  }

  async updateTag(id: number, data: Partial<InsertTag>): Promise<Tag | undefined> {
    const [tag] = await db.update(tags)
      .set(data)
      .where(eq(tags.id, id))
      .returning();
    return tag;
  }

  async deleteTag(id: number): Promise<boolean> {
    // First delete all post-tag relationships
    await db.delete(postTags).where(eq(postTags.tagId, id));
    
    // Then delete the tag
    const result = await db.delete(tags).where(eq(tags.id, id)).returning();
    return result.length > 0;
  }

  // Blog post operations
  async getAllBlogPosts(filters?: {
    status?: string;
    categoryId?: number;
    authorId?: number;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<BlogPost[]> {
    let query = db.select().from(blogPosts);
    
    if (filters) {
      if (filters.status) {
        query = query.where(eq(blogPosts.status, filters.status));
      }
      
      if (filters.categoryId) {
        query = query.where(eq(blogPosts.categoryId, filters.categoryId));
      }
      
      if (filters.authorId) {
        query = query.where(eq(blogPosts.authorId, filters.authorId));
      }
      
      if (filters.search) {
        query = query.where(
          sql`(${blogPosts.title} ILIKE ${'%' + filters.search + '%'} OR ${blogPosts.content} ILIKE ${'%' + filters.search + '%'})`
        );
      }
    }
    
    query = query.orderBy(desc(blogPosts.createdAt));
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
      
      if (filters.offset) {
        query = query.offset(filters.offset);
      }
    }
    
    return await query;
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async createBlogPost(postData: InsertBlogPost): Promise<BlogPost> {
    // Extract tag IDs from the post data if provided
    const { tagIds, ...postDataWithoutTags } = postData;
    
    // Insert the blog post
    const [post] = await db.insert(blogPosts).values({
      ...postDataWithoutTags,
      updatedAt: new Date()
    }).returning();
    
    // If tag IDs are provided, create the post-tag relationships
    if (tagIds && tagIds.length > 0) {
      for (const tagId of tagIds) {
        await db.insert(postTags).values({
          postId: post.id,
          tagId
        });
      }
    }
    
    return post;
  }

  async updateBlogPost(id: number, data: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    // Extract tag IDs from the update data if provided
    const { tagIds, ...updateDataWithoutTags } = data;
    
    // Update the blog post
    const [post] = await db.update(blogPosts)
      .set({
        ...updateDataWithoutTags,
        updatedAt: new Date()
      })
      .where(eq(blogPosts.id, id))
      .returning();
    
    if (!post) {
      return undefined;
    }
    
    // If tag IDs are provided, update the post-tag relationships
    if (tagIds) {
      // First, remove all existing tags for this post
      await db.delete(postTags).where(eq(postTags.postId, id));
      
      // Then, add the new tags
      for (const tagId of tagIds) {
        await db.insert(postTags).values({
          postId: id,
          tagId
        });
      }
    }
    
    return post;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    // First, delete all post-tag relationships
    await db.delete(postTags).where(eq(postTags.postId, id));
    
    // Then delete the blog post
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
    return result.length > 0;
  }

  async publishBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.update(blogPosts)
      .set({
        status: 'published',
        publishedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(blogPosts.id, id))
      .returning();
    return post;
  }

  async unpublishBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.update(blogPosts)
      .set({
        status: 'draft',
        updatedAt: new Date()
      })
      .where(eq(blogPosts.id, id))
      .returning();
    return post;
  }

  async getPostTags(postId: number): Promise<Tag[]> {
    return await db.select({
      id: tags.id,
      name: tags.name,
      slug: tags.slug,
      createdAt: tags.createdAt
    })
    .from(tags)
    .innerJoin(postTags, eq(tags.id, postTags.tagId))
    .where(eq(postTags.postId, postId));
  }

  async addTagToPost(postId: number, tagId: number): Promise<PostTag> {
    // Check if the relationship already exists
    const [existingRelation] = await db.select()
      .from(postTags)
      .where(and(
        eq(postTags.postId, postId),
        eq(postTags.tagId, tagId)
      ));
    
    if (existingRelation) {
      return existingRelation;
    }
    
    // If not, create the relation
    const [relation] = await db.insert(postTags)
      .values({ postId, tagId })
      .returning();
    
    return relation;
  }

  async removeTagFromPost(postId: number, tagId: number): Promise<boolean> {
    const result = await db.delete(postTags)
      .where(and(
        eq(postTags.postId, postId),
        eq(postTags.tagId, tagId)
      ))
      .returning();
    
    return result.length > 0;
  }

  async getBlogPostsCount(filters?: { 
    status?: string; 
    categoryId?: number; 
    authorId?: number; 
    search?: string 
  }): Promise<number> {
    let query = db.select({ count: sql<number>`count(*)` }).from(blogPosts);
    
    if (filters) {
      if (filters.status) {
        query = query.where(eq(blogPosts.status, filters.status));
      }
      
      if (filters.categoryId) {
        query = query.where(eq(blogPosts.categoryId, filters.categoryId));
      }
      
      if (filters.authorId) {
        query = query.where(eq(blogPosts.authorId, filters.authorId));
      }
      
      if (filters.search) {
        query = query.where(
          sql`(${blogPosts.title} ILIKE ${'%' + filters.search + '%'} OR ${blogPosts.content} ILIKE ${'%' + filters.search + '%'})`
        );
      }
    }
    
    const [result] = await query;
    return result ? result.count : 0;
  }
}

// Initialize and seed some data
const initializeData = async () => {
  // First, check if tools table is empty
  const existingTools = await db.select({ id: tools.id }).from(tools).limit(1);
  
  if (existingTools.length === 0) {
    // Seed tools
    const sampleTools = [
      {
        name: "SEO Optimizer AI",
        description: "Optimasi SEO website Anda secara otomatis dengan teknologi AI mutakhir.",
        path: "/tools/seo-optimizer",
        category: "seo",
        isPopular: true,
        isPremium: false,
        isNew: false,
      },
      {
        name: "Content Generator",
        description: "Buat artikel berkualitas tinggi dalam hitungan detik dengan bantuan Gemini Flash 2.0.",
        path: "/tools/content-generator",
        category: "content",
        isPopular: true,
        isPremium: false,
        isNew: true,
      },
      {
        name: "Keyword Research Pro",
        description: "Temukan keyword dengan potensi traffic tinggi dan kompetisi rendah untuk website Anda.",
        path: "/tools/keyword-research",
        category: "keyword",
        isPopular: true,
        isPremium: true,
        isNew: false,
      }
    ];
    
    for (const tool of sampleTools) {
      await db.insert(tools).values(tool);
    }
  }
  
  // Check if there's at least one admin user
  const adminUsers = await db.select({ id: users.id })
    .from(users)
    .where(eq(users.role, 'admin'))
    .limit(1);
  
  if (adminUsers.length === 0) {
    // Create a default admin user if none exists
    await db.insert(users).values({
      username: "admin",
      password: "$2b$10$5QwQM4LjOgmHEfxBdZDbeO7ODv1t0A75KqUvqUhXZBuJoJ6F0xq.C", // "admin123"
      email: "admin@example.com",
      name: "Admin User",
      role: "admin",
    });
  }
  
  // Check if there are categories
  const existingCategories = await db.select({ id: categories.id }).from(categories).limit(1);
  
  if (existingCategories.length === 0) {
    // Seed initial categories
    const sampleCategories = [
      {
        name: "Technology",
        slug: "technology",
        description: "Articles about the latest technologies and innovations.",
      },
      {
        name: "Marketing",
        slug: "marketing",
        description: "Digital marketing strategies and tips.",
      },
      {
        name: "Business",
        slug: "business",
        description: "Business growth, entrepreneurship and management content.",
      }
    ];
    
    for (const category of sampleCategories) {
      await db.insert(categories).values({
        ...category,
        updatedAt: new Date(),
      });
    }
  }
};

// Initialize the database with the storage class
initializeData().catch(console.error);

export const storage = new DatabaseStorage();
