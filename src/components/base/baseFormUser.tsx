
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";
import { BaseFormUserProps } from "@/lib/type";



export default function BaseFormUser({
	open,
	onOpenChange,
	value,
	onChange,
	onSubmit,
	loading = false,
	fieldErrors = {},
}: BaseFormUserProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md w-full">
				<DialogHeader>
					<DialogTitle>Cập nhật tên người dùng</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-4 py-2">
					<div className="flex flex-col gap-1">
						<label htmlFor="user-fullname" className="text-sm font-medium">Tên đầy đủ</label>
						<Input
							id="user-fullname"
							type="text"
							placeholder="Nhập tên đầy đủ"
							value={value}
							onChange={e => onChange(e.target.value)}
							autoFocus
						/>
						{fieldErrors.fullname && <span className="text-destructive text-xs">{fieldErrors.fullname}</span>}
					</div>
				</div>
				<DialogFooter>
					<Button variant="default" onClick={onSubmit} disabled={loading}>
						{loading ? "Đang lưu..." : "Lưu"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
