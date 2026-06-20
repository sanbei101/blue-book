import { eq } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import * as z from "zod";

import { errorResponse, successResponse } from "@/app/api/core/common";
import { db } from "@/db";
import { users } from "@/db/schema";

const loginSchema = createSelectSchema(users, {
  userId: z.string().min(1, "用户ID不能为空"),
  password: z.string().min(1, "密码不能为空"),
}).pick({
  userId: true,
  password: true,
});

export type LoginRequest = z.infer<typeof loginSchema>;

const userSelectSchema = createSelectSchema(users).pick({
  id: true,
  userId: true,
  nickname: true,
  avatar: true,
  email: true,
});

export type LoginResponse = {
  token: string;
  user: z.infer<typeof userSelectSchema>;
};

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      const readableError = z.prettifyError(parsed.error);
      return errorResponse(readableError, 424);
    }
    const { userId, password } = parsed.data;

    // 查找用户
    const user = await db.query.users.findFirst({
      where: eq(users.userId, userId),
    });

    if (!user) {
      return errorResponse("用户不存在", 404);
    }

    if (user.password !== password) {
      return errorResponse("密码错误", 401);
    }

    // 更新最后登录时间
    await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));

    // TODO: 生成JWT token
    const token = "mock-jwt-token";

    return successResponse<LoginResponse>({
      token,
      user: {
        id: user.id,
        userId: user.userId,
        nickname: user.nickname,
        avatar: user.avatar,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("登录失败:", error);
    return errorResponse("登录失败，请稍后重试", 500);
  }
}
