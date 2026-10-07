import type { Metadata } from 'next'
import { ComingSoon } from '@/ui/ComingSoon'

export const metadata: Metadata = { title: 'Capabilities' }

export default function Page() {
  return <ComingSoon title="Capabilities" area="B" increment="I3" />
}
