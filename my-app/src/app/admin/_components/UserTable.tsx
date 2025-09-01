"use client";

import { useState } from "react";
import { IUser } from "@/lib/type";
import apiUser from "@/api/user";
import { toast } from "sonner";

type Props = {
  initialUsers: IUser[];
};

export default function UserTable({ initialUsers }: Props) {
  const [users, setUsers] = useState<IUser[]>(initialUsers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  // Start editing
  const handleEdit = (user: IUser) => {
    setEditingId(user._id);
    setEditName(user.fullname);
  };

  // Save edit
  const handleUpdate = async (id: string) => {
    try {
      const res = await apiUser.update(id, { fullname: editName });
      setUsers(users.map(u => u._id === id ? res.user : u));
      setEditingId(null);
      toast.success("Cập nhật thành công");
    } catch (err) {
      toast.error("Cập nhật thất bại");
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    try {
      await apiUser.delete(id);
      setUsers(users.filter(u => u._id !== id));
      toast.success("Xóa thành công");
    } catch (err) {
      toast.error("Xóa thất bại");
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Quản lý người dùng</h2>
      <table className="min-w-full border border-gray-300 rounded overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Tên đầy đủ</th>
            <th className="px-4 py-2 border">Username</th>
            <th className="px-4 py-2 border">Role</th>
            <th className="px-4 py-2 border">Trạng thái</th>
            <th className="px-4 py-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">
                {editingId === user._id ? (
                  <input
                    className="border px-2 py-1 rounded w-full"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                  />
                ) : (
                  user.fullname
                )}
              </td>
              <td className="px-4 py-2 border">{user.username}</td>
              <td className="px-4 py-2 border">{user.role}</td>
              <td className="px-4 py-2 border">{user.status}</td>
              <td className="px-4 py-2 border flex gap-2">
                {editingId === user._id ? (
                  <>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => handleUpdate(user._id)}>Lưu</button>
                    <button className="px-3 py-1 bg-gray-400 text-white rounded" onClick={() => setEditingId(null)}>Hủy</button>
                  </>
                ) : (
                  <>
                    <button className="px-3 py-1 bg-yellow-400 text-white rounded" onClick={() => handleEdit(user)}>Sửa</button>
                    <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => handleDelete(user._id)}>Xóa</button>
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
