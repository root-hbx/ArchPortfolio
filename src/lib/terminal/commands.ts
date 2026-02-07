import { executeBuiltin, TerminalState, CommandResult } from './builtins'
import { getNeofetchOutput } from './neofetch'

export function executeCommand(
  input: string,
  state: TerminalState,
  openApp: (appId: string) => void
): CommandResult {
  const trimmed = input.trim()
  if (!trimmed) return { output: '' }

  const parts = trimmed.split(/\s+/)
  const cmd = parts[0]
  const args = parts.slice(1)

  // Special commands
  if (cmd === 'neofetch') {
    return { output: getNeofetchOutput() }
  }

  if (cmd === 'pacman') {
    return cmdPacman(args)
  }

  if (cmd === 'open') {
    return cmdOpen(args, openApp)
  }

  if (cmd === 'sudo') {
    if (args.length === 0) return { output: 'usage: sudo <command>' }
    return executeCommand(args.join(' '), state, openApp)
  }

  if (cmd === 'man') {
    if (args.length === 0) return { output: 'What manual page do you want?' }
    return { output: `No manual entry for ${args[0]}` }
  }

  if (cmd === 'vim' || cmd === 'nvim' || cmd === 'nano') {
    openApp('texteditor')
    return { output: `Opening ${cmd}...` }
  }

  if (cmd === 'firefox' || cmd === 'chromium' || cmd === 'chrome' || cmd === 'google-chrome') {
    openApp('browser')
    return { output: `Opening Chrome...` }
  }

  if (cmd === 'htop' || cmd === 'btop') {
    openApp('sysmonitor')
    return { output: `Opening system monitor...` }
  }

  if (cmd === 'thunar' || cmd === 'ranger' || cmd === 'nnn') {
    openApp('filemanager')
    return { output: `Opening file manager...` }
  }

  // Try builtins
  const result = executeBuiltin(cmd, args, state)
  if (result) return result

  return { output: `bash: ${cmd}: command not found` }
}

function cmdPacman(args: string[]): CommandResult {
  if (args.includes('-Syu') || args.includes('-Syyu')) {
    return {
      output: `:: Synchronizing package databases...
 core is up to date
 extra is up to date
 multilib is up to date
:: Starting full system upgrade...
 there is nothing to do`,
    }
  }

  if (args.includes('-Ss') && args.length > 1) {
    const query = args[args.indexOf('-Ss') + 1] || args[args.length - 1]
    return {
      output: `extra/${query} 1.0.0-1
    ${query} package description
extra/${query}-git 1.0.0.r42.g1234567-1 (AUR)
    ${query} development version`,
    }
  }

  if (args.includes('-Q')) {
    return {
      output: `alacritty 0.13.2-1
base 3-2
base-devel 1-2
firefox 131.0-1
git 2.47.0-1
hyprland 0.44.1-4
neovim 0.10.2-2
nodejs 23.0.0-1
python 3.12.7-1
waybar 0.11.0-3
zsh 5.9-5`,
    }
  }

  if (args.includes('-Si') && args.length > 1) {
    const pkg = args[args.length - 1]
    return {
      output: `Repository      : extra
Name            : ${pkg}
Version         : 1.0.0-1
Description     : ${pkg} package
Architecture    : x86_64
Licenses        : MIT
Installed Size  : 10.24 MiB
Packager        : Arch Linux Package Maintainer`,
    }
  }

  return {
    output: `usage:  pacman <operation> [...]
operations:
    pacman -Q    query the package database
    pacman -Ss   search for packages
    pacman -Si   show package info
    pacman -Syu  upgrade all packages`,
  }
}

function cmdOpen(args: string[], openApp: (appId: string) => void): CommandResult {
  if (args.length === 0) {
    return { output: 'Usage: open <app>\nApps: terminal, files, neovim, chrome, about, settings, sysmonitor' }
  }

  const appMap: Record<string, string> = {
    terminal: 'terminal',
    term: 'terminal',
    files: 'filemanager',
    filemanager: 'filemanager',
    thunar: 'filemanager',
    neovim: 'texteditor',
    nvim: 'texteditor',
    vim: 'texteditor',
    editor: 'texteditor',
    chrome: 'browser',
    'google-chrome': 'browser',
    firefox: 'browser',
    browser: 'browser',
    about: 'about',
    settings: 'settings',
    sysmonitor: 'sysmonitor',
    htop: 'sysmonitor',
    monitor: 'sysmonitor',
  }

  const appId = appMap[args[0].toLowerCase()]
  if (!appId) {
    return { output: `open: '${args[0]}': application not found` }
  }

  openApp(appId)
  return { output: `Opening ${args[0]}...` }
}
