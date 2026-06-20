"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PostCardProps {
  post: {
    id: number;
    title: string;
    content: string;
    images: string[];
    author: {
      id: number;
      nickname: string;
      avatar: string;
    };
    category: string;
    likeCount: number;
    commentCount: number;
    collectCount: number;
    createdAt: string;
  };
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="cursor-pointer overflow-hidden transition-shadow hover:shadow-lg">
      {/* 图片区域 */}
      <Link href={`/post/${post.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          {post.images.length > 0 ? (
            <Image
              src={post.images[0]}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="bg-muted flex h-full w-full items-center justify-center">
              <span className="text-muted-foreground">暂无图片</span>
            </div>
          )}

          {/* 多图标识 */}
          {post.images.length > 1 && (
            <div className="absolute top-2 right-2 rounded bg-black/50 px-2 py-1 text-xs text-white">
              {post.images.length}图
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-3">
        {/* 标题 */}
        <Link href={`/post/${post.id}`}>
          <h3 className="hover:text-primary mb-2 line-clamp-2 text-sm font-medium transition-colors">
            {post.title}
          </h3>
        </Link>

        {/* 作者信息 */}
        <div className="flex items-center justify-between">
          <Link href={`/user/${post.author.id}`} className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>{post.author.nickname.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground max-w-[80px] truncate text-xs">
              {post.author.nickname}
            </span>
          </Link>

          {/* 互动数据 */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Heart className="h-3 w-3" />
            </Button>
            <span className="text-muted-foreground text-xs">{post.likeCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
