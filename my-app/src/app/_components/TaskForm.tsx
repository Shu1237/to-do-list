"use client";
import React, { useState } from "react";
import { CreateTaskDto } from "@/schema/taskSchema";


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
      className="mb-6 bg-white p-4 rounded shadow flex flex-col gap-3"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Tiêu đề"
        className="border px-3 py-2 rounded"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Mô tả"
        className="border px-3 py-2 rounded"
      />
      <div className="flex gap-2">
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border px-3 py-2 rounded w-1/2"
        />
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border px-3 py-2 rounded w-1/2"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Thêm công việc
      </button>
    </form>
  );
}
