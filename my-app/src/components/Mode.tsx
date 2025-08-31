"use client"
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import React from 'react'

export default function Mode() {
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark';
    const route = useRouter();
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur py-2 supports-[backdrop-filter]:bg-background/60 ">
            <div onClick={() => route.push('/')}
                className=" container mx-auto flex h-16 items-center justify-between px-4">
                <div className="w-12 h-12 cursor-pointer">
                    {/* <img src={isDark ? '/p15.jpg' : '/p6.webp'} alt="Shu" className="-w-full rounded-full" /> */}
                </div>

                <div className="flex gap-2 items-center">
                    <div onClick={() => setTheme(isDark ? 'light' : 'dark')}
                        className={`flex item-center cursor-pointer transition-transform duration-500
                    ${isDark ? 'rotate-180' : 'rotate-0'}`}
                    >
                        {isDark ?
                            <Sun className="w-full text-yellow-500 rotate-0 transition-all" /> :
                            <Moon className="w-full text-blue-500 rotate-0 transition-all" />}
                    </div>
                </div>

            </div>

        </header >
    )
}
