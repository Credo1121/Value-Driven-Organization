// Pure geometry for the cycle overview (concept C). Independent of React so it can be tested.

export const ORBIT = { size: 640, c: 320, core: 78, rings: [282, 212, 142] as const } as const
// rings: outer edge of enterprise, portfolio, delivery; delivery's inner edge is the core.

export type Point = readonly [number, number]

export function polar(r: number, angle: number, c: number = ORBIT.c): Point {
  return [c + r * Math.cos(angle), c + r * Math.sin(angle)]
}

// Phase i of n occupies a segment; phase 0 is centred at the top, moving clockwise.
export function segmentAngles(i: number, n: number, gap = 0.014): { a1: number; a2: number; mid: number } {
  const seg = (2 * Math.PI) / n
  const start = -Math.PI / 2 - seg / 2
  const a1 = start + i * seg + gap
  const a2 = start + (i + 1) * seg - gap
  return { a1, a2, mid: (a1 + a2) / 2 }
}

const f = (n: number) => Math.round(n * 100) / 100

export function ringSegmentPath(rInner: number, rOuter: number, a1: number, a2: number): string {
  const [x1, y1] = polar(rOuter, a1)
  const [x2, y2] = polar(rOuter, a2)
  const [x3, y3] = polar(rInner, a2)
  const [x4, y4] = polar(rInner, a1)
  const large = a2 - a1 > Math.PI ? 1 : 0
  return `M${f(x1)},${f(y1)} A${rOuter},${rOuter} 0 ${large} 1 ${f(x2)},${f(y2)} L${f(x3)},${f(y3)} A${rInner},${rInner} 0 ${large} 0 ${f(x4)},${f(y4)} Z`
}

// Splits a title into at most `maxLines` lines of roughly `width` characters.
export function wrapLabel(text: string, width: number, maxLines = 3): string[] {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word
    if (next.length > width && line) {
      lines.push(line)
      line = word
    } else line = next
  }
  if (line) lines.push(line)
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines)
    kept[maxLines - 1] = `${kept[maxLines - 1]}…`
    return kept
  }
  return lines
}
