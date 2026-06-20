# 小蓝书 - 校园图文社区

一个基于 Next.js + Drizzle ORM + Neon 的校园图文社区平台。

## 技术栈

- **前端**: Next.js 16 + Tailwind CSS + shadcn/ui + Lucide Icons
- **后端**: Next.js API Routes + Drizzle ORM + Neon (PostgreSQL)
- **代码质量**: oxlint + oxfmt

## 功能特性

### 核心功能

- 📝 笔记发布（支持图文和视频）
- 🖼️ 图片瀑布流展示
- ❤️ 点赞、收藏、评论
- 👤 用户主页和个人资料
- 🔔 通知系统
- 🔍 搜索功能

### 社交功能

- 👥 关注/粉丝系统
- 💬 评论和回复
- 🏷️ 标签系统
- 📂 分类浏览

## 项目结构

```
src/
├── app/
│   ├── api/                    # API 路由
│   │   ├── auth/              # 认证相关
│   │   │   ├── login/         # 登录
│   │   │   └── register/      # 注册
│   │   ├── posts/             # 笔记相关
│   │   │   ├── [id]/          # 笔记详情
│   │   │   │   ├── like/      # 点赞
│   │   │   │   ├── collect/   # 收藏
│   │   │   │   └── comments/  # 评论
│   │   ├── users/             # 用户相关
│   │   │   └── [id]/
│   │   │       └── follow/    # 关注
│   │   ├── search/            # 搜索
│   │   └── notifications/     # 通知
│   ├── explore/               # 发现页（首页）
│   ├── post/[id]/             # 笔记详情页
│   ├── publish/               # 发布笔记页
│   ├── user/                  # 用户主页
│   ├── notification/          # 通知页
│   └── search/                # 搜索页
├── components/
│   ├── layout/                # 布局组件
│   │   ├── sidebar.tsx        # 侧边栏
│   │   ├── header.tsx         # 头部
│   │   └── mobile-nav.tsx     # 移动端导航
│   ├── post/                  # 笔记相关组件
│   │   └── post-card.tsx      # 笔记卡片
│   ├── category/              # 分类相关组件
│   │   └── category-tabs.tsx  # 分类标签
│   └── ui/                    # shadcn/ui 组件
└── db/
    ├── index.ts               # 数据库连接
    └── schema.ts              # 数据库 Schema
```

## 数据库设计

### 核心表结构

1. **users** - 用户表
2. **categories** - 分类表
3. **posts** - 笔记表
4. **post_images** - 笔记图片表
5. **post_videos** - 笔记视频表
6. **tags** - 标签表
7. **post_tags** - 笔记标签关联表
8. **follows** - 关注关系表
9. **likes** - 点赞表
10. **collections** - 收藏表
11. **comments** - 评论表
12. **notifications** - 通知表

## API 接口

### 认证相关

- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册

### 笔记相关

- `GET /api/posts` - 获取笔记列表
- `POST /api/posts` - 创建笔记
- `GET /api/posts/[id]` - 获取笔记详情
- `PUT /api/posts/[id]` - 更新笔记
- `DELETE /api/posts/[id]` - 删除笔记
- `POST /api/posts/[id]/like` - 点赞/取消点赞
- `POST /api/posts/[id]/collect` - 收藏/取消收藏
- `GET /api/posts/[id]/comments` - 获取评论列表
- `POST /api/posts/[id]/comments` - 发表评论

### 用户相关

- `GET /api/users/[id]` - 获取用户信息
- `PUT /api/users/[id]` - 更新用户信息
- `POST /api/users/[id]/follow` - 关注/取消关注

### 其他

- `GET /api/search` - 搜索笔记和用户
- `GET /api/notifications` - 获取通知列表

## 开发指南

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

### 代码格式化

```bash
pnpm fmt
```

### 代码检查

```bash
pnpm lint
```

### 构建项目

```bash
pnpm build
```

## 环境变量

创建 `.env` 文件并配置以下变量：

```env
DATABASE_URL=your_neon_database_url
```

## 待完成功能

- [ ] JWT 认证系统
- [ ] 图片上传功能
- [ ] 视频上传功能
- [ ] 实时通知
- [ ] 管理后台
- [ ] 深色模式
- [ ] 移动端适配优化

## 许可证

MIT
