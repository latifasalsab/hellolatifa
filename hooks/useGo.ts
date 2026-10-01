'use client'
import { useLenis } from 'lenis/react'
export function useGo() {
  const lenis = useLenis()
  return (target: string | number) => {
    if (lenis) return void lenis.scrollTo(target, { offset: typeof target === 'number' ? 0 : -80 })
    if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' })
    else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  }
}
