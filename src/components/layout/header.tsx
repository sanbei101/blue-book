"use client";

import { Search, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSearch = () => {
    if (searchText.trim()) {
      router.push(`/search?keyword=${encodeURIComponent(searchText.trim())}`);
      setShowMobileSearch(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="bg-background fixed top-0 right-0 left-0 z-50 h-18 border-b">
      <div className="mx-auto flex h-full max-w-375 items-center justify-between px-6">
        {/* 桌面端Logo */}
        <div className="hidden lg:block">
          <Link href="/" className="flex items-center">
            <div className="bg-primary flex h-8 w-17 items-center justify-center rounded-full">
              <span className="text-primary-foreground text-sm font-bold">小蓝书</span>
            </div>
          </Link>
        </div>

        {/* 桌面端搜索栏 */}
        <div className="mx-auto hidden max-w-125 flex-1 lg:flex">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="搜索小蓝书"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-secondary h-10 w-full rounded-full border-0 pr-20 pl-4"
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
        </div>

        {/* 移动端头部 */}
        <div className="flex w-full items-center justify-between lg:hidden">
          {!showMobileSearch ? (
            <>
              <Link href="/" className="flex items-center">
                <div className="bg-primary flex h-8 w-17 items-center justify-center rounded-full">
                  <span className="text-primary-foreground text-sm font-bold">小蓝书</span>
                </div>
              </Link>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={() => setShowMobileSearch(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex w-full items-center gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="搜索小蓝书"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  autoFocus
                  className="bg-secondary h-10 w-full rounded-full border-0 pr-10 pl-4"
                />
                {searchText && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2"
                    onClick={() => setSearchText("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Button
                variant="ghost"
                className="h-10 rounded-full px-4"
                onClick={() => {
                  setShowMobileSearch(false);
                  setSearchText("");
                }}
              >
                取消
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
