export default function Pill({ children, className = '', variant = 'neutral' }: { children: React.ReactNode; className?: string; variant?: 'neutral' | 'primary' | 'dark' }) {
  return <span className={`pill-gloss pill-${variant} inline-flex items-center px-3 py-1 font-mono text-[11px] uppercase tracking-wider ${className}`}>{children}</span>
}
