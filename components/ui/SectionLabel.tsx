import Asterisk from './Asterisk'
export default function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted"><Asterisk size={12} />{children}</p>
}
