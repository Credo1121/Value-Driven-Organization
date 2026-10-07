import type { Metadata } from 'next'
import Link from 'next/link'
import { getContent } from '@/content/load'
import { BigPictureText } from '@/ui/big-picture/BigPictureText'
import { CycleOverview } from '@/ui/big-picture/CycleOverview'
import { SwimlaneMatrix } from '@/ui/big-picture/SwimlaneMatrix'
import { StatementBadge } from '@/ui/StatementBadge'
import styles from '@/ui/page.module.css'

export const metadata: Metadata = { title: 'Big picture' }

export default function BigPicturePage() {
  const { bigPicture, terms } = getContent()
  const termById = new Map(terms.map((t) => [t.id, t]))

  return (
    <>
      <h1>One steering cycle. Three levels. Six phases.</h1>
      <p className={styles.preamble}>
        Follow how a decision at the top shapes what portfolios and teams can do next – and how results flow back.
      </p>

      <div className={styles.section}>
        <CycleOverview data={bigPicture} />
      </div>

      <section className={styles.section} aria-labelledby="detail-view-heading">
        <h2 id="detail-view-heading">Walk through the cycle</h2>
        <p className={styles.preamble}>
          Every phase in detail: what each level does, what is handed down, what runs in parallel. Use <kbd>→</kbd> /{' '}
          <kbd>←</kbd> to move on.
        </p>
        <SwimlaneMatrix data={bigPicture} />
      </section>

      <p className={styles.section}>
        <StatementBadge type="synthesis" /> The assignment of activities to phases and levels is our integration of
        established approaches, not a framework standard. See the <Link href="/glossary/">glossary</Link> for terms.
      </p>
      <BigPictureText data={bigPicture} terms={termById} />
    </>
  )
}
