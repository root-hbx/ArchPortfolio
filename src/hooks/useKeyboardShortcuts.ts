'use client'

import { useEffect } from 'react'
import { useDesktopStore } from '@/store/desktopStore'
import { useWmStore } from '@/store/wmStore'

export default function useKeyboardShortcuts() {
  const activeWorkspaceId = useDesktopStore((s) => s.activeWorkspaceId)
  const setActiveWorkspace = useDesktopStore((s) => s.setActiveWorkspace)
  const toggleRofi = useDesktopStore((s) => s.toggleRofi)
  const openWindow = useWmStore((s) => s.openWindow)
  const closeWindow = useWmStore((s) => s.closeWindow)
  const focusedWindowId = useWmStore((s) => s.focusedWindowId)
  const toggleFloat = useWmStore((s) => s.toggleFloat)
  const toggleFullscreen = useWmStore((s) => s.toggleFullscreen)
  const moveFocus = useWmStore((s) => s.moveFocus)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Use Ctrl key (not Cmd) for all shortcuts
      if (!e.ctrlKey || e.metaKey) return

      switch (e.key) {
        case 'Enter':
          e.preventDefault()
          openWindow('terminal', activeWorkspaceId)
          break
        case 'd':
        case 'D':
          e.preventDefault()
          toggleRofi()
          break
        case 'q':
        case 'Q':
          e.preventDefault()
          if (focusedWindowId) {
            closeWindow(focusedWindowId, activeWorkspaceId)
          }
          break
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
          e.preventDefault()
          setActiveWorkspace(parseInt(e.key))
          break
        case 'h':
        case 'H':
          e.preventDefault()
          moveFocus('left', activeWorkspaceId)
          break
        case 'j':
        case 'J':
          e.preventDefault()
          moveFocus('down', activeWorkspaceId)
          break
        case 'k':
        case 'K':
          e.preventDefault()
          moveFocus('up', activeWorkspaceId)
          break
        case 'l':
        case 'L':
          e.preventDefault()
          moveFocus('right', activeWorkspaceId)
          break
        case ' ':
          e.preventDefault()
          if (focusedWindowId) {
            toggleFloat(focusedWindowId, activeWorkspaceId)
          }
          break
        case 'f':
        case 'F':
          e.preventDefault()
          if (focusedWindowId) {
            toggleFullscreen(focusedWindowId)
          }
          break
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [
    activeWorkspaceId,
    focusedWindowId,
    setActiveWorkspace,
    toggleRofi,
    openWindow,
    closeWindow,
    toggleFloat,
    toggleFullscreen,
    moveFocus,
  ])
}
