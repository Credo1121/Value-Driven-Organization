import type { Metadata } from 'next'
import Link from 'next/link'
import { getContent } from '@/content/load'
import styles from '@/ui/page.module.css'

export const metadata: Metadata = { title: 'Capabilities' }

export default function CapabilitiesPage() {
  const { capabilities } = getContent().bigPicture
  return (
    <>
      <p className={styles.eyebrow}>Area B</p>
      <h1>Capabilities</h1>
      <p className={styles.preamble}>
        Eight shared steering capabilities. Detailed deep dives follow in increment I3.
      </p>
      <ul className={styles.cardGrid}>
        {capabilities.map((c) => (
          <li key={c.id} className={styles.card}>
            <span className={styles.cardArea}>{c.code}</span>
            <Link href={`/capabilities/${c.id}/`}>{c.name}</Link>
            <span className={styles.cardStatus}>{c.question}</span>
          </li>
        ))}
      </ul>
    </>
  )
}
