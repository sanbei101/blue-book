import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { users } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, password } = body;

    if (!userId || !password) {
      return NextResponse.json({ error: "用户ID和密码不能为空" }, { status: 400 });
    }

    // 查找用户
    const user = await db.query.users.findFirst({
      where: eq(users.userId, userId),
    });

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // TODO: 验证密码（需要使用bcrypt等加密库）
    // if (user.password !== hashedPassword) {
    //   return NextResponse.json({ error: "密码错误" }, { status: 401 });
    // }

    // 更新最后登录时间
    await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));

    // TODO: 生成JWT token
    const token = "mock-jwt-token";

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          userId: user.userId,
          nickname: user.nickname,
          avatar: user.avatar,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error("登录失败:", error);
    return NextResponse.json({ error: "登录失败，请稍后重试" }, { status: 500 });
  }
}
