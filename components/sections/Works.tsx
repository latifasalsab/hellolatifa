'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import Reveal from '@/components/ui/Reveal'
import Pill from '@/components/ui/Pill'
import { projects, site, type Project } from '@/data/site'
import Asterisk from '@/components/ui/Asterisk'
import SectionLabel from '@/components/ui/SectionLabel'
import { useIsTouch } from '@/hooks/useIsTouch'

function Card({ p, featured, i }: { p: Project; featured: boolean; i: number }) {
  const touch = useIsTouch()
  const [img, setImg] = useState(true)
  const rx = useMotionValue(0), ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 150, damping: 15 }), sry = useSpring(ry, { stiffness: 150, damping: 15 })
  const inner = (
    <>
      <motion.div style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }} whileHover={touch ? undefined : { scale: 1.03 }}
        onPointerMove={(e) => {
          if (touch) return
          const r = e.currentTarget.getBoundingClientRect()
          ry.set(((e.clientX - r.left) / r.width - 0.5) * 6); rx.set(-((e.clientY - r.top) / r.height - 0.5) * 6)
        }}
        onPointerLeave={() => { rx.set(0); ry.set(0) }}
        className={`relative overflow-hidden rounded-[28px] border border-line bg-gradient-to-br from-mist via-surface to-accent/40 ${featured ? 'aspect-[16/8]' : 'aspect-[16/10]'}`}>
        <span className="absolute inset-0 grid place-items-center p-6 text-center font-display text-3xl font-semibold text-espresso/50">{p.title}</span>
        {img && <Image src={`/images/projects/${p.slug}.png`} alt={`${p.title} cover`} fill sizes="(min-width:768px) 50vw, 100vw" quality={90} className="object-cover" onError={() => setImg(false)} />}
        {!touch && (
          <div className="absolute inset-0 flex flex-col justify-end gap-3 bg-bg/85 p-6 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            {!p.link && <span className="w-fit rounded-full bg-accent px-3 py-1 font-mono text-[11px] uppercase text-espresso">Private</span>}
            <p className="max-w-md text-sm">{p.description}</p>
            <div className="flex flex-wrap gap-1.5">{p.stack.slice(0, 4).map((s) => <Pill key={s}>{s}</Pill>)}</div>
          </div>
        )}
      </motion.div>
      <div className="mt-4 flex items-baseline justify-between">
        <h3 className="font-display text-2xl font-semibold tracking-tight">{p.title}</h3>
        <span className="font-mono text-xs text-muted">{p.year}</span>
      </div>
      {touch && <p className="mt-2 text-sm text-muted">{p.description}</p>}
    </>
  )
  return (
    <Reveal delay={(i % 2) * 0.08} className={featured ? 'md:col-span-2' : ''}>
      {p.link
        ? <a href={p.link} target="_blank" rel="noopener noreferrer" data-cursor="view" className="group block">{inner}</a>
        : <div data-cursor="private" className="group block">{inner}</div>}
    </Reveal>
  )
}

function WorksTitle() {
  const rm = useReducedMotion()
  const ease = [0.16, 1, 0.3, 1] as const
  return (
    <div className="mb-14">
      <SectionLabel>Works</SectionLabel>
      <h2 id="works-h" className="flex flex-wrap items-center gap-x-[.22em] gap-y-1 font-display font-semibold leading-[1.1] tracking-[-0.03em]" style={{ fontSize: 'clamp(48px, 9vw, 140px)' }}>
        <span className="inline-block overflow-hidden pb-[.1em]">
          <motion.span className="inline-block" initial={{ y: rm ? 0 : '110%' }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease }}>Selected</motion.span>
        </span>
        <Asterisk size="0.62em" gradient spin />
        <span className="basis-full sm:hidden" aria-hidden />
        <span className="relative inline-block">
          <motion.span className="pill-gloss pill-primary inline-block px-[.35em] pb-[.1em]"
            initial={{ scale: rm ? 1 : 0.6, opacity: 0, rotate: -8 }} whileInView={{ scale: 1, opacity: 1, rotate: -2 }} viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 220, damping: 12, delay: 0.25 }}
            whileHover={rm ? undefined : { rotate: [-2, 2, -4, -2], transition: { duration: 0.6 } }}>Works</motion.span>
          <span className="pill-gloss pill-dark absolute -right-3 -top-2 px-2.5 py-1 font-mono text-xs tracking-normal md:-top-4 md:text-sm">({String(projects.length).padStart(2, '0')})</span>
        </span>
      </h2>
      <div className="mt-6 flex items-end justify-between gap-6">
        <p className="max-w-xs text-muted">A few things I&apos;ve shaped, shipped, and sweated over.</p>
        <span className="font-mono text-xs uppercase text-muted md:text-sm">2022 — 2026</span>
      </div>
    </div>
  )
}

function Heat() {
  const [w, setW] = useState<number[][] | null>(null)
  useEffect(() => {
    let ok = true
    fetch('/api/github-contributions').then((r) => r.json()).then((j) => { if (ok && j.ok) setW(j.weeks) }).catch(() => {})
    return () => { ok = false }
  }, [])
  if (!w) return <div aria-hidden className="mt-8 flex gap-3 text-accent">{Array.from({ length: 9 }, (_, i) => <Asterisk key={i} size={14 + (i % 3) * 6} gradient />)}</div>
  return (
    <div aria-hidden className="mt-8 grid w-fit grid-flow-col grid-rows-7 gap-[3px]">
      {w.flat().map((c, i) => <span key={i} className="h-2 w-2 rounded-[2px] bg-accent md:h-2.5 md:w-2.5" style={{ opacity: c === 0 ? 0.14 : c < 3 ? 0.4 : c < 6 ? 0.7 : 1 }} />)}
    </div>
  )
}

function Archive() {
  const gh = site.socials.find((x) => x.label === 'GitHub')?.href
  return (
    <Reveal className="md:col-span-2">
      <a href={gh} target="_blank" rel="noopener noreferrer" data-cursor="view" className="group relative flex min-h-64 flex-col justify-between overflow-hidden rounded-[28px] border border-dashed border-line p-8 transition-colors hover:bg-surface">
        <div>
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest"><Asterisk size={12} />Archive / Playground</p>
          <p className="mt-4 max-w-xs font-display text-2xl font-semibold tracking-tight">More experiments, side projects, and half-finished ideas.</p>
        </div>
        <Heat />
        <div className="absolute right-6 top-6 grid h-36 w-36 place-items-center transition-transform duration-300 group-hover:scale-110">
          <svg viewBox="0 0 200 200" aria-hidden className="badge-rot absolute inset-0 h-full w-full">
            <defs><path id="badge-path" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
            <text fill="currentColor" fontSize="14" className="font-mono uppercase"><textPath href="#badge-path" textLength="485" lengthAdjust="spacing">See more on GitHub ✱ See more on GitHub ✱ </textPath></text>
          </svg>
          <span className="text-2xl">↗</span>
        </div>
      </a>
    </Reveal>
  )
}

export default function Works() {
  return (
    <section id="works" aria-labelledby="works-h" className="mx-auto max-w-[1280px] px-5 py-28 md:px-10 md:py-40">
      <WorksTitle />
      <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
        {projects.map((p, i) => <Card key={p.slug} p={p} i={i} featured={i === 0} />)}
        <Archive />
      </div>
    </section>
  )
}
