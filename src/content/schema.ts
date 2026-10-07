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
