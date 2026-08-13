# Recipe coverage research brief

Collected: 2026-08-13 (Asia/Shanghai)

## Benchmarks and reusable lessons

- [China Cuisine Association: 34 regional systems and 340 classic dishes](https://m.ccas.com.cn/site/content/101707.html) — published 2018-10-24; industry association source; used to justify province-level breadth, not to copy recipes.
- [State Council portal: four classic Chinese cuisines](https://www.gov.cn/banshi/2005-06/27/content_9993.htm) — published 2005-06-27; primary public source; confirms representative techniques and dishes including scallion-braised sea cucumber.
- [The Woks of Life: eight Chinese cuisines](https://thewoksoflife.com/8-chinese-cuisines/) — updated 2022-10-09; experienced creator breakdown; stresses that the eight traditions do not exhaust China's regional cooking.
- [China Sichuan Food recipe index](https://www.chinasichuanfood.com/recipe-index/) — active recipe-site index; used for technique/ingredient cross-checks, with links exposed as searches rather than copied content.
- [Good Food cuisine collections](https://www.bbcgoodfood.com/recipes/category/cuisine-collections) and [TasteAtlas recipe database](https://www.tasteatlas.com/recipes) — current world-cuisine indexes; used for representative-dish and technique cross-checks.
- [Mealie](https://github.com/mealie-recipes/mealie) — active AGPL project, v3.19.1 shown 2026-05-27, about 12.3k stars at collection; reusable lesson: model recipes as structured data and keep meal planning separate.
- [RecipeSage](https://github.com/julianpoy/recipesage) — active dual-licensed/AGPL project, about 928 stars at collection; reusable lesson: keep per-serving nutrition, scaling and external imports explicit. Its AI-contribution warning is a useful failure signal: generated bulk content needs validation tests and editorial confidence labels.
- [Mealie import issue #2802](https://github.com/mealie-recipes/mealie/issues/2802) — failure case; imports can fail silently, so MealAtlas does not depend on runtime scraping or third-party import availability.

## Alternatives considered

1. Hand-write 59 standalone `Recipe` objects. Highest local detail, but excessive duplication and difficult maintenance.
2. Keep dish-specific ingredients and steps in compact seeds, then use shared builders only for repetitive nutrition/modification/link fields. Selected: best balance of specificity, reviewability and maintainability.
3. Scrape recipes at runtime. Rejected: CORS, login walls, anti-bot changes, link decay, copyright and silent-import risk.

## Selected architecture and quality gates

- `catalogRecipes.ts` contains a unique seed for every previously empty cuisine.
- Each entry has at least five measured ingredients, three dish-specific steps, eleven nutrition fields, at least three modification changes and at least two tutorial routes.
- Values remain labelled `estimated`; linked sources are for cross-checking, not proof that every gram matches a restaurant version.
- Unique editorial covers state that photography is pending; another dish's photo is never reused.
- Tests require 71/71 cuisine coverage, complete recipe fields and one image path per recipe.

