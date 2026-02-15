'use client'

import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import BootScreen from '@/components/boot/BootScreen'
import LoginScreen from '@/components/boot/LoginScreen'
import Desktop from '@/components/desktop/Desktop'
import { useDesktopStore } from '@/store/desktopStore'
import { Phase } from '@/types'

export default function Home() {
  const bootCompleted = useDesktopStore((s) => s.bootCompleted)
  const setBootCompleted = useDesktopStore((s) => s.setBootCompleted)
  const bootFontSize = useDesktopStore((s) => s.bootFontSize)
  const desktopFontSize = useDesktopStore((s) => s.desktopFontSize)
  const [phase, setPhase] = useState<Phase>('boot')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const size = phase === 'desktop' ? desktopFontSize : bootFontSize
    document.documentElement.style.fontSize = `${size}px`
  }, [phase, bootFontSize, desktopFontSize])

  const handleBootComplete = useCallback(() => {
    setBootCompleted()
    setPhase('login')
  }, [setBootCompleted])

  const handleLoginComplete = useCallback(() => {
    setPhase('desktop')
  }, [])

  if (!mounted) {
    return (
      <div className="fixed inset-0 bg-ctp-crust" />
    )
  }

  return (
    <main className="fixed inset-0 overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === 'boot' && (
          <BootScreen
            key="boot"
            onComplete={handleBootComplete}
            skipBoot={bootCompleted}
          />
        )}
        {phase === 'login' && (
          <LoginScreen
            key="login"
            onComplete={handleLoginComplete}
          />
        )}
        {phase === 'desktop' && (
          <Desktop key="desktop" />
        )}
      </AnimatePresence>
    </main>
  )
}
