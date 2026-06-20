import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { collections, posts } from "@/db/schema";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return NextResponse.json({ error: "无效的笔记ID" }, { status: 400 });
    }

    // TODO: 从JWT token获取用户ID
    const userId = 1; // 临时硬编码

    // 检查是否已收藏
    const existingCollection = await db.query.collections.findFirst({
      where: and(eq(collections.userId, userId), eq(collections.postId, postId)),
    });

    if (existingCollection) {
      // 取消收藏
      await db
        .delete(collections)
        .where(and(eq(collections.userId, userId), eq(collections.postId, postId)));

      // 减少收藏数
      await db
        .update(posts)
        .set({ collectCount: posts.collectCount - 1 })
        .where(eq(posts.id, postId));

      return NextResponse.json({
        success: true,
        data: { isCollected: false },
      });
    } else {
      // 添加收藏
      await db.insert(collections).values({
        userId,
        postId,
      });

      // 增加收藏数
      await db
        .update(posts)
        .set({ collectCount: posts.collectCount + 1 })
        .where(eq(posts.id, postId));

      return NextResponse.json({
        success: true,
        data: { isCollected: true },
      });
    }
  } catch (error) {
    console.error("收藏操作失败:", error);
    return NextResponse.json({ error: "收藏操作失败" }, { status: 500 });
  }
}
