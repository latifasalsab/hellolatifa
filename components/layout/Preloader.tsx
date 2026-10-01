'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { useLenis } from 'lenis/react'
import Asterisk from '@/components/ui/Asterisk'
import { usePreload } from '@/hooks/usePreload'
import { PRELOADER_MIN_MS, projects } from '@/data/site'

const IMAGES = ['/images/salsa.jpg', ...projects.slice(0, 2).map((p) => `/images/projects/${p.slug}.jpg`)]

export default function Preloader() {
  const rm = useReducedMotion()
  const lenis = useLenis()
  const [skip, setSkip] = useState(false)
  const [exit, setExit] = useState(false)
  const [gone, setGone] = useState(false)
  const real = usePreload(skip, IMAGES)
  const realRef = useRef(0)
  realRef.current = real
  const mv = useMotionValue(0)
  const sp = useSpring(mv, { stiffness: 200, damping: 30 })
  const text = useTransform(sp, (v) => `${Math.round(v)}%`)
  const bar = useTransform(sp, (v) => v / 100)

  // the inline <head> script already removed data-loading when this visit should skip the preloader
  useEffect(() => { if (document.documentElement.getAttribute('data-loading') !== 'true') { setSkip(true); setGone(true) } }, [])
  useEffect(() => {
    if (skip || gone) return
    lenis?.stop(); document.documentElement.style.overflow = 'hidden'
  }, [lenis, skip, gone])

  // counter: eased over the MINIMUM time, capped by real progress; hold 100% for 250ms, then exit
  useEffect(() => {
    if (skip || gone) return
    const min = rm ? 800 : PRELOADER_MIN_MS, t0 = performance.now()
    let raf = 0, ended = false, hold = 0
    const tick = () => {
      const t = Math.min(1, (performance.now() - t0) / min)
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      mv.set(Math.min(e * 100, realRef.current))
      if (t >= 1 && realRef.current >= 100 && !ended) { ended = true; mv.set(100); hold = window.setTimeout(() => setExit(true), 250); return }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); clearTimeout(hold) }
  }, [skip, gone, rm, mv])

  const finish = () => {
    sessionStorage.setItem('ls-pre', '1')
    document.documentElement.removeAttribute('data-loading') // navbar fades in (CSS, 400ms)
    document.documentElement.style.overflow = ''
    lenis?.start()
    setGone(true)
    window.setTimeout(() => window.dispatchEvent(new Event('preloader:done')), 400) // hero reveal + pill drop
  }
  if (gone) return null
  return (
    <motion.div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-bg"
      animate={exit ? (rm ? { opacity: 0 } : { y: '-100%' }) : {}} transition={{ duration: rm ? 0.4 : 0.9, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={() => exit && finish()}>
      <p className="font-display text-xl font-semibold">Salsa®</p>
      <Asterisk size={44} gradient spin className="mt-4" />
      {!rm && <motion.span className="mt-4 font-display text-[22vw] font-bold leading-none tracking-[-0.04em] md:text-[14vw]">{text}</motion.span>}
      <motion.div style={{ scaleX: rm ? 1 : bar }} className="absolute bottom-0 left-0 h-px w-full origin-left bg-fg" />
    </motion.div>
  )
}
