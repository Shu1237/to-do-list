import { z } from "zod";

// User reference schema
export const UserRefSchema = z.object({
  _id: z.string(),
  fullname: z.string().min(1, "Fullname is required"),
  username: z.string().min(1, "Username is required"),
});

// Create Task schema (client-side validation)
export const CreateTaskSchema = z
  .object({
    title: z.string().min(3, "Tiêu đề phải ít nhất 3 ký tự"),
    description: z.string().min(5, "Mô tả phải ít nhất 5 ký tự"),
    startDate: z.string().refine((val) => {
      const start = new Date(val);
      return start.getTime() > Date.now();
    }, { message: "Start date must be in the future" }),
    dueDate: z.string(),
    assignedTo: z.array(z.string()).optional().default([]),
  })
  .refine((data) => {
    const start = new Date(data.startDate).getTime();
    const due = new Date(data.dueDate).getTime();
    return due > start;
  }, { message: "Due date must be after start date", path: ["dueDate"] });

// Update Task schema (optional fields)
export const UpdateTaskSchema = z
  .object({
    title: z.string().min(3).optional(),
    description: z.string().min(5).optional(),
    startDate: z.string().optional(),
    dueDate: z.string().optional(),
    assignedTo: z.array(z.string()).optional(),
    status: z.enum(["todo", "done", "cancel"]).optional(),
  })
  .refine((data) => {
    if (!data.startDate || !data.dueDate) return true;
    const start = new Date(data.startDate).getTime();
    const due = new Date(data.dueDate).getTime();
    return due > start;
  }, { message: "Due date must be after start date", path: ["dueDate"] });

// Task object schema
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

// Task list
export const TaskListSchema = z.array(TaskSchema);

// Types
export type CreateTaskDto = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskDto = z.infer<typeof UpdateTaskSchema>;
export type IUserRef = z.infer<typeof UserRefSchema>;
export type ITask = z.infer<typeof TaskSchema>;
export type ITaskList = z.infer<typeof TaskListSchema>;
