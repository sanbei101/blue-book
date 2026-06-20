import { eq, desc, and, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { comments, posts, users } from "@/db/schema";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const postId = parseInt(id);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (isNaN(postId)) {
      return NextResponse.json({ error: "无效的笔记ID" }, { status: 400 });
    }

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

    return NextResponse.json({
      success: true,
      data: {
        comments: commentsWithReplies,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("获取评论列表失败:", error);
    return NextResponse.json({ error: "获取评论列表失败" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const postId = parseInt(id);
    const body = await request.json();
    const { content, parentId } = body;

    if (isNaN(postId)) {
      return NextResponse.json({ error: "无效的笔记ID" }, { status: 400 });
    }

    if (!content) {
      return NextResponse.json({ error: "评论内容不能为空" }, { status: 400 });
    }

    // TODO: 从JWT token获取用户ID
    const userId = 1; // 临时硬编码

    // 创建评论
    const newComment = await db
      .insert(comments)
      .values({
        postId,
        userId,
        content,
        parentId: parentId || null,
      })
      .returning();

    // 增加评论数
    await db
      .update(posts)
      .set({ commentCount: posts.commentCount + 1 })
      .where(eq(posts.id, postId));

    // 查询作者信息
    const author = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    return NextResponse.json({
      success: true,
      data: {
        comment: {
          ...newComment[0],
          author: {
            id: author?.id,
            nickname: author?.nickname,
            avatar: author?.avatar,
          },
        },
      },
    });
  } catch (error) {
    console.error("创建评论失败:", error);
    return NextResponse.json({ error: "创建评论失败" }, { status: 500 });
  }
}
