import { describe, expect, it } from 'vitest'
import { aggregateNutrition, candidatesFor, generatePlan, pickRecipe } from './planner'

describe('meal planner', () => {
  it('is deterministic for the same seed', () => {
    expect(generatePlan('balanced', '2026-08-12')).toEqual(generatePlan('balanced', '2026-08-12'))
  })

  it('respects an available cuisine for the selected meal slot', () => {
    expect(pickRecipe('lunch', 'balanced', 'x', 'thai').cuisineId).toBe('thai')
  })

  it('falls back safely when a catalog-only cuisine has no recipe', () => {
    expect(candidatesFor('dinner', 'lu').length).toBeGreaterThan(0)
  })

  it('uses modified nutrition only for modified recipes', () => {
    const plan = { breakfast: 'oat-congee', lunch: 'sichuan-chicken', dinner: 'hunan-fish' } as const
    const original = aggregateNutrition(plan, new Set())
    const modified = aggregateNutrition(plan, new Set(['sichuan-chicken']))
    expect(modified.kcal).toBeLessThan(original.kcal)
    expect(modified.sodium).toBeLessThan(original.sodium)
  })
})
