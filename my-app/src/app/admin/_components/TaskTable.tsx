"use client";

import { useState } from "react";
import { ITask, TasksTableProps } from "@/lib/type";
import apiTask from "@/api/task";
import { toast } from "sonner";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import BaseFormCreate from "@/components/base/baseFormCreate";
import BaseFormUpdate from "@/components/base/baseFormUpdate";
import BaseView from "@/components/base/baseView";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CreateTaskSchema } from "@/schema/taskSchema";
import { FormErrorHandler } from "@/lib/FormErrorHandler";


export default function TaskTable({ initialTasks, users }: TasksTableProps) {
  const [tasks, setTasks] = useState<ITask[]>(initialTasks);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState({
    title: "",
    description: "",
    startDate: "",
    dueDate: "",
    assignedTo: [] as string[],
  });
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [viewTask, setViewTask] = useState<ITask | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleCreate = async () => {
    setFieldErrors({});
    const result = CreateTaskSchema.safeParse({
      title: editFields.title,
      description: editFields.description,
      startDate: new Date(editFields.startDate).toISOString(),
      dueDate: new Date(editFields.dueDate).toISOString(),
      assignedTo: editFields.assignedTo,
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
        assignedTo: editFields.assignedTo,
      };
      const res = await apiTask.add(newTask);
      setTasks(prev => [...prev, ...res.tasks]);
      setEditFields({
        title: "",
        description: "",
        startDate: "",
        dueDate: "",
        assignedTo: [],
      });
      setOpenCreate(false);
      toast.success("Tạo công việc thành công");
    } catch (err: any) {
      const handler = new FormErrorHandler(err?.response || {});
      console.log("FormErrorHandler:", handler);
      if (handler.hasErrors()) {
        setFieldErrors(handler.fieldErrors);
        if (handler.generalError) {
          toast.error(handler.generalError);
        }
      } else {
        toast.error(err?.response?.data?.message || "Tạo thất bại!");
      }
    }
  };

  const handleEdit = (task: ITask) => {
    setEditingId(task._id);
    setEditFields({
      title: task.title,
      description: task.description,
      startDate: task.startDate.slice(0, 16),
      dueDate: task.dueDate.slice(0, 16),
      assignedTo: task.assignedTo ? [task.assignedTo._id] : [],
    });
    setOpenEdit(true);
  };


  const handleUpdate = async () => {
    setFieldErrors({});
    if (!editingId) return;
    const result = CreateTaskSchema.safeParse({
      title: editFields.title,
      description: editFields.description,
      startDate: new Date(editFields.startDate).toISOString(),
      dueDate: new Date(editFields.dueDate).toISOString(),
      assignedTo: editFields.assignedTo,
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
      const updatedTask = {
        title: editFields.title,
        description: editFields.description,
        startDate: new Date(editFields.startDate).toISOString(),
        dueDate: new Date(editFields.dueDate).toISOString(),
      };
      const res = await apiTask.update(editingId, updatedTask);
      setTasks(tasks.map(t => t._id === editingId ? res.task : t));
      setEditingId(null);
      setOpenEdit(false);
      toast.success("Cập nhật thành công");
    } catch (err: any) {
      const handler = new FormErrorHandler(err?.response || {});
      if (handler.hasErrors()) {
        setFieldErrors(handler.fieldErrors);
        if (handler.generalError) {
          toast.error(handler.generalError);
        }
      } else {
        toast.error(err?.response?.data?.message || "Cập nhật thất bại!");
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await apiTask.updateStatusCancel(id);
      if (res) {
        setTasks(tasks.map(t => (t._id === id ? { ...t, status: 'cancel' } : t)));
        toast.success("Đã chuyển trạng thái thành hủy");
      }
    } catch (error: any) {
      const handler = new FormErrorHandler(error?.response || {});
      if (handler.hasErrors()) {
        if (handler.generalError) {
          toast.error(handler.generalError);
        }
      } else {
        toast.error(error?.response?.data?.message || "Xóa công việc thất bại!");
      }
    }
  };




  const handleUpdateStatus = async (id: string) => {
    const updatedTask = tasks.find(t => t._id === id);
    if (updatedTask) {
      try {
        const res = await apiTask.updateStatusDone(id);
        if (res) {
          updatedTask.status = updatedTask.status === "done" ? "todo" : "done";
          setTasks([...tasks]);
          toast.success("Cập nhật trạng thái thành công");
        }
      } catch (error: any) {
        const handler = new FormErrorHandler(error?.response || {});
        if (handler.hasErrors()) {
          if (handler.generalError) {
            toast.error(handler.generalError);
          }
        } else {
          toast.error(error?.response?.data?.message || "Cập nhật trạng thái thất bại");
        }
      }
    }
  };

  const handleRestore = async (id: string) => {
    const updatedTask = tasks.find(t => t._id === id);
    if (updatedTask) {
      try {
        const res = await apiTask.restore(id);
      if (res) {
        updatedTask.status = "todo";
        setTasks([...tasks]);
        toast.success("Khôi phục công việc thành công");
      } 
      } catch (error:any) {
          const handler = new FormErrorHandler(error?.response || {});
      if (handler.hasErrors()) {
        if (handler.generalError) {
          toast.error(handler.generalError);
        }
      } else {
        toast.error(error?.response?.data?.message || "Khôi phục công việc thất bại");
      }
      }
    }
  };
  const handleView = (task: ITask) => {
    setViewTask(task);
    setOpenView(true);
  };
  const filteredTasks = tasks.filter(t => {
    if (statusFilter === "all") return true;
    return t.status === statusFilter;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Quản lý công việc</h2>
        <div className="flex gap-2">
          {/* Select filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="todo">Đang làm</SelectItem>
              <SelectItem value="done">Hoàn thành</SelectItem>
              <SelectItem value="cancel">Đã hủy</SelectItem>
            </SelectContent>
          </Select>

          <BaseFormCreate
            open={openCreate}
            onOpenChange={setOpenCreate}
            fields={editFields}
            onChange={setEditFields}
            onSubmit={handleCreate}
            users={users}
            role="admin"
            fieldErrors={fieldErrors}
          />
          <Button variant="default" onClick={() => setOpenCreate(true)}>Create</Button>
        </div>
      </div>

      {/* Table tasks */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tiêu đề</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Người giao</TableHead>
            <TableHead>Người nhận</TableHead>
            <TableHead>Bắt đầu</TableHead>
            <TableHead>Hạn</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.map(task => (
            <TableRow key={task._id}>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>{task.createdBy?.fullname || "Chưa có người giao"}</TableCell>
              <TableCell>{task.assignedTo?.fullname || "Chưa có người nhận"}</TableCell>
              <TableCell>{new Date(task.startDate).toLocaleString()}</TableCell>
              <TableCell>{new Date(task.dueDate).toLocaleString()}</TableCell>
              <TableCell>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-semibold ${task.status === "done"
                    ? "bg-green-100 text-green-700"
                    : task.status === "todo"
                      ? "bg-yellow-100 text-yellow-700"
                      : task.status === "cancel"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                >
                  {task.status}
                </span>
              </TableCell>
              <TableCell className="space-x-2">
                {task.status === "todo" ? (
                  <>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(task)}>
                      Sửa
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(task._id)}>
                      Xóa
                    </Button>
                    <Button size="sm" variant="default" onClick={() => handleUpdateStatus(task._id)}>
                      Hoàn thành
                    </Button>
                  </>
                ) : task.status === "cancel" ? (
                  <Button size="sm" variant="default" onClick={() => handleRestore(task._id)}>
                    Khôi phục
                  </Button>
                ) : task.status === "done" ? (
                  <Button size="sm" variant="secondary" onClick={() => handleView(task)}>
                    Xem
                  </Button>
                ) : null}

              </TableCell>


            </TableRow>
          ))}
        </TableBody>
      </Table>

      <BaseFormUpdate
        open={openEdit}
        onOpenChange={setOpenEdit}
        fields={editFields}
        onChange={setEditFields}
        onSubmit={handleUpdate}
        onCancel={() => {
          setOpenEdit(false);
          setEditingId(null);
        }}
        users={users}
        role="admin"
        fieldErrors={fieldErrors}
      />

      <BaseView
        open={openView}
        onOpenChange={setOpenView}
        task={viewTask}
        users={users}
      />

    </div>
  );
}
