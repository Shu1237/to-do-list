export type TaskStatus = "done" | "todo" | "cancel";

export const statusColors: Record<TaskStatus, string> = {
  done: "bg-green-100 text-green-700 border-green-200",
  todo: "bg-yellow-100 text-yellow-700 border-yellow-200",
  cancel: "bg-red-100 text-red-700 border-red-200",
};
