# Arch Linux Desktop Simulation

A personal portfolio website simulating an **Arch Linux + Hyprland** tiling window manager desktop environment, built with Next.js and React.

**Live Demo:** [https://root-hbx.github.io/archlinux-web](https://root-hbx.github.io/archlinux-web)

[中文文档](./README-CN.md)

![Desktop Screenshot](./public/wallpapers/default.png)

## Tech Stack

- **Next.js 14** (App Router) + TypeScript + React 18
- **Tailwind CSS** with Catppuccin Mocha color palette
- **Zustand** for state management
- **Framer Motion** for animations
- **Static Export** for GitHub Pages deployment

## Features

- **Boot Sequence** — Systemd-style boot animation with TTY login prompt
- **Tiling Window Manager** — Binary tree layout with draggable split handles and 6px gaps
- **Terminal Emulator** — Functional shell with `ls`, `cd`, `cat`, `neofetch`, `pacman` and more
- **Chrome Browser** — Embedded iframe browser with URL bar and navigation
- **App Launcher** — Rofi-style overlay to search and launch apps
- **Multiple Workspaces** — Switch between 5 independent workspaces
- **Floating Windows** — Toggle windows between tiled and floating mode

## Getting Started

```bash
# Clone the repository
git clone https://github.com/root-hbx/archlinux-web.git
cd archlinux-web

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

```bash
# Build for production (static export)
npm run build

# Output is in the /out directory
```

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + Enter` | New terminal |
| `Ctrl + D` | Toggle app launcher |
| `Ctrl + Q` | Close focused window |
| `Ctrl + 1-5` | Switch workspace |
| `Ctrl + H/J/K/L` | Move focus (vim keys) |
| `Ctrl + Space` | Toggle float mode |
| `Ctrl + F` | Toggle fullscreen |

## Project Structure

```
src/
├── app/                  # Next.js App Router
├── components/
│   ├── apps/             # Terminal, Browser, Settings, etc.
│   ├── boot/             # Boot screen & login prompt
│   ├── desktop/          # Top bar, bottom dock, wallpaper
│   ├── launcher/         # Rofi app launcher
│   └── wm/               # Tiling layout, tile nodes, split handles
├── hooks/                # Keyboard shortcuts
├── lib/
│   ├── terminal/         # Virtual filesystem, commands, neofetch
│   └── wm/               # Binary tree & layout computation
├── store/                # Zustand stores
└── types/
```

## License

MIT
