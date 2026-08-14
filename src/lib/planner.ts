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

export function scaleNutrition(nutrition: Nutrition, factor: number): Nutrition {
  const scaled = zeroNutrition()
  for (const key of Object.keys(scaled) as (keyof Nutrition)[]) scaled[key] = nutrition[key] * factor
  return scaled
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

function withoutIds(pool: Recipe[], ids: Set<string>): Recipe[] {
  if (!ids.size) return pool
  const filtered = pool.filter((recipe) => !ids.has(recipe.id))
  return filtered.length ? filtered : pool
}

const slotShare: Record<MealSlot, number> = { breakfast: 0.27, lunch: 0.36, dinner: 0.37 }

function scoreRecipe(recipe: Recipe, goal: Goal, selectedCuisine?: string, targetKcal = goalProfiles[goal].targetKcal): number {
  let score = 0
  if (selectedCuisine && recipe.cuisineId === selectedCuisine) score += 120
  const proteinPer100 = recipe.nutrition.protein / recipe.nutrition.kcal * 100
  if (goal === 'fatLoss') score += proteinPer100 * 3 + recipe.nutrition.fiber - recipe.nutrition.fat * 0.25
  if (goal === 'muscleGain') score += recipe.nutrition.protein * 0.9 + recipe.nutrition.kcal * 0.015
  if (goal === 'balanced') score += recipe.nutrition.fiber + recipe.nutrition.protein * 0.3 - Math.abs(recipe.nutrition.kcal - 580) * 0.01
  score -= Math.abs(recipe.nutrition.kcal - targetKcal * slotShare[recipe.slot]) * 0.08
  return score
}

export function candidatesFor(slot: MealSlot, cuisineId?: string): Recipe[] {
  const slotRecipes = recipes.filter((recipe) => recipe.slot === slot)
  if (!cuisineId) return slotRecipes
  const exact = slotRecipes.filter((recipe) => recipe.cuisineId === cuisineId)
  return exact.length ? exact : slotRecipes
}

export function pickRecipe(
  slot: MealSlot,
  goal: Goal,
  seed: string,
  cuisineId?: string,
  excludeId?: string,
  targetKcal = goalProfiles[goal].targetKcal,
  avoidIds: Iterable<string> = [],
): Recipe {
  const hardExclude = new Set(excludeId ? [excludeId] : [])
  const preferred = candidatesFor(slot, cuisineId).filter((recipe) => !hardExclude.has(recipe.id))
  // A one-recipe cuisine must widen to the whole meal slot before repeating itself.
  const slotFallback = candidatesFor(slot).filter((recipe) => !hardExclude.has(recipe.id))
  const eligible = preferred.length ? preferred : slotFallback
  const pool = withoutIds(eligible.length ? eligible : candidatesFor(slot), new Set(avoidIds))
  const ranked = [...pool].sort((a, b) => scoreRecipe(b, goal, cuisineId, targetKcal) - scoreRecipe(a, goal, cuisineId, targetKcal))
  const shortlistSize = Math.min(ranked.length, Math.max(8, Math.ceil(ranked.length * 0.35)))
  const shortlist = ranked.slice(0, shortlistSize)
  return shortlist[seededIndex(seed, shortlist.length)]
}

export function generatePlan(
  goal: Goal,
  seed: string,
  cuisineBySlot: Partial<Record<MealSlot, string>> = {},
  targetKcal = goalProfiles[goal].targetKcal,
  avoidIds: Iterable<string> = [],
): Plan {
  const avoided = new Set(avoidIds)
  const pools = slots.map((slot) => withoutIds(candidatesFor(slot, cuisineBySlot[slot]), avoided))
  const combinations = pools[0].flatMap((breakfast) => pools[1].flatMap((lunch) => pools[2].map((dinner) => ({ breakfast, lunch, dinner }))))
  const ranked = combinations.map((combo) => {
    const kcal = combo.breakfast.nutrition.kcal + combo.lunch.nutrition.kcal + combo.dinner.nutrition.kcal
    const protein = combo.breakfast.nutrition.protein + combo.lunch.nutrition.protein + combo.dinner.nutrition.protein
    const fiber = combo.breakfast.nutrition.fiber + combo.lunch.nutrition.fiber + combo.dinner.nutrition.fiber
    const sodium = combo.breakfast.nutrition.sodium + combo.lunch.nutrition.sodium + combo.dinner.nutrition.sodium
    const cuisineBonus = new Set([combo.breakfast.cuisineId, combo.lunch.cuisineId, combo.dinner.cuisineId]).size * 8
    const score = -Math.abs(kcal - targetKcal) * 0.22 - Math.max(0, goalProfiles[goal].targetProtein - protein) * 1.4 + Math.min(fiber, 32) * 0.45 - Math.max(0, sodium - 2000) * 0.025 + cuisineBonus
    return { combo, score }
  }).sort((a, b) => b.score - a.score)
  const shortlist = ranked.slice(0, Math.min(24, ranked.length))
  const chosen = shortlist[seededIndex(`${seed}:${targetKcal}`, shortlist.length)].combo
  return { breakfast: chosen.breakfast.id, lunch: chosen.lunch.id, dinner: chosen.dinner.id }
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
