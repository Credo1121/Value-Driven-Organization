import type { Metadata } from 'next'
import { getContent } from '@/content/load'
import { statementTypes, type GlossaryTerm } from '@/content/schema'
import { StatementBadge } from '@/ui/StatementBadge'
import { TermText } from '@/ui/TermText'
import styles from '@/ui/glossary.module.css'

export const metadata: Metadata = { title: 'Glossary' }

const categories: { id: GlossaryTerm['category']; label: string }[] = [
  { id: 'discipline', label: 'Disciplines' },
  { id: 'object', label: 'Steering objects' },
  { id: 'value-type', label: 'Financial value types' },
  { id: 'relationship', label: 'Link types' },
]

const byName = (a: GlossaryTerm, b: GlossaryTerm) => a.term.localeCompare(b.term, 'en')

export default function GlossaryPage() {
  const { terms, sources } = getContent()
  const termById = new Map(terms.map((t) => [t.id, t]))
  const sourceById = new Map(sources.map((s) => [s.id, s]))

  return (
    <>
      <h1>Glossary</h1>
      <p className={styles.intro}>
        One vocabulary across portfolio management, technology cost, architecture and delivery.
        Each term states how it differs from terms it is often confused with.
      </p>

      <h2 className="visually-hidden">Statement types</h2>
      <ul className={styles.legend} aria-label="Statement types">
        {statementTypes.map((t) => (
          <li key={t}>
            <StatementBadge type={t} />
          </li>
        ))}
      </ul>

      <nav aria-label="Glossary sections">
        <ul className={styles.categoryNav}>
          {categories.map((c) => (
            <li key={c.id}>
              <a href={`#${c.id}`}>{c.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      {categories.map((c) => {
        const list = terms.filter((t) => t.category === c.id).sort(byName)
        return (
          <section key={c.id} id={c.id} aria-labelledby={`${c.id}-heading`} className={styles.category}>
            <h2 id={`${c.id}-heading`}>{c.label}</h2>
            {list.length === 0 ? (
              <p>No terms in this section yet.</p>
            ) : (
              <ul className={styles.termList}>
                {list.map((t) => (
                  <li key={t.id} id={t.id} className={styles.term} tabIndex={-1}>
                    <div>
                      <h3 className={styles.termName}>{t.term}</h3>
                      <StatementBadge type={t.statementType} />
                    </div>
                    <div className={styles.body}>
                      <p>
                        <TermText text={t.definition} terms={termById} />
                      </p>
                      <span className={styles.label}>Distinction</span>
                      <p>
                        <TermText text={t.distinction} terms={termById} />
                      </p>
                      {t.variants && (
                        <>
                          <span className={styles.label}>Variants</span>
                          <p>{t.variants}</p>
                        </>
                      )}
                      {t.sourceIds.length > 0 && (
                        <p className={styles.meta}>
                          Sources:{' '}
                          {t.sourceIds.map((s, i) => (
                            <span key={s}>
                              {i > 0 && ', '}
                              {sourceById.get(s)?.title} ({s})
                            </span>
                          ))}
                        </p>
                      )}
                      {t.related.length > 0 && (
                        <p className={styles.meta}>
                          Related:{' '}
                          {t.related.map((r, i) => (
                            <span key={r}>
                              {i > 0 && ', '}
                              <a href={`#${r}`}>{termById.get(r)?.term}</a>
                            </span>
                          ))}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )
      })}
    </>
  )
}
