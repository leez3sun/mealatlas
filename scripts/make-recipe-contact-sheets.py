"""Build labeled contact sheets for human recipe/image semantic QA."""

from __future__ import annotations

import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "artifacts" / "image-audit"
IMAGES = ROOT / "public" / "images"
RECIPES = (ROOT / "src/data/recipes.ts").read_text(encoding="utf-8")
CATALOG = (ROOT / "src/data/catalogRecipes.ts").read_text(encoding="utf-8")
CUISINES = (ROOT / "src/data/cuisines.ts").read_text(encoding="utf-8")
FONT = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 25)

cuisine_names = {
    match.group(1): match.group(2)
    for match in re.finditer(r"(?:china|world)\('([^']+)',\s*'[^']+',\s*'[^']+',\s*'([^']+)'", CUISINES)
}
catalog_ids = re.findall(r"cuisineId:\s*'([^']+)'", CATALOG)
catalog = [(f"catalog-{item}.webp", cuisine_names[item]) for item in catalog_ids]
featured = [
    (match.group(2), match.group(1))
    for match in re.finditer(r"id:\s*'[^']+',\s*name:\s*'([^']+)'(?:(?!\n\s*\{\n).)*?image:\s*'\.\/images\/([^']+\.webp)'", RECIPES, re.S)
]
rows = featured + catalog

OUT.mkdir(parents=True, exist_ok=True)
for page, start in enumerate(range(0, len(rows), 12), 1):
    canvas = Image.new("RGB", (1500, 1140), "#f4efe5")
    draw = ImageDraw.Draw(canvas)
    for index, (filename, name) in enumerate(rows[start:start + 12]):
        col, row = index % 3, index // 3
        x, y = col * 500, row * 285
        with Image.open(IMAGES / filename) as source:
            tile = ImageOps.fit(source.convert("RGB"), (460, 220), method=Image.Resampling.LANCZOS)
        canvas.paste(tile, (x + 20, y + 18))
        draw.rectangle((x + 20, y + 238, x + 480, y + 275), fill="#fffdf7")
        draw.text((x + 30, y + 242), f"{start + index + 1:02d}  {name}", font=FONT, fill="#17291f")
    canvas.save(OUT / f"recipe-image-audit-{page}.jpg", quality=92)

print(f"wrote {(len(rows) + 11) // 12} contact sheets to {OUT}")
