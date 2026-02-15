'use client'

import { useDesktopStore } from '@/store/desktopStore'
import { themes } from '@/lib/themes'
import { ThemeId } from '@/types'

const wallpapers: Record<string, string> = {
  'Arch Black Default': '/wallpapers/arch-default.svg',
  'Arch White Default': '/wallpapers/arch-default.png',
  'Arch Dark': '/wallpapers/arch-dark.svg',
  'Arch Minimal': '/wallpapers/arch-minimal.svg',
  'Arch Blue': '/wallpapers/arch-blue.png',
  'Arch Mont': '/wallpapers/arch-mont.png',
  'Arch Sunset': '/wallpapers/arch-sunset.png',
}

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
  const bootFontSize = useDesktopStore((s) => s.bootFontSize)
  const desktopFontSize = useDesktopStore((s) => s.desktopFontSize)
  const setBootFontSize = useDesktopStore((s) => s.setBootFontSize)
  const setDesktopFontSize = useDesktopStore((s) => s.setDesktopFontSize)

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
              className={`flex flex-col items-center gap-2 p-3 rounded border transition-colors ${themeId === theme.id
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
        <div className="flex flex-col gap-1">
          {Object.entries(wallpapers).map(([label, path]) => (
            <button
              key={path}
              onClick={() => setWallpaper(path)}
              className={`flex items-center justify-between px-3 py-2 rounded border transition-colors text-left ${wallpaper === path
                ? 'border-arch-blue bg-ctp-surface0'
                : 'border-transparent hover:bg-ctp-surface0'
                }`}
            >
              <span className={`text-xs ${wallpaper === path ? 'text-arch-blue' : 'text-ctp-text'}`}>
                {label}
              </span>
              <span className="text-xs text-ctp-overlay0 ml-4 truncate">{path}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Font Size */}
      <section className="mb-6">
        <h2 className="text-sm font-bold text-ctp-mauve mb-3">Font Size</h2>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-ctp-subtext0">Boot / Login Screen</label>
            <span className="text-xs text-ctp-text">{bootFontSize}px</span>
          </div>
          <input
            type="range"
            min={16}
            max={32}
            step={1}
            value={bootFontSize}
            onChange={(e) => setBootFontSize(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: '#1793D1' }}
          />
          <div className="flex justify-between text-[0.625rem] text-ctp-overlay0 mt-0.5">
            <span>16px</span>
            <span>24px (default)</span>
            <span>32px</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-ctp-subtext0">Desktop / Apps</label>
            <span className="text-xs text-ctp-text">{desktopFontSize}px</span>
          </div>
          <input
            type="range"
            min={16}
            max={32}
            step={1}
            value={desktopFontSize}
            onChange={(e) => setDesktopFontSize(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: '#1793D1' }}
          />
          <div className="flex justify-between text-[0.625rem] text-ctp-overlay0 mt-0.5">
            <span>16px</span>
            <span>24px (default)</span>
            <span>32px</span>
          </div>
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
