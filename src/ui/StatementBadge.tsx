import { statementTypeLabels, type StatementType } from '@/content/schema'
import styles from './glossary.module.css'

// Statement type shown as text plus a distinct symbol – never colour alone (AC-002-3, AC-009-3).
const symbols: Record<StatementType, string> = {
  framework: '■',
  synthesis: '◆',
  example: '●',
  assumption: '▲',
}

export function StatementBadge({ type }: { type: StatementType }) {
  return (
    <span className={styles.badge} data-type={type}>
      <span aria-hidden="true">{symbols[type]}</span> {statementTypeLabels[type]}
    </span>
  )
}
