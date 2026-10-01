'use client'
import { useEffect, useState } from 'react'
import { useMounted } from '@/hooks/useMounted'
import { site } from '@/data/site'

export default function LiveClock({ className = '' }: { className?: string }) {
  const mounted = useMounted()
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id) }, [])
  const time = mounted
    ? new Intl.DateTimeFormat('en-US', { timeZone: site.timezone, hour: 'numeric', minute: '2-digit' }).format(now)
    : '--:--'
  const hour = mounted ? Number(new Intl.DateTimeFormat('en-US', { timeZone: site.timezone, hour: 'numeric', hour12: false }).format(now)) % 24 : 12
  const tip = hour >= 8 && hour < 17 ? 'Probably at ByDecodes' : 'Probably coding ☕'
  return (
    <span title={mounted ? tip : undefined} className={`inline-flex items-center gap-1.5 font-mono text-xs uppercase ${className}`}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
      <span suppressHydrationWarning>{time} WIB</span>
    </span>
  )
}
