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

// Financial value types (docs/domain/model.md 2.1); "variance" is always derived.
export const valueTypes = ['target', 'budget', 'forecast', 'actual', 'variance'] as const
export const valueTypeLabels: Record<(typeof valueTypes)[number], string> = {
  target: 'Target',
  budget: 'Budget',
  forecast: 'Forecast',
  actual: 'Actual',
  variance: 'Variance',
}

export const PhaseSchema = z.object({ id, label: z.string().min(1), capabilityId: id })

export const LaneSchema = z.object({
  id,
  label: z.string().min(1),
  sublabel: z.string().min(1),
  kind: z.enum(['hierarchy', 'parallel', 'adjacent']),
  disciplineIds: z.array(id).min(1),
  capabilityId: id.optional(),
})

export const HandoffSchema = z.object({
  to: id,
  type: LinkTypeSchema,
  label: z.string().min(1),
})

export const CellSchema = z.object({
  lane: id,
  phase: id,
  title: z.string().min(1),
  detail: z.string().min(1),
  valueTypes: z.array(z.enum(valueTypes)).default([]),
  handoff: HandoffSchema.optional(),
})

export const BigPictureFileSchema = z.object({
  disciplines: z.array(DisciplineSchema).min(1),
  capabilities: z.array(CapabilitySchema).length(8),
  phases: z.array(PhaseSchema).min(1),
  lanes: z.array(LaneSchema).min(1),
  cells: z.array(CellSchema).min(1),
  feedback: z.object({
    from: id,
    to: z.array(id).min(1),
    type: LinkTypeSchema,
    label: z.string().min(1),
  }),
})
export type BigPicture = z.infer<typeof BigPictureFileSchema>
export type Capability = z.infer<typeof CapabilitySchema>
export type Lane = z.infer<typeof LaneSchema>
export type Phase = z.infer<typeof PhaseSchema>
export type Cell = z.infer<typeof CellSchema>

// Capability deep dives (REQ-004). Each template section is either filled or explicitly "open"
// (AC-004-1); a missing section fails schema validation (AC-004-7).
const open = z.literal('open')
const section = <T extends z.ZodTypeAny>(s: T) => z.union([open, s])
const st = { statementType: StatementTypeSchema }

export const BreakSchema = z.object({ id: z.string().regex(/^b\d$/), text: z.string().min(1) })
export const BreaksFileSchema = z.object({ breaks: z.array(BreakSchema).length(7) })
export type Break = z.infer<typeof BreakSchema>

const endpoint = id // capability id or "finance"
const valueTypeEnum = z.enum(valueTypes)

export const DeepDiveSchema = z.object({
  capabilityId: id,
  status: z.enum(['open', 'draft', 'reviewed']),
  purpose: section(z.object({ text: z.string().min(1), ...st })),
  roles: section(
    z.object({
      ...st,
      items: z.array(z.object({ role: z.string().min(1), level: z.string().min(1), responsibility: z.string().min(1) })).min(1),
    }),
  ),
  inputsOutputs: section(
    z.object({
      ...st,
      inputs: z.array(z.object({ item: z.string().min(1), from: endpoint, valueType: valueTypeEnum.optional() })).min(1),
      outputs: z.array(z.object({ item: z.string().min(1), to: endpoint, valueType: valueTypeEnum.optional() })).min(1),
    }),
  ),
  dataObjects: section(z.object({ ...st, items: z.array(id).min(1) })),
  decisionRights: section(
    z.object({
      ...st,
      items: z.array(z.object({ decision: z.string().min(1), enterprise: z.string().min(1), compact: z.string().min(1) })).min(1),
    }),
  ),
  interfaces: section(
    z.object({
      ...st,
      items: z
        .array(z.object({ with: endpoint, direction: z.enum(['in', 'out']), type: LinkTypeSchema, what: z.string().min(1) }))
        .min(1),
    }),
  ),
  breaks: section(z.object({ ...st, items: z.array(z.object({ breakId: z.string(), text: z.string().min(1) })).min(1) })),
  sources: section(
    z.object({
      statements: z
        .array(z.object({ text: z.string().min(1), statementType: StatementTypeSchema, sourceIds: z.array(z.string()).default([]) }))
        .min(1),
      fitsWhen: z.array(z.string().min(1)).min(1),
      adaptWhen: z.array(z.string().min(1)).min(1),
    }),
  ),
  // Required for C2 and C4 once they are no longer open (AC-004-8).
  valueTypes: z
    .object({
      ...st,
      note: z.string().min(1),
      items: z.array(z.object({ valueType: valueTypeEnum, origin: z.string().min(1), use: z.string().min(1) })).min(1),
    })
    .optional(),
  example: z.object({ station: z.string().regex(/^S\d$/), label: z.string().min(1) }).optional(),
})
export const DeepDivesFileSchema = z.object({ deepDives: z.array(DeepDiveSchema).length(8) })
export type DeepDive = z.infer<typeof DeepDiveSchema>

export const templateSections = [
  'purpose',
  'roles',
  'inputsOutputs',
  'dataObjects',
  'decisionRights',
  'interfaces',
  'breaks',
  'sources',
] as const
export type TemplateSection = (typeof templateSections)[number]

export const templateSectionLabels: Record<TemplateSection, string> = {
  purpose: 'Purpose & key decision question',
  roles: 'Roles involved',
  inputsOutputs: 'Inputs & outputs',
  dataObjects: 'Data objects',
  decisionRights: 'Decision rights',
  interfaces: 'Interfaces',
  breaks: 'Typical breaks',
  sources: 'Sources & conditions of use',
}
