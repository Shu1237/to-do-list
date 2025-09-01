"use client"
import React, { useState } from 'react';
import apiAuth from '@/api/auth';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto bg-card p-8 rounded-xl shadow-lg border border-border space-y-5">
      <h2 className="text-2xl font-bold mb-2 text-center">Đăng ký</h2>
      {error && <div className="text-destructive text-sm text-center">{error}</div>}
      <div>
        <label className="block mb-1 font-medium">Họ và tên</label>
        <Input
          type="text"
          value={fullname}
          onChange={e => setFullname(e.target.value)}
          placeholder="Nhập họ tên"
          required
        />
      </div>
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
      <div>
        <label className="block mb-1 font-medium">Nhập lại Password</label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={e => { setConfirmPassword(e.target.value); setTouched(true); }}
          placeholder="Nhập lại password"
          className={touched && !isMatch ? 'border-destructive' : ''}
          required
        />
        {touched && confirmPassword && !isMatch && (
          <span className="text-destructive text-xs">Mật khẩu không khớp</span>
        )}
        {touched && confirmPassword && isMatch && (
          <span className="text-green-600 text-xs">Mật khẩu khớp</span>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={!isMatch || loading}>
        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
      </Button>
    </form>
  );
}
