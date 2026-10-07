import { describe, expect, it } from 'vitest'
import bigPictureJson from '@content/big-picture.json'
import glossaryJson from '@content/glossary.json'
import { BigPictureFileSchema, GlossaryFileSchema } from '@/content/schema'
import { validateBigPicture } from '@/domain/validation'
import { formatLeads } from '@/ui/big-picture/leads'
import { buildSteps, clampStep } from '@/ui/big-picture/steps'

// Expectations from REQ-003 Rev. 2 (swimlane matrix, E23) and docs/domain/model.md.

const bp = BigPictureFileSchema.parse(bigPictureJson)
const terms = GlossaryFileSchema.parse(glossaryJson).terms
const ids = <T extends { id: string }>(xs: T[]) => xs.map((x) => x.id)

describe('swimlane content (REQ-003)', () => {
  it('passes validation', () => {
    expect(validateBigPicture(bp, terms)).toEqual([])
  })

  it('AC-003-1: six phases in sequence, mapped to the loop capabilities C1→C2→C3→C6→C7→C8', () => {
    expect(ids(bp.phases)).toEqual(['direct', 'fund', 'prioritise', 'deliver', 'operate', 'realise'])
    expect(bp.phases.map((p) => p.capabilityId)).toEqual(['c1', 'c2', 'c3', 'c6', 'c7', 'c8'])
  })

  it('AC-003-1: hierarchy lanes top to bottom, then parallel TBM/EA, then adjacent finance', () => {
    expect(bp.lanes.map((l) => `${l.kind}:${l.id}`)).toEqual([
      'hierarchy:enterprise',
      'hierarchy:portfolio',
      'hierarchy:delivery',
      'parallel:cost',
      'parallel:architecture',
      'adjacent:finance',
    ])
    expect(bp.lanes.find((l) => l.id === 'cost')?.capabilityId).toBe('c4')
    expect(bp.lanes.find((l) => l.id === 'architecture')?.capabilityId).toBe('c5')
  })

  it('every capability C1–C8 is placed exactly once (phase or parallel lane)', () => {
    const placed = [...bp.phases.map((p) => p.capabilityId), ...bp.lanes.flatMap((l) => l.capabilityId ?? [])]
    expect(placed.sort()).toEqual(['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'])
  })

  it('parallel lanes cover every phase (they run across the whole cycle)', () => {
    for (const lane of ['cost', 'architecture'])
      expect(bp.cells.filter((c) => c.lane === lane).map((c) => c.phase)).toEqual(ids(bp.phases))
  })

  it('E22: in the Fund phase EPM hands down to LPM, which hands down to value streams', () => {
    const fund = bp.cells.filter((c) => c.phase === 'fund' && c.handoff)
    expect(fund.map((c) => `${c.lane}→${c.handoff!.to}:${c.handoff!.type}`)).toEqual([
      'enterprise→portfolio:funding',
      'portfolio→delivery:funding',
    ])
    const short = new Map(bp.disciplines.map((d) => [d.id, d.short]))
    expect(formatLeads(bp.capabilities.find((c) => c.id === 'c2')!, short)).toBe('EPM → LPM')
  })

  it('E24: wherever enterprise and portfolio both steer (C2, C3, C8), the lead is the sequence EPM → LPM', () => {
    const short = new Map(bp.disciplines.map((d) => [d.id, d.short]))
    for (const c of bp.capabilities) {
      const both = c.primary.includes('epm') && c.primary.includes('lpm')
      if (both) {
        expect(formatLeads(c, short), c.code).toBe('EPM → LPM')
        expect(c.leadNote, c.code).toMatch(/compact/i)
      }
    }
    expect(bp.capabilities.filter((c) => c.leadSequence).map((c) => c.code)).toEqual(['C2', 'C3', 'C8'])
  })

  it('E24: the matrix content follows the sequence – enterprise acts above portfolio in C3 and C8', () => {
    for (const phase of ['prioritise', 'realise']) {
      expect(bp.cells.some((c) => c.lane === 'enterprise' && c.phase === phase), phase).toBe(true)
      expect(bp.cells.some((c) => c.lane === 'portfolio' && c.phase === phase), phase).toBe(true)
    }
  })

  it('E22: C7 operations is led by IT Ops', () => {
    expect(bp.capabilities.find((c) => c.id === 'c7')?.primary).toEqual(['ops'])
  })

  it('model 2.1: finance lane shows target, budget, forecast, actual and derived variance', () => {
    const types = new Set(bp.cells.filter((c) => c.lane === 'finance').flatMap((c) => c.valueTypes))
    expect(types).toEqual(new Set(['target', 'budget', 'forecast', 'actual', 'variance']))
  })

  it('model 2.1 / K10: cost allocation to consumers works on actuals', () => {
    const alloc = bp.cells.find((c) => c.lane === 'cost' && c.phase === 'operate')!
    expect(alloc.valueTypes).toEqual(['actual'])
  })

  it('outcome feedback returns from Realise value to Direct and Fund; results are reported upwards', () => {
    expect(bp.feedback).toMatchObject({ from: 'realise', to: ['direct', 'fund'], type: 'outcome-feedback' })
    const up = bp.cells.filter((c) => c.phase === 'realise' && c.handoff?.type === 'outcome-feedback')
    expect(up.map((c) => `${c.lane}→${c.handoff!.to}`)).toEqual(['portfolio→enterprise', 'delivery→portfolio'])
  })

  it('W1: delivery is described as output, not as realised outcome', () => {
    const build = bp.cells.find((c) => c.lane === 'delivery' && c.phase === 'deliver')!
    expect(build.detail).toMatch(/\[\[output\]\]/)
    expect(build.detail).toMatch(/not yet an outcome/)
  })
})

