// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { User } from "./lib/type";


export async function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();

    // Lấy token từ cookie
    const coookieStore = await cookies();
    const token = coookieStore.get("token")?.value;
    // Nếu chưa login
    if (!token) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // Giải mã token
    let payload: User;
    try {
        payload = jwtDecode<User>(token);
    } catch (err) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // Nếu không phải admin, chặn access các route admin
    if (req.nextUrl.pathname.startsWith("/admin") && payload.role !== "admin") {
        url.pathname = "/not-access";
        return NextResponse.redirect(url);
    }

    // Cho phép tiếp tục
    return NextResponse.next();
}

// Chỉ áp dụng middleware cho route admin
export const config = {
    matcher: ["/admin/:path*"],
};
