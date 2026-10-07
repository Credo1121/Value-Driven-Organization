import Link from 'next/link'
import {
  linkTypeLabels,
  statementTypeLabels,
  templateSectionLabels,
  valueTypeLabels,
  type Break,
  type Capability,
  type DeepDive,
  type GlossaryTerm,
  type Source,
  type StatementType,
  type TemplateSection,
} from '@/content/schema'
import { StatementBadge } from '@/ui/StatementBadge'
import { TermText } from '@/ui/TermText'
import { formatLeads } from '@/ui/big-picture/leads'
import styles from './deepDive.module.css'

type Props = {
  capability: Capability
  dive: DeepDive
  capabilities: Capability[]
  disciplines: Map<string, string>
  terms: Map<string, GlossaryTerm>
  sources: Map<string, Source>
  breaks: Map<string, Break>
}

const sectionOrder: TemplateSection[] = [
  'purpose',
  'roles',
  'inputsOutputs',
  'dataObjects',
  'decisionRights',
  'interfaces',
  'breaks',
  'sources',
]

function Section({
  id,
  statementType,
  children,
}: {
  id: TemplateSection | 'valueTypes'
  statementType?: StatementType
  children: React.ReactNode
}) {
  const title = id === 'valueTypes' ? 'Financial value types' : templateSectionLabels[id]
  return (
    <section id={id} aria-labelledby={`${id}-h`} className={styles.section}>
      <div className={styles.sectionHead}>
        <h2 id={`${id}-h`}>{title}</h2>
        {statementType && <StatementBadge type={statementType} />}
      </div>
      {children}
    </section>
  )
}

function OpenSection({ id }: { id: TemplateSection }) {
  return (
    <Section id={id}>
      <p className={styles.open}>Open – to be defined.</p>
    </Section>
  )
}

