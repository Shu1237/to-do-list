

import React from 'react';
import RegisterInput from './RegisterInput';

export const metadata = {
  title: 'Đăng ký | To Do List',
  description: 'Tạo tài khoản mới để quản lý công việc của bạn.',
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md">
        <RegisterInput />
      </div>
    </main>
  );
}
