'use client'

import { useState, useEffect } from 'react'

/* ── virtual file system (only what we need) ───────────────────────── */

interface VFile {
  name: string
  type: 'folder' | 'image' | 'file'
  /** real URL for images / markdown files (relative to public/) */
  src?: string
}

const wallpaperFiles: VFile[] = [
  { name: 'arch-default.svg', type: 'image', src: '/wallpapers/arch-default.svg' },
  { name: 'arch-default.png', type: 'image', src: '/wallpapers/arch-default.png' },
  { name: 'arch-dark.svg', type: 'image', src: '/wallpapers/arch-dark.svg' },
  { name: 'arch-minimal.svg', type: 'image', src: '/wallpapers/arch-minimal.svg' },
  { name: 'arch-blue.png', type: 'image', src: '/wallpapers/arch-blue.png' },
  { name: 'arch-mont.png', type: 'image', src: '/wallpapers/arch-mont.png' },
  { name: 'arch-sunset.png', type: 'image', src: '/wallpapers/arch-sunset.png' },
]

const homeFolders: VFile[] = [
  { name: 'Resumes', type: 'folder' },
  { name: 'Pictures', type: 'folder' },
  { name: 'Misc', type: 'folder' },
]

const resumeFiles: VFile[] = [
  { name: 'resume.md', type: 'file', src: '/resume/resume.md' },
  { name: 'research.md', type: 'file', src: '/resume/research.md' },
]

/** Maps folder path → contents */
const fsMap: Record<string, VFile[]> = {
  Home: homeFolders,
  Resumes: resumeFiles,
  Pictures: wallpaperFiles,
  Misc: [],
}

/* ── sidebar items ────────────────────────────────────────────────── */

interface SidebarItem {
  label: string
  icon: React.ReactNode
  path: string
}

const FolderIcon = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
)

const ImageIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
)

const FileIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
)

const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const sidebarItems: SidebarItem[] = [
  { label: 'Home', path: 'Home', icon: <HomeIcon /> },
  { label: 'Resumes', path: 'Resumes', icon: <FolderIcon size={16} color="#89b4fa" /> },
  { label: 'Pictures', path: 'Pictures', icon: <FolderIcon size={16} color="#a6e3a1" /> },
  { label: 'Misc', path: 'Misc', icon: <FolderIcon size={16} color="#f9e2af" /> },
]

/* ── component ────────────────────────────────────────────────────── */

interface FileManagerProps {
  windowId: string
}

