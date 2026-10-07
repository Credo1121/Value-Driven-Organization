'use client'

import Link from 'next/link'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { bridgeLinkTypeLabels, type BigPicture, type CapabilityBridge as CapabilityBridgeData } from '@/content/schema'
import styles from './bridge.module.css'

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

// Best-of-breed overview (entry page, illustrative): a small, curated set of EPM/TBM/EA/LPM
// capabilities and how they connect across planning, funding, delivery and value realisation.
// Backed by the same C1–C8 capabilities as the steering cycle, not a separate taxonomy.

const COLUMNS = ['epm', 'tbm', 'ea', 'lpm'] as const

export function CapabilityBridge({ data, bigPicture }: { data: CapabilityBridgeData; bigPicture: BigPicture }) {
  const [selectedId, setSelectedId] = useState(data.nodes[0]!.id)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const activeId = previewId ?? selectedId
  const isPreview = previewId !== null && previewId !== selectedId

  const stageRef = useRef<HTMLDivElement>(null)
  const [wires, setWires] = useState<{ d: string; kind: 'out' | 'in' }[]>([])

  const nodeById = new Map(data.nodes.map((n) => [n.id, n]))
  const disciplineById = new Map(bigPicture.disciplines.map((d) => [d.id, d]))
  const capabilityById = new Map(bigPicture.capabilities.map((c) => [c.id, c]))
  const active = nodeById.get(activeId)!
  const outgoing = useMemo(() => data.links.filter((l) => l.from === activeId), [data.links, activeId])
  const incoming = useMemo(() => data.links.filter((l) => l.to === activeId), [data.links, activeId])
  const connectedIds = new Set([...outgoing.map((l) => l.to), ...incoming.map((l) => l.from)])

  useLayoutEffect(() => {
    const stage = stageRef.current
    function measure() {
      if (!stage) return setWires([])
      const base = stage.getBoundingClientRect()
      const box = (id: string) => stage.querySelector<HTMLElement>(`[data-node="${id}"]`)?.getBoundingClientRect()
      const a = box(activeId)
      if (!a) return setWires([])
      const out: { d: string; kind: 'out' | 'in' }[] = []
      for (const l of outgoing) {
        const b = box(l.to)
        if (!b) continue
        const x1 = (a.left < b.left ? a.right : a.left) - base.left
        const x2 = (a.left < b.left ? b.left : b.right) - base.left
        const y1 = a.top + a.height / 2 - base.top
        const y2 = b.top + b.height / 2 - base.top
        out.push({ d: `M${x1},${y1} L${x2},${y2}`, kind: 'out' })
      }
      for (const l of incoming) {
        const b = box(l.from)
        if (!b) continue
        const x1 = (a.left < b.left ? a.right : a.left) - base.left
        const x2 = (a.left < b.left ? b.left : b.right) - base.left
        const y1 = a.top + a.height / 2 - base.top
        const y2 = b.top + b.height / 2 - base.top
        out.push({ d: `M${x2},${y2} L${x1},${y1}`, kind: 'in' })
      }
      setWires(out)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (stage) ro.observe(stage)
    return () => ro.disconnect()
  }, [activeId, outgoing, incoming])

  function select(id: string) {
    setSelectedId(id)
    setPreviewId(null)
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.stage} ref={stageRef} onMouseLeave={() => setPreviewId(null)}>
        <svg className={styles.wires} aria-hidden="true" focusable="false">
          <defs>
            <marker id="bridge-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0 0 L10 5 L0 10 z" className={styles.wireHead} />
            </marker>
          </defs>
          {wires.map((w, i) => (
            <path key={i} d={w.d} className={styles.wire} markerEnd="url(#bridge-arrow)" data-wire={w.kind} />
          ))}
        </svg>

        <div className={styles.columns}>
          {COLUMNS.map((disciplineId) => {
            const discipline = disciplineById.get(disciplineId)
            const nodes = data.nodes.filter((n) => n.disciplineId === disciplineId)
            return (
              <div key={disciplineId} className={styles.column}>
                <h3 className={styles.columnHead}>{discipline?.short ?? disciplineId}</h3>
                <ul className={styles.cardList}>
                  {nodes.map((n) => {
                    const isActive = n.id === activeId
                    const isConnected = connectedIds.has(n.id)
                    return (
                      <li key={n.id}>
                        <button
                          type="button"
                          className={cx(styles.card, isActive && styles.active, isConnected && styles.connected)}
                          aria-pressed={n.id === selectedId}
                          data-node={n.id}
                          onClick={() => select(n.id)}
                          onFocus={() => setPreviewId(n.id)}
                          onBlur={() => setPreviewId(null)}
                          onMouseEnter={() => setPreviewId(n.id)}
                        >
                          {n.label}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      </div>

      <div className={styles.side}>
        <article className={cx(styles.detail, isPreview && styles.previewing)} aria-live={isPreview ? 'off' : 'polite'}>
          {isPreview && (
            <p className={styles.previewNote} aria-hidden="true">
              Preview – click to select
            </p>
          )}
          <p className={styles.detailDiscipline}>{disciplineById.get(active.disciplineId)?.short}</p>
          <h3 className={styles.detailTitle}>{active.label}</h3>

          {outgoing.length === 0 && incoming.length === 0 ? (
            <p className={styles.empty}>No connections shown for this capability yet.</p>
          ) : (
            <ul className={styles.links}>
              {outgoing.map((l, i) => (
                <li key={`out-${i}`}>
                  <span className={styles.linkType}>{bridgeLinkTypeLabels[l.type]}</span>{' '}
                  <strong>{nodeById.get(l.to)?.label}</strong>
                  <p className={styles.linkLabel}>{l.label}</p>
                </li>
              ))}
              {incoming.map((l, i) => (
                <li key={`in-${i}`}>
                  <strong>{nodeById.get(l.from)?.label}</strong>{' '}
                  <span className={styles.linkType}>{bridgeLinkTypeLabels[l.type].toLowerCase()}</span> this
                  <p className={styles.linkLabel}>{l.label}</p>
                </li>
              ))}
            </ul>
          )}

          <p className={styles.detailActions}>
            <Link href={`/capabilities/${active.capabilityId}/`}>
              Open {capabilityById.get(active.capabilityId)?.name}
            </Link>
          </p>
        </article>
      </div>
    </div>
  )
}
