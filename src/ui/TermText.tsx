import { Fragment } from 'react'
import type { GlossaryTerm } from '@/content/schema'

// Renders text with [[term-id]] / [[term-id|label]] markers as links to glossary entries.
// Marker validity is guaranteed at build time (rule R3).
const MARKER = /\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g

export function TermText({ text, terms }: { text: string; terms: Map<string, GlossaryTerm> }) {
  const parts: React.ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(MARKER)) {
    const [whole, id, label] = m as unknown as [string, string, string | undefined]
    parts.push(text.slice(last, m.index))
    parts.push(
      <a key={`${id}-${m.index}`} href={`/glossary/#${id}`}>
        {label ?? terms.get(id)?.term ?? id}
      </a>,
    )
    last = (m.index ?? 0) + whole.length
  }
  parts.push(text.slice(last))
  return <>{parts.map((p, i) => <Fragment key={i}>{p}</Fragment>)}</>
}
