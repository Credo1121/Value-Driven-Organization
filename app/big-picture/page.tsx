import type { Metadata } from 'next'
import Link from 'next/link'
import { getContent } from '@/content/load'
import { BigPictureExplorer } from '@/ui/big-picture/BigPictureExplorer'
import { BigPictureText } from '@/ui/big-picture/BigPictureText'
import { StatementBadge } from '@/ui/StatementBadge'
import styles from '@/ui/page.module.css'

export const metadata: Metadata = { title: 'Big picture' }

export default function BigPicturePage() {
  const { bigPicture } = getContent()

  return (
    <>
      <p className={styles.eyebrow}>Area A</p>
      <h1>Big picture</h1>
      <p className={styles.preamble}>
        One steering system, eight shared capabilities. Each line has one defined meaning. Use{' '}
        <kbd>→</kbd> / <kbd>←</kbd> to move through the guided steps.
      </p>
      <p>
        <StatementBadge type="synthesis" /> The assignment of capabilities and lead disciplines is
        our integration of established approaches, not a framework standard. See the{' '}
        <Link href="/glossary/">glossary</Link> for terms.
      </p>

      <BigPictureExplorer data={bigPicture} />
      <BigPictureText data={bigPicture} />
    </>
  )
}
