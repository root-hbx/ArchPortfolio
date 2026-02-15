'use client'

import dynamic from 'next/dynamic'

const Terminal = dynamic(() => import('./Terminal'), { ssr: false })
const FileManager = dynamic(() => import('./FileManager'), { ssr: false })
const TextEditor = dynamic(() => import('./TextEditor'), { ssr: false })
const Browser = dynamic(() => import('./Browser'), { ssr: false })
const MarkdownViewer = dynamic(() => import('./MarkdownViewer'), { ssr: false })
const Settings = dynamic(() => import('./Settings'), { ssr: false })
const SystemMonitor = dynamic(() => import('./SystemMonitor'), { ssr: false })

interface AppRendererProps {
  appId: string
  windowId: string
}

export default function AppRenderer({ appId, windowId }: AppRendererProps) {
  switch (appId) {
    case 'terminal':
      return <Terminal windowId={windowId} />
    case 'filemanager':
      return <FileManager windowId={windowId} />
    case 'texteditor':
      return <TextEditor windowId={windowId} />
    case 'browser':
      return <Browser windowId={windowId} />
    case 'markdownviewer':
      return <MarkdownViewer windowId={windowId} />
    case 'settings':
      return <Settings />
    case 'sysmonitor':
      return <SystemMonitor />
    default:
      return (
        <div className="w-full h-full flex items-center justify-center text-ctp-overlay0 text-sm">
          Unknown app: {appId}
        </div>
      )
  }
}
