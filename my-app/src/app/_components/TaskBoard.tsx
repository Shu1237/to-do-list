"use client";
import { useMemo, useState } from "react";
import TaskForm from "./TaskForm";
import { statusColor } from "@/lib/style";
import { ITask, Task } from "@/lib/type";
import type { CreateTaskDto } from "@/schema/taskSchema";
import apiTask from "@/api/task";
import { toast } from "sonner";

type Props = {
  initialTasks: ITask[];
};

export default function TaskBoard({ initialTasks }: Props) {
  const [tasks, setTasks] = useState<ITask[]>(initialTasks || []);
  const [sortStatus, setSortStatus] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<Task>({
    title: "",
    description: "",
    startDate: "",
    dueDate: "",
  });

  // Add new task
  const handleAdd = async (task: CreateTaskDto) => {
    const res = await apiTask.add(task);
    console.log(res)
    if (res && res.task) {
      setTasks((prev) => [...prev, res.task]);
      toast.success("Thêm công việc thành công");
    }
  };

  // Start editing a task
  const handleEdit = (task: ITask) => {
    setEditingId(task._id);
    setEditFields({
      title: task.title,
      description: task.description || "",
      startDate: task.startDate.slice(0, 16),
      dueDate: task.dueDate.slice(0, 16),
    });
  };

  // Save edited task
  const handleUpdate = async (id: string) => {
    const existingTask = tasks.find((t) => t._id === id);
    if (!existingTask) return;

    const updatedTask: ITask = {
      ...existingTask,
      title: editFields.title,
      description: editFields.description,
      startDate: new Date(editFields.startDate).toISOString(),
      dueDate: new Date(editFields.dueDate).toISOString(),
    };

    const { _id, createdAt, updatedAt, createdBy, status, assignedTo, ...rest } =
      updatedTask;

    const res = await apiTask.update(id, rest);
    if (res && res.task) {
      setTasks(tasks.map((t) => (t._id === id ? res.task : t)));
      setEditFields({ title: "", description: "", startDate: "", dueDate: "" });
      setEditingId(null);
      toast.success("Cập nhật thành công");
    } else {
      toast.error("Cập nhật thất bại");
    }
  };

  const handleCancelEdit = () => setEditingId(null);

  const handleUpdateStatus = async (id: string) => {
    const res = await apiTask.updateStatusDone(id);
    if (res) {
      setTasks(tasks.map((t) => (t._id === id ? res.task : t)));
      toast.success("Cập nhật trạng thái thành công");
    } else {
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await apiTask.updateStatusCancel(id);
    if (res && res.msg) {
      setTasks(tasks.filter((t) => t._id !== id));
      toast.success("Xóa công việc thành công");
    }
  };

  const handleRestore = async (id: string) => {
    const res = await apiTask.restore(id);
    if (res && res.task) {
      setTasks(tasks.map((t) => (t._id === id ? res.task : t)));
      toast.success("Khôi phục công việc thành công");
    } else {
      toast.error("Khôi phục công việc thất bại");
    }
  };

  // Filter by status
  const filteredTasks = useMemo(() => {
    if (!Array.isArray(tasks)) return [];
    return sortStatus
      ? tasks.filter((t) => t && t.status === sortStatus)
      : tasks;
  }, [tasks, sortStatus]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    });

  return (
    <div>
      <TaskForm onAdd={handleAdd} />
      <div className="flex gap-2 mb-4">
        {["", "todo", "done", "cancel"].map((status) => (
          <button
            key={status}
            onClick={() => setSortStatus(status)}
            className={`px-3 py-1 rounded ${
              sortStatus === status || (!status && !sortStatus)
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {status === "" ? "Tất cả" : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-gray-500">Không có công việc nào</div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-lg shadow p-5 flex flex-col gap-2 border hover:shadow-lg transition"
            >
              {editingId === task._id ? (
                <>
                  <div className="flex items-center justify-between">
                    <input
                      className="text-xl font-semibold border px-2 py-1 rounded w-1/2"
                      value={editFields.title}
                      onChange={(e) =>
                        setEditFields((f) => ({ ...f, title: e.target.value }))
                      }
                    />
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                        statusColor[task.status] || "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <textarea
                    className="border px-2 py-1 rounded"
                    value={editFields.description}
                    onChange={(e) =>
                      setEditFields((f) => ({ ...f, description: e.target.value }))
                    }
                  />
                  <div className="flex gap-2">
                    <input
                      type="datetime-local"
                      className="border px-2 py-1 rounded w-1/2"
                      value={editFields.startDate}
                      onChange={(e) =>
                        setEditFields((f) => ({ ...f, startDate: e.target.value }))
                      }
                    />
                    <input
                      type="datetime-local"
                      className="border px-2 py-1 rounded w-1/2"
                      value={editFields.dueDate}
                      onChange={(e) =>
                        setEditFields((f) => ({ ...f, dueDate: e.target.value }))
                      }
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      className="px-3 py-1 rounded bg-blue-600 text-white"
                      onClick={() => handleUpdate(task._id)}
                    >
                      Lưu
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-gray-400 text-white"
                      onClick={handleCancelEdit}
                    >
                      Hủy
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{task.title}</h2>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                        statusColor[task.status] || "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <div className="text-gray-700 mb-1">{task.description}</div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span>
                      Bắt đầu: <b>{formatDate(task.startDate)}</b>
                    </span>
                    <span>
                      Hạn: <b>{formatDate(task.dueDate)}</b>
                    </span>
                    <span>
                      Người giao: <b>{task.createdBy.fullname}</b>
                    </span>
                    {task.assignedTo &&
                      Array.isArray(task.assignedTo) &&
                      task.assignedTo.length > 0 && (
                        <span>
                          Người nhận:{" "}
                          <b>
                            {task.assignedTo
                              .map((u) => (typeof u === "object" ? u.fullname : u))
                              .join(", ")}
                          </b>
                        </span>
                      )}
                  </div>
                  <div className="text-xs text-gray-400">
                    Tạo lúc: {formatDate(task.createdAt)}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 mt-2">
                      {(task.status !== "done" && task.status !== "cancel") && (
                        <button
                          className="px-3 py-1 rounded bg-yellow-400 text-white"
                          onClick={() => handleUpdate(task._id)}
                        >
                          Sửa
                        </button>
                      )}
                      {(task.status !== "done" && task.status !== "cancel") && (
                        <button
                          className="px-3 py-1 rounded bg-red-500 text-white"
                          onClick={() => handleDelete(task._id)}
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                    {task.status !== "done" && task.status !== "cancel" && (
                      <button
                        className="px-3 py-1 rounded bg-green-500 text-white"
                        onClick={() => handleUpdateStatus(task._id)}
                      >
                        Hoàn thành
                      </button>
                    )}
                    {task.status === "cancel" && (
                      <button
                        className="px-3 py-1 rounded bg-yellow-500 text-white"
                        onClick={() => handleRestore(task._id)}
                      >
                        Khôi phục
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
