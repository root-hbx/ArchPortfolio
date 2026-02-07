'use client'

import { useCallback, useRef } from 'react'
import { useWmStore } from '@/store/wmStore'
import { BoundingBox } from '@/lib/wm/types'

interface SplitHandleProps {
  rect: BoundingBox
  direction: 'horizontal' | 'vertical'
  path: ('first' | 'second')[]
  workspaceId: number
  containerRect: BoundingBox
}

export default function SplitHandle({
  rect,
  direction,
  path,
  workspaceId,
  containerRect,
}: SplitHandleProps) {
  const updateSplitRatio = useWmStore((s) => s.updateSplitRatio)
  const draggingRef = useRef(false)
  const startRef = useRef({ pos: 0, ratio: 0 })

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      draggingRef.current = true

      const startPos = direction === 'horizontal' ? e.clientX : e.clientY
      const size = direction === 'horizontal' ? containerRect.width : containerRect.height

      const handleMouseMove = (ev: MouseEvent) => {
        if (!draggingRef.current) return
        const currentPos = direction === 'horizontal' ? ev.clientX : ev.clientY
        const delta = currentPos - startPos
        const ratioDelta = delta / size
        // Compute new ratio based on the center position of the handle
        const handleCenter =
          direction === 'horizontal'
            ? rect.x + rect.width / 2
            : rect.y + rect.height / 2
        const newCenter = handleCenter + (currentPos - startPos)
        const newRatio = newCenter / size
        updateSplitRatio(workspaceId, path, newRatio)
      }

      const handleMouseUp = () => {
        draggingRef.current = false
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [direction, containerRect, updateSplitRatio, workspaceId, path, rect]
  )

  return (
    <div
      className={`absolute z-10 ${
        direction === 'horizontal' ? 'split-handle-h' : 'split-handle-v'
      }`}
      style={{
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
      }}
      onMouseDown={handleMouseDown}
    />
  )
}
