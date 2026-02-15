'use client'

import { useWmStore } from '@/store/wmStore'
import { useDesktopStore } from '@/store/desktopStore'

export default function BottomDock() {
  const openWindow = useWmStore((s) => s.openWindow)
  const activeWorkspaceId = useDesktopStore((s) => s.activeWorkspaceId)

  const items = [
    {
      id: 'terminal',
      label: 'Terminal',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      ),
    },
    {
      id: 'chrome',
      label: 'Chrome',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          {/* Chrome logo */}
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.2" />
          <line x1="12" y1="8" x2="12" y2="2" stroke="currentColor" strokeWidth="1.2" />
          <line x1="8.54" y1="14" x2="3.54" y2="17.46" stroke="currentColor" strokeWidth="1.2" />
          <line x1="15.46" y1="14" x2="20.46" y2="17.46" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      ),
    },
    {
      id: 'files',
      label: 'Files',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
  ]

  const handleClick = (id: string) => {
    // Map dock item to app id
    const appMap: Record<string, string> = {
      terminal: 'terminal',
      chrome: 'browser',
      files: 'filemanager',
      settings: 'settings',
    }
    const appId = appMap[id]
    if (appId) {
      openWindow(appId, activeWorkspaceId)
    }
  }

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30">
      <div className="flex items-center gap-2 px-4 py-2 bg-ctp-mantle/90 border border-ctp-surface0 rounded-2xl shadow-lg backdrop-blur-sm">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className="flex flex-col items-center gap-0.5 p-2 rounded-xl text-ctp-subtext1 hover:text-ctp-text hover:bg-ctp-surface0/60 transition-all duration-150 active:scale-90"
            title={item.label}
          >
            {item.icon}
            <span className="text-[0.5625rem] leading-none">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
