import { eq, and } from "drizzle-orm";
import { createSelectSchema, createUpdateSchema } from "drizzle-zod";
import * as z from "zod";

import { errorResponse, successResponse } from "@/app/api/core/common";
import { db } from "@/db";
import { users, follows } from "@/db/schema";

const userIdSchema = z.object({
  id: z.coerce.number().int().min(1, "无效的用户ID"),
});

const updateUserSchema = createUpdateSchema(users, {
  nickname: z.string().min(1).optional(),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  gender: z.string().optional(),
  zodiacSign: z.string().optional(),
  mbti: z.string().optional(),
  education: z.string().optional(),
  major: z.string().optional(),
}).pick({
  nickname: true,
  avatar: true,
  bio: true,
  location: true,
  gender: true,
  zodiacSign: true,
  mbti: true,
  education: true,
  major: true,
  interests: true,
});

export type UpdateUserRequest = z.infer<typeof updateUserSchema>;

const userSelectSchema = createSelectSchema(users).pick({
  id: true,
  userId: true,
  nickname: true,
  avatar: true,
  bio: true,
  location: true,
  gender: true,
  zodiacSign: true,
  mbti: true,
  education: true,
  major: true,
  interests: true,
  verified: true,
  followCount: true,
  fansCount: true,
  likeCount: true,
  createdAt: true,
});

export type UserResponse = z.infer<typeof userSelectSchema> & { isFollowed: boolean };

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const parsed = userIdSchema.safeParse({ id });
    if (!parsed.success) {
      const readableError = z.prettifyError(parsed.error);
      return errorResponse(readableError, 424);
    }
    const userId = parsed.data.id;

    // 查询用户信息
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return errorResponse("用户不存在", 404);
    }

    // TODO: 从JWT token获取当前用户ID
    const currentUserId = 1; // 临时硬编码

    // 查询是否已关注
    const followRelation = await db.query.follows.findFirst({
      where: and(eq(follows.followerId, currentUserId), eq(follows.followingId, userId)),
    });

    return successResponse<UserResponse>({
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
    });
  } catch (error) {
    console.error("获取用户信息失败:", error);
    return errorResponse("获取用户信息失败", 500);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const parsedId = userIdSchema.safeParse({ id });
    if (!parsedId.success) {
      const readableError = z.prettifyError(parsedId.error);
      return errorResponse(readableError, 424);
    }
    const userId = parsedId.data.id;

    const body: unknown = await request.json();
    const parsed = updateUserSchema.safeParse(body);
    if (!parsed.success) {
      const readableError = z.prettifyError(parsed.error);
      return errorResponse(readableError, 424);
    }

    // TODO: 验证用户权限（只能修改自己的信息）

    // 更新用户信息
    const [updatedUser] = await db
      .update(users)
      .set(parsed.data)
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      return errorResponse("用户不存在", 404);
    }

    return successResponse({ user: updatedUser });
  } catch (error) {
    console.error("更新用户信息失败:", error);
    return errorResponse("更新用户信息失败", 500);
  }
}
