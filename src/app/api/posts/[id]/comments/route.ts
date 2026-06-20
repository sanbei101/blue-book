import { eq, desc, and, sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import * as z from "zod";

import { errorResponse, successResponse } from "@/app/api/core/common";
import { db } from "@/db";
import { comments, posts, users } from "@/db/schema";

const postIdSchema = z.object({
  id: z.coerce.number().int().min(1, "无效的笔记ID"),
});

const commentsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CommentsQuery = z.infer<typeof commentsQuerySchema>;

const createCommentSchema = createInsertSchema(comments, {
  content: z.string().min(1, "评论内容不能为空"),
  parentId: z.number().int().optional(),
}).pick({
  content: true,
  parentId: true,
});

export type CreateCommentRequest = z.infer<typeof createCommentSchema>;

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const parsedId = postIdSchema.safeParse({ id });
    if (!parsedId.success) {
      const readableError = z.prettifyError(parsedId.error);
      return errorResponse(readableError, 424);
    }
    const postId = parsedId.data.id;

    const { searchParams } = new URL(request.url);
    const parsedQuery = commentsQuerySchema.safeParse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    });
    if (!parsedQuery.success) {
      const readableError = z.prettifyError(parsedQuery.error);
      return errorResponse(readableError, 424);
    }

    const { page, limit } = parsedQuery.data;
    const offset = (page - 1) * limit;

    // 查询评论列表（只查询顶级评论）
    const commentsList = await db
      .select({
        id: comments.id,
        content: comments.content,
        likeCount: comments.likeCount,
        createdAt: comments.createdAt,
        author: {
          id: users.id,
          nickname: users.nickname,
          avatar: users.avatar,
        },
      })
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .where(and(eq(comments.postId, postId), sql`${comments.parentId} IS NULL`))
      .orderBy(desc(comments.createdAt))
      .limit(limit)
      .offset(offset);

    // 查询每个评论的回复
    const commentsWithReplies = await Promise.all(
      commentsList.map(async (comment) => {
        const replies = await db
          .select({
            id: comments.id,
            content: comments.content,
            likeCount: comments.likeCount,
            createdAt: comments.createdAt,
            author: {
              id: users.id,
              nickname: users.nickname,
              avatar: users.avatar,
            },
          })
          .from(comments)
          .leftJoin(users, eq(comments.userId, users.id))
          .where(eq(comments.parentId, comment.id))
          .orderBy(desc(comments.createdAt))
          .limit(5);

        return Object.assign({}, comment, { replies });
      }),
    );

    // 查询总数
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(comments)
      .where(and(eq(comments.postId, postId), sql`${comments.parentId} IS NULL`));

    const total = countResult[0]?.count || 0;

    return successResponse({
      comments: commentsWithReplies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("获取评论列表失败:", error);
    return errorResponse("获取评论列表失败", 500);
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const parsedId = postIdSchema.safeParse({ id });
    if (!parsedId.success) {
      const readableError = z.prettifyError(parsedId.error);
      return errorResponse(readableError, 424);
    }
    const postId = parsedId.data.id;

    const body: unknown = await request.json();
    const parsed = createCommentSchema.safeParse(body);
    if (!parsed.success) {
      const readableError = z.prettifyError(parsed.error);
      return errorResponse(readableError, 424);
    }

    // TODO: 从JWT token获取用户ID
    const userId = 1; // 临时硬编码

    const { content, parentId } = parsed.data;

    // 创建评论
    const [newComment] = await db
      .insert(comments)
      .values({
        postId,
        userId,
        content,
        parentId: parentId ?? null,
      })
      .returning();

    // 增加评论数
    await db
      .update(posts)
      .set({ commentCount: sql`${posts.commentCount} + 1` })
      .where(eq(posts.id, postId));

    // 查询作者信息
    const author = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    return successResponse({
      comment: {
        ...newComment,
        author: {
          id: author?.id,
          nickname: author?.nickname,
          avatar: author?.avatar,
        },
      },
    });
  } catch (error) {
    console.error("创建评论失败:", error);
    return errorResponse("创建评论失败", 500);
  }
}
