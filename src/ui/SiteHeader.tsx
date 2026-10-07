'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navItems } from './navigation'
import styles from './layout.module.css'

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>
        The Value Driven Organization
      </Link>
      <nav aria-label="Main">
        <ul className={styles.navList}>
          {navItems.map((item) => {
            const current = pathname === item.href || pathname === item.href.replace(/\/$/, '')
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={styles.navLink}
                  aria-current={current ? 'page' : undefined}
                >
                  {item.area && <span className={styles.navArea}>{item.area}</span>}
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
