'use client'
import { useEffect, useRef, useState } from 'react'
import { ReactLenis, type LenisRef } from 'lenis/react'
import { frame, cancelFrame } from 'motion/react'

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<LenisRef>(null)
  const [reduce, setReduce] = useState(false)
  useEffect(() => setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches), [])
  useEffect(() => {
    const update = (d: { timestamp: number }) => ref.current?.lenis?.raf(d.timestamp)
    frame.update(update, true)
    return () => cancelFrame(update)
  }, [])
  if (reduce) return <>{children}</>
  return <ReactLenis root ref={ref} options={{ autoRaf: false, lerp: 0.1 }}>{children}</ReactLenis>
}
