import { pgTable, text, serial, jsonb, timestamp, boolean, integer, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("user"),
  apiKey: text("api_key"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  socialLinks: jsonb("social_links"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  prompt: text("prompt").notNull(),
  response: text("response").notNull(),
  model: text("model").notNull(),
  settings: jsonb("settings"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  path: text("path").notNull().unique(),
  category: text("category").notNull(),
  isPopular: boolean("is_popular").default(false),
  isPremium: boolean("is_premium").default(false),
  isNew: boolean("is_new").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Characters schema
export const aiCharacters = pgTable("ai_characters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  shortDescription: text("short_description"),
  description: text("description").notNull(),
  profileImage: text("profile_image"),
  avatarUrl: text("avatar_url"),
  prompt: text("prompt").notNull(),
  model: text("model").notNull().default("mistral-small-latest"),
  languageStyle: text("language_style").notNull(),
  category: text("category"),
  tags: text("tags"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const characterChats = pgTable("character_chats", {
  id: serial("id").primaryKey(),
  characterId: integer("character_id").references(() => aiCharacters.id).notNull(),
  userId: integer("user_id").references(() => users.id),
  userMessage: text("user_message").notNull(),
  characterResponse: text("character_response").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Blog schemas
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  featuredImage: text("featured_image"),
  authorId: integer("author_id").references(() => users.id).notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  status: varchar("status", { length: 20 }).notNull().default("draft"), // draft, published, archived
  publishedAt: timestamp("published_at"),
  seoTitle: varchar("seo_title", { length: 200 }),
  seoDescription: text("seo_description"),
  seoKeywords: text("seo_keywords"),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    slugIdx: index("slug_idx").on(table.slug),
    statusIdx: index("status_idx").on(table.status),
    authorIdx: index("author_idx").on(table.authorId),
    categoryIdx: index("category_idx").on(table.categoryId),
  };
});

export const postTags = pgTable("post_tags", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => blogPosts.id).notNull(),
  tagId: integer("tag_id").references(() => tags.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    postTagIdx: index("post_tag_idx").on(table.postId, table.tagId),
  };
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  blogPosts: many(blogPosts),
  characterChats: many(characterChats),
}));

export const aiCharactersRelations = relations(aiCharacters, ({ many }) => ({
  chats: many(characterChats),
}));

export const characterChatsRelations = relations(characterChats, ({ one }) => ({
  character: one(aiCharacters, {
    fields: [characterChats.characterId],
    references: [aiCharacters.id],
  }),
  user: one(users, {
    fields: [characterChats.userId],
    references: [users.id],
  }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one, many }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [blogPosts.categoryId],
    references: [categories.id],
  }),
  tags: many(postTags),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(blogPosts),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  posts: many(postTags),
}));

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(blogPosts, {
    fields: [postTags.postId],
    references: [blogPosts.id],
  }),
  tag: one(tags, {
    fields: [postTags.tagId],
    references: [tags.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertToolSchema = createInsertSchema(tools).omit({
  id: true,
  createdAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTagSchema = createInsertSchema(tags).omit({
  id: true,
  createdAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
}).extend({
  tagIds: z.array(z.number()).optional(),
});

export const insertPostTagSchema = createInsertSchema(postTags).omit({
  id: true,
  createdAt: true,
});

export const insertAiCharacterSchema = createInsertSchema(aiCharacters).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCharacterChatSchema = createInsertSchema(characterChats).omit({
  id: true, 
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type Tool = typeof tools.$inferSelect;
export type InsertTool = z.infer<typeof insertToolSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Tag = typeof tags.$inferSelect;
export type InsertTag = z.infer<typeof insertTagSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type PostTag = typeof postTags.$inferSelect;
export type InsertPostTag = z.infer<typeof insertPostTagSchema>;

export type AiCharacter = typeof aiCharacters.$inferSelect;
export type InsertAiCharacter = z.infer<typeof insertAiCharacterSchema>;

export type CharacterChat = typeof characterChats.$inferSelect;
export type InsertCharacterChat = z.infer<typeof insertCharacterChatSchema>;
