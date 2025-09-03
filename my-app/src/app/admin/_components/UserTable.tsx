
"use client";

import { useState } from "react";
import { IUser, UserTableProps } from "@/lib/type";
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
import BaseFormUser from "@/components/base/baseFormUser";
import { FormErrorHandler } from "@/lib/FormErrorHandler";
import { handleErrorApi } from "@/lib/utils";
import { updateAccountSchema } from "@/schema/userSchema";




export default function UserTable({ initialUsers }: UserTableProps) {
  const [users, setUsers] = useState<IUser[]>(initialUsers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Start editing
  const handleEdit = (user: IUser) => {
    setEditingId(user._id);
    setEditName(user.fullname);
    setFieldErrors({});
    setOpenEdit(true);
  };

  // Save edit
  const handleUpdate = async (id: string) => {
    setFieldErrors({});
    const result = updateAccountSchema.safeParse({ fullname: editName });
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
      const res = await apiUser.update(id, { fullname: editName });
      setUsers(users.map(u => u._id === id ? res.user : u));
      setEditingId(null);
      setOpenEdit(false);
      toast.success("Cập nhật thành công");
    } catch (error: any) {
      console.log(error)
    const validation=  handleErrorApi(error, "Cập nhật thất bại!");
    if(validation?.fieldErrors){
      setFieldErrors(validation.fieldErrors);
    }
  };
}

  // Delete
  const handleDelete = async (id: string) => {
    try {
      await apiUser.delete(id);
      setUsers(users.filter(u => u._id !== id));
      toast.success("Xóa thành công");
    } catch (error: any) {
       handleErrorApi(error, "Xóa user thất bại!");
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
            <TableHead>Ngày tạo</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => (
            <TableRow key={user._id}>
              <TableCell>
                {user.fullname}
              </TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.status}</TableCell>
              <TableCell>{new Date(user.createdAt).toLocaleDateString("en-US")}</TableCell>
              <TableCell className="space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>
                  Sửa
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(user._id)}>
                  Xóa
                </Button>
      <BaseFormUser
        open={openEdit}
        onOpenChange={(v) => {
          setOpenEdit(v);
          if (!v) setEditingId(null);
        }}
        value={editName}
        onChange={setEditName}
        onSubmit={() => editingId && handleUpdate(editingId)}
        loading={false}
        fieldErrors={fieldErrors}
      />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
