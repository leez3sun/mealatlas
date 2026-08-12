import { recipes, recipeById } from '../data/recipes'
import type { Goal, GoalProfile, MealSlot, Nutrition, Plan, Recipe } from '../types'

export const goalProfiles: Record<Goal, GoalProfile> = {
  balanced: { id: 'balanced', name: '均衡饮食', targetKcal: 1800, targetProtein: 95, description: '菜系多样，全天不过度偏科' },
  fatLoss: { id: 'fatLoss', name: '减脂期', targetKcal: 1500, targetProtein: 110, description: '控制能量，优先蛋白质与纤维' },
  muscleGain: { id: 'muscleGain', name: '健身增肌', targetKcal: 2200, targetProtein: 145, description: '提高能量与优质蛋白密度' },
}

export const slots: MealSlot[] = ['breakfast', 'lunch', 'dinner']
export const slotNames: Record<MealSlot, string> = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐' }

const zeroNutrition = (): Nutrition => ({ kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, water: 0, sodium: 0, calcium: 0, iron: 0, vitaminA: 0, vitaminC: 0 })

export function nutritionFor(recipe: Recipe, modified = false): Nutrition {
  return modified ? recipe.modification.nutrition : recipe.nutrition
}

export function aggregateNutrition(plan: Plan, modified: Set<string>): Nutrition {
  return slots.reduce((total, slot) => {
    const recipe = recipeById.get(plan[slot])
    if (!recipe) return total
    const source = nutritionFor(recipe, modified.has(recipe.id))
    for (const key of Object.keys(total) as (keyof Nutrition)[]) total[key] += source[key]
    return total
  }, zeroNutrition())
}

function hashSeed(input: string): number {
  let hash = 2166136261
  for (let i = 0; i < input.length; i += 1) hash = Math.imul(hash ^ input.charCodeAt(i), 16777619)
  return hash >>> 0
}

function seededIndex(seed: string, length: number): number {
  if (!length) return 0
  let x = hashSeed(seed)
  x ^= x << 13; x ^= x >>> 17; x ^= x << 5
  return Math.abs(x) % length
}

function scoreRecipe(recipe: Recipe, goal: Goal, selectedCuisine?: string): number {
  let score = 0
  if (selectedCuisine && recipe.cuisineId === selectedCuisine) score += 120
  const proteinPer100 = recipe.nutrition.protein / recipe.nutrition.kcal * 100
  if (goal === 'fatLoss') score += proteinPer100 * 3 + recipe.nutrition.fiber - recipe.nutrition.fat * 0.25
  if (goal === 'muscleGain') score += recipe.nutrition.protein * 0.9 + recipe.nutrition.kcal * 0.015
  if (goal === 'balanced') score += recipe.nutrition.fiber + recipe.nutrition.protein * 0.3 - Math.abs(recipe.nutrition.kcal - 580) * 0.01
  return score
}

export function candidatesFor(slot: MealSlot, cuisineId?: string): Recipe[] {
  const slotRecipes = recipes.filter((recipe) => recipe.slot === slot)
  if (!cuisineId) return slotRecipes
  const exact = slotRecipes.filter((recipe) => recipe.cuisineId === cuisineId)
  return exact.length ? exact : slotRecipes
}

export function pickRecipe(slot: MealSlot, goal: Goal, seed: string, cuisineId?: string, excludeId?: string): Recipe {
  const candidates = candidatesFor(slot, cuisineId).filter((recipe) => recipe.id !== excludeId)
  const pool = candidates.length ? candidates : candidatesFor(slot, cuisineId)
  const ranked = [...pool].sort((a, b) => scoreRecipe(b, goal, cuisineId) - scoreRecipe(a, goal, cuisineId))
  const shortlist = ranked.slice(0, Math.min(3, ranked.length))
  return shortlist[seededIndex(seed, shortlist.length)]
}

export function generatePlan(goal: Goal, seed: string, cuisineBySlot: Partial<Record<MealSlot, string>> = {}): Plan {
  return {
    breakfast: pickRecipe('breakfast', goal, `${seed}:breakfast`, cuisineBySlot.breakfast).id,
    lunch: pickRecipe('lunch', goal, `${seed}:lunch`, cuisineBySlot.lunch).id,
    dinner: pickRecipe('dinner', goal, `${seed}:dinner`, cuisineBySlot.dinner).id,
  }
}

export function completion(total: Nutrition, goal: Goal, targetKcal?: number) {
  const profile = goalProfiles[goal]
  const kcalTarget = targetKcal ?? profile.targetKcal
  return {
    kcal: Math.round(total.kcal / kcalTarget * 100),
    protein: Math.round(total.protein / profile.targetProtein * 100),
    fiber: Math.round(total.fiber / 25 * 100),
    water: Math.round(total.water / 1700 * 100),
    sodium: Math.round(total.sodium / 2000 * 100),
  }
}
