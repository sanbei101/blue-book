"use client";

import { Settings, Grid3X3, Bookmark, Heart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { PostCard } from "@/components/post/post-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 模拟用户数据
const mockUser = {
  id: 1,
  nickname: "摄影爱好者",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
  bio: "用镜头记录生活的美好瞬间 | 热爱旅行和摄影",
  location: "北京",
  gender: "男",
  zodiacSign: "天秤座",
  mbti: "INFP",
  followCount: 128,
  fansCount: 256,
  likeCount: 1024,
  isFollowed: false,
  verified: true,
};

const mockPosts = [
  {
    id: 1,
    title: "今天天气真好",
    content: "阳光明媚，适合出去走走，拍了一些好看的照片分享给大家！",
    images: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400"],
    author: mockUser,
    category: "生活",
    likeCount: 128,
    commentCount: 32,
    collectCount: 45,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    title: "学习笔记分享",
    content: "最近在学习React，整理了一些笔记，希望对大家有帮助！",
    images: ["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400"],
    author: mockUser,
    category: "学习",
    likeCount: 256,
    commentCount: 64,
    collectCount: 128,
    createdAt: "2024-01-14T15:20:00Z",
  },
  {
    id: 3,
    title: "校园美食推荐",
    content: "学校食堂新开了一家奶茶店，味道还不错，推荐大家试试！",
    images: ["https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400"],
    author: mockUser,
    category: "校园",
    likeCount: 89,
    commentCount: 23,
    collectCount: 34,
    createdAt: "2024-01-13T09:15:00Z",
  },
];

export default function UserPage() {
  const [user] = useState(mockUser);
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="mx-auto max-w-[800px]">
      {/* 用户信息卡片 */}
      <div className="p-6">
        <div className="flex items-start gap-6">
          {/* 头像 */}
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.nickname.charAt(0)}</AvatarFallback>
          </Avatar>

          {/* 用户信息 */}
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <h1 className="text-xl font-bold">{user.nickname}</h1>
              {user.verified && (
                <Badge variant="default" className="h-5 px-1.5">
                  ✓
                </Badge>
              )}
            </div>

            {/* 个人标签 */}
            <div className="mb-3 flex flex-wrap gap-2">
              {user.gender && <Badge variant="secondary">{user.gender}</Badge>}
              {user.zodiacSign && <Badge variant="secondary">{user.zodiacSign}</Badge>}
              {user.mbti && <Badge variant="secondary">{user.mbti}</Badge>}
              {user.location && <Badge variant="secondary">📍 {user.location}</Badge>}
            </div>

            {/* 简介 */}
            {user.bio && <p className="text-muted-foreground mb-4 text-sm">{user.bio}</p>}

            {/* 统计数据 */}
            <div className="flex items-center gap-6">
              <Link href="/follow/following" className="text-center hover:opacity-80">
                <p className="font-bold">{user.followCount}</p>
                <p className="text-muted-foreground text-xs">关注</p>
              </Link>
              <Link href="/follow/fans" className="text-center hover:opacity-80">
                <p className="font-bold">{user.fansCount}</p>
                <p className="text-muted-foreground text-xs">粉丝</p>
              </Link>
              <div className="text-center">
                <p className="font-bold">{user.likeCount}</p>
                <p className="text-muted-foreground text-xs">获赞</p>
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-6 flex gap-3">
          <Button className="flex-1">编辑资料</Button>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 内容标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="h-auto w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="posts"
            className="data-[state=active]:border-primary rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:bg-transparent"
          >
            <Grid3X3 className="mr-2 h-4 w-4" />
            笔记
          </TabsTrigger>
          <TabsTrigger
            value="collected"
            className="data-[state=active]:border-primary rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:bg-transparent"
          >
            <Bookmark className="mr-2 h-4 w-4" />
            收藏
          </TabsTrigger>
          <TabsTrigger
            value="liked"
            className="data-[state=active]:border-primary rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:bg-transparent"
          >
            <Heart className="mr-2 h-4 w-4" />
            赞过
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-0">
          <div className="columns-2 gap-4 p-4 md:columns-3">
            {mockPosts.map((post) => (
              <div key={post.id} className="mb-4 break-inside-avoid">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="collected" className="mt-0">
          <div className="flex flex-col items-center justify-center py-12">
            <Bookmark className="text-muted-foreground mb-4 h-12 w-12" />
            <p className="text-muted-foreground">暂无收藏内容</p>
          </div>
        </TabsContent>

        <TabsContent value="liked" className="mt-0">
          <div className="flex flex-col items-center justify-center py-12">
            <Heart className="text-muted-foreground mb-4 h-12 w-12" />
            <p className="text-muted-foreground">暂无点赞内容</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
