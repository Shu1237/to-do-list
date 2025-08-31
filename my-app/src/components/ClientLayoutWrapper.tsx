"use client";
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { usePathname } from "next/navigation";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Nếu là route auth thì không render header/footer
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/(auth)");
  if (isAuthRoute) {
    return <>{children}</>;
  }
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
