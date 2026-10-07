import { describe, expect, it } from 'vitest'
import bigPictureJson from '@content/big-picture.json'
import glossaryJson from '@content/glossary.json'
import { BigPictureFileSchema, GlossaryFileSchema, linkTypes } from '@/content/schema'
import { validateBigPicture } from '@/domain/validation'
import { VIEW, boxes, routes } from '@/ui/big-picture/layout'
import { linkStyles } from '@/ui/big-picture/linkStyles'
import { steps, typeOrder, viewState } from '@/ui/big-picture/steps'

// Expectations from REQ-003 and docs/domain/model.md sections 1 and 4.

const bp = BigPictureFileSchema.parse(bigPictureJson)
const terms = GlossaryFileSchema.parse(glossaryJson).terms

describe('big picture content (REQ-003)', () => {
  it('passes validation', () => {
    expect(validateBigPicture(bp, terms)).toEqual([])
  })

  it('AC-003-1: exactly C1–C8, each with at least one lead discipline', () => {
    expect(bp.capabilities.map((c) => c.code).sort()).toEqual(['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'])
    for (const c of bp.capabilities) expect(c.primary.length, c.code).toBeGreaterThan(0)
  })

  it('AC-003-1: finance processes appear as adjacent environment with links into C2 and C4', () => {
    const envTargets = bp.links.filter((l) => l.from === 'env' || l.to === 'env').map((l) => l.to)
    expect(envTargets.sort()).toEqual(['c2', 'c4'])
  })

  it('model section 1: the steering loop C1→C2→C3→C6→C7→C8→C1 is closed', () => {
    const loop = ['c1', 'c2', 'c3', 'c6', 'c7', 'c8', 'c1']
    for (let i = 0; i < loop.length - 1; i++) {
      const from = loop[i]
      const to = loop[i + 1]
      expect(bp.links.some((l) => l.from === from && l.to === to), `${from}→${to}`).toBe(true)
    }
  })

  it('model section 1: outcome feedback returns from C8 to strategy (C1) and funding (C2)', () => {
    const back = bp.links.filter((l) => l.type === 'outcome-feedback' && l.from === 'c8').map((l) => l.to)
    expect(back).toEqual(expect.arrayContaining(['c1', 'c2']))
  })

  it('all six link types are used, and the four disciplines EPM, LPM, TBM, EA all contribute', () => {
    expect(new Set(bp.links.map((l) => l.type))).toEqual(new Set(linkTypes))
    const contributing = new Set(bp.capabilities.flatMap((c) => [...c.primary, ...c.supporting]))
    for (const d of ['epm', 'lpm', 'tbm', 'ea']) expect(contributing.has(d), d).toBe(true)
  })

  it('no discipline is a single isolated tile: each contributes to at least two capabilities', () => {
    for (const d of ['epm', 'lpm', 'tbm', 'ea']) {
      const n = bp.capabilities.filter((c) => [...c.primary, ...c.supporting].includes(d)).length
      expect(n, d).toBeGreaterThanOrEqual(2)
    }
  })
})

describe('negative fixtures (AC-003-7)', () => {
  const link = bp.links[0]!

  it('schema rejects a link without type', () => {
    const broken = { ...bigPictureJson, links: [{ ...link, type: undefined }] }
    expect(() => BigPictureFileSchema.parse(broken)).toThrow()
  })

  it('schema rejects a link without description', () => {
    const broken = { ...bigPictureJson, links: [{ ...link, label: '' }] }
    expect(() => BigPictureFileSchema.parse(broken)).toThrow()
  })

  it('schema rejects an unknown link type', () => {
    const broken = { ...bigPictureJson, links: [{ ...link, type: 'informs' }] }
    expect(() => BigPictureFileSchema.parse(broken)).toThrow()
  })

  it('validation rejects a link to an unknown node', () => {
    const f = validateBigPicture({ ...bp, links: [...bp.links, { ...link, id: 'lx', to: 'c9' }] }, terms)
    expect(f.map((x) => x.rule)).toContain('R1')
  })

  it('validation rejects an isolated capability', () => {
    const f = validateBigPicture({ ...bp, links: bp.links.filter((l) => l.from !== 'c5' && l.to !== 'c5') }, terms)
    expect(f).toContainEqual({ rule: 'BP', id: 'c5', message: 'capability has no link (isolated tile)' })
  })

  it('validation rejects an unknown discipline', () => {
    const caps = bp.capabilities.map((c, i) => (i === 0 ? { ...c, supporting: ['pmo'] } : c))
    expect(validateBigPicture({ ...bp, capabilities: caps }, terms).map((x) => x.rule)).toContain('R1')
  })
})

describe('link styles (AC-003-2: distinguishable without colour)', () => {
  it('every link type has a unique combination of pattern, width, double line and marker', () => {
    const signatures = linkTypes.map((t) => {
      const s = linkStyles[t]
      return `${s.dash}|${s.width}|${s.double}|${s.marker}`
    })
    expect(new Set(signatures).size).toBe(linkTypes.length)
  })

  it('every link type differs from every other in line pattern or end marker (not only width)', () => {
    for (const a of linkTypes)
      for (const b of linkTypes) {
        if (a === b) continue
        const sa = linkStyles[a]
        const sb = linkStyles[b]
        const differs = sa.dash !== sb.dash || sa.marker !== sb.marker || sa.double !== sb.double
        expect(differs, `${a} vs ${b}`).toBe(true)
      }
  })
})

