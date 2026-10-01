import { useEffect, useState } from 'react'
export function useIsTouch() {
  const [t, setT] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)')
    const f = () => setT(mq.matches)
    f(); mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [])
  return t
}
