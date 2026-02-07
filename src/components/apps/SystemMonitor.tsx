'use client'

import { useState, useEffect } from 'react'

interface Process {
  pid: number
  user: string
  cpu: number
  mem: number
  command: string
}

const mockProcesses: Process[] = [
  { pid: 1, user: 'root', cpu: 0.0, mem: 0.1, command: 'systemd' },
  { pid: 245, user: 'root', cpu: 0.1, mem: 0.3, command: 'dbus-daemon' },
  { pid: 312, user: 'boxuan', cpu: 2.1, mem: 3.4, command: 'Hyprland' },
  { pid: 385, user: 'boxuan', cpu: 0.5, mem: 1.2, command: 'waybar' },
  { pid: 412, user: 'boxuan', cpu: 0.3, mem: 0.8, command: 'pipewire' },
  { pid: 456, user: 'boxuan', cpu: 0.2, mem: 0.5, command: 'pipewire-pulse' },
  { pid: 523, user: 'boxuan', cpu: 8.4, mem: 5.2, command: 'firefox' },
  { pid: 678, user: 'boxuan', cpu: 1.2, mem: 2.1, command: 'alacritty' },
  { pid: 742, user: 'boxuan', cpu: 0.0, mem: 0.4, command: 'dunst' },
  { pid: 801, user: 'boxuan', cpu: 15.2, mem: 8.7, command: 'node (next dev)' },
  { pid: 834, user: 'boxuan', cpu: 0.1, mem: 0.2, command: 'zsh' },
  { pid: 912, user: 'root', cpu: 0.0, mem: 0.1, command: 'NetworkManager' },
  { pid: 1023, user: 'boxuan', cpu: 3.5, mem: 4.3, command: 'nvim' },
  { pid: 1156, user: 'root', cpu: 0.1, mem: 0.3, command: 'bluetooth' },
  { pid: 1234, user: 'boxuan', cpu: 0.4, mem: 1.5, command: 'thunar' },
]

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="w-full h-2 bg-ctp-surface0 rounded-sm overflow-hidden">
      <div
        className="h-full transition-all duration-500 rounded-sm"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  )
}

export default function SystemMonitor() {
  const [cpuUsage, setCpuUsage] = useState(32)
  const [memUsage, setMemUsage] = useState(48)
  const [processes, setProcesses] = useState(mockProcesses)

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage((prev) => Math.max(5, Math.min(95, prev + (Math.random() - 0.5) * 10)))
      setMemUsage((prev) => Math.max(30, Math.min(85, prev + (Math.random() - 0.5) * 5)))

      setProcesses((prev) =>
        prev.map((p) => ({
          ...p,
          cpu: Math.max(0, p.cpu + (Math.random() - 0.5) * 2),
          mem: Math.max(0, p.mem + (Math.random() - 0.5) * 0.5),
        }))
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const sortedProcesses = [...processes].sort((a, b) => b.cpu - a.cpu)

  return (
    <div className="w-full h-full bg-ctp-base text-ctp-text flex flex-col text-xs overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-ctp-mantle border-b border-ctp-surface0 shrink-0">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-ctp-blue font-bold">CPU</span>
              <span className="text-ctp-subtext0">{cpuUsage.toFixed(1)}%</span>
            </div>
            <ProgressBar value={cpuUsage} max={100} color="#89b4fa" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-ctp-green font-bold">MEM</span>
              <span className="text-ctp-subtext0">{memUsage.toFixed(1)}% (15.7G/32G)</span>
            </div>
            <ProgressBar value={memUsage} max={100} color="#a6e3a1" />
          </div>
        </div>
        <div className="flex gap-4 mt-2 text-ctp-overlay0">
          <span>Tasks: {processes.length}</span>
          <span>Uptime: {Math.floor(Math.random() * 3 + 1)}h {Math.floor(Math.random() * 60)}m</span>
          <span>Load: {(cpuUsage / 25).toFixed(2)} {(cpuUsage / 30).toFixed(2)} {(cpuUsage / 35).toFixed(2)}</span>
        </div>
      </div>

      {/* Process list */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-ctp-mantle">
            <tr className="text-left text-ctp-overlay0">
              <th className="px-2 py-1 w-16">PID</th>
              <th className="px-2 py-1 w-20">USER</th>
              <th className="px-2 py-1 w-16 text-right">CPU%</th>
              <th className="px-2 py-1 w-16 text-right">MEM%</th>
              <th className="px-2 py-1">COMMAND</th>
            </tr>
          </thead>
          <tbody>
            {sortedProcesses.map((p) => (
              <tr
                key={p.pid}
                className="hover:bg-ctp-surface0 transition-colors"
              >
                <td className="px-2 py-0.5 text-ctp-overlay0">{p.pid}</td>
                <td className="px-2 py-0.5 text-ctp-subtext0">{p.user}</td>
                <td className={`px-2 py-0.5 text-right ${
                  p.cpu > 10 ? 'text-ctp-red' : p.cpu > 5 ? 'text-ctp-yellow' : 'text-ctp-text'
                }`}>
                  {p.cpu.toFixed(1)}
                </td>
                <td className={`px-2 py-0.5 text-right ${
                  p.mem > 5 ? 'text-ctp-yellow' : 'text-ctp-text'
                }`}>
                  {p.mem.toFixed(1)}
                </td>
                <td className="px-2 py-0.5 text-ctp-green">{p.command}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
