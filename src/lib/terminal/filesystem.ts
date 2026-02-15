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
      Resumes: dir('Resumes', {
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
      Pictures: dir('Pictures', {
        'arch-default.svg': file('arch-default.svg', '[image: arch-default.svg]'),
        'arch-default.png': file('arch-default.png', '[image: arch-default.png]'),
        'arch-dark.svg': file('arch-dark.svg', '[image: arch-dark.svg]'),
        'arch-minimal.svg': file('arch-minimal.svg', '[image: arch-minimal.svg]'),
        'arch-blue.png': file('arch-blue.png', '[image: arch-blue.png]'),
        'arch-mont.png': file('arch-mont.png', '[image: arch-mont.png]'),
        'arch-sunset.png': file('arch-sunset.png', '[image: arch-sunset.png]'),
      }),
      Misc: dir('Misc', {}),
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
