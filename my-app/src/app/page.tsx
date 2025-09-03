
import apiTask from "@/api/task";
import TaskBoard from "@/app/_components/TaskBoard";
import { ITask } from "@/lib/type";
import { cookies } from "next/dist/server/request/cookies";
import { Badge } from "@/components/ui/badge";
export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value as string;


  if (!token) {
    return (
      <main className="max-w-5xl mx-auto py-16 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Chào mừng đến với Task Manager</h1>
        <p className="text-muted-foreground mb-6">Vui lòng đăng nhập hoặc đăng ký để quản lý công việc của bạn.</p>
      </main>
    );
  }


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
