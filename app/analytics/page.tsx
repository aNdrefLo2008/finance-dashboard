/** @format */
"use client"

import {useEffect, useState} from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import GlassTooltip from "@/components/GlassTooltip"

// Types for structured AI response
interface AISummary {
  insights: string
  predictions: string
  motivational: string
}

type RawTransaction = {
  id?: string | number
  date?: string | number // ISO string or epoch
  amount?: number
  // other fields allowed
}

type ChartPoint = {
  month: string // "M1".."M12"
  value: number
}

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<AISummary>({
    insights: "",
    predictions: "",
    motivational: ""
  })

  // keep the original transactions (raw) if you need them elsewhere
  const [transactions, setTransactions] = useState<RawTransaction[]>([])

  // chart-friendly data derived from transactions
  const [chartData, setChartData] = useState<ChartPoint[]>([])

  useEffect(() => {
    // fetch AI summary
    fetch("/api/ai")
      .then((res) => res.json())
      .then((data) => {
        const sections = parseAIResponse(data.message)
        setSummary(sections)
      })
      .catch((err) => {
        console.error("Error fetching AI data:", err)
      })

    // fetch transactions and transform into chart data
    fetch("/api/transactions")
      .then((res) => {
        if (!res.ok) throw new Error("Transactions fetch failed")
        return res.json()
      })
      .then((data: any) => {
        // ensure array
        const arr: any[] = Array.isArray(data) ? data : []
        setTransactions(arr)

        const prepared = prepareChartDataFromTransactions(arr)
        setChartData(prepared)
      })
      .catch((err) => {
        console.error("Error fetching transactions:", err)
        // fallback sample data so UI stays functional
        const fallback: ChartPoint[] = [
          {month: "M1", value: 310},
          {month: "M2", value: 345},
          {month: "M3", value: 390},
          {month: "M4", value: 420},
          {month: "M5", value: 460},
          {month: "M6", value: 505},
          {month: "M7", value: 480},
          {month: "M8", value: 450},
          {month: "M9", value: 470},
          {month: "M10", value: 495},
          {month: "M11", value: 520},
          {month: "M12", value: 540}
        ]
        setChartData(fallback)
      })
  }, [])

  return (
    <div className='flex w-full'>
      <main className='flex-1 p-6 space-y-6'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Monthly Spending Chart */}
          <div className='card p-6'>
            <h2 className='text-xl font-bold mb-4'>Monthly Spending</h2>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={chartData}>
                <XAxis dataKey='month' stroke='#888' />
                <YAxis stroke='#888' />
                <Tooltip
                  contentStyle={{
                    background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.1)"
                  }}
                  content={GlassTooltip}
                />
                <Line
                  type='monotone'
                  dataKey='value'
                  stroke='#06b6d4'
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* AI Insights */}
          <div className='card p-6 flex flex-col'>
            <h2 className='text-xl font-bold mb-4'>AI Insights</h2>

            <h3 className='font-semibold mt-2'>Spending Insights</h3>
            <ul className='list-disc ml-6 text-gray-300'>
              {summary.insights
                .split("\n")
                .map((line, i) =>
                  line.trim() ? (
                    <li key={i}>
                      {line.replace(/\*\*/g, "").replace(/^-+\s*/, "")}
                    </li>
                  ) : null
                )}
            </ul>

            <h3 className='font-semibold mt-4'>Predictions</h3>
            <ul className='list-disc ml-6 text-gray-300'>
              {summary.predictions
                .split("\n")
                .map((line, i) =>
                  line.trim() ? (
                    <li key={i}>{line.replace(/^- /, "")}</li>
                  ) : null
                )}
            </ul>

            <h3 className='font-semibold mt-4'>Motivational Message</h3>
            <p className='text-gray-300 italic'>{summary.motivational}</p>
          </div>
        </div>
      </main>
    </div>
  )
}

