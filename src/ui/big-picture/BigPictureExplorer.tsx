'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { linkTypeLabels, type BigPicture, type LinkType } from '@/content/schema'
import { VIEW, boxes, pathFor, pct, routes, trimEnd, type Box } from './layout'
import { lineStyleNames, linkStyles, type MarkerShape } from './linkStyles'
import { lastStep, steps, typeOrder, viewState } from './steps'
import styles from './bigPicture.module.css'

const MARKER = 14
const markerShapes: MarkerShape[] = ['arrow-open', 'arrow-filled', 'diamond']
const markerPaths: Record<MarkerShape, string> = {
  'arrow-open': 'M1 1 L9 5 L1 9',
  'arrow-filled': 'M0 0 L10 5 L0 10 Z',
  diamond: 'M0 5 L5 0 L10 5 L5 10 Z',
}

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

function boxStyle(b: Box) {
  return { left: pct(b.x, VIEW.w), top: pct(b.y, VIEW.h), width: pct(b.w, VIEW.w), height: pct(b.h, VIEW.h) }
}

function MarkerDefs() {
  return (
    <svg className={styles.defs} aria-hidden="true" focusable="false">
      <defs>
        {markerShapes.flatMap((shape) =>
          (['normal', 'active'] as const).map((state) => (
            <marker
              key={`${shape}-${state}`}
              id={`m-${shape}-${state}`}
              viewBox="0 0 10 10"
              refX="0"
              refY="5"
              markerWidth={MARKER}
              markerHeight={MARKER}
              markerUnits="userSpaceOnUse"
              orient="auto"
            >
              <path
                d={markerPaths[shape]}
                className={cx(
                  shape === 'arrow-open' ? styles.markerOpen : styles.markerFilled,
                  state === 'active' && styles.markerActive,
                )}
              />
            </marker>
          )),
        )}
      </defs>
    </svg>
  )
}

function LinkPath({ type, d, active }: { type: LinkType; d: string; active: boolean }) {
  const s = linkStyles[type]
  return (
    <>
      <path
        d={d}
        className={styles.stroke}
        strokeWidth={s.width}
        strokeDasharray={s.dash ?? undefined}
        markerEnd={`url(#m-${s.marker}-${active ? 'active' : 'normal'})`}
      />
      {s.double && <path d={d} className={styles.inner} strokeWidth={s.width - 4} />}
    </>
  )
}

