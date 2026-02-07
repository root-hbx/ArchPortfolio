import { filesystem, resolvePath, normalizePath, FSNode } from './filesystem'

export interface TerminalState {
  cwd: string
  history: string[]
  env: Record<string, string>
}

export interface CommandResult {
  output: string
  newCwd?: string
}

export function executeBuiltin(
  cmd: string,
  args: string[],
  state: TerminalState
): CommandResult | null {
  switch (cmd) {
    case 'ls':
      return cmdLs(args, state)
    case 'cd':
      return cmdCd(args, state)
    case 'cat':
      return cmdCat(args, state)
    case 'pwd':
      return { output: state.cwd }
    case 'clear':
      return { output: '\x1b[CLEAR]' }
    case 'whoami':
      return { output: 'boxuan' }
    case 'hostname':
      return { output: 'archlinux' }
    case 'uname':
      return cmdUname(args)
    case 'date':
      return { output: new Date().toString() }
    case 'echo':
      return { output: args.join(' ') }
    case 'help':
      return cmdHelp()
    case 'history':
      return { output: state.history.map((h, i) => `  ${i + 1}  ${h}`).join('\n') }
    case 'mkdir':
      return { output: `mkdir: cannot create directory: Read-only file system` }
    case 'touch':
      return { output: `touch: cannot touch: Read-only file system` }
    case 'rm':
      return { output: `rm: cannot remove: Read-only file system` }
    case 'head':
      return cmdHead(args, state)
    case 'tree':
      return cmdTree(args, state)
    case 'which':
      return cmdWhich(args)
    case 'type':
      return cmdWhich(args)
    case 'alias':
      return { output: "alias ls='ls --color=auto'\nalias ll='ls -la'\nalias grep='grep --color=auto'\nalias vim='nvim'" }
    case 'env':
      return { output: Object.entries(state.env).map(([k, v]) => `${k}=${v}`).join('\n') }
    case 'export':
      return { output: '' }
    default:
      return null
  }
}

function cmdLs(args: string[], state: TerminalState): CommandResult {
  const showAll = args.includes('-a') || args.includes('-la') || args.includes('-al')
  const showLong = args.includes('-l') || args.includes('-la') || args.includes('-al')
  const targetPath = args.find((a) => !a.startsWith('-')) || state.cwd

  const node = resolvePath(filesystem, targetPath, state.cwd)
  if (!node) return { output: `ls: cannot access '${targetPath}': No such file or directory` }
  if (node.type === 'file') return { output: node.name }
  if (!node.children) return { output: '' }

  let entries = Object.keys(node.children)
  if (showAll) entries = ['.', '..', ...entries]

  if (showLong) {
    const lines = entries.map((name) => {
      if (name === '.' || name === '..') {
        return `drwxr-xr-x  boxuan boxuan  4096  ${name}`
      }
      const child = node.children![name]
      if (!child) return ''
      const type = child.type === 'dir' ? 'd' : '-'
      const size = child.content ? child.content.length : 4096
      return `${type}rwxr-xr-x  boxuan boxuan  ${String(size).padStart(5)}  ${formatColor(name, child.type)}`
    })
    return { output: `total ${entries.length}\n${lines.join('\n')}` }
  }

  const colored = entries.map((name) => {
    if (name === '.' || name === '..') return name
    const child = node.children![name]
    return formatColor(name, child?.type || 'file')
  })

  return { output: colored.join('  ') }
}

function formatColor(name: string, type: string): string {
  if (type === 'dir') return `\x1b[1;34m${name}\x1b[0m`
  if (name.startsWith('.')) return `\x1b[2m${name}\x1b[0m`
  return name
}

function cmdCd(args: string[], state: TerminalState): CommandResult {
  const target = args[0] || '/home/boxuan'

  if (target === '~') {
    return { output: '', newCwd: '/home/boxuan' }
  }

  const resolved = target.startsWith('/')
    ? target
    : normalizePath(state.cwd + '/' + target)

  const node = resolvePath(filesystem, resolved, '/')
  if (!node) return { output: `cd: no such file or directory: ${target}` }
  if (node.type !== 'dir') return { output: `cd: not a directory: ${target}` }

  return { output: '', newCwd: normalizePath(resolved) }
}

