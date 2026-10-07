// Writes data.js from the real app content so the concept mockups use actual texts.
import { readFileSync, writeFileSync } from 'node:fs'
const bp = JSON.parse(readFileSync(new URL('../../../content/big-picture.json', import.meta.url)))
writeFileSync(new URL('./data.js', import.meta.url), `window.BP = ${JSON.stringify(bp)};\n`)
console.log('data.js written:', bp.cells.length, 'cells')
