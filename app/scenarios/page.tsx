import type { Metadata } from 'next'
import { ComingSoon } from '@/ui/ComingSoon'

export const metadata: Metadata = { title: 'Scenarios' }

export default function Page() {
  return <ComingSoon title="Scenarios" area="D" increment="I5" />
}
