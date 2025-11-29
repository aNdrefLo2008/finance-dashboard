/** @format */
"use client"

import {useEffect, useState} from "react"
import FancyCard from "./FancyCard"

interface Transaction {
  id: string
  desc: string
  amount: number
}

export default function Balance({balance}: {balance: number}) {
  const [topExpenses, setTopExpenses] = useState<Transaction[]>([])

  useEffect(() => {
    async function fetchTransactions() {
      const res = await fetch("/api/transactions", {
        headers: {
          // Send credentials so cookies are included
          "Content-Type": "application/json"
        },
        credentials: "include" // important for next-auth session cookies
      })
      const data: Transaction[] = await res.json()
      const top3 = data.sort((a, b) => b.amount - a.amount).slice(0, 3)
      setTopExpenses(top3)
    }
    fetchTransactions()
  }, [])

  return (
    <FancyCard>
      <h3 className='font-semibold mb-2'>Balance</h3>
      <p className='text-2xl font-bold mb-4'>{balance.toFixed(2)} €</p>

      {topExpenses.length > 0 && (
        <div className='space-y-2'>
          <h4 className='text-sm font-medium opacity-70'>Top 3 Expenses</h4>
          {topExpenses.map((t) => (
            <div
              key={t.desc}
              className='flex justify-between mx-2 text-sm font-semibold'>
              <span>{t.desc}</span>
              <span>- {t.amount.toFixed(2)} €</span>
            </div>
          ))}
        </div>
      )}
    </FancyCard>
  )
}
