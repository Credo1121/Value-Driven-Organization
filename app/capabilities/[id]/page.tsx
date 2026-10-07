import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getContent } from '@/content/load'
import { DeepDiveView } from '@/ui/capability/DeepDiveView'

// Capability deep dives (REQ-004), statically generated for C1–C8.
export const dynamicParams = false

export function generateStaticParams() {
  return getContent().bigPicture.capabilities.map((c) => ({ id: c.id }))
}

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const c = getContent().bigPicture.capabilities.find((x) => x.id === id)
  return { title: c ? `${c.code} ${c.name}` : 'Capability' }
}

export default async function CapabilityPage({ params }: Props) {
  const { id } = await params
  const { bigPicture, deepDives, terms, sources, breaks } = getContent()
  const capability = bigPicture.capabilities.find((x) => x.id === id)
  const dive = deepDives.find((d) => d.capabilityId === id)
  if (!capability || !dive) notFound()

  return (
    <DeepDiveView
      capability={capability}
      dive={dive}
      capabilities={bigPicture.capabilities}
      disciplines={new Map(bigPicture.disciplines.map((d) => [d.id, d.short]))}
      terms={new Map(terms.map((t) => [t.id, t]))}
      sources={new Map(sources.map((s) => [s.id, s]))}
      breaks={new Map(breaks.map((b) => [b.id, b]))}
    />
  )
}