export default function FileManager({ windowId: _windowId }: FileManagerProps) {
  const [currentPath, setCurrentPath] = useState('Home')
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const [mdPreview, setMdPreview] = useState<{ name: string; src: string } | null>(null)
  const [mdContent, setMdContent] = useState<string>('')

  const entries = fsMap[currentPath] ?? []

  useEffect(() => {
    if (mdPreview) {
      fetch(mdPreview.src)
        .then((r) => r.text())
        .then(setMdContent)
        .catch(() => setMdContent('# Error\nFailed to load file.'))
    }
  }, [mdPreview])

  const navigate = (item: VFile) => {
    if (item.type === 'folder') {
      setCurrentPath(item.name)
      setSelectedFile(null)
      setPreviewSrc(null)
      setMdPreview(null)
    } else if (item.type === 'image' && item.src) {
      setPreviewSrc(item.src)
    } else if (item.type === 'file' && item.src && item.name.endsWith('.md')) {
      setMdPreview({ name: item.name, src: item.src })
      setMdContent('')
    }
  }

  const goBack = () => {
    if (currentPath !== 'Home') {
      setCurrentPath('Home')
      setSelectedFile(null)
      setPreviewSrc(null)
    }
  }

  const getGridIcon = (item: VFile) => {
    if (item.type === 'folder') {
      return (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" stroke="#89b4fa" fill="#89b4fa20" />
        </svg>
      )
    }
    if (item.type === 'image' && item.src) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.src}
          alt={item.name}
          className="w-12 h-12 object-cover rounded"
        />
      )
    }
    return (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#a6adc8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    )
  }

  /* ── image preview overlay ─────────────────────────────────────── */
  if (previewSrc) {
    return (
      <div className="w-full h-full bg-ctp-base text-ctp-text flex flex-col overflow-hidden">
        {/* header */}
        <div className="h-10 bg-ctp-mantle border-b border-ctp-surface0 flex items-center px-3 gap-3 shrink-0">
          <button onClick={() => setPreviewSrc(null)} className="text-ctp-overlay1 hover:text-ctp-text text-sm flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
          <span className="text-xs text-ctp-subtext0 truncate">{previewSrc.split('/').pop()}</span>
        </div>
        {/* image */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-hidden bg-ctp-crust">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewSrc} alt="" className="max-w-full max-h-full object-contain rounded" />
        </div>
      </div>
    )
  }

  /* ── markdown preview ──────────────────────────────────────────── */
  if (mdPreview && mdContent) {
    const lines = mdContent.split('\n')
    return (
      <div className="w-full h-full bg-ctp-base text-ctp-text flex flex-col overflow-hidden text-[0.8125rem]">
        {/* header */}
        <div className="h-8 bg-ctp-mantle border-b border-ctp-surface0 flex items-center px-3 gap-3 shrink-0">
          <button onClick={() => setMdPreview(null)} className="text-ctp-overlay1 hover:text-ctp-text text-sm flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
          <span className="text-xs text-ctp-subtext0 truncate">{mdPreview.name}</span>
          <span className="ml-auto text-[0.6875rem] text-ctp-overlay0 bg-ctp-surface0 px-2 py-0.5 rounded">Preview</span>
        </div>
        {/* split pane */}
        <div className="flex flex-1 overflow-hidden">
          {/* left: raw markdown */}
          <div className="flex-1 overflow-y-auto border-r border-ctp-surface0 bg-ctp-mantle">
            <div className="flex">
              <div className="shrink-0 text-right pr-2 pl-2 text-ctp-overlay0 select-none border-r border-ctp-surface0 bg-ctp-crust">
                {lines.map((_, i) => (
                  <div key={i} className="leading-[1.6] font-mono text-[0.75rem]">{i + 1}</div>
                ))}
              </div>
              <div className="flex-1 pl-3 pr-3">
                {lines.map((line, i) => (
                  <div key={i} className="leading-[1.6] font-mono whitespace-pre-wrap text-ctp-subtext1 text-[0.75rem]">
                    {highlightMdSyntax(line)}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* right: rendered preview */}
          <div className="flex-1 overflow-y-auto p-4 bg-ctp-base">
            <MdRendered content={mdContent} />
          </div>
        </div>
      </div>
    )
  }

  /* ── main layout ───────────────────────────────────────────────── */
  return (
    <div className="w-full h-full bg-ctp-base text-ctp-text flex flex-col overflow-hidden text-sm">
      {/* ── header bar ─────────────────────────────────────────── */}
      <div className="h-10 bg-ctp-mantle border-b border-ctp-surface0 flex items-center px-3 gap-2 shrink-0">
        {/* back / forward */}
        <button
          onClick={goBack}
          disabled={currentPath === 'Home'}
          className={`p-1 rounded ${currentPath === 'Home' ? 'text-ctp-surface1' : 'text-ctp-overlay1 hover:text-ctp-text hover:bg-ctp-surface0'}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button className="p-1 rounded text-ctp-surface1" disabled>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* breadcrumb */}
        <div className="flex items-center gap-1 ml-2 bg-ctp-surface0/50 rounded-lg px-3 py-1 flex-1 min-w-0">
          <HomeIcon />
          {currentPath !== 'Home' && (
            <>
              <span className="text-ctp-overlay0 text-xs">/</span>
              <span className="text-xs text-ctp-subtext0 truncate">{currentPath}</span>
            </>
          )}
          {currentPath === 'Home' && (
            <span className="text-xs text-ctp-subtext0 ml-1">Home</span>
          )}
        </div>

      </div>

      {/* ── body: sidebar + content ────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* sidebar */}
        <div className="w-40 shrink-0 bg-ctp-mantle border-r border-ctp-surface0 py-2 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.path}
              onClick={() => { setCurrentPath(item.path); setSelectedFile(null) }}
              className={`w-full flex items-center gap-2 px-3 py-1.5 text-left text-xs transition-colors ${currentPath === item.path
                ? 'bg-ctp-surface0 text-ctp-text font-medium'
                : 'text-ctp-subtext0 hover:bg-ctp-surface0/50 hover:text-ctp-text'
                }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* main content */}
        <div className="flex-1 overflow-y-auto p-4">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-ctp-overlay0 gap-2">
              <FolderIcon size={48} color="#585b70" />
              <span className="text-xs">Folder is empty</span>
            </div>
          ) : (
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))' }}>
              {entries.map((item) => (
                <button
                  key={item.name}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors ${selectedFile === item.name
                    ? 'bg-arch-blue/20'
                    : 'hover:bg-ctp-surface0'
                    }`}
                  onClick={() => setSelectedFile(item.name)}
                  onDoubleClick={() => navigate(item)}
                >
                  {getGridIcon(item)}
                  <span className="text-[0.6875rem] leading-tight text-center w-full truncate text-ctp-subtext0">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── status bar ─────────────────────────────────────────── */}
      <div className="h-6 bg-ctp-mantle border-t border-ctp-surface0 flex items-center px-3 text-xs text-ctp-overlay0 shrink-0">
        {entries.length} item{entries.length !== 1 ? 's' : ''}
      </div>
    </div>
  )
}

/* ── Markdown helpers ───────────────────────────────────────────────── */

function highlightMdSyntax(line: string): React.ReactNode {
  if (line.startsWith('# ')) return <span className="text-ctp-red font-bold">{line}</span>
  if (line.startsWith('## ')) return <span className="text-ctp-peach font-bold">{line}</span>
  if (line.startsWith('### ')) return <span className="text-ctp-yellow font-bold">{line}</span>
  if (line.startsWith('- ')) return <><span className="text-ctp-blue">- </span><span>{line.slice(2)}</span></>
  return <>{line || '\u00A0'}</>
}

function MdRendered({ content }: { content: string }) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0
  let k = 0

  while (i < lines.length) {
    const line = lines[i]
    if (line.trim() === '') { i++; continue }

    if (line.startsWith('# ')) {
      elements.push(<h1 key={k++} className="text-xl font-bold text-ctp-text mb-3 mt-4 first:mt-0 border-b border-ctp-surface0 pb-1">{mdInline(line.slice(2))}</h1>)
      i++; continue
    }
    if (line.startsWith('## ')) {
      elements.push(<h2 key={k++} className="text-lg font-bold text-ctp-blue mb-2 mt-4">{mdInline(line.slice(3))}</h2>)
      i++; continue
    }
    if (line.startsWith('### ')) {
      elements.push(<h3 key={k++} className="text-base font-bold text-ctp-mauve mb-1.5 mt-3">{mdInline(line.slice(4))}</h3>)
      i++; continue
    }
    if (line.startsWith('- ')) {
      const items: string[] = []
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('  '))) {
        if (lines[i].startsWith('- ')) items.push(lines[i].slice(2))
        else if (items.length > 0) items[items.length - 1] += '\n' + lines[i].trimStart()
        i++
      }
      elements.push(
        <ul key={k++} className="list-disc pl-5 mb-2 space-y-0.5">
          {items.map((item, j) => <li key={j} className="text-ctp-subtext1 text-[0.8125rem] leading-relaxed">{mdInline(item)}</li>)}
        </ul>
      )
      continue
    }
    elements.push(<p key={k++} className="text-ctp-subtext1 mb-2 leading-relaxed">{mdInline(line)}</p>)
    i++
  }

  return <div>{elements}</div>
}

function mdInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  let rest = text
  let idx = 0
  while (rest.length > 0) {
    const bold = rest.match(/\*\*(.+?)\*\*/)
    const italic = rest.match(/(?<!\*)\*([^*]+?)\*(?!\*)/)
    let first: { i: number; len: number; node: React.ReactNode } | null = null
    if (bold?.index !== undefined) {
      first = { i: bold.index, len: bold[0].length, node: <strong key={idx++} className="font-bold text-ctp-text">{bold[1]}</strong> }
    }
    if (italic?.index !== undefined && (!first || italic.index < first.i)) {
      first = { i: italic.index, len: italic[0].length, node: <em key={idx++} className="italic text-ctp-lavender">{italic[1]}</em> }
    }
    if (!first) { parts.push(rest); break }
    if (first.i > 0) parts.push(rest.slice(0, first.i))
    parts.push(first.node)
    rest = rest.slice(first.i + first.len)
  }
  return parts.length === 1 ? parts[0] : <>{parts}</>
}
