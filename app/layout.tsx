import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Poppins, Space_Mono } from 'next/font/google'
import './globals.css'
import ThemeProvider from '@/components/providers/ThemeProvider'
import SmoothScroll from '@/components/providers/SmoothScroll'
import Grain from '@/components/layout/Grain'
import ScrollProgress from '@/components/layout/ScrollProgress'
import Cursor from '@/components/layout/Cursor'
import Preloader from '@/components/layout/Preloader'
import { site, PRELOADER_ONCE_PER_SESSION } from '@/data/site'

const display = Space_Grotesk({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--f-display', display: 'swap' })
const body = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--f-body', display: 'swap' })
const mono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--f-mono', display: 'swap' })

export const metadata: Metadata = {
  title: `${site.name} ${site.title}`,
  description: site.description,
  openGraph: { title: `${site.name} — ${site.title}`, description: site.description, type: 'website' },
  twitter: { card: 'summary_large_image', title: site.name, description: site.description },
}
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#EDE6D8' },
    { media: '(prefers-color-scheme: dark)', color: '#1E140E' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-loading="true" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var d=document.documentElement;try{var f=/[?&]preloader=1/.test(location.search),dev=${process.env.NODE_ENV === 'development'},once=${PRELOADER_ONCE_PER_SESSION};if(!f&&!dev&&once&&sessionStorage.getItem('ls-pre')){d.removeAttribute('data-loading')}else{sessionStorage.removeItem('ls-pre')}}catch(e){d.removeAttribute('data-loading')}})()` }} />
      </head>
      <body className="font-sans">
        <ThemeProvider>
          <SmoothScroll>
            <a href="#about" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-espresso">Skip to content</a>
            <Preloader />
            <div className="loading-hide"><ScrollProgress /><Cursor /><Grain /></div>
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  )
}
