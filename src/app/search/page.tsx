"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

import { PostCard } from "@/components/post/post-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 模拟搜索结果
const mockPosts = [
  {
    id: 1,
    title: "今天天气真好",
    content: "阳光明媚，适合出去走走，拍了一些好看的照片分享给大家！",
    images: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400"],
    author: {
      id: 1,
      nickname: "摄影爱好者",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    },
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
    author: {
      id: 2,
      nickname: "前端小白",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    },
    category: "学习",
    likeCount: 256,
    commentCount: 64,
    collectCount: 128,
    createdAt: "2024-01-14T15:20:00Z",
  },
];

const mockUsers = [
  {
    id: 1,
    nickname: "摄影爱好者",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    bio: "用镜头记录生活的美好瞬间",
    fansCount: 256,
    isFollowed: false,
  },
  {
    id: 2,
    nickname: "前端小白",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    bio: "学习前端开发的新手",
    fansCount: 128,
    isFollowed: false,
  },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  const [searchText, setSearchText] = useState(keyword);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    setSearchText(keyword);
  }, [keyword]);

  const handleSearch = () => {
    if (searchText.trim()) {
      // TODO: 执行搜索
      console.log("搜索:", searchText);
    }
  };

  return (
    <div className="mx-auto max-w-200 px-4 py-6">
      {/* 搜索框 */}
      <div className="relative mb-6">
        <Input
          type="text"
          placeholder="搜索笔记、用户..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="h-12 pr-20"
        />
        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1">
          {searchText && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setSearchText("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 搜索结果标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">
            综合
          </TabsTrigger>
          <TabsTrigger value="posts" className="flex-1">
            笔记
          </TabsTrigger>
          <TabsTrigger value="users" className="flex-1">
            用户
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {/* 热门搜索 */}
          {!keyword && (
            <div className="mb-8">
              <h3 className="mb-4 font-semibold">热门搜索</h3>
              <div className="flex flex-wrap gap-2">
                {["React", "校园", "美食", "旅行", "学习", "摄影"].map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="hover:bg-primary hover:text-primary-foreground cursor-pointer"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 搜索结果 */}
          {keyword && (
            <>
              {/* 笔记结果 */}
              <div className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">笔记</h3>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("posts")}>
                    查看更多
                  </Button>
                </div>
                <div className="columns-2 gap-4">
                  {mockPosts.slice(0, 4).map((post) => (
                    <div key={post.id} className="mb-4 break-inside-avoid">
                      <PostCard post={post} />
                    </div>
                  ))}
                </div>
              </div>

              {/* 用户结果 */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">用户</h3>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("users")}>
                    查看更多
                  </Button>
                </div>
                <div className="space-y-4">
                  {mockUsers.slice(0, 3).map((user) => (
                    <Link
                      key={user.id}
                      href={`/user/${user.id}`}
                      className="hover:bg-muted/50 flex items-center gap-4 rounded-lg p-3 transition-colors"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.nickname.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{user.nickname}</p>
                        <p className="text-muted-foreground truncate text-sm">{user.bio}</p>
                        <p className="text-muted-foreground text-xs">{user.fansCount} 粉丝</p>
                      </div>
                      <Button variant="outline" size="sm">
                        关注
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="posts" className="mt-4">
          <div className="columns-2 gap-4">
            {mockPosts.map((post) => (
              <div key={post.id} className="mb-4 break-inside-avoid">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <div className="space-y-4">
            {mockUsers.map((user) => (
              <Link
                key={user.id}
                href={`/user/${user.id}`}
                className="hover:bg-muted/50 flex items-center gap-4 rounded-lg border p-4 transition-colors"
              >
                <Avatar className="h-14 w-14">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.nickname.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-medium">{user.nickname}</p>
                  <p className="text-muted-foreground text-sm">{user.bio}</p>
                  <p className="text-muted-foreground text-sm">{user.fansCount} 粉丝</p>
                </div>
                <Button variant="outline">关注</Button>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
