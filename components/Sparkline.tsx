/** @format */

"use client"
import {LineChart, Line, Tooltip, ResponsiveContainer} from "recharts"
import GlassTooltip from "./GlassTooltip"

export default function Sparkline({
  data
}: {
  data: {name: string; value: number; _tx?: any}[]
}) {
  return (
    <div className='card p-6 cursor-pointer'>
      <h3 className='font-semibold mb-3'>Trend</h3>
      <div className='h-28 w-full'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart data={data}>
            <Line
              type='monotone'
              dataKey='value'
              stroke='#06b6d4'
              strokeWidth={3}
              dot={{r: 2}}
              activeDot={{r: 5}}
            />
            {/* custom tooltip that receives the whole point via payload[0].payload */}
            <Tooltip content={<GlassTooltip />} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
