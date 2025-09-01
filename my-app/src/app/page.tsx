import apiTask from "@/api/task";
import TaskBoard from "@/app/_components/TaskBoard";
import { ITask } from "@/lib/type";
import { cookies } from "next/dist/server/request/cookies";

export default async function Home() {
 const cookieStore = await cookies();
 const token = cookieStore.get('token')?.value as string;
  const tasks: ITask[] = await apiTask.home(token);
  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Danh sách công việc</h1>
      <TaskBoard initialTasks={tasks} />
    </main>
  );
}
