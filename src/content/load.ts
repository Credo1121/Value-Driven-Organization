import glossaryJson from '@content/glossary.json'
import sourcesJson from '@content/sources.json'
import { validateContent } from '@/domain/validation'
import { GlossaryFileSchema, SourcesFileSchema, type GlossaryTerm, type Source } from './schema'

// Loads and validates all content at build time. Any finding aborts `next build` (ADR-003).

export type Content = { sources: Source[]; terms: GlossaryTerm[] }

export class ContentValidationError extends Error {}

export function parseContent(raw: { glossary: unknown; sources: unknown }): Content {
  const sources = SourcesFileSchema.parse(raw.sources).sources
  const terms = GlossaryFileSchema.parse(raw.glossary).terms
  const findings = validateContent({ sources, terms })
  if (findings.length > 0) {
    const lines = findings.map((f) => `  [${f.rule}] ${f.id}: ${f.message}`).join('\n')
    throw new ContentValidationError(`Content validation failed:\n${lines}`)
  }
  return { sources, terms }
}

let cached: Content | undefined

export function getContent(): Content {
  cached ??= parseContent({ glossary: glossaryJson, sources: sourcesJson })
  return cached
}
