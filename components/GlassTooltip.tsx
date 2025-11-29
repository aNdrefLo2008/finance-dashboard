/** @format */

"use client"
import type {TooltipProps} from "recharts"

// Recharts liefert sehr generische Typen; hier enger machen
export type GlassTooltipProps = TooltipProps<number, string> & {
  payload?: Array<any>
  label?: string | number
}

export default function GlassTooltip({
  active,
  payload,
  label
}: GlassTooltipProps) {
  if (active && payload && payload.length) {
    // payload[0].payload is the original data object for that point
    const point = payload[0].payload || {}
    // try to extract nice fields
    const displayName =
      point.name || point._tx?.merchant || point._tx?.title || "Expense"
    const amount = point.value ?? point._tx?.amount ?? 0
    const date = point._tx?.date || point._tx?.createdAt || null

    return (
      <div className='backdrop-blur-xl bg-white/10 border border-white/20 text-white px-3 py-2 rounded-2xl shadow-lg min-w-[160px]'>
        <p className='text-xs opacity-80'>{String(displayName)}</p>
        <p className='text-sm font-semibold'>
          € {Number(amount).toLocaleString()}
        </p>
        {date ? (
          <p className='text-[11px] opacity-70 mt-1'>
            {new Date(date).toLocaleDateString()}
          </p>
        ) : null}
      </div>
    )
  }
  return null
}
