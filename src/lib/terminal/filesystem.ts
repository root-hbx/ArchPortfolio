export interface FSNode {
  type: 'file' | 'dir'
  name: string
  content?: string
  children?: Record<string, FSNode>
}

function dir(name: string, children: Record<string, FSNode>): FSNode {
  return { type: 'dir', name, children }
}

function file(name: string, content: string): FSNode {
  return { type: 'file', name, content }
}

export const filesystem: FSNode = dir('/', {
  home: dir('home', {
    boxuan: dir('boxuan', {
      Documents: dir('Documents', {
        'resume.md': file('resume.md', `# Boxuan Hu

## Education
- **B.Sc. in Computer Science** - Xi'an Jiaotong University (2022-2026)
  - GPA: Top 5%, Outstanding Student Scholarship
- **Visiting Student** - National University of Singapore (2024)
  - NUS SoC Bronze Medal
- **Visiting Student** - UC Berkeley (2024)
  - Sky Computing Lab

## Research Interests
Computer systems and networks

## Experience
- **Research Assistant** - ANTS Group, Xi'an Jiaotong University
  - Advisor: Prof. Yuedong Xu
  - Focus: Network systems, distributed computing
- **Research Assistant** - Sky Computing Lab, UC Berkeley
  - Focus: Cloud computing, distributed systems

## Skills
- Languages: Python, C/C++, Rust, Go, TypeScript
- Systems: Linux, Docker, Kubernetes
- Research: Paper writing, experiment design

## Contact
- GitHub: github.com/root-hbx
- Email: bxhu2004@gmail.com
- Website: bxhu2004.com
`),
        'research.md': file('research.md', `# Research

## Publications & Projects

### Network Systems
- Research on distributed systems and network optimization
- Focus on cloud computing infrastructure

### Sky Computing Lab (UC Berkeley)
- Worked on next-generation cloud computing platforms
- Studied resource management and scheduling

### ANTS Group (XJTU)
- Network measurement and analysis
- System performance optimization

## Academic Profiles
- OpenReview: openreview.net
- ResearchGate: researchgate.net
- ORCID: orcid.org
`),
      }),
      Projects: dir('Projects', {
        'archlinux-web': file('archlinux-web', 'Arch Linux desktop simulation personal homepage - Next.js + React + TypeScript'),
        'geek-bxhu-page': file('geek-bxhu-page', 'Previous personal homepage built with Next.js'),
        'dotfiles': file('dotfiles', 'Personal configuration files for Arch Linux + Hyprland setup'),
      }),
      Downloads: dir('Downloads', {}),
      Pictures: dir('Pictures', {
        'wallpapers': dir('wallpapers', {}),
      }),
      '.config': dir('.config', {
        hypr: dir('hypr', {
          'hyprland.conf': file('hyprland.conf', `# Hyprland Configuration
monitor=,preferred,auto,1

general {
    gaps_in = 3
    gaps_out = 6
    border_size = 2
    col.active_border = rgb(1793D1) rgb(89b4fa) 45deg
    col.inactive_border = rgb(45475a)
    layout = dwindle
}

decoration {
    rounding = 4
    blur {
        enabled = true
        size = 3
        passes = 1
    }
    drop_shadow = true
    shadow_range = 4
}

animations {
    enabled = true
    bezier = myBezier, 0.05, 0.9, 0.1, 1.05
    animation = windows, 1, 7, myBezier
    animation = windowsOut, 1, 7, default, popin 80%
    animation = fade, 1, 7, default
    animation = workspaces, 1, 6, default
}

input {
    kb_layout = us
    follow_mouse = 1
    sensitivity = 0
}

dwindle {
    pseudotile = true
    preserve_split = true
}

$mod = ALT

bind = $mod, Return, exec, alacritty
bind = $mod, D, exec, rofi -show drun
bind = $mod, Q, killactive
bind = $mod SHIFT, Q, exit
bind = $mod, Space, togglefloating
bind = $mod, F, fullscreen

bind = $mod, H, movefocus, l
bind = $mod, J, movefocus, d
bind = $mod, K, movefocus, u
bind = $mod, L, movefocus, r

bind = $mod, 1, workspace, 1
bind = $mod, 2, workspace, 2
bind = $mod, 3, workspace, 3
bind = $mod, 4, workspace, 4
bind = $mod, 5, workspace, 5
`),
        }),
        alacritty: dir('alacritty', {
          'alacritty.toml': file('alacritty.toml', `[font]
normal.family = "JetBrains Mono"
size = 11.0

[colors.primary]
background = "#1e1e2e"
foreground = "#cdd6f4"

[colors.normal]
black = "#45475a"
red = "#f38ba8"
green = "#a6e3a1"
yellow = "#f9e2af"
blue = "#89b4fa"
magenta = "#cba6f7"
cyan = "#89dceb"
white = "#bac2de"
`),
        }),
        waybar: dir('waybar', {
          'config.jsonc': file('config.jsonc', `{
    "layer": "top",
    "position": "top",
    "height": 32,
    "modules-left": ["hyprland/workspaces"],
    "modules-center": ["hyprland/window"],
    "modules-right": ["network", "pulseaudio", "battery", "clock"]
}`),
        }),
      }),
      '.bashrc': file('.bashrc', `# ~/.bashrc
export PS1="[\\u@\\h \\W]\\$ "
alias ls="ls --color=auto"
alias ll="ls -la"
alias grep="grep --color=auto"
alias vim="nvim"
`),
    }),
  }),
  etc: dir('etc', {
    'os-release': file('os-release', `NAME="Arch Linux"
PRETTY_NAME="Arch Linux"
ID=arch
BUILD_ID=rolling
ANSI_COLOR="38;2;23;147;209"
HOME_URL="https://archlinux.org/"
DOCUMENTATION_URL="https://wiki.archlinux.org/"
`),
    hostname: file('hostname', 'archlinux'),
  }),
  usr: dir('usr', {
    bin: dir('bin', {}),
    share: dir('share', {}),
  }),
  tmp: dir('tmp', {}),
})

export function resolvePath(fs: FSNode, path: string, cwd: string): FSNode | null {
  const absolutePath = path.startsWith('/')
    ? path
    : normalizePath(cwd + '/' + path)

  if (absolutePath === '/') return fs

  const parts = absolutePath.split('/').filter(Boolean)
  let current = fs

  for (const part of parts) {
    if (part === '.') continue
    if (part === '..') {
      // Go up - simplified, just skip
      continue
    }
    if (current.type !== 'dir' || !current.children) return null
    const child = current.children[part]
    if (!child) return null
    current = child
  }

  return current
}

export function normalizePath(path: string): string {
  const parts = path.split('/').filter(Boolean)
  const stack: string[] = []

  for (const part of parts) {
    if (part === '.') continue
    if (part === '..') {
      stack.pop()
    } else {
      stack.push(part)
    }
  }

  return '/' + stack.join('/')
}

export function getParentPath(path: string): string {
  const parts = path.split('/').filter(Boolean)
  parts.pop()
  return '/' + parts.join('/')
}
