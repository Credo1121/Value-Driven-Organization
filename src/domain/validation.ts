import type { GlossaryTerm, Source } from '@/content/schema'

// Content consistency rules from docs/domain/model.md, section 5.
// Pure functions: they return findings instead of throwing, so build and tests share them.

export type Finding = { rule: 'R1' | 'R2' | 'R3' | 'UNIQUE'; id: string; message: string }

export type ContentSet = {
  sources: Source[]
  terms: GlossaryTerm[]
  // Free texts that may contain [[term-id]] or [[term-id|label]] markers (R3).
  texts?: { id: string; text: string }[]
}

const TERM_MARKER = /\[\[([a-z0-9-]+)(?:\|[^\]]+)?\]\]/g

export function extractTermRefs(text: string): string[] {
  return [...text.matchAll(TERM_MARKER)].map((m) => m[1] as string)
}

function duplicates(ids: string[]): string[] {
  const seen = new Set<string>()
  return ids.filter((x) => (seen.has(x) ? true : (seen.add(x), false)))
}

export function validateContent({ sources, terms, texts = [] }: ContentSet): Finding[] {
  const findings: Finding[] = []
  const sourceById = new Map(sources.map((s) => [s.id, s]))
  const termIds = new Set(terms.map((t) => t.id))

  for (const d of duplicates(sources.map((s) => s.id)))
    findings.push({ rule: 'UNIQUE', id: d, message: `duplicate source id ${d}` })
  for (const d of duplicates(terms.map((t) => t.id)))
    findings.push({ rule: 'UNIQUE', id: d, message: `duplicate glossary id ${d}` })

  for (const t of terms) {
    // R1: referential integrity
    for (const s of t.sourceIds)
      if (!sourceById.has(s))
        findings.push({ rule: 'R1', id: t.id, message: `unknown source ${s}` })
    for (const r of t.related)
      if (!termIds.has(r))
        findings.push({ rule: 'R1', id: t.id, message: `unknown related term ${r}` })

    // R2: a framework-based statement needs at least one verified source
    if (t.statementType === 'framework') {
      const verified = t.sourceIds.filter((s) => sourceById.get(s)?.status === 'verified')
      if (verified.length === 0)
        findings.push({
          rule: 'R2',
          id: t.id,
          message: 'framework-based statement without a verified source',
        })
    }

    // R3: glossary texts may reference other terms
    for (const ref of extractTermRefs(`${t.definition} ${t.distinction}`))
      if (!termIds.has(ref))
        findings.push({ rule: 'R3', id: t.id, message: `unknown glossary term [[${ref}]]` })
  }

  for (const { id, text } of texts)
    for (const ref of extractTermRefs(text))
      if (!termIds.has(ref))
        findings.push({ rule: 'R3', id, message: `unknown glossary term [[${ref}]]` })

  return findings
}
