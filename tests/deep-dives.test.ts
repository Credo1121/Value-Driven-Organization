import { describe, expect, it } from 'vitest'
import bigPictureJson from '@content/big-picture.json'
import breaksJson from '@content/breaks.json'
import capabilitiesJson from '@content/capabilities.json'
import glossaryJson from '@content/glossary.json'
import sourcesJson from '@content/sources.json'
import {
  BigPictureFileSchema,
  BreaksFileSchema,
  DeepDivesFileSchema,
  GlossaryFileSchema,
  SourcesFileSchema,
  templateSections,
} from '@/content/schema'
import { validateDeepDives } from '@/domain/validation'

// Expectations from REQ-004 (AC-004-1 … AC-004-8) and register E26.

const capabilities = BigPictureFileSchema.parse(bigPictureJson).capabilities
const terms = GlossaryFileSchema.parse(glossaryJson).terms
const sources = SourcesFileSchema.parse(sourcesJson).sources
const breaks = BreaksFileSchema.parse(breaksJson).breaks
const dives = DeepDivesFileSchema.parse(capabilitiesJson).deepDives
const ctx = { capabilities, terms, sources, breaks }
const c2 = dives.find((d) => d.capabilityId === 'c2')!

describe('deep dive content (REQ-004)', () => {
  it('passes validation', () => {
    expect(validateDeepDives(dives, ctx)).toEqual([])
  })

  it('one deep dive per capability C1–C8', () => {
    expect(dives.map((d) => d.capabilityId).sort()).toEqual(['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'])
  })

  it('E26: C2 is written first; the other seven are templates with all sections open', () => {
    expect(c2.status).toBe('draft')
    for (const d of dives.filter((x) => x.capabilityId !== 'c2')) {
      expect(d.status, d.capabilityId).toBe('open')
      for (const s of templateSections) expect(d[s], `${d.capabilityId}.${s}`).toBe('open')
    }
  })

  it('AC-004-1: C2 fills all eight template sections', () => {
    for (const s of templateSections) expect(c2[s], s).not.toBe('open')
  })

  it('AC-004-2: decision rights distinguish enterprise and compact variant for every decision', () => {
    if (c2.decisionRights === 'open') throw new Error('open')
    expect(c2.decisionRights.items.length).toBeGreaterThanOrEqual(4)
    for (const d of c2.decisionRights.items) {
      expect(d.enterprise.length, d.decision).toBeGreaterThan(0)
      expect(d.compact.length, d.decision).toBeGreaterThan(0)
      expect(d.enterprise, d.decision).not.toBe(d.compact)
    }
  })

  it('E22: C2 decision rights reflect EPM first, then LPM', () => {
    if (c2.decisionRights === 'open') throw new Error('open')
    const byDecision = new Map(c2.decisionRights.items.map((d) => [d.decision, d]))
    expect(byDecision.get('Budget per portfolio and guardrails')?.enterprise).toMatch(/EPM/)
    expect(byDecision.get('Value stream funding')?.enterprise).toMatch(/LPM/)
  })

  it('AC-004-3: every data object is a glossary term', () => {
    if (c2.dataObjects === 'open') throw new Error('open')
    const ids = new Set(terms.map((t) => t.id))
    for (const t of c2.dataObjects.items) expect(ids.has(t), t).toBe(true)
  })

  it('AC-004-4: every interface names a target and a link type', () => {
    if (c2.interfaces === 'open') throw new Error('open')
    for (const i of c2.interfaces.items) {
      expect(i.with).toBeTruthy()
      expect(i.type).toBeTruthy()
    }
    // the hand-offs of the big picture's Fund phase appear as outgoing funding interfaces
    expect(c2.interfaces.items.filter((i) => i.direction === 'out' && i.type === 'funding').map((i) => i.with)).toEqual(['c3', 'c6'])
  })

  it('AC-004-5: C2 links to its example station', () => {
    expect(c2.example?.station).toBe('S4')
  })

  it('AC-004-6: every typical break refers to one of the seven breaks', () => {
    if (c2.breaks === 'open') throw new Error('open')
    const ids = new Set(breaks.map((b) => b.id))
    for (const b of c2.breaks.items) expect(ids.has(b.breakId), b.breakId).toBe(true)
  })

  it('AC-004-8: C2 explains target, budget, forecast and actual, with the finance interface', () => {
    expect(c2.valueTypes?.items.map((v) => v.valueType)).toEqual(expect.arrayContaining(['target', 'budget', 'forecast', 'actual']))
    expect(c2.valueTypes?.note).toMatch(/finance processes/i)
    expect(c2.valueTypes?.note).toMatch(/TBM .*input/i)
  })

  it('statement types: the enterprise level is marked as our synthesis, framework claims cite verified sources', () => {
    if (c2.sources === 'open') throw new Error('open')
    const synthesis = c2.sources.statements.filter((s) => s.statementType === 'synthesis')
    expect(synthesis.some((s) => /enterprise level/i.test(s.text))).toBe(true)
    const verified = new Set(sources.filter((s) => s.status === 'verified').map((s) => s.id))
    for (const s of c2.sources.statements.filter((x) => x.statementType === 'framework'))
      expect(s.sourceIds.some((id) => verified.has(id)), s.text).toBe(true)
  })

  it('no unverified source (Gartner, PMI) is cited', () => {
    expect(JSON.stringify(capabilitiesJson)).not.toMatch(/S-GART-1|S-PMI-1/)
  })
})

