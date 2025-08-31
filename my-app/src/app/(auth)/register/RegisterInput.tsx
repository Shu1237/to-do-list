"use client"
import React, { useState } from 'react';
import apiAuth from '@/api/auth';
import { useRouter } from 'next/navigation';

export default function RegisterInput() {
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMatch = password === confirmPassword;
  const route = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setError(null);
    if (!isMatch) return;
    setLoading(true);
    try {
      await apiAuth.register({
        fullname,
        username,
        password,
        confirmPassword,
        role: 'user'
      });
      route.push('/login');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow space-y-4">
      <h2 className="text-xl font-bold mb-2 text-center">Đăng ký</h2>
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      <div>
        <label className="block mb-1 font-medium">Họ và tên</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 focus:outline-blue-500"
          value={fullname}
          onChange={e => setFullname(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Username</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 focus:outline-blue-500"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Password</label>
        <input
          type="password"
          className="w-full border rounded px-3 py-2 focus:outline-blue-500"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Nhập lại Password</label>
        <input
          type="password"
          className={`w-full border rounded px-3 py-2 focus:outline-blue-500 ${touched && !isMatch ? 'border-red-500' : ''}`}
          value={confirmPassword}
          onChange={e => { setConfirmPassword(e.target.value); setTouched(true); }}
          required
        />
        {touched && confirmPassword && !isMatch && (
          <span className="text-red-500 text-xs">Mật khẩu không khớp</span>
        )}
        {touched && confirmPassword && isMatch && (
          <span className="text-green-600 text-xs">Mật khẩu khớp</span>
        )}
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 cursor-pointer rounded hover:bg-blue-700 transition"
        disabled={!isMatch || loading}
      >
        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
      </button>
    </form>
  );
}
