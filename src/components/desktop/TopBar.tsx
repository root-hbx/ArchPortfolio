'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

function CalendarPopup({ now }: { now: Date }) {
  const [viewDate, setViewDate] = useState(
    () => new Date(now.getFullYear(), now.getMonth(), 1)
  )

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long' })

  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const today = now.getDate()
  const isCurrentMonth =
    now.getFullYear() === year && now.getMonth() === month

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

  const weeks: (number | null)[][] = []
  let week: (number | null)[] = new Array(firstDayOfWeek).fill(null)
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null)
    weeks.push(week)
  }

  const dayHeaders = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  return (
    <div
      className="absolute top-[32px] left-1/2 -translate-x-1/2 z-50 rounded-lg border border-ctp-surface0 shadow-2xl"
      style={{
        background: 'rgba(24, 24, 37, 0.92)',
        backdropFilter: 'blur(12px)',
        minWidth: '240px',
        padding: '12px 14px',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={prevMonth}
          className="text-ctp-subtext0 hover:text-ctp-text px-1 text-sm leading-none"
        >
          ◀
        </button>
        <span className="text-ctp-text text-sm font-medium">
          {monthName} {year}
        </span>
        <button
          onClick={nextMonth}
          className="text-ctp-subtext0 hover:text-ctp-text px-1 text-sm leading-none"
        >
          ▶
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-0 mb-1">
        {dayHeaders.map((d, i) => (
          <div
            key={d}
            className={`text-center text-xs py-0.5 font-medium ${
              i === 0 ? 'text-ctp-peach' : 'text-ctp-yellow'
            }`}
            style={{ width: '30px' }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      {weeks.map((w, wi) => (
        <div key={wi} className="grid grid-cols-7 gap-0">
          {w.map((d, di) => (
            <div
              key={di}
              className={`text-center text-xs py-[3px] ${
                d === null
                  ? ''
                  : isCurrentMonth && d === today
                  ? 'text-ctp-blue font-bold'
                  : 'text-ctp-text'
              }`}
              style={{ width: '30px' }}
            >
              {d ?? ''}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function TopBar() {
  const [now, setNow] = useState(new Date())
  const [showCalendar, setShowCalendar] = useState(false)
  const calRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (calRef.current && !calRef.current.contains(e.target as Node)) {
      setShowCalendar(false)
    }
  }, [])

  useEffect(() => {
    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showCalendar, handleClickOutside])

  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  const date = now.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div
      ref={calRef}
      className="fixed top-0 left-0 right-0 z-30 flex items-center justify-center bg-ctp-mantle/95 border-b border-ctp-surface0"
      style={{ height: '32px' }}
    >
      <div
        className="flex items-center gap-4 text-xs cursor-pointer select-none hover:bg-ctp-surface0/50 px-3 py-1 rounded transition-colors"
        onClick={() => setShowCalendar((v) => !v)}
      >
        <span className="text-ctp-text font-medium">{time}</span>
        <span className="text-ctp-subtext0">{date}</span>
      </div>

      {showCalendar && <CalendarPopup now={now} />}
    </div>
  )
}
