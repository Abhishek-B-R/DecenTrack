// app/not-found.tsx
'use client';

import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <Navbar/>
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 pt-0">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-lg mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Button asChild suppressHydrationWarning>
          <Link href="/">
            Go back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
