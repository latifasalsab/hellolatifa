'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import Asterisk from '@/components/ui/Asterisk'
import ArtShape from '@/components/ui/ArtShape'
import Marquee from '@/components/ui/Marquee'
import { heroBodies, marquee, SHOW_FLOOR_LINE, type HeroBody } from '@/data/site'
import { useGo } from '@/hooks/useGo'
import { useIsTouch } from '@/hooks/useIsTouch'
import { usePhysicsPills } from '@/hooks/usePhysicsPills'

const WORD = 'SALSABILA'
const LS = -4 // letter-spacing -0.04em at 100px

function Body({ b, rm, floor, ready }: { b: HeroBody; rm: boolean; floor: number; ready: boolean }) {
  const cls = b.circle ? 'hp hp-circle' : b.vertical ? 'hp hp-vert' : 'hp'
  const style = rm
    ? { left: `${b.rest.x}%`, top: floor, opacity: ready ? 1 : 0, transform: `translate(-50%,-100%) translateY(calc(var(--ph) * ${-b.rest.row * 0.95})) rotate(${b.rest.r}deg)` }
    : undefined
  return (
    <span data-pill data-circle={b.circle ? '' : undefined} style={style}
      className={`pill-gloss pill-${b.v} ${cls} pointer-events-auto absolute whitespace-nowrap font-mono uppercase tracking-wider ${rm ? '' : 'left-0 top-0 cursor-grab opacity-0 will-change-transform active:cursor-grabbing'}`}>
      {b.t === '✱' ? <Asterisk size="55%" /> : b.t}
    </span>
  )
}

