import { eq, and, sql } from "drizzle-orm";
import * as z from "zod";

import { errorResponse, successResponse } from "@/app/api/core/common";
import { db } from "@/db";
import { collections, posts } from "@/db/schema";

const postIdSchema = z.object({
  id: z.coerce.number().int().min(1, "无效的笔记ID"),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const parsed = postIdSchema.safeParse({ id });
    if (!parsed.success) {
      const readableError = z.prettifyError(parsed.error);
      return errorResponse(readableError, 424);
    }
    const postId = parsed.data.id;

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
        .set({ collectCount: sql`${posts.collectCount} - 1` })
        .where(eq(posts.id, postId));

      return successResponse({ isCollected: false });
    } else {
      // 添加收藏
      await db.insert(collections).values({
        userId,
        postId,
      });

      // 增加收藏数
      await db
        .update(posts)
        .set({ collectCount: sql`${posts.collectCount} + 1` })
        .where(eq(posts.id, postId));

      return successResponse({ isCollected: true });
    }
  } catch (error) {
    console.error("收藏操作失败:", error);
    return errorResponse("收藏操作失败", 500);
  }
}
