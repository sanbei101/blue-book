"use client";

import { Heart, MessageCircle, UserPlus, Bookmark, Bell } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// 模拟通知数据
const mockNotifications = [
  {
    id: 1,
    type: "like_post",
    message: "赞了你的笔记",
    targetTitle: "今天天气真好",
    sender: {
      id: 2,
      nickname: "旅行达人",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    },
    isRead: false,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    type: "comment",
    message: "评论了你的笔记",
    targetTitle: "今天天气真好",
    content: "拍得真好看！请问这是哪里？",
    sender: {
      id: 3,
      nickname: "自然爱好者",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    },
    isRead: false,
    createdAt: "2024-01-15T09:20:00Z",
  },
  {
    id: 3,
    type: "follow",
    message: "关注了你",
    sender: {
      id: 4,
      nickname: "摄影新手",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
    },
    isRead: true,
    createdAt: "2024-01-14T15:00:00Z",
  },
  {
    id: 4,
    type: "collect",
    message: "收藏了你的笔记",
    targetTitle: "学习笔记分享",
    sender: {
      id: 5,
      nickname: "代码高手",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
    },
    isRead: true,
    createdAt: "2024-01-14T12:00:00Z",
  },
  {
    id: 5,
    type: "like_comment",
    message: "赞了你的评论",
    targetTitle: "校园美食推荐",
    sender: {
      id: 6,
      nickname: "美食家",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=6",
    },
    isRead: true,
    createdAt: "2024-01-13T18:00:00Z",
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "like_post":
    case "like_comment":
      return <Heart className="h-4 w-4 text-red-500" />;
    case "comment":
      return <MessageCircle className="h-4 w-4 text-blue-500" />;
    case "follow":
      return <UserPlus className="h-4 w-4 text-green-500" />;
    case "collect":
      return <Bookmark className="h-4 w-4 text-yellow-500" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

export default function NotificationPage() {
  const [notifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications =
    activeTab === "all" ? notifications : notifications.filter((n) => !n.isRead);

  return (
    <div className="mx-auto max-w-[600px]">
      <div className="p-6">
        <h1 className="mb-6 text-xl font-bold">通知</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">
              全部
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex-1">
              未读
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 px-1.5">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <div className="space-y-0">
              {filteredNotifications.map((notification) => (
                <div key={notification.id}>
                  <Link
                    href={
                      notification.type === "follow" ? `/user/${notification.sender.id}` : `/post/1`
                    }
                    className={cn(
                      "flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors",
                      !notification.isRead && "bg-primary/5",
                    )}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={notification.sender.avatar} />
                        <AvatarFallback>{notification.sender.nickname.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="bg-background absolute -right-1 -bottom-1 rounded-full p-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{notification.sender.nickname}</span>{" "}
                        <span className="text-muted-foreground">{notification.message}</span>
                      </p>
                      {notification.targetTitle && (
                        <p className="text-muted-foreground mt-1 truncate text-sm">
                          {notification.targetTitle}
                        </p>
                      )}
                      {notification.content && (
                        <p className="text-muted-foreground mt-1 text-sm">{notification.content}</p>
                      )}
                      <p className="text-muted-foreground mt-2 text-xs">
                        {new Date(notification.createdAt).toLocaleDateString("zh-CN")}
                      </p>
                    </div>

                    {!notification.isRead && (
                      <div className="bg-primary mt-2 h-2 w-2 rounded-full" />
                    )}
                  </Link>
                  <Separator />
                </div>
              ))}

              {filteredNotifications.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Bell className="text-muted-foreground mb-4 h-12 w-12" />
                  <p className="text-muted-foreground">暂无通知</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
