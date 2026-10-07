import bigPictureJson from '@content/big-picture.json'
import breaksJson from '@content/breaks.json'
import capabilitiesJson from '@content/capabilities.json'
import glossaryJson from '@content/glossary.json'
import sourcesJson from '@content/sources.json'
import { validateBigPicture, validateContent, validateDeepDives } from '@/domain/validation'
import {
  BigPictureFileSchema,
  BreaksFileSchema,
  DeepDivesFileSchema,
  GlossaryFileSchema,
  SourcesFileSchema,
  type BigPicture,
  type Break,
  type DeepDive,
  type GlossaryTerm,
  type Source,
} from './schema'

// Loads and validates all content at build time. Any finding aborts `next build` (ADR-003).

export type Content = {
  sources: Source[]
  terms: GlossaryTerm[]
  bigPicture: BigPicture
  breaks: Break[]
  deepDives: DeepDive[]
}

type RawContent = { glossary: unknown; sources: unknown; bigPicture: unknown; breaks?: unknown; deepDives?: unknown }

export class ContentValidationError extends Error {}

export function parseContent(raw: RawContent): Content {
  const sources = SourcesFileSchema.parse(raw.sources).sources
  const terms = GlossaryFileSchema.parse(raw.glossary).terms
  const bigPicture = BigPictureFileSchema.parse(raw.bigPicture)
  const breaks = BreaksFileSchema.parse(raw.breaks ?? breaksJson).breaks
  const deepDives = DeepDivesFileSchema.parse(raw.deepDives ?? capabilitiesJson).deepDives
  const findings = [
    ...validateContent({ sources, terms }),
    ...validateBigPicture(bigPicture, terms),
    ...validateDeepDives(deepDives, { capabilities: bigPicture.capabilities, terms, sources, breaks }),
  ]
  if (findings.length > 0) {
    const lines = findings.map((f) => `  [${f.rule}] ${f.id}: ${f.message}`).join('\n')
    throw new ContentValidationError(`Content validation failed:\n${lines}`)
  }
  return { sources, terms, bigPicture, breaks, deepDives }
}

let cached: Content | undefined

export function getContent(): Content {
  cached ??= parseContent({ glossary: glossaryJson, sources: sourcesJson, bigPicture: bigPictureJson })
  return cached
}
