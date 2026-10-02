export type Social = { label: string; href: string }
export type Exp = { date: string; title: string; text: string; chips: string[]; label?: string; preview?: string } // preview: optional image path, e.g. '/images/journey/bydecodes.jpg'
export type Project = { slug: string; title: string; year: string; description: string; stack: string[]; link: string | null }

export const site = {
  name: 'Salsa®',
  short: 'Salsa',
  title: '',
  location: 'Semarang, ID',
  timezone: 'Asia/Jakarta',
  email: 'latifasalsa.works@gmail.com',
  description: 'Full-stack web developer from Semarang, Polines graduate (GPA 3.90). I build calm, fast, detail-obsessed interfaces, and I\'m now growing into machine learning.',
  socials: [
    { label: 'Email', href: 'mailto:latifasalsa.works@gmail.com' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/latifasalsab' },
    { label: 'GitHub', href: 'https://github.com/latifasalsab' },
    { label: 'Instagram', href: 'https://www.instagram.com/latifasalsab' },
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
  { value: 3, suffix: '+ yrs', decimals: 0, label: 'building for the web' },
  { value: 3.9, suffix: '', decimals: 2, label: 'GPA' },
  { value: 8, suffix: '', decimals: 0, label: 'featured projects' },
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
  { date: 'Feb 2026 – Now', title: 'Front-End Developer (Part-time) — By Decodes Media', text: 'Owning front-end delivery for the EduFarmers platform and building the interactive application flow for Japfa Scholarship with Blade and Vue. Turning designs into reusable components and helping front and back end shake hands over the API.', chips: ['Laravel Blade', 'Vue.js', 'Tailwind'] },
  { date: 'Aug – Dec 2025', title: 'Front-End Developer (Intern) — By Decodes Media', text: 'Built the Bodaq Hyundai branding site with animations and reusable layouts, plus an AI product website in Next.js focused on speed and a scalable component setup.', chips: ['Laravel Blade', 'JavaScript', 'Next.js'] },
  { date: 'Jun 2022 – May 2023', title: 'Fullstack Engineer Intern — Azura Labs', text: 'Shipped production apps for healthcare and logistics with Node.js, TypeScript, and React, then rebuilt one in Go and Fiber for cleaner code and faster APIs.', chips: ['Node.js', 'TypeScript', 'React', 'Go'] },
  { date: 'Mar – Jun 2023', title: 'Website Maintenance — Pentone', text: 'Deployed and maintained both front-end and back-end infrastructure, keeping the site running smoothly on Vercel and AWS EC2.', chips: ['Vercel', 'AWS EC2'] },
  { date: 'May – Aug 2023', title: 'Social Media & Content Designer — PT Cipta Perkasa Usahatama', text: 'Produced up to ten visuals and a product video a day, keeping every campaign on brand, including promos for religious holidays and Independence Day.', chips: ['Content design', 'Video'] },
  { date: 'May 2024 – May 2025', title: 'Campus & Beyond', text: 'Secretary at the Electrical Engineering Student Association, design team member at the Polytechnic Computer Club, and MC for a national seminar. Proof that I can code and hold a microphone.', chips: ['Leadership', 'Design', 'Public speaking'] },
  { label: 'EDUCATION', date: 'Sep 2023 – Sep 2026 · GPA 3.90/4.00', title: 'Politeknik Negeri Semarang — Informatics Engineering', text: 'Graduated with a thesis on GitHub repository analytics using Random Forest, Gradient Boosting, and K-Means.', chips: ['Python', 'scikit-learn', 'FastAPI'] },
]

export const projects: Project[] = [
  {
    slug: 'fradara',
    title: 'Fradara',
    year: '2026',
    description: 'Real-time fraud scoring for every expense and procurement transaction, so auditors catch what manual Excel checks never could.',
    stack: ['Machine Learning', 'REST API', 'RBAC'],
    link: 'https://fe-fraud-detection-platform.vercel.app/',
  },
  {
    slug: 'gitpulse',
    title: 'GitPulse',
    year: '2026',
    description: 'Connects to GitHub and uses machine learning to measure contributor productivity and repo health, based on real data instead of gut feeling.',
    stack: ['Python', 'FastAPI', 'scikit-learn', 'Next.js'],
    link: 'https://github.com/Yaps-Space',
  },
  {
    slug: 'infratek',
    title: 'Infratek',
    year: '2026',
    description: 'QR-based asset inventory for toll road infrastructure, with a Form Builder that lets admins customize data forms without writing code.',
    stack: ['Next.js', 'Firebase'],
    link: 'https://infratek-inventory.vercel.app/',
  },
  {
    slug: 'japfa-scholarship',
    title: 'JAPFA Scholarship',
    year: '2026',
    description: 'Scholarship platform with a dynamic application flow, built for a live client.',
    stack: ['Laravel', 'Blade', 'Vue.js', 'Tailwind'],
    link: 'https://beasiswajapfa.co.id/',
  },
  {
    slug: 'edufarmers',
    title: 'EduFarmers',
    year: '2026',
    description: 'Reusable component system and responsive UI for a live web platform.',
    stack: ['Laravel Blade', 'Tailwind'],
    link: 'https://edufarmers.org/',
  },
  {
    slug: 'bodaq-hyundai',
    title: 'Hyundai Bodaq',
    year: '2025',
    description: 'Product catalog for decorative interior films, with live color and finish previews and side-by-side comparison.',
    stack: ['Laravel Blade', 'JavaScript'],
    link: 'https://bodaq.co.id/',
  },
  {
    slug: 'coastal-fire-alert',
    title: 'Coastal Fire Alert',
    year: '2025',
    description: 'Early fire warning for coastal areas: live camera plus heat and smoke detection on ESP32-CAM.',
    stack: ['Flutter', 'Firebase', 'ESP32-CAM'],
    link: null,
  },
  {
    slug: 'hospital-intern',
    title: 'Hospital Intern',
    year: '2025',
    description: 'Internship management for a real hospital: rotation schedules, attendance, grading, and auto-generated certificates across three user roles.',
    stack: ['Laravel', 'MySQL'],
    link: null,
  },
]

// Draws a faint hairline at the floor (top of the letters) while tuning. Set to false to hide.
export const SHOW_FLOOR_LINE = true

// Hero physics bodies. `rest` = static pose for reduced motion: x in % of hero width,
// row = how many pill-heights above the floor, r = rotation in deg.
export type HeroBody = { t: string; v: 'neutral' | 'primary' | 'dark'; circle?: boolean; vertical?: boolean; desktopOnly?: boolean; rest: { x: number; row: number; r: number } }
export const heroBodies: HeroBody[] = [
  { t: 'WEB DEVELOPER', v: 'primary', rest: { x: 28, row: 0, r: -4 } },
  { t: 'SEMARANG, ID', v: 'neutral', rest: { x: 58, row: 0, r: 3 } },
  { t: 'UI/UX POLISH', v: 'neutral', rest: { x: 82, row: 0, r: -3 } },
  // { t: '↓', v: 'dark', circle: true, rest: { x: 44, row: 1, r: 0 } },
  { t: '✱', v: 'dark', circle: true, rest: { x: 70, row: 1, r: 0 } },
  { t: 'ML CURIOUS', v: 'primary', rest: { x: 14, row: 1, r: 6 } },
  { t: 'PORTFOLIO', v: 'dark', rest: { x: 44, row: 1, r: 0 } },
  { t: 'LATIFA', v: 'dark', desktopOnly: true, rest: { x: 36, row: 1, r: -5 } },
  // { t: 'LS©', v: 'neutral', desktopOnly: true, rest: { x: 90, row: 1, r: -6 } },
  // { t: 'SALSA', v: 'dark', vertical: true, desktopOnly: true, rest: { x: 6, row: 0, r: 8 } },
]

export const PRELOADER_MIN_MS = 1800 // minimum visible time, always enforced
export const PRELOADER_ONCE_PER_SESSION = true // ?preloader=1 forces it; dev shows it on every reload

// Tools tile (About): flat list, `featured` = the 5 main tools (bigger, darker chips)
export const toolChips: { t: string; featured: boolean }[] = [
  { t: 'Laravel', featured: true }, { t: 'Vue.js', featured: true }, { t: 'Next.js', featured: true }, { t: 'React', featured: true }, { t: 'Tailwind', featured: true },
  { t: 'Node.js', featured: false }, { t: 'Flutter', featured: false }, { t: 'Firebase', featured: false }, { t: 'Figma', featured: false }, { t: 'Python & FastAPI', featured: false }, { t: 'Docker', featured: false },
]
