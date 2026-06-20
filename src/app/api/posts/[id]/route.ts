import { eq } from "drizzle-orm";
import { createUpdateSchema } from "drizzle-zod";
import * as z from "zod";

import { errorResponse, successResponse } from "@/app/api/core/common";
import { db } from "@/db";
import { posts, users, postImages, postVideos, categories, postTags, tags } from "@/db/schema";

const postIdSchema = z.object({
  id: z.coerce.number().int().min(1, "无效的笔记ID"),
});

const updatePostSchema = createUpdateSchema(posts, {
  title: z.string().min(1, "标题不能为空").optional(),
  content: z.string().optional(),
  categoryId: z.number().int().optional(),
  status: z.number().int().optional(),
}).pick({
  title: true,
  content: true,
  categoryId: true,
  status: true,
});

export type UpdatePostRequest = z.infer<typeof updatePostSchema>;

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const parsed = postIdSchema.safeParse({ id });
    if (!parsed.success) {
      const readableError = z.prettifyError(parsed.error);
      return errorResponse(readableError, 424);
    }
    const postId = parsed.data.id;

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
      return errorResponse("笔记不存在", 404);
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

    return successResponse({
      post: {
        ...post[0],
        viewCount: post[0].viewCount + 1,
        images: images.map((img) => img.imageUrl),
        videos: videos,
        tags: postTagsList,
      },
    });
  } catch (error) {
    console.error("获取笔记详情失败:", error);
    return errorResponse("获取笔记详情失败", 500);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const parsedId = postIdSchema.safeParse({ id });
    if (!parsedId.success) {
      const readableError = z.prettifyError(parsedId.error);
      return errorResponse(readableError, 424);
    }
    const postId = parsedId.data.id;

    const body: unknown = await request.json();
    const parsed = updatePostSchema.safeParse(body);
    if (!parsed.success) {
      const readableError = z.prettifyError(parsed.error);
      return errorResponse(readableError, 424);
    }

    // TODO: 验证用户权限

    // 更新笔记
    const [updatedPost] = await db
      .update(posts)
      .set(parsed.data)
      .where(eq(posts.id, postId))
      .returning();

    if (!updatedPost) {
      return errorResponse("笔记不存在", 404);
    }

    return successResponse({ post: updatedPost });
  } catch (error) {
    console.error("更新笔记失败:", error);
    return errorResponse("更新笔记失败", 500);
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const parsed = postIdSchema.safeParse({ id });
    if (!parsed.success) {
      const readableError = z.prettifyError(parsed.error);
      return errorResponse(readableError, 424);
    }
    const postId = parsed.data.id;

    // TODO: 验证用户权限

    // 删除笔记（级联删除会自动删除关联的图片、视频、标签等）
    await db.delete(posts).where(eq(posts.id, postId));

    return successResponse({ message: "笔记已删除" });
  } catch (error) {
    console.error("删除笔记失败:", error);
    return errorResponse("删除笔记失败", 500);
  }
}
