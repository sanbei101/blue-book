import { eq, and, sql } from "drizzle-orm";
import * as z from "zod";

import { errorResponse, successResponse } from "@/app/api/core/common";
import { db } from "@/db";
import { likes, posts } from "@/db/schema";

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

      return successResponse({ isLiked: false });
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

      return successResponse({ isLiked: true });
    }
  } catch (error) {
    console.error("点赞操作失败:", error);
    return errorResponse("点赞操作失败", 500);
  }
}
