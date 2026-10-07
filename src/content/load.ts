import bigPictureJson from '@content/big-picture.json'
import glossaryJson from '@content/glossary.json'
import sourcesJson from '@content/sources.json'
import { validateBigPicture, validateContent } from '@/domain/validation'
import {
  BigPictureFileSchema,
  GlossaryFileSchema,
  SourcesFileSchema,
  type BigPicture,
  type GlossaryTerm,
  type Source,
} from './schema'

// Loads and validates all content at build time. Any finding aborts `next build` (ADR-003).

export type Content = { sources: Source[]; terms: GlossaryTerm[]; bigPicture: BigPicture }

export class ContentValidationError extends Error {}

export function parseContent(raw: { glossary: unknown; sources: unknown; bigPicture: unknown }): Content {
  const sources = SourcesFileSchema.parse(raw.sources).sources
  const terms = GlossaryFileSchema.parse(raw.glossary).terms
  const bigPicture = BigPictureFileSchema.parse(raw.bigPicture)
  const findings = [...validateContent({ sources, terms }), ...validateBigPicture(bigPicture, terms)]
  if (findings.length > 0) {
    const lines = findings.map((f) => `  [${f.rule}] ${f.id}: ${f.message}`).join('\n')
    throw new ContentValidationError(`Content validation failed:\n${lines}`)
  }
  return { sources, terms, bigPicture }
}

let cached: Content | undefined

export function getContent(): Content {
  cached ??= parseContent({ glossary: glossaryJson, sources: sourcesJson, bigPicture: bigPictureJson })
  return cached
}
