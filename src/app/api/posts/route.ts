import { eq, desc, and, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { posts, users, postImages, categories } from "@/db/schema";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const categoryId = searchParams.get("categoryId");
    const userId = searchParams.get("userId");

    const offset = (page - 1) * limit;

    // 构建查询条件
    const conditions = [eq(posts.status, 0)]; // 只查询已发布的笔记

    if (categoryId) {
      conditions.push(eq(posts.categoryId, parseInt(categoryId)));
    }

    if (userId) {
      conditions.push(eq(posts.userId, parseInt(userId)));
    }

    // 查询笔记列表
    const postsList = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        type: posts.type,
        viewCount: posts.viewCount,
        likeCount: posts.likeCount,
        collectCount: posts.collectCount,
        commentCount: posts.commentCount,
        createdAt: posts.createdAt,
        author: {
          id: users.id,
          nickname: users.nickname,
          avatar: users.avatar,
        },
        category: {
          id: categories.id,
          name: categories.name,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(and(...conditions))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    // 查询每个笔记的第一张图片
    const postsWithImages = await Promise.all(
      postsList.map(async (post) => {
        const images = await db
          .select({ imageUrl: postImages.imageUrl })
          .from(postImages)
          .where(eq(postImages.postId, post.id))
          .limit(9);

        return Object.assign({}, post, { images: images.map((img) => img.imageUrl) });
      }),
    );

    // 查询总数
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(posts)
      .where(and(...conditions));

    const total = countResult[0]?.count || 0;

    return NextResponse.json({
      success: true,
      data: {
        posts: postsWithImages,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("获取笔记列表失败:", error);
    return NextResponse.json({ error: "获取笔记列表失败" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, categoryId, type, images } = body;

    // TODO: 从JWT token获取用户ID
    const userId = 1; // 临时硬编码

    if (!title) {
      return NextResponse.json({ error: "标题不能为空" }, { status: 400 });
    }

    // 创建笔记
    const newPost = await db
      .insert(posts)
      .values({
        userId,
        title,
        content,
        categoryId: categoryId ? parseInt(categoryId) : null,
        type: type || 1,
        status: 0, // 直接发布
      })
      .returning();

    // 保存图片
    if (images && images.length > 0) {
      await db.insert(postImages).values(
        images.map((imageUrl: string) => ({
          postId: newPost[0].id,
          imageUrl,
        })),
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        post: newPost[0],
      },
    });
  } catch (error) {
    console.error("创建笔记失败:", error);
    return NextResponse.json({ error: "创建笔记失败" }, { status: 500 });
  }
}
