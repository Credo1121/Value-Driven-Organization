import type { BigPicture } from '@/content/schema'

// Guided moderation order (AC-003-4): structure → each phase in sequence →
// parallel lanes → outcome feedback. Pure functions, independent of React.

export type Step = {
  id: string
  title: string
  description: string
  // Phases revealed so far (in sequence order); unrevealed phases are hidden in place.
  revealedPhases: number
  activePhase: string | null
  showParallel: boolean
  showFeedback: boolean
}

export function buildSteps(bp: BigPicture): Step[] {
  const n = bp.phases.length
  const capName = new Map(bp.capabilities.map((c) => [c.id, `${c.code} ${c.name}`]))
  return [
    {
      id: 'structure',
      title: 'Phases and levels',
      description:
        'Steering runs left to right through six phases. Top to bottom are the levels: enterprise, portfolio, delivery and operations. Two capabilities run in parallel below.',
      revealedPhases: 0,
      activePhase: null,
      showParallel: false,
      showFeedback: false,
    },
    ...bp.phases.map((p, i) => ({
      id: p.id,
      title: `${i + 1}. ${p.label}`,
      description: `${capName.get(p.capabilityId)} – read the column top to bottom: who does what, and what is handed down.`,
      revealedPhases: i + 1,
      activePhase: p.id,
      showParallel: false,
      showFeedback: false,
    })),
    {
      id: 'parallel',
      title: 'Running in parallel: cost and architecture',
      description:
        'Cost transparency (TBM) and architecture (EA) inform every phase. Corporate finance provides target, budget, forecast and actuals alongside.',
      revealedPhases: n,
      activePhase: null,
      showParallel: true,
      showFeedback: false,
    },
    {
      id: 'feedback',
      title: 'Closing the loop',
      description: bp.feedback.label,
      revealedPhases: n,
      activePhase: null,
      showParallel: true,
      showFeedback: true,
    },
  ]
}

export function clampStep(index: number, steps: Step[]): number {
  return Math.min(Math.max(index, 0), steps.length - 1)
}
