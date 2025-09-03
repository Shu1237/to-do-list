import { ITask, Task } from "@/lib/type";
import { apiClient } from "./axios"
import { CreateTaskDto } from "@/schema/taskSchema";





const apiTask = {
    home: async (token: string) => {
        try {
            const res = await apiClient.get("/home", {
                headers: {
                    Cookie: `token=${token}`,
                }
            });
            return res.data as ITask[];
        } catch (error) {
            throw error;
        }
    },
    getAllTask: async (token: string) => {
        try {
            const res = await apiClient.get("/tasks", {
                headers: {
                    Cookie: `token=${token}`,
                }
            });
            return res.data as ITask[];
        } catch (error) {
            throw error;
        }
    },
    add: async (task: CreateTaskDto) => {
        try {
            const res = await apiClient.post("/tasks", task);
            return res.data as { msg: string; tasks: ITask[] };
        } catch (error :any) {
              throw error;
        }
    },

    update: async (id: string, task: Task) => {
        try {
            const res = await apiClient.put(`/tasks/${id}`, task);
            return res.data as { msg: string, task: ITask };
        } catch (error) {
            throw error;
        }
    },
    updateStatusDone: async (id: string) => {
        try {
            const res = await apiClient.patch(`/tasks/${id}/update-status`);
            return res.data as { msg: string, task: ITask };
        } catch (error) {
            throw error;
        }
    },
    updateStatusCancel: async (id: string) => {
        try {
            const res = await apiClient.patch(`/tasks/${id}/soft-delete`);
            return res.data as { msg: string };
        } catch (error) {
            throw error;
        }
    },
    restore: async (id: string) => {
        try {
            const res = await apiClient.patch(`/tasks/${id}/restore`);
            return res.data as { msg: string, task: ITask };
        } catch (error) {
            throw error;
        }
    },
    delete: async (id: string) => {
        try {
            const res = await apiClient.delete(`/tasks/${id}`);
            return res.data as { msg: string };
        } catch (error) {

        }
    },

}
export default apiTask