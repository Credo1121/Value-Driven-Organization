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

// Big picture (REQ-003 Rev. 2, AC-003-7): swimlane matrix of phases × lanes.
export function validateBigPicture(bp: BigPicture, terms: GlossaryTerm[]): Finding[] {
  const findings: Finding[] = []
  const termIds = new Set(terms.map((t) => t.id))
  const disciplineIds = new Set(bp.disciplines.map((d) => d.id))
  const capabilityIds = new Set(bp.capabilities.map((c) => c.id))
  const phaseIds = new Set(bp.phases.map((p) => p.id))
  const laneById = new Map(bp.lanes.map((l) => [l.id, l]))

  for (const [what, ids] of [
    ['capability', bp.capabilities.map((c) => c.id)],
    ['phase', bp.phases.map((p) => p.id)],
    ['lane', bp.lanes.map((l) => l.id)],
    ['cell', bp.cells.map((c) => `${c.lane}/${c.phase}`)],
  ] as const)
    for (const d of duplicates([...ids]))
      findings.push({ rule: 'UNIQUE', id: d, message: `duplicate ${what} ${d}` })

  for (const d of bp.disciplines)
    if (d.glossaryId && !termIds.has(d.glossaryId))
      findings.push({ rule: 'R1', id: d.id, message: `unknown glossary term ${d.glossaryId}` })

  for (const c of bp.capabilities)
    for (const ref of [...c.primary, ...c.supporting])
      if (!disciplineIds.has(ref))
        findings.push({ rule: 'R1', id: c.id, message: `unknown discipline ${ref}` })

  for (const l of bp.lanes) {
    for (const d of l.disciplineIds)
      if (!disciplineIds.has(d)) findings.push({ rule: 'R1', id: l.id, message: `unknown discipline ${d}` })
    if (l.capabilityId && !capabilityIds.has(l.capabilityId))
      findings.push({ rule: 'R1', id: l.id, message: `unknown capability ${l.capabilityId}` })
  }
  for (const p of bp.phases)
    if (!capabilityIds.has(p.capabilityId))
      findings.push({ rule: 'R1', id: p.id, message: `unknown capability ${p.capabilityId}` })

  // Every capability belongs to exactly one phase or parallel lane.
  const placements = [...bp.phases.map((p) => p.capabilityId), ...bp.lanes.flatMap((l) => (l.capabilityId ? [l.capabilityId] : []))]
  for (const c of bp.capabilities) {
    const n = placements.filter((x) => x === c.id).length
    if (n !== 1) findings.push({ rule: 'BP', id: c.id, message: `capability placed ${n} times (expected exactly once)` })
  }

  for (const cell of bp.cells) {
    const cid = `${cell.lane}/${cell.phase}`
    if (!laneById.has(cell.lane)) findings.push({ rule: 'R1', id: cid, message: `unknown lane ${cell.lane}` })
    if (!phaseIds.has(cell.phase)) findings.push({ rule: 'R1', id: cid, message: `unknown phase ${cell.phase}` })
    for (const ref of extractTermRefs(cell.detail))
      if (!termIds.has(ref)) findings.push({ rule: 'R3', id: cid, message: `unknown glossary term [[${ref}]]` })
    if (cell.handoff) {
      const target = laneById.get(cell.handoff.to)
      if (!target) findings.push({ rule: 'R1', id: cid, message: `handoff to unknown lane ${cell.handoff.to}` })
      else if (target.kind !== 'hierarchy' || laneById.get(cell.lane)?.kind !== 'hierarchy')
        findings.push({ rule: 'BP', id: cid, message: 'handoffs connect hierarchy lanes only' })
      else if (!bp.cells.some((c) => c.lane === cell.handoff!.to && c.phase === cell.phase))
        findings.push({ rule: 'BP', id: cid, message: 'handoff target has no cell in the same phase' })
      if (cell.handoff.to === cell.lane) findings.push({ rule: 'BP', id: cid, message: 'handoff points to its own lane' })
    }
  }

  for (const p of [bp.feedback.from, ...bp.feedback.to])
    if (!phaseIds.has(p)) findings.push({ rule: 'R1', id: 'feedback', message: `unknown phase ${p}` })

  return findings
}
