"use client"
import React from 'react'
import { Button } from './ui/button'
import apiAuth from '@/api/auth';
import { useRouter } from 'next/navigation';
import { userSession } from '@/lib/session';

export default function HeaderClinet() {
  const route = useRouter();
  const handleLogout = async () => {
    try {
      await apiAuth.logout();
      route.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
 
      <Button onClick={handleLogout} className='cursor-pointer'>
        Logout
      </Button>
   
  )
}
