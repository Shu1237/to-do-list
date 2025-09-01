

  // Start editing
  "use client";

  import { useState } from "react";
  import { IUser } from "@/lib/type";
  import apiUser from "@/api/user";
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên đầy đủ</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user._id}>
                <TableCell>
                  {editingId === user._id ? (
                    <Input
                      value={editName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditName(e.target.value)}
                      className="w-40"
                    />
                  ) : (
                    user.fullname
                  )}
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell className="space-x-2">
                  {editingId === user._id ? (
                    <>
                      <Button size="sm" onClick={() => handleUpdate(user._id)}>
                        Lưu
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>
                        Hủy
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>
                        Sửa
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(user._id)}>
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
