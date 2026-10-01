'use client'
import { useEffect, useId, useRef, useState } from 'react'
import Image from 'next/image'
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import Reveal from '@/components/ui/Reveal'
import Asterisk from '@/components/ui/Asterisk'
import ArtShape from '@/components/ui/ArtShape'
import SectionLabel from '@/components/ui/SectionLabel'
import { skills, stats } from '@/data/site'
import { useGo } from '@/hooks/useGo'
import { useIsTouch } from '@/hooks/useIsTouch'
import { usePhysicsPills } from '@/hooks/usePhysicsPills'

const HEAD = "Hi, I'm Salsa. I build interfaces that feel calm and work hard.".split(' ')
const EMPH = new Set(['calm', 'hard.'])
const VAR = ['pill-primary', 'pill-neutral', 'pill-dark']

function Word({ w, i, n, p }: { w: string; i: number; n: number; p: MotionValue<number> }) {
  const opacity = useTransform(p, [i / n, (i + 1) / n], [0.2, 1])
  return <motion.span style={{ opacity }} className={`mr-[.25em] inline-block ${EMPH.has(w) ? 'underline decoration-accent decoration-4 underline-offset-8' : ''}`}>{w}</motion.span>
}

function Count({ v, suffix, d }: { v: number; suffix: string; d: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, v, { duration: 1.6, ease: 'easeOut', onUpdate: setN })
    return () => c.stop()
  }, [inView, v])
  return <span ref={ref}>{n.toFixed(d)}{suffix}</span>
}

/* Tile A: tools as gloss stickers that fall into the tile */
function Stickers() {
  const rm = useReducedMotion(), touch = useIsTouch()
  const tile = useRef<HTMLDivElement>(null), world = useRef<HTMLDivElement>(null)
  const inView = useInView(tile, { once: true, margin: '-15%' })
  usePhysicsPills({ root: world, enabled: !rm, start: inView, drag: !touch, stagger: 90, rebuildKey: 'stickers', getFloor: () => world.current?.clientHeight ?? 0 })
  const all = skills.flatMap((g, gi) => g.items.map((t) => ({ t, gi })))
  return (
    <div ref={tile} className="relative flex h-full min-h-[28rem] flex-col overflow-hidden rounded-[28px] border border-line bg-surface p-6">
      <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest"><Asterisk size={12} />Tools I reach for</p>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase text-muted">
        {skills.map((g, gi) => <span key={g.label} className="flex items-center gap-1.5"><span className={`pill-gloss ${VAR[gi]} inline-block h-2.5 w-5`} />{g.label}</span>)}
      </div>
      <ul className="sr-only">{all.map((c) => <li key={c.t}>{c.t}</li>)}</ul>
      {rm ? (
        <div className="mt-6 flex flex-wrap gap-2">{all.map((c) => <span key={c.t} className={`pill-gloss ${VAR[c.gi]} px-4 py-2 font-mono text-xs uppercase`}>{c.t}</span>)}</div>
      ) : (
        <div ref={world} aria-hidden className="pointer-events-none absolute inset-0 overflow-clip" style={{ touchAction: 'pan-y' }}>
          {all.map((c) => (
            <span key={c.t} data-pill className={`pill-gloss ${VAR[c.gi]} pointer-events-auto absolute left-0 top-0 cursor-grab whitespace-nowrap px-4 py-2 font-mono text-xs uppercase opacity-0 will-change-transform active:cursor-grabbing`}>{c.t}</span>
          ))}
        </div>
      )}
    </div>
  )
}

/* Tile B: stat rings (values from site.stats) */
function Ring({ v, suffix, d, label, frac }: { v: number; suffix: string; d: number; label: string; frac: number }) {
  const id = useId().replace(/:/g, '')
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-24 w-24 md:h-28 md:w-28">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden>
          <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#A9C6DA" /><stop offset="1" stopColor="#6F9BB8" /></linearGradient></defs>
          <circle cx="50" cy="50" r="40" fill="none" stroke="var(--line)" strokeWidth="6" />
          <motion.circle cx="50" cy="50" r="40" fill="none" stroke={`url(#${id})`} strokeWidth="6" strokeLinecap="round"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: frac }} viewport={{ once: true }} transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }} />
        </svg>
        <span className="absolute inset-0 grid place-items-center font-display text-base font-semibold md:text-lg"><Count v={v} suffix={suffix} d={d} /></span>
        <span aria-hidden className="absolute left-1/2 top-[10%] -translate-x-1/2 -translate-y-1/2"><Asterisk size={10} /></span>
      </div>
      <p className="mt-2 text-center font-mono text-[10px] uppercase text-muted">{label}</p>
    </div>
  )
}

