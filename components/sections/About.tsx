'use client'
import { useEffect, useId, useRef, useState } from 'react'
import Image from 'next/image'
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import Reveal from '@/components/ui/Reveal'
import Asterisk from '@/components/ui/Asterisk'
import ArtShape from '@/components/ui/ArtShape'
import SectionLabel from '@/components/ui/SectionLabel'
import { toolChips, stats } from '@/data/site'
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

/* Tile A: tools. 5 main + 5 other chips, upright (rotation locked), statement fills the top */
const STATEMENT = 'Mostly Laravel, Vue & Next.js, with a soft spot for polished UI.'.split(' ')
const EMPH_W = new Set(['Laravel,', 'Vue', '&', 'Next.js,'])

function Statement() {
  const rm = useReducedMotion()
  return (
    <p className="mt-5 max-w-[34ch] font-display font-semibold leading-[1.12] tracking-[-0.02em]" style={{ fontSize: 'clamp(26px, 3vw, 44px)' }}>
      {STATEMENT.map((w, i) => (
        <span key={i} className="mr-[.25em] inline-block overflow-hidden pb-[.2em] align-bottom">
          <motion.span className={`inline-block ${EMPH_W.has(w) ? 'underline decoration-accent decoration-4 underline-offset-[.14em]' : ''}`}
            initial={{ y: rm ? 0 : '115%' }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}>{w}</motion.span>
        </span>
      ))}
    </p>
  )
}

function Stickers() {
  const rm = useReducedMotion(), touch = useIsTouch()
  const tile = useRef<HTMLDivElement>(null), world = useRef<HTMLDivElement>(null)
  const inView = useInView(tile, { once: true, margin: '-15%' })
  const [fonts, setFonts] = useState(false)
  const [w, setW] = useState(0)
  useEffect(() => { document.fonts.ready.then(() => setFonts(true)) }, [])
  useEffect(() => { // debounced rebuild when the tile width changes
    const el = tile.current
    if (!el) return
    let t: number
    const ro = new ResizeObserver(() => { clearTimeout(t); t = window.setTimeout(() => setW(Math.round(el.clientWidth / 8)), 200) })
    ro.observe(el)
    return () => { ro.disconnect(); clearTimeout(t) }
  }, [])
  usePhysicsPills({ root: world, enabled: !rm, start: inView && fonts, drag: !touch, stagger: 90, lockRotation: true, rebuildKey: `chips-${w}`, getFloor: () => world.current?.clientHeight ?? 0 })
  const ordered = [...toolChips].sort((a, b) => Number(b.featured) - Number(a.featured))
  const chip = (c: { t: string; featured: boolean }) =>
    `pill-gloss ${c.featured ? 'pill-main h-[52px] px-6 text-base' : 'pill-primary h-[42px] px-5 text-sm'} inline-flex items-center whitespace-nowrap font-mono uppercase`
  return (
    <div ref={tile} className="relative flex h-full min-h-[36rem] flex-col overflow-hidden rounded-[28px] border border-line bg-surface p-6 md:p-8">
      <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest"><Asterisk size={12} />Tools I reach for</p>
      <Statement />
      <ul className="sr-only">{toolChips.map((c) => <li key={c.t}>{c.t}</li>)}</ul>
      {rm ? (
        <div className="mt-auto flex flex-wrap gap-2 pt-8">{ordered.map((c) => <span key={c.t} className={chip(c)}>{c.t}</span>)}</div>
      ) : (
        // physics area = bottom ~48% of the tile; chips spawn above it and are clipped until they fall in
        <div ref={world} aria-hidden className="pointer-events-none absolute inset-x-4 bottom-0 h-[48%] overflow-clip" style={{ touchAction: 'pan-y' }}>
          {ordered.map((c) => (
            <span key={c.t} data-pill className={`${chip(c)} pointer-events-auto absolute left-0 top-0 cursor-grab opacity-0 will-change-transform active:cursor-grabbing`}>{c.t}</span>
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

/* Tile C: Beyond code (basic version: plain sky card, 4 readable lines) */
const BEYOND = ['MC & public speaking', 'Content & visual design', 'Event organizing', 'Student org secretary', 'Machine learning']

function BeyondCode() {
  return (
    <section aria-labelledby="beyond-h" className="flex h-full min-h-[13rem] flex-col justify-between gap-6 rounded-[28px] bg-accent p-6 text-espresso md:p-8">
      <div>
        <h3 id="beyond-h" className="font-display text-4xl font-semibold tracking-tight md:text-5xl">Beyond code <Asterisk size={28} className="inline-block align-middle" /></h3>
        <p className="mt-2 text-sm text-espresso/75">Same attention to detail, different stage.</p>
      </div>
      <ul className="space-y-1">{BEYOND.map((t) => <li key={t} className="font-display text-lg font-medium md:text-xl">{t}</li>)}</ul>
    </section>
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
              {!hide.a && <Image src="/images/salsa.png" alt="Portrait of Latifa Salsabila" fill sizes="(min-width:768px) 40vw, 75vw" quality={90} className="object-cover" onError={() => setHide((h) => ({ ...h, a: true }))} />}
              {!hide.b && <Image src="/images/salsa-alt.jpg" alt="" fill sizes="(min-width:768px) 40vw, 75vw" quality={90} className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" onError={() => setHide((h) => ({ ...h, b: true }))} />}
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
            <p>I&apos;m a full-stack web developer and Informatics graduate from Polines in Semarang. I build with Laravel Blade, Vue, Next.js, and Node.js, turn designs into polished interfaces, and yes, I will absolutely notice a 2px misalignment. Right now I&apos;m shipping client work at By Decodes Media, and after finishing my thesis on ML-powered GitHub analytics, I&apos;m growing into machine learning.</p>
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
        <Reveal className="md:col-span-5" delay={0.16}><BeyondCode /></Reveal>
      </div>
    </section>
  )
}
