'use client'
import { useEffect, useRef, type RefObject } from 'react'
import Matter from 'matter-js'

type Opts = {
  root: RefObject<HTMLElement | null> // pill layer; all coordinates are relative to it (= hero rect)
  getFloor: () => number // y (px, root-relative) of the top edge of the letters
  enabled: boolean // false for reduced motion
  start: boolean // everything measured -> begin
  drag: boolean // false on touch
  stagger?: number
  gravity?: number
  rebuildKey?: string // change => world is rebuilt (resize / floor moved)
  debug?: boolean
}

export function usePhysicsPills(o: Opts) {
  const ref = useRef(o)
  ref.current = o
  const { enabled, start, drag, rebuildKey, debug } = o

  useEffect(() => {
    const root = ref.current.root.current
    if (!root || !enabled || !start) return
    const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint, Sleeping } = Matter
    type Item = { b: Matter.Body; el: HTMLElement; w: number; h: number }
    let engine!: Matter.Engine
    let items: Item[] = [], timers: number[] = []
    let raf = 0, running = false, visible = true, idle = 0, spawned = 0, dragging = false, floorY = 0, W = 0
    let mouse: (Matter.Mouse & { mousemove: EventListener; mouseup: EventListener }) | null = null
    let cv: HTMLCanvasElement | null = null
    const rand = (a: number, b: number) => a + Math.random() * (b - a)

    const draw = () => { // ?debug=1 only
      if (!cv) return
      const r = root.getBoundingClientRect(); cv.width = r.width; cv.height = r.height
      const g = cv.getContext('2d')!
      g.strokeStyle = '#ff00ff'; g.lineWidth = 1
      for (const b of engine.world.bodies) {
        g.beginPath(); b.vertices.forEach((v, i) => (i ? g.lineTo(v.x, v.y) : g.moveTo(v.x, v.y))); g.closePath(); g.stroke()
      }
      g.strokeStyle = '#00cc00'; g.beginPath(); g.moveTo(0, floorY); g.lineTo(W, floorY); g.stroke()
    }

    const loop = () => {
      if (!running) return
      for (let s = 0; s < 2; s++) { // 2 sub-steps of 1000/120
        Engine.update(engine, 1000 / 120)
        for (const it of items) {
          const v = it.b.velocity, sp = Math.hypot(v.x, v.y)
          if (sp > 35) Body.setVelocity(it.b, { x: (v.x * 35) / sp, y: (v.y * 35) / sp })
        }
      }
      let asleep = true
      for (const it of items) {
        const { x, y } = it.b.position
        it.el.style.transform = `translate3d(${x - it.w / 2}px,${y - it.h / 2}px,0) rotate(${it.b.angle}rad)`
        if (!it.b.isSleeping) asleep = false
      }
      draw()
      idle = asleep && spawned >= items.length && !dragging ? idle + 1 : 0
      if (idle > 30) { running = false; return } // settled: CPU ~0
      raf = requestAnimationFrame(loop)
    }
    const kick = () => { if (running || !visible || document.hidden) return; running = true; idle = 0; raf = requestAnimationFrame(loop) }
    const halt = () => { running = false; cancelAnimationFrame(raf) }

    const setup = () => {
      engine = Engine.create({ positionIterations: 10, velocityIterations: 8, enableSleeping: true })
      engine.gravity.y = ref.current.gravity ?? 1.2
      W = root.clientWidth; floorY = ref.current.getFloor()
      const wall = { isStatic: true }, H = 4000
      Composite.add(engine.world, [
        Bodies.rectangle(W / 2, floorY + 200, W + 800, 400, wall), // floor: top edge = top of the letters, 400px thick
        Bodies.rectangle(-100, floorY - H / 2 + 400, 200, H, wall), // left wall, inner edge x = 0
        Bodies.rectangle(W + 100, floorY - H / 2 + 400, 200, H, wall), // right wall, inner edge x = W
        // no ceiling: pills spawn above the hero and fall in
      ])
      items = [...root.querySelectorAll<HTMLElement>('[data-pill]')].map((el) => {
        const w = el.offsetWidth, h = el.offsetHeight
        const opt = { restitution: rand(0.3, 0.4), friction: 0.4, frictionAir: 0.01, density: rand(0.0009, 0.0016) }
        const b = el.hasAttribute('data-circle') ? Bodies.circle(0, 0, w / 2, opt) : Bodies.rectangle(0, 0, w, h, { ...opt, chamfer: { radius: Math.min(w, h) / 2 } })
        el.style.opacity = '0'
        return { b, el, w, h }
      })
      // distinct x slots (shuffled) so no two pills spawn on top of each other
      const slots = items.map((_, i) => W * (0.08 + (0.84 * (i + 0.5)) / items.length)).sort(() => Math.random() - 0.5)
      items.forEach((it, i) => timers.push(window.setTimeout(() => {
        Body.setPosition(it.b, { x: slots[i] + rand(-W * 0.02, W * 0.02), y: rand(-200, -60) })
        Body.setAngle(it.b, rand(-0.44, 0.44)); Body.setAngularVelocity(it.b, rand(-0.08, 0.08))
        Composite.add(engine.world, it.b); it.el.style.opacity = '1'; spawned++; kick()
      }, i * (ref.current.stagger ?? 110))))
      if (ref.current.drag) {
        mouse = Mouse.create(root) as typeof mouse
        const m = mouse!
        root.removeEventListener('mousewheel', (m as any).mousewheel); root.removeEventListener('DOMMouseScroll', (m as any).mousewheel) // keep Lenis wheel
        window.addEventListener('mousemove', m.mousemove); window.addEventListener('mouseup', m.mouseup)
        Composite.add(engine.world, MouseConstraint.create(engine, { mouse: m, constraint: { stiffness: 0.2, render: { visible: false } } }))
      }
      if (ref.current.debug) {
        cv = document.createElement('canvas')
        Object.assign(cv.style, { position: 'absolute', inset: '0', pointerEvents: 'none', zIndex: '5' })
        root.appendChild(cv)
        console.table({ rootW: W, rootH: root.clientHeight, floorY })
        console.table(items.map((i, k) => ({ pill: k, w: i.w, h: i.h })))
      }
    }

    const down = () => { dragging = true; kick() }
    const up = () => { dragging = false; kick() }
    let lastY = window.scrollY
    const onScroll = () => {
      const dy = window.scrollY - lastY; lastY = window.scrollY
      if (!visible || Math.abs(dy) < 2 || spawned < items.length) return
      const c = Math.min(60, Math.abs(dy))
      for (const it of items) {
        Sleeping.set(it.b, false)
        Body.applyForce(it.b, it.b.position, { x: rand(-1, 1) * it.b.mass * 0.00004 * c, y: -c * it.b.mass * 0.00004 })
      }
      kick()
    }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? kick() : halt() })
    const vis = () => (document.hidden ? halt() : kick())

    setup()
    io.observe(root)
    root.addEventListener('pointerdown', down); window.addEventListener('pointerup', up)
    window.addEventListener('scroll', onScroll, { passive: true }); document.addEventListener('visibilitychange', vis)
    return () => { // StrictMode-safe: one engine, one loop
      halt(); timers.forEach(clearTimeout); io.disconnect()
      if (mouse) { window.removeEventListener('mousemove', mouse.mousemove); window.removeEventListener('mouseup', mouse.mouseup) }
      cv?.remove()
      Composite.clear(engine.world, false); Engine.clear(engine)
      items.forEach((i) => { i.el.style.opacity = '0' })
      root.removeEventListener('pointerdown', down); window.removeEventListener('pointerup', up)
      window.removeEventListener('scroll', onScroll); document.removeEventListener('visibilitychange', vis)
    }
  }, [enabled, start, drag, rebuildKey, debug])
}
