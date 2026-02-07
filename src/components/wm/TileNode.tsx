'use client'

import { useWmStore } from '@/store/wmStore'
import { BoundingBox } from '@/lib/wm/types'
import AppRenderer from '@/components/apps/AppRenderer'

interface TileNodeProps {
  windowId: string
  rect: BoundingBox
  isFocused: boolean
}

export default function TileNode({ windowId, rect, isFocused }: TileNodeProps) {
  const focusWindow = useWmStore((s) => s.focusWindow)
  const windows = useWmStore((s) => s.windows)
  const win = windows[windowId]

  if (!win) return null

  return (
    <div
      className="absolute overflow-hidden"
      style={{
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
        border: `2px solid ${isFocused ? 'var(--border-focused)' : 'var(--border-unfocused)'}`,
        borderRadius: '4px',
        transition: 'border-color 150ms ease',
      }}
      onMouseDown={() => focusWindow(windowId)}
    >
      <div className="w-full h-full bg-ctp-base overflow-hidden">
        <AppRenderer appId={win.appId} windowId={windowId} />
      </div>
    </div>
  )
}
