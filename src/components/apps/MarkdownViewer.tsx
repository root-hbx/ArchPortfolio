'use client'

import { useState, useEffect, useMemo } from 'react'

interface MarkdownViewerProps {
  windowId: string
  filePath?: string
  filename?: string
  content?: string
}

export default function MarkdownViewer({ windowId: _windowId, filePath, filename, content: initialContent }: MarkdownViewerProps) {
  const [content, setContent] = useState(initialContent || '')
  const [loading, setLoading] = useState(!initialContent && !!filePath)

  useEffect(() => {
    if (filePath && !initialContent) {
      fetch(filePath)
        .then((r) => r.text())
        .then((text) => { setContent(text); setLoading(false) })
        .catch(() => { setContent('# Error\nFailed to load file.'); setLoading(false) })
    }
  }, [filePath, initialContent])

  const lines = content.split('\n')
  const fname = filename || filePath?.split('/').pop() || '[No Name]'

  if (loading) {
    return (
      <div className="w-full h-full bg-ctp-base text-ctp-text flex items-center justify-center text-sm text-ctp-overlay0">
        Loading...
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-ctp-base text-ctp-text flex flex-col overflow-hidden text-[0.8125rem]">
      {/* Toolbar */}
      <div className="h-8 bg-ctp-mantle border-b border-ctp-surface0 flex items-center px-3 gap-3 shrink-0">
        <span className="text-xs text-ctp-subtext0 truncate">{fname}</span>
        <span className="ml-auto text-[0.6875rem] text-ctp-overlay0 bg-ctp-surface0 px-2 py-0.5 rounded">Preview</span>
      </div>

      {/* Split pane */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: raw markdown */}
        <div className="flex-1 overflow-y-auto border-r border-ctp-surface0 bg-ctp-mantle">
          <div className="flex">
            {/* Line numbers */}
            <div className="shrink-0 text-right pr-2 pl-2 text-ctp-overlay0 select-none border-r border-ctp-surface0 bg-ctp-crust">
              {lines.map((_, i) => (
                <div key={i} className="leading-[1.6] font-mono text-[0.75rem]">{i + 1}</div>
              ))}
            </div>
            {/* Raw text */}
            <div className="flex-1 pl-3 pr-3 py-0">
              {lines.map((line, i) => (
                <div key={i} className="leading-[1.6] font-mono whitespace-pre-wrap text-ctp-subtext1 text-[0.75rem]">
                  {highlightMarkdownSyntax(line)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: rendered preview */}
        <div className="flex-1 overflow-y-auto p-4 bg-ctp-base">
          <RenderedMarkdown content={content} />
        </div>
      </div>
    </div>
  )
}

/* ── Raw markdown syntax highlighting (left pane) ──────────────────── */

function highlightMarkdownSyntax(line: string): React.ReactNode {
  if (line.startsWith('# ')) return <span className="text-ctp-red font-bold">{line}</span>
  if (line.startsWith('## ')) return <span className="text-ctp-peach font-bold">{line}</span>
  if (line.startsWith('### ')) return <span className="text-ctp-yellow font-bold">{line}</span>
  if (line.startsWith('- ')) return <><span className="text-ctp-blue">- </span><span>{line.slice(2)}</span></>
  return <>{line || '\u00A0'}</>
}

/* ── Rendered markdown (right pane) ────────────────────────────────── */

function RenderedMarkdown({ content }: { content: string }) {
  const elements = useMemo(() => parseMarkdown(content), [content])
  return <div className="max-w-none">{elements}</div>
}

function parseMarkdown(md: string): React.ReactNode[] {
  const lines = md.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]

    // Blank line
    if (line.trim() === '') { i++; continue }

    // H1
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={key++} className="text-xl font-bold text-ctp-text mb-3 mt-4 first:mt-0 border-b border-ctp-surface0 pb-1">
          {renderInline(line.slice(2))}
        </h1>
      )
      i++; continue
    }

    // H2
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="text-lg font-bold text-ctp-blue mb-2 mt-4">
          {renderInline(line.slice(3))}
        </h2>
      )
      i++; continue
    }

    // H3
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="text-base font-bold text-ctp-mauve mb-1.5 mt-3">
          {renderInline(line.slice(4))}
        </h3>
      )
      i++; continue
    }

    // List items (collect consecutive)
    if (line.startsWith('- ')) {
      const items: string[] = []
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('  '))) {
        if (lines[i].startsWith('- ')) {
          items.push(lines[i].slice(2))
        } else {
          // continuation of previous item
          if (items.length > 0) {
            items[items.length - 1] += '\n' + lines[i].trimStart()
          }
        }
        i++
      }
      elements.push(
        <ul key={key++} className="list-disc pl-5 mb-2 space-y-0.5">
          {items.map((item, j) => (
            <li key={j} className="text-ctp-subtext1 text-[0.8125rem] leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      )
      continue
    }

    // Paragraph
    elements.push(
      <p key={key++} className="text-ctp-subtext1 mb-2 leading-relaxed">
        {renderInline(line)}
      </p>
    )
    i++
  }

  return elements
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  let remaining = text
  let idx = 0

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/)
    const italicMatch = remaining.match(/(?<!\*)\*([^*]+?)\*(?!\*)/)

    type InlineMatch = { index: number; length: number; node: React.ReactNode }
    let best: InlineMatch | null = null

    if (boldMatch && boldMatch.index !== undefined) {
      best = { index: boldMatch.index, length: boldMatch[0].length, node: <strong key={idx++} className="font-bold text-ctp-text">{boldMatch[1]}</strong> }
    }
    if (italicMatch && italicMatch.index !== undefined && (!best || italicMatch.index < best.index)) {
      best = { index: italicMatch.index, length: italicMatch[0].length, node: <em key={idx++} className="italic text-ctp-lavender">{italicMatch[1]}</em> }
    }

    if (!best) { parts.push(remaining); break }
    if (best.index > 0) parts.push(remaining.slice(0, best.index))
    parts.push(best.node)
    remaining = remaining.slice(best.index + best.length)
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>
}
