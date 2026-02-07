'use client'

import { useDesktopStore } from '@/store/desktopStore'
import { themes } from '@/lib/themes'
import { ThemeId } from '@/types'

const wallpapers = [
  { id: 'default', path: '/wallpapers/arch-default.svg', label: 'Arch Default' },
  { id: 'dark', path: '/wallpapers/arch-dark.svg', label: 'Arch Dark' },
  { id: 'minimal', path: '/wallpapers/arch-minimal.svg', label: 'Arch Minimal' },
]

const shortcuts = [
  { key: 'Ctrl + Enter', action: 'New terminal' },
  { key: 'Ctrl + D', action: 'Toggle rofi launcher' },
  { key: 'Ctrl + Q', action: 'Close focused window' },
  { key: 'Ctrl + 1-5', action: 'Switch workspace' },
  { key: 'Ctrl + H/J/K/L', action: 'Move focus left/down/up/right' },
  { key: 'Ctrl + Space', action: 'Toggle float mode' },
  { key: 'Ctrl + F', action: 'Toggle fullscreen' },
]

export default function Settings() {
  const themeId = useDesktopStore((s) => s.themeId)
  const wallpaper = useDesktopStore((s) => s.wallpaper)
  const setTheme = useDesktopStore((s) => s.setTheme)
  const setWallpaper = useDesktopStore((s) => s.setWallpaper)

  return (
    <div className="w-full h-full bg-ctp-base text-ctp-text overflow-y-auto p-6 text-sm">
      <h1 className="text-lg font-bold text-arch-blue mb-6">Settings</h1>

      {/* Theme */}
      <section className="mb-6">
        <h2 className="text-sm font-bold text-ctp-mauve mb-3">Theme</h2>
        <div className="flex gap-3">
          {Object.values(themes).map((theme) => (
            <button
              key={theme.id}
              onClick={() => setTheme(theme.id as ThemeId)}
              className={`flex flex-col items-center gap-2 p-3 rounded border transition-colors ${
                themeId === theme.id
                  ? 'border-arch-blue bg-ctp-surface0'
                  : 'border-ctp-surface0 hover:border-ctp-surface1'
              }`}
            >
              <div className="flex gap-1">
                <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: theme.colors.base }} />
                <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: theme.colors.blue }} />
                <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: theme.colors.green }} />
                <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: theme.colors.mauve }} />
              </div>
              <span className="text-xs">{theme.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Wallpaper */}
      <section className="mb-6">
        <h2 className="text-sm font-bold text-ctp-mauve mb-3">Wallpaper</h2>
        <div className="grid grid-cols-3 gap-3">
          {wallpapers.map((wp) => (
            <button
              key={wp.id}
              onClick={() => setWallpaper(wp.path)}
              className={`aspect-video rounded border overflow-hidden transition-all ${
                wallpaper === wp.path
                  ? 'border-arch-blue ring-1 ring-arch-blue'
                  : 'border-ctp-surface0 hover:border-ctp-surface1'
              }`}
            >
              <div
                className="w-full h-full flex items-center justify-center text-xs text-ctp-overlay0"
                style={{
                  background: wp.id === 'default'
                    ? 'linear-gradient(135deg, #1e1e2e, #181825)'
                    : wp.id === 'dark'
                    ? 'linear-gradient(135deg, #11111b, #181825)'
                    : 'linear-gradient(135deg, #1e1e2e, #313244)',
                }}
              >
                {wp.label}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Keyboard Shortcuts */}
      <section>
        <h2 className="text-sm font-bold text-ctp-mauve mb-3">Keyboard Shortcuts</h2>
        <table className="w-full">
          <thead>
            <tr className="text-left text-ctp-overlay0">
              <th className="pb-2 font-normal">Shortcut</th>
              <th className="pb-2 font-normal">Action</th>
            </tr>
          </thead>
          <tbody>
            {shortcuts.map((s) => (
              <tr key={s.key} className="border-t border-ctp-surface0">
                <td className="py-1.5">
                  <kbd className="px-1.5 py-0.5 bg-ctp-surface0 rounded text-xs text-ctp-text">
                    {s.key}
                  </kbd>
                </td>
                <td className="py-1.5 text-ctp-subtext0">{s.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
