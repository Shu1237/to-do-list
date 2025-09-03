"use client";
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { usePathname } from "next/navigation";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
 
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/(auth)");
  if (isAuthRoute) {
    return <>{children}</>;
  }
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
     {
       ! pathname.startsWith("/admin") && <Footer />
     }
    </>
  );
}
