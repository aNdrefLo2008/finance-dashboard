/** @format */

"use client"
import FancyCard from "./FancyCard"

export default function Radial({value}: {value: number}) {
  const size = 140,
    stroke = 10,
    r = (size - stroke) / 2,
    c = 2 * Math.PI * r
  const dash = (Math.max(0, Math.min(100, value)) / 100) * c
  return (
    <FancyCard>
      <div className='flex flex-col items-center'>
        <h3 className='font-semibold mb-3'>Savings Rate</h3>
        <svg width={size} height={size}>
          <defs>
            <linearGradient id='rg' x1='0' x2='1'>
              <stop offset='0%' stopColor='#7c5cff' />
              <stop offset='100%' stopColor='#06b6d4' />
            </linearGradient>
          </defs>
          <g transform={`translate(${size / 2}, ${size / 2})`}>
            <circle r={r} stroke='#1f2937' strokeWidth={stroke} fill='none' />
            <circle
              r={r}
              stroke='url(#rg)'
              strokeWidth={stroke}
              fill='none'
              strokeDasharray={`${dash} ${c - dash}`}
              strokeLinecap='round'
              transform='rotate(-90)'
            />
            <text x='0' y='4' textAnchor='middle' fontSize='18' fill='#e5e7eb'>
              {Math.round(value)}%
            </text>
          </g>
        </svg>
      </div>
    </FancyCard>
  )
}
