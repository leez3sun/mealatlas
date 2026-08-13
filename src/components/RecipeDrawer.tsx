import { useEffect } from 'react'
import { nutritionFor, scaleNutrition } from '../lib/planner'
import type { Recipe } from '../types'
import Icon from './Icon'

interface Props {
  recipe: Recipe | null
  portionScale: number
  modified: boolean
  onClose: () => void
  onModify: () => void
}

const nutrientLabels = [
  ['kcal', '能量', 'kcal'], ['protein', '蛋白质', 'g'], ['carbs', '碳水', 'g'], ['fat', '脂肪', 'g'], ['fiber', '膳食纤维', 'g'],
  ['water', '食物含水', 'ml'], ['sodium', '钠', 'mg'], ['calcium', '钙', 'mg'], ['iron', '铁', 'mg'], ['vitaminA', '维生素 A', 'μg RAE'], ['vitaminC', '维生素 C', 'mg'],
] as const

export default function RecipeDrawer({ recipe, portionScale, modified, onClose, onModify }: Props) {
  useEffect(() => {
    if (!recipe) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.classList.add('no-scroll')
    return () => { document.removeEventListener('keydown', onKey); document.body.classList.remove('no-scroll') }
  }, [recipe, onClose])

  if (!recipe) return null
  const n = scaleNutrition(nutritionFor(recipe, modified), portionScale)

  return (
    <div className="drawer-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="recipe-drawer" role="dialog" aria-modal="true" aria-label={`${recipe.name}食谱详情`}>
        <button className="drawer-close" onClick={onClose} aria-label="关闭详情"><Icon name="close" /></button>
        <img className="recipe-drawer__hero" src={recipe.image} alt={`${recipe.name}的菜谱封面或成品图`} />
        <div className="recipe-drawer__content">
          <div className="drawer-kicker"><span>{recipe.cuisine}</span><span>{recipe.minutes} 分钟</span><span>目标份量 × {portionScale.toFixed(2)}</span></div>
          <h2>{recipe.name}</h2>
          <p className="drawer-lead">{recipe.subtitle}</p>
          <div className={`confidence-note confidence-note--${recipe.confidence}`}>
            <Icon name="info" size={18} />
            <span><b>{recipe.confidence === 'estimated' ? '演示估算值' : '已核验数据'}</b>：按可食部克重汇总，实际值会受品牌、吸油率和烹调损耗影响。</span>
          </div>

          <section className="drawer-section">
            <div className="section-heading"><span>01</span><h3>准备食材</h3></div>
            <div className="ingredient-list">
              {recipe.ingredients.map((item) => <div key={item.name}><span>{item.name}{item.note && <small>{item.note}</small>}</span><b>{item.amount} × {portionScale.toFixed(2)}</b></div>)}
            </div>
          </section>

          <section className="drawer-section">
            <div className="section-heading"><span>02</span><h3>开始烹饪</h3></div>
            <ol className="step-list">{recipe.steps.map((step, index) => <li key={step}><b>{String(index + 1).padStart(2, '0')}</b><p>{step}</p></li>)}</ol>
          </section>

          <section className="drawer-section">
            <div className="section-heading"><span>03</span><h3>每份营养</h3></div>
            <div className="nutrient-grid">
              {nutrientLabels.map(([key, label, unit]) => <div key={key}><span>{label}</span><b>{Math.round(n[key] * 10) / 10}</b><small>{unit}</small></div>)}
            </div>
          </section>

          <section className="modification-panel">
            <div><span className="pill-kicker"><Icon name="spark" size={15} /> 可逆改良</span><h3>{recipe.modification.title}</h3><p>{recipe.modification.summary}</p></div>
            <ul>{recipe.modification.changes.map((change) => <li key={change}>{change}</li>)}</ul>
            <button className={`button ${modified ? 'button--soft' : 'button--accent'}`} onClick={onModify}>{modified ? '恢复原始配方' : '应用到今日菜单'}</button>
          </section>

          <section className="drawer-section tutorial-section">
            <div className="section-heading"><span>04</span><h3>继续学习</h3></div>
            <p>链接通往公开平台的检索结果，方便比较多个创作者；本项目不复制其教程内容。</p>
            <div>{recipe.tutorials.map((link) => <a href={link.url} target="_blank" rel="noreferrer" key={link.url}><Icon name={link.type === 'video' ? 'play' : 'book'} size={18} />{link.label}<Icon name="arrow" size={17} /></a>)}</div>
          </section>
        </div>
      </aside>
    </div>
  )
}
