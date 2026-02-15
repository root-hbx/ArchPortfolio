'use client'

import { useRef, useCallback } from 'react'
import { useWmStore } from '@/store/wmStore'
import { useDesktopStore } from '@/store/desktopStore'
import AppRenderer from '@/components/apps/AppRenderer'

interface FloatingWindowProps {
  windowId: string
}

export default function FloatingWindow({ windowId }: FloatingWindowProps) {
  const windows = useWmStore((s) => s.windows)
  const focusWindow = useWmStore((s) => s.focusWindow)
  const updateFloatRect = useWmStore((s) => s.updateFloatRect)
  const closeWindow = useWmStore((s) => s.closeWindow)
  const focusedWindowId = useWmStore((s) => s.focusedWindowId)
  const activeWorkspaceId = useDesktopStore((s) => s.activeWorkspaceId)

  const win = windows[windowId]
  const draggingRef = useRef(false)

  const handleTitleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!win?.floatRect) return
      e.preventDefault()
      const startX = e.clientX - win.floatRect.x
      const startY = e.clientY - win.floatRect.y

      const handleMove = (ev: MouseEvent) => {
        updateFloatRect(windowId, {
          ...win.floatRect!,
          x: ev.clientX - startX,
          y: ev.clientY - startY,
        })
      }

      const handleUp = () => {
        document.removeEventListener('mousemove', handleMove)
        document.removeEventListener('mouseup', handleUp)
      }

      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', handleUp)
    },
    [win, windowId, updateFloatRect]
  )

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!win?.floatRect) return
      e.preventDefault()
      e.stopPropagation()
      const startX = e.clientX
      const startY = e.clientY
      const startW = win.floatRect.width
      const startH = win.floatRect.height

      const handleMove = (ev: MouseEvent) => {
        updateFloatRect(windowId, {
          ...win.floatRect!,
          width: Math.max(200, startW + (ev.clientX - startX)),
          height: Math.max(150, startH + (ev.clientY - startY)),
        })
      }

      const handleUp = () => {
        document.removeEventListener('mousemove', handleMove)
        document.removeEventListener('mouseup', handleUp)
      }

      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', handleUp)
    },
    [win, windowId, updateFloatRect]
  )

  if (!win || !win.floatRect) return null

  const isFocused = windowId === focusedWindowId

  return (
    <div
      className="fixed z-20"
      style={{
        left: win.floatRect.x,
        top: win.floatRect.y,
        width: win.floatRect.width,
        height: win.floatRect.height,
        border: `2px solid ${isFocused ? 'var(--border-focused)' : 'var(--border-unfocused)'}`,
        borderRadius: '4px',
        transition: 'border-color 150ms ease',
      }}
      onMouseDown={() => focusWindow(windowId)}
    >
      {/* Title bar */}
      <div
        className="h-6 bg-ctp-mantle flex items-center justify-between px-2 cursor-move select-none"
        onMouseDown={handleTitleMouseDown}
      >
        <span className="text-[0.625rem] text-ctp-subtext0 truncate">{win.title}</span>
        <button
          className="text-ctp-overlay0 hover:text-ctp-red text-xs leading-none"
          onClick={(e) => {
            e.stopPropagation()
            closeWindow(windowId, activeWorkspaceId)
          }}
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="bg-ctp-base" style={{ height: 'calc(100% - 24px)' }}>
        <AppRenderer appId={win.appId} windowId={windowId} />
      </div>

      {/* Resize handle */}
      <div
        className="absolute bottom-0 right-0 w-3 h-3 resize-se"
        onMouseDown={handleResizeMouseDown}
      />
    </div>
  )
}
