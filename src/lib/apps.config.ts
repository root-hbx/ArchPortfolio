import { AppDefinition } from '@/types'

export const apps: AppDefinition[] = [
  {
    id: 'terminal',
    title: 'Terminal',
    icon: 'terminal',
    shortcut: 'Ctrl+Enter',
  },
  {
    id: 'filemanager',
    title: 'Files',
    icon: 'folder',
  },
  {
    id: 'texteditor',
    title: 'Neovim',
    icon: 'edit',
  },
  {
    id: 'browser',
    title: 'Chrome',
    icon: 'globe',
  },
  {
    id: 'about',
    title: 'About',
    icon: 'user',
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: 'settings',
  },
  {
    id: 'sysmonitor',
    title: 'System Monitor',
    icon: 'activity',
  },
]

export function getApp(id: string): AppDefinition | undefined {
  return apps.find((a) => a.id === id)
}
