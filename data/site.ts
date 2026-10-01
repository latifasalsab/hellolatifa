export type Social = { label: string; href: string }
export type Exp = { date: string; title: string; text: string; chips: string[]; label?: string; preview?: string } // preview: optional image path, e.g. '/images/journey/bydecodes.jpg'
export type Project = { slug: string; title: string; year: string; description: string; stack: string[]; link: string | null }

export const site = {
  name: 'Latifa Salsabila',
  short: 'Salsa',
  title: 'Frontend Developer',
  location: 'Semarang, ID',
  timezone: 'Asia/Jakarta',
  email: 'hello@TODO.com', // TODO
  description: 'Frontend developer & final-year Informatics student in Semarang. I build calm, fast, detail-obsessed interfaces.',
  socials: [
    { label: 'Email', href: 'mailto:hello@TODO.com' }, // TODO
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/TODO' }, // TODO
    { label: 'GitHub', href: 'https://github.com/TODO' }, // TODO
    { label: 'Instagram', href: 'https://www.instagram.com/TODO' }, // TODO
  ] as Social[],
}

export const nav = [
  { label: 'About', href: '#about' },
  { label: 'Journey', href: '#journey' },
  { label: 'Works', href: '#works' },
]

export const statuses = ['Open to freelance', 'Booking for November', 'Thesis mode: on', 'Fueled by coffee ☕']

export const marquee = ['Laravel', 'Vue.js', 'React', 'Next.js', 'Tailwind', 'TypeScript', 'Node.js', 'Flutter', 'Python', 'Figma']

export const heroPills = [
  { t: 'FRONTEND DEVELOPER', x: '6%', y: '16%', r: -6, dx: -260, dy: -140 },
  { t: 'SEMARANG, ID', x: '72%', y: '14%', r: 5, dx: 240, dy: -160 },
  { t: 'UI/UX POLISH', x: '4%', y: '72%', r: 7, dx: -240, dy: 140, hide: true },
  { t: 'ML CURIOUS', x: '76%', y: '70%', r: -7, dx: 260, dy: 150, hide: true },
  { t: '↓', x: '44%', y: '12%', r: 0, dx: 0, dy: -200, dark: true },
  { t: '✱', x: '90%', y: '44%', r: 0, dx: 260, dy: 0, dark: true, hide: true },
]

export const stats = [
  { value: 4, suffix: ' yrs', decimals: 0, label: 'building for the web' }, // TODO
  { value: 3.91, suffix: '', decimals: 2, label: 'GPA' },
  { value: 10, suffix: '+', decimals: 0, label: 'projects' }, // TODO
]

export const aboutBlocks = [
  { title: 'What I do', items: ['Frontend builds', 'Reusable components', 'API integration', 'A little design on the side'] },
  { title: "What I'm into", items: ['UI/UX polish', 'Motion', 'ML & data', 'Content design', 'Public speaking'] },
]

export const skills = [
  { label: 'Core', items: ['Vue.js', 'React', 'Next.js', 'Laravel', 'Tailwind'] },
  { label: 'Also comfortable', items: ['Node.js', 'Flutter', 'Firebase', 'Figma'] },
  { label: 'Exploring', items: ['ML', 'FastAPI', 'Docker'] },
]

