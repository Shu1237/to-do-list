import { LoginSchema } from "@/Schema/authSchema";
import { NextResponse } from "next/server";
import { apiClient } from "@/api/axios";
import { tokenSession, userSession } from "@/lib/session";
import jwt from 'jsonwebtoken'
import { User } from "@/lib/type";
export async function POST(request: Request) {
    try {
        const body: LoginSchema = await request.json();

        const res = await apiClient.post("/login", body);
        const data = res.data;
        if (!data?.token) {
            return NextResponse.json({ error: "Login failed" }, { status: 400 });
        }

        const response = NextResponse.json({
            msg: "Login success",
            token: data.token,
        });

        response.cookies.set("token", data.token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

       

        return response;
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.response?.data?.message || error.message },
            { status: error?.response?.status || 500 }
        );
    }
}

