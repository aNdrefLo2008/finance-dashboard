/** @format */
"use client"

import {useSession, signIn} from "next-auth/react"
import {useState} from "react"

export default function QuickAdd() {
  const [desc, setDesc] = useState("")
  const [amount, setAmount] = useState("")

  const {data: session, status} = useSession()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!desc || !amount) return

    if (status !== "authenticated") {
      signIn()
      return
    }

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({
          desc,
          amount: parseFloat(amount),
          date: new Date().toISOString()
        })
      })

      if (res.status === 401) {
        signIn()
        return
      }

      const data = await res.json()
      console.log("Transaction added:", data)

      // reset form
      setDesc("")
      setAmount("")
    } catch (err) {
      console.error("Failed to add transaction", err)
    }
  }

  return (
    <form onSubmit={submit} className='card p-4 space-y-3'>
      <h3 className='font-semibold'>Quick Add</h3>
      <input
        className='w-full rounded-xl p-3 bg-black/30 border border-white/20'
        placeholder='Description'
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <input
        type='number'
        step='0.01'
        className='w-full rounded-xl p-3 bg-black/30 border border-white/20'
        placeholder='Amount'
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        type='submit'
        className='w-full bg-cyan-500 py-3 rounded-xl text-white hover:bg-cyan-600'>
        Add
      </button>
    </form>
  )
}
