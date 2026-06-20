import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { follows, users } from "@/db/schema";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const followingId = parseInt(id);

    if (isNaN(followingId)) {
      return NextResponse.json({ error: "无效的用户ID" }, { status: 400 });
    }

    // TODO: 从JWT token获取当前用户ID
    const followerId = 1; // 临时硬编码

    // 不能关注自己
    if (followerId === followingId) {
      return NextResponse.json({ error: "不能关注自己" }, { status: 400 });
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
        .set({ followCount: users.followCount - 1 })
        .where(eq(users.id, followerId));

      await db
        .update(users)
        .set({ fansCount: users.fansCount - 1 })
        .where(eq(users.id, followingId));

      return NextResponse.json({
        success: true,
        data: { isFollowed: false },
      });
    } else {
      // 添加关注
      await db.insert(follows).values({
        followerId,
        followingId,
      });

      // 增加关注数和粉丝数
      await db
        .update(users)
        .set({ followCount: users.followCount + 1 })
        .where(eq(users.id, followerId));

      await db
        .update(users)
        .set({ fansCount: users.fansCount + 1 })
        .where(eq(users.id, followingId));

      return NextResponse.json({
        success: true,
        data: { isFollowed: true },
      });
    }
  } catch (error) {
    console.error("关注操作失败:", error);
    return NextResponse.json({ error: "关注操作失败" }, { status: 500 });
  }
}
