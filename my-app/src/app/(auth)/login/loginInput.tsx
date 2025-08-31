"use client"
import React, { useState } from 'react';

import apiAuth from '@/api/auth';
import { useRouter } from 'next/navigation';
import { tokenSession, userSession } from '@/lib/session';
import { ResponseLogin } from '@/lib/type';

export default function LoginInput() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const route = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res: ResponseLogin = await apiAuth.login({ username, password });
      if (res) {
        tokenSession.value = res.token;
        userSession.setFromToken(res.token);
        route.push('/');
      }

    } catch (err: any) {
      setError(err?.response?.data?.message || 'Đăng nhập thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow space-y-4">
      <h2 className="text-xl font-bold mb-2 text-center">Đăng nhập</h2>
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
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
      <button type="submit" className="w-full bg-blue-600 text-white cursor-pointer py-2 rounded hover:bg-blue-700 transition" disabled={loading}>
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
    </form>
  );
}
