"""Normalize a generated food photo into the recipe-card asset contract."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageOps


parser = argparse.ArgumentParser()
parser.add_argument("input", type=Path)
parser.add_argument("output", type=Path)
args = parser.parse_args()

with Image.open(args.input) as source:
    rgb = source.convert("RGB")
    card = ImageOps.fit(rgb, (1200, 900), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    card.save(args.output, "WEBP", quality=90, method=6)

print(args.output)