describe('negative fixtures (AC-003-7)', () => {
  const rules = (data: unknown) => validateBigPicture(BigPictureFileSchema.parse(data), terms).map((f) => f.rule)
  const cells = bigPictureJson.cells

  it('unknown lane or phase', () => {
    expect(rules({ ...bigPictureJson, cells: [...cells, { ...cells[0], lane: 'board' }] })).toContain('R1')
    expect(rules({ ...bigPictureJson, cells: [...cells, { ...cells[0], phase: 'plan' }] })).toContain('R1')
  })

  it('duplicate lane/phase cell', () => {
    expect(rules({ ...bigPictureJson, cells: [...cells, cells[0]] })).toContain('UNIQUE')
  })

  it('hand-off without description or with unknown type is rejected by the schema', () => {
    const withHandoff = cells.find((c) => 'handoff' in c)!
    expect(() => BigPictureFileSchema.parse({ ...bigPictureJson, cells: [{ ...withHandoff, handoff: { ...withHandoff.handoff, label: '' } }] })).toThrow()
    expect(() => BigPictureFileSchema.parse({ ...bigPictureJson, cells: [{ ...withHandoff, handoff: { ...withHandoff.handoff, type: 'informs' } }] })).toThrow()
  })

  it('hand-off to a lane without a cell in the same phase (phase change)', () => {
    const broken = cells.map((c) =>
      c.lane === 'enterprise' && c.phase === 'prioritise' ? { ...c, handoff: { to: 'portfolio', type: 'funding', label: 'x' } } : c,
    ).filter((c) => !(c.lane === 'portfolio' && c.phase === 'prioritise'))
    expect(rules({ ...bigPictureJson, cells: broken })).toContain('BP')
  })

  it('hand-off from or to a parallel lane', () => {
    const broken = cells.map((c) => (c.lane === 'cost' && c.phase === 'fund' ? { ...c, handoff: { to: 'portfolio', type: 'funding', label: 'x' } } : c))
    expect(rules({ ...bigPictureJson, cells: broken })).toContain('BP')
  })

  it('capability without placement, or placed twice', () => {
    const lanes = bigPictureJson.lanes.map((l) => (l.id === 'architecture' ? { ...l, capabilityId: undefined } : l))
    expect(rules({ ...bigPictureJson, lanes })).toContain('BP')
    const phases = bigPictureJson.phases.map((p) => (p.id === 'operate' ? { ...p, capabilityId: 'c6' } : p))
    expect(rules({ ...bigPictureJson, phases })).toContain('BP')
  })

  it('unknown glossary marker in a cell text', () => {
    const broken = cells.map((c, i) => (i === 0 ? { ...c, detail: 'See [[nonsense]].' } : c))
    expect(rules({ ...bigPictureJson, cells: broken })).toContain('R3')
  })
})

describe('guided steps (AC-003-4)', () => {
  const steps = buildSteps(bp)

  it('order: structure → each phase in sequence → parallel lanes → feedback', () => {
    expect(steps.map((s) => s.id)).toEqual(['structure', ...ids(bp.phases), 'parallel', 'feedback'])
  })

  it('phases are revealed cumulatively, one per step, with the current phase active', () => {
    expect(steps[0]!.revealedPhases).toBe(0)
    bp.phases.forEach((p, i) => {
      expect(steps[i + 1]!.revealedPhases).toBe(i + 1)
      expect(steps[i + 1]!.activePhase).toBe(p.id)
      expect(steps[i + 1]!.showParallel).toBe(false)
    })
  })

  it('parallel lanes appear after the sequence; feedback comes last', () => {
    const parallel = steps.find((s) => s.id === 'parallel')!
    const feedback = steps.at(-1)!
    expect(parallel).toMatchObject({ showParallel: true, showFeedback: false, revealedPhases: bp.phases.length })
    expect(feedback).toMatchObject({ showParallel: true, showFeedback: true })
  })

  it('step index is clamped', () => {
    expect(clampStep(-2, steps)).toBe(0)
    expect(clampStep(99, steps)).toBe(steps.length - 1)
  })
})
