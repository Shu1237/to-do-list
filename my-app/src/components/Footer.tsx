import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-blue-50 text-blue-900 border-t py-4 px-6 mt-8 text-center text-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between max-w-4xl mx-auto gap-2">
        <span>&copy; {new Date().getFullYear()} To Do List. All rights reserved.</span>
        <span>
          Liên hệ: <a href="mailto:contact@todolist.com" className="underline hover:text-blue-600">contact@todolist.com</a>
        </span>
      </div>
    </footer>
  );
}
