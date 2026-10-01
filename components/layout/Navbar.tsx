'use client'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { nav, site } from '@/data/site'
import { useGo } from '@/hooks/useGo'
import LiveClock from './LiveClock'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const go = useGo()
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive('#' + e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    nav.forEach((n) => { const el = document.querySelector(n.href); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])

  // close on outside click / Escape
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('pointerdown', onDown); window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('pointerdown', onDown); window.removeEventListener('keydown', onKey) }
  }, [open])

  const click = (href: string) => (e: React.MouseEvent) => { e.preventDefault(); setOpen(false); go(href) }

  return (
    <>
      {/* heavy blur over the whole page while the menu is open */}
      <AnimatePresence>
        {open && (
          <motion.div aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-bg/30 backdrop-blur-2xl" />
        )}
      </AnimatePresence>

      <div className="fixed inset-x-0 top-4 z-50 px-5 md:px-10">
        <div className="mx-auto grid max-w-[1280px] grid-cols-[1fr_auto_1fr] items-center">
          {/* left: clock */}
          <div className="hidden text-xs md:block"><LiveClock /></div>

          {/* center: pill + dropdown */}
          <div ref={box} className="relative col-start-2 min-w-[300px]">
            <nav aria-label="Main" className="flex h-12 items-center justify-between rounded-full bg-fg py-1.5 pl-5 pr-1.5 text-bg shadow-[0_4px_20px_rgb(0_0_0/0.12)]">
              <a href="#top" onClick={click('#top')} className="font-display text-base font-semibold">Salsa®</a>
              <div className="flex items-center gap-1.5">
                <a href="#talk" onClick={click('#talk')} className="pill-gloss pill-primary px-4 py-2 text-sm font-medium">Let&apos;s Talk</a>
                <button aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}
                  className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-full bg-bg/15 transition-colors hover:bg-bg/25">
                  <span className={`h-px w-4 bg-current transition-transform ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
                  <span className={`h-px w-4 bg-current transition-transform ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
                </button>
              </div>
            </nav>

            <AnimatePresence>
              {open && (
                <motion.div initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-x-0 top-full mt-2 origin-top rounded-[2rem] bg-fg px-6 pb-7 pt-9 text-center text-bg shadow-[0_8px_32px_rgb(0_0_0/0.18)]">
                  <ul className="space-y-1">
                    {nav.map((n) => (
                      <li key={n.href}>
                        <a href={n.href} onClick={click(n.href)}
                          className={`block py-1 font-display text-4xl font-semibold tracking-tight transition-opacity hover:opacity-100 ${active === n.href ? 'opacity-100' : 'opacity-40'}`}>
                          {n.label}
                        </a>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 space-y-1">
                    <p className="font-mono text-xs uppercase opacity-60">{site.location}</p>
                    <a href={`mailto:${site.email}`} className="block font-display text-lg font-semibold">{site.email}</a>
                  </div>

                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {site.socials.filter((s) => s.label !== 'Email').map((s) => (
                      <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                        className="rounded-full border border-bg/25 px-3 py-1 font-mono text-[11px] uppercase transition-colors hover:bg-bg/15">{s.label}</a>
                    ))}
                  </div>

                  <div className="mt-6 text-xs opacity-60 md:hidden"><LiveClock /></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* right: theme */}
          <div className="col-start-3 flex justify-end"><ThemeToggle /></div>
        </div>
      </div>
    </>
  )
}