// Wipe the isolated e2e database/uploads so every run starts from a fresh seed.
import fs from 'node:fs'
import path from 'node:path'

const dir = path.resolve('e2e/.data')
fs.rmSync(dir, { recursive: true, force: true })
fs.mkdirSync(path.resolve('e2e/screenshots'), { recursive: true })
console.log(`[e2e] reset ${dir}`)
