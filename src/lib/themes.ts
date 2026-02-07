import { ThemeId } from '@/types'

export interface ThemeColors {
  base: string
  mantle: string
  crust: string
  text: string
  subtext0: string
  subtext1: string
  surface0: string
  surface1: string
  surface2: string
  overlay0: string
  overlay1: string
  green: string
  red: string
  yellow: string
  blue: string
  mauve: string
  accent: string
}

export interface ThemeDefinition {
  id: ThemeId
  name: string
  colors: ThemeColors
}

export const themes: Record<ThemeId, ThemeDefinition> = {
  'catppuccin-mocha': {
    id: 'catppuccin-mocha',
    name: 'Catppuccin Mocha',
    colors: {
      base: '#1e1e2e',
      mantle: '#181825',
      crust: '#11111b',
      text: '#cdd6f4',
      subtext0: '#a6adc8',
      subtext1: '#bac2de',
      surface0: '#313244',
      surface1: '#45475a',
      surface2: '#585b70',
      overlay0: '#6c7086',
      overlay1: '#7f849c',
      green: '#a6e3a1',
      red: '#f38ba8',
      yellow: '#f9e2af',
      blue: '#89b4fa',
      mauve: '#cba6f7',
      accent: '#1793D1',
    },
  },
  'tokyo-night': {
    id: 'tokyo-night',
    name: 'Tokyo Night',
    colors: {
      base: '#1a1b26',
      mantle: '#16161e',
      crust: '#13131a',
      text: '#c0caf5',
      subtext0: '#a9b1d6',
      subtext1: '#9aa5ce',
      surface0: '#292e42',
      surface1: '#3b4261',
      surface2: '#545c7e',
      overlay0: '#565f89',
      overlay1: '#737aa2',
      green: '#9ece6a',
      red: '#f7768e',
      yellow: '#e0af68',
      blue: '#7aa2f7',
      mauve: '#bb9af7',
      accent: '#1793D1',
    },
  },
  'nord': {
    id: 'nord',
    name: 'Nord',
    colors: {
      base: '#2e3440',
      mantle: '#292e39',
      crust: '#242933',
      text: '#eceff4',
      subtext0: '#d8dee9',
      subtext1: '#e5e9f0',
      surface0: '#3b4252',
      surface1: '#434c5e',
      surface2: '#4c566a',
      overlay0: '#616e88',
      overlay1: '#6e7a94',
      green: '#a3be8c',
      red: '#bf616a',
      yellow: '#ebcb8b',
      blue: '#81a1c1',
      mauve: '#b48ead',
      accent: '#1793D1',
    },
  },
}
