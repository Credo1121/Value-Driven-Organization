import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SiteHeader } from '@/ui/SiteHeader'
import styles from '@/ui/layout.module.css'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'The Value Driven Organization',
    template: '%s · The Value Driven Organization',
  },
  description:
    'A moderated explainer for integrated technology steering across EPM, TBM, LPM and Enterprise Architecture.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className={styles.main}>
          {children}
        </main>
        <footer className={styles.footer}>
          <span>Internal · Provisional design</span>
          <span>Illustrative content for moderated discussion – not a diagnosis.</span>
        </footer>
      </body>
    </html>
  )
}
