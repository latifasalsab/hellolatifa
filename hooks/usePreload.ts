'use client'
import { useEffect, useState } from 'react'

/** Real progress 0..100 (fonts + critical images). Forced to 100 after 6s. The minimum time lives in Preloader. */
export function usePreload(skip: boolean, images: string[]) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (skip) return
    const total = images.length + 1
    let loaded = 0
    const bump = () => { loaded++; setProgress((loaded / total) * 100) }
    document.fonts.ready.then(bump)
    images.forEach((src) => { const i = new Image(); i.onload = bump; i.onerror = () => bump(); i.src = src })
    const max = window.setTimeout(() => setProgress(100), 6000)
    return () => clearTimeout(max)
  }, [skip])
  return progress
}
