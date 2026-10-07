import Link from 'next/link'
import { linkTypeLabels, type BigPicture } from '@/content/schema'
import { formatLeads } from './leads'
import { typeOrder } from './steps'
import styles from './text.module.css'

// Text alternative with the same information as the diagram (AC-003-6). Server-rendered.
export function BigPictureText({ data }: { data: BigPicture }) {
  const shortName = new Map(data.disciplines.map((d) => [d.id, d.short]))
  const names = (ids: string[]) => ids.map((i) => shortName.get(i) ?? i).join(', ')
  const nodeName = new Map<string, string>([
    ...data.capabilities.map((c) => [c.id, `${c.code} ${c.name}`] as [string, string]),
    ['env', data.environment.name],
  ])

  return (
    <details className={styles.text} id="text-view">
      <summary>Text view: all capabilities and links</summary>

      <h3>Steering capabilities</h3>
      <table>
        <caption className="visually-hidden">Steering capabilities with lead and supporting disciplines</caption>
        <thead>
          <tr>
            <th scope="col">Capability</th>
            <th scope="col">Key decision question</th>
            <th scope="col">Leads</th>
            <th scope="col">Supports</th>
          </tr>
        </thead>
        <tbody>
          {data.capabilities.map((c) => (
            <tr key={c.id}>
              <th scope="row">
                <Link href={`/capabilities/${c.id}/`}>
                  {c.code} {c.name}
                </Link>
                {c.role === 'cross' && <span className={styles.tag}> (cross-cutting)</span>}
              </th>
              <td>{c.question}</td>
              <td>
                {formatLeads(c, shortName)}
                {c.leadNote && <span className={styles.note}>{c.leadNote}</span>}
              </td>
              <td>{names(c.supporting) || '–'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Adjacent: <strong>{data.environment.name}</strong> – {data.environment.description}
      </p>

      <h3>Links by type</h3>
      {typeOrder.map((t) => {
        const links = data.links.filter((l) => l.type === t)
        return (
          <section key={t} aria-label={linkTypeLabels[t]}>
            <h4>{linkTypeLabels[t]}</h4>
            <ul>
              {links.map((l) => (
                <li key={l.id}>
                  <strong>
                    {nodeName.get(l.from)} → {nodeName.get(l.to)}:
                  </strong>{' '}
                  {l.label}
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </details>
  )
}
