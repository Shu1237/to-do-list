"use client"

import React, { useState } from 'react';
import apiAuth from '@/api/auth';
import { useRouter } from 'next/navigation';
import { tokenSession, userSession } from '@/lib/session';
import { ResponseLogin } from '@/lib/type';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
        if (userSession.value?.role === "admin") {
          route.push("/admin");
        } else {
          route.push("/");
        }
      }

    } catch (err: any) {
      setError(err?.response?.data?.message || 'Đăng nhập thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto bg-card p-8 rounded-xl shadow-lg border border-border space-y-5">
      <h2 className="text-2xl font-bold mb-2 text-center">Đăng nhập</h2>
      {error && <div className="text-destructive text-sm text-center">{error}</div>}
      <div>
        <label className="block mb-1 font-medium">Username</label>
        <Input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Nhập username"
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Password</label>
        <Input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Nhập password"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </Button>
      <div className="flex justify-end mt-1">
        <Link href="/register" className="text-sm text-primary hover:underline">Chưa có tài khoản? Đăng ký</Link>
      </div>
    </form>
  );
}