function cmdCat(args: string[], state: TerminalState): CommandResult {
  if (args.length === 0) return { output: 'cat: missing operand' }

  const results: string[] = []
  for (const arg of args) {
    const node = resolvePath(filesystem, arg, state.cwd)
    if (!node) {
      results.push(`cat: ${arg}: No such file or directory`)
    } else if (node.type === 'dir') {
      results.push(`cat: ${arg}: Is a directory`)
    } else {
      results.push(node.content || '')
    }
  }
  return { output: results.join('\n') }
}

function cmdUname(args: string[]): CommandResult {
  if (args.includes('-a')) {
    return { output: 'Linux archlinux 6.12.4-arch1-1 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux' }
  }
  if (args.includes('-r')) return { output: '6.12.4-arch1-1' }
  return { output: 'Linux' }
}

function cmdHead(args: string[], state: TerminalState): CommandResult {
  const file = args.find((a) => !a.startsWith('-'))
  if (!file) return { output: 'head: missing operand' }

  let lines = 10
  const nIdx = args.indexOf('-n')
  if (nIdx !== -1 && args[nIdx + 1]) {
    lines = parseInt(args[nIdx + 1]) || 10
  }

  const node = resolvePath(filesystem, file, state.cwd)
  if (!node) return { output: `head: ${file}: No such file or directory` }
  if (node.type === 'dir') return { output: `head: ${file}: Is a directory` }

  return { output: (node.content || '').split('\n').slice(0, lines).join('\n') }
}

function cmdTree(args: string[], state: TerminalState): CommandResult {
  const targetPath = args.find((a) => !a.startsWith('-')) || state.cwd
  const node = resolvePath(filesystem, targetPath, state.cwd)
  if (!node) return { output: `tree: '${targetPath}': No such file or directory` }
  if (node.type === 'file') return { output: node.name }

  const lines: string[] = ['.']
  function walk(n: FSNode, prefix: string, isLast: boolean) {
    if (!n.children) return
    const entries = Object.entries(n.children)
    entries.forEach(([name, child], i) => {
      const last = i === entries.length - 1
      const connector = last ? '└── ' : '├── '
      const color = child.type === 'dir' ? `\x1b[1;34m${name}\x1b[0m` : name
      lines.push(prefix + connector + color)
      if (child.type === 'dir') {
        walk(child, prefix + (last ? '    ' : '│   '), last)
      }
    })
  }
  walk(node, '', true)
  return { output: lines.join('\n') }
}

function cmdWhich(args: string[]): CommandResult {
  const builtins = ['ls', 'cd', 'cat', 'pwd', 'clear', 'whoami', 'uname', 'date', 'echo', 'help', 'history', 'neofetch', 'pacman', 'open']
  if (args.length === 0) return { output: '' }
  const cmd = args[0]
  if (builtins.includes(cmd)) {
    return { output: `/usr/bin/${cmd}` }
  }
  return { output: `${cmd} not found` }
}

function cmdHelp(): CommandResult {
  return {
    output: `Available commands:
  ls [path]        - List directory contents
  cd [path]        - Change directory
  cat <file>       - Display file contents
  pwd              - Print working directory
  clear            - Clear terminal
  whoami           - Print current user
  hostname         - Print hostname
  uname [-a|-r]    - Print system information
  date             - Print current date/time
  echo [text]      - Print text
  history          - Show command history
  head [-n N] file - Show first N lines of file
  tree [path]      - Show directory tree
  which <cmd>      - Show command location
  alias            - Show aliases
  env              - Show environment variables
  neofetch         - Show system info with ASCII art
  pacman [-Syu]    - Package manager (simulated)
  open <app>       - Open an application
  help             - Show this help message`,
  }
}
