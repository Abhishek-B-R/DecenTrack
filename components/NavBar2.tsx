"use client"

import Link from "next/link"
import DarkModeToggle from "@/components/DarkModeToggle"
import SignInOut from "@/components/SignInOut"
import { ArrowLeft } from "lucide-react"

export default function NavbarInsider() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-20 py-4">
        <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Home</span>
        </Link>
        <div className="flex">
            <DarkModeToggle/>
            <SignInOut/>
        </div>
        </div>
    </header>
  )
};