export default function Hero() {
  const go = useGo(), touch = useIsTouch(), rm = !!useReducedMotion()
  const heroRef = useRef<HTMLElement>(null), layer = useRef<HTMLDivElement>(null)
  const h1 = useRef<HTMLHeadingElement>(null), word = useRef<HTMLSpanElement>(null)
  const metrics = useRef({ fa: 0.984, fd: 0.292, asc: 70, fs: 0 })
  const debugRef = useRef(false)
  const [geo, setGeo] = useState({ fs: 0, tx: 0, floor: 0 })
  const [stacked, setStacked] = useState(false)
  const [ready, setReady] = useState(false)
  const [debug, setDebug] = useState(false)
  const [pre, setPre] = useState(false) // preloader finished (or skipped this session)
  const { scrollY } = useScroll()
  const cue = useTransform(scrollY, [0, 50], [1, 0])

  useEffect(() => {
    if (sessionStorage.getItem('ls-pre')) { setPre(true); return }
    const f = () => setPre(true)
    window.addEventListener('preloader:done', f)
    return () => window.removeEventListener('preloader:done', f)
  }, [])

  // top of the letters (cap line), hero-relative: DOM baseline minus canvas ink ascent
  const calcFloor = () => {
    const hero = heroRef.current, w = word.current
    if (!hero || !w) return 0
    const { fa, fd, asc, fs } = metrics.current
    const baseline = ((0.8 - (fa + fd)) / 2 + fa) * fs // baseline offset inside the 0.8-line-height block
    return w.getBoundingClientRect().top - hero.getBoundingClientRect().top + baseline - (asc * fs) / 100 + 2
  }

  useEffect(() => {
    debugRef.current = new URLSearchParams(location.search).has('debug')
    setDebug(debugRef.current)
    const hero = heroRef.current, el = h1.current
    if (!hero || !el) return
    let t: number
    const fit = () => {
      setStacked(window.innerWidth < 640)
      // canvas ink metrics, letter by letter (letters are separate inline-blocks: no kerning)
      const c = document.createElement('canvas').getContext('2d')!
      c.font = `700 100px ${getComputedStyle(el).fontFamily}`
      let x = 0, left = 0, right = 0, asc = 0, fa = 0.984, fd = 0.292
      ;[...WORD].forEach((ch, i) => {
        const m = c.measureText(ch)
        if (i === 0) { left = -m.actualBoundingBoxLeft; if (m.fontBoundingBoxAscent) { fa = m.fontBoundingBoxAscent / 100; fd = m.fontBoundingBoxDescent / 100 } }
        right = x + m.actualBoundingBoxRight; asc = Math.max(asc, m.actualBoundingBoxAscent); x += m.width + LS
      })
      const fs = ((hero.clientWidth - 16) / (right - left)) * 100 // ink width = width - 16px
      const tx = 8 - (left * fs) / 100 // cancel left side-bearing
      metrics.current = { fa, fd, asc, fs }
      setGeo((g) => ({ ...g, fs, tx }))
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const floor = calcFloor()
        setGeo({ fs, tx, floor }); setReady(true)
        if (debugRef.current) console.table({ heroW: hero.clientWidth, heroH: hero.clientHeight, fontSize: fs, inkTop_floorY: floor, translateX: tx })
      }))
    }
    document.fonts.ready.then(fit)
    const ro = new ResizeObserver(() => { clearTimeout(t); t = window.setTimeout(fit, 150) })
    ro.observe(hero)
    return () => { ro.disconnect(); clearTimeout(t) }
  }, [])

  usePhysicsPills({
    root: layer, enabled: !rm, start: ready && pre, drag: !touch, debug,
    rebuildKey: `${stacked}|${Math.round(geo.fs)}|${Math.round(geo.floor)}`,
    getFloor: calcFloor,
  })

  const bodies = heroBodies.filter((b) => !(stacked && b.desktopOnly))

  return (
    <section id="top" ref={heroRef} aria-label="Intro" className="relative flex h-[100svh] flex-col overflow-hidden">
      <ArtShape variant="asterisk" spin speed={0.12} className="-right-36 -top-36 w-[34rem] max-w-[90vw] opacity-80" />
      <ArtShape variant="blob" blur="blur-3xl" speed={0.05} className="bottom-1/4 left-1/3 h-64 w-96 max-w-[80vw] opacity-40" />

      {/* pile zone */}
      <div className="relative z-10 mx-auto w-full max-w-[1280px] flex-1 px-5 pt-28 md:px-10 md:pt-32">
        <p className="max-w-[320px] text-base text-muted">I turn designs into calm, fast, detail-obsessed interfaces.</p>
        <div className="mt-5 flex gap-3">
          <button onClick={() => go('#works')} className="pill-gloss pill-primary h-14 px-8 text-[17px] font-medium">See my works</button>
          <button onClick={() => go('#talk')} className="pill-gloss pill-neutral h-14 px-8 text-[17px] font-medium">Say hi</button>
        </div>
      </div>

      {/* physics layer: whole hero, below navbar (z-50), above tagline; spawn area above is clipped */}
      <div ref={layer} aria-hidden className="pointer-events-none absolute inset-0 z-20 overflow-clip" style={{ touchAction: 'pan-y' }}>
        {SHOW_FLOOR_LINE && ready && <div className="absolute inset-x-0 h-px bg-line" style={{ top: geo.floor }} />}
        {bodies.map((b) => <Body key={b.t} b={b} rm={rm} floor={geo.floor} ready={ready && pre} />)}
      </div>

      {/* name: full-bleed, ink touches both edges */}
      <h1 ref={h1} className="relative z-10 w-full overflow-hidden font-display font-bold uppercase" style={{ marginBottom: 14 }}>
        <span className="sr-only">Latifa </span>
        <span ref={word} data-w className="block whitespace-nowrap"
          style={{ fontSize: geo.fs ? `${geo.fs}px` : '17vw', lineHeight: 0.8, letterSpacing: '-0.04em', transform: `translateX(${geo.tx}px)` }}>
          {[...WORD].map((ch, i) => (
            <span key={i} aria-hidden className="-mx-[.05em] -my-[.06em] inline-block overflow-hidden px-[.05em] py-[.06em]">
              <motion.span className="inline-block" initial={{ y: '115%' }} animate={{ y: ready && pre ? 0 : '115%' }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.035 }}>{ch}</motion.span>
            </span>
          ))}
        </span>
      </h1>

      {/* the only marquee: bottom edge of the hero */}
      <div className="relative z-10">
        <motion.div style={{ opacity: cue }} className="pointer-events-none absolute left-1/2 top-0 z-30 -translate-x-1/2 -translate-y-1/2">
          <span className="pill-gloss pill-primary flex items-center gap-2 px-4 py-1.5 font-mono text-xs uppercase">
            Scroll <motion.span animate={rm ? undefined : { y: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>↓</motion.span>
          </span>
        </motion.div>
        <Marquee items={marquee} />
      </div>
    </section>
  )
}
