'use client'
import { useEffect, useRef, useState } from 'react'
import Asterisk from './Asterisk'

/** Single straight full-bleed band. One track = exactly two identical groups; each group >= viewport width. */
export default function Marquee({ items }: { items: string[] }) {
  const first = useRef<HTMLDivElement>(null)
  const [n, setN] = useState(1)
  useEffect(() => {
    const measure = () => {
      const rep = first.current?.firstElementChild as HTMLElement | null
      if (rep?.offsetWidth) setN(Math.max(1, Math.ceil(window.innerWidth / rep.offsetWidth)))
    }
    measure()
    document.fonts.ready.then(measure)
    const ro = new ResizeObserver(measure); ro.observe(document.documentElement)
    return () => ro.disconnect()
  }, [items])

  const rep = (k: string) => (
    <div key={k} className="flex shrink-0 items-center">
      {items.map((t) => (
        <span key={t} className="flex shrink-0 items-center gap-8 whitespace-nowrap pr-8">{t}<Asterisk size="0.8em" gradient /></span>
      ))}
    </div>
  )
  const group = (g: number) => (
    <div key={g} ref={g === 0 ? first : undefined} className="flex shrink-0 items-center">
      {Array.from({ length: n }, (_, i) => rep(`${g}-${i}`))}
    </div>
  )
  return (
    <div aria-hidden className="marquee flex w-full items-center overflow-hidden bg-fg font-mono uppercase text-bg" style={{ height: 'clamp(42px,4.4vw,66px)', fontSize: 'clamp(18px,2.2vw,32px)' }}>
      <div className="marquee-track flex w-max items-center">{group(0)}{group(1)}</div>
    </div>
  )
}
