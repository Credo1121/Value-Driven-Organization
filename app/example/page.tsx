import type { Metadata } from 'next'
import { ComingSoon } from '@/ui/ComingSoon'

export const metadata: Metadata = { title: 'End-to-end example' }

export default function Page() {
  return <ComingSoon title="End-to-end example" area="E" increment="I4" />
}
