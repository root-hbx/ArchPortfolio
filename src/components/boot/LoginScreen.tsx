'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface LoginScreenProps {
  onComplete: () => void
}

export default function LoginScreen({ onComplete }: LoginScreenProps) {
  const [stage, setStage] = useState<'username' | 'password' | 'logging-in'>('username')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [stage])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return

    if (stage === 'username') {
      if (username.trim()) {
        setStage('password')
      }
    } else if (stage === 'password') {
      setStage('logging-in')
      setTimeout(onComplete, 600)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 bg-ctp-crust flex flex-col items-start justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onMouseDown={() => {
        setTimeout(() => inputRef.current?.focus(), 0)
      }}
    >
      <div className="text-sm space-y-1 max-w-xl">
        <div className="text-ctp-text mb-4">
          <pre className="text-arch-blue text-xs leading-tight">{`
                  /#\\
                 /###\\
                /#####\\
               /#######\\
              _ "=######\\
             /##=,_\\#####\\
            /#############\\
           /###############\\
          /#################\\
         /###################\\
        /########*"""*########\\
       /#######/       \\#######\\
      /########         ########\\
     /#########         ######m=,_
    /##########         ##########\\
   /######***             ***######\\
  /###**                       **###\\
 /**                               **\\\\
`}</pre>
        </div>
        <div className="text-ctp-subtext0 mb-2">Hello Visitors ^_^</div>
        <div className="text-ctp-subtext0 mb-2">Welcome to Boxuan Hu's Website</div>
        <br></br>
        <div className="mb-4" />

        <div className="flex items-center">
          <span className="text-ctp-text whitespace-nowrap">visitor login:&nbsp;</span>
          {stage === 'username' ? (
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent outline-none text-ctp-green caret-ctp-green w-full relative z-10"
                autoFocus
                spellCheck={false}
              />
              {!username && (
                <span className="absolute left-0 top-0 text-ctp-surface2 opacity-60 pointer-events-none whitespace-nowrap">
                  Please type anything you like to start
                </span>
              )}
            </div>
          ) : (
            <span className="text-ctp-green">{username}</span>
          )}
        </div>

        {(stage === 'password' || stage === 'logging-in') && (
          <div className="flex items-center">
            <span className="text-ctp-text whitespace-nowrap">Password:&nbsp;</span>
            {stage === 'password' ? (
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent outline-none text-ctp-text caret-ctp-text w-full relative z-10"
                  autoFocus
                  spellCheck={false}
                />
                {!password && (
                  <span className="absolute left-0 top-0 text-ctp-surface2 opacity-60 pointer-events-none whitespace-nowrap">
                    Please type anything you like to start
                  </span>
                )}
              </div>
            ) : null}
          </div>
        )}

        {stage === 'logging-in' && (
          <div className="text-ctp-green mt-2">
            Last login: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()} on tty1
          </div>
        )}
      </div>
    </motion.div>
  )
}
