import { linkTypeLabels, type LinkType } from '@/content/schema'
import { linkTypeDescriptions } from './linkStyles'

// Guided moderation order (AC-003-4): capabilities → discipline contributions →
// link types one by one → outcome feedback last → complete picture.
export const typeOrder: LinkType[] = [
  'strategic-contribution',
  'funding',
  'delivery',
  'architecture-dependency',
  'cost-allocation',
  'outcome-feedback',
]

export type Step = {
  id: string
  title: string
  description: string
  showDisciplines: boolean
  types: LinkType[]
  focus: LinkType | null
}

export const steps: Step[] = [
  {
    id: 'capabilities',
    title: 'Eight shared steering capabilities',
    description:
      'Steering is organised around shared capabilities – not around four separate frameworks.',
    showDisciplines: false,
    types: [],
    focus: null,
  },
  {
    id: 'disciplines',
    title: 'What each discipline contributes',
    description:
      'EPM, LPM, TBM and EA each contribute to several capabilities. Bold names lead, the others support.',
    showDisciplines: true,
    types: [],
    focus: null,
  },
  ...typeOrder.map((t, i) => ({
    id: t,
    title: t === 'outcome-feedback' ? 'Outcome feedback – closing the loop' : linkTypeLabels[t],
    description: linkTypeDescriptions[t],
    showDisciplines: true,
    types: typeOrder.slice(0, i + 1),
    focus: t,
  })),
  {
    id: 'complete',
    title: 'The complete steering system',
    description: 'All six link types together. Select a link type in the legend to focus on it.',
    showDisciplines: true,
    types: typeOrder,
    focus: null,
  },
]

export const lastStep = steps.length - 1

export type ViewState = {
  step: Step
  visibleTypes: Set<LinkType>
  highlight: LinkType | null
  showDisciplines: boolean
}

// Pure view logic: a legend filter always works on the complete picture (AC-003-3).
export function viewState(stepIndex: number, filter: LinkType | null): ViewState {
  const index = Math.min(Math.max(stepIndex, 0), lastStep)
  const step = steps[index] as Step
  if (filter) {
    return { step, visibleTypes: new Set(typeOrder), highlight: filter, showDisciplines: true }
  }
  return {
    step,
    visibleTypes: new Set(step.types),
    highlight: step.focus,
    showDisciplines: step.showDisciplines,
  }
}
