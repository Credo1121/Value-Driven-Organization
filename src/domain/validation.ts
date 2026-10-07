import type { BigPicture, GlossaryTerm, Source } from '@/content/schema'

// Content consistency rules from docs/domain/model.md, section 5.
// Pure functions: they return findings instead of throwing, so build and tests share them.

export type Finding = { rule: 'R1' | 'R2' | 'R3' | 'UNIQUE' | 'BP'; id: string; message: string }

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

// Big picture (REQ-003, AC-003-7): every link connects known nodes with exactly one type and a label;
// every capability is reachable by at least one link; discipline references resolve.
export function validateBigPicture(bp: BigPicture, terms: GlossaryTerm[]): Finding[] {
  const findings: Finding[] = []
  const termIds = new Set(terms.map((t) => t.id))
  const disciplineIds = new Set(bp.disciplines.map((d) => d.id))
  const nodeIds = new Set([...bp.capabilities.map((c) => c.id), 'env'])

  for (const d of duplicates(bp.capabilities.map((c) => c.id)))
    findings.push({ rule: 'UNIQUE', id: d, message: `duplicate capability id ${d}` })
  for (const d of duplicates(bp.links.map((l) => l.id)))
    findings.push({ rule: 'UNIQUE', id: d, message: `duplicate link id ${d}` })

  for (const d of bp.disciplines)
    if (d.glossaryId && !termIds.has(d.glossaryId))
      findings.push({ rule: 'R1', id: d.id, message: `unknown glossary term ${d.glossaryId}` })

  for (const c of bp.capabilities)
    for (const ref of [...c.primary, ...c.supporting])
      if (!disciplineIds.has(ref))
        findings.push({ rule: 'R1', id: c.id, message: `unknown discipline ${ref}` })

  for (const l of bp.links) {
    for (const end of [l.from, l.to])
      if (!nodeIds.has(end)) findings.push({ rule: 'R1', id: l.id, message: `unknown node ${end}` })
    if (l.from === l.to) findings.push({ rule: 'BP', id: l.id, message: 'link points to itself' })
  }

  const linked = new Set(bp.links.flatMap((l) => [l.from, l.to]))
  for (const c of bp.capabilities)
    if (!linked.has(c.id))
      findings.push({ rule: 'BP', id: c.id, message: 'capability has no link (isolated tile)' })

  return findings
}
