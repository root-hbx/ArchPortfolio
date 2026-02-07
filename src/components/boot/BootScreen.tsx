'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const bootMessages = [
  { text: 'systemd 256.2 running in system mode', type: 'info' },
  { text: 'Detected architecture x86-64', type: 'info' },
  { text: 'Hostname set to <archlinux>', type: 'ok' },
  { text: 'Reached target - Local File Systems (Pre)', type: 'ok' },
  { text: 'Starting Remount Root and Kernel File Systems...', type: 'info' },
  { text: 'Finished Remount Root and Kernel File Systems', type: 'ok' },
  { text: 'Reached target - Local File Systems', type: 'ok' },
  { text: 'Starting Create Volatile Files and Directories...', type: 'info' },
  { text: 'Finished Create Volatile Files and Directories', type: 'ok' },
  { text: 'Starting Network Manager...', type: 'info' },
  { text: 'Started Network Manager', type: 'ok' },
  { text: 'Reached target - Network', type: 'ok' },
  { text: 'Starting Bluetooth service...', type: 'info' },
  { text: 'Started Bluetooth service', type: 'ok' },
  { text: 'Starting PipeWire Audio Service...', type: 'info' },
  { text: 'Started PipeWire Audio Service', type: 'ok' },
  { text: 'Starting D-Bus System Message Bus...', type: 'info' },
  { text: 'Started D-Bus System Message Bus', type: 'ok' },
  { text: 'Starting CUPS Printing Service...', type: 'info' },
  { text: 'Finished Loading Kernel Modules', type: 'ok' },
  { text: 'Starting Apply Kernel Variables...', type: 'info' },
  { text: 'Finished Apply Kernel Variables', type: 'ok' },
  { text: 'Starting Hyprland Compositor on :0...', type: 'info' },
  { text: 'Started Hyprland Compositor on :0', type: 'ok' },
  { text: 'Starting Waybar Status Bar...', type: 'info' },
  { text: 'Started Waybar Status Bar', type: 'ok' },
  { text: 'Reached target - Graphical Interface', type: 'ok' },
  { text: 'Startup finished in 1.842s (kernel) + 2.156s (userspace) = 3.998s', type: 'info' },
]

interface BootScreenProps {
  onComplete: () => void
  skipBoot: boolean
}

export default function BootScreen({ onComplete, skipBoot }: BootScreenProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (skipBoot) {
      onComplete()
      return
    }

    let lineIndex = 0
    const timer = setInterval(() => {
      lineIndex++
      setVisibleLines(lineIndex)

      if (lineIndex >= bootMessages.length) {
        clearInterval(timer)
        setTimeout(onComplete, 800)
      }
    }, 80 + Math.random() * 120)

    return () => clearInterval(timer)
  }, [onComplete, skipBoot])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [visibleLines])

  if (skipBoot) return null

  return (
    <motion.div
      className="fixed inset-0 bg-ctp-crust overflow-hidden flex flex-col p-4"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div ref={containerRef} className="flex-1 overflow-y-auto text-sm leading-relaxed">
        {bootMessages.slice(0, visibleLines).map((msg, i) => (
          <div key={i} className="flex gap-2">
            {msg.type === 'ok' ? (
              <span className="boot-ok font-bold">[  OK  ]</span>
            ) : (
              <span className="boot-info">[ INFO ]</span>
            )}
            <span className="text-ctp-text">{msg.text}</span>
          </div>
        ))}
        {visibleLines < bootMessages.length && (
          <span className="cursor-blink text-ctp-text">_</span>
        )}
      </div>
    </motion.div>
  )
}