/* Tile C: flip card */
function Flip() {
  const rm = useReducedMotion(), touch = useIsTouch()
  const [f, setF] = useState(false)
  const face = 'absolute inset-0 flex flex-col justify-between rounded-[28px] border border-line p-6 [backface-visibility:hidden]'
  return (
    <button aria-pressed={f} className="block h-full min-h-[13rem] w-full text-left [perspective:1000px]"
      onMouseEnter={() => !touch && setF(true)} onMouseLeave={() => !touch && setF(false)}
      onClick={(e) => { if (touch || e.detail === 0) setF((v) => !v) }}>
      <motion.span className="relative block h-full min-h-[13rem] w-full [transform-style:preserve-3d]" animate={{ rotateY: rm ? 0 : f ? 180 : 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
        <span className={`${face} bg-surface`} style={rm ? { opacity: f ? 0 : 1, transition: 'opacity .3s' } : undefined}>
          <span className="font-display text-4xl font-semibold tracking-tight md:text-5xl">Beyond code <Asterisk size={28} className="inline-block align-middle" /></span>
          <span className="font-mono text-[10px] uppercase text-muted">hover / tap to flip</span>
        </span>
        <span className={`${face} bg-accent text-espresso [transform:rotateY(180deg)]`} style={rm ? { opacity: f ? 1 : 0, transform: 'none', transition: 'opacity .3s' } : undefined}>
          {['MC & public speaking', 'Content design', 'Event organizing', 'Student org secretary'].map((t) => <span key={t} className="block font-display text-lg font-medium">{t}</span>)}
        </span>
      </motion.span>
    </button>
  )
}

export default function About() {
  const go = useGo()
  const head = useRef<HTMLHeadingElement>(null)
  const { scrollYProgress: p } = useScroll({ target: head, offset: ['start 0.85', 'end 0.5'] })
  const [hide, setHide] = useState({ a: false, b: false })
  return (
    <section id="about" aria-labelledby="about-h" className="mx-auto max-w-[1280px] overflow-x-clip px-5 py-28 md:px-10 md:py-40">
      <div className="grid gap-12 md:grid-cols-12 md:gap-16">
        <Reveal className="md:col-span-5">
          <div className="group relative mx-auto w-3/4 max-w-sm md:w-full">
            <ArtShape variant="asterisk" spin speed={0.08} className="-left-20 -top-10 -z-10 w-64 opacity-60" />
            <div aria-hidden className="absolute -inset-6 -z-10 rounded-full bg-accent opacity-40 blur-2xl" />
            <div className="relative aspect-[3/4] -rotate-3 overflow-hidden rounded-t-full rounded-b-[2rem] border border-line bg-gradient-to-b from-mist to-surface transition-transform duration-500 group-hover:-translate-y-2">
              {!hide.a && <Image src="/images/salsa.jpg" alt="Portrait of Latifa Salsabila" fill sizes="(min-width:768px) 40vw, 75vw" className="object-cover" onError={() => setHide((h) => ({ ...h, a: true }))} />}
              {!hide.b && <Image src="/images/salsa-alt.jpg" alt="" fill sizes="(min-width:768px) 40vw, 75vw" className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" onError={() => setHide((h) => ({ ...h, b: true }))} />}
            </div>
            <span className="absolute -right-2 bottom-10 rotate-6 rounded-full bg-fg px-3 py-1.5 font-mono text-[11px] uppercase text-bg">THAT&apos;S ME ☕</span>
          </div>
        </Reveal>
        <div className="md:col-span-7">
          <SectionLabel>About</SectionLabel>
          <h2 id="about-h" ref={head} className="font-display text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl">
            {HEAD.map((w, i) => <Word key={i} w={w} i={i} n={HEAD.length} p={p} />)}
          </h2>
          <Reveal className="mt-8 max-w-xl space-y-4 text-muted">
            <p>I&apos;m a frontend developer and final-year Informatics student in Semarang. I turn designs into polished interfaces with Laravel Blade, Vue, React, and Next.js, and yes, I will absolutely notice a 2px misalignment. Right now I&apos;m shipping client work at ByDecodes while finishing my thesis on ML-powered GitHub analytics.</p>
            <p>Have an idea, a project, or just a good coffee recommendation? <a href="#talk" onClick={(e) => { e.preventDefault(); go('#talk') }} className="text-fg underline decoration-accent decoration-2 underline-offset-4">Let&apos;s talk.</a></p>
          </Reveal>
        </div>
      </div>

      <div className="mt-20 grid gap-4 md:grid-cols-12">
        <Reveal className="md:col-span-7 md:row-span-2"><Stickers /></Reveal>
        <Reveal className="md:col-span-5" delay={0.08}>
          <div className="flex h-full flex-col justify-center rounded-[28px] border border-line bg-surface p-6">
            <p className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-widest"><Asterisk size={12} />By the numbers</p>
            <div className="flex justify-around gap-2">
              {stats.map((s) => <Ring key={s.label} v={s.value} suffix={s.suffix} d={s.decimals} label={s.label} frac={s.label === 'GPA' ? s.value / 4 : 1} />)}
            </div>
          </div>
        </Reveal>
        <Reveal className="md:col-span-5" delay={0.16}><Flip /></Reveal>
      </div>
    </section>
  )
}
