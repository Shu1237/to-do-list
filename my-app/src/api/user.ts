
import { IUser } from "@/lib/type";
import { apiClient } from "./axios";
const apiUser = {

    getAll: async (token: string) => {
        try {
            const res = await apiClient.get('users', {
                headers: {
                    Cookie: `token=${token}`
                }
            })
            return res.data
        } catch (error) {
            throw error
        }
    },
    update: async (id: string, data: { fullname: string }) => {
        try {
            const res = await apiClient.put(`users/${id}`, data);
            return res.data;
        } catch (error) {
            throw error;
        }
    },
    delete: async (id: string) => {
        try {
            const res = await apiClient.delete(`users/${id}`);
            return res.data;
        } catch (error) {
            throw error;
        }
    }
}
export default apiUser;