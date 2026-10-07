import Link from 'next/link'
import styles from './page.module.css'

// Empty state for areas that are planned but not yet built (REQ-009).
export function ComingSoon({ title, area, increment }: { title: string; area?: string; increment: string }) {
  return (
    <>
      {area && <p className={styles.eyebrow}>Area {area}</p>}
      <h1>{title}</h1>
      <p className={styles.notice}>
        This area is in preparation and follows in increment {increment}.
      </p>
      <p>
        <Link href="/">Back to start</Link> · <Link href="/glossary/">Glossary</Link>
      </p>
    </>
  )
}
