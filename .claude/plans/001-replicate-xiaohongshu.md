# 小红书仿品复制计划

## 目标

参考 XiaoShiLiu-master 项目，将其核心功能复制到当前项目中，使用项目规范的技术栈：

- 前端：Vinext (Next16的vite重写版本) + Tailwind CSS + shadcn/ui + Lucide Icons
- 后端：Drizzle ORM + Neon (PostgreSQL)

## 实现阶段

### 阶段1：数据库Schema设计

基于参考项目的数据库设计文档，使用Drizzle ORM创建PostgreSQL schema。

**核心表结构：**

1. **users** - 用户表
   - id, password, user_id, email, nickname, avatar, bio, location
   - follow_count, fans_count, like_count
   - is_active, last_login_at, created_at, updated_at
   - gender, zodiac_sign, mbti, education, major, interests, verified

2. **categories** - 分类表
   - id, name, category_title, created_at

3. **posts** - 笔记表
   - id, user_id, title, content, category_id
   - type (1-图片, 2-视频), status (0-发布, 1-草稿, 2-待审核, 3-未过审)
   - view_count, like_count, collect_count, comment_count
   - created_at

4. **post_images** - 笔记图片表
   - id, post_id, image_url

5. **post_videos** - 笔记视频表
   - id, post_id, cover_url, video_url

6. **tags** - 标签表
   - id, name, use_count, created_at

7. **post_tags** - 笔记标签关联表
   - id, post_id, tag_id, created_at

8. **follows** - 关注关系表
   - id, follower_id, following_id, created_at

9. **likes** - 点赞表
   - id, user_id, target_type (1-笔记, 2-评论), target_id, created_at

10. **collections** - 收藏表
    - id, user_id, post_id, created_at

11. **comments** - 评论表
    - id, post_id, user_id, parent_id, content, like_count, created_at

12. **notifications** - 通知表
    - id, user_id, sender_id, type, title, target_id, comment_id, is_read, created_at

### 阶段2：前端页面结构

创建主要页面路由和布局：

**页面结构：**

1. **布局组件**
   - `src/app/layout.tsx` - 主布局（侧边栏 + 头部）
   - `src/components/layout/sidebar.tsx` - 侧边栏导航
   - `src/components/layout/header.tsx` - 头部搜索栏
   - `src/components/layout/footer.tsx` - 移动端底部导航

2. **核心页面**
   - `/explore` - 发现页（瀑布流笔记列表）
   - `/post/[id]` - 笔记详情页
   - `/publish` - 发布笔记页
   - `/user/[id]` - 用户主页
   - `/notification` - 通知中心
   - `/search` - 搜索结果页

3. **管理后台**
   - `/admin` - 管理后台布局
   - `/admin/login` - 管理员登录
   - `/admin/users` - 用户管理
   - `/admin/posts` - 笔记管理
   - `/admin/comments` - 评论管理

### 阶段3：核心组件开发

使用shadcn/ui和Tailwind CSS实现：

**核心组件：**

1. **笔记相关**
   - `PostCard` - 笔记卡片（瀑布流展示）
   - `PostDetail` - 笔记详情
   - `PostEditor` - 笔记编辑器
   - `ImageUploader` - 图片上传组件
   - `VideoUploader` - 视频上传组件

2. **用户相关**
   - `UserProfile` - 用户信息卡片
   - `FollowButton` - 关注按钮
   - `LikeButton` - 点赞按钮
   - `CollectButton` - 收藏按钮

3. **交互组件**
   - `CommentSection` - 评论区
   - `CommentItem` - 评论项
   - `EmojiPicker` - 表情选择器
   - `TagSelector` - 标签选择器

4. **通用组件**
   - `WaterfallFlow` - 瀑布流布局
   - `ImageCarousel` - 图片轮播
   - `SearchBar` - 搜索栏
   - `NotificationBadge` - 通知徽章

### 阶段4：API接口设计

使用Next.js API Routes实现RESTful API：

**API端点：**

1. **认证相关**
   - `POST /api/auth/login` - 登录
   - `POST /api/auth/register` - 注册
   - `POST /api/auth/logout` - 登出

2. **用户相关**
   - `GET /api/users/[id]` - 获取用户信息
   - `PUT /api/users/[id]` - 更新用户信息
   - `GET /api/users/[id]/posts` - 获取用户笔记
   - `POST /api/users/[id]/follow` - 关注用户
   - `DELETE /api/users/[id]/follow` - 取消关注

3. **笔记相关**
   - `GET /api/posts` - 获取笔记列表（支持分页、筛选）
   - `POST /api/posts` - 创建笔记
   - `GET /api/posts/[id]` - 获取笔记详情
   - `PUT /api/posts/[id]` - 更新笔记
   - `DELETE /api/posts/[id]` - 删除笔记
   - `POST /api/posts/[id]/like` - 点赞笔记
   - `POST /api/posts/[id]/collect` - 收藏笔记

4. **评论相关**
   - `GET /api/posts/[id]/comments` - 获取评论列表
   - `POST /api/posts/[id]/comments` - 发表评论
   - `POST /api/comments/[id]/like` - 点赞评论

5. **通知相关**
   - `GET /api/notifications` - 获取通知列表
   - `PUT /api/notifications/[id]` - 标记通知已读

6. **搜索相关**
   - `GET /api/search` - 搜索笔记和用户

### 阶段5：状态管理

使用React Context和Zustand管理全局状态：

**状态模块：**

1. **用户状态** - 登录状态、用户信息
2. **笔记状态** - 笔记列表、当前笔记
3. **通知状态** - 未读通知数量
4. **主题状态** - 深色/浅色模式
5. **搜索状态** - 搜索历史、搜索结果

### 阶段6：样式和主题

使用Tailwind CSS实现响应式设计：

**设计规范：**

1. **颜色系统**
   - 主色调：#ff2442（小红书红）
   - 背景色：浅色/深色模式
   - 文字颜色：主色/次色/辅助色

2. **响应式断点**
   - 移动端：< 768px
   - 平板：768px - 1024px
   - 桌面：> 1024px

3. **组件样式**
   - 使用shadcn/ui组件库
   - 自定义Tailwind配置
   - 统一的圆角、阴影、间距

## 实现顺序

1. **第一步**：数据库Schema设计和迁移
2. **第二步**：基础布局和路由配置
3. **第三步**：核心组件开发（PostCard、瀑布流等）
4. **第四步**：API接口实现
5. **第五步**：页面功能集成
6. **第六步**：状态管理和交互优化
7. **第七步**：样式调整和响应式适配

## 注意事项

1. **遵循项目规范**
   - 使用oxlint和oxfmt进行代码检查和格式化
   - 禁止使用any类型
   - 使用Drizzle ORM操作数据库
   - 尽可能使用shadcn/ui组件

2. **性能优化**
   - 图片懒加载
   - 无限滚动分页
   - 乐观更新（点赞、收藏等）
   - 骨架屏加载

3. **用户体验**
   - 响应式设计
   - 流畅的动画过渡
   - 友好的错误提示
   - 键盘快捷键支持

4. **安全性**
   - JWT认证
   - 输入验证和过滤
   - XSS防护
   - CSRF防护
