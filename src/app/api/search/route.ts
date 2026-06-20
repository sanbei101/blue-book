import { eq, desc, sql } from "drizzle-orm";
import * as z from "zod";

import { errorResponse, successResponse } from "@/app/api/core/common";
import { db } from "@/db";
import { posts, users, postImages } from "@/db/schema";

const searchQuerySchema = z.object({
  keyword: z.string().default(""),
  type: z.enum(["all", "posts", "users"]).default("all"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = searchQuerySchema.safeParse({
      keyword: searchParams.get("keyword"),
      type: searchParams.get("type"),
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    });
    if (!parsed.success) {
      const readableError = z.prettifyError(parsed.error);
      return errorResponse(readableError, 424);
    }

    const { keyword, type, page, limit } = parsed.data;

    if (!keyword) {
      return successResponse({
        posts: [],
        users: [],
        pagination: {
          page: 1,
          limit,
          total: 0,
          totalPages: 0,
        },
      });
    }

    const offset = (page - 1) * limit;
    const searchPattern = `%${keyword}%`;

    let postsList: Array<{
      id: number;
      title: string;
      content: string | null;
      type: number;
      viewCount: number;
      likeCount: number;
      collectCount: number;
      commentCount: number;
      createdAt: Date;
      author: {
        id: number;
        nickname: string;
        avatar: string | null;
      } | null;
      images: string[];
    }> = [];
    let usersList: Array<{
      id: number;
      nickname: string | null;
      avatar: string | null;
      bio: string | null;
      fansCount: number;
    }> = [];
    let totalPosts = 0;
    let totalUsers = 0;

    // 搜索笔记
    if (type === "all" || type === "posts") {
      const postsResult = await db
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
        })
        .from(posts)
        .leftJoin(users, eq(posts.userId, users.id))
        .where(sql`${posts.title} LIKE ${searchPattern} OR ${posts.content} LIKE ${searchPattern}`)
        .orderBy(desc(posts.createdAt))
        .limit(limit)
        .offset(offset);

      postsList = await Promise.all(
        postsResult.map(async (post) => {
          const images = await db
            .select({ imageUrl: postImages.imageUrl })
            .from(postImages)
            .where(eq(postImages.postId, post.id))
            .limit(9);

          return Object.assign({}, post, { images: images.map((img) => img.imageUrl) });
        }),
      );

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(posts)
        .where(sql`${posts.title} LIKE ${searchPattern} OR ${posts.content} LIKE ${searchPattern}`);

      totalPosts = countResult[0]?.count || 0;
    }

    // 搜索用户
    if (type === "all" || type === "users") {
      usersList = await db
        .select({
          id: users.id,
          nickname: users.nickname,
          avatar: users.avatar,
          bio: users.bio,
          fansCount: users.fansCount,
        })
        .from(users)
        .where(sql`${users.nickname} LIKE ${searchPattern} OR ${users.bio} LIKE ${searchPattern}`)
        .orderBy(desc(users.fansCount))
        .limit(type === "all" ? 5 : limit)
        .offset(type === "all" ? 0 : offset);

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .where(sql`${users.nickname} LIKE ${searchPattern} OR ${users.bio} LIKE ${searchPattern}`);

      totalUsers = countResult[0]?.count || 0;
    }

    return successResponse({
      posts: postsList,
      users: usersList,
      pagination: {
        page,
        limit,
        total:
          type === "posts" ? totalPosts : type === "users" ? totalUsers : totalPosts + totalUsers,
        totalPages: Math.ceil(
          (type === "posts"
            ? totalPosts
            : type === "users"
              ? totalUsers
              : totalPosts + totalUsers) / limit,
        ),
      },
    });
  } catch (error) {
    console.error("搜索失败:", error);
    return errorResponse("搜索失败", 500);
  }
}
