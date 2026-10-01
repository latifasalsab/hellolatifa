'use client'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { statuses } from '@/data/site'
import Asterisk from '@/components/ui/Asterisk'

export default function StatusTicker() {
  const [n, setN] = useState(0)
  const [paused, setPaused] = useState(false)
  const rm = useReducedMotion()
  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setN((v) => v + 1), 3000)
    return () => clearInterval(id)
  }, [paused])
  return (
    <div className="flex items-center gap-2" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <motion.span animate={{ rotate: rm ? 0 : n * 90 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }} className="inline-flex text-accent">
        <Asterisk size={12} spin={!rm} />
      </motion.span>
      <div aria-live="polite" className="relative h-4 w-40 overflow-hidden font-mono text-xs uppercase leading-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={n} className="block whitespace-nowrap"
            initial={rm ? { opacity: 0 } : { y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            exit={rm ? { opacity: 0 } : { y: '-100%', opacity: 0 }} transition={{ duration: 0.35 }}>
            {statuses[n % statuses.length]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  )
}
