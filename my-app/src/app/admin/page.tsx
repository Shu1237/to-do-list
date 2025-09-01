import apiTask from "@/api/task";
import apiUser from "@/api/user";
import { cookies } from "next/headers";
import UserTable from "./_components/UserTable";
import TaskTable from "./_components/TaskTable";
import AdminSectionSwitcher from "./_components/AdminSectionSwitcher";


export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value as string;

  const [tasks, users] = await Promise.all([
    apiTask.getAllTask(token),
    apiUser.getAll(token)
  ]);

  return (
    <main className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Trang Admin</h1>

      <AdminSectionSwitcher
        sections={[
          { label: "Người dùng", content: <UserTable initialUsers={users} /> },
          { label: "Công việc", content: <TaskTable initialTasks={tasks} users={users} /> },
        ]}
      />
    </main>
  );
}
