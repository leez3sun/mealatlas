import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const recipes = readFileSync(join(root, 'src/data/recipes.ts'), 'utf8')
const catalog = readFileSync(join(root, 'src/data/catalogRecipes.ts'), 'utf8')
const featured = [...recipes.matchAll(/image:\s*'\.\/images\/([^']+\.webp)'/g)].map((match) => match[1])
const catalogImages = [...catalog.matchAll(/cuisineId:\s*'([^']+)'/g)].map((match) => `catalog-${match[1]}.webp`)
const names = [...featured, ...catalogImages]

if (names.length !== 72) throw new Error(`expected 72 recipe images, found ${names.length}`)
if (new Set(names).size !== names.length) throw new Error('two recipes share one image path')

const hashes = new Map()
for (const name of names) {
  const data = readFileSync(join(root, 'public/images', name))
  if (data.length < 25_000) throw new Error(`image is unexpectedly small: ${name}`)
  const digest = createHash('sha256').update(data).digest('hex')
  if (hashes.has(digest)) throw new Error(`exact duplicate images: ${hashes.get(digest)} / ${name}`)
  hashes.set(digest, name)
}

console.log(`audited ${names.length} unique recipe image paths and SHA-256 hashes`)
