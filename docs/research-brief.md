# 研究简报（2026-08-11）

## 创意命题

大多数食谱产品让用户“继续浏览”，但用户真正需要的是尽快做出一个可信、可调整的决定。MealAtlas 把早午晚餐做成三轨“餐桌调音台”：先生成营养可解释的一天，再对单餐做可逆改良。

## 基准参考

| 参考 | 更新/状态（采集日） | 许可/可复现性 | 可借鉴点 |
|---|---|---|---|
| [RecipeSage](https://github.com/julianpoy/recipesage) | 活跃仓库，934 stars（2026-08-11） | 非商业 AGPL-3.0；可自托管 | PWA、离线搜索、营养和购物清单协同 |
| [Tandoor Recipes](https://github.com/TandoorRecipes/recipes) | 活跃社区（2026-08-11） | AGPLv3 + selling exception，许可边界需谨慎 | 食谱管理、计划、购物清单的完整信息结构 |
| [Mealie releases](https://github.com/mealie-recipes/mealie/releases) | v3.22.0，2026-07-28 发布 | 开源、可自托管；发布记录可复核 | 导入可靠性、持续发布、运维透明度 |
| [Vite 官方指南](https://vite.dev/guide/) | 2026-08-11 访问 | MIT；本地可复现 | React + TypeScript 的轻量构建基线 |
| [Vite GitHub Pages 指南](https://github.com/vitejs/vite/blob/main/docs/guide/static-deploy.md) | 2026-08-11 访问 | 官方一手文档 | Actions 构建与 Pages 部署 |
| [USDA FoodData Central API](https://fdc.nal.usda.gov/api-guide/) | 2026-08-11 访问 | 美国政府公开数据；需 API key | 基础食物与营养明细的生产级来源 |
| [Open Food Facts API v3](https://openfoodfacts.github.io/openfoodfacts-server/api/) | v3.6，2026-08-11 访问 | ODbL；众包数据无准确性保证 | 包装食品、过敏原、数据质量标识 |
| [中国疾控中心：居民膳食指南八项准则](https://en.chinacdc.cn/health_topics/nutrition_health/202206/t20220616_259702.html) | 2022-06-16 | 官方公开摘要 | 多样化、少盐少油、吃动平衡 |
| [WHO Healthy diet](https://www.who.int/en/news-room/fact-sheets/detail/healthy-diet) | 2026-08-11 访问 | 官方公共卫生资料 | 全谷物、蔬果、豆类与控制盐糖脂肪 |
| [Eat This Much](https://www.eatthismuch.com/food-diary-app) | 2026-08-11 访问 | 商业产品，不可复用代码 | “planner first”和目标驱动自动配餐 |
| [Meal planner UI — Dribbble](https://dribbble.com/shots/26978846-Nutrition-App-Design-Meal-Planner-Calorie-Tracking-App-UI-UX) | 2026-07，采集 2026-08-11 | 视觉参考，不复制资产 | 柔和健康色、宏量信息一眼可读 |
| [Recipe app design review — YouTube](https://www.youtube.com/watch?v=_HWHI50Rab8) | 2023-04-28 | 设计评论；未复用素材 | 从低保真、字型、颜色到可用性逐层评审 |
| [Meal planner case study — Behance](https://www.behance.net/gallery/188399125/Recipe-Meal-Planning-App-UIUX-Case-Study) | 2023 | 视觉参考，不复制资产 | 用用户流程而非单屏拼贴解释产品 |
| [Meal planning UI feedback — Reddit](https://www.reddit.com/r/UI_Design/comments/1qsek7z/any_feedback_on_my_mobile_ui_for_my_meal_planning/) | 2026，采集 2026-08-11 | 社区批评，观点不可当事实 | 命名相近的入口会造成“先计划/计划餐食”混淆 |
| [Food plan app postmortem — Reddit](https://www.reddit.com/r/SideProject/comments/1u3z3jq/built_a_food_plan_app_with_0_downloads_whats_wrong/) | 2026，采集 2026-08-11 | 社区复盘 | “又一个 meal planner”不是差异化定位 |

平台覆盖：GitHub、官方文档、商业产品、YouTube、Behance、Dribbble、Reddit，共 7 类来源。社交平台互动量只作发现信号，不作为技术或事实证据。

## 可直接采用的模式

- 首屏先给出一天计划，而不是先索取账户或让用户浏览无尽卡片。
- 营养数字必须能追溯到配方与份量；显示数据置信等级。
- 换菜、改配方、恢复原版都是可逆操作。
- GitHub Pages 静态部署降低试用门槛，数据层保持可替换。

## 需要适配的想法

- 线性规划适合生产版，但首版菜谱数据量不足；本原型采用可解释的加权评分。
- 世界地图探索很吸引人，但不应让地域装饰压过餐次决策。
- 社区导入能扩充食谱，但版权、过敏原与营养误差必须进入审核队列。

## 应避免的做法

- 以“AI 自动生成”掩盖食谱来源与营养误差。
- 硬约束冲突时输出荒谬份量或静默放宽过敏限制。
- 绿色卡片墙、无穷瀑布流、均匀动效和无法复核的健康评分。
- 把摄影参考、教程全文或其他项目代码机械复制进仓库。

## 三条路线

| 路线 | 原创性 | 可行性 | 食欲视觉 | 科学准确 | 维护风险 |
|---|---:|---:|---:|---:|---:|
| 世界味觉地图 | 4/5 | 3/5 | 5/5 | 2/5 | 中 |
| 营养优化实验室 | 3/5 | 3/5 | 2/5 | 5/5 | 高 |
| 一日三餐调音台 | 5/5 | 5/5 | 4/5 | 4/5 | 低-中 |

选择“一日三餐调音台”：它兼顾即时决策与营养解释，并把最具差异化的“一键改良”放在每顿饭旁边。

## 技术架构

```text
React UI ──> cuisine filter + goal controls
   │
   ├──> deterministic planner (seeded shuffle + scoring)
   ├──> nutrition aggregation (original / modified recipe)
   └──> typed local recipe data (future: validated API adapter)
```

## 验收标准

- 早、午、晚可单独换菜并保留其他餐次。
- 目标与菜系筛选会改变推荐；不可用菜系不伪造结果。
- 改良前后热量、蛋白质、脂肪等差值可见且可恢复。
- 每道演示食谱包含克数、步骤、过敏原、教程入口、营养置信等级。
- 桌面与移动端无横向溢出，键盘可操作，支持减少动效。
- `npm test` 与 `npm run build` 通过，GitHub Pages workflow 可直接使用。
