import { eq, and, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { likes, posts } from "@/db/schema";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return NextResponse.json({ error: "无效的笔记ID" }, { status: 400 });
    }

    // TODO: 从JWT token获取用户ID
    const userId = 1; // 临时硬编码

    // 检查是否已点赞
    const existingLike = await db.query.likes.findFirst({
      where: and(
        eq(likes.userId, userId),
        eq(likes.targetType, 1), // 1-笔记
        eq(likes.targetId, postId),
      ),
    });

    if (existingLike) {
      // 取消点赞
      await db
        .delete(likes)
        .where(and(eq(likes.userId, userId), eq(likes.targetType, 1), eq(likes.targetId, postId)));

      // 减少点赞数
      await db
        .update(posts)
        .set({ likeCount: sql`${posts.likeCount} - 1` })
        .where(eq(posts.id, postId));

      return NextResponse.json({
        success: true,
        data: { isLiked: false },
      });
    } else {
      // 添加点赞
      await db.insert(likes).values({
        userId,
        targetType: 1,
        targetId: postId,
      });

      // 增加点赞数
      await db
        .update(posts)
        .set({ likeCount: sql`${posts.likeCount} + 1` })
        .where(eq(posts.id, postId));

      return NextResponse.json({
        success: true,
        data: { isLiked: true },
      });
    }
  } catch (error) {
    console.error("点赞操作失败:", error);
    return NextResponse.json({ error: "点赞操作失败" }, { status: 500 });
  }
}
