import React from 'react'
import { MdBroadcastOnHome } from "react-icons/md";

export const metadata = {
  title: "IoT Mini Project Group-H",
  description: "Real-time sensor data dashboard",
};

const Header = () => {
  return (
    <header className="fixed top-0 z-10 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center px-4">
        <h1 className="flex items-center gap-2 text-xl font-bold text-emerald-600 dark:text-emerald-500 md:gap-4 md:text-2xl">
          <MdBroadcastOnHome className="h-8 w-8 md:h-10 md:w-10" />
          {metadata.title}
        </h1>
      </nav>
    </header>
  )
}

export default Header