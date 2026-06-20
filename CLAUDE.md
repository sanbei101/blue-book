# 小蓝书开发指南

## 技术栈选型

- 前端: `Vinext`(`Next16`的vite重写版本) + `Tailwind CSS` + `shadcn/ui` + `Lucide Icons`
- 后端: `Drizzle ORM` + `Neon Serverless`(PostgreSQL数据库)

## 开发规范

使用`oxlint`进行代码质量检查,用`oxfmt`进行代码格式化。
请确保在提交代码前运行`pnpm fmt`和`pnpm lint`来保持代码的一致性和质量
