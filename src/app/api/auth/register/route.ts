import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { users } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, password, nickname, email } = body;

    if (!userId || !password || !nickname) {
      return NextResponse.json({ error: "用户ID、密码和昵称不能为空" }, { status: 400 });
    }

    // 检查用户ID是否已存在
    const existingUser = await db.query.users.findFirst({
      where: eq(users.userId, userId),
    });

    if (existingUser) {
      return NextResponse.json({ error: "用户ID已存在" }, { status: 409 });
    }

    // TODO: 加密密码
    // const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const newUser = await db
      .insert(users)
      .values({
        userId,
        password, // TODO: 使用hashedPassword
        nickname,
        email,
      })
      .returning();

    // TODO: 生成JWT token
    const token = "mock-jwt-token";

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: newUser[0].id,
          userId: newUser[0].userId,
          nickname: newUser[0].nickname,
          avatar: newUser[0].avatar,
          email: newUser[0].email,
        },
      },
    });
  } catch (error) {
    console.error("注册失败:", error);
    return NextResponse.json({ error: "注册失败，请稍后重试" }, { status: 500 });
  }
}
