import { apiClient } from "@/api/axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token?.value) {
        return NextResponse.json({ message: "No token found" }, { status: 401 });
    }

    try {
        // call backend API to logout
        await apiClient.post("/logout", { token: token.value });

        // delete cookie
        const res = NextResponse.json({ message: "Logged out successfully" });
        res.cookies.set("token", "", { maxAge: 0, path: "/" }); 
        return res;
    } catch (error: any) {
        return NextResponse.json(
            { message: "Logout failed", error: error.message },
            { status: 500 }
        );
    }
}
