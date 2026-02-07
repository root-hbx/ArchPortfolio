'use client'

import { useState, useEffect } from 'react'

export default function TopBar() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

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
      className="fixed top-0 left-0 right-0 z-30 flex items-center justify-center bg-ctp-mantle/95 border-b border-ctp-surface0"
      style={{ height: '32px' }}
    >
      <div className="flex items-center gap-4 text-xs">
        <span className="text-ctp-text font-medium">{time}</span>
        <span className="text-ctp-subtext0">{date}</span>
      </div>
    </div>
  )
}
