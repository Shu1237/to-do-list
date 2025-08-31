
import { RegisterSchema } from "@/Schema/authSchema";
import { NextResponse } from "next/server";
import { apiClient } from "@/api/axios";

export async function POST(request: Request) {
    try {
        const body: RegisterSchema = await request.json();
        const { confirmPassword, ...data } = body;
        const res = await apiClient.post("/register", data);
        return NextResponse.json({ message: "Registration successful", user: res.data });

    } catch (error: any) {
        console.error('Registration error:', error?.response?.data || error?.message || error);

        return NextResponse.json(
            { message: error?.response?.data?.message || "Registration failed" },
            { status: error?.response?.status || 500 }
        );
    }
}