describe('fixed layout (REQ-003 quality: no layout jumping)', () => {
  it('every capability, the environment and every link have fixed coordinates', () => {
    for (const c of bp.capabilities) expect(boxes[c.id], c.id).toBeDefined()
    expect(boxes.env).toBeDefined()
    for (const l of bp.links) expect(routes[l.id]?.length, l.id).toBeGreaterThanOrEqual(2)
  })

  it('nodes stay inside the canvas and do not overlap', () => {
    const list = Object.entries(boxes)
    for (const [id, b] of list) {
      expect(b.x >= 0 && b.y >= 0 && b.x + b.w <= VIEW.w && b.y + b.h <= VIEW.h, id).toBe(true)
    }
    for (const [a, ba] of list)
      for (const [b, bb] of list) {
        if (a >= b) continue
        const overlap = ba.x < bb.x + bb.w && bb.x < ba.x + ba.w && ba.y < bb.y + bb.h && bb.y < ba.y + ba.h
        expect(overlap, `${a} overlaps ${b}`).toBe(false)
      }
  })

  it('each route starts on the edge of its source node and ends on the edge of its target node', () => {
    const onEdge = (id: string, [x, y]: readonly [number, number]) => {
      const b = boxes[id]!
      const inX = x >= b.x && x <= b.x + b.w
      const inY = y >= b.y && y <= b.y + b.h
      return (inX && (y === b.y || y === b.y + b.h)) || (inY && (x === b.x || x === b.x + b.w))
    }
    for (const l of bp.links) {
      const r = routes[l.id]!
      expect(onEdge(l.from, r[0]!), `${l.id} start`).toBe(true)
      expect(onEdge(l.to, r[r.length - 1]!), `${l.id} end`).toBe(true)
    }
  })

  it('route segments are orthogonal and do not cross through other nodes', () => {
    for (const l of bp.links) {
      const r = routes[l.id]!
      for (let i = 0; i < r.length - 1; i++) {
        const [x1, y1] = r[i]!
        const [x2, y2] = r[i + 1]!
        expect(x1 === x2 || y1 === y2, `${l.id} segment ${i} not orthogonal`).toBe(true)
        for (const [id, b] of Object.entries(boxes)) {
          if (id === l.from || id === l.to) continue
          const minX = Math.min(x1, x2), maxX = Math.max(x1, x2)
          const minY = Math.min(y1, y2), maxY = Math.max(y1, y2)
          const crosses = minX < b.x + b.w && maxX > b.x && minY < b.y + b.h && maxY > b.y
          expect(crosses, `${l.id} crosses ${id}`).toBe(false)
        }
      }
    }
  })
})

describe('guided steps and filter (AC-003-3, AC-003-4)', () => {
  it('order: capabilities → disciplines → each link type once → outcome feedback last → complete', () => {
    expect(steps[0]!.id).toBe('capabilities')
    expect(steps[1]!.id).toBe('disciplines')
    const typeSteps = steps.slice(2, 2 + linkTypes.length).map((s) => s.focus)
    expect(new Set(typeSteps)).toEqual(new Set(linkTypes))
    expect(typeSteps[typeSteps.length - 1]).toBe('outcome-feedback')
    expect(steps[steps.length - 1]!.id).toBe('complete')
  })

  it('step 1 shows no links and no disciplines; step 2 adds disciplines', () => {
    expect(viewState(0, null).visibleTypes.size).toBe(0)
    expect(viewState(0, null).showDisciplines).toBe(false)
    expect(viewState(1, null).showDisciplines).toBe(true)
    expect(viewState(1, null).visibleTypes.size).toBe(0)
  })

  it('each link-type step adds exactly one type and highlights it', () => {
    for (let i = 2; i < 2 + typeOrder.length; i++) {
      const prev = viewState(i - 1, null).visibleTypes
      const cur = viewState(i, null)
      expect(cur.visibleTypes.size).toBe(prev.size + 1)
      expect(cur.highlight).not.toBeNull()
      expect(cur.visibleTypes.has(cur.highlight!)).toBe(true)
    }
  })

  it('complete step shows all types without highlight', () => {
    const v = viewState(steps.length - 1, null)
    expect(v.visibleTypes).toEqual(new Set(linkTypes))
    expect(v.highlight).toBeNull()
  })

  it('a legend filter shows the complete picture and highlights only the chosen type, from any step', () => {
    for (let i = 0; i < steps.length; i++) {
      const v = viewState(i, 'funding')
      expect(v.visibleTypes).toEqual(new Set(linkTypes))
      expect(v.highlight).toBe('funding')
    }
  })

  it('out-of-range step indices are clamped', () => {
    expect(viewState(-3, null).step.id).toBe('capabilities')
    expect(viewState(99, null).step.id).toBe('complete')
  })
})
