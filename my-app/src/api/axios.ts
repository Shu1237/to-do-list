import envconfig from "@/config";
import axios from "axios";

const apiClient = axios.create({
    baseURL: envconfig.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
     withCredentials: true
});

const apiServer = axios.create({
    baseURL: envconfig.NEXT_PUBLIC_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

export { apiClient, apiServer };
