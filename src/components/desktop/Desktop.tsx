'use client'

import { motion } from 'framer-motion'
import Wallpaper from './Wallpaper'
import TopBar from './TopBar'
import BottomDock from './BottomDock'
import TilingLayout from '@/components/wm/TilingLayout'
import FloatingWindow from '@/components/wm/FloatingWindow'
import Rofi from '@/components/launcher/Rofi'
import { useDesktopStore } from '@/store/desktopStore'
import { useWmStore } from '@/store/wmStore'
import useKeyboardShortcuts from '@/hooks/useKeyboardShortcuts'

export default function Desktop() {
  const activeWorkspaceId = useDesktopStore((s) => s.activeWorkspaceId)
  const windows = useWmStore((s) => s.windows)
  const rofiOpen = useDesktopStore((s) => s.rofiOpen)

  useKeyboardShortcuts()

  const floatingWindows = Object.values(windows).filter((w) => w.isFloating)

  return (
    <motion.div
      className="fixed inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Wallpaper />

      {/* Workspace tiling area: below top bar, above bottom dock area */}
      <div
        className="fixed left-0 right-0 z-[5]"
        style={{ top: '32px', bottom: '0px' }}
      >
        <TilingLayout workspaceId={activeWorkspaceId} />
      </div>

      {/* Floating windows */}
      {floatingWindows.map((win) => (
        <FloatingWindow key={win.id} windowId={win.id} />
      ))}

      {/* Top bar: time + date */}
      <TopBar />

      {/* Bottom dock: app icons */}
      <BottomDock />

      {/* Rofi overlay */}
      {rofiOpen && <Rofi />}
    </motion.div>
  )
}
