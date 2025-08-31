import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import { cookies } from "next/dist/server/request/cookies";
import { AuthProvider } from "@/context/auth-provider";



const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "To do list ",
  description: "A simple to do list application",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider initialToken={token?.value || null}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
          </ThemeProvider>
        </AuthProvider>

      </body>
    </html>
  );
}
