"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MdBroadcastOnHome } from "react-icons/md";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GiMonoWheelRobot } from 'react-icons/gi';
import { LucideLayoutDashboard } from 'lucide-react';
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const metadata = {
  title: "IoT Mini Project Group-H",
  description: "Real-time sensor data dashboard",
};

const Header = () => {
  const pathname = usePathname()
  const [isOnline, setIsOnline] = useState(true)
  const { setTheme } = useTheme()

  useEffect(() => {
    setIsOnline(navigator.onLine)
    
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <header className="fixed top-0 z-10 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between gap-2 px-4">
        <h1 className="flex items-center gap-2 text-lg font-bold md:text-2xl">
          <MdBroadcastOnHome className="h-6 w-6 md:h-10 md:w-10" />
          <span className="hidden sm:inline">{metadata.title}</span>
          <span className="sm:hidden">IoT Group-H</span>
        </h1>
        <Tabs value={pathname} className="w-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="/" asChild>
              <Link href="/" className='flex gap-1 items-center'>
                <LucideLayoutDashboard className='h-4 w-4' />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="/temperature-predictor" asChild>
              <Link href="/temperature-predictor" className='flex gap-1 items-center'>
                <GiMonoWheelRobot className='h-4 w-4' />
                <span className="hidden sm:inline">Temperature Prediction</span>
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        
        <div className='flex items-center gap-2'>
          <span className="relative flex size-3">
            {isOnline && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>}
            <span className={`relative inline-flex size-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  )
}

export default Header