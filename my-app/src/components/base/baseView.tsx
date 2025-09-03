"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, UserPlus, Clock, FileText } from "lucide-react";
import { statusColors } from "@/lib/style";
import { BaseViewProps } from "@/lib/type";
import { Button } from "@/components/ui/button";

export default function BaseView({ open, onOpenChange, task }: BaseViewProps) {
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg w-full rounded-2xl shadow-lg"
        // ẩn nút X mặc định
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-lg font-semibold">{task.title}</span>
            <Badge
              variant="outline"
              className={`capitalize px-2 py-1 text-xs font-bold ${
                statusColors[task.status] ||
                "bg-gray-100 text-gray-700 border-gray-200"
              }`}
            >
              {task.status}
            </Badge>
          </DialogTitle>
          {task.description && (
            <DialogDescription className="text-sm text-gray-600 mt-1 flex items-start gap-2">
              <FileText className="w-4 h-4 mt-[2px] text-gray-500" />
              {task.description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="mt-4 space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Người giao:</span>
              <span className="truncate">
                {task.createdBy?.fullname || "Chưa có"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Người nhận:</span>
              <span className="truncate">
                {task.assignedTo?.fullname || "Chưa có"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Bắt đầu:</span>
              <span>{new Date(task.startDate).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Hạn:</span>
              <span>{new Date(task.dueDate).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Tạo lúc:</span>
            <span>
              {task.createdAt
                ? new Date(task.createdAt).toLocaleString()
                : "-"}
            </span>
          </div>
        </div>

        <DialogFooter className="flex justify-end mt-6">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
