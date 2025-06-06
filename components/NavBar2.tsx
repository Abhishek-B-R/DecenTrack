"use client"

import dynamic from "next/dynamic";
import Link from "next/link"
import DarkModeToggle from "@/components/DarkModeToggle"
// import SignInOut from "@/components/SignInOut"
const SignInOut = dynamic(() => import('@/components/SignInOut'), {
  ssr: false,
});
import { ArrowLeft } from "lucide-react"
import { Button } from "./ui/button"
import Image from "next/image"
import Github from "./github.svg"

export default function NavbarInsider() {
  return (
    <header className="sticky top-0 z-40 w-full border-b lg:px-30 bg-background">
        <div className="container flex h-16 items-center justify-between px-2 md:px-20 py-4">
        <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4 cursor-pointer" suppressHydrationWarning/>
            <span className="text-sm font-medium">Back to Home</span>
        </Link>
        <div className="flex gap-4">
            <Link href="/add-new" className="text-sm font-medium hover:text-primary sm:block hidden">
              <Button variant={"outline"} className="cursor-pointer">Add Website</Button>
            </Link>
            <Link href="/websites" className="text-sm font-medium hover:text-primary sm:block hidden">
              <Button variant={"outline"} className="cursor-pointer">Monitor Websites</Button>
            </Link>
            <Button className="cursor-pointer bg-white hover:bg-gray-300" onClick={() => {
                window.open('https://www.github.com/Abhishek-B-R/DecenTrack', '_blank', 'noopener,noreferrer');
              }
            }>
              <Image src={Github} alt="GitHub" width={24} height={24} />
            </Button>
            <DarkModeToggle/>
            <SignInOut/>
        </div>
        </div>
    </header>
  )
};
