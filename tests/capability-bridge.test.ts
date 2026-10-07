import { describe, expect, it } from 'vitest'
import bigPictureJson from '@content/big-picture.json'
import capabilityBridgeJson from '@content/capability-bridges.json'
import { BigPictureFileSchema, CapabilityBridgeFileSchema } from '@/content/schema'
import { validateCapabilityBridge } from '@/domain/validation'

// Capability bridge (entry page, best-of-breed overview). No REQ yet; validated like other content.

const bp = BigPictureFileSchema.parse(bigPictureJson)
const bridge = CapabilityBridgeFileSchema.parse(capabilityBridgeJson)

describe('capability bridge content', () => {
  it('passes validation', () => {
    expect(validateCapabilityBridge(bridge, bp)).toEqual([])
  })

  it('every node references a known discipline and capability', () => {
    const disciplineIds = new Set(bp.disciplines.map((d) => d.id))
    const capabilityIds = new Set(bp.capabilities.map((c) => c.id))
    for (const n of bridge.nodes) {
      expect(disciplineIds.has(n.disciplineId), n.id).toBe(true)
      expect(capabilityIds.has(n.capabilityId), n.id).toBe(true)
    }
  })

  it('every link connects two existing, different nodes', () => {
    const nodeIds = new Set(bridge.nodes.map((n) => n.id))
    for (const l of bridge.links) {
      expect(nodeIds.has(l.from), l.from).toBe(true)
      expect(nodeIds.has(l.to), l.to).toBe(true)
      expect(l.from).not.toBe(l.to)
    }
  })

  it('covers all four disciplines of the overview (EPM, TBM, EA, LPM)', () => {
    const covered = new Set(bridge.nodes.map((n) => n.disciplineId))
    expect(covered).toEqual(new Set(['epm', 'tbm', 'ea', 'lpm']))
  })
})

describe('negative fixtures', () => {
  const rules = (data: unknown) => validateCapabilityBridge(CapabilityBridgeFileSchema.parse(data), bp).map((f) => f.rule)

  it('unknown discipline', () => {
    const nodes = bridge.nodes.map((n, i) => (i === 0 ? { ...n, disciplineId: 'marketing' } : n))
    expect(rules({ ...bridge, nodes })).toContain('R1')
  })

  it('unknown capability', () => {
    const nodes = bridge.nodes.map((n, i) => (i === 0 ? { ...n, capabilityId: 'c9' } : n))
    expect(rules({ ...bridge, nodes })).toContain('R1')
  })

  it('link to an unknown node', () => {
    const links = [...bridge.links, { from: bridge.nodes[0]!.id, to: 'nonexistent', type: 'informs', label: 'x' }]
    expect(rules({ ...bridge, links })).toContain('R1')
  })

  it('link pointing to itself', () => {
    const links = [...bridge.links, { from: bridge.nodes[0]!.id, to: bridge.nodes[0]!.id, type: 'informs', label: 'x' }]
    expect(rules({ ...bridge, links })).toContain('BP')
  })

  it('duplicate node id', () => {
    const nodes = [...bridge.nodes, bridge.nodes[0]!]
    expect(rules({ ...bridge, nodes })).toContain('UNIQUE')
  })
})
