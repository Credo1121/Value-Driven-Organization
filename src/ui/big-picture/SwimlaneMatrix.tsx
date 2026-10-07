'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { linkTypeLabels, valueTypeLabels, type BigPicture, type Cell } from '@/content/schema'
import { formatLeads } from './leads'
import { buildSteps, clampStep } from './steps'
import styles from './swimlanes.module.css'

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')
const stripMarkers = (t: string) => t.replace(/\[\[[a-z0-9-]+\|([^\]]+)\]\]/g, '$1').replace(/\[\[([a-z0-9-]+)\]\]/g, '$1')

export function SwimlaneMatrix({ data }: { data: BigPicture }) {
  const [steps] = useState(() => buildSteps(data))
  const [stepIndex, setStepIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const step = steps[clampStep(stepIndex, steps)]!
  const stepCount = steps.length

  const go = useCallback(
    (delta: number) => setStepIndex((i) => Math.min(Math.max(i + delta, 0), stepCount - 1)),
    [stepCount],
  )

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      if ((e.target as HTMLElement | null)?.closest('input, textarea, select')) return
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault()
        go(1)
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        go(-1)
      } else if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const phaseIndex = new Map(data.phases.map((p, i) => [p.id, i]))
  const capById = new Map(data.capabilities.map((c) => [c.id, c]))
  const laneById = new Map(data.lanes.map((l) => [l.id, l]))
  const shortName = new Map(data.disciplines.map((d) => [d.id, d.short]))
  const cellAt = (lane: string, phase: string) => data.cells.find((c) => c.lane === lane && c.phase === phase)
  const cellKey = (c: Cell) => `${c.lane}/${c.phase}`
  const selectedCell = data.cells.find((c) => cellKey(c) === selected)

  const lanesOf = (kind: 'hierarchy' | 'parallel' | 'adjacent') => data.lanes.filter((l) => l.kind === kind)
  const isRevealed = (laneKind: string, phase: string) =>
    laneKind === 'hierarchy'
      ? (phaseIndex.get(phase) ?? 99) < step.revealedPhases
      : step.showParallel

  function renderLane(laneId: string) {
    const lane = laneById.get(laneId)!
    const laneCap = lane.capabilityId ? capById.get(lane.capabilityId) : undefined
    return (
      <tr key={lane.id} className={cx(styles.row, styles[lane.kind])} data-lane={lane.id}>
        <th scope="row" className={styles.laneHead}>
          {laneCap ? (
            <Link href={`/capabilities/${laneCap.id}/`} className={styles.laneLink}>
              {lane.label}
            </Link>
          ) : (
            <span className={styles.laneLabel}>{lane.label}</span>
          )}
          <span className={styles.laneSub}>
            {laneCap ? `${laneCap.code} · ${lane.sublabel}` : lane.sublabel}
          </span>
        </th>
        {data.phases.map((p) => {
          const cell = cellAt(lane.id, p.id)
          const revealed = isRevealed(lane.kind, p.id)
          const active = step.activePhase === p.id
          const handoff = cell?.handoff
          const handoffDown =
            handoff && data.lanes.findIndex((l) => l.id === handoff.to) > data.lanes.findIndex((l) => l.id === lane.id)
          return (
            <td
              key={p.id}
              className={cx(styles.cell, active && styles.activeCol, !revealed && styles.hidden)}
              data-phase={p.id}
              aria-hidden={revealed ? undefined : true}
            >
              {cell && (
                <button
                  type="button"
                  className={styles.card}
                  aria-pressed={selected === cellKey(cell)}
                  onClick={() => setSelected((s) => (s === cellKey(cell) ? null : cellKey(cell)))}
                  tabIndex={revealed ? 0 : -1}
                  data-cell={cellKey(cell)}
                >
                  <span className={styles.cardTitle}>{cell.title}</span>
                  {cell.valueTypes.length > 0 && (
                    <span className={styles.chips}>
                      {cell.valueTypes.map((v) => (
                        <span key={v} className={styles.chip}>
                          {valueTypeLabels[v]}
                        </span>
                      ))}
                    </span>
                  )}
                  {handoff && (
                    <span className={cx(styles.handoff, handoffDown ? styles.down : styles.up)} data-handoff={handoff.type}>
                      <span aria-hidden="true">{handoffDown ? '▼' : '▲'}</span> {handoff.label}
                      <span className="visually-hidden">
                        {' '}
                        ({handoffDown ? 'handed down' : 'reported up'} to {laneById.get(handoff.to)?.label})
                      </span>
                    </span>
                  )}
                </button>
              )}
            </td>
          )
        })}
      </tr>
    )
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.controls}>
        <button type="button" onClick={() => go(-1)} disabled={stepIndex === 0}>
          <span aria-hidden="true">←</span> Previous
        </button>
        <p className={styles.stepStatus} aria-live="polite">
          <span className={styles.stepCount}>
            Step {stepIndex + 1} of {steps.length}
          </span>{' '}
          <strong>{step.title}</strong>
        </p>
        <button type="button" onClick={() => go(1)} disabled={stepIndex === steps.length - 1}>
          Next <span aria-hidden="true">→</span>
        </button>
        <button
          type="button"
          className={styles.secondary}
          onClick={() => setStepIndex(steps.length - 1)}
          disabled={stepIndex === steps.length - 1}
        >
          Show complete picture
        </button>
      </div>
      <p className={styles.stepDescription}>{step.description}</p>

      <div className={styles.stage} data-testid="swimlane-matrix">
        <table className={styles.matrix}>
          <caption className="visually-hidden">
            Steering phases from left to right, levels from top to bottom, parallel capabilities below
          </caption>
          <colgroup>
            <col className={styles.headCol} />
            {data.phases.map((p) => (
              <col key={p.id} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <td className={styles.corner}>
                <span className={styles.axis}>Levels ↓ · Phases →</span>
              </td>
              {data.phases.map((p, i) => {
                const cap = capById.get(p.capabilityId)!
                return (
                  <th
                    key={p.id}
                    scope="col"
                    className={cx(styles.phaseHead, step.activePhase === p.id && styles.activeHead)}
                  >
                    <span className={styles.phaseNum} aria-hidden="true">
                      {i + 1}
                    </span>
                    <Link href={`/capabilities/${cap.id}/`} className={styles.phaseLink}>
                      {p.label}
                    </Link>
                    <span className={styles.phaseCap}>
                      {cap.code} · <span className="visually-hidden">Leads: </span>{formatLeads(cap, shortName)}
                    </span>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>{lanesOf('hierarchy').map((l) => renderLane(l.id))}</tbody>
          <tbody className={cx(styles.parallelGroup, !step.showParallel && styles.groupMuted)}>
            <tr className={styles.groupLabelRow}>
              <th scope="rowgroup" colSpan={data.phases.length + 1} className={styles.groupLabel}>
                Running in parallel across all phases
              </th>
            </tr>
            {lanesOf('parallel').map((l) => renderLane(l.id))}
          </tbody>
          <tbody className={cx(styles.adjacentGroup, !step.showParallel && styles.groupMuted)}>
            <tr className={styles.groupLabelRow}>
              <th scope="rowgroup" colSpan={data.phases.length + 1} className={styles.groupLabel}>
                Adjacent: corporate finance processes
              </th>
            </tr>
            {lanesOf('adjacent').map((l) => renderLane(l.id))}
          </tbody>
        </table>

        <div
          className={cx(styles.feedback, !step.showFeedback && styles.hidden)}
          data-testid="feedback"
          aria-hidden={step.showFeedback ? undefined : true}
        >
          <span className={styles.feedbackArrow} aria-hidden="true">
            ↺
          </span>
          <span>
            <strong>{linkTypeLabels[data.feedback.type]}:</strong> {data.feedback.label}{' '}
            <span className={styles.feedbackRoute}>
              ({data.phases.find((p) => p.id === data.feedback.from)?.label} →{' '}
              {data.feedback.to.map((t) => data.phases.find((p) => p.id === t)?.label).join(' and ')})
            </span>
          </span>
        </div>
      </div>

      <p className={styles.narrowNote}>
        The matrix needs a wider screen. All phases, levels and hand-offs are listed in the text view below.
      </p>

      <section className={styles.detail} aria-live="polite" aria-labelledby="detail-heading">
        <h2 id="detail-heading" className={styles.detailHeading}>
          {selectedCell ? selectedCell.title : 'Details'}
        </h2>
        {selectedCell ? (
          <>
            <p className={styles.detailMeta}>
              {laneById.get(selectedCell.lane)?.label} ·{' '}
              {data.phases.find((p) => p.id === selectedCell.phase)?.label}
            </p>
            <p>{stripMarkers(selectedCell.detail)}</p>
            {selectedCell.handoff && (
              <p>
                <strong>{linkTypeLabels[selectedCell.handoff.type]}</strong> to{' '}
                {laneById.get(selectedCell.handoff.to)?.label}: {selectedCell.handoff.label}
              </p>
            )}
            <p className={styles.detailActions}>
              <Link href={`/capabilities/${data.phases.find((p) => p.id === selectedCell.phase)?.capabilityId}/`}>
                Open capability
              </Link>
              <button type="button" className={styles.linkButton} onClick={() => setSelected(null)}>
                Close details (Esc)
              </button>
            </p>
          </>
        ) : (
          <p className={styles.detailHint}>Select a box to see what happens there and what is handed on.</p>
        )}
      </section>
    </div>
  )
}
