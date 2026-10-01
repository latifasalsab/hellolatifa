'use client'
import { motion } from 'motion/react'
export default function SplitText({ text, delay = 0, play = true }: { text: string; delay?: number; play?: boolean }) {
  return (
    <span aria-label={text}>
      {[...text].map((c, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[.06em] align-bottom">
          <motion.span className="inline-block" initial={{ y: '110%' }} animate={{ y: play ? 0 : '110%' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: delay + i * 0.035 }}>
            {c === ' ' ? '\u00a0' : c}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
