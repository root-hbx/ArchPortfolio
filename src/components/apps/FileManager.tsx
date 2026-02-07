'use client'

import { useState } from 'react'
import { filesystem, resolvePath, normalizePath, FSNode } from '@/lib/terminal/filesystem'
import { useWmStore } from '@/store/wmStore'
import { useDesktopStore } from '@/store/desktopStore'

interface FileManagerProps {
  windowId: string
}

export default function FileManager({ windowId }: FileManagerProps) {
  const [currentPath, setCurrentPath] = useState('/home/boxuan')
  const openWindow = useWmStore((s) => s.openWindow)
  const activeWorkspaceId = useDesktopStore((s) => s.activeWorkspaceId)

  const currentNode = resolvePath(filesystem, currentPath, '/')

  const navigate = (name: string) => {
    if (name === '..') {
      const parts = currentPath.split('/').filter(Boolean)
      parts.pop()
      setCurrentPath('/' + parts.join('/') || '/')
      return
    }

    const newPath = normalizePath(currentPath + '/' + name)
    const node = resolvePath(filesystem, newPath, '/')
    if (!node) return

    if (node.type === 'dir') {
      setCurrentPath(newPath)
    } else {
      // Open file in text editor
      openWindow('texteditor', activeWorkspaceId)
    }
  }

  const entries: { name: string; node: FSNode }[] = []
  if (currentNode?.type === 'dir' && currentNode.children) {
    Object.entries(currentNode.children).forEach(([name, node]) => {
      entries.push({ name, node })
    })
  }

  // Sort: dirs first, then files
  entries.sort((a, b) => {
    if (a.node.type === b.node.type) return a.name.localeCompare(b.name)
    return a.node.type === 'dir' ? -1 : 1
  })

  const breadcrumbs = currentPath.split('/').filter(Boolean)

  return (
    <div className="w-full h-full bg-ctp-base text-ctp-text flex flex-col text-sm overflow-hidden">
      {/* Path bar */}
      <div className="h-8 bg-ctp-mantle border-b border-ctp-surface0 flex items-center px-3 gap-1 shrink-0">
        <button
          onClick={() => navigate('..')}
          className="text-ctp-overlay0 hover:text-ctp-text px-1"
        >
          ..
        </button>
        <span className="text-ctp-overlay0">/</span>
        {breadcrumbs.map((part, i) => (
          <span key={i} className="flex items-center gap-1">
            <button
              className="text-ctp-subtext0 hover:text-arch-blue"
              onClick={() => setCurrentPath('/' + breadcrumbs.slice(0, i + 1).join('/'))}
            >
              {part}
            </button>
            {i < breadcrumbs.length - 1 && <span className="text-ctp-overlay0">/</span>}
          </span>
        ))}
      </div>

      {/* File grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-4 gap-2">
          {currentPath !== '/' && (
            <button
              className="flex flex-col items-center gap-1 p-2 rounded hover:bg-ctp-surface0 transition-colors"
              onDoubleClick={() => navigate('..')}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#89b4fa" strokeWidth="1.5">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
              <span className="text-xs text-ctp-subtext0 truncate w-full text-center">..</span>
            </button>
          )}
          {entries.map(({ name, node }) => (
            <button
              key={name}
              className="flex flex-col items-center gap-1 p-2 rounded hover:bg-ctp-surface0 transition-colors"
              onDoubleClick={() => navigate(name)}
            >
              {node.type === 'dir' ? (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#89b4fa" strokeWidth="1.5">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              ) : (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#a6adc8" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              )}
              <span className={`text-xs truncate w-full text-center ${
                node.type === 'dir' ? 'text-ctp-blue' : 'text-ctp-subtext0'
              }`}>
                {name}
              </span>
            </button>
          ))}
        </div>

        {entries.length === 0 && (
          <div className="text-center text-ctp-overlay0 mt-8">Empty directory</div>
        )}
      </div>

      {/* Status bar */}
      <div className="h-6 bg-ctp-mantle border-t border-ctp-surface0 flex items-center px-3 text-xs text-ctp-overlay0 shrink-0">
        {entries.length} items
      </div>
    </div>
  )
}
