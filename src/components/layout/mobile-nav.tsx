"use client";

import { Home, Bell, User, PlusCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navItems = [
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

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="bg-background flex h-12 items-center justify-around">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 py-1 px-3",
              isActive ? "text-primary" : "text-muted-foreground",
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px]">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
