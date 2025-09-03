"use client"

import React, { useState } from 'react';
import apiAuth from '@/api/auth';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { registerSchema } from '@/schema/authSchema';
import { FormErrorHandler } from '@/lib/FormErrorHandler';
import { toast } from 'sonner';

export default function RegisterInput() {

  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const isMatch = password === confirmPassword;
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError(null);

    const result = registerSchema.safeParse({
      fullname,
      username,
      password,
      confirmPassword,
      role: 'user',
    });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (typeof err.path[0] === 'string' || typeof err.path[0] === 'number') {
          errors[err.path[0] as string | number] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }
    setLoading(true);
    try {
      await apiAuth.register({
        fullname,
        username,
        password,
        confirmPassword,
        role: 'user',
      });
      toast.success('Đăng ký thành công!');
      router.push('/login');
    } catch (err: any) {
      const handler = new FormErrorHandler(err?.response || {});
      if (handler.hasErrors()) {
        setFieldErrors(handler.fieldErrors);
        if (handler.generalError) {
          setGeneralError(handler.generalError);
          toast.error(handler.generalError);
        }
      } else {
        setGeneralError('Đăng ký thất bại!');
        toast.error(err?.response?.data?.message || 'Đăng ký thất bại!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto bg-card p-8 rounded-xl shadow-lg border border-border space-y-5">
      <h2 className="text-2xl font-bold mb-2 text-center">Đăng ký</h2>
      {generalError && <div className="text-destructive text-sm text-center">{generalError}</div>}
      <div>
        <label className="block mb-1 font-medium">Họ và tên</label>
        <Input
          type="text"
          value={fullname}
          onChange={e => setFullname(e.target.value)}
          placeholder="Nhập họ tên"
          required
        />
        {fieldErrors.fullname && <span className="text-destructive text-xs">{fieldErrors.fullname}</span>}
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
        {fieldErrors.username && <span className="text-destructive text-xs">{fieldErrors.username}</span>}
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
        {fieldErrors.password && <span className="text-destructive text-xs">{fieldErrors.password}</span>}
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
        {fieldErrors.confirmPassword && <span className="text-destructive text-xs">{fieldErrors.confirmPassword}</span>}
        {touched && confirmPassword && !isMatch && !fieldErrors.confirmPassword && (
          <span className="text-destructive text-xs">Mật khẩu không khớp</span>
        )}
        {touched && confirmPassword && isMatch && !fieldErrors.confirmPassword && (
          <span className="text-green-600 text-xs">Mật khẩu khớp</span>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
      </Button>
    </form>
  );
}
