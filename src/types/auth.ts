import { z } from "zod";

export const registerSchema = z.object({
  userId: z.string().min(3, "用户ID至少3个字符"),
  password: z.string().min(6, "密码至少6位"),
  nickname: z.string().min(1, "昵称不能为空"),
  email: z.email("邮箱格式不正确").optional(),
});

export type RegisterRequest = z.infer<typeof registerSchema>;
