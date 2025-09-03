

import React from 'react';
import LoginInput from './loginInput';

export const metadata = {
  title: 'Đăng nhập | To Do List',
  description: 'Đăng nhập vào hệ thống quản lý công việc của bạn.',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md">
        <LoginInput />
      </div>
    </main>
  );
}
