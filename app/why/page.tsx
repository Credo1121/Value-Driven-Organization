import type { Metadata } from 'next'
import Link from 'next/link'
import { getContent } from '@/content/load'
import { StatementBadge } from '@/ui/StatementBadge'
import styles from '@/ui/page.module.css'

export const metadata: Metadata = { title: 'Why this matters' }

// SCQA entry page (Situation – Complication – Question – Answer), before the big picture (E31).

export default function WhyPage() {
  const { breaks } = getContent()

  return (
    <>
      <p className={styles.eyebrow}>Why this matters</p>
      <h1>One steering system, four worlds that rarely talk to each other</h1>
      <p className={styles.preamble}>
        Strategy, investment, funding, technology cost, architecture, delivery, operations and value
        realisation already work as one steering system in every organisation – whether it is managed that
        way or not.
      </p>

      <section aria-labelledby="breaks-heading" className={styles.section}>
        <h2 id="breaks-heading">Seven typical breaks</h2>
        <ol className={styles.breakList}>
          {breaks.map((b) => (
            <li key={b.id}>{b.text}</li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="disciplines-heading" className={styles.section}>
        <h2 id="disciplines-heading">Why finance, EPM, EA and LPM each need this connection</h2>
        <p>
          <StatementBadge type="synthesis" />
        </p>
        <ul className={styles.disciplineList}>
          <li>
            <span className={styles.disciplineName}>Finance &amp; controlling</span>
            Budget, forecast and actuals often run separately from technology cost (TBM) and portfolio
            decisions (EPM/LPM) – variances can be traced back to cost centres, but not to the investment
            decisions that caused them.
          </li>
          <li>
            <span className={styles.disciplineName}>EPM</span>
            Enterprise investment themes and portfolio budgets set priorities along the digitalisation
            strategy and weight portfolios and value streams accordingly; significant cross-cutting themes
            are funded jointly instead of being pushed onto a single portfolio. Without a reliable view of
            technology cost (TBM) or architecture lifecycle risk (EA), these guardrails look arbitrary
            rather than well-founded.
          </li>
          <li>
            <span className={styles.disciplineName}>EA</span>
            Target architecture and technology roadmaps (SaaS, IaaS, PaaS) are often shaped in isolation
            from portfolio funding – modernisation then competes invisibly with new investments instead of
            being planned and priced in.
          </li>
          <li>
            <span className={styles.disciplineName}>LPM</span>
            Portfolio strategy, value stream funding and the portfolio Kanban only prioritise consistently
            with the enterprise level when they receive EPM&apos;s strategic frame and guardrails – on top
            of the cost basis from TBM and the architecture guardrails from EA. Without that frame, every
            portfolio prioritises by its own logic.
          </li>
        </ul>
        <p>
          Across all four: evidence from cost, operations and value realisation rarely feeds back in a
          structured way into the next round of decisions.
        </p>
      </section>

      <section aria-labelledby="question-heading" className={styles.section}>
        <h2 id="question-heading" className={styles.question}>
          How do you connect these four worlds without inventing a new steering discipline?
        </h2>
      </section>

      <section aria-labelledby="answer-heading" className={styles.section}>
        <h2 id="answer-heading">Answer</h2>
        <article className={styles.answerCard}>
          <p>
            By connecting what already works best in each discipline into one visible steering cycle –
            so a decision at the top shows what it funds, what it constrains, and what it should learn from
            next time.
          </p>
          <p className={styles.cta}>
            <Link href="/big-picture/">See the steering cycle →</Link>
          </p>
        </article>
      </section>
    </>
  )
}
