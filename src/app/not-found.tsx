import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-7xl font-extrabold text-primary">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
      <p className="text-muted-foreground mt-2 max-w-md">
        Oops! Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển. 
        Vui lòng quay lại trang chủ để tiếp tục.
      </p>
      <Button asChild className="mt-6">
        <a href="/" className="flex items-center gap-2">
          <Home size={18} />
          Quay về trang chủ
        </a>
      </Button>
    </main>
  );
}
