"""Fail CI on missing, exact-duplicate, or near-duplicate recipe imagery."""

from __future__ import annotations

import hashlib
import itertools
import re
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "public" / "images"
RECIPES = (ROOT / "src" / "data" / "recipes.ts").read_text(encoding="utf-8")
CATALOG = (ROOT / "src" / "data" / "catalogRecipes.ts").read_text(encoding="utf-8")

featured = re.findall(r"image:\s*'\.\/images\/([^']+\.webp)'", RECIPES)
catalog = [f"catalog-{item}.webp" for item in re.findall(r"cuisineId:\s*'([^']+)'", CATALOG)]
files = [IMAGES / name for name in featured + catalog]

if len(files) != 72:
    raise SystemExit(f"expected 72 recipe images, found {len(files)}")
if len({path.name for path in files}) != len(files):
    raise SystemExit("two recipes resolve to the same image path")


def dhash(path: Path, size: int = 16) -> int:
    with Image.open(path) as image:
        gray = image.convert("L").resize((size + 1, size), Image.Resampling.LANCZOS)
        pixels = list(gray.getdata())
        bits = [pixels[row * (size + 1) + col + 1] > pixels[row * (size + 1) + col] for row in range(size) for col in range(size)]
    value = 0
    for bit in bits:
        value = (value << 1) | bit
    return value


records: list[tuple[Path, str, int]] = []
for path in files:
    if not path.exists():
        raise SystemExit(f"missing image: {path.name}")
    with Image.open(path) as image:
        width, height = image.size
        if min(width, height) < 500 or not 0.85 <= width / height <= 1.85:
            raise SystemExit(f"unusable dimensions for {path.name}: {image.size}")
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    records.append((path, digest, dhash(path)))

for left, right in itertools.combinations(records, 2):
    if left[1] == right[1]:
        raise SystemExit(f"exact duplicate: {left[0].name} / {right[0].name}")
    distance = (left[2] ^ right[2]).bit_count()
    if distance <= 5:
        raise SystemExit(f"near duplicate (dHash {distance}): {left[0].name} / {right[0].name}")

print(f"audited {len(records)} unique recipe images; dimensions and hashes passed")
