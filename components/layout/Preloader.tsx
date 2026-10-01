'use client'
import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { useLenis } from 'lenis/react'
import Asterisk from '@/components/ui/Asterisk'
import { usePreload } from '@/hooks/usePreload'
import { projects } from '@/data/site'

const IMAGES = ['/images/salsa.jpg', ...projects.slice(0, 2).map((p) => `/images/projects/${p.slug}.jpg`)]

export default function Preloader() {
  const rm = useReducedMotion()
  const lenis = useLenis()
  const [skip, setSkip] = useState(false)
  const [exit, setExit] = useState(false)
  const [gone, setGone] = useState(false)
  const { progress, done } = usePreload(skip, IMAGES)
  const mv = useMotionValue(0)
  const sp = useSpring(mv, { stiffness: 80, damping: 20 })
  const text = useTransform(sp, (v) => `${Math.round(v)}%`)
  const bar = useTransform(sp, (v) => v / 100)
  mv.set(progress)

  useEffect(() => { if (sessionStorage.getItem('ls-pre')) { setSkip(true); setGone(true) } }, [])
  useEffect(() => {
    if (skip || gone) return
    lenis?.stop(); document.documentElement.style.overflow = 'hidden'
  }, [lenis, skip, gone])
  useEffect(() => { if (done) { const t = setTimeout(() => setExit(true), 350); return () => clearTimeout(t) } }, [done])

  const finish = () => {
    sessionStorage.setItem('ls-pre', '1') // set before the event so a late listener still sees it
    window.dispatchEvent(new Event('preloader:done'))
    lenis?.start(); document.documentElement.style.overflow = ''
    setGone(true)
  }
  if (gone) return null
  return (
    <motion.div className="fixed inset-0 z-[95] flex flex-col items-center justify-center bg-bg"
      animate={exit ? (rm ? { opacity: 0 } : { y: '-100%' }) : {}} transition={{ duration: rm ? 0.4 : 0.9, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={() => exit && finish()}>
      <p className="flex items-center gap-3 font-display text-xl font-semibold">Salsa® <Asterisk size={20} spin={!rm} /></p>
      {!rm && <motion.span className="mt-4 font-display text-[22vw] font-bold leading-none tracking-[-0.04em] md:text-[14vw]">{text}</motion.span>}
      <motion.div style={{ scaleX: rm ? 1 : bar }} className="absolute bottom-0 left-0 h-px w-full origin-left bg-fg" />
    </motion.div>
  )
}
