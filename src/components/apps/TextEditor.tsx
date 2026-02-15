'use client'

import { useState } from 'react'

interface TextEditorProps {
  windowId: string
  initialContent?: string
  filename?: string
}

const defaultContent = `# Welcome to Neovim

This is a simulated Neovim text editor.

## Keybindings
- Normal mode is simulated
- Content is read-only in this simulation

## About Boxuan Hu
Computer Science undergraduate at Xi'an Jiaotong University.
Research interests in computer systems and networks.

Visit: https://bxhu2004.com
GitHub: https://github.com/root-hbx
`

export default function TextEditor({ windowId, initialContent, filename }: TextEditorProps) {
  const [mode] = useState<'NORMAL' | 'INSERT' | 'VISUAL'>('NORMAL')
  const content = initialContent || defaultContent
  const lines = content.split('\n')
  const fname = filename || '[No Name]'

  return (
    <div className="w-full h-full bg-ctp-base text-ctp-text flex flex-col text-[0.8125rem] overflow-hidden">
      {/* Editor content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex">
          {/* Line numbers */}
          <div className="shrink-0 text-right pr-2 pl-2 text-ctp-overlay0 select-none bg-ctp-mantle border-r border-ctp-surface0">
            {lines.map((_, i) => (
              <div key={i} className="leading-[1.5]">{i + 1}</div>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 pl-3 pr-2 terminal-content">
            {lines.map((line, i) => (
              <div key={i} className="leading-[1.5] whitespace-pre-wrap">
                {renderLine(line)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status line */}
      <div className="h-6 bg-ctp-mantle border-t border-ctp-surface0 flex items-center px-2 text-xs shrink-0">
        <span className={`px-2 py-0.5 rounded-sm font-bold mr-2 ${
          mode === 'NORMAL' ? 'bg-arch-blue text-ctp-crust' :
          mode === 'INSERT' ? 'bg-ctp-green text-ctp-crust' :
          'bg-ctp-mauve text-ctp-crust'
        }`}>
          -- {mode} --
        </span>
        <span className="text-ctp-subtext0">{fname}</span>
        <span className="ml-auto text-ctp-overlay0">{lines.length}L</span>
      </div>
    </div>
  )
}

function renderLine(line: string): React.ReactNode {
  // Simple markdown-like highlighting
  if (line.startsWith('# ')) {
    return <span className="text-ctp-mauve font-bold">{line}</span>
  }
  if (line.startsWith('## ')) {
    return <span className="text-ctp-blue font-bold">{line}</span>
  }
  if (line.startsWith('- ')) {
    return (
      <>
        <span className="text-ctp-peach">- </span>
        <span>{line.slice(2)}</span>
      </>
    )
  }
  if (line.startsWith('```')) {
    return <span className="text-ctp-green">{line}</span>
  }

  // Highlight URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = line.split(urlRegex)
  if (parts.length > 1) {
    return parts.map((part, i) =>
      urlRegex.test(part) ? (
        <span key={i} className="text-arch-blue underline">{part}</span>
      ) : (
        <span key={i}>{part}</span>
      )
    )
  }

  return line
}