describe('negative fixtures (AC-004-7 and rules)', () => {
  const withC2 = (patch: object) =>
    DeepDivesFileSchema.parse({
      deepDives: (capabilitiesJson as { deepDives: object[] }).deepDives.map((d) =>
        (d as { capabilityId: string }).capabilityId === 'c2' ? { ...d, ...patch } : d,
      ),
    }).deepDives
  const rules = (ds: typeof dives) => validateDeepDives(ds, ctx).map((f) => f.rule)

  it('a missing template section fails schema validation', () => {
    const raw = structuredClone(capabilitiesJson) as { deepDives: Record<string, unknown>[] }
    delete raw.deepDives[1]!.roles
    expect(() => DeepDivesFileSchema.parse(raw)).toThrow()
  })

  it('status "draft" with an open section is rejected', () => {
    expect(rules(withC2({ roles: 'open' }))).toContain('BP')
  })

  it('unknown data object, interface target or break id is rejected', () => {
    expect(rules(withC2({ dataObjects: { statementType: 'synthesis', items: ['budgett'] } }))).toContain('R1')
    expect(rules(withC2({ interfaces: { statementType: 'synthesis', items: [{ with: 'c9', direction: 'in', type: 'funding', what: 'x' }] } }))).toContain('R1')
    expect(rules(withC2({ breaks: { statementType: 'synthesis', items: [{ breakId: 'b9', text: 'x' }] } }))).toContain('R1')
  })

  it('a framework-based statement citing only an unverified source is rejected (R2)', () => {
    if (c2.sources === 'open') throw new Error('open')
    const bad = { ...c2.sources, statements: [{ text: 'x', statementType: 'framework', sourceIds: ['S-GART-1'] }] }
    expect(rules(withC2({ sources: bad }))).toContain('R2')
  })

  it('AC-004-8: C2 without a forecast explanation is rejected', () => {
    const vt = { ...c2.valueTypes!, items: c2.valueTypes!.items.filter((v) => v.valueType !== 'forecast') }
    expect(rules(withC2({ valueTypes: vt }))).toContain('BP')
  })

  it('an interface of a capability with itself is rejected', () => {
    expect(rules(withC2({ interfaces: { statementType: 'synthesis', items: [{ with: 'c2', direction: 'in', type: 'funding', what: 'x' }] } }))).toContain('BP')
  })
})
