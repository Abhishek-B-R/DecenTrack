"use client"

import dynamic from 'next/dynamic';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import DarkModeToggle from "@/components/DarkModeToggle"
// import SignInOut from "@/components/SignInOut"
const SignInOut = dynamic(() => import('@/components/SignInOut'), {
  ssr: false,
});
import { Shield } from "lucide-react"
import Github from "./github.svg"
import Image from "next/image"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background lg:pl-20 xl:pl-40">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary dark:text-violet-700" />
          <Link href="/" className="text-xl font-bold cursor-pointer">
            DecenTrack
          </Link>
        </div>
        <nav className="flex items-center gap-2 md:gap-4">
          <Link href="/add-new" className="text-sm font-medium hover:text-primary sm:block hidden">
            <Button variant={"outline"} className="cursor-pointer">Add Website</Button>
          </Link>
          <Link href="/websites" className="text-sm font-medium hover:text-primary sm:block hidden">
            <Button variant={"outline"} className="cursor-pointer">Monitor Websites</Button>
          </Link>
          <Link href="/validator" className="text-sm font-medium hover:text-primary sm:block hidden">
          <Button variant={"outline"} className="cursor-pointer">Validate & Earn</Button>
          </Link>
          <Button className="cursor-pointer bg-white hover:bg-gray-300" onClick={() => {
              window.open('https://www.github.com/Abhishek-B-R/DecenTrack', '_blank', 'noopener,noreferrer');
            }
          }>
            <Image src={Github} alt="GitHub" width={24} height={24} />
          </Button>
          <DarkModeToggle/>
          <SignInOut/>
        </nav>
      </div>
    </header>
  )
};
