/** @format */
"use client"

import {useState} from "react"

export default function SettingsPage() {
  const [aiMode, setAiMode] = useState("helpful")
  const [notifications, setNotifications] = useState(true)
  const [widgets, setWidgets] = useState({
    balance: true,
    sparkline: true,
    radial: false
  })

  return (
    <div className='flex w-full'>
      <main className='flex-1 p-6 space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* AI Settings */}
          <div className='card p-6 relative overflow-hidden'>
            <h2 className='text-xl font-bold mb-4'>AI Assistant</h2>
            <p className='text-sm opacity-70 mb-3'>
              Choose how the assistant responds to you:
            </p>
            <select
              value={aiMode}
              onChange={(e) => setAiMode(e.target.value)}
              className='bg-black/90 border border-white/20 rounded-lg p-2 w-full'>
              <option value='helpful'>Helpful 🤝</option>
              <option value='formal'>Formal 📑</option>
              <option value='fun'>Fun 🎉</option>
            </select>
          </div>

          {/* Notifications */}
          <div className='card p-6'>
            <h2 className='text-xl font-bold mb-4'>Notifications</h2>
            <label className='flex items-center space-x-3 cursor-pointer'>
              <input
                type='checkbox'
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
                className='accent-cyan-500'
              />
              <span className='text-sm'>Email weekly reports</span>
            </label>
          </div>

          {/* Widget Customization */}
          <div className='card p-6 md:col-span-2'>
            <h2 className='text-xl font-bold mb-4'>Dashboard Widgets</h2>
            <div className='grid grid-cols-2 gap-4'>
              {Object.entries(widgets).map(([key, val]) => (
                <label
                  key={key}
                  className='flex items-center space-x-3 bg-white/5 rounded-xl px-3 py-2 hover:bg-white/10 transition-all glow cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={val}
                    onChange={() =>
                      setWidgets((w) => ({
                        ...w,
                        [key]: !w[key as keyof typeof w]
                      }))
                    }
                    className='accent-cyan-500'
                  />
                  <span className='capitalize'>{key}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
