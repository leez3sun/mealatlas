import { describe, expect, it } from 'vitest'
import { recipes } from './recipes'

describe('recipe image integrity', () => {
  it('binds every recipe to a unique image named after its id', () => {
    const paths = recipes.map((recipe) => recipe.image)

    expect(new Set(paths).size).toBe(recipes.length)
    for (const recipe of recipes) {
      expect(recipe.image).toBe(`./images/${recipe.id}.webp`)
    }
  })
})
