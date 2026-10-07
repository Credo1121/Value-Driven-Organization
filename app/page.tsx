import Link from 'next/link'
import { getContent } from '@/content/load'
import { navItems } from '@/ui/navigation'
import styles from '@/ui/page.module.css'

export default function HomePage() {
  const areas = navItems.filter((n) => n.area)
  const { breaks } = getContent()

  return (
    <>
      <p className={styles.eyebrow}>Integrated technology steering</p>
      <h1>The Value Driven Organization</h1>
      <p className={styles.preamble}>
        How strategy, investment, funding, technology cost, architecture, delivery, operations
        and value realisation work as one steering system – and how that depends on the way an
        organisation is set up.
      </p>

      <section aria-labelledby="breaks-heading" className={styles.section}>
        <h2 id="breaks-heading">Seven typical breaks</h2>
        <ol className={styles.breakList}>
          {breaks.map((b) => (
            <li key={b.id}>{b.text}</li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="areas-heading" className={styles.section}>
        <h2 id="areas-heading">Explore</h2>
        <ul className={styles.cardGrid}>
          {areas.map((a) => (
            <li key={a.href} className={styles.card}>
              <span className={styles.cardArea}>{a.area}</span>
              {a.ready ? (
                <Link href={a.href}>{a.label}</Link>
              ) : (
                <>
                  <span className={styles.cardTitle}>{a.label}</span>
                  <span className={styles.cardStatus}>In preparation</span>
                </>
              )}
            </li>
          ))}
        </ul>
        <p>
          Terms used throughout the app are defined in the <Link href="/glossary/">glossary</Link>.
        </p>
      </section>
    </>
  )
}
