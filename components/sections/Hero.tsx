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

const WORDS_DESKTOP = ['SALSABILA']
const WORDS_MOBILE = ['LATIFA', 'SALSABILA']
const LS = -4 // letter-spacing -0.04em at 100px

// canvas ink metrics for one word, letter by letter (letters are separate inline-blocks: no kerning)
function measure(word: string, fontFamily: string, width: number) {
  const c = document.createElement('canvas').getContext('2d')!
  c.font = `700 100px ${fontFamily}`
  let x = 0, left = 0, right = 0, asc = 0, fa = 0.984, fd = 0.292
  ;[...word].forEach((ch, i) => {
    const m = c.measureText(ch)
    if (i === 0) { left = -m.actualBoundingBoxLeft; if (m.fontBoundingBoxAscent) { fa = m.fontBoundingBoxAscent / 100; fd = m.fontBoundingBoxDescent / 100 } }
    right = x + m.actualBoundingBoxRight; asc = Math.max(asc, m.actualBoundingBoxAscent); x += m.width + LS
  })
  const fs = ((width - 16) / (right - left)) * 100 // ink width = width - 16px
  const tx = 8 - (left * fs) / 100 // cancel left side-bearing
  return { fs, tx, asc, fa, fd }
}

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
  const h1 = useRef<HTMLHeadingElement>(null), word = useRef<HTMLSpanElement>(null) // word = baris pertama
  const metrics = useRef({ fa: 0.984, fd: 0.292, asc: 70, fs: 0 })
  const debugRef = useRef(false)
  const [geo, setGeo] = useState<{ lines: { fs: number; tx: number }[]; floor: number }>({ lines: [], floor: 0 })
  const [stacked, setStacked] = useState(false)
  const [ready, setReady] = useState(false)
  const [debug, setDebug] = useState(false)
  const { scrollY } = useScroll()
  const cue = useTransform(scrollY, [0, 50], [1, 0])

  // top of the letters (cap line) of the FIRST line, hero-relative
  const calcFloor = () => {
    const hero = heroRef.current, w = word.current
    if (!hero || !w) return 0
    const { fa, fd, asc, fs } = metrics.current
    const baseline = ((0.8 - (fa + fd)) / 2 + fa) * fs
    return w.getBoundingClientRect().top - hero.getBoundingClientRect().top + baseline - (asc * fs) / 100 + 2
  }

  useEffect(() => {
    debugRef.current = new URLSearchParams(location.search).has('debug')
    setDebug(debugRef.current)
    const hero = heroRef.current, el = h1.current
    if (!hero || !el) return
    let t: number
    const fit = () => {
      const isStacked = window.innerWidth < 640
      setStacked(isStacked)
      const words = isStacked ? WORDS_MOBILE : WORDS_DESKTOP
      const ff = getComputedStyle(el).fontFamily
      const ms = words.map((w) => measure(w, ff, hero.clientWidth))
      const lines = ms.map(({ fs, tx }) => ({ fs, tx }))
      metrics.current = { fa: ms[0].fa, fd: ms[0].fd, asc: ms[0].asc, fs: ms[0].fs }
      setGeo((g) => ({ ...g, lines }))
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const floor = calcFloor()
        setGeo({ lines, floor }); setReady(true)
        if (debugRef.current) console.table({ heroW: hero.clientWidth, heroH: hero.clientHeight, fontSize: lines[0].fs, inkTop_floorY: floor, translateX: lines[0].tx })
      }))
    }
    document.fonts.ready.then(fit)
    const ro = new ResizeObserver(() => { clearTimeout(t); t = window.setTimeout(fit, 150) })
    ro.observe(hero)
    return () => { ro.disconnect(); clearTimeout(t) }
  }, [])

  usePhysicsPills({
    root: layer, enabled: !rm, start: ready, drag: !touch, debug,
    rebuildKey: `${stacked}|${Math.round(geo.lines[0]?.fs ?? 0)}|${Math.round(geo.floor)}`,
    getFloor: calcFloor,
  })

  const bodies = heroBodies.filter((b) => !(stacked && b.desktopOnly))
  const words = stacked ? WORDS_MOBILE : WORDS_DESKTOP

  return (
    <section id="top" ref={heroRef} aria-label="Intro" className="hero-viewport relative flex flex-col overflow-hidden">
      <ArtShape variant="asterisk" spin speed={0.12} className="-right-36 -top-36 w-[34rem] max-w-[90vw] opacity-80" />
      <ArtShape variant="blob" blur="blur-3xl" speed={0.05} className="bottom-1/4 left-1/3 h-64 w-96 max-w-[80vw] opacity-40" />

      {/* pile zone */}
      <div className="relative z-10 mx-auto w-full max-w-[1280px] flex-1 px-5 pt-42">
        <div className="flex md:hidden flex-wrap items-center gap-3">
          <p className="max-w-[320px] text-sm text-muted md:text-base">I turn designs into calm, fast, detail-obsessed interfaces.</p>
          <div className="flex gap-2">
            <button onClick={() => go('#works')} className="pill-gloss pill-primary h-9 px-4 text-sm font-medium">See my works</button>
            <button onClick={() => go('#talk')} className="pill-gloss pill-neutral h-9 px-4 text-sm font-medium">Say hi</button>
          </div>
        </div>
      </div>

      {/* physics layer */}
      <div ref={layer} aria-hidden className="pointer-events-none absolute inset-0 z-20 overflow-clip" style={{ touchAction: 'pan-y' }}>
        {SHOW_FLOOR_LINE && ready && <div className="absolute inset-x-0 h-px bg-line opacity-0" style={{ top: geo.floor }} />}
        {bodies.map((b) => <Body key={b.t} b={b} rm={rm} floor={geo.floor} ready={ready} />)}
      </div>

      {/* name: full-bleed. Mobile = 2 baris (LATIFA / SALSABILA), desktop = 1 baris */}
      <h1 ref={h1} className="relative z-10 w-full shrink-0 overflow-hidden font-display font-bold uppercase" style={{ marginBottom: 14 }}>
        <span className="sr-only">Latifa Salsabila</span>
        {words.map((wd, li) => {
          const g = geo.lines[li]
          return (
            <span key={wd} ref={li === 0 ? word : undefined} data-w
              className={`block whitespace-nowrap ${li > 0 ? 'mt-2' : ''}`}
              style={{ fontSize: g ? `${g.fs}px` : '17vw', lineHeight: 0.8, letterSpacing: '-0.04em', transform: `translateX(${g?.tx ?? 0}px)` }}>
              {[...wd].map((ch, i) => (
                <span key={i} aria-hidden className="-mx-[.05em] -my-[.06em] inline-block overflow-hidden px-[.05em] py-[.06em]">
                  <motion.span className="inline-block" initial={{ y: '115%' }} animate={{ y: ready ? 0 : '115%' }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 + (li * 6 + i) * 0.035 }}>{ch}</motion.span>
                </span>
              ))}
            </span>
          )
        })}
      </h1>

      {/* the only marquee: bottom edge of the hero */}
      {/* <div className="relative z-10 shrink-0">
        <motion.div style={{ opacity: cue }} className="pointer-events-none absolute inset-x-0 top-0 z-30 flex -translate-y-1/2 justify-center">
          <span className="pill-gloss pill-primary flex items-center gap-2 px-4 py-1.5 font-mono text-xs uppercase">
            Scroll <motion.span animate={rm ? undefined : { y: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>↓</motion.span>
          </span>
        </motion.div>
        <Marquee items={marquee} />
      </div> */}
    </section>
  )
}
