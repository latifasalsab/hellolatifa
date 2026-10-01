'use client'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { nav } from '@/data/site'
import { useGo } from '@/hooks/useGo'
import StatusTicker from './StatusTicker'
import LiveClock from './LiveClock'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const go = useGo()
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive('#' + e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    nav.forEach((n) => { const el = document.querySelector(n.href); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])
  const click = (href: string) => (e: React.MouseEvent) => { e.preventDefault(); setOpen(false); go(href) }

  return (
    <>
      <div className="fixed inset-x-0 top-4 z-50 px-5 md:px-10">
        <nav aria-label="Main" className="mx-auto flex h-14 max-w-[1280px] items-center justify-between rounded-full border border-line bg-surface/70 px-4 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <a href="#top" onClick={click('#top')} className="font-display text-lg font-semibold">Salsa®</a>
            <div className="hidden items-center gap-3 lg:flex"><span className="h-4 w-px bg-line" /><StatusTicker /><LiveClock /></div>
          </div>
          <ul className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <li key={n.href} className="relative">
                <a href={n.href} onClick={click(n.href)} className="relative z-10 block px-4 py-1.5 text-sm">
                  {active === n.href && <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-accent" />}
                  <span className={active === n.href ? 'text-espresso' : ''}>{n.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a href="#talk" onClick={click('#talk')} className="pill-gloss pill-primary hidden px-4 py-2 text-sm font-medium md:inline-block">Let&apos;s Talk</a>
            <button className="rounded-full border border-line px-4 py-2 font-mono text-xs uppercase md:hidden" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
          </div>
        </nav>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex flex-col justify-between bg-bg px-6 pb-10 pt-28 md:hidden">
            <ul className="space-y-2">
              {[...nav, { label: "Let's Talk", href: '#talk' }].map((n) => (
                <li key={n.href}><a href={n.href} onClick={click(n.href)} className="font-display text-5xl font-semibold tracking-tight">{n.label}</a></li>
              ))}
            </ul>
            <div className="space-y-3"><StatusTicker /><LiveClock /></div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
