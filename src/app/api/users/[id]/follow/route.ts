import { eq, and, sql } from "drizzle-orm";
import * as z from "zod";

import { errorResponse, successResponse } from "@/app/api/core/common";
import { db } from "@/db";
import { follows, users } from "@/db/schema";

const userIdSchema = z.object({
  id: z.coerce.number().int().min(1, "无效的用户ID"),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const parsed = userIdSchema.safeParse({ id });
    if (!parsed.success) {
      const readableError = z.prettifyError(parsed.error);
      return errorResponse(readableError, 424);
    }
    const followingId = parsed.data.id;

    // TODO: 从JWT token获取当前用户ID
    const followerId = 1; // 临时硬编码

    // 不能关注自己
    if (followerId === followingId) {
      return errorResponse("不能关注自己", 400);
    }

    // 检查是否已关注
    const existingFollow = await db.query.follows.findFirst({
      where: and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)),
    });

    if (existingFollow) {
      // 取消关注
      await db
        .delete(follows)
        .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)));

      // 减少关注数和粉丝数
      await db
        .update(users)
        .set({ followCount: sql`${users.followCount} - 1` })
        .where(eq(users.id, followerId));

      await db
        .update(users)
        .set({ fansCount: sql`${users.fansCount} - 1` })
        .where(eq(users.id, followingId));

      return successResponse({ isFollowed: false });
    } else {
      // 添加关注
      await db.insert(follows).values({
        followerId,
        followingId,
      });

      // 增加关注数和粉丝数
      await db
        .update(users)
        .set({ followCount: sql`${users.followCount} + 1` })
        .where(eq(users.id, followerId));

      await db
        .update(users)
        .set({ fansCount: sql`${users.fansCount} + 1` })
        .where(eq(users.id, followingId));

      return successResponse({ isFollowed: true });
    }
  } catch (error) {
    console.error("关注操作失败:", error);
    return errorResponse("关注操作失败", 500);
  }
}
