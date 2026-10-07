import type { Metadata } from 'next'
import Link from 'next/link'
import { getContent } from '@/content/load'
import styles from '@/ui/page.module.css'

export const metadata: Metadata = { title: 'Capabilities' }

export default function CapabilitiesPage() {
  const { bigPicture, deepDives } = getContent()
  const { capabilities } = bigPicture
  const status = new Map(deepDives.map((d) => [d.capabilityId, d.status]))
  return (
    <>
      <p className={styles.eyebrow}>Area B</p>
      <h1>Capabilities</h1>
      <p className={styles.preamble}>
        Eight shared steering capabilities. Each deep dive follows the same template; content is added step by step.
      </p>
      <ul className={styles.cardGrid}>
        {capabilities.map((c) => (
          <li key={c.id} className={styles.card}>
            <span className={styles.cardArea}>{c.code}</span>
            <Link href={`/capabilities/${c.id}/`}>{c.name}</Link>
            <span className={styles.cardStatus}>{c.question}</span>
            <span className={styles.cardStatus}>
              {status.get(c.id) === 'open' ? 'Template – content to be defined' : 'Draft content'}
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}
