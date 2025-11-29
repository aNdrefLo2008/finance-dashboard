/** @format */
"use client"

import {motion} from "framer-motion"
import QuickAdd from "../components/QuickAdd"
import Radial from "../components/Radial"
import Sparkline from "../components/Sparkline"
import FancyCard from "@/components/FancyCard"
import Balance from "@/components/Balance"
import {useEffect, useState} from "react"

interface Transaction {
  id: string
  amount: number
  desc?: string
  date?: string
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch("/api/transactions", {
          headers: {"Content-Type": "application/json"},
          credentials: "include"
        })
        const data: Transaction[] = await res.json()

        if (!data || data.length === 0) {
          setTransactions([])
          setBalance(0)
        } else {
          setTransactions(data)
          const total = data.reduce((acc, t) => acc - t.amount, 5000)
          setBalance(total)
        }
      } catch (err) {
        console.error(err)
        setTransactions([])
        setBalance(0)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  if (loading) return <p className='p-6'>Loading…</p>

  if (transactions === null)
    return (
      <div className='p-6'>
        <p>Please log in to see your transactions.</p>
      </div>
    )

  // Prepare sparkline data safely
  const sparkData = transactions.map((t, i) => ({
    name: t.desc || `#${i + 1}`,
    value: t.amount,
    _tx: t
  }))

  // Latest 5 transactions
  const recentTx = transactions.slice(0, 5)

  return (
    <div className='flex w-full min-h-screen text-gray-100'>
      <main className='flex-1 p-6 space-y-6'>
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* Balance */}
          <Balance balance={balance ?? 0} />

          {/* Quick Add */}
          <QuickAdd />

          {/* Radial Progress */}
          <Radial value={Math.min(Math.max(balance ?? 0, 0), 100)} />

          {/* Sparkline */}
          <Sparkline data={sparkData} />

          {/* AI Insights card */}
          <FancyCard>
            <h3 className='text-lg font-bold mb-2'>AI Insights</h3>
            <p className='text-gray-300 text-sm'>
              Analyze your spending patterns and receive tips here soon…
            </p>
          </FancyCard>

          {/* Recent Transactions */}
          <FancyCard>
            <h3 className='text-lg font-bold mb-2'>Recent Transactions</h3>
            <ul className='divide-y divide-gray-700'>
              {recentTx.map((t) => (
                <li
                  key={t.id}
                  className='flex justify-between py-2 hover:bg-gray-800 px-2 rounded transition'>
                  <span>{t.desc || "Transaction"}</span>
                  <span
                    className={`${
                      t.amount > 0 ? "text-red-400" : "text-green-400"
                    }`}>
                    ${t.amount.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </FancyCard>
        </motion.div>

        {/* Floating Add Button */}
        <motion.button
          className='fixed bottom-8 right-8 bg-cyan-500 text-white px-6 py-3 rounded-full shadow-lg'
          whileHover={{scale: 1.1, boxShadow: "0 0 20px rgba(6,182,212,0.8)"}}
          whileTap={{scale: 0.9, rotate: 15}}
          transition={{type: "spring", stiffness: 400, damping: 10}}>
          +
        </motion.button>
      </main>
    </div>
  )
}
