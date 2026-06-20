"use client";

import { Heart, MessageCircle, Bookmark, Share2, ArrowLeft, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// 模拟数据
const mockPost = {
  id: 1,
  title: "今天天气真好",
  content:
    "阳光明媚，适合出去走走，拍了一些好看的照片分享给大家！\n\n今天和朋友一起去了公园，看到了很多美丽的花朵，心情特别好。春天真的是一个让人充满活力的季节，希望大家也能多多出去走走，享受大自然的美好。",
  images: [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800",
  ],
  author: {
    id: 1,
    nickname: "摄影爱好者",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    bio: "用镜头记录生活的美好瞬间",
    isFollowed: false,
  },
  category: "生活",
  tags: ["摄影", "风景", "春天"],
  likeCount: 128,
  commentCount: 32,
  collectCount: 45,
  isLiked: false,
  isCollected: false,
  createdAt: "2024-01-15T10:30:00Z",
};

const mockComments = [
  {
    id: 1,
    content: "拍得真好看！请问这是哪里？",
    author: {
      id: 2,
      nickname: "旅行达人",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    },
    likeCount: 12,
    isLiked: false,
    createdAt: "2024-01-15T11:00:00Z",
    replies: [
      {
        id: 11,
        content: "这是市中心的公园，春天去特别美！",
        author: {
          id: 1,
          nickname: "摄影爱好者",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
        },
        likeCount: 5,
        isLiked: false,
        createdAt: "2024-01-15T11:30:00Z",
      },
    ],
  },
  {
    id: 2,
    content: "春天的气息扑面而来，好想去踏青啊！",
    author: {
      id: 3,
      nickname: "自然爱好者",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    },
    likeCount: 8,
    isLiked: false,
    createdAt: "2024-01-15T12:00:00Z",
    replies: [],
  },
  {
    id: 3,
    content: "请问用的什么相机拍的？",
    author: {
      id: 4,
      nickname: "摄影新手",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
    },
    likeCount: 3,
    isLiked: false,
    createdAt: "2024-01-15T13:00:00Z",
    replies: [],
  },
];

export default function PostDetailPage() {
  const [post] = useState(mockPost);
  const [comments] = useState(mockComments);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isCollected, setIsCollected] = useState(post.isCollected);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [collectCount, setCollectCount] = useState(post.collectCount);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleCollect = () => {
    setIsCollected(!isCollected);
    setCollectCount(isCollected ? collectCount - 1 : collectCount + 1);
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    // TODO: 发送评论
    setCommentText("");
  };

  return (
    <div className="mx-auto max-w-250">
      {/* 顶部导航 */}
      <div className="bg-background sticky top-18 z-30 flex items-center gap-4 border-b px-4 py-3">
        <Link href="/explore">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="flex-1 text-lg font-semibold">笔记详情</h1>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* 左侧图片区域 */}
        <div className="relative bg-black lg:min-h-150 lg:w-125">
          {post.images.length > 0 && (
            <div className="relative aspect-square w-full lg:aspect-auto lg:h-full">
              <Image
                src={post.images[currentImageIndex]}
                alt={post.title}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 500px"
              />
            </div>
          )}

          {/* 图片指示器 */}
          {post.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
              {post.images.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === currentImageIndex ? "bg-white" : "bg-white/50",
                  )}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* 右侧内容区域 */}
        <div className="flex flex-1 flex-col">
          {/* 作者信息 */}
          <div className="flex items-center justify-between p-4">
            <Link href={`/user/${post.author.id}`} className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback>{post.author.nickname.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{post.author.nickname}</p>
                <p className="text-muted-foreground text-xs">
                  {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                </p>
              </div>
            </Link>
            <Button variant="default" size="sm">
              关注
            </Button>
          </div>

          <Separator />

          {/* 笔记内容 */}
          <div className="flex-1 overflow-auto p-4">
            <h2 className="mb-3 text-xl font-bold">{post.title}</h2>
            <p className="mb-4 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>

            {/* 标签 */}
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>

            <Separator className="my-4" />

            {/* 评论区 */}
            <div>
              <h3 className="mb-4 font-semibold">评论 ({post.commentCount})</h3>

              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="space-y-3">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.author.avatar} />
                        <AvatarFallback>{comment.author.nickname.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{comment.author.nickname}</p>
                        <p className="mt-1 text-sm">{comment.content}</p>
                        <div className="mt-2 flex items-center gap-4">
                          <span className="text-muted-foreground text-xs">
                            {new Date(comment.createdAt).toLocaleDateString("zh-CN")}
                          </span>
                          <button className="text-muted-foreground hover:text-foreground text-xs">
                            回复
                          </button>
                          <button className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs">
                            <Heart className="h-3 w-3" />
                            {comment.likeCount}
                          </button>
                        </div>

                        {/* 回复 */}
                        {comment.replies.length > 0 && (
                          <div className="mt-3 ml-4 space-y-3">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex gap-3">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={reply.author.avatar} />
                                  <AvatarFallback>{reply.author.nickname.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{reply.author.nickname}</p>
                                  <p className="mt-1 text-sm">{reply.content}</p>
                                  <div className="mt-2 flex items-center gap-4">
                                    <span className="text-muted-foreground text-xs">
                                      {new Date(reply.createdAt).toLocaleDateString("zh-CN")}
                                    </span>
                                    <button className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs">
                                      <Heart className="h-3 w-3" />
                                      {reply.likeCount}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* 底部操作栏 */}
          <div className="p-4">
            {/* 互动按钮 */}
            <div className="mb-3 flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className={cn("gap-2", isLiked && "text-red-500")}
                onClick={handleLike}
              >
                <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
                <span>{likeCount}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageCircle className="h-5 w-5" />
                <span>{post.commentCount}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn("gap-2", isCollected && "text-yellow-500")}
                onClick={handleCollect}
              >
                <Bookmark className={cn("h-5 w-5", isCollected && "fill-current")} />
                <span>{collectCount}</span>
              </Button>
              <Button variant="ghost" size="sm" className="ml-auto gap-2">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* 评论输入框 */}
            <div className="flex gap-2">
              <Textarea
                placeholder="写下你的评论..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="max-h-25 min-h-10 resize-none"
                rows={1}
              />
              <Button
                size="sm"
                className="self-end"
                disabled={!commentText.trim()}
                onClick={handleComment}
              >
                发送
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
