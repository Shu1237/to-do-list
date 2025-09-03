import { z } from "zod";

export const loginSchema = z.object({
	username: z.string().min(3, "Username phải có ít nhất 3 ký tự"),
	password: z.string().min(6, "Password phải có ít nhất 6 ký tự"),
});

export const registerSchema = z.object({
	fullname: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
	username: z.string().min(3, "Username phải có ít nhất 3 ký tự"),
	password: z.string().min(6, "Password phải có ít nhất 6 ký tự"),
	confirmPassword: z.string().min(6, "Xác nhận mật khẩu phải có ít nhất 6 ký tự"),
	role: z.string().default('user').optional(),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Mật khẩu không khớp",
	path: ["confirmPassword"],
});
export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;

