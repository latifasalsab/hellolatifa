'use client'
import { useEffect, useState } from 'react'

/** Real progress: fonts + critical images. Min visible 1.2s, max 6s. */
export function usePreload(skip: boolean, images: string[]) {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (skip) return
    const total = images.length + 1
    let loaded = 0, finished = false
    const start = performance.now()
    const timers: number[] = []
    const bump = () => { loaded++; setProgress((loaded / total) * 100) }
    const finish = () => {
      if (finished) return
      finished = true
      timers.push(window.setTimeout(() => { setProgress(100); setDone(true) }, Math.max(0, 1200 - (performance.now() - start))))
    }
    document.fonts.ready.then(bump)
    images.forEach((src) => { const i = new Image(); i.onload = bump; i.onerror = () => bump(); i.src = src })
    const poll = window.setInterval(() => { if (loaded >= total) { clearInterval(poll); finish() } }, 100)
    timers.push(window.setTimeout(finish, 6000))
    return () => { clearInterval(poll); timers.forEach(clearTimeout) }
  }, [skip])
  return { progress, done }
}
