# 小蓝书开发指南

## 技术栈选型

- 前端: `Vinext`(`Next16`的`vite`重写版本) + `Tailwind CSS` + `shadcn/ui` + `Lucide Icons`
- 后端: `Drizzle ORM` + `Neon`(PostgreSQL数据库)

## 开发规范

- 使用`oxlint`进行代码质量检查,用`oxfmt`进行代码格式化,请确保在提交代码前运行`pnpm fmt`和`pnpm lint`来保持代码的一致性和质量
- 写前端代码时,请尽可能直接使用`shadcn/ui`的组件,并少写`Tailwind CSS`的类名来实现样式,禁止写自定义的css样式
- 写后端代码时,请尽可能使用`Drizzle ORM`提供的API来操作数据库,禁止直接写SQL语句
- 禁止使用`any`类型和`as`类型断言,请使用明确的类型定义(在`oxlint`中,使用`any`类型会被标记为错误)

- 后端接受前端的参数时候,需要使用`zod`进行参数验证,需要在`src/types/xx.ts`中写`schema`再导出为类型,例如`src/types/auth.ts`

- 后端返回数据时候,需要使用统一的接口格式,需要使用`src/types/core.ts`中定义的`ApiResponse`接口,并必须使用`errorResponse`和`successResponse`函数来返回数据

- 前端接受后端返回的数据时候,需要使用`src/types/core.ts`中定义的`ApiResponse`接口来进行泛型类型定义,并根据`success`字段来处理不同的逻辑
