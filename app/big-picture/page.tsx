import type { Metadata } from 'next'
import Link from 'next/link'
import { getContent } from '@/content/load'
import { BigPictureText } from '@/ui/big-picture/BigPictureText'
import { SwimlaneMatrix } from '@/ui/big-picture/SwimlaneMatrix'
import { StatementBadge } from '@/ui/StatementBadge'
import styles from '@/ui/page.module.css'

export const metadata: Metadata = { title: 'Big picture' }

export default function BigPicturePage() {
  const { bigPicture, terms } = getContent()
  const termById = new Map(terms.map((t) => [t.id, t]))

  return (
    <>
      <p className={styles.eyebrow}>Area A</p>
      <h1>Big picture</h1>
      <p className={styles.preamble}>
        One steering cycle: six phases from left to right, three levels from top to bottom, cost and
        architecture running in parallel. Use <kbd>→</kbd> / <kbd>←</kbd> to walk through it.
      </p>
      <p>
        <StatementBadge type="synthesis" /> The assignment of activities to phases and levels is our
        integration of established approaches, not a framework standard. See the{' '}
        <Link href="/glossary/">glossary</Link> for terms.
      </p>

      <SwimlaneMatrix data={bigPicture} />
      <BigPictureText data={bigPicture} terms={termById} />
    </>
  )
}
