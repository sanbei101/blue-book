import { eq, desc, and, sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import * as z from "zod";

import { errorResponse, successResponse } from "@/app/api/core/common";
import { db } from "@/db";
import { posts, users, postImages, categories } from "@/db/schema";

const getPostsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  categoryId: z.coerce.number().int().optional(),
  userId: z.coerce.number().int().optional(),
});

export type GetPostsQuery = z.infer<typeof getPostsQuerySchema>;

const createPostSchema = createInsertSchema(posts, {
  title: z.string().min(1, "标题不能为空"),
  content: z.string().optional(),
  categoryId: z.number().int().optional(),
  type: z.number().int().optional(),
})
  .pick({
    title: true,
    content: true,
    categoryId: true,
    type: true,
  })
  .extend({
    images: z.array(z.string()).optional(),
  });

export type CreatePostRequest = z.infer<typeof createPostSchema>;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = getPostsQuerySchema.safeParse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      categoryId: searchParams.get("categoryId"),
      userId: searchParams.get("userId"),
    });
    if (!parsed.success) {
      const readableError = z.prettifyError(parsed.error);
      return errorResponse(readableError, 424);
    }

    const { page, limit, categoryId, userId } = parsed.data;
    const offset = (page - 1) * limit;

    // 构建查询条件
    const conditions = [eq(posts.status, 0)]; // 只查询已发布的笔记

    if (categoryId) {
      conditions.push(eq(posts.categoryId, categoryId));
    }

    if (userId) {
      conditions.push(eq(posts.userId, userId));
    }

    // 查询笔记列表
    const postsList = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        type: posts.type,
        viewCount: posts.viewCount,
        likeCount: posts.likeCount,
        collectCount: posts.collectCount,
        commentCount: posts.commentCount,
        createdAt: posts.createdAt,
        author: {
          id: users.id,
          nickname: users.nickname,
          avatar: users.avatar,
        },
        category: {
          id: categories.id,
          name: categories.name,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(and(...conditions))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    // 查询每个笔记的第一张图片
    const postsWithImages = await Promise.all(
      postsList.map(async (post) => {
        const images = await db
          .select({ imageUrl: postImages.imageUrl })
          .from(postImages)
          .where(eq(postImages.postId, post.id))
          .limit(9);

        return Object.assign({}, post, { images: images.map((img) => img.imageUrl) });
      }),
    );

    // 查询总数
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(posts)
      .where(and(...conditions));

    const total = countResult[0]?.count || 0;

    return successResponse({
      posts: postsWithImages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("获取笔记列表失败:", error);
    return errorResponse("获取笔记列表失败", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = createPostSchema.safeParse(body);
    if (!parsed.success) {
      const readableError = z.prettifyError(parsed.error);
      return errorResponse(readableError, 424);
    }

    // TODO: 从JWT token获取用户ID
    const userId = 1; // 临时硬编码

    const { title, content, categoryId, type, images } = parsed.data;

    // 创建笔记
    const [newPost] = await db
      .insert(posts)
      .values({
        userId,
        title,
        content: content ?? null,
        categoryId: categoryId ?? null,
        type: type ?? 1,
        status: 0, // 直接发布
      })
      .returning();

    // 保存图片
    if (images && images.length > 0) {
      await db.insert(postImages).values(
        images.map((imageUrl: string) => ({
          postId: newPost.id,
          imageUrl,
        })),
      );
    }

    return successResponse({ post: newPost });
  } catch (error) {
    console.error("创建笔记失败:", error);
    return errorResponse("创建笔记失败", 500);
  }
}
