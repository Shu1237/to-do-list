
import apiTask from "@/api/task";
import TaskBoard from "@/app/_components/TaskBoard";
import { ITask } from "@/lib/type";
import { cookies } from "next/dist/server/request/cookies";
import { Badge } from "@/components/ui/badge";


export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value as string;
  const tasks: ITask[] = await apiTask.home(token);
  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Danh sách công việc</h1>
        <Badge variant="outline" className="text-base px-3 py-1 rounded-full bg-primary/10 text-primary border-primary/30">
          {tasks.length} công việc
        </Badge>
      </div>
      <div className="mb-8">
        <TaskBoard initialTasks={tasks} />
      </div>
    </main>
  );
}
