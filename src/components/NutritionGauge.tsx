import type { Goal, Nutrition } from '../types'
import { completion, goalProfiles } from '../lib/planner'

interface Props {
  nutrition: Nutrition
  goal: Goal
  targetKcal: number
  compact?: boolean
}

export default function NutritionGauge({ nutrition, goal, targetKcal, compact = false }: Props) {
  const values = completion(nutrition, goal, targetKcal)
  const profile = goalProfiles[goal]
  const kcalPct = Math.min(values.kcal, 100)

  return (
    <section className={`nutrition-gauge ${compact ? 'nutrition-gauge--compact' : ''}`} aria-label="全天营养概览">
      <div className="nutrition-gauge__dial" style={{ '--progress': `${kcalPct * 3.6}deg` } as React.CSSProperties}>
        <div>
          <strong>{Math.round(nutrition.kcal)}</strong>
          <span>/ {targetKcal} kcal</span>
        </div>
      </div>
      <div className="nutrition-gauge__metrics">
        <Metric label="蛋白质" value={nutrition.protein} unit="g" percent={values.protein} target={profile.targetProtein} />
        <Metric label="膳食纤维" value={nutrition.fiber} unit="g" percent={values.fiber} target={25} />
        <Metric label="食物含水" value={nutrition.water} unit="ml" percent={values.water} target={1700} />
        <Metric label="钠" value={nutrition.sodium} unit="mg" percent={values.sodium} target={2000} reverse />
      </div>
    </section>
  )
}

function Metric({ label, value, unit, percent, target, reverse = false }: { label: string; value: number; unit: string; percent: number; target: number; reverse?: boolean }) {
  const state = reverse && percent > 100 ? 'over' : percent >= 80 ? 'good' : 'low'
  return (
    <div className="metric-row">
      <div className="metric-row__top"><span>{label}</span><b>{Math.round(value)} {unit}</b></div>
      <div className="metric-row__track"><i className={state} style={{ width: `${Math.min(percent, 100)}%` }} /></div>
      <small>{reverse ? `建议不高于 ${target} ${unit}` : `参考目标 ${target} ${unit}`}</small>
    </div>
  )
}
