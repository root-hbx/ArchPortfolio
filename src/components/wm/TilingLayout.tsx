'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { useWmStore } from '@/store/wmStore'
import { computeLayout } from '@/lib/wm/layout'
import { BoundingBox } from '@/lib/wm/types'
import TileNode from './TileNode'
import SplitHandle from './SplitHandle'

interface TilingLayoutProps {
  workspaceId: number
}

export default function TilingLayout({ workspaceId }: TilingLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerRect, setContainerRect] = useState<BoundingBox>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  })

  const workspace = useWmStore((s) => s.workspaces[workspaceId])
  const focusedWindowId = useWmStore((s) => s.focusedWindowId)
  const windows = useWmStore((s) => s.windows)

  const updateRect = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setContainerRect({
        x: 0,
        y: 0,
        width: rect.width,
        height: rect.height,
      })
    }
  }, [])

  useEffect(() => {
    updateRect()
    const observer = new ResizeObserver(updateRect)
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }
    return () => observer.disconnect()
  }, [updateRect])

  if (!workspace || !workspace.tree) {
    return (
      <div ref={containerRef} className="w-full h-full flex items-center justify-center">
        <div className="text-center text-ctp-overlay0 text-sm">
          <p>Press <kbd className="px-1.5 py-0.5 bg-ctp-surface0 rounded text-ctp-text text-xs">Ctrl+Enter</kbd> to open a terminal</p>
          <p className="mt-1">or click an icon in the dock below</p>
        </div>
      </div>
    )
  }

  const gap = 6
  const { windows: layoutEntries, splits } = computeLayout(
    workspace.tree,
    containerRect,
    gap
  )

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {layoutEntries.map((entry) => {
        const win = windows[entry.windowId]
        if (!win || win.isFloating) return null

        // Check if this window is fullscreen
        if (win.isFullscreen) {
          return (
            <TileNode
              key={entry.windowId}
              windowId={entry.windowId}
              rect={{
                x: gap,
                y: gap,
                width: containerRect.width - gap * 2,
                height: containerRect.height - gap * 2,
              }}
              isFocused={entry.windowId === focusedWindowId}
            />
          )
        }

        return (
          <TileNode
            key={entry.windowId}
            windowId={entry.windowId}
            rect={entry.rect}
            isFocused={entry.windowId === focusedWindowId}
          />
        )
      })}

      {splits.map((split, i) => (
        <SplitHandle
          key={i}
          rect={split.rect}
          direction={split.direction}
          path={split.path}
          workspaceId={workspaceId}
          containerRect={containerRect}
        />
      ))}
    </div>
  )
}
