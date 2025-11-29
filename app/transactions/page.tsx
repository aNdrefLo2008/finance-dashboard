/** @format */
"use client"

import {useEffect, useState} from "react"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data))
  }, [])

  return (
    <div className='flex w-full'>
      <main className='flex-1 p-6 space-y-6'>
        <div className='card p-6'>
          <h2 className='text-xl font-bold mb-4'>Transactions</h2>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='border-b border-white/20'>
                <th className='py-2'>Date</th>
                <th className='py-2'>Description</th>
                <th className='py-2'>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr
                  key={i}
                  className='border-b border-white/10 hover:bg-white/5'>
                  <td className='py-2'>
                    {new Date(t.date).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric"
                    })}
                  </td>
                  <td>{t.desc}</td>
                  <td className='text-cyan-400 font-semibold'>${t.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
