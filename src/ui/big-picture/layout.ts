// Fixed coordinates for the big picture (REQ-003: "fixed coordinate set, no layout jumping").
// Units are SVG viewBox units; HTML nodes are positioned with the same numbers as percentages.

export const VIEW = { w: 1200, h: 740 } as const

export type Box = { x: number; y: number; w: number; h: number }
export type Point = readonly [number, number]

const W = 250
const H = 140

export const boxes: Record<string, Box> = {
  // Steering loop: top row left → right, bottom row right → left.
  c1: { x: 225, y: 50, w: W, h: H },
  c2: { x: 555, y: 50, w: W, h: H },
  c3: { x: 885, y: 50, w: W, h: H },
  c6: { x: 885, y: 580, w: W, h: H },
  c7: { x: 555, y: 580, w: W, h: H },
  c8: { x: 225, y: 580, w: W, h: H },
  // Cross-cutting information capabilities in the middle.
  c4: { x: 390, y: 315, w: W, h: H },
  c5: { x: 720, y: 315, w: W, h: H },
  // Adjacent environment: corporate finance processes.
  env: { x: 20, y: 315, w: 150, h: H },
}

const box = (id: string): Box => {
  const b = boxes[id]
  if (!b) throw new Error(`no layout box for ${id}`)
  return b
}
const top = (id: string, x: number): Point => [x, box(id).y]
const bottom = (id: string, x: number): Point => [x, box(id).y + box(id).h]
const left = (id: string, y: number): Point => [box(id).x, y]
const right = (id: string, y: number): Point => [box(id).x + box(id).w, y]

// Orthogonal routes per link id. Elbows run through the free corridors between nodes.
export const routes: Record<string, Point[]> = {
  l1: [right('c1', 115), left('c2', 115)],
  l2: [right('c2', 115), left('c3', 115)],
  l3: [bottom('c3', 1010), top('c6', 1010)],
  l4: [left('c6', 660), right('c7', 660)],
  l5: [left('c7', 660), right('c8', 660)],
  l6: [top('c8', 300), bottom('c1', 300)],
  l7: [right('c8', 615), [515, 615], [515, 512], [680, 512], bottom('c2', 680)],
  l8: [top('c4', 615), bottom('c2', 615)],
  l9: [bottom('c4', 432), top('c8', 432)],
  l10: [top('c7', 580), bottom('c4', 580)],
  l11: [top('c5', 928), bottom('c3', 928)],
  l12: [bottom('c5', 928), top('c6', 928)],
  l13: [top('c5', 790), [790, 248], [420, 248], bottom('c1', 420)],
  l14: [top('env', 95), [95, 22], [640, 22], top('c2', 640)],
  l15: [right('env', 380), left('c4', 380)],
}

export function pathFor(points: Point[]): string {
  return points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ')
}

export const pct = (v: number, of: number) => `${(v / of) * 100}%`

// Shortens the last segment so an end marker of `length` units sits between path end and node edge.
export function trimEnd(points: Point[], length: number): Point[] {
  if (points.length < 2) return points
  const [x1, y1] = points[points.length - 2] as Point
  const [x2, y2] = points[points.length - 1] as Point
  const dist = Math.hypot(x2 - x1, y2 - y1)
  if (dist <= length) return points
  const f = (dist - length) / dist
  return [...points.slice(0, -1), [x1 + (x2 - x1) * f, y1 + (y2 - y1) * f] as const]
}
