/** @format */
"use client"

import {motion, AnimatePresence} from "framer-motion"
import {useEffect, useState} from "react"
import {signIn, signOut, useSession} from "next-auth/react"

export default function Header() {
  const {data: session, status} = useSession()
  const [balance, setBalance] = useState<number>(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const loading = status === "loading"

  useEffect(() => {
    // only fetch when session exists (signed in)
    if (!session?.user) {
      setBalance(0)
      return
    }

    fetch("/api/transactions")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch")
        return res.json()
      })
      .then((data) => {
        const total = data.reduce((acc: number, t: any) => acc - t.amount, 5000)
        setBalance(total)
      })
      .catch((err) => {
        console.error("Transactions fetch error:", err)
        setBalance(0)
      })
  }, [session?.user?.id])

  const links = [
    {name: "Dashboard", href: "/"},
    {name: "Transactions", href: "/transactions"},
    {name: "Settings", href: "/settings"},
    {name: "Profile", href: "/profile"}
  ]

  const transition = {type: "spring" as const, stiffness: 260, damping: 20}

  // helper: initials fallback
  const initials = (name?: string | null) => {
    if (!name) return "U"
    const parts = name.trim().split(" ")
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  return (
    <>
      {/* Header */}
      <header className='fixed top-0 left-0 right-0 z-50 backdrop-blur bg-black/10 border-b border-gray-700 px-6 py-4 flex justify-between items-center md:static md:backdrop-blur-0 md:bg-transparent md:border-0'>
        <div className='flex items-center gap-2'>
          {/* Hamburger */}
          <button
            className='md:hidden p-2 rounded-xl hover:bg-white/10 transition'
            onClick={() => setSidebarOpen(!sidebarOpen)}>
            <motion.svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'>
              {/* Top bar */}
              <motion.line
                x1='3'
                y1='6'
                x2='21'
                y2='6'
                animate={{
                  rotate: sidebarOpen ? 45 : 0,
                  translateY: sidebarOpen ? 6 : 0
                }}
                origin='center'
                transition={transition}
              />
              {/* Middle bar */}
              <motion.line
                x1='3'
                y1='12'
                x2='21'
                y2='12'
                animate={{opacity: sidebarOpen ? 0 : 1}}
                transition={{duration: 0.2}}
              />
              {/* Bottom bar */}
              <motion.line
                x1='3'
                y1='18'
                x2='21'
                y2='18'
                animate={{
                  rotate: sidebarOpen ? -45 : 0,
                  translateY: sidebarOpen ? -6 : 0
                }}
                origin='center'
                transition={transition}
              />
            </motion.svg>
          </button>

          <motion.h1
            initial={{y: 12, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            transition={{type: "spring", stiffness: 120}}
            className='text-2xl font-bold flex gap-2'>
            <span className='sm:block hidden'>AI Finance •</span> Dashboard
          </motion.h1>
        </div>

        <div className='flex items-center gap-6'>
          <div className='text-right'>
            <div className='text-xs opacity-70'>Balance (EUR)</div>
            <div className='text-lg font-semibold'>
              {balance.toLocaleString()}
            </div>
          </div>

          {/* User area */}
          <div className='flex items-center gap-3'>
            {/* Sign in/out */}
            {loading ? (
              <div className='text-sm opacity-60'>Loading...</div>
            ) : session?.user ? (
              <>
                <div className='hidden sm:flex flex-col text-left leading-tight'>
                  <span className='text-sm'>
                    {session.user.name ?? session.user.email}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className='text-xs opacity-70 hover:opacity-100 transition'>
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className='hidden sm:flex items-center gap-3'>
                <button
                  onClick={() => signIn("google")}
                  className='p-3 rounded-xl bg-cyan-500 text-white text-sm shadow'>
                  Sign in with Google
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className='fixed inset-0 z-40 md:hidden flex'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}>
            {/* Sidebar background */}
            <div
              className='absolute inset-0 bg-black/50 backdrop-blur'
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar panel */}
            <motion.div
              className='relative w-64 bg-gray-900 p-6 flex flex-col gap-4'
              initial={{x: "-100%"}}
              animate={{x: 0}}
              exit={{x: "-100%"}}
              transition={{type: "tween"}}>
              {/* Close button (same hamburger morphing) */}
              <button
                className='self-end mb-4 p-2 rounded hover:bg-white/10 transition'
                onClick={() => setSidebarOpen(false)}>
                <motion.svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'>
                  <motion.line
                    x1='3'
                    y1='6'
                    x2='21'
                    y2='6'
                    animate={{rotate: 45, translateY: 6}}
                    origin='center'
                    transition={transition}
                  />
                  <motion.line
                    x1='3'
                    y1='12'
                    x2='21'
                    y2='12'
                    animate={{opacity: 0}}
                    transition={{duration: 0.2}}
                  />
                  <motion.line
                    x1='3'
                    y1='18'
                    x2='21'
                    y2='18'
                    animate={{rotate: -45, translateY: -6}}
                    origin='center'
                    transition={transition}
                  />
                </motion.svg>
              </button>

              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className='text-white hover:text-cyan-400 p-2 rounded transition'
                  onClick={() => setSidebarOpen(false)}>
                  {link.name}
                </a>
              ))}

              {/* If signed out, show sign in in sidebar too */}
              {!session?.user && (
                <button
                  onClick={() => signIn("google")}
                  className='mt-4 p-2 rounded-xl bg-cyan-500 text-white'>
                  Sign in with Google
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
