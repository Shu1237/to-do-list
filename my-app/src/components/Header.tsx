
"use client";

import React, { useContext } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { Sun, Moon, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import apiAuth from "@/api/auth";
import Link from "next/link";
import { tokenSession, userSession } from "@/lib/session";
import { Button } from "./ui/button";
import { useAppContext } from "@/context/auth-provider";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const { logout } = useAppContext();

  const handleLogout = async () => {
    try {
      await apiAuth.logout();
      router.push("/login");
      logout();

    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <header className="w-full sticky top-0 z-50 bg-background/80 backdrop-blur-lg shadow-lg py-4 px-4 flex items-center justify-between rounded-b-xl border-b border-border">
      {/* Logo */}
      <Link href={`${userSession.value?.role === "admin" ? "/admin" : "/"}`}>
        <div className="flex items-center gap-3">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" />
          </svg>
          <span className="text-2xl font-bold tracking-tight text-primary">To Do List</span>
        </div>
      </Link>

      {/* Avatar + Dropdown */}
      {
        tokenSession.value && userSession.value ? (
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="https://scontent.fsgn21-1.fna.fbcdn.net/v/t1.6435-9/139255782_102607631831947_7407807722722624817_n.jpg?_nc_cat=102&cb=99be929b-7bdcbe47&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=N6x4QGxFXSAQ7kNvwEC51Wy&_nc_oc=AdlzqTCzQKi3rU6E0yRN4Gbt_C6q15upfHB5g9Aj9S7e9mx0IbrSJMrUFoBcFVLekDOMt_JI7mVoe-s0OZm_wXHH&_nc_zt=23&_nc_ht=scontent.fsgn21-1.fna&_nc_gid=d3zDYXJ_26KhDcQf4LWllg&oh=00_AfXDfx2jDdMsy-YjMlKhJRcwLv-qHOaVPQozzK83c61R_w&oe=68DCFEB1" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[180px]">
                <DropdownMenuItem onClick={toggleTheme} className="flex items-center gap-2 cursor-pointer">
                  {isDark ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-blue-500" />}
                  <span>{isDark ? "Chuyển sang sáng" : "Chuyển sang tối"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
                  <LogOut className="w-4 h-4 text-destructive" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex justify-center gap-4 mt-4">
            <Link href="/login" passHref>
              <Button variant="outline" size="sm">
                Đăng nhập
              </Button>
            </Link>
            <Link href="/register" passHref>
              <Button variant="default" size="sm">
                Đăng ký
              </Button>
            </Link>
          </div>

        )

      }
    </header>
  );
}
