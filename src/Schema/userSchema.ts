import { z } from "zod";

export const updateAccountSchema = z.object({
  fullname: z
    .string()
    .nonempty("Tên không được để trống")
    .min(3, "Tên phải có ít nhất 3 ký tự"),
});


export type UpdateAccountDto = z.infer<typeof updateAccountSchema>;