"use client";

import { useState } from "react";
import { ITask, IUser } from "@/lib/type";
import apiTask from "@/api/task";
import { toast } from "sonner";

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
        <input type="text" placeholder="Tiêu đề" className="border px-2 py-1 rounded" value={editFields.title} onChange={e => setEditFields(f => ({ ...f, title: e.target.value }))} />
        <textarea placeholder="Mô tả" className="border px-2 py-1 rounded" value={editFields.description} onChange={e => setEditFields(f => ({ ...f, description: e.target.value }))} />
        <div className="flex gap-2">
          <input type="datetime-local" className="border px-2 py-1 rounded" value={editFields.startDate} onChange={e => setEditFields(f => ({ ...f, startDate: e.target.value }))} />
          <input type="datetime-local" className="border px-2 py-1 rounded" value={editFields.dueDate} onChange={e => setEditFields(f => ({ ...f, dueDate: e.target.value }))} />
        </div>
        <select>
          {users
            .filter(u => u.role !== "admin") 
            .map(u => (
              <option key={u._id} value={u._id}>
                {u.fullname}
              </option>
            ))}
        </select>

        <button className="px-3 py-1 bg-green-500 text-white rounded" onClick={handleCreate}>Tạo công việc</button>
      </div>

      {/* Table tasks */}
      <table className="min-w-full border border-gray-300 rounded overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Tiêu đề</th>
            <th className="px-4 py-2 border">Mô tả</th>
            <th className="px-4 py-2 border">Người giao</th>
            <th className="px-4 py-2 border">Người nhận</th>
            <th className="px-4 py-2 border">Bắt đầu</th>
            <th className="px-4 py-2 border">Hạn</th>
            <th className="px-4 py-2 border">Trạng thái</th>
            <th className="px-4 py-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task._id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{editingId === task._id ? <input value={editFields.title} onChange={e => setEditFields(f => ({ ...f, title: e.target.value }))} className="border px-2 py-1 rounded w-full" /> : task.title}</td>
              <td className="px-4 py-2 border">{editingId === task._id ? <input value={editFields.description} onChange={e => setEditFields(f => ({ ...f, description: e.target.value }))} className="border px-2 py-1 rounded w-full" /> : task.description}</td>
              <td className="px-4 py-2 border">{task.createdBy.fullname}</td>
              <td className="px-4 py-2 border">{task.assignedTo?.fullname}</td>
              <td className="px-4 py-2 border">{new Date(task.startDate).toLocaleString()}</td>
              <td className="px-4 py-2 border">{new Date(task.dueDate).toLocaleString()}</td>
              <td className="px-4 py-2 border">{task.status}</td>
              <td className="px-4 py-2 border flex gap-2">
                {editingId === task._id ? (
                  <>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => handleUpdate(task._id)}>Lưu</button>
                    <button className="px-3 py-1 bg-gray-400 text-white rounded" onClick={() => setEditingId(null)}>Hủy</button>
                  </>
                ) : (
                  <>
                    <button className="px-3 py-1 bg-yellow-400 text-white rounded" onClick={() => handleEdit(task)}>Sửa</button>
                    <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => handleDelete(task._id)}>Xóa</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
