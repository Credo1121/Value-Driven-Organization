import { describe, expect, it } from 'vitest'
import glossaryJson from '@content/glossary.json'
import sourcesJson from '@content/sources.json'
import bigPictureJson from '@content/big-picture.json'
import { ContentValidationError, parseContent } from '@/content/load'
import { validateContent, extractTermRefs } from '@/domain/validation'
import { GlossaryFileSchema, SourcesFileSchema } from '@/content/schema'

// Expectations come from REQ-001, REQ-002 and docs/domain/model.md (R1–R3),
// not from the implementation.

const sources = SourcesFileSchema.parse(sourcesJson).sources
const terms = GlossaryFileSchema.parse(glossaryJson).terms

describe('real content (REQ-001, REQ-002)', () => {
  it('passes all consistency rules', () => {
    expect(validateContent({ sources, terms })).toEqual([])
    expect(() => parseContent({ glossary: glossaryJson, sources: sourcesJson, bigPicture: bigPictureJson })).not.toThrow()
  })

  it('AC-001-4: required term pairs exist and each has a distinction', () => {
    const required = [
      'budget', 'actual-cost', 'funding-allocation', 'cost-allocation',
      'output', 'outcome', 'financial-benefit',
      'product', 'application', 'business-capability', 'platform',
      'run-change', 'capex-opex',
      // E19 value types
      'target', 'forecast', 'variance',
    ]
    const byId = new Map(terms.map((t) => [t.id, t]))
    for (const id of required) {
      expect(byId.has(id), `missing glossary term ${id}`).toBe(true)
      expect(byId.get(id)?.distinction.length).toBeGreaterThan(0)
    }
  })

  it('REQ-002: unverified sources (Gartner, PMI) are marked and support no statements', () => {
    for (const id of ['S-GART-1', 'S-PMI-1']) {
      const s = sources.find((x) => x.id === id)
      expect(s?.status).toBe('not-verified')
      expect(s?.supports).toEqual([])
    }
  })

  it('every source documents version, retrieval date, limits and licence', () => {
    for (const s of sources) {
      expect(s.version, s.id).not.toBe('')
      expect(s.retrieved, s.id).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(s.limits, s.id).not.toBe('')
      expect(s.license, s.id).not.toBe('')
    }
  })

  it('no statement uses the type "benchmark" (none available in the MVP)', () => {
    expect(JSON.stringify(glossaryJson)).not.toMatch(/"statementType":\s*"benchmark"/)
  })
})

describe('negative fixtures: invalid content must be rejected', () => {
  const verified = sources.find((s) => s.status === 'verified')!
  const unverified = sources.find((s) => s.status === 'not-verified')!
  const base = terms.find((t) => t.id === 'budget')!

  it('R1: unknown source id', () => {
    const f = validateContent({ sources, terms: [{ ...base, sourceIds: ['S-XYZ-9'] }] })
    expect(f.map((x) => x.rule)).toContain('R1')
  })

  it('R1: unknown related term', () => {
    const f = validateContent({ sources, terms: [{ ...base, related: ['does-not-exist'] }] })
    expect(f.map((x) => x.rule)).toContain('R1')
  })

  it('R2: framework-based statement without any source', () => {
    const f = validateContent({ sources, terms: [{ ...base, statementType: 'framework', sourceIds: [] }] })
    expect(f.map((x) => x.rule)).toContain('R2')
  })

  it('R2: framework-based statement backed only by an unverified source', () => {
    const f = validateContent({
      sources,
      terms: [{ ...base, statementType: 'framework', sourceIds: [unverified.id] }],
    })
    expect(f.map((x) => x.rule)).toContain('R2')
  })

  it('R2: framework-based statement with a verified source is accepted', () => {
    // Replace the term within the full set so its [[term]] references still resolve.
    const changed = terms.map((t) =>
      t.id === base.id ? { ...t, statementType: 'framework' as const, sourceIds: [verified.id] } : t,
    )
    expect(validateContent({ sources, terms: changed })).toEqual([])
  })

  it('R3: unknown [[term]] marker in a glossary text', () => {
    const f = validateContent({
      sources,
      terms: [{ ...base, related: [], distinction: 'Not the same as [[budgett]].' }],
    })
    expect(f.map((x) => x.rule)).toContain('R3')
  })

  it('R3: unknown [[term]] marker in a free text', () => {
    const f = validateContent({ sources, terms, texts: [{ id: 'home', text: 'See [[nonsense|this]].' }] })
    expect(f).toEqual([{ rule: 'R3', id: 'home', message: 'unknown glossary term [[nonsense]]' }])
  })

  it('duplicate ids are rejected', () => {
    const f = validateContent({ sources, terms: [...terms, terms[0]!] })
    expect(f.map((x) => x.rule)).toContain('UNIQUE')
  })

  it('schema: a term without a distinction is rejected', () => {
    const broken = { terms: [{ ...base, distinction: '' }] }
    expect(() => GlossaryFileSchema.parse(broken)).toThrow()
  })

  it('schema: an unknown statement type is rejected', () => {
    const broken = { terms: [{ ...base, statementType: 'benchmark' }] }
    expect(() => GlossaryFileSchema.parse(broken)).toThrow()
  })

  it('parseContent aborts with a readable error listing the rule', () => {
    const broken = {
      terms: (glossaryJson as { terms: object[] }).terms.map((t, i) =>
        i === 0 ? { ...t, related: ['ghost'] } : t,
      ),
    }
    expect(() => parseContent({ glossary: broken, sources: sourcesJson, bigPicture: bigPictureJson })).toThrow(ContentValidationError)
    expect(() => parseContent({ glossary: broken, sources: sourcesJson, bigPicture: bigPictureJson })).toThrow(/\[R1\].*ghost/)
  })
})

describe('term marker syntax', () => {
  it('extracts ids from [[id]] and [[id|label]]', () => {
    expect(extractTermRefs('A [[budget]] is not [[actual-cost|actual cost]].')).toEqual(['budget', 'actual-cost'])
  })
})
