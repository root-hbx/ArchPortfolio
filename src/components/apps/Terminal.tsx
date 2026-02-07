'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { executeCommand } from '@/lib/terminal/commands'
import { TerminalState } from '@/lib/terminal/builtins'
import { useWmStore } from '@/store/wmStore'
import { useDesktopStore } from '@/store/desktopStore'

interface TerminalLine {
  type: 'prompt' | 'output'
  content: string
  cwd?: string
}

interface TerminalProps {
  windowId: string
}

function parseAnsi(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  const regex = /\x1b\[([0-9;]*)m/g
  let lastIndex = 0
  let currentStyle: React.CSSProperties = {}
  let match

  const colorMap: Record<string, string> = {
    '30': '#45475a', '31': '#f38ba8', '32': '#a6e3a1', '33': '#f9e2af',
    '34': '#89b4fa', '35': '#cba6f7', '36': '#89dceb', '37': '#bac2de',
    '40': '#45475a', '41': '#f38ba8', '42': '#a6e3a1', '43': '#f9e2af',
    '44': '#89b4fa', '45': '#cba6f7', '46': '#89dceb', '47': '#bac2de',
  }

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={lastIndex} style={{ ...currentStyle }}>
          {text.slice(lastIndex, match.index)}
        </span>
      )
    }

    const codes = match[1].split(';')
    for (const code of codes) {
      if (code === '0' || code === '') {
        currentStyle = {}
      } else if (code === '1') {
        currentStyle = { ...currentStyle, fontWeight: 'bold' }
      } else if (code === '2') {
        currentStyle = { ...currentStyle, opacity: 0.6 }
      } else if (colorMap[code]) {
        if (parseInt(code) >= 40) {
          currentStyle = { ...currentStyle, backgroundColor: colorMap[code], padding: '0 2px' }
        } else {
          currentStyle = { ...currentStyle, color: colorMap[code] }
        }
      }
    }

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(
      <span key={lastIndex} style={{ ...currentStyle }}>
        {text.slice(lastIndex)}
      </span>
    )
  }

  return parts
}

function Prompt({ cwd }: { cwd: string }) {
  const displayCwd = cwd.replace('/home/boxuan', '~')
  return (
    <span>
      <span className="text-ctp-green font-bold">[boxuan@archlinux</span>
      <span className="text-ctp-blue font-bold"> {displayCwd}</span>
      <span className="text-ctp-green font-bold">]</span>
      <span className="text-ctp-text">$ </span>
    </span>
  )
}

export default function Terminal({ windowId }: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [input, setInput] = useState('')
  const [termState, setTermState] = useState<TerminalState>({
    cwd: '/home/boxuan',
    history: [],
    env: {
      HOME: '/home/boxuan',
      USER: 'boxuan',
      SHELL: '/bin/bash',
      TERM: 'alacritty',
      LANG: 'en_US.UTF-8',
      PATH: '/usr/local/bin:/usr/bin:/bin',
      EDITOR: 'nvim',
    },
  })
  const [historyIndex, setHistoryIndex] = useState(-1)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const openWindow = useWmStore((s) => s.openWindow)
  const activeWorkspaceId = useDesktopStore((s) => s.activeWorkspaceId)

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [lines, scrollToBottom])

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim()

    // Add prompt line
    const newLines: TerminalLine[] = [
      ...lines,
      { type: 'prompt', content: trimmed, cwd: termState.cwd },
    ]

    if (trimmed) {
      const result = executeCommand(trimmed, termState, (appId) => {
        openWindow(appId, activeWorkspaceId)
      })

      if (result.output === '\x1b[CLEAR]') {
        setLines([])
        setInput('')
        setTermState((s) => ({
          ...s,
          history: [...s.history, trimmed],
          cwd: result.newCwd || s.cwd,
        }))
        setHistoryIndex(-1)
        return
      }

      if (result.output) {
        newLines.push({ type: 'output', content: result.output })
      }

      setTermState((s) => ({
        ...s,
        history: [...s.history, trimmed],
        cwd: result.newCwd || s.cwd,
      }))
    }

    setLines(newLines)
    setInput('')
    setHistoryIndex(-1)
  }, [input, lines, termState, openWindow, activeWorkspaceId])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (termState.history.length > 0) {
        const newIdx = historyIndex === -1 ? termState.history.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIdx)
        setInput(termState.history[newIdx])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIdx = historyIndex + 1
        if (newIdx >= termState.history.length) {
          setHistoryIndex(-1)
          setInput('')
        } else {
          setHistoryIndex(newIdx)
          setInput(termState.history[newIdx])
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      // Simple tab completion
      const parts = input.split(' ')
      const last = parts[parts.length - 1]
      if (last) {
        const cmds = ['ls', 'cd', 'cat', 'pwd', 'clear', 'whoami', 'uname', 'date', 'echo', 'help', 'history', 'neofetch', 'pacman', 'open', 'tree', 'head', 'which', 'alias', 'env']
        const match = cmds.filter((c) => c.startsWith(last))
        if (match.length === 1) {
          parts[parts.length - 1] = match[0]
          setInput(parts.join(' '))
        }
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setLines([])
    }
  }

  return (
    <div
      className="w-full h-full bg-ctp-base text-ctp-text text-[13px] leading-[1.4] overflow-hidden flex flex-col"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 terminal-content">
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap break-all">
            {line.type === 'prompt' ? (
              <>
                <Prompt cwd={line.cwd || termState.cwd} />
                <span>{line.content}</span>
              </>
            ) : (
              <>{parseAnsi(line.content)}</>
            )}
          </div>
        ))}

        {/* Current input line */}
        <div className="flex items-start whitespace-pre-wrap">
          <Prompt cwd={termState.cwd} />
          <span>{input}</span>
          <span className="cursor-blink text-ctp-text">▋</span>
        </div>
      </div>

      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="fixed -top-[100px] left-0 opacity-0 w-0 h-0"
        autoFocus
        spellCheck={false}
        autoComplete="off"
      />
    </div>
  )
}
