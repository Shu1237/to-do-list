
import { z } from "zod";

/**
 * Schema cho object user tham chiếu (assignedTo / createdBy / assignedTo items)
 */
export const UserRefSchema = z.object({
  _id: z.string(),
  fullname: z.string().min(1),
  username: z.string().min(1),
});

/**
 * Schema cho request tạo Task
 * - assignedTo: optional array of string ids (admin có thể gửi),
 *   nếu user bình thường bạn nên ignore trường này ở backend.
 * - startDate / dueDate: ISO datetime string => validate bằng z.string().datetime()
 * - validate: dueDate >= startDate
 */
export const CreateTaskSchema = z
  .object({
    title: z.string().min(1, "Tiêu đề là bắt buộc"),
    description: z.string().optional().or(z.literal("")).default(""),
    startDate: z.string().datetime({ offset: true }), // ISO with offset Z
    dueDate: z.string().datetime({ offset: true }),
    // assignedTo có thể là mảng id (string) hoặc bỏ trống => backend sẽ xử lý role
    assignedTo: z.array(z.string()).optional().default([]),
  })
  .refine((data) => {
    try {
      const s = new Date(data.startDate).getTime();
      const d = new Date(data.dueDate).getTime();
      return !Number.isNaN(s) && !Number.isNaN(d) && d >= s;
    } catch {
      return false;
    }
  }, { message: "dueDate phải lớn hơn hoặc bằng startDate", path: ["dueDate"] });

/**
 * Schema cho Task trả về từ API (response)
 * - assignedTo và createdBy có thể là object user ref
 * - createdAt/updatedAt: ISO datetime strings
 */
export const TaskSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  startDate: z.string().datetime({ offset: true }),
  dueDate: z.string().datetime({ offset: true }),
  status: z.enum(["todo", "done", "cancel"]),
  assignedTo: z.union([z.array(UserRefSchema), z.array(z.string())]).optional().default([]),
  createdBy: UserRefSchema,
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

/**
 * Danh sách Task
 */
export const TaskListSchema = z.array(TaskSchema);

/**
 * Export types inferred
 */
export type CreateTaskDto = z.infer<typeof CreateTaskSchema>;
export type IUserRef = z.infer<typeof UserRefSchema>;
export type ITask = z.infer<typeof TaskSchema>;
export type ITaskList = z.infer<typeof TaskListSchema>;
