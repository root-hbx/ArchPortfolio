export function getNeofetchOutput(): string {
  const art = [
    '                   -\`',
    '                  .o+\`',
    '                 \`ooo/',
    '                \`+oooo:',
    '               \`+oooooo:',
    '               -+oooooo+:',
    '             \`/:-:++oooo+:',
    '            \`/++++/+++++++:',
    '           \`/++++++++++++++:',
    '          \`/+++ooooooooooooo/\`',
    '         ./ooosssso++osssssso+\`',
    '        .oossssso-\`\`\`\`/ossssss+\`',
    '       -osssssso.      :ssssssso.',
    '      :osssssss/        osssso+++.',
    '     /ossssssss/        +ssssooo/-',
    '   \`/ossssso+/:-        -:/+osssso+-',
    '  \`+sso+:-\`                 \`.-/+oso:',
    ' \`++:.                           \`-/+/',
    ' .\`                                 \`/',
  ]

  const now = new Date()
  const upMinutes = Math.floor(Math.random() * 180 + 30)
  const upH = Math.floor(upMinutes / 60)
  const upM = upMinutes % 60

  const info = [
    '\x1b[1;34mboxuan\x1b[0m@\x1b[1;34marchlinux\x1b[0m',
    '─────────────────',
    `\x1b[1;34mOS\x1b[0m: Arch Linux x86_64`,
    `\x1b[1;34mHost\x1b[0m: Hyprland Desktop Simulation`,
    `\x1b[1;34mKernel\x1b[0m: 6.12.4-arch1-1`,
    `\x1b[1;34mUptime\x1b[0m: ${upH} hours, ${upM} mins`,
    `\x1b[1;34mPackages\x1b[0m: 1247 (pacman)`,
    `\x1b[1;34mShell\x1b[0m: bash 5.2.37`,
    `\x1b[1;34mDE\x1b[0m: Hyprland`,
    `\x1b[1;34mWM\x1b[0m: Hyprland (Wayland)`,
    `\x1b[1;34mTheme\x1b[0m: Catppuccin Mocha`,
    `\x1b[1;34mTerminal\x1b[0m: Alacritty`,
    `\x1b[1;34mCPU\x1b[0m: AMD Ryzen 7 7840HS (16) @ 5.1GHz`,
    `\x1b[1;34mGPU\x1b[0m: AMD Radeon 780M`,
    `\x1b[1;34mMemory\x1b[0m: 4821MiB / 32768MiB`,
    '',
    '\x1b[40m  \x1b[41m  \x1b[42m  \x1b[43m  \x1b[44m  \x1b[45m  \x1b[46m  \x1b[47m  \x1b[0m',
  ]

  const lines: string[] = []
  const maxLen = Math.max(art.length, info.length)

  for (let i = 0; i < maxLen; i++) {
    const artLine = i < art.length ? art[i] : ''
    const infoLine = i < info.length ? info[i] : ''
    const paddedArt = artLine.padEnd(40)
    lines.push(`\x1b[1;34m${paddedArt}\x1b[0m${infoLine}`)
  }

  return lines.join('\n')
}
