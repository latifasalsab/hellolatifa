'use client'
import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'motion/react'
import Reveal from '@/components/ui/Reveal'
import Pill from '@/components/ui/Pill'
import Asterisk from '@/components/ui/Asterisk'
import ArtShape from '@/components/ui/ArtShape'
import SectionLabel from '@/components/ui/SectionLabel'
import { experience, type Exp } from '@/data/site'
import { useIsTouch } from '@/hooks/useIsTouch'

const initials = (e: Exp) => {
  const org = (e.label ? e.title.split('—')[0] : e.title.split('—').pop()) ?? e.title
  return org.split(' ').filter((w) => /^[A-Za-z]/.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join('')
}

function Row({ e, i, setHover }: { e: Exp; i: number; setHover: (n: number | null) => void }) {
  const ref = useRef<HTMLLIElement>(null)
  const [on, setOn] = useState(false)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', () => { const r = ref.current?.getBoundingClientRect(); if (r) setOn(r.top < window.innerHeight * 0.5) })
  return (
    <li ref={ref} className="relative pl-8 md:pl-12" onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)}>
      <motion.span aria-hidden className={`absolute left-0 top-10 z-10 -translate-x-1/2 ${on ? 'text-accent' : 'text-muted/40'}`}
        animate={{ rotate: on ? 90 : 0, scale: on ? 1.35 : 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}>
        <Asterisk size={14} />
      </motion.span>
      <Reveal delay={(i % 3) * 0.06}>
        <div className={`group relative grid gap-3 border-t py-8 transition-transform duration-300 hover:translate-x-2 md:grid-cols-12 md:gap-8 ${e.label ? 'border-dashed border-line' : 'border-line'}`}>
          <span aria-hidden className="pointer-events-none absolute -left-1 top-2 select-none font-display text-[6rem] font-bold leading-none text-transparent transition-all duration-300 [-webkit-text-stroke:1px_var(--line)] group-hover:translate-x-2 group-hover:[-webkit-text-stroke-color:var(--accent)] md:text-[9rem]">{String(i + 1).padStart(2, '0')}</span>
          <p className="relative z-10 font-mono text-xs uppercase text-muted md:col-span-3 md:pt-2">{e.date}</p>
          <div className="relative z-10 md:col-span-9">
            {e.label && <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-muted">{e.label}</p>}
            <h3 className="font-display text-2xl font-semibold tracking-tight decoration-accent decoration-4 underline-offset-8 group-hover:underline md:text-4xl">{e.title}</h3>
            <p className="mt-3 max-w-2xl text-muted">{e.text}</p>
            <div className="mt-4 flex flex-wrap gap-2">{e.chips.map((c) => <Pill key={c}>{c}</Pill>)}</div>
          </div>
        </div>
      </Reveal>
    </li>
  )
}

export default function Journey() {
  const rm = useReducedMotion(), touch = useIsTouch()
  const list = useRef<HTMLOListElement>(null)
  const [hover, setHover] = useState<number | null>(null)
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 0.5', 'end 0.5'] })
  const spring = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const mx = useMotionValue(0), my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 300, damping: 30 }), sy = useSpring(my, { stiffness: 300, damping: 30 })
  const showPreview = !rm && !touch
  const cur = hover !== null ? experience[hover] : null

  return (
    <section id="journey" aria-labelledby="journey-h" className="relative overflow-x-clip bg-surface/50 py-28 md:py-40">
      <ArtShape variant="asterisk" spin speed={0.06} className="-right-40 top-1/3 w-80 opacity-40" />
      <div className="relative mx-auto max-w-[1280px] px-5 md:grid md:grid-cols-12 md:gap-10 md:px-10">
        <div className="mb-12 md:col-span-4 md:mb-0 md:self-start md:sticky md:top-32">
          <SectionLabel>Journey</SectionLabel>
          <h2 id="journey-h" className="font-display text-5xl font-semibold tracking-tight md:text-8xl">Journey</h2>
        </div>
        <ol ref={list} className="relative md:col-span-8" onPointerMove={(e) => { mx.set(e.clientX + 24); my.set(e.clientY - 90) }}>
          <span aria-hidden className="absolute left-0 top-0 h-full w-px bg-line" />
          <motion.span aria-hidden style={{ scaleY: rm ? scrollYProgress : spring }} className="absolute left-0 top-0 -ml-px h-full w-0.5 origin-top bg-accent" />
          {experience.map((e, i) => <Row key={e.title} e={e} i={i} setHover={setHover} />)}
        </ol>
      </div>
      {showPreview && (
        <AnimatePresence>
          {cur && (
            <motion.div key="pv" style={{ x: sx, y: sy }} className="pointer-events-none fixed left-0 top-0 z-[80]" aria-hidden>
              <motion.div initial={{ opacity: 0, scale: 0.8, rotate: -6 }} animate={{ opacity: 1, scale: 1, rotate: -3 }} exit={{ opacity: 0, scale: 0.8 }}
                className="relative h-[150px] w-[220px] overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-sky to-mist">
                {cur.preview ? <img src={cur.preview} alt="" className="h-full w-full object-cover" /> : (
                  <>
                    <span className="grid h-full place-items-center font-display text-6xl font-bold text-espresso">{initials(cur)}</span>
                    <Asterisk size={18} className="absolute right-3 top-3 text-espresso" />
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </section>
  )
}