export function DeepDiveView({ capability, dive, capabilities, disciplines, terms, sources, breaks }: Props) {
  const capName = (cid: string) => {
    if (cid === 'finance') return 'Corporate finance'
    const c = capabilities.find((x) => x.id === cid)
    return c ? `${c.code} ${c.name}` : cid
  }
  const endpoint = (cid: string) =>
    cid === 'finance' ? (
      <Link href="/glossary/#finance-processes">Corporate finance</Link>
    ) : (
      <Link href={`/capabilities/${cid}/`}>{capName(cid)}</Link>
    )

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Area B · {capability.code}</p>
        <h1>{capability.name}</h1>
        <p className={styles.question}>
          <span className={styles.label}>Key decision question</span>
          {capability.question}
        </p>
        <p className={styles.leads}>
          <strong>Leads:</strong> {formatLeads(capability, disciplines)}
          {capability.supporting.length > 0 && (
            <>
              {' · '}
              <strong>Supports:</strong> {capability.supporting.map((d) => disciplines.get(d) ?? d).join(', ')}
            </>
          )}
        </p>
        {capability.leadNote && <p className={styles.leadNote}>{capability.leadNote}</p>}
        {dive.status === 'draft' && (
          <p className={styles.status}>Draft content – for review with the client lead.</p>
        )}
      </header>

      <nav aria-label="Sections on this page" className={styles.toc}>
        <ol>
          {sectionOrder.flatMap((s) => [
            <li key={s}>
              <a href={`#${s}`}>{templateSectionLabels[s]}</a>
              {dive[s] === 'open' && <span className={styles.tocOpen}> (open)</span>}
            </li>,
            // Value types follow decision rights on the page, so they do here too.
            s === 'decisionRights' && dive.valueTypes ? (
              <li key="valueTypes">
                <a href="#valueTypes">Financial value types</a>
              </li>
            ) : null,
          ])}
        </ol>
      </nav>

      {dive.purpose === 'open' ? (
        <OpenSection id="purpose" />
      ) : (
        <Section id="purpose" statementType={dive.purpose.statementType}>
          <p className={styles.lead}>
            <TermText text={dive.purpose.text} terms={terms} />
          </p>
        </Section>
      )}

      {dive.roles === 'open' ? (
        <OpenSection id="roles" />
      ) : (
        <Section id="roles" statementType={dive.roles.statementType}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Role</th>
                <th scope="col">Level</th>
                <th scope="col">Responsibility</th>
              </tr>
            </thead>
            <tbody>
              {dive.roles.items.map((r) => (
                <tr key={r.role}>
                  <th scope="row">{r.role}</th>
                  <td>{r.level}</td>
                  <td>{r.responsibility}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      {dive.inputsOutputs === 'open' ? (
        <OpenSection id="inputsOutputs" />
      ) : (
        <Section id="inputsOutputs" statementType={dive.inputsOutputs.statementType}>
          <div className={styles.io}>
            <div>
              <h3>Inputs</h3>
              <ul className={styles.ioList}>
                {dive.inputsOutputs.inputs.map((i) => (
                  <li key={i.item}>
                    <span className={styles.ioItem}>{i.item}</span>
                    <span className={styles.ioMeta}>
                      from {endpoint(i.from)}
                      {i.valueType && <span className={styles.chip}>{valueTypeLabels[i.valueType]}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Outputs</h3>
              <ul className={styles.ioList}>
                {dive.inputsOutputs.outputs.map((o) => (
                  <li key={o.item}>
                    <span className={styles.ioItem}>{o.item}</span>
                    <span className={styles.ioMeta}>
                      to {endpoint(o.to)}
                      {o.valueType && <span className={styles.chip}>{valueTypeLabels[o.valueType]}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      )}

      {dive.dataObjects === 'open' ? (
        <OpenSection id="dataObjects" />
      ) : (
        <Section id="dataObjects" statementType={dive.dataObjects.statementType}>
          <ul className={styles.tags}>
            {dive.dataObjects.items.map((t) => (
              <li key={t}>
                <Link href={`/glossary/#${t}`}>{terms.get(t)?.term ?? t}</Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {dive.decisionRights === 'open' ? (
        <OpenSection id="decisionRights" />
      ) : (
        <Section id="decisionRights" statementType={dive.decisionRights.statementType}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Decision</th>
                <th scope="col">Enterprise variant</th>
                <th scope="col">Compact variant</th>
              </tr>
            </thead>
            <tbody>
              {dive.decisionRights.items.map((d) => (
                <tr key={d.decision}>
                  <th scope="row">{d.decision}</th>
                  <td>{d.enterprise}</td>
                  <td>{d.compact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      {dive.valueTypes && (
        <Section id="valueTypes" statementType={dive.valueTypes.statementType}>
          <p className={styles.note}>{dive.valueTypes.note}</p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Value type</th>
                <th scope="col">Where it comes from</th>
                <th scope="col">What it is used for</th>
              </tr>
            </thead>
            <tbody>
              {dive.valueTypes.items.map((v) => (
                <tr key={v.valueType}>
                  <th scope="row">
                    <Link href={`/glossary/#${v.valueType === 'actual' ? 'actual-cost' : v.valueType}`}>
                      {valueTypeLabels[v.valueType]}
                    </Link>
                  </th>
                  <td>{v.origin}</td>
                  <td>{v.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      {dive.interfaces === 'open' ? (
        <OpenSection id="interfaces" />
      ) : (
        <Section id="interfaces" statementType={dive.interfaces.statementType}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">With</th>
                <th scope="col">Direction</th>
                <th scope="col">Link type</th>
                <th scope="col">What flows</th>
              </tr>
            </thead>
            <tbody>
              {dive.interfaces.items.map((i) => (
                <tr key={`${i.with}-${i.direction}-${i.type}`}>
                  <th scope="row">{endpoint(i.with)}</th>
                  <td>{i.direction === 'in' ? '← into this capability' : '→ from this capability'}</td>
                  <td>{linkTypeLabels[i.type]}</td>
                  <td>{i.what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      {dive.breaks === 'open' ? (
        <OpenSection id="breaks" />
      ) : (
        <Section id="breaks" statementType={dive.breaks.statementType}>
          <ul className={styles.breaks}>
            {dive.breaks.items.map((b) => (
              <li key={b.text}>
                <span className={styles.breakRef}>
                  Break {b.breakId.slice(1)}: {breaks.get(b.breakId)?.text}
                </span>
                <span>{b.text}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {dive.sources === 'open' ? (
        <OpenSection id="sources" />
      ) : (
        <Section id="sources">
          <ul className={styles.statements}>
            {dive.sources.statements.map((s) => (
              <li key={s.text}>
                <StatementBadge type={s.statementType} />
                <span>
                  {s.text}
                  {s.sourceIds.length > 0 && (
                    <span className={styles.cite}>
                      {' '}
                      ({s.sourceIds.map((sid) => `${sources.get(sid)?.title ?? sid}, ${sources.get(sid)?.version ?? ''}`).join('; ')})
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
          <div className={styles.conditions}>
            <div>
              <h3>Fits when</h3>
              <ul>
                {dive.sources.fitsWhen.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Adapt when</h3>
              <ul>
                {dive.sources.adaptWhen.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className={styles.sourcesLink}>
            Full source details: <Link href="/sources/">Sources</Link> (in preparation) · statement types:{' '}
            {Object.values(statementTypeLabels).join(', ')}.
          </p>
        </Section>
      )}

      <footer className={styles.footer}>
        {dive.example && (
          <p>
            In the end-to-end example: station {dive.example.station.slice(1)} – {dive.example.label} (follows in increment I4).
          </p>
        )}
        <p>
          <Link href="/big-picture/">Back to the big picture</Link> · <Link href="/capabilities/">All capabilities</Link>
        </p>
      </footer>
    </article>
  )
}
