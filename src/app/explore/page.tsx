"use client";

import { useState, useEffect } from "react";

import { CategoryTabs } from "@/components/category/category-tabs";
import { PostCard } from "@/components/post/post-card";
import { Skeleton } from "@/components/ui/skeleton";

// 模拟数据
const mockPosts = [
  {
    id: 1,
    title: "今天天气真好",
    content: "阳光明媚，适合出去走走，拍了一些好看的照片分享给大家！",
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
    ],
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
  {
    id: 3,
    title: "校园美食推荐",
    content: "学校食堂新开了一家奶茶店，味道还不错，推荐大家试试！",
    images: [
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400",
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400",
      "https://images.unsplash.com/photo-1551024710-866e25e3a1fa?w=400",
    ],
    author: {
      id: 3,
      nickname: "美食家",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    },
    category: "校园",
    likeCount: 89,
    commentCount: 23,
    collectCount: 34,
    createdAt: "2024-01-13T09:15:00Z",
  },
  {
    id: 4,
    title: "周末出游记",
    content: "周末和朋友去了郊外爬山，风景很美，空气清新，推荐大家去放松一下！",
    images: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400"],
    author: {
      id: 4,
      nickname: "旅行达人",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
    },
    category: "生活",
    likeCount: 167,
    commentCount: 45,
    collectCount: 78,
    createdAt: "2024-01-12T14:45:00Z",
  },
  {
    id: 5,
    title: "编程技巧分享",
    content: "分享几个实用的JavaScript技巧，让你的代码更简洁高效！",
    images: ["https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400"],
    author: {
      id: 5,
      nickname: "代码高手",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
    },
    category: "学习",
    likeCount: 312,
    commentCount: 87,
    collectCount: 156,
    createdAt: "2024-01-11T11:30:00Z",
  },
  {
    id: 6,
    title: "校园活动回顾",
    content: "昨天参加了学校的社团活动，认识了很多有趣的朋友，收获满满！",
    images: [
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400",
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=400",
    ],
    author: {
      id: 6,
      nickname: "活动达人",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=6",
    },
    category: "校园",
    likeCount: 95,
    commentCount: 28,
    collectCount: 42,
    createdAt: "2024-01-10T16:20:00Z",
  },
];

const categories = [
  { id: 0, name: "推荐", categoryTitle: "recommend" },
  { id: 1, name: "学习", categoryTitle: "study" },
  { id: 2, name: "校园", categoryTitle: "campus" },
  { id: 3, name: "情感", categoryTitle: "emotion" },
  { id: 4, name: "兴趣", categoryTitle: "interest" },
  { id: 5, name: "生活", categoryTitle: "life" },
  { id: 6, name: "社交", categoryTitle: "social" },
];

export default function ExplorePage() {
  const [posts] = useState(mockPosts);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

  // 模拟加载数据
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6">
      {/* 分类标签 */}
      <div className="mb-6">
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>

      {/* 瀑布流布局 */}
      {loading ? (
        <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="mb-4 break-inside-avoid">
              <Skeleton className="mb-2 h-[200px] w-full rounded-lg" />
              <Skeleton className="mb-2 h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
          {posts.map((post) => (
            <div key={post.id} className="mb-4 break-inside-avoid">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
