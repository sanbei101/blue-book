import { eq, or } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import * as z from "zod";

import { db } from "@/db";
import { users } from "@/db/schema";
import { errorResponse, successResponse } from "@/types/core";

export const registerSchema = createInsertSchema(users, {
  userId: z.string().min(3, "用户名必须在3-20个字符之间").max(20),
  password: z.string().min(6, "密码必须在6-100个字符之间").max(100),
  nickname: z.string().min(3, "昵称必须在3-30个字符之间").max(30),
  email: z.email("请输入有效的邮箱地址"),
}).pick({
  userId: true,
  password: true,
  nickname: true,
  email: true,
});

export type RegisterRequest = z.infer<typeof registerSchema>;

const userSelectSchema = createSelectSchema(users).pick({
  id: true,
  userId: true,
  nickname: true,
  avatar: true,
  email: true,
});

export type RegisterResponse = {
  token: string;
  user: z.infer<typeof userSelectSchema>;
};

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const readableError = z.prettifyError(parsed.error);
      return errorResponse(readableError, 424);
    }
    const { userId, email } = parsed.data;

    const existingUser = await db.query.users.findFirst({
      where: or(eq(users.userId, userId), eq(users.email, email)),
    });

    if (existingUser) {
      return errorResponse("用户ID或邮箱已存在", 409);
    }

    const [newUser] = await db.insert(users).values(parsed.data).returning();
    const token = "mock-jwt-token";
    return successResponse<RegisterResponse>({
      token,
      user: {
        id: newUser.id,
        userId: newUser.userId,
        nickname: newUser.nickname,
        avatar: newUser.avatar,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("注册失败:", error);
    return errorResponse("注册失败,请稍后再试", 500);
  }
}
