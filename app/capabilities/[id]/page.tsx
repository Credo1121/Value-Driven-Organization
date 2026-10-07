import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getContent } from '@/content/load'
import styles from '@/ui/page.module.css'

// Static capability pages. The full deep-dive template (REQ-004) follows in I3.
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
  const { bigPicture } = getContent()
  const c = bigPicture.capabilities.find((x) => x.id === id)
  if (!c) notFound()
  const short = new Map(bigPicture.disciplines.map((d) => [d.id, d.short]))
  const names = (ids: string[]) => ids.map((i) => short.get(i) ?? i).join(', ')

  return (
    <>
      <p className={styles.eyebrow}>Area B · {c.code}</p>
      <h1>{c.name}</h1>
      <p className={styles.preamble}>{c.question}</p>
      <p>
        <strong>Leads:</strong> {names(c.primary)}
        {c.supporting.length > 0 && (
          <>
            {' · '}
            <strong>Supports:</strong> {names(c.supporting)}
          </>
        )}
      </p>
      <p className={styles.notice}>
        The full deep dive (roles, inputs and outputs, decision rights, interfaces, typical breaks)
        follows in increment I3.
      </p>
      <p>
        <Link href="/big-picture/">Back to the big picture</Link>
      </p>
    </>
  )
}
