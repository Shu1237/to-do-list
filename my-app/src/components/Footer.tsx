import React from 'react';

export default function Footer() {
  return (
    <footer suppressHydrationWarning={true} className="w-full bg-background py-4">
      <div className="flex justify-between items-center">
        <span className="text-muted-foreground">
          &copy; {new Date().getFullYear()} To Do List. All rights reserved.
        </span>
        <span>
          Liên hệ: <a href="mailto:ttei8191@gmail.com" className="underline hover:text-primary">ttei8191@gmail.com</a>
        </span>
      </div>
    </footer>

  );
}
