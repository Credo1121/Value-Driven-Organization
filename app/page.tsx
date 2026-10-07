import Link from 'next/link'
import { navItems } from '@/ui/navigation'
import styles from '@/ui/page.module.css'

// The seven breaks from docs/project-context.md (confirmed requirement).
const breaks = [
  'Strategic objectives are poorly linked to investment decisions.',
  'IT cost and portfolio management use different terms and data structures.',
  'Funding, cost recovery and prioritisation are not traceably connected.',
  'Enterprise-wide initiatives are hard to steer across portfolios and delivery organisations.',
  'Architecture dependencies and technology lifecycles are considered too late.',
  'Delivery is measured, but value realisation remains unclear.',
  'Insights from cost, operations and results do not flow back into new decisions.',
]

export default function HomePage() {
  const areas = navItems.filter((n) => n.area)

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
            <li key={b}>{b}</li>
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
