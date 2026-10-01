import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Journey from '@/components/sections/Journey'
import Works from '@/components/sections/Works'
import LetsTalk from '@/components/sections/LetsTalk'

export default function Page() {
  return (
    <>
      <header><Navbar /></header>
      <main>
        <Hero />
        <About />
        <Journey />
        <Works />
        <LetsTalk />
      </main>
    </>
  )
}
