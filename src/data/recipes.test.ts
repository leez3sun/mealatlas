import { describe, expect, it } from 'vitest'
import { cuisines } from './cuisines'
import { recipes } from './recipes'

describe('recipe image integrity', () => {
  it('binds every recipe to a unique image named after its id', () => {
    const paths = recipes.map((recipe) => recipe.image)

    expect(new Set(paths).size).toBe(recipes.length)
    for (const recipe of recipes) {
      expect(recipe.image).toBe(`./images/${recipe.id}.webp`)
    }
  })

  it('provides at least one complete in-app recipe for every cuisine', () => {
    const cuisineIds = new Set(recipes.map((recipe) => recipe.cuisineId))

    expect(cuisines).toHaveLength(71)
    for (const cuisine of cuisines) {
      expect(cuisine.live, `${cuisine.name} should be live`).toBe(true)
      expect(cuisineIds.has(cuisine.id), `${cuisine.name} is missing a recipe`).toBe(true)
    }
  })

  it('keeps every recipe content-complete', () => {
    for (const recipe of recipes) {
      expect(recipe.ingredients.length, `${recipe.name} ingredients`).toBeGreaterThanOrEqual(5)
      expect(recipe.steps.length, `${recipe.name} steps`).toBeGreaterThanOrEqual(3)
      expect(recipe.tutorials.length, `${recipe.name} tutorials`).toBeGreaterThanOrEqual(2)
      expect(recipe.modification.changes.length, `${recipe.name} modification`).toBeGreaterThanOrEqual(3)
      expect(recipe.nutrition.kcal, `${recipe.name} kcal`).toBeGreaterThan(0)
      expect(recipe.nutrition.protein, `${recipe.name} protein`).toBeGreaterThan(0)
    }
  })
})
