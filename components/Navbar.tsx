"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import DarkModeToggle from "@/components/DarkModeToggle"
import SignInOut from "@/components/SignInOut"
import { Shield } from "lucide-react"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background lg:pl-20 xl:pl-40">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary dark:text-violet-700" />
          <span className="text-xl font-bold">DecenTrack</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/add-new" className="text-sm font-medium hover:text-primary sm:block hidden">
            <Button variant={"outline"}>Add Website</Button>
          </Link>
          <Link href="/websites" className="text-sm font-medium hover:text-primary sm:block hidden">
            <Button variant={"outline"}>Monitor Websites</Button>
          </Link>
          <Link href="/validator" className="text-sm font-medium hover:text-primary sm:block hidden">
          <Button variant={"outline"}>Validate & Earn</Button>
          </Link>
          <DarkModeToggle/>
          <SignInOut/>
        </nav>
      </div>
    </header>
  )
};
