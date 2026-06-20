import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { users, follows } from "@/db/schema";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return NextResponse.json({ error: "无效的用户ID" }, { status: 400 });
    }

    // 查询用户信息
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // TODO: 从JWT token获取当前用户ID
    const currentUserId = 1; // 临时硬编码

    // 查询是否已关注
    const followRelation = await db.query.follows.findFirst({
      where: and(eq(follows.followerId, currentUserId), eq(follows.followingId, userId)),
    });

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          userId: user.userId,
          nickname: user.nickname,
          avatar: user.avatar,
          bio: user.bio,
          location: user.location,
          gender: user.gender,
          zodiacSign: user.zodiacSign,
          mbti: user.mbti,
          education: user.education,
          major: user.major,
          interests: user.interests,
          verified: user.verified,
          followCount: user.followCount,
          fansCount: user.fansCount,
          likeCount: user.likeCount,
          createdAt: user.createdAt,
          isFollowed: !!followRelation,
        },
      },
    });
  } catch (error) {
    console.error("获取用户信息失败:", error);
    return NextResponse.json({ error: "获取用户信息失败" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = parseInt(id);
    const body = await request.json();

    if (isNaN(userId)) {
      return NextResponse.json({ error: "无效的用户ID" }, { status: 400 });
    }

    // TODO: 验证用户权限（只能修改自己的信息）

    const {
      nickname,
      avatar,
      bio,
      location,
      gender,
      zodiacSign,
      mbti,
      education,
      major,
      interests,
    } = body;

    // 更新用户信息
    const updatedUser = await db
      .update(users)
      .set({
        nickname,
        avatar,
        bio,
        location,
        gender,
        zodiacSign,
        mbti,
        education,
        major,
        interests,
      })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser[0]) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        user: updatedUser[0],
      },
    });
  } catch (error) {
    console.error("更新用户信息失败:", error);
    return NextResponse.json({ error: "更新用户信息失败" }, { status: 500 });
  }
}
