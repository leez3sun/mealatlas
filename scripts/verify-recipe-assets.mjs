import { existsSync, readFileSync } from 'node:fs'

const featured = [...readFileSync('src/data/recipes.ts', 'utf8').matchAll(/(?:^|\s)id:\s*'([^']+)'/gm)].map((match) => match[1])
const catalog = [...readFileSync('src/data/catalogRecipes.ts', 'utf8').matchAll(/cuisineId:\s*'([^']+)'/g)].map((match) => `catalog-${match[1]}`)
const ids = [...featured, ...catalog]
const missing = ids.filter((id) => !existsSync(`public/images/${id}.webp`))

if (missing.length) {
  console.error(`Missing recipe images: ${missing.join(', ')}`)
  process.exit(1)
}

console.log(`verified ${ids.length} recipe image files`)
