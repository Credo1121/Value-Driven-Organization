import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// REQ-010 / REQ-009: tokens are the only place for colour values, and the documented
// foreground/background pairs meet WCAG 2.2 AA (docs/design/tokens.md).

const TOKENS_FILE = 'src/ui/tokens.css'
const tokensCss = readFileSync(TOKENS_FILE, 'utf8')

function token(name: string): string {
  const m = tokensCss.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`))
  if (!m) throw new Error(`token --${name} not found`)
  return m[1] as string
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r!) + 0.7152 * lin(g!) + 0.0722 * lin(b!)
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi! + 0.05) / (lo! + 0.05)
}

function filesUnder(dir: string): string[] {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? filesUnder(p) : [p]
  })
}

describe('design tokens (REQ-010)', () => {
  it('AC-010-1: no hard-coded colour values outside the token file', () => {
    const offenders = [...filesUnder('app'), ...filesUnder('src')]
      .filter((f) => /\.(tsx?|css)$/.test(f) && !f.endsWith('tokens.css'))
      .filter((f) => /#[0-9a-fA-F]{3,8}\b|rgba?\(/.test(readFileSync(f, 'utf8')))
    expect(offenders).toEqual([])
  })

  it('AC-010-4 / AC-009-2: text tokens reach 4.5:1 on both surfaces', () => {
    for (const fg of ['c-ink', 'c-grey-900', 'c-accent-text'])
      for (const bg of ['c-surface', 'c-surface-warm'])
        expect(contrast(token(fg), token(bg)), `${fg} on ${bg}`).toBeGreaterThanOrEqual(4.5)
  })

  it('AC-009-2: focus ring and line accent reach 3:1 (non-text contrast)', () => {
    for (const bg of ['c-surface', 'c-surface-warm'])
      expect(contrast(token('c-accent-strong'), token(bg))).toBeGreaterThanOrEqual(3)
  })

  it('AC-010-5: text on the primary orange uses dark ink (white would fail)', () => {
    expect(contrast(token('c-on-accent'), token('c-accent'))).toBeGreaterThanOrEqual(4.5)
    expect(contrast('#FFFFFF', token('c-accent'))).toBeLessThan(4.5)
  })

  it('AC-010-6: no font files are shipped', () => {
    const fonts = [...filesUnder('app'), ...filesUnder('src'), ...filesUnder('public')].filter((f) =>
      /\.(ttf|otf|woff2?)$/i.test(f),
    )
    expect(fonts).toEqual([])
  })
})
