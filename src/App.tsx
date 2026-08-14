import { useMemo, useRef, useState } from 'react'
import CuisineExplorer from './components/CuisineExplorer'
import Icon from './components/Icon'
import MealCard from './components/MealCard'
import NutritionGauge from './components/NutritionGauge'
import RecipeDrawer from './components/RecipeDrawer'
import { recipeById } from './data/recipes'
import { aggregateNutrition, generatePlan, goalProfiles, pickRecipe, scaleNutrition, slots } from './lib/planner'
import type { Cuisine, Goal, MealSlot, Plan, Recipe } from './types'

const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
const dateSeed = tomorrow.toISOString().slice(0, 10)
const displayDate = new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' }).format(tomorrow)

function App() {
  const [goal, setGoal] = useState<Goal>('balanced')
  const [targetKcal, setTargetKcal] = useState(goalProfiles.balanced.targetKcal)
  const [cuisineBySlot, setCuisineBySlot] = useState<Partial<Record<MealSlot, string>>>({})
  const [plan, setPlan] = useState<Plan>(() => generatePlan('balanced', dateSeed))
  const [modified, setModified] = useState<Set<string>>(new Set())
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const actionCount = useRef(0)
  const recentRecipeIds = useRef<string[]>(Object.values(plan))
  const [toast, setToast] = useState<string | null>(null)
  const baseTotal = useMemo(() => aggregateNutrition(plan, modified), [plan, modified])
  const portionScale = targetKcal / baseTotal.kcal
  const total = useMemo(() => scaleNutrition(baseTotal, portionScale), [baseTotal, portionScale])

  const nextSeed = (label: string) => {
    actionCount.current += 1
    const entropy = new Uint32Array(1)
    window.crypto.getRandomValues(entropy)
    return `${dateSeed}:${label}:${actionCount.current}:${entropy[0]}`
  }

  const rememberPlan = (nextPlan: Plan) => {
    recentRecipeIds.current = [...Object.values(nextPlan), ...recentRecipeIds.current]
      .filter((id, index, ids) => ids.indexOf(id) === index)
      .slice(0, 18)
  }

  const makeFreshPlan = (nextGoal: Goal, label: string, nextCuisines: Partial<Record<MealSlot, string>>, nextTarget: number, currentPlan: Plan) => {
    const nextPlan = generatePlan(nextGoal, nextSeed(label), nextCuisines, nextTarget, [...Object.values(currentPlan), ...recentRecipeIds.current])
    rememberPlan(nextPlan)
    return nextPlan
  }

  const changeGoal = (next: Goal) => {
    setGoal(next)
    setTargetKcal(goalProfiles[next].targetKcal)
    setPlan((current) => makeFreshPlan(next, `goal:${next}`, cuisineBySlot, goalProfiles[next].targetKcal, current))
    setModified(new Set())
  }

  const regenerate = () => {
    setPlan((current) => makeFreshPlan(goal, 'full', cuisineBySlot, targetKcal, current))
    setModified(new Set())
    showToast('已重新调好明日三餐')
  }

  const reroll = (slot: MealSlot) => {
    const current = plan[slot]
    const next = pickRecipe(slot, goal, nextSeed(`reroll:${slot}`), cuisineBySlot[slot], current, targetKcal, recentRecipeIds.current)
    if (cuisineBySlot[slot] && next.cuisineId !== cuisineBySlot[slot]) {
      setCuisineBySlot((value) => { const copy = { ...value }; delete copy[slot]; return copy })
    }
    setPlan((value) => {
      const nextPlan = { ...value, [slot]: next.id }
      rememberPlan(nextPlan)
      return nextPlan
    })
    setModified((value) => { const copy = new Set(value); copy.delete(current); return copy })
  }

  const updateCuisine = (slot: MealSlot, cuisineId?: string) => {
    const nextCuisine = { ...cuisineBySlot, [slot]: cuisineId }
    if (!cuisineId) delete nextCuisine[slot]
    setCuisineBySlot(nextCuisine)
    const recipe = pickRecipe(slot, goal, nextSeed(`cuisine:${slot}:${cuisineId ?? 'all'}`), cuisineId, undefined, targetKcal, recentRecipeIds.current)
    setPlan((value) => {
      const nextPlan = { ...value, [slot]: recipe.id }
      rememberPlan(nextPlan)
      return nextPlan
    })
  }

  const toggleModified = (id: string) => setModified((value) => {
    const next = new Set(value)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const toggleFavorite = (id: string) => setFavorites((value) => {
    const next = new Set(value)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2600)
  }

  const previewCuisine = (cuisine: Cuisine) => {
    const recipe = [...recipeById.values()].find((item) => item.cuisineId === cuisine.id)
    if (recipe) setSelectedRecipe(recipe)
  }

  const changeTargetKcal = (nextTarget: number) => {
    setTargetKcal(nextTarget)
    setPlan((current) => makeFreshPlan(goal, `target:${nextTarget}`, cuisineBySlot, nextTarget, current))
    setModified(new Set())
    showToast(`已按 ${nextTarget} kcal 重新搭配三餐`)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="味衡首页"><span>味</span><div><b>MEALATLAS</b><small>食谱与营养终端</small></div></a>
        <nav><a href="#plan">明日配餐</a><a href="#cuisines">菜系索引</a><a href="#method">数据方法</a></nav>
        <a className="github-link" href="https://github.com/" target="_blank" rel="noreferrer">GitHub <Icon name="arrow" size={16} /></a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero__copy">
            <span className="hero__overline">TOMORROW'S TABLE · {displayDate}</span>
            <h1>明天，<br />吃得<span>刚刚好。</span></h1>
            <p>从中国地方风味到世界经典，把“想吃的”与“身体需要的”放进同一张餐桌。</p>
            <div className="hero__actions">
              <button className="button button--sun button--large" onClick={regenerate}><Icon name="shuffle" /> 摇一摇明日菜单</button>
              <a href="#plan">看看今天怎么配 <Icon name="arrow" size={18} /></a>
            </div>
            <div className="hero__proof"><span><b>43</b> 中国菜系索引</span><span><b>11</b> 微量营养字段</span><span><b>100%</b> 改良可解释</span></div>
          </div>
          <div className="hero__visual">
            <img src="./images/meal-contact-sheet.webp" alt="六道自然光食物摄影组成的明日菜单" />
            <div className="hero__ticket hero__ticket--top"><span>今日灵感</span><b>湘味剁椒蒸鱼</b><small>清蒸 · 高蛋白 · 可控钠</small></div>
            <div className="hero__ticket hero__ticket--bottom"><span>全天计划</span><b>{Math.round(total.kcal)} <small>kcal</small></b><i>按你的目标实时重算</i></div>
          </div>
        </section>

        <section className="planner" id="plan">
          <div className="planner__header">
            <div><span className="section-label">DAILY MIXER / 一日三餐调音台</span><h2>{displayDate}，三餐已经就位。</h2><p>换一道只影响当前餐；改良配方后，全天营养会立即重算。</p></div>
            <div className="goal-switcher">
              {(Object.keys(goalProfiles) as Goal[]).map((item) => <button className={goal === item ? 'is-active' : ''} onClick={() => changeGoal(item)} key={item}><b>{goalProfiles[item].name}</b><small>{goalProfiles[item].description}</small></button>)}
            </div>
          </div>

          <div className="target-strip">
            <div><span>每日能量目标</span><b>{targetKcal} kcal</b></div>
            <input aria-label="每日能量目标" type="range" min="1300" max="2600" step="50" value={targetKcal} onInput={(event) => changeTargetKcal(Number(event.currentTarget.value))} />
            <div className="target-controls"><button aria-label="每日能量目标减少 50 千卡" onClick={() => changeTargetKcal(Math.max(1300, targetKcal - 50))}>−</button><button aria-label="每日能量目标增加 50 千卡" onClick={() => changeTargetKcal(Math.min(2600, targetKcal + 50))}>＋</button></div>
            <span>可按个人需求调整 · 非医疗处方</span>
          </div>

          <div className="meal-grid">
            {slots.map((slot) => {
              const recipe = recipeById.get(plan[slot])!
              return <MealCard key={slot} recipe={recipe} portionScale={portionScale} modified={modified.has(recipe.id)} favorite={favorites.has(recipe.id)} selectedCuisine={cuisineBySlot[slot]} onCuisineChange={(value) => updateCuisine(slot, value)} onReroll={() => reroll(slot)} onModify={() => toggleModified(recipe.id)} onFavorite={() => toggleFavorite(recipe.id)} onOpen={() => setSelectedRecipe(recipe)} />
            })}
          </div>

          <section className="day-summary">
            <div className="day-summary__copy"><span className="section-label section-label--light">DAY TOTAL / 全天汇总</span><h2>不是卡路里及格，<br />是整天都更均衡。</h2><p>水字段是食材本身估算含水，不等于全天饮水量；钠接近或超过参考上限时会单独提醒。</p><button className="text-button" onClick={() => document.getElementById('method')?.scrollIntoView({ behavior: 'smooth' })}>查看计算口径 <Icon name="arrow" size={17} /></button></div>
            <NutritionGauge nutrition={total} goal={goal} targetKcal={targetKcal} />
            <div className="micro-panel">
              <h3>微量营养快照</h3>
              <div><span>钙</span><b>{Math.round(total.calcium)} mg</b><i style={{ width: `${Math.min(total.calcium / 800 * 100, 100)}%` }} /></div>
              <div><span>铁</span><b>{Math.round(total.iron * 10) / 10} mg</b><i style={{ width: `${Math.min(total.iron / 15 * 100, 100)}%` }} /></div>
              <div><span>维生素 A</span><b>{Math.round(total.vitaminA)} μg</b><i style={{ width: `${Math.min(total.vitaminA / 700 * 100, 100)}%` }} /></div>
              <div><span>维生素 C</span><b>{Math.round(total.vitaminC)} mg</b><i style={{ width: `${Math.min(total.vitaminC / 100 * 100, 100)}%` }} /></div>
              <small>参考目标仅用于界面演示，个体需求存在差异。</small>
            </div>
          </section>
        </section>

        <CuisineExplorer onPreview={previewCuisine} />

        <section className="method" id="method">
          <div className="section-intro"><div><span className="section-label">TRANSPARENCY / 数据透明</span><h2>每个数字，都应该说得清。</h2></div><p>我们把置信等级和改良差值放在界面里，而不是藏在免责声明深处。首版是可运行原型，不把估算值包装成权威检测。</p></div>
          <div className="method-steps">
            <article><span>01</span><h3>按克数汇总</h3><p>原料可食部 × 每 100 g 营养值，再按成品份数折算。</p></article>
            <article><span>02</span><h3>保留不确定性</h3><p>品牌、吸油率、烹调损耗都会改变结果，界面不使用伪精确小数。</p></article>
            <article><span>03</span><h3>改良可追踪</h3><p>少了几克油、换了多少主食、补了什么蛋白，每一步都能恢复。</p></article>
            <article><span>04</span><h3>生产版可替换</h3><p>数据层可接 USDA FoodData Central 与合规的中国食物成分来源。</p></article>
          </div>
          <div className="source-links"><a href="https://fdc.nal.usda.gov/api-guide/" target="_blank" rel="noreferrer">USDA FoodData Central <Icon name="arrow" size={17} /></a><a href="https://openfoodfacts.github.io/openfoodfacts-server/api/" target="_blank" rel="noreferrer">Open Food Facts API v3 <Icon name="arrow" size={17} /></a><a href="https://en.chinacdc.cn/health_topics/nutrition_health/202206/t20220616_259702.html" target="_blank" rel="noreferrer">中国居民膳食指南公开摘要 <Icon name="arrow" size={17} /></a></div>
        </section>
      </main>

      <footer><div className="brand brand--footer"><span>味</span><div><b>MEALATLAS</b><small>吃想吃的，也懂自己吃了什么。</small></div></div><p>Open-source prototype · MIT License · Nutrition is estimated, not medical advice.</p><a href="#top">回到顶部 ↑</a></footer>

      <RecipeDrawer recipe={selectedRecipe} portionScale={portionScale} modified={selectedRecipe ? modified.has(selectedRecipe.id) : false} onClose={() => setSelectedRecipe(null)} onModify={() => selectedRecipe && toggleModified(selectedRecipe.id)} />
      {toast && <div className="toast" role="status"><Icon name="check" size={18} />{toast}</div>}
    </div>
  )
}

export default App
