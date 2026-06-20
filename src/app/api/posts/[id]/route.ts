import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { posts, users, postImages, postVideos, categories, postTags, tags } from "@/db/schema";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return NextResponse.json({ error: "无效的笔记ID" }, { status: 400 });
    }

    // 查询笔记详情
    const post = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        type: posts.type,
        status: posts.status,
        viewCount: posts.viewCount,
        likeCount: posts.likeCount,
        collectCount: posts.collectCount,
        commentCount: posts.commentCount,
        createdAt: posts.createdAt,
        author: {
          id: users.id,
          nickname: users.nickname,
          avatar: users.avatar,
          bio: users.bio,
        },
        category: {
          id: categories.id,
          name: categories.name,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(eq(posts.id, postId))
      .limit(1);

    if (!post[0]) {
      return NextResponse.json({ error: "笔记不存在" }, { status: 404 });
    }

    // 查询图片
    const images = await db
      .select({ imageUrl: postImages.imageUrl })
      .from(postImages)
      .where(eq(postImages.postId, postId));

    // 查询视频
    const videos = await db
      .select({
        coverUrl: postVideos.coverUrl,
        videoUrl: postVideos.videoUrl,
      })
      .from(postVideos)
      .where(eq(postVideos.postId, postId));

    // 查询标签
    const postTagsList = await db
      .select({
        id: tags.id,
        name: tags.name,
      })
      .from(postTags)
      .leftJoin(tags, eq(postTags.tagId, tags.id))
      .where(eq(postTags.postId, postId));

    // 增加浏览量
    await db
      .update(posts)
      .set({ viewCount: post[0].viewCount + 1 })
      .where(eq(posts.id, postId));

    return NextResponse.json({
      success: true,
      data: {
        post: {
          ...post[0],
          viewCount: post[0].viewCount + 1,
          images: images.map((img) => img.imageUrl),
          videos: videos,
          tags: postTagsList,
        },
      },
    });
  } catch (error) {
    console.error("获取笔记详情失败:", error);
    return NextResponse.json({ error: "获取笔记详情失败" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const postId = parseInt(id);
    const body = await request.json();
    const { title, content, categoryId, status } = body;

    if (isNaN(postId)) {
      return NextResponse.json({ error: "无效的笔记ID" }, { status: 400 });
    }

    // TODO: 验证用户权限

    // 更新笔记
    const updatedPost = await db
      .update(posts)
      .set({
        title,
        content,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        status,
      })
      .where(eq(posts.id, postId))
      .returning();

    if (!updatedPost[0]) {
      return NextResponse.json({ error: "笔记不存在" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        post: updatedPost[0],
      },
    });
  } catch (error) {
    console.error("更新笔记失败:", error);
    return NextResponse.json({ error: "更新笔记失败" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return NextResponse.json({ error: "无效的笔记ID" }, { status: 400 });
    }

    // TODO: 验证用户权限

    // 删除笔记（级联删除会自动删除关联的图片、视频、标签等）
    await db.delete(posts).where(eq(posts.id, postId));

    return NextResponse.json({
      success: true,
      message: "笔记已删除",
    });
  } catch (error) {
    console.error("删除笔记失败:", error);
    return NextResponse.json({ error: "删除笔记失败" }, { status: 500 });
  }
}