/**
 * Prepare chart data from several possible shapes:
 * - already aggregated: [{ month: "M1", value: 310 }, ... ]
 * - raw transactions: [{ date: "2025-01-15", amount: 12.34 }, ... ]
 * - fallback: returns 12 months zeros if nothing
 */
function prepareChartDataFromTransactions(data: any[]): ChartPoint[] {
  if (!Array.isArray(data)) return emptyMonths()

  // If already aggregated, validate format and return
  const looksAggregated =
    data.length > 0 &&
    data.every(
      (d) =>
        typeof d.month === "string" &&
        (typeof d.value === "number" || !isNaN(Number(d.value)))
    )
  if (looksAggregated) {
    // ensure months sorted M1..M12
    const copy = data.map((d) => ({month: d.month, value: Number(d.value)}))
    return sortMonths(copy)
  }

  // Otherwise, assume raw transactions with date + amount
  const monthlyMap = new Map<number, number>() // monthIndex (1..12) -> total

  data.forEach((t) => {
    // try to extract amount
    const amount =
      t.amount !== undefined
        ? Number(t.amount)
        : t.value !== undefined
        ? Number(t.value)
        : t.sum !== undefined
        ? Number(t.sum)
        : NaN

    if (isNaN(amount)) return // skip invalid

    // try to extract date
    let dt: Date | null = null
    if (t.date) {
      const maybeNum = Number(t.date)
      dt = !isNaN(maybeNum) ? new Date(maybeNum) : new Date(String(t.date))
    } else if (t.timestamp) {
      const num = Number(t.timestamp)
      if (!isNaN(num)) dt = new Date(num)
    }

    if (!dt || isNaN(dt.getTime())) {
      // if date missing, treat as "unknown" -> skip
      return
    }

    const monthIndex = dt.getMonth() + 1 // 1..12
    monthlyMap.set(monthIndex, (monthlyMap.get(monthIndex) ?? 0) + amount)
  })

  // build array M1..M12
  const months: ChartPoint[] = []
  for (let m = 1; m <= 12; m++) {
    const total = monthlyMap.get(m) ?? 0
    months.push({month: `M${m}`, value: Math.round(total * 100) / 100})
  }

  return months
}

function sortMonths(arr: ChartPoint[]) {
  const order = (s: string) => {
    const m = s.match(/^M(\d{1,2})$/i)
    return m ? Number(m[1]) : 99
  }
  return [...arr].sort((a, b) => order(a.month) - order(b.month))
}

function emptyMonths(): ChartPoint[] {
  const res: ChartPoint[] = []
  for (let m = 1; m <= 12; m++) res.push({month: `M${m}`, value: 0})
  return res
}

// ----------------- Existing parser (unchanged) -----------------
function parseAIResponse(message: string) {
  const sections = {insights: "", predictions: "", motivational: ""}

  // normalize newlines
  const clean = message.replace(/\r/g, "")

  const insightsMatch = clean.match(
    /###\s*Spending Insights:\s*([\s\S]*?)(?=\n###|$)/i
  )
  const predictionsMatch = clean.match(
    /###\s*Predictions for Next Month:\s*([\s\S]*?)(?=\n###|$)/i
  )
  const motivationalMatch = clean.match(
    /###\s*Motivational Message:\s*(?:"|')?([\s\S]*?)(?:"|'|\n###|$)/i
  )

  if (insightsMatch)
    sections.insights = insightsMatch[1]
      .trim()
      .replace(/(^["']|["']$)/g, "")
      .replace(/,\s*$/, "")
  if (predictionsMatch)
    sections.predictions = predictionsMatch[1]
      .trim()
      .replace(/(^["']|["']$)/g, "")
      .replace(/,\s*$/, "")
  if (motivationalMatch)
    sections.motivational = motivationalMatch[1]
      .trim()
      .replace(/(^["']|["']$)/g, "")
      .replace(/,\s*$/, "")

  return sections
}
