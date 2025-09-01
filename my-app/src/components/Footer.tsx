import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-background/80 backdrop-blur-lg border-t border-border py-4 px-4 mt-8 text-center text-sm rounded-t-xl shadow-lg">
      <div className="flex flex-col sm:flex-row items-center justify-between max-w-4xl mx-auto gap-2">
        <span className="text-muted-foreground">&copy; {new Date().getFullYear()} To Do List. All rights reserved.</span>
        <span>
          Liên hệ: <a href="mailto:contact@todolist.com" className="underline hover:text-primary">contact@todolist.com</a>
        </span>
      </div>
    </footer>
  );
}
