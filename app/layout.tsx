import { type Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import MonitorWrapper from '@/components/MonitorWrapper'
import { logoUrl } from './utils'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'DecenTrack',
  description: 'Decentralised Website Uptime Monitoring',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <MonitorWrapper>
      <html lang="en" className='dark' suppressHydrationWarning>
        <head>
          <link rel='icon' href={logoUrl}></link>
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-screen`}>
          {children}
        </body>
      </html>
      </MonitorWrapper>
    </ClerkProvider>
  )
}