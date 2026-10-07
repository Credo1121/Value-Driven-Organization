'use client'

import Link from 'next/link'
import { useState } from 'react'
import { type BigPicture } from '@/content/schema'
import { ORBIT, polar, ringSegmentPath, segmentAngles, wrapLabel } from './geometry'
import { formatLeads } from './leads'
import styles from './cycle.module.css'

// Entry and overview picture (concept C): the steering cycle as a ring. Phases are segments,
// levels are concentric rings (enterprise outside, teams inside). Selecting a phase shows,
// in the card beside it, what happens on each level, what is handed down and what comes next.

const LEVELS = ['enterprise', 'portfolio', 'delivery'] as const

export function CycleOverview({ data, initialPhase = 'fund' }: { data: BigPicture; initialPhase?: string }) {
  const [phaseId, setPhaseId] = useState(initialPhase)
  const n = data.phases.length
  const index = Math.max(0, data.phases.findIndex((p) => p.id === phaseId))
  const phase = data.phases[index]!
  const next = data.phases[(index + 1) % n]!
  const cap = data.capabilities.find((c) => c.id === phase.capabilityId)!
  const short = new Map(data.disciplines.map((d) => [d.id, d.short]))
  const laneLabel = new Map(data.lanes.map((l) => [l.id, l.label]))
  const cellAt = (lane: string, p: string) => data.cells.find((c) => c.lane === lane && c.phase === p)
  const { c, core, rings } = ORBIT
  const bounds = [rings[0], rings[1], rings[2], core] as const

  function select(i: number) {
    setPhaseId(data.phases[(i + n) % n]!.id)
  }

  const levelSteps = LEVELS.map((lane) => ({ lane, cell: cellAt(lane, phase.id) }))
  const sel = segmentAngles(index, n)
  const nextSeg = segmentAngles(index + 1, n)

  return (
    <section className={styles.wrap} aria-labelledby="cycle-heading">
      <div className={styles.visual}>
        <svg
          viewBox={`0 0 ${ORBIT.size} ${ORBIT.size}`}
          className={styles.svg}
          role="img"
          aria-labelledby="cycle-title"
          data-testid="cycle"
        >
          {/* One string: mixed text children in <title> hydrate differently on server and client. */}
          <title id="cycle-title">{`Steering cycle with six phases. Selected: ${phase.label}. Enterprise is the outer ring, portfolio the middle ring, delivery and operations the inner ring.`}</title>
          <defs>
            <linearGradient id="seg-hot" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" className={styles.stopSoft} />
              <stop offset="1" className={styles.stopHot} />
            </linearGradient>
            <marker id="arrow-down" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0 0 L10 5 L0 10 z" className={styles.arrowInk} />
            </marker>
            <marker id="arrow-next" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0 0 L10 5 L0 10 z" className={styles.arrowAccent} />
            </marker>
          </defs>

          {/* Thin outer line: cost (TBM) and architecture (EA) run through every phase. */}
          <circle cx={c} cy={c} r={rings[0] + 18} className={styles.halo} />

          {data.phases.map((p, i) => {
            const { a1, a2, mid } = segmentAngles(i, n)
            const on = i === index
            return (
              <g key={p.id} data-phase={p.id} className={styles.segment}>
                {LEVELS.map((lane, li) => {
                  const has = Boolean(cellAt(lane, p.id))
                  const cls = on ? styles[`on${li}`] : has ? styles.filled : styles.empty
                  return <path key={lane} d={ringSegmentPath(bounds[li + 1]!, bounds[li]!, a1, a2)} className={cls} />
                })}
                {LEVELS.map((lane, li) => {
                  const cell = cellAt(lane, p.id)
                  if (!cell) return null
                  const r = (bounds[li]! + bounds[li + 1]!) / 2
                  const [tx, ty] = polar(r, mid)
                  const lines = wrapLabel(cell.title, li === 2 ? 11 : 14)
                  return (
                    <text
                      key={lane}
                      x={tx}
                      y={ty - ((lines.length - 1) * 12) / 2 + 4}
                      textAnchor="middle"
                      className={on ? (li === 0 ? styles.labelOnDark : styles.labelOn) : styles.label}
                    >
                      {lines.map((l, j) => (
                        <tspan key={j} x={tx} dy={j === 0 ? 0 : 12}>
                          {l}
                        </tspan>
                      ))}
                    </text>
                  )
                })}
                {(() => {
                  const [lx, ly] = polar(rings[0] + 40, mid)
                  const anchor = Math.abs(lx - c) < 40 ? 'middle' : lx > c ? 'start' : 'end'
                  return (
                    <text x={lx} y={ly + 6} textAnchor={anchor} className={on ? styles.phaseOn : styles.phase}>
                      <tspan className={styles.phaseNum}>{i + 1} </tspan>
                      {p.label}
                    </text>
                  )
                })()}
              </g>
            )
          })}

          {/* Influence: down through the levels of the selected phase … */}
          {(() => {
            // Along the right edge of the segment, ending at the delivery ring so no label is crossed.
            const a = sel.a2 - 0.07
            const [x1, y1] = polar(rings[0] - 12, a)
            const [x2, y2] = polar(rings[2] + 4, a)
            return <path d={`M${x1},${y1} L${x2},${y2}`} className={styles.down} markerEnd="url(#arrow-down)" />
          })()}
          {/* … and on into the next phase. */}
          {(() => {
            const r = (rings[1] + rings[2]) / 2 - 2
            const [x1, y1] = polar(r, sel.a2 - 0.02)
            const [x2, y2] = polar(r, nextSeg.a1 + 0.2)
            return <path d={`M${x1},${y1} A${r},${r} 0 0 1 ${x2},${y2}`} className={styles.next} markerEnd="url(#arrow-next)" />
          })()}

          <circle cx={c} cy={c} r={core - 6} className={styles.core} />
          <text x={c} y={c - 4} textAnchor="middle" className={styles.coreTitle}>
            Outcomes
          </text>
          <text x={c} y={c + 16} textAnchor="middle" className={styles.coreSub}>
            feed the next cycle
          </text>
        </svg>

        <ul className={styles.phaseButtons} aria-label="Select a phase">
          {data.phases.map((p, i) => (
            <li key={p.id}>
              <button type="button" aria-pressed={i === index} onClick={() => select(i)} data-select={p.id}>
                <span className={styles.btnNum}>{i + 1}</span> {p.label}
              </button>
            </li>
          ))}
        </ul>
        <p className={styles.ringKey}>
          Outer ring: Enterprise · Middle: Portfolio · Inner: Delivery &amp; operations · Outer line: cost and architecture
        </p>
      </div>

      <div className={styles.side}>
        <h2 id="cycle-heading" className={styles.title}>
          The steering cycle
        </h2>
        <p className={styles.lede}>
          Six phases around the ring. Enterprise on the outside, teams at the core. Cost and architecture run through
          everything.
        </p>

        <article className={styles.card} aria-live="polite" data-testid="cycle-card">
          <div className={styles.cardHead}>
            <h3>
              <span className={styles.cardNum}>{index + 1}</span> {phase.label}
            </h3>
            <span className={styles.who}>
              {cap.code} · {formatLeads(cap, short)}
            </span>
          </div>

          <ol className={styles.levels}>
            {levelSteps.map(({ lane, cell }, li) => (
              <li key={lane} className={cell ? styles.levelOn : styles.levelOff} data-level={lane}>
                <span className={styles.levelTag} data-depth={li}>
                  {laneLabel.get(lane)} level
                </span>
                {cell ? (
                  <>
                    <strong>{cell.title}</strong>
                    {cell.handoff && (
                      <span className={styles.handoff}>
                        <span aria-hidden="true">{LEVELS.indexOf(cell.handoff.to as never) > li ? '↓' : '↑'}</span>{' '}
                        {cell.handoff.label}
                        <span className="visually-hidden">
                          {' '}
                          ({LEVELS.indexOf(cell.handoff.to as never) > li ? 'handed down' : 'reported up'} to{' '}
                          {laneLabel.get(cell.handoff.to)})
                        </span>
                      </span>
                    )}
                  </>
                ) : (
                  <span className={styles.idle}>No dedicated step on this level</span>
                )}
              </li>
            ))}
          </ol>

          <p className={styles.nextLine}>
            <span aria-hidden="true">→</span> Next: <strong>{next.label}</strong>
            {index === n - 1 ? ' – the evidence starts the next cycle.' : ' works within what this phase has set.'}
          </p>
          <p className={styles.cardLinks}>
            <Link href={`/capabilities/${cap.id}/`}>Open {cap.name}</Link>
            <a href={`#detail-${phase.id}`}>Show in the detailed view</a>
          </p>
        </article>
      </div>
    </section>
  )
}
