"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MdBroadcastOnHome } from "react-icons/md";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GiMonoWheelRobot } from 'react-icons/gi';
import { LucideLayoutDashboard } from 'lucide-react';

export const metadata = {
  title: "IoT Mini Project Group-H",
  description: "Real-time sensor data dashboard",
};

const Header = () => {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 z-10 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex flex-col gap-2 px-4 py-2 md:h-16 md:flex-row md:items-center md:justify-between md:py-0">
        <h1 className="flex items-center gap-2 text-lg font-bold text-emerald-600 dark:text-emerald-500 md:text-2xl">
          <MdBroadcastOnHome className="h-6 w-6 md:h-10 md:w-10" />
          <span className="hidden sm:inline">{metadata.title}</span>
          <span className="sm:hidden">IoT Group-H</span>
        </h1>
        <Tabs value={pathname} className="w-full md:w-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="/" asChild>
              <Link href="/" className='flex gap-1 items-center'>
                <LucideLayoutDashboard className='h-4 w-4' />
                Dashboard
              </Link>
            </TabsTrigger>
            <TabsTrigger value="/temperature-predictor" asChild>
              <Link href="/temperature-predictor" className='flex gap-1 items-center'>
                <GiMonoWheelRobot className='h-4 w-4' />
                Temperature Prediction
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </nav>
    </header>
  )
}

export default Header