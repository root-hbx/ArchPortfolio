'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDesktopStore } from '@/store/desktopStore'
import { useWmStore } from '@/store/wmStore'
import { apps } from '@/lib/apps.config'
import AppIcon from '@/components/apps/AppIcon'

export default function Rofi() {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const setRofiOpen = useDesktopStore((s) => s.setRofiOpen)
  const activeWorkspaceId = useDesktopStore((s) => s.activeWorkspaceId)
  const openWindow = useWmStore((s) => s.openWindow)

  const filtered = apps.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  const launch = useCallback(
    (appId: string) => {
      openWindow(appId, activeWorkspaceId)
      setRofiOpen(false)
    },
    [openWindow, activeWorkspaceId, setRofiOpen]
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setRofiOpen(false)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      launch(filtered[selectedIndex].id)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 rofi-backdrop bg-ctp-crust/70 flex items-start justify-center pt-[15vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={() => setRofiOpen(false)}
    >
      <motion.div
        className="w-[480px] bg-ctp-mantle border border-ctp-surface0 rounded-lg overflow-hidden shadow-2xl"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="p-3 border-b border-ctp-surface0">
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search applications..."
            className="w-full bg-ctp-base text-ctp-text text-sm px-3 py-2 rounded outline-none placeholder:text-ctp-overlay0 focus:ring-1 focus:ring-arch-blue"
            spellCheck={false}
          />
        </div>

        {/* App list */}
        <div className="max-h-[300px] overflow-y-auto p-2">
          {filtered.map((app, i) => (
            <button
              key={app.id}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm text-left ${
                i === selectedIndex
                  ? 'bg-arch-blue/20 text-ctp-text'
                  : 'text-ctp-subtext1 hover:bg-ctp-surface0'
              }`}
              onClick={() => launch(app.id)}
              onMouseEnter={() => setSelectedIndex(i)}
            >
              <AppIcon icon={app.icon} size={20} />
              <div>
                <div className={i === selectedIndex ? 'text-ctp-text' : ''}>{app.title}</div>
                {app.shortcut && (
                  <div className="text-[10px] text-ctp-overlay0">{app.shortcut}</div>
                )}
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-ctp-overlay0 text-sm py-4">No apps found</div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
