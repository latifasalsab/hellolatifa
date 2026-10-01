'use client'
import { useEffect, useState } from 'react'
import { site } from '@/data/site'
import { useGo } from '@/hooks/useGo'
import MagneticButton from '@/components/ui/MagneticButton'
import Asterisk from '@/components/ui/Asterisk'
import LiveClock from '@/components/layout/LiveClock'
import ThemeToggle from '@/components/layout/ThemeToggle'

export default function LetsTalk() {
  const go = useGo()
  const [copied, setCopied] = useState(false)
  useEffect(() => { // navbar bottom edge -> --nav-bottom (footer card height)
    const el = document.querySelector('header nav')
    if (!el) return
    const set = () => document.documentElement.style.setProperty('--nav-bottom', `${el.getBoundingClientRect().bottom}px`)
    set()
    const ro = new ResizeObserver(set); ro.observe(el); window.addEventListener('resize', set)
    return () => { ro.disconnect(); window.removeEventListener('resize', set) }
  }, [])
  async function copy() {
    try { await navigator.clipboard.writeText(site.email) } catch {
      const t = document.createElement('textarea'); t.value = site.email; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove()
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }
  // Everything below is sized with svh (screen height) so the card always fits between the navbar and the bottom,
  // on short / zoomed desktop screens too. Only very short screens (< ~500px tall) can push it taller.
  return (
    <section id="talk" aria-labelledby="talk-h" className="relative z-10 px-3 pb-4 pt-4 md:px-4">
      <div className="talk relative flex flex-col justify-between overflow-hidden rounded-[40px] md:rounded-[56px]"
        style={{ minHeight: 'calc(100svh - var(--nav-bottom, 88px) - var(--footer-gap, 16px) - var(--footer-mb, 16px))' }}>
        {/* glow ✱: solid, clean colours (no gradient/vars): sky on espresso (light theme), white on sky (dark theme) */}
        <div aria-hidden className="pointer-events-none absolute -bottom-28 -right-24 aspect-square w-[min(34rem,90vw)] text-sky opacity-90 blur-[3px] dark:text-white">
          <Asterisk size="100%" spin />
        </div>
        <div className="relative mx-auto flex w-full max-w-[1280px] flex-1 flex-col justify-center px-6 pb-[2.5svh] pt-10 md:px-12 md:pt-[3.5svh]">
          <h2 id="talk-h" className="font-display text-[14vw] font-bold leading-[.9] tracking-[-0.03em] md:text-[length:min(8.5vw,13svh)]">
            Got a project?<br /><span className="talk-hl">Let&apos;s talk.</span>
          </h2>
          <p className="mt-5 max-w-lg text-muted md:mt-[2.5svh] [@media(max-height:560px)]:hidden">Whether it&apos;s a website, a product, or a &ldquo;quick idea&rdquo; that&apos;s secretly a big one, my inbox is open.</p>
          <div className="mt-6 md:mt-[3svh]">
            <MagneticButton>
              <button onClick={copy} className="talk-btn rounded-full px-8 py-4 font-display text-lg font-semibold md:text-[length:clamp(1.125rem,3svh,1.75rem)]">
                <span aria-live="polite" className="select-text">{copied ? 'Copied ✓ Now go write something great.' : site.email}</span>
              </button>
            </MagneticButton>
            <p className="mt-3 font-mono text-xs text-muted [@media(max-height:640px)]:hidden">or <a className="underline" href={`mailto:${site.email}`}>open your mail app</a></p>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3 md:mt-[3.5svh]">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  className="bg-gradient-to-r from-current to-current bg-[length:0%_2px] bg-bottom bg-no-repeat pb-1 font-mono text-sm uppercase transition-[background-size] duration-300 hover:bg-[length:100%_2px]">{s.label} ↗</a>
              </li>
            ))}
          </ul>
        </div>
        <footer className="relative mx-auto flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-4 border-t border-line px-6 py-4 font-mono text-xs uppercase md:px-12">
          <span>© 2026 {site.name}</span>
          <span className="flex items-center gap-1.5">Semarang, <LiveClock /></span>
          <button onClick={() => go(0)}>Back to top ↑</button>
          <ThemeToggle />
        </footer>
      </div>
    </section>
  )
}
