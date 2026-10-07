import type { Metadata } from 'next'
import { ComingSoon } from '@/ui/ComingSoon'

export const metadata: Metadata = { title: 'Big picture' }

export default function Page() {
  return <ComingSoon title="Big picture" area="A" increment="I2" />
}
