import { useMemo, useState } from 'react'
import { cuisines } from '../data/cuisines'
import type { Cuisine } from '../types'
import Icon from './Icon'

interface Props {
  onPreview: (cuisine: Cuisine) => void
}

export default function CuisineExplorer({ onPreview }: Props) {
  const [region, setRegion] = useState<'china' | 'world'>('china')
  const [group, setGroup] = useState('全部')
  const filtered = useMemo(() => cuisines.filter((item) => item.region === region && (group === '全部' || item.group === group)), [region, group])
  const groups = useMemo(() => ['全部', ...new Set(cuisines.filter((item) => item.region === region).map((item) => item.group))], [region])

  return (
    <section className="cuisine-explorer" id="cuisines">
      <div className="section-intro">
        <div><span className="section-label">CUISINE INDEX / 菜系索引</span><h2>从八大菜系，到世界餐桌。</h2></div>
        <p>中国区按“八大菜系 + 省级地域 + 重要跨地域传统”建立完整索引。<i /> 每个菜系都已补齐站内克重、步骤、营养估算、减脂改良与教程入口。</p>
      </div>
      <div className="cuisine-tabs" role="tablist">
        <button className={region === 'china' ? 'is-active' : ''} onClick={() => { setRegion('china'); setGroup('全部') }}>中国菜系 <b>{cuisines.filter((item) => item.region === 'china').length}</b></button>
        <button className={region === 'world' ? 'is-active' : ''} onClick={() => { setRegion('world'); setGroup('全部') }}>世界经典 <b>{cuisines.filter((item) => item.region === 'world').length}</b></button>
      </div>
      <div className="group-rail">{groups.map((item) => <button className={group === item ? 'is-active' : ''} onClick={() => setGroup(item)} key={item}>{item}</button>)}</div>
      <div className="cuisine-cloud">
        {filtered.map((item) => (
          <button className={item.live ? 'is-live' : 'is-sourced'} onClick={() => onPreview(item)} key={item.id}>
            <span>{item.name}{item.live && <i title="已有完整站内食谱" />}</span>
            <small>{item.representative}</small>
            <Icon name="arrow" size={17} />
          </button>
        ))}
      </div>
      <div className="coverage-note"><Icon name="info" size={18} /><span><b>71 个菜系条目已全部可用：</b>每个圆点条目都能打开完整站内菜谱，并可继续查看限定食谱网站、视频与社区实拍检索。营养为按一人份克重估算，不作为医疗处方。</span></div>
    </section>
  )
}
