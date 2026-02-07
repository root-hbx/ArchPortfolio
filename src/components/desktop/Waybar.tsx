'use client'

import { useState, useEffect } from 'react'
import { useDesktopStore } from '@/store/desktopStore'
import { useWmStore } from '@/store/wmStore'
import clsx from 'clsx'

export default function Waybar() {
  const activeWorkspaceId = useDesktopStore((s) => s.activeWorkspaceId)
  const setActiveWorkspace = useDesktopStore((s) => s.setActiveWorkspace)
  const focusedWindowId = useWmStore((s) => s.focusedWindowId)
  const windows = useWmStore((s) => s.windows)
  const workspaces = useWmStore((s) => s.workspaces)
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      )
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  const focusedTitle = focusedWindowId ? windows[focusedWindowId]?.title || '' : ''

  return (
    <div
      className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-2 bg-ctp-mantle/95 border-b border-ctp-surface0"
      style={{ height: 'var(--bar-height)' }}
    >
      {/* Left: Workspaces */}
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((id) => {
          const ws = workspaces[id]
          const hasWindows = ws && ws.tree !== null
          return (
            <button
              key={id}
              onClick={() => setActiveWorkspace(id)}
              className={clsx(
                'workspace-btn w-7 h-6 flex items-center justify-center text-xs rounded-sm',
                id === activeWorkspaceId
                  ? 'bg-arch-blue text-ctp-crust font-bold'
                  : hasWindows
                  ? 'text-ctp-text hover:bg-ctp-surface0'
                  : 'text-ctp-overlay0 hover:bg-ctp-surface0'
              )}
            >
              {id}
            </button>
          )
        })}
      </div>

      {/* Center: Window title */}
      <div className="text-xs text-ctp-subtext0 truncate max-w-md">
        {focusedTitle}
      </div>

      {/* Right: System tray */}
      <div className="flex items-center gap-3 text-xs text-ctp-subtext1">
        <span title="WiFi">󰤨</span>
        <span title="Volume">󰕾</span>
        <span title="Battery">󰁹</span>
        <span className="text-ctp-text font-medium">{time}</span>
      </div>
    </div>
  )
}
