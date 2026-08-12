export type MealSlot = 'breakfast' | 'lunch' | 'dinner'
export type Goal = 'balanced' | 'fatLoss' | 'muscleGain'

export interface Nutrition {
  kcal: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  water: number
  sodium: number
  calcium: number
  iron: number
  vitaminA: number
  vitaminC: number
}

export interface Ingredient {
  name: string
  amount: string
  note?: string
}

export interface RecipeModification {
  title: string
  summary: string
  changes: string[]
  nutrition: Nutrition
}

export interface TutorialLink {
  label: string
  url: string
  type: 'video' | 'article'
}

export interface Recipe {
  id: string
  name: string
  subtitle: string
  cuisineId: string
  cuisine: string
  region: 'china' | 'world'
  slot: MealSlot
  image: string
  minutes: number
  difficulty: '简单' | '适中'
  servings: number
  tags: string[]
  allergens: string[]
  ingredients: Ingredient[]
  steps: string[]
  nutrition: Nutrition
  modification: RecipeModification
  tutorials: TutorialLink[]
  confidence: 'estimated' | 'verified'
}

export interface Cuisine {
  id: string
  name: string
  group: string
  region: 'china' | 'world'
  representative: string
  live: boolean
}

export type Plan = Record<MealSlot, string>

export interface GoalProfile {
  id: Goal
  name: string
  targetKcal: number
  targetProtein: number
  description: string
}
