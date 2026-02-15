'use client'

import { useState, useCallback, useEffect } from 'react'
import { useWmStore } from '@/store/wmStore'
import { useDesktopStore } from '@/store/desktopStore'

interface BrowserProps {
  windowId: string
}

const GOOGLE_HOME = 'https://www.google.com/webhp?igu=1'

function ensureUrl(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return GOOGLE_HOME
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  if (trimmed.includes('.') && !trimmed.includes(' ')) return 'https://' + trimmed
  // Treat as Google search
  return `https://www.google.com/search?igu=1&q=${encodeURIComponent(trimmed)}`
}

export default function Browser({ windowId }: BrowserProps) {
  const closeWindow = useWmStore((s) => s.closeWindow)
  const activeWorkspaceId = useDesktopStore((s) => s.activeWorkspaceId)
  const [displayUrl, setDisplayUrl] = useState(GOOGLE_HOME)
  const [iframeSrc, setIframeSrc] = useState(GOOGLE_HOME)

  // Restore last URL from localStorage
  useEffect(() => {
    try {
      const savedUrl = localStorage.getItem('chrome-url')
      const savedDisplay = localStorage.getItem('chrome-display-url')
      if (savedUrl) {
        setIframeSrc(savedUrl)
        setDisplayUrl(savedDisplay || savedUrl)
      }
    } catch { }
  }, [])

  const navigate = useCallback((input: string) => {
    const url = ensureUrl(input)
    setIframeSrc(url)
    setDisplayUrl(input)
    try {
      localStorage.setItem('chrome-url', url)
      localStorage.setItem('chrome-display-url', input)
    } catch { }
  }, [])

  const goHome = useCallback(() => {
    setIframeSrc(GOOGLE_HOME)
    setDisplayUrl(GOOGLE_HOME)
    try {
      localStorage.setItem('chrome-url', GOOGLE_HOME)
      localStorage.setItem('chrome-display-url', GOOGLE_HOME)
    } catch { }
  }, [])

  const refresh = useCallback(() => {
    // Force iframe reload by toggling src
    const current = iframeSrc
    setIframeSrc('')
    setTimeout(() => setIframeSrc(current), 50)
  }, [iframeSrc])

  return (
    <div className="w-full h-full bg-ctp-base text-ctp-text flex flex-col overflow-hidden">
      {/* Chrome toolbar */}
      <div className="shrink-0 flex items-center gap-1 px-2 h-10 bg-ctp-mantle border-b border-ctp-surface0">
        {/* Close button */}
        <button
          onClick={() => closeWindow(windowId, activeWorkspaceId)}
          className="w-3.5 h-3.5 rounded-full bg-[#ed6a5e] hover:brightness-110 transition-all shrink-0"
          title="Close (Ctrl+Q)"
        />
        {/* Navigation buttons */}
        <button
          onClick={goHome}
          className="p-1.5 rounded hover:bg-ctp-surface0 text-ctp-subtext0 hover:text-ctp-text transition-colors"
          title="Home"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </button>

        <button
          onClick={refresh}
          className="p-1.5 rounded hover:bg-ctp-surface0 text-ctp-subtext0 hover:text-ctp-text transition-colors"
          title="Refresh"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
        </button>

        {/* URL bar */}
        <div className="flex-1 mx-1">
          <input
            type="text"
            value={displayUrl}
            onChange={(e) => setDisplayUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                navigate(displayUrl)
              }
            }}
            className="w-full bg-ctp-base text-ctp-text text-xs px-3 py-1.5 rounded-full outline-none border border-ctp-surface0 focus:border-arch-blue transition-colors"
            placeholder="Search Google or type a URL"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Iframe content */}
      <div className="flex-1 bg-white">
        {iframeSrc && (
          <iframe
            src={iframeSrc}
            className="w-full h-full border-0"
            title="Chrome Browser"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            referrerPolicy="no-referrer"
          />
        )}
      </div>
    </div>
  )
}