export function BigPictureExplorer({ data }: { data: BigPicture }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [filter, setFilter] = useState<LinkType | null>(null)
  const view = viewState(stepIndex, filter)

  const go = useCallback((delta: number) => {
    setFilter(null)
    setStepIndex((i) => Math.min(Math.max(i + delta, 0), lastStep))
  }, [])

  // Presenter keys: arrows and PageUp/PageDown (remote clickers), Escape clears the focus filter.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      const target = e.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault()
        go(1)
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        go(-1)
      } else if (e.key === 'Escape') {
        setFilter(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const shortName = new Map(data.disciplines.map((d) => [d.id, d.short]))
  const nodeName = new Map<string, string>([
    ...data.capabilities.map((c) => [c.id, `${c.code} ${c.name}`] as [string, string]),
    ['env', data.environment.name],
  ])
  const names = (ids: string[]) => ids.map((i) => shortName.get(i) ?? i).join(' · ')
  const focusLinks = view.highlight ? data.links.filter((l) => l.type === view.highlight) : []

  return (
    <div className={styles.explorer}>
      <MarkerDefs />

      <div className={styles.controls}>
        <button type="button" onClick={() => go(-1)} disabled={stepIndex === 0}>
          <span aria-hidden="true">←</span> Previous
        </button>
        <p className={styles.stepStatus} aria-live="polite">
          <span className={styles.stepCount}>
            Step {stepIndex + 1} of {steps.length}
          </span>{' '}
          <strong>{view.step.title}</strong>
        </p>
        <button type="button" onClick={() => go(1)} disabled={stepIndex === lastStep}>
          Next <span aria-hidden="true">→</span>
        </button>
        <button
          type="button"
          className={styles.secondary}
          onClick={() => {
            setFilter(null)
            setStepIndex(lastStep)
          }}
          disabled={stepIndex === lastStep && !filter}
        >
          Show complete picture
        </button>
      </div>
      <p className={styles.stepDescription}>{view.step.description}</p>

      <div className={styles.stage}>
        <div className={styles.canvas} data-testid="big-picture-canvas">
          <svg
            className={styles.svg}
            viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
            aria-hidden="true"
            focusable="false"
          >
            {data.links
              .filter((l) => view.visibleTypes.has(l.type))
              .map((l) => {
                const active = view.highlight === l.type
                const dim = view.highlight !== null && !active
                const points = routes[l.id] ?? []
                return (
                  <g
                    key={l.id}
                    className={cx(styles.link, active && styles.active, dim && styles.dim)}
                    data-link={l.id}
                    data-type={l.type}
                  >
                    <title>{`${linkTypeLabels[l.type]}: ${l.label}`}</title>
                    <LinkPath type={l.type} d={pathFor(trimEnd(points, MARKER))} active={active} />
                  </g>
                )
              })}
          </svg>

          <div className={cx(styles.node, styles.env)} style={boxStyle(boxes.env as Box)}>
            <span className={styles.code}>Adjacent</span>
            <span className={styles.name}>{data.environment.name}</span>
          </div>

          {data.capabilities.map((c) => (
            <Link
              key={c.id}
              href={`/capabilities/${c.id}/`}
              className={styles.node}
              style={boxStyle(boxes[c.id] as Box)}
              data-capability={c.id}
            >
              <span className={styles.code}>
                {c.code}
                {c.role === 'cross' && ' · cross-cutting'}
              </span>
              <span className={styles.name}>{c.name}</span>
              {view.showDisciplines && (
                <span className={styles.disciplines}>
                  <span className={styles.lead}>Leads: {names(c.primary)}</span>
                  {c.supporting.length > 0 && <span>Supports: {names(c.supporting)}</span>}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      <p className={styles.narrowNote}>
        The diagram needs a wider screen. All capabilities and links are listed in the text view
        below.
      </p>

      <section className={styles.legend} aria-labelledby="legend-heading">
        <div className={styles.legendHeader}>
          <h2 id="legend-heading">Link types</h2>
          <p className={styles.filterStatus} aria-live="polite">
            {filter ? (
              <>
                Focus: <strong>{linkTypeLabels[filter]}</strong>{' '}
                <button type="button" className={styles.linkButton} onClick={() => setFilter(null)}>
                  Clear focus (Esc)
                </button>
              </>
            ) : (
              'Select a link type to focus on it.'
            )}
          </p>
        </div>
        <ul className={styles.legendList}>
          {typeOrder.map((t) => {
            const s = linkStyles[t]
            const d = pathFor(trimEnd([[2, 10], [62, 10]], MARKER))
            return (
              <li key={t}>
                <button
                  type="button"
                  aria-pressed={filter === t}
                  className={styles.legendItem}
                  onClick={() => setFilter((f) => (f === t ? null : t))}
                >
                  <svg viewBox="0 0 64 20" className={styles.sample} aria-hidden="true" focusable="false">
                    <g className={cx(styles.link, filter === t && styles.active)}>
                      <path
                        d={d}
                        className={styles.stroke}
                        strokeWidth={s.width}
                        strokeDasharray={s.dash ?? undefined}
                        markerEnd={`url(#m-${s.marker}-${filter === t ? 'active' : 'normal'})`}
                      />
                      {s.double && <path d={d} className={styles.inner} strokeWidth={s.width - 4} />}
                    </g>
                  </svg>
                  <span className={styles.legendText}>
                    <span className={styles.legendLabel}>{linkTypeLabels[t]}</span>
                    <span className={styles.legendStyle}>{lineStyleNames[t]}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      {focusLinks.length > 0 && (
        <section className={styles.focusPanel} aria-labelledby="focus-heading">
          <h2 id="focus-heading">{linkTypeLabels[view.highlight as LinkType]}: what flows</h2>
          <ul>
            {focusLinks.map((l) => (
              <li key={l.id}>
                <span className={styles.route}>
                  {nodeName.get(l.from)} <span aria-label="to">→</span> {nodeName.get(l.to)}
                </span>
                <span>{l.label}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
