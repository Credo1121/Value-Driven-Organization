import Link from 'next/link'
import { linkTypeLabels, valueTypeLabels, type BigPicture } from '@/content/schema'
import { TermText } from '@/ui/TermText'
import type { GlossaryTerm } from '@/content/schema'
import { formatLeads } from './leads'
import styles from './text.module.css'

// Text alternative with the same information as the matrix (AC-003-6). Server-rendered.
export function BigPictureText({ data, terms }: { data: BigPicture; terms: Map<string, GlossaryTerm> }) {
  const capById = new Map(data.capabilities.map((c) => [c.id, c]))
  const laneById = new Map(data.lanes.map((l) => [l.id, l]))
  const shortName = new Map(data.disciplines.map((d) => [d.id, d.short]))
  const phaseLabel = (id: string) => data.phases.find((p) => p.id === id)?.label ?? id

  return (
    <details className={styles.text} id="text-view">
      <summary>Text view: all phases, levels and hand-offs</summary>

      <ol className={styles.phases}>
        {data.phases.map((p) => {
          const cap = capById.get(p.capabilityId)!
          const cells = data.lanes
            .filter((l) => l.kind === 'hierarchy')
            .flatMap((l) => data.cells.filter((c) => c.lane === l.id && c.phase === p.id))
          return (
            <li key={p.id}>
              <h3>
                {p.label} – <Link href={`/capabilities/${cap.id}/`}>{`${cap.code} ${cap.name}`}</Link>
              </h3>
              <p className={styles.meta}>
                Leads: {formatLeads(cap, shortName)}
                {cap.leadNote && <> – {cap.leadNote}</>}
              </p>
              <ul>
                {cells.map((c) => (
                  <li key={`${c.lane}/${c.phase}`}>
                    <strong>
                      {laneById.get(c.lane)?.label}: {c.title}.
                    </strong>{' '}
                    <TermText text={c.detail} terms={terms} />
                    {c.handoff && (
                      <>
                        {' '}
                        <em>
                          {linkTypeLabels[c.handoff.type]} to {laneById.get(c.handoff.to)?.label}: {c.handoff.label}.
                        </em>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ol>

      {data.lanes
        .filter((l) => l.kind !== 'hierarchy')
        .map((l) => {
          const cap = l.capabilityId ? capById.get(l.capabilityId) : undefined
          return (
            <section key={l.id} aria-label={l.label}>
              <h3>
                {l.kind === 'parallel' ? 'In parallel' : 'Adjacent'}:{' '}
                {cap ? <Link href={`/capabilities/${cap.id}/`}>{`${cap.code} ${l.label}`}</Link> : l.label} ({l.sublabel})
              </h3>
              <ul>
                {data.cells
                  .filter((c) => c.lane === l.id)
                  .map((c) => (
                    <li key={`${c.lane}/${c.phase}`}>
                      <strong>
                        {phaseLabel(c.phase)}: {c.title}.
                      </strong>{' '}
                      <TermText text={c.detail} terms={terms} />
                      {c.valueTypes.length > 0 && (
                        <span className={styles.meta}> Value types: {c.valueTypes.map((v) => valueTypeLabels[v]).join(', ')}.</span>
                      )}
                    </li>
                  ))}
              </ul>
            </section>
          )
        })}

      <h3>{linkTypeLabels[data.feedback.type]}</h3>
      <p>
        From {phaseLabel(data.feedback.from)} to {data.feedback.to.map(phaseLabel).join(' and ')}: {data.feedback.label}
      </p>
    </details>
  )
}