export const experience: Exp[] = [
  { date: 'Feb 2026 – Now', title: 'Frontend Developer — ByDecodes Media', text: 'Building the EduFarmers platform and contributing to Japfa Scholarship with Blade and Vue. Turning designs into reusable components and helping front and back end shake hands over the API.', chips: ['Laravel Blade', 'Vue.js', 'Tailwind'] },
  { date: 'Aug – Dec 2025', title: 'Frontend Intern — ByDecodes Media', text: 'Built the Bodaq Hyundai branding site with animations and reusable layouts, plus an AI product website in Next.js focused on speed and a scalable component setup.', chips: ['Laravel Blade', 'JavaScript', 'Next.js'] },
  { date: 'Jun 2022 – May 2023', title: 'Fullstack Engineer Intern — Azura Labs', text: 'Shipped production apps for healthcare and logistics with Node.js, TypeScript, and React, then rebuilt one in Go and Fiber for cleaner code and faster APIs.', chips: ['Node.js', 'TypeScript', 'React', 'Go'] },
  { date: 'May – Aug 2023', title: 'Content Designer — PT Cipta Perkasa Usahatama', text: 'Produced up to ten visuals and a product video a day, keeping every campaign on brand. Also maintained a website on Vercel and AWS at Pentone.', chips: ['Content design', 'Video', 'Vercel', 'AWS'] },
  { date: '2024 – 2025', title: 'Campus & Beyond', text: 'Secretary at the Electrical Engineering Student Association, design team member at the Polytechnic Computer Club, and MC for a national seminar. Proof that I can code and hold a microphone.', chips: ['Leadership', 'Design', 'Public speaking'] },
  { label: 'EDUCATION', date: '2023 – Now · GPA 3.91/4.00', title: 'Politeknik Negeri Semarang — Informatics Engineering', text: 'Currently writing my thesis on repository analytics with Random Forest, Gradient Boosting, and K-Means.', chips: ['Python', 'scikit-learn', 'FastAPI'] },
]

export const projects: Project[] = [
  { slug: 'gitpulse', title: 'GitPulse', year: '2026', description: 'Analytics platform that uses machine learning to measure GitHub repository performance and team collaboration.', stack: ['Python', 'FastAPI', 'scikit-learn', 'Next.js'], link: 'https://github.com/TODO' }, // TODO link + confirm stack
  { slug: 'japfa-scholarship', title: 'JAPFA Scholarship', year: '2026', description: 'Scholarship platform with a dynamic application flow, built for a live client with Blade and Vue.', stack: ['Laravel', 'Blade', 'Vue.js', 'Tailwind'], link: null }, // TODO link or keep null
  { slug: 'bodaq-hyundai', title: 'Bodaq Hyundai', year: '2025', description: 'Branding website with smooth animations and reusable components that give the brand a confident first impression.', stack: ['Laravel Blade', 'JavaScript'], link: null }, // TODO
  { slug: 'ai-product-website', title: 'AI Product Website', year: '2025', description: 'Fast, modern product site with a scalable component architecture, tuned for performance.', stack: ['Next.js', 'React'], link: null }, // TODO
  { slug: 'edufarmers', title: 'EduFarmers', year: '2026', description: 'Reusable component system and responsive UI for a live Laravel Blade web platform.', stack: ['Laravel Blade', 'Tailwind'], link: null }, // TODO
  { slug: 'coastal-fire-alert', title: 'Coastal Fire Alert', year: '2025', description: 'Early fire warning for coastal areas: live camera plus heat and smoke detection on ESP32-CAM.', stack: ['Flutter', 'Firebase', 'ESP32-CAM'], link: 'https://github.com/TODO' }, // TODO
]

// Draws a faint hairline at the floor (top of the letters) while tuning. Set to false to hide.
export const SHOW_FLOOR_LINE = true

// Hero physics bodies. `rest` = static pose for reduced motion: x in % of hero width,
// row = how many pill-heights above the floor, r = rotation in deg.
export type HeroBody = { t: string; v: 'neutral' | 'primary' | 'dark'; circle?: boolean; vertical?: boolean; desktopOnly?: boolean; rest: { x: number; row: number; r: number } }
export const heroBodies: HeroBody[] = [
  { t: 'FRONTEND DEVELOPER', v: 'primary', rest: { x: 28, row: 0, r: -4 } },
  { t: 'SEMARANG, ID', v: 'neutral', rest: { x: 58, row: 0, r: 3 } },
  { t: 'UI/UX POLISH', v: 'neutral', rest: { x: 82, row: 0, r: -3 } },
  { t: '↓', v: 'dark', circle: true, rest: { x: 44, row: 1, r: 0 } },
  { t: '✱', v: 'dark', circle: true, rest: { x: 70, row: 1, r: 0 } },
  { t: 'ML CURIOUS', v: 'primary', desktopOnly: true, rest: { x: 14, row: 1, r: 6 } },
  { t: 'LS©', v: 'neutral', desktopOnly: true, rest: { x: 90, row: 1, r: -6 } },
  { t: 'SALSA', v: 'dark', vertical: true, desktopOnly: true, rest: { x: 6, row: 0, r: 8 } },
]
