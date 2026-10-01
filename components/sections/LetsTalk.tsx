'use client'
import { useState } from 'react'
import { site } from '@/data/site'
import { useGo } from '@/hooks/useGo'
import MagneticButton from '@/components/ui/MagneticButton'
import ArtShape from '@/components/ui/ArtShape'
import LiveClock from '@/components/layout/LiveClock'
import ThemeToggle from '@/components/layout/ThemeToggle'

export default function LetsTalk() {
  const go = useGo()
  const [copied, setCopied] = useState(false)
  async function copy() {
    try { await navigator.clipboard.writeText(site.email) } catch {
      const t = document.createElement('textarea'); t.value = site.email; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove()
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }
  return (
    <section id="talk" aria-labelledby="talk-h" className="talk relative z-10 -mt-12 flex min-h-[100svh] flex-col justify-between overflow-hidden rounded-t-[48px] md:rounded-t-[72px]">
      <ArtShape variant="asterisk" blur="blur-sm" spin speed={0.05} className="-bottom-32 -right-32 w-[34rem] max-w-[90vw] opacity-50" />
      <div className="relative mx-auto flex w-full max-w-[1280px] flex-1 flex-col justify-center px-5 pb-10 pt-36 md:px-10">
        <h2 id="talk-h" className="font-display text-[14vw] font-bold leading-[.9] tracking-[-0.03em] md:text-[9vw]">
          Got a project?<br /><span className="talk-hl">Let&apos;s talk.</span>
        </h2>
        <p className="mt-8 max-w-lg text-muted">Whether it&apos;s a website, a product, or a &ldquo;quick idea&rdquo; that&apos;s secretly a big one, my inbox is open.</p>
        <div className="mt-10">
          <MagneticButton>
            <button onClick={copy} className="talk-btn rounded-full px-8 py-5 font-display text-lg font-semibold md:text-2xl">
              <span aria-live="polite" className="select-text">{copied ? 'Copied ✓ Now go write something great.' : site.email}</span>
            </button>
          </MagneticButton>
          <p className="mt-3 font-mono text-xs text-muted">or <a className="underline" href={`mailto:${site.email}`}>open your mail app</a></p>
        </div>
        <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3">
          {site.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                className="bg-gradient-to-r from-current to-current bg-[length:0%_2px] bg-bottom bg-no-repeat pb-1 font-mono text-sm uppercase transition-[background-size] duration-300 hover:bg-[length:100%_2px]">{s.label} ↗</a>
            </li>
          ))}
        </ul>
      </div>
      <footer className="relative mx-auto flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-4 border-t border-line px-5 py-6 font-mono text-xs uppercase md:px-10">
        <span>© 2026 {site.name}</span>
        <span className="flex items-center gap-1.5">Semarang, <LiveClock /></span>
        <button onClick={() => go(0)}>Back to top ↑</button>
        <ThemeToggle />
      </footer>
    </section>
  )
}
