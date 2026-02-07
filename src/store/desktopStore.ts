'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Phase, ThemeId } from '@/types'

interface DesktopState {
  phase: Phase
  activeWorkspaceId: number
  themeId: ThemeId
  wallpaper: string
  rofiOpen: boolean
  bootCompleted: boolean

  setPhase: (phase: Phase) => void
  setActiveWorkspace: (id: number) => void
  setTheme: (id: ThemeId) => void
  setWallpaper: (path: string) => void
  toggleRofi: () => void
  setRofiOpen: (open: boolean) => void
  setBootCompleted: () => void
}

export const useDesktopStore = create<DesktopState>()(
  persist(
    (set) => ({
      phase: 'boot',
      activeWorkspaceId: 1,
      themeId: 'catppuccin-mocha',
      wallpaper: '/wallpapers/default.png',
      rofiOpen: false,
      bootCompleted: false,

      setPhase: (phase) => set({ phase }),
      setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
      setTheme: (id) => set({ themeId: id }),
      setWallpaper: (path) => set({ wallpaper: path }),
      toggleRofi: () => set((s) => ({ rofiOpen: !s.rofiOpen })),
      setRofiOpen: (open) => set({ rofiOpen: open }),
      setBootCompleted: () => set({ bootCompleted: true }),
    }),
    {
      name: 'archlinux-desktop',
      partialize: (state) => ({
        themeId: state.themeId,
        bootCompleted: state.bootCompleted,
      }),
    }
  )
)
