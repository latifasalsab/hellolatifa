'use client'
import { useId } from 'react'

export default function Asterisk({ arms = 6, size = 24, gradient = false, spin = false, className = '' }: { arms?: number; size?: number | string; gradient?: boolean; spin?: boolean; className?: string }) {
  const id = useId().replace(/:/g, '')
  const n = Math.max(3, Math.min(4, Math.round(arms / 2))) // each rounded bar draws two opposite arms
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100" aria-hidden className={`${spin ? 'ast-spin' : ''} ${className}`} fill={gradient ? `url(#${id})` : 'currentColor'}>
      {gradient && (
        <defs>
          <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="-50" y1="-50" x2="50" y2="50">
            <stop offset="0" style={{ stopColor: 'var(--ast-a)' }} />
            <stop offset=".55" style={{ stopColor: 'var(--ast-b)' }} />
            <stop offset="1" style={{ stopColor: 'var(--ast-c)' }} />
          </linearGradient>
        </defs>
      )}
      {Array.from({ length: n }, (_, i) => <rect key={i} x="-8" y="-46" width="16" height="92" rx="8" transform={`rotate(${(i * 180) / n})`} />)}
    </svg>
  )
}
