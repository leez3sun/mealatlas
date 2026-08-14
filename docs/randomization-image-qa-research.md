# Randomization and recipe-image QA brief

Collected 2026-08-13. This change uses current public references as design inputs, not as code or visual templates.

## Benchmarks and reusable lessons

- [Mealie](https://github.com/mealie-recipes/mealie) (v3.19.1 released 2026-05-27, AGPL-3.0, actively maintained) demonstrates that recipe planning and a large structured recipe library belong in the same product. Adopt the separation between recipe data and planning behavior; do not copy its UI or AGPL code.
- [Tandoor Recipes](https://github.com/TandoorRecipes/recipes) (active, AGPL-3.0 with additional licensing notes) reinforces meal-plan, scaling, image compression, and structured import as production concerns. Adopt the explicit recipe/meal-plan boundary; avoid importing implementation because the license and stack differ.
- [Web Crypto `getRandomValues`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues) (MDN updated 2025-08-19; widely available) provides fresh browser entropy. Use it only to vary interaction seeds; keep the planner deterministic for a supplied seed so tests remain reproducible.
- [React `useRef`](https://react.dev/reference/react/useRef) (official React reference, accessed 2026-08-13) is appropriate for recent-recipe history and action counters because those values do not need to render. Avoid putting this interaction-only history in visual state.
- [ImageHash](https://github.com/JohannesBuchner/imagehash) (BSD-2-Clause, 3.8k stars, latest release 4.1.0) documents why perceptual hashes catch visual near-duplicates that cryptographic hashes miss. We implement a small dependency-free dHash equivalent using Pillow and also keep SHA-256 for exact duplicates.
- [Tandoor mixed-content failure report #953](https://github.com/TandoorRecipes/recipes/issues/953) is a useful failure case: remote image delivery can break even when recipe data loads. MealAtlas therefore keeps reviewed WebP assets inside the repository instead of hotlinking external food images.

## Alternatives considered

1. Pure `Math.random()` on every render: simple, but hard to reproduce and prone to React render-related surprises.
2. Deterministic date seed only: testable, but it created the repetition the user observed.
3. Selected route — deterministic planner + browser entropy at user actions + current-plan hard exclusion + rolling recent-history avoidance: reproducible in tests, fresh in use, and still nutrition-ranked.

For images, external hotlinks were rejected because of availability, licensing, and mismatch risk. Generic editorial placeholders were honest but visually weak. The selected route is one project-owned food photograph per recipe, unique paths, exact and perceptual duplicate checks, and labeled contact-sheet visual review.

## Verification criteria

- `换一道` must never return the same recipe, including when a selected cuisine has only one recipe in that meal slot.
- Calorie and goal changes must avoid all three recipes in the current plan whenever each slot has alternatives.
- Breakfast must have at least ten candidates.
- Exactly 72 recipe images must exist at 1200×900, with unique paths, unique SHA-256 hashes, and no dHash distance of 5 or less.
- Labeled contact sheets must be inspected against recipe names and principal ingredients before publishing.
