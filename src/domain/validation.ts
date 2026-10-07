import type { BigPicture, Break, CapabilityBridge, DeepDive, GlossaryTerm, Source } from '@/content/schema'

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

// Capability bridge (entry page, best-of-breed overview): curated EPM/TBM/EA/LPM capabilities and
// typed links between them. Not covered by a REQ yet; validated the same way as other content.
export function validateCapabilityBridge(bridge: CapabilityBridge, bigPicture: BigPicture): Finding[] {
  const findings: Finding[] = []
  const disciplineIds = new Set(bigPicture.disciplines.map((d) => d.id))
  const capabilityIds = new Set(bigPicture.capabilities.map((c) => c.id))
  const nodeIds = new Set(bridge.nodes.map((n) => n.id))

  for (const d of duplicates(bridge.nodes.map((n) => n.id)))
    findings.push({ rule: 'UNIQUE', id: d, message: `duplicate capability bridge node ${d}` })

  for (const n of bridge.nodes) {
    if (!disciplineIds.has(n.disciplineId))
      findings.push({ rule: 'R1', id: n.id, message: `unknown discipline ${n.disciplineId}` })
    if (!capabilityIds.has(n.capabilityId))
      findings.push({ rule: 'R1', id: n.id, message: `unknown capability ${n.capabilityId}` })
  }

  for (const l of bridge.links) {
    const id = `${l.from}->${l.to}`
    if (!nodeIds.has(l.from)) findings.push({ rule: 'R1', id, message: `link from unknown node ${l.from}` })
    if (!nodeIds.has(l.to)) findings.push({ rule: 'R1', id, message: `link to unknown node ${l.to}` })
    if (l.from === l.to) findings.push({ rule: 'BP', id, message: 'link points to its own node' })
  }

  return findings
}

// Capability deep dives (REQ-004): references, statement types and AC-004-6/AC-004-8 rules.
export function validateDeepDives(
  dives: DeepDive[],
  ctx: { capabilities: { id: string }[]; terms: GlossaryTerm[]; sources: Source[]; breaks: Break[] },
): Finding[] {
  const findings: Finding[] = []
  const capIds = new Set(ctx.capabilities.map((c) => c.id))
  const endpoints = new Set([...capIds, 'finance'])
  const termIds = new Set(ctx.terms.map((t) => t.id))
  const sourceById = new Map(ctx.sources.map((s) => [s.id, s]))
  const breakIds = new Set(ctx.breaks.map((b) => b.id))

  for (const d of duplicates(dives.map((x) => x.capabilityId)))
    findings.push({ rule: 'UNIQUE', id: d, message: `duplicate deep dive for ${d}` })
  for (const c of capIds)
    if (!dives.some((x) => x.capabilityId === c)) findings.push({ rule: 'R1', id: c, message: 'capability has no deep dive' })

  for (const dive of dives) {
    const id = dive.capabilityId
    const add = (rule: Finding['rule'], message: string) => findings.push({ rule, id, message })
    if (!capIds.has(id)) add('R1', `unknown capability ${id}`)

    const sections = [dive.purpose, dive.roles, dive.inputsOutputs, dive.dataObjects, dive.decisionRights, dive.interfaces, dive.breaks, dive.sources]
    const filled = sections.filter((s) => s !== 'open').length
    if (dive.status === 'open' && filled > 0) add('BP', 'status "open" but sections are filled')
    if (dive.status !== 'open' && filled < sections.length) add('BP', `status "${dive.status}" requires all sections to be filled`)

    if (dive.purpose !== 'open')
      for (const ref of extractTermRefs(dive.purpose.text))
        if (!termIds.has(ref)) add('R3', `unknown glossary term [[${ref}]]`)

    if (dive.dataObjects !== 'open')
      for (const t of dive.dataObjects.items) if (!termIds.has(t)) add('R1', `data object ${t} is not in the glossary`)

    if (dive.inputsOutputs !== 'open') {
      for (const i of dive.inputsOutputs.inputs) if (!endpoints.has(i.from)) add('R1', `input from unknown ${i.from}`)
      for (const o of dive.inputsOutputs.outputs) if (!endpoints.has(o.to)) add('R1', `output to unknown ${o.to}`)
    }

    if (dive.interfaces !== 'open')
      for (const i of dive.interfaces.items) {
        if (!endpoints.has(i.with)) add('R1', `interface with unknown ${i.with}`)
        if (i.with === id) add('BP', 'interface with itself')
      }

    // AC-004-6: every typical break maps to one of the seven breaks.
    if (dive.breaks !== 'open')
      for (const b of dive.breaks.items) if (!breakIds.has(b.breakId)) add('R1', `unknown break ${b.breakId}`)

    // R2: framework-based statements need a verified source; others must not cite unverified ones as evidence.
    if (dive.sources !== 'open')
      for (const s of dive.sources.statements) {
        for (const sid of s.sourceIds) if (!sourceById.has(sid)) add('R1', `unknown source ${sid}`)
        if (s.statementType === 'framework' && !s.sourceIds.some((sid) => sourceById.get(sid)?.status === 'verified'))
          add('R2', `framework-based statement without verified source: "${s.text.slice(0, 40)}…"`)
      }

    // AC-004-8: C2 and C4 explain the value types once they are written.
    if ((id === 'c2' || id === 'c4') && dive.status !== 'open') {
      const covered = new Set(dive.valueTypes?.items.map((v) => v.valueType) ?? [])
      for (const v of ['target', 'budget', 'forecast', 'actual'])
        if (!covered.has(v as never)) add('BP', `value type ${v} not explained (AC-004-8)`)
      if (!dive.valueTypes?.note.match(/finance/i)) add('BP', 'value type note must name the finance interface (AC-004-8)')
    }
  }
  return findings
}
