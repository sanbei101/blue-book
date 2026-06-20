import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "小蓝书 - 校园图文社区",
  description: "一个校园图文社区平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className={`${inter.className} bg-background min-h-screen`}>
        <div className="flex min-h-screen">
          {/* 侧边栏 - 桌面端显示 */}
          <aside className="fixed top-0 left-0 z-40 hidden h-screen w-[228px] border-r lg:block">
            <Sidebar />
          </aside>

          {/* 主内容区 */}
          <main className="flex-1 lg:ml-[228px]">
            {/* 头部 */}
            <Header />

            {/* 页面内容 */}
            <div className="pt-[72px] pb-[48px] lg:pb-0">{children}</div>
          </main>

          {/* 移动端底部导航 */}
          <nav className="bg-background fixed right-0 bottom-0 left-0 z-50 border-t lg:hidden">
            <MobileNav />
          </nav>
        </div>
      </body>
    </html>
  );
}
