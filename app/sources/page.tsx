import type { Metadata } from 'next'
import { ComingSoon } from '@/ui/ComingSoon'

export const metadata: Metadata = { title: 'Sources' }

export default function Page() {
  return <ComingSoon title="Sources" increment="I6" />
}
