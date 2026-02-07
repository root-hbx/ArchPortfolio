export type Phase = 'boot' | 'login' | 'desktop'

export type ThemeId = 'catppuccin-mocha' | 'tokyo-night' | 'nord'

export interface AppDefinition {
  id: string
  title: string
  icon: string
  shortcut?: string
}

export interface WindowState {
  id: string
  appId: string
  title: string
  isFloating: boolean
  isFullscreen: boolean
  floatRect?: FloatRect
}

export interface FloatRect {
  x: number
  y: number
  width: number
  height: number
}

export interface LayoutRect {
  x: number
  y: number
  width: number
  height: number
}
