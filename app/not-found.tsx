import Link from 'next/link'

// AC-009-5: understandable 404 with a way back.
export default function NotFound() {
  return (
    <>
      <h1>Page not found</h1>
      <p>This page does not exist. It may have moved, or the address may be mistyped.</p>
      <p>
        <Link href="/">Back to start</Link>
      </p>
    </>
  )
}
