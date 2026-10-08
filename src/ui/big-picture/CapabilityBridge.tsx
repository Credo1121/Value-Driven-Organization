'use client'

import Link from 'next/link'
import { useState } from 'react'
import { bridgeLinkTypeLabels, type BigPicture, type CapabilityBridge as CapabilityBridgeData } from '@/content/schema'
import styles from './bridge.module.css'

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

// Best-of-breed overview (entry page, illustrative, concept F2): a small, curated set of
// EPM/TBM/EA/LPM capabilities laid out along a central spine – enterprise-leaning disciplines
// (EPM, EA) on the left, operating-leaning disciplines (TBM, LPM) on the right. Backed by the
// same C1–C8 capabilities as the steering cycle, not a separate taxonomy.

const LEFT_DISCIPLINES = ['epm', 'ea'] as const
const RIGHT_DISCIPLINES = ['tbm', 'lpm'] as const

export function CapabilityBridge({ data, bigPicture }: { data: CapabilityBridgeData; bigPicture: BigPicture }) {
  const [selectedId, setSelectedId] = useState(data.nodes[0]!.id)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const activeId = previewId ?? selectedId
  const isPreview = previewId !== null && previewId !== selectedId

  const nodeById = new Map(data.nodes.map((n) => [n.id, n]))
  const disciplineById = new Map(bigPicture.disciplines.map((d) => [d.id, d]))
  const capabilityById = new Map(bigPicture.capabilities.map((c) => [c.id, c]))
  const active = nodeById.get(activeId)!
  const outgoing = data.links.filter((l) => l.from === activeId)
  const incoming = data.links.filter((l) => l.to === activeId)
  const connectedIds = new Set([...outgoing.map((l) => l.to), ...incoming.map((l) => l.from)])

  const leftIds = data.nodes.filter((n) => LEFT_DISCIPLINES.includes(n.disciplineId as never)).map((n) => n.id)
  const rightIds = data.nodes.filter((n) => RIGHT_DISCIPLINES.includes(n.disciplineId as never)).map((n) => n.id)
  const rows = Math.max(leftIds.length, rightIds.length)

  function select(id: string) {
    setSelectedId(id)
    setPreviewId(null)
  }

  function renderCard(id: string, side: 'left' | 'right') {
    const n = nodeById.get(id)!
    const isActive = id === activeId
    const isConnected = connectedIds.has(id)
    return (
      <button
        type="button"
        className={cx(styles.card, styles[side], isActive && styles.active, isConnected && styles.connected)}
        aria-pressed={id === selectedId}
        data-node={id}
        onClick={() => select(id)}
        onFocus={() => setPreviewId(id)}
        onBlur={() => setPreviewId(null)}
        onMouseEnter={() => setPreviewId(id)}
        onMouseLeave={() => setPreviewId(null)}
      >
        <span className={styles.disc}>{disciplineById.get(n.disciplineId)?.short}</span>
        <span className={styles.cardLabel}>{n.label}</span>
      </button>
    )
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.flow}>
        <div className={styles.spine} aria-hidden="true" />
        {Array.from({ length: rows }, (_, i) => {
          const l = leftIds[i]
          const r = rightIds[i]
          const onThisRow = l === activeId || r === activeId
          return (
            <div className={styles.stage} key={i}>
              <div className={styles.left}>{l && renderCard(l, 'left')}</div>
              <div className={styles.mid}>
                <span className={cx(styles.nodeDot, onThisRow && styles.nodeDotActive)} aria-hidden="true">
                  {i + 1}
                </span>
              </div>
              <div className={styles.right}>{r && renderCard(r, 'right')}</div>
            </div>
          )
        })}
      </div>

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
          <Link href={`/capabilities/${active.capabilityId}/`}>Open {capabilityById.get(active.capabilityId)?.name}</Link>
        </p>
      </article>
    </div>
  )
}
