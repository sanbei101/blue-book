import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  bigint,
  boolean,
  json,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// 用户表
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    password: text("password"),
    userId: text("user_id").unique().notNull(),
    email: text("email").unique(),
    nickname: text("nickname").notNull(),
    avatar: text("avatar"),
    bio: text("bio"),
    location: text("location"),
    followCount: integer("follow_count").default(0).notNull(),
    fansCount: integer("fans_count").default(0).notNull(),
    likeCount: integer("like_count").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    lastLoginAt: timestamp("last_login_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    gender: text("gender"),
    zodiacSign: text("zodiac_sign"),
    mbti: text("mbti"),
    education: text("education"),
    major: text("major"),
    interests: json("interests").$type<string[]>(),
    verified: boolean("verified").default(false).notNull(),
  },
  (table) => [
    index("idx_users_user_id").on(table.userId),
    index("idx_users_email").on(table.email),
  ],
);

// 分类表
export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: text("name").unique().notNull(),
    categoryTitle: text("category_title").unique().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_categories_name").on(table.name),
    index("idx_categories_category_title").on(table.categoryTitle),
  ],
);

// 笔记表
export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    content: text("content"),
    categoryId: integer("category_id").references(() => categories.id),
    type: integer("type").default(1).notNull(), // 1-图片笔记，2-视频笔记
    status: integer("status").default(2).notNull(), // 0-发布，1-草稿，2-待审核，3-未过审
    viewCount: bigint("view_count", { mode: "number" }).default(0).notNull(),
    likeCount: integer("like_count").default(0).notNull(),
    collectCount: integer("collect_count").default(0).notNull(),
    commentCount: integer("comment_count").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_posts_user_id").on(table.userId),
    index("idx_posts_category_id").on(table.categoryId),
    index("idx_posts_status").on(table.status),
    index("idx_posts_created_at").on(table.createdAt),
  ],
);

// 笔记图片表
export const postImages = pgTable(
  "post_images",
  {
    id: serial("id").primaryKey(),
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    imageUrl: text("image_url").notNull(),
  },
  (table) => [index("idx_post_images_post_id").on(table.postId)],
);

// 笔记视频表
export const postVideos = pgTable(
  "post_videos",
  {
    id: serial("id").primaryKey(),
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    coverUrl: text("cover_url"),
    videoUrl: text("video_url").notNull(),
  },
  (table) => [index("idx_post_videos_post_id").on(table.postId)],
);

// 标签表
export const tags = pgTable(
  "tags",
  {
    id: serial("id").primaryKey(),
    name: text("name").unique().notNull(),
    useCount: integer("use_count").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("idx_tags_name").on(table.name)],
);

// 笔记标签关联表
export const postTags = pgTable(
  "post_tags",
  {
    id: serial("id").primaryKey(),
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_post_tags_post_id").on(table.postId),
    index("idx_post_tags_tag_id").on(table.tagId),
    uniqueIndex("idx_post_tags_unique").on(table.postId, table.tagId),
  ],
);

// 关注关系表
export const follows = pgTable(
  "follows",
  {
    id: serial("id").primaryKey(),
    followerId: integer("follower_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    followingId: integer("following_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_follows_follower_id").on(table.followerId),
    index("idx_follows_following_id").on(table.followingId),
    uniqueIndex("idx_follows_unique").on(table.followerId, table.followingId),
  ],
);

// 点赞表
export const likes = pgTable(
  "likes",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    targetType: integer("target_type").notNull(), // 1-笔记，2-评论
    targetId: integer("target_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_likes_user_id").on(table.userId),
    index("idx_likes_target").on(table.targetType, table.targetId),
    uniqueIndex("idx_likes_unique").on(table.userId, table.targetType, table.targetId),
  ],
);

// 收藏表
export const collections = pgTable(
  "collections",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_collections_user_id").on(table.userId),
    index("idx_collections_post_id").on(table.postId),
    uniqueIndex("idx_collections_unique").on(table.userId, table.postId),
  ],
);

// 评论表
export const comments = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    parentId: integer("parent_id"),
    content: text("content").notNull(),
    likeCount: integer("like_count").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_comments_post_id").on(table.postId),
    index("idx_comments_user_id").on(table.userId),
    index("idx_comments_parent_id").on(table.parentId),
  ],
);

// 通知表
export const notifications = pgTable(
  "notifications",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    senderId: integer("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: integer("type").notNull(), // 1-点赞笔记，2-点赞评论，3-收藏，4-评论笔记，5-回复评论，6-关注，7-评论提及，8-笔记提及
    title: text("title").notNull(),
    targetId: integer("target_id"),
    commentId: integer("comment_id"),
    isRead: boolean("is_read").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_notifications_user_id").on(table.userId),
    index("idx_notifications_sender_id").on(table.senderId),
    index("idx_notifications_is_read").on(table.isRead),
  ],
);

// 关系定义
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  likes: many(likes),
  collections: many(collections),
  notifications: many(notifications),
  sentNotifications: many(notifications),
  followers: many(follows),
  following: many(follows),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id],
  }),
  images: many(postImages),
  videos: many(postVideos),
  tags: many(postTags),
  comments: many(comments),
  likes: many(likes),
  collections: many(collections),
}));

export const postImagesRelations = relations(postImages, ({ one }) => ({
  post: one(posts, {
    fields: [postImages.postId],
    references: [posts.id],
  }),
}));

export const postVideosRelations = relations(postVideos, ({ one }) => ({
  post: one(posts, {
    fields: [postVideos.postId],
    references: [posts.id],
  }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  posts: many(postTags),
}));

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, {
    fields: [postTags.postId],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postTags.tagId],
    references: [tags.id],
  }),
}));

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.followerId],
    references: [users.id],
  }),
  following: one(users, {
    fields: [follows.followingId],
    references: [users.id],
  }),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
}));

export const collectionsRelations = relations(collections, ({ one }) => ({
  user: one(users, {
    fields: [collections.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [collections.postId],
    references: [posts.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  author: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
  replies: many(comments),
  likes: many(likes),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  sender: one(users, {
    fields: [notifications.senderId],
    references: [users.id],
  }),
}));
