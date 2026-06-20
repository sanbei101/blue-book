"use client";

import { ImagePlus, Video, X, ArrowLeft, Hash, Smile, AtSign, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const categories = [
  { id: "study", name: "学习" },
  { id: "campus", name: "校园" },
  { id: "emotion", name: "情感" },
  { id: "interest", name: "兴趣" },
  { id: "life", name: "生活" },
  { id: "social", name: "社交" },
];

export default function PublishPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [images] = useState<string[]>([]);
  const [postType, setPostType] = useState<"image" | "video">("image");

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handlePublish = () => {
    // TODO: 发布笔记
    console.log({ title, content, category, tags, images, postType });
  };

  return (
    <div className="mx-auto max-w-[800px]">
      {/* 顶部导航 */}
      <div className="bg-background sticky top-[72px] z-30 flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/explore">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">发布笔记</h1>
        </div>
        <Button onClick={handlePublish} disabled={!title.trim()}>
          发布
        </Button>
      </div>

      <div className="space-y-6 p-6">
        {/* 笔记类型选择 */}
        <div className="flex gap-3">
          <Button
            variant={postType === "image" ? "default" : "outline"}
            onClick={() => setPostType("image")}
          >
            <ImagePlus className="mr-2 h-4 w-4" />
            图文笔记
          </Button>
          <Button
            variant={postType === "video" ? "default" : "outline"}
            onClick={() => setPostType("video")}
          >
            <Video className="mr-2 h-4 w-4" />
            视频笔记
          </Button>
        </div>

        {/* 图片/视频上传 */}
        <div className="rounded-lg border-2 border-dashed p-8">
          {postType === "image" ? (
            <div className="text-center">
              <ImagePlus className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground mb-2">拖拽图片到此处或点击上传</p>
              <p className="text-muted-foreground text-xs">
                支持 jpg、png 格式，最多上传 9 张图片，单张不超过 10MB
              </p>
              <Button variant="outline" className="mt-4">
                选择图片
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <Video className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground mb-2">拖拽视频到此处或点击上传</p>
              <p className="text-muted-foreground text-xs">
                支持 mp4 格式，最长 15 分钟，不超过 100MB
              </p>
              <Button variant="outline" className="mt-4">
                选择视频
              </Button>
            </div>
          )}
        </div>

        {/* 标题 */}
        <div>
          <Input
            placeholder="填写标题会有更多赞哦~"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-none border-0 border-b px-0 text-lg font-medium focus-visible:ring-0"
          />
        </div>

        {/* 内容 */}
        <div>
          <Textarea
            placeholder="添加正文内容..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px] resize-none border-0 px-0 focus-visible:ring-0"
          />
        </div>

        {/* 工具栏 */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Smile className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Hash className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <AtSign className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MapPin className="h-5 w-5" />
          </Button>
        </div>

        <Separator />

        {/* 分类选择 */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">选择分类</span>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 标签 */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium">添加标签</span>
            <span className="text-muted-foreground text-xs">{tags.length}/10</span>
          </div>

          {/* 已添加的标签 */}
          {tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-destructive ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* 标签输入 */}
          <div className="flex gap-2">
            <Input
              placeholder="输入标签名称"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={tags.length >= 10}
            />
            <Button
              variant="outline"
              onClick={handleAddTag}
              disabled={!tagInput.trim() || tags.length >= 10}
            >
              添加
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
