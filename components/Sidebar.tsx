/** @format */
"use client"

import {motion} from "framer-motion"
import Link from "next/link"
import {usePathname} from "next/navigation"

const navItems = [
  {name: "Overview", href: "/"},
  {name: "Transactions", href: "/transactions"},
  {name: "Analytics", href: "/analytics"},
  {name: "Settings", href: "/settings"},
  {name: "Profile", href: "/profile"}
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={{x: -80, opacity: 0}}
      animate={{x: 0, opacity: 1}}
      transition={{duration: 0.5}}
      className='w-64 p-6 sidebar hidden md:block'>
      <h2 className='text-xl font-bold mb-6'>Dashboard</h2>
      <ul className='space-y-3'>
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block p-3 rounded-lg transition-colors ${
                  active
                    ? "bg-cyan-500/20 text-cyan-400 font-semibold"
                    : "hover:text-cyan-400"
                }`}>
                {item.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </motion.aside>
  )
}
