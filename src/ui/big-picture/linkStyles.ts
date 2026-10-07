import type { LinkType } from '@/content/schema'

// Visual signature per link type. Each type differs in line pattern and/or end marker,
// so it stays distinguishable in greyscale (AC-003-2, AC-009-3). Colour is never the only cue.
export type MarkerShape = 'arrow-open' | 'arrow-filled' | 'diamond'
export type LinkStyle = { dash: string | null; width: number; double: boolean; marker: MarkerShape }

export const linkStyles: Record<LinkType, LinkStyle> = {
  'strategic-contribution': { dash: null, width: 2, double: false, marker: 'arrow-open' },
  funding: { dash: null, width: 7, double: true, marker: 'arrow-filled' },
  delivery: { dash: null, width: 4, double: false, marker: 'arrow-filled' },
  'architecture-dependency': { dash: '1 8', width: 4, double: false, marker: 'diamond' },
  'cost-allocation': { dash: '10 6', width: 2.5, double: false, marker: 'arrow-filled' },
  'outcome-feedback': { dash: '14 5 3 5', width: 2.5, double: false, marker: 'arrow-open' },
}

// Short plain-language explanation shown in the legend and guided steps (our synthesis).
export const linkTypeDescriptions: Record<LinkType, string> = {
  'strategic-contribution': 'Which capability shapes the direction of another.',
  funding: 'Where approved money and guardrails flow.',
  delivery: 'How prioritised work becomes running products and services.',
  'architecture-dependency': 'Where architecture and lifecycles constrain choices.',
  'cost-allocation': 'How booked and forecast cost becomes transparent by solution and consumer.',
  'outcome-feedback': 'How results flow back into strategy and funding – closing the loop.',
}

export const lineStyleNames: Record<LinkType, string> = {
  'strategic-contribution': 'thin solid line, open arrow',
  funding: 'double line, filled arrow',
  delivery: 'thick solid line, filled arrow',
  'architecture-dependency': 'dotted line, diamond end',
  'cost-allocation': 'dashed line, filled arrow',
  'outcome-feedback': 'dash-dot line, open arrow',
}
