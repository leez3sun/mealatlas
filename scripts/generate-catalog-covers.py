"""Generate honest, unique editorial covers for catalog recipes.

These are deliberately labelled as covers rather than synthetic food photos. They
prevent a dish from being shown with another dish's image while photography is
being commissioned, and are deterministic so contributors can regenerate them.
"""

from __future__ import annotations

import hashlib
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE = (ROOT / "src/data/catalogRecipes.ts").read_text(encoding="utf-8")
CUISINES = (ROOT / "src/data/cuisines.ts").read_text(encoding="utf-8")
OUTPUT = ROOT / "public/images"
FONT = Path("C:/Windows/Fonts/msyh.ttc")
FONT_BOLD = Path("C:/Windows/Fonts/msyhbd.ttc")


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    path = FONT_BOLD if bold and FONT_BOLD.exists() else FONT
    return ImageFont.truetype(str(path), size=size)


def palette(key: str) -> tuple[tuple[int, int, int], ...]:
    digest = hashlib.sha256(key.encode("utf-8")).digest()
    hue = digest[0] / 255
    # Muted food-editorial palettes, with deterministic variation by cuisine.
    bases = [
        ((242, 224, 191), (174, 70, 49), (49, 79, 62)),
        ((232, 218, 190), (173, 104, 45), (40, 82, 87)),
        ((238, 226, 207), (132, 70, 59), (73, 92, 48)),
        ((226, 221, 199), (190, 89, 54), (50, 74, 68)),
    ]
    return bases[min(int(hue * len(bases)), len(bases) - 1)]


def wrap_name(text: str, width: int = 6) -> list[str]:
    return [text[index:index + width] for index in range(0, len(text), width)][:3]


cuisine_rows = {
    match.group(1): (match.group(2), match.group(3))
    for match in re.finditer(
        r"(?:china|world)\('([^']+)',\s*'([^']+)',\s*'[^']+',\s*'([^']+)'",
        CUISINES,
    )
}
ids = re.findall(r"cuisineId:\s*'([^']+)'", SOURCE)

OUTPUT.mkdir(parents=True, exist_ok=True)
for cuisine_id in ids:
    cuisine, dish = cuisine_rows[cuisine_id]
    background, accent, ink = palette(cuisine_id)
    canvas = Image.new("RGB", (1200, 900), background)
    draw = ImageDraw.Draw(canvas)

    draw.rounded_rectangle((72, 62, 1128, 838), radius=44, fill=(250, 247, 239), outline=ink, width=3)
    draw.ellipse((760, 180, 1110, 530), fill=accent)
    draw.ellipse((820, 240, 1050, 470), fill=(250, 247, 239))
    draw.arc((804, 224, 1066, 486), 205, 525, fill=ink, width=10)
    draw.line((890, 115, 1080, 600), fill=ink, width=9)
    draw.line((930, 105, 1115, 590), fill=ink, width=5)
    draw.ellipse((785, 500, 850, 565), fill=(111, 139, 73))
    draw.ellipse((875, 520, 940, 585), fill=(210, 152, 62))
    draw.ellipse((965, 500, 1035, 570), fill=(116, 61, 49))

    draw.text((120, 115), "MEALATLAS · 菜谱档案", font=font(28, True), fill=accent)
    draw.text((120, 175), cuisine, font=font(42, True), fill=ink)
    y = 270
    for line in wrap_name(dish):
        draw.text((120, y), line, font=font(86, True), fill=(34, 45, 37))
        y += 108
    draw.line((120, 660, 700, 660), fill=accent, width=5)
    draw.text((120, 700), "克重 · 做法 · 营养 · 减脂改良", font=font(31), fill=ink)
    draw.text((120, 764), "内容已收录｜成品摄影待补充", font=font(25), fill=(93, 100, 91))

    canvas.save(OUTPUT / f"catalog-{cuisine_id}.webp", "WEBP", quality=88, method=6)

print(f"generated {len(ids)} catalog covers in {OUTPUT}")
