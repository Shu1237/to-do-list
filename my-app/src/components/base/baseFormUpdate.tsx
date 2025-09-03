import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BaseFormUpdateProps } from "@/lib/type";

export default function BaseFormUpdate({
	open,
	onOpenChange,
	fields,
	onChange,
	onSubmit,
	onCancel,
	users = [],
	role = "user",
	loading = false,
}: BaseFormUpdateProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md w-full">
				<DialogHeader>
					<DialogTitle>Cập nhật công việc</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-4 py-2">
					<div className="flex flex-col gap-1">
						<label htmlFor="task-title" className="text-sm font-medium">Tiêu đề</label>
						<Input id="task-title" type="text" placeholder="Nhập tiêu đề" value={fields.title} onChange={e => onChange({ ...fields, title: e.target.value })} />
					</div>
					<div className="flex flex-col gap-1">
						<label htmlFor="task-desc" className="text-sm font-medium">Mô tả</label>
						<Textarea id="task-desc" placeholder="Nhập mô tả" value={fields.description} onChange={e => onChange({ ...fields, description: e.target.value })} />
					</div>
					<div className="flex gap-2">
						<div className="flex flex-col gap-1 w-1/2">
							<label htmlFor="task-start" className="text-sm font-medium">Bắt đầu</label>
							<Input id="task-start" type="datetime-local" value={fields.startDate} onChange={e => onChange({ ...fields, startDate: e.target.value })} />
						</div>
						<div className="flex flex-col gap-1 w-1/2">
							<label htmlFor="task-due" className="text-sm font-medium">Hạn</label>
							<Input id="task-due" type="datetime-local" value={fields.dueDate} onChange={e => onChange({ ...fields, dueDate: e.target.value })} />
						</div>
					</div>
					{role === "admin" && users.length > 0 && (
						<div className="flex flex-col gap-1">
							<label htmlFor="task-assignee" className="text-sm font-medium">Người nhận</label>
							<Select value={fields.assignedTo?.[0] || ""} onValueChange={v => onChange({ ...fields, assignedTo: [v] })}>
								<SelectTrigger id="task-assignee" className="w-full">
									<SelectValue placeholder="Chọn người nhận" />
								</SelectTrigger>
								<SelectContent>
									{users.filter(u => u.role !== "admin").map(u => (
										<SelectItem key={u._id} value={u._id}>{u.fullname}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}
				</div>
				<DialogFooter>
					<Button variant="default" onClick={onSubmit} disabled={loading}>{loading ? "Đang lưu..." : "Lưu"}</Button>
					<Button variant="secondary" onClick={onCancel}>Hủy</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
