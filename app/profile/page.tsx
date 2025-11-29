/** @format */
"use client"

import React, {useState, useEffect} from "react"
import {useSession, signOut, signIn} from "next-auth/react"

export default function ProfilePage() {
  const {data: session, status} = useSession()
  const [balance, setBalance] = useState(0)
  const [totalTransactions, setTotalTransactions] = useState(0)
  const loading = status === "loading"

  // Load transactions only for the current user
  useEffect(() => {
    if (!session?.user?.email) return

    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data) => {
        setTotalTransactions(data.length)
        const total = data.reduce((acc: number, t: any) => acc - t.amount, 5000)
        setBalance(total)
      })
      .catch(() => setBalance(0))
  }, [session?.user?.email])

  // Helper for initials
  const initials = (name?: string | null) => {
    if (!name) return "U"
    const parts = name.trim().split(" ")
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  if (loading) return <div className='p-6 pt-28'>Loading...</div>

  if (!session?.user)
    return (
      <div className='p-6 pt-28 text-center'>
        <p className='mb-4'>You are not signed in.</p>
        <button
          onClick={() => signIn("google")}
          className='px-4 py-2 bg-cyan-500 text-white rounded-xl'>
          Sign in with Google
        </button>
      </div>
    )

  const user = session.user

  return (
    <main className='p-6 pt-28 md:pt-20'>
      <div className='max-w-3xl mx-auto bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col gap-6'>
        {/* Profile Header */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:gap-6'>
          <div
            className='relative w-28 h-28 rounded-full bg-black/30 flex items-center justify-center text-2xl font-bold text-white
                shadow-[inset_0_0_10px_rgba(255,255,255,0.3)]'>
            {initials(user.name)}
          </div>
          <div className='flex-1 mt-4 sm:mt-0'>
            <h1 className='text-2xl font-bold'>{user.name}</h1>
            <p className='text-sm opacity-70'>{user.email}</p>
            <p className='mt-2 text-lg font-semibold'>
              Balance: €{balance.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className='flex gap-4'>
          <button className='px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-xl transition font-semibold'>
            Edit Profile
          </button>
          <button
            onClick={() => signOut()}
            className='px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl transition font-semibold'>
            Sign Out
          </button>
        </div>

        {/* Profile Details */}
        <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='p-4 bg-gray-800 rounded-xl'>
            <h2 className='font-semibold mb-2'>Account Type</h2>
            <p>Standard User</p>
          </div>
          <div className='p-4 bg-gray-800 rounded-xl'>
            <h2 className='font-semibold mb-2'>Joined</h2>
            <p>January 2024</p>
          </div>
          <div className='p-4 bg-gray-800 rounded-xl'>
            <h2 className='font-semibold mb-2'>Transactions</h2>
            <p>{totalTransactions}</p>
          </div>
          <div className='p-4 bg-gray-800 rounded-xl'>
            <h2 className='font-semibold mb-2'>Settings</h2>
            <p>Notifications, Privacy</p>
          </div>
        </div>
      </div>
    </main>
  )
}
