"use client";

import { useState } from "react";
import { ITask, IUser } from "@/lib/type";
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
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  initialTasks: ITask[];
  users: IUser[];
};

export default function TaskTable({ initialTasks, users }: Props) {
  const [tasks, setTasks] = useState<ITask[]>(initialTasks);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState({
    title: "",
    description: "",
    startDate: "",
    dueDate: "",
    assignedTo: [] as string[],
  });

  const handleEdit = (task: ITask) => {
    setEditingId(task._id);
    setEditFields({
      title: task.title,
      description: task.description,
      startDate: task.startDate.slice(0, 16),
      dueDate: task.dueDate.slice(0, 16),
      assignedTo: [task.assignedTo?._id || ""],
    });
  };

  const handleUpdate = async (id: string) => {
    try {
      const updatedTask = {
        title: editFields.title,
        description: editFields.description,
        startDate: new Date(editFields.startDate).toISOString(),
        dueDate: new Date(editFields.dueDate).toISOString(),
      };
      const res = await apiTask.update(id, updatedTask);
      setTasks(tasks.map(t => t._id === id ? res.task : t));
      setEditingId(null);
      toast.success("Cập nhật thành công");
    } catch (err) {
      toast.error("Cập nhật thất bại");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiTask.delete(id);
      setTasks(tasks.filter(t => t._id !== id));
      toast.success("Xóa thành công");
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  const handleCreate = async () => {
    try {
      const newTask = {
        title: editFields.title,
        description: editFields.description,
        startDate: new Date(editFields.startDate).toISOString(),
        dueDate: new Date(editFields.dueDate).toISOString(),
        assignedTo: editFields.assignedTo,
      };
      const res = await apiTask.add(newTask);
      setTasks([...tasks, res.task]);
      setEditFields({ title: "", description: "", startDate: "", dueDate: "", assignedTo: [] });
      toast.success("Tạo công việc thành công");
    } catch {
      toast.error("Tạo thất bại");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Quản lý công việc</h2>

      {/* Form tạo task */}
      <div className="mb-4 flex flex-col gap-2">
        <Input type="text" placeholder="Tiêu đề" value={editFields.title} onChange={e => setEditFields(f => ({ ...f, title: e.target.value }))} />
        <Textarea placeholder="Mô tả" value={editFields.description} onChange={e => setEditFields(f => ({ ...f, description: e.target.value }))} />
        <div className="flex gap-2">
          <Input type="datetime-local" value={editFields.startDate} onChange={e => setEditFields(f => ({ ...f, startDate: e.target.value }))} />
          <Input type="datetime-local" value={editFields.dueDate} onChange={e => setEditFields(f => ({ ...f, dueDate: e.target.value }))} />
          <Select value={editFields.assignedTo[0] || ""} onValueChange={v => setEditFields(f => ({ ...f, assignedTo: [v] }))}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Chọn người nhận" />
            </SelectTrigger>
            <SelectContent>
              {users.filter(u => u.role !== "admin").map(u => (
                <SelectItem key={u._id} value={u._id}>{u.fullname}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button variant="default" onClick={handleCreate}>Tạo công việc</Button>
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
          {tasks.map(task => (
            <TableRow key={task._id}>
              <TableCell>{editingId === task._id ? <Input value={editFields.title} onChange={e => setEditFields(f => ({ ...f, title: e.target.value }))} className="w-full" /> : task.title}</TableCell>
              <TableCell>{editingId === task._id ? <Textarea value={editFields.description} onChange={e => setEditFields(f => ({ ...f, description: e.target.value }))} className="w-full" /> : task.description}</TableCell>
              <TableCell>{task.createdBy.fullname}</TableCell>
              <TableCell>{task.assignedTo?.fullname}</TableCell>
              <TableCell>{new Date(task.startDate).toLocaleString()}</TableCell>
              <TableCell>{new Date(task.dueDate).toLocaleString()}</TableCell>
              <TableCell>
                {/* Nếu có Badge component thì dùng, nếu không thì dùng span */}
                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${task.status === "done" ? "bg-green-100 text-green-700" : task.status === "todo" ? "bg-yellow-100 text-yellow-700" : task.status === "cancel" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>
                  {task.status === "done" ? "Hoàn thành" : task.status === "todo" ? "Đang làm" : task.status === "cancel" ? "Đã hủy" : task.status}
                </span>
              </TableCell>
              <TableCell className="space-x-2">
                {editingId === task._id ? (
                  <>
                    <Button size="sm" onClick={() => handleUpdate(task._id)}>
                      Lưu
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>
                      Hủy
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(task)}>
                      Sửa
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(task._id)}>
                      Xóa
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
