import { describe, expect, it } from 'vitest'
import { aggregateNutrition, candidatesFor, generatePlan, pickRecipe } from './planner'

describe('meal planner', () => {
  it('is deterministic for the same seed', () => {
    expect(generatePlan('balanced', '2026-08-12')).toEqual(generatePlan('balanced', '2026-08-12'))
  })

  it('rebuilds the plan around the selected daily calorie target', () => {
    const low = generatePlan('balanced', 'same-day', {}, 1300)
    const high = generatePlan('balanced', 'same-day', {}, 2600)
    expect(low).not.toEqual(high)
    expect(aggregateNutrition(high, new Set()).kcal).toBeGreaterThan(aggregateNutrition(low, new Set()).kcal)
  })

  it('respects an available cuisine for the selected meal slot', () => {
    expect(pickRecipe('lunch', 'balanced', 'x', 'thai').cuisineId).toBe('thai')
  })

  it('never returns the current recipe when rerolling a one-recipe cuisine', () => {
    const current = candidatesFor('lunch', 'thai')[0]
    const next = pickRecipe('lunch', 'balanced', 'reroll', 'thai', current.id)
    expect(next.id).not.toBe(current.id)
  })

  it('can hard-avoid every recipe in the current plan', () => {
    const current = generatePlan('balanced', 'before')
    const next = generatePlan('balanced', 'after', {}, 1800, Object.values(current))
    expect(Object.values(next).every((id) => !Object.values(current).includes(id))).toBe(true)
  })

  it('offers a broad breakfast pool for repeated daily plans', () => {
    expect(candidatesFor('breakfast').length).toBeGreaterThanOrEqual(10)
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
