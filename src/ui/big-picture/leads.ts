import type { Capability } from '@/content/schema'

// Formats lead disciplines: a sequence hands over in order (EPM → LPM), otherwise a joint lead.
export function formatLeads(c: Capability, short: Map<string, string>): string {
  const names = c.primary.map((i) => short.get(i) ?? i)
  return names.join(c.leadSequence ? ' → ' : ' · ')
}
