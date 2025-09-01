import React from 'react';
import HeaderClinet from './HeaderClinet';

export default function Header() {
  return (
    <header className="w-full bg-blue-600 text-white shadow-md py-3 px-6 flex items-center justify-between">
      {/* Logo bên trái */}
      <div className="flex items-center gap-3">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" /></svg>
        <span className="text-2xl font-bold tracking-tight">To Do List</span>
      </div>     
      {/* <Mode /> */}
      <HeaderClinet />
    </header>
  );
}
