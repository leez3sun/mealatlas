import { cuisines } from '../data/cuisines'
import { recipes } from '../data/recipes'
import { nutritionFor, slotNames } from '../lib/planner'
import type { MealSlot, Recipe } from '../types'
import Icon from './Icon'

interface Props {
  recipe: Recipe
  modified: boolean
  favorite: boolean
  selectedCuisine?: string
  onCuisineChange: (value?: string) => void
  onReroll: () => void
  onModify: () => void
  onFavorite: () => void
  onOpen: () => void
}

export default function MealCard({ recipe, modified, favorite, selectedCuisine, onCuisineChange, onReroll, onModify, onFavorite, onOpen }: Props) {
  const n = nutritionFor(recipe, modified)
  const original = recipe.nutrition
  const availableCuisineIds = new Set(recipes.filter((item) => item.slot === recipe.slot).map((item) => item.cuisineId))
  const available = cuisines.filter((item) => availableCuisineIds.has(item.id))

  return (
    <article className={`meal-card ${modified ? 'meal-card--modified' : ''}`}>
      <div className="meal-card__photo" onClick={onOpen} role="button" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && onOpen()}>
        <img src={recipe.image} alt={`${recipe.name}的自然光成品图`} />
        <div className="meal-card__photo-top">
          <span>{slotNames[recipe.slot]}</span>
          <button className={`icon-button ${favorite ? 'is-active' : ''}`} onClick={(event) => { event.stopPropagation(); onFavorite() }} aria-label={favorite ? '取消收藏' : '收藏食谱'}>
            <Icon name="heart" size={18} />
          </button>
        </div>
        {modified && <div className="modified-stamp"><Icon name="check" size={14} /> 已应用减脂改良</div>}
      </div>
      <div className="meal-card__body">
        <div className="meal-card__eyebrow">
          <span>{recipe.cuisine}</span><span>·</span><span>{recipe.difficulty}</span>
        </div>
        <button className="meal-card__title" onClick={onOpen}>{recipe.name}</button>
        <p>{recipe.subtitle}</p>
        <div className="meal-card__stats">
          <span><Icon name="flame" size={17} /><b>{Math.round(n.kcal)}</b> kcal</span>
          <span><Icon name="protein" size={17} /><b>{Math.round(n.protein)}</b> g 蛋白</span>
          <span><Icon name="clock" size={17} /><b>{recipe.minutes}</b> 分钟</span>
        </div>
        {modified && (
          <div className="delta-line">
            <span>较原版</span>
            <b>{Math.round(n.kcal - original.kcal)} kcal</b>
            <b>{Math.round(n.fat - original.fat)} g 脂肪</b>
            <b>{Math.round(n.sodium - original.sodium)} mg 钠</b>
          </div>
        )}
        <div className="meal-card__tags">{recipe.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <label className="cuisine-select">
          <span>这餐想吃</span>
          <select value={selectedCuisine ?? ''} onChange={(event) => onCuisineChange(event.target.value || undefined)}>
            <option value="">智能匹配菜系</option>
            {available.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
          </select>
        </label>
        <div className="meal-card__actions">
          <button className="button button--soft" onClick={onReroll}><Icon name="shuffle" size={17} /> 换一道</button>
          <button className={`button ${modified ? 'button--dark' : 'button--accent'}`} onClick={onModify}><Icon name="spark" size={17} /> {modified ? '恢复原版' : '减脂改良'}</button>
        </div>
      </div>
    </article>
  )
}

export function slotCuisineOptions(slot: MealSlot) {
  const ids = new Set(recipes.filter((item) => item.slot === slot).map((item) => item.cuisineId))
  return cuisines.filter((item) => ids.has(item.id))
}
