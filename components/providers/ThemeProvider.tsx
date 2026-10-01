'use client'
import { ThemeProvider as NT } from 'next-themes'
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <NT attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>{children}</NT>
}
