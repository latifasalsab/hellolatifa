'use client'
import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useIsTouch } from '@/hooks/useIsTouch'

export default function Cursor() {
  const touch = useIsTouch(), rm = useReducedMotion()
  const x = useMotionValue(-100), y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 350, damping: 30 }), sy = useSpring(y, { stiffness: 350, damping: 30 })
  const [mode, setMode] = useState<string | null>(null)
  useEffect(() => {
    if (touch || rm) return
    const move = (e: PointerEvent) => { x.set(e.clientX); y.set(e.clientY) }
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest('[data-cursor],a,button')
      setMode(t ? t.getAttribute('data-cursor') || 'link' : null)
    }
    window.addEventListener('pointermove', move); window.addEventListener('pointerover', over)
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerover', over) }
  }, [touch, rm, x, y])
  if (touch || rm) return null
  const big = mode === 'view' || mode === 'private'
  const size = big ? 88 : mode ? 44 : 16
  return (
    <motion.div aria-hidden style={{ x: sx, y: sy }} className="pointer-events-none fixed left-0 top-0 z-[100]">
      <motion.div animate={{ width: size, height: size }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className={`-translate-x-1/2 -translate-y-1/2 grid place-items-center rounded-full font-mono text-[11px] uppercase text-espresso ${big ? 'bg-accent' : 'border border-fg/60'}`}>
        {mode === 'view' && 'View ↗'}{mode === 'private' && 'Private'}
      </motion.div>
    </motion.div>
  )
}
