/** @format */

"use client"

import "./globals.css"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"

import {SessionProvider} from "next-auth/react"

/*export const metadata = {
  title: "AI Finance Dashboard",
  description: "Next.js SaaS-like Dashboard"
}*/

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className='antialiased flex w-full'>
        <SessionProvider>
          {/* Sidebar fixed on the left */}
          <Sidebar />
          <main className='flex-1 p-6 space-y-6'>
            {/* Global Header (appears on all pages) */}
            <div className='sm:mb-0 mb-14'>
              <Header />
            </div>
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  )
}
