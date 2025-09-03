"use client";
import { useMemo, useState } from "react";
import { CreateTaskSchema } from "@/schema/taskSchema";
import { FormErrorHandler } from "@/lib/FormErrorHandler";
import BaseFormCreate from "@/components/base/baseFormCreate";
import BaseFormUpdate from "@/components/base/baseFormUpdate";
import BaseView from "@/components/base/baseView";
import { ITask, Task, TaskBoardProps } from "@/lib/type";
import apiTask from "@/api/task";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { statusColors } from "@/lib/style";
import { handleErrorApi } from "@/lib/utils";


export default function TaskBoard({ initialTasks }: TaskBoardProps) {
  const [tasks, setTasks] = useState<ITask[]>(initialTasks || []);
  const [sortStatus, setSortStatus] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<Task>({
    title: "",
    description: "",
    startDate: "",
    dueDate: "",
  });
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [viewTask, setViewTask] = useState<ITask | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const handleView = (task: ITask) => {
    setViewTask(task);
    setOpenView(true);
  };


  const handleAdd = async () => {
    setFieldErrors({});
    // Validate client
    const result = CreateTaskSchema.safeParse({
      title: editFields.title,
      description: editFields.description,
      startDate: new Date(editFields.startDate).toISOString(),
      dueDate: new Date(editFields.dueDate).toISOString(),
      assignedTo: [],
    });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (typeof err.path[0] === 'string' || typeof err.path[0] === 'number') {
          errors[err.path[0] as string | number] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }
    try {
      const newTask = {
        title: editFields.title,
        description: editFields.description,
        startDate: new Date(editFields.startDate).toISOString(),
        dueDate: new Date(editFields.dueDate).toISOString(),
        assignedTo: [],
      };
      const res = await apiTask.add(newTask);
      if (res && res.tasks) {
        setTasks((prev) => [...prev, ...res.tasks]);
        setEditFields({ title: "", description: "", startDate: "", dueDate: "" });
        setOpenCreate(false);
        toast.success("Thêm công việc thành công");
      }
    } catch (err: any) {
      const validation = handleErrorApi(err, "Thêm công việc thất bại!");
      if (validation?.fieldErrors) {
        setFieldErrors(validation.fieldErrors);
      }
    }
  };



  const handleEdit = (task: ITask) => {
    setEditingId(task._id);
    setEditFields({
      title: task.title,
      description: task.description || "",
      startDate: task.startDate.slice(0, 16),
      dueDate: task.dueDate.slice(0, 16),
    });
    setOpenEdit(true);
  };


  const handleUpdate = async () => {
    setFieldErrors({});
    if (!editingId) return;
    const existingTask = tasks.find((t) => t._id === editingId);
    if (!existingTask) return;
    // Validate client
    const result = CreateTaskSchema.safeParse({
      title: editFields.title,
      description: editFields.description,
      startDate: new Date(editFields.startDate).toISOString(),
      dueDate: new Date(editFields.dueDate).toISOString(),
      assignedTo: [],
    });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (typeof err.path[0] === 'string' || typeof err.path[0] === 'number') {
          errors[err.path[0] as string | number] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }
    const updatedTask: ITask = {
      ...existingTask,
      title: editFields.title,
      description: editFields.description,
      startDate: new Date(editFields.startDate).toISOString(),
      dueDate: new Date(editFields.dueDate).toISOString(),
    };
    const { _id, createdAt, updatedAt, createdBy, status, assignedTo, ...rest } = updatedTask;
    try {
      const res = await apiTask.update(editingId, rest);
      if (res && res.task) {
        setTasks(tasks.map((t) => (t._id === editingId ? res.task : t)));
        setEditFields({ title: "", description: "", startDate: "", dueDate: "" });
        setEditingId(null);
        setOpenEdit(false);
        toast.success("Cập nhật thành công");
      } else {
        toast.error("Cập nhật thất bại");
      }
    } catch (err: any) {
      const validation = handleErrorApi(err, "Cập nhật thất bại!");
      if (validation?.fieldErrors) {
        setFieldErrors(validation.fieldErrors);
      }
    }
  };


  const handleUpdateStatus = async (id: string) => {
    try {
      const res = await apiTask.updateStatusDone(id);
      if (res && res.task) {
        setTasks(tasks.map((t) => (t._id === id ? res.task : t)));
        toast.success("Cập nhật trạng thái thành công");
      }
    } catch (error: any) {
      handleErrorApi(error, "Cập nhật trạng thái thất bại!");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await apiTask.updateStatusCancel(id);
      if (res && res.msg) {
        setTasks(tasks.filter((t) => t._id !== id));
        toast.success("Xóa công việc thành công");
      }
    } catch (error: any) {
      handleErrorApi(error, "Xóa công việc thất bại!");
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const res = await apiTask.restore(id);
      if (res && res.task) {
        setTasks(tasks.map((t) => (t._id === id ? res.task : t)));
        toast.success("Khôi phục công việc thành công");
      }
    } catch (error: any) {
      handleErrorApi(error, "Khôi phục công việc thất bại!");
    }
  };


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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className=" mb-4">
          <BaseFormCreate
            open={openCreate}
            onOpenChange={setOpenCreate}
            fields={editFields}
            onChange={setEditFields}
            onSubmit={handleAdd}
            role="user"
            fieldErrors={fieldErrors}
          />
          <Button variant="default" onClick={() => setOpenCreate(true)}>Tạo công việc</Button>
        </div>
        <div className="flex gap-2 mb-4">
          {["", "todo", "done", "cancel"].map((status) => (
            <Button
              key={status}
              variant={
                sortStatus === status || (!status && !sortStatus)
                  ? "default"
                  : "outline"
              }
              onClick={() => setSortStatus(status)}
              className="rounded-full px-4 py-1 text-sm capitalize"
            >
              {status === ""
                ? "Tất cả"
                : status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-gray-500">Không có công việc nào</div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-card rounded-xl shadow-lg p-6 flex flex-col gap-3 border border-border hover:shadow-2xl transition-all duration-200"
            >
              {editingId === task._id ? (
                <BaseFormUpdate
                  open={openEdit}
                  onOpenChange={setOpenEdit}
                  fields={editFields}
                  onChange={setEditFields}
                  onSubmit={handleUpdate}
                  onCancel={() => { setOpenEdit(false); setEditingId(null); }}
                  role="user"
                  fieldErrors={fieldErrors}
                />
              ) : (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xl font-semibold">{task.title}</h2>
                    <Badge
                      variant="outline"
                      className={`capitalize px-3 py-1 text-xs font-bold ${statusColors[task.status] || "bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                    >
                      {task.status}
                    </Badge>
                  </div>
                  <div className="text-muted-foreground mb-1">
                    {task.description}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span>
                      Bắt đầu: <b>{formatDate(task.startDate)}</b>
                    </span>
                    <span>
                      Hạn: <b>{formatDate(task.dueDate)}</b>
                    </span>
                    <span>
                      Người giao: <b>{task.createdBy?.fullname}</b>
                    </span>
                    {task.assignedTo && (
                      <span>
                        Người nhận: <b>{task.assignedTo.fullname}</b>
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    Tạo lúc: {formatDate(task.createdAt)}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 mt-2">
                      {task.status !== "done" && task.status !== "cancel" && (
                        <Button variant="outline" onClick={() => handleEdit(task)}>
                          Sửa
                        </Button>
                      )}
                      {task.status !== "done" && task.status !== "cancel" && (
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(task._id)}
                        >
                          Xóa
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-2 mt-2">
                      {task.status !== "done" && task.status !== "cancel" && (
                        <Button
                          variant="default"
                          onClick={() => handleUpdateStatus(task._id)}
                        >
                          Hoàn thành
                        </Button>
                      )}
                      {task.status === "cancel" && task.createdBy._id === task.assignedTo._id && (
                        <Button
                          variant="secondary"
                          onClick={() => handleRestore(task._id)}
                        >
                          Khôi phục
                        </Button>
                      )}
                      {task.status === "done" && (
                        <Button
                          variant="secondary"
                          onClick={() => handleView(task)}
                        >
                          Xem
                        </Button>
                      )}
                    </div>
                  </div>

                </>
              )}
            </div>
          ))
        )}
      </div>

      <BaseView
        open={openView}
        onOpenChange={setOpenView}
        task={viewTask}
      />
    </div>
  );
}
