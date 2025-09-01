"use client";

import React, { useState } from "react";
import { CreateTaskDto } from "@/schema/taskSchema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";


type Props = {
  onAdd: (task: CreateTaskDto) => void;
};

export default function TaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title) return;

    onAdd({
      title,
      description,
      startDate: startDate ? new Date(startDate).toISOString() : "",
      dueDate: dueDate ? new Date(dueDate).toISOString() : "",
      assignedTo: [],
    });
      setTitle("");
      setDescription("");
      setStartDate("");
      setDueDate("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 bg-card p-6 rounded-xl shadow-lg flex flex-col gap-4 border border-border"
    >
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Tiêu đề"
        required
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Mô tả"
      />
      <div className="flex gap-2">
        <Input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-1/2"
        />
        <Input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-1/2"
        />
      </div>
      <Button type="submit" className="w-full self-end px-6">
        Thêm công việc
      </Button>
    </form>
  );
}
