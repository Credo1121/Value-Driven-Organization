// Page structure from the approved plan (section 10). `ready` marks pages built so far.
export type NavItem = { href: string; label: string; area?: string; ready: boolean }

export const navItems: NavItem[] = [
  { href: '/why/', label: 'Why this matters', area: 'W', ready: true },
  { href: '/big-picture/', label: 'Big picture', area: 'A', ready: true },
  { href: '/capabilities/', label: 'Capabilities', area: 'B', ready: true },
  { href: '/references/', label: 'Reference approaches', area: 'C', ready: false },
  { href: '/scenarios/', label: 'Scenarios', area: 'D', ready: false },
  { href: '/example/', label: 'End-to-end example', area: 'E', ready: false },
  { href: '/glossary/', label: 'Glossary', ready: true },
  { href: '/sources/', label: 'Sources', ready: false },
]
