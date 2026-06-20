"use client";

import { Home, Bell, User, PlusCircle, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    label: "发现",
    icon: Home,
    href: "/explore",
  },
  {
    label: "发布",
    icon: PlusCircle,
    href: "/publish",
  },
  {
    label: "通知",
    icon: Bell,
    href: "/notification",
  },
  {
    label: "我",
    icon: User,
    href: "/user",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-background flex h-full flex-col p-3">
      {/* Logo */}
      <div className="mb-6 px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary flex h-8 w-[68px] items-center justify-center rounded-full">
            <span className="text-primary-foreground text-sm font-bold">小蓝书</span>
          </div>
        </Link>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-full text-base font-bold transition-colors",
                isActive
                  ? "bg-secondary text-secondary-foreground"
                  : "text-foreground hover:bg-secondary/50",
              )}
            >
              <item.icon className="h-6 w-6" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 底部更多菜单 */}
      <div className="mt-auto mb-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-4 rounded-full px-4 py-3 text-base font-bold"
        >
          <MoreHorizontal className="h-6 w-6" />
          <span>更多</span>
        </Button>
      </div>
    </div>
  );
}
