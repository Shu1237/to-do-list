import { LoginSchema, RegisterSchema } from "@/schema/authSchema";
import { apiServer } from "./axios";

const apiAuth = {
  login: async (data: LoginSchema) => {
    try {
      const res = await apiServer.post("/api/auth/login", data);
      return res.data;
    } catch (error: any) {
      throw error;
    }
  },

  register: async (data: RegisterSchema) => {
    try {
      const res = await apiServer.post("/api/auth/register", data);
      return res.data as string; 
    } catch (error: any) {
      throw error;
    }
  },
  logout: async () => {
    try {
      const res = await apiServer.post("/api/auth/logout");
      return res.data as string;
    } catch (error: any) {
      throw error;
    }
  }
};

export default apiAuth;