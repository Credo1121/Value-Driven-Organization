import { z } from 'zod'

// Contract for content files (ADR-003). Types are derived from these schemas.

export const statementTypes = ['framework', 'synthesis', 'example', 'assumption'] as const
export const StatementTypeSchema = z.enum(statementTypes)
export type StatementType = z.infer<typeof StatementTypeSchema>

// UI labels per statement type (REQ-002). "Benchmark" is intentionally absent in the MVP.
export const statementTypeLabels: Record<StatementType, string> = {
  framework: 'Framework-based',
  synthesis: 'Our synthesis',
  example: 'Illustrative example',
  assumption: 'Assumption',
}

const id = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'ids are lowercase kebab-case')
const sourceId = z.string().regex(/^S-[A-Z]+-\d+$/, 'source ids look like S-TBM-1')

export const SourceSchema = z.object({
  id: sourceId,
  title: z.string().min(1),
  publisher: z.string().min(1),
  urls: z.array(z.url()).min(1),
  retrieved: z.iso.date(),
  version: z.string().min(1),
  status: z.enum(['verified', 'not-verified']),
  supports: z.array(z.string().min(1)),
  notVerified: z.array(z.string().min(1)).default([]),
  limits: z.string().min(1),
  license: z.string().min(1),
})
export type Source = z.infer<typeof SourceSchema>

export const GlossaryTermSchema = z.object({
  id,
  term: z.string().min(1),
  category: z.enum(['discipline', 'object', 'value-type', 'relationship']),
  definition: z.string().min(1),
  distinction: z.string().min(1),
  variants: z.string().optional(),
  statementType: StatementTypeSchema,
  sourceIds: z.array(sourceId).default([]),
  related: z.array(id).default([]),
})
export type GlossaryTerm = z.infer<typeof GlossaryTermSchema>

export const SourcesFileSchema = z.object({ sources: z.array(SourceSchema).min(1) })
export const GlossaryFileSchema = z.object({ terms: z.array(GlossaryTermSchema).min(1) })

// Big picture (REQ-003): steering capabilities and typed links (docs/domain/model.md, sections 1 and 4).
export const linkTypes = [
  'strategic-contribution',
  'funding',
  'cost-allocation',
  'delivery',
  'architecture-dependency',
  'outcome-feedback',
] as const
export const LinkTypeSchema = z.enum(linkTypes)
export type LinkType = z.infer<typeof LinkTypeSchema>

export const linkTypeLabels: Record<LinkType, string> = {
  'strategic-contribution': 'Strategic contribution',
  funding: 'Funding',
  'cost-allocation': 'Cost allocation',
  delivery: 'Delivery',
  'architecture-dependency': 'Architecture dependency',
  'outcome-feedback': 'Outcome feedback',
}

export const DisciplineSchema = z.object({
  id,
  short: z.string().min(1),
  glossaryId: id.nullable(),
})

export const CapabilitySchema = z.object({
  id,
  code: z.string().regex(/^C\d$/),
  name: z.string().min(1),
  question: z.string().min(1),
  primary: z.array(id).min(1),
  supporting: z.array(id),
  role: z.enum(['loop', 'cross']),
  // true: leads hand over in the listed order (e.g. EPM → LPM); false: joint lead.
  leadSequence: z.boolean().default(false),
  leadNote: z.string().min(1).optional(),
})

export const LinkSchema = z.object({
  id,
  from: id,
  to: id,
  type: LinkTypeSchema,
  label: z.string().min(1),
})

export const BigPictureFileSchema = z.object({
  disciplines: z.array(DisciplineSchema).min(1),
  capabilities: z.array(CapabilitySchema).length(8),
  environment: z.object({ id, name: z.string().min(1), description: z.string().min(1) }),
  links: z.array(LinkSchema).min(1),
})
export type BigPicture = z.infer<typeof BigPictureFileSchema>
export type Capability = z.infer<typeof CapabilitySchema>
export type Link = z.infer<typeof LinkSchema>
