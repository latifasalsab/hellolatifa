'use client'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import Asterisk from './Asterisk'

export default function ArtShape({ variant = 'asterisk', className = '', blur = '', speed = 0.1, spin = false }: { variant?: 'asterisk' | 'blob' | 'halfCircle' | 'arch'; className?: string; blur?: string; speed?: number; spin?: boolean }) {
  const rm = useReducedMotion()
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, (v) => (rm ? 0 : -v * speed))
  const shape = variant === 'blob' ? 'rounded-[60%_40%_55%_45%]' : 'rounded-t-full'
  return (
    <motion.div aria-hidden style={{ y }} className={`pointer-events-none absolute ${variant === 'asterisk' ? 'aspect-square' : ''} ${blur} ${className}`}>
      {variant === 'asterisk' ? <Asterisk size="100%" gradient spin={spin && !rm} /> : <div className={`art-grad h-full w-full ${shape}`} />}
    </motion.div>
  )
}
