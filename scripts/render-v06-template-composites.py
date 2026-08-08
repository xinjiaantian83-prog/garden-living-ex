#!/usr/bin/env python3
from __future__ import annotations

import json
import math
import time
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "generated/v05-tile-deck-area/source.jpg"
OUT_DIR = ROOT / "generated/v06-template-composite"
CANVAS_SIZE = (1168, 768)


PRODUCT_LABELS = {
    "fence": "アメリカンフェンス",
    "tile": "タイルデッキ",
    "turf": "人工芝",
    "pizza": "ピザ窯",
    "furniture": "ガーデンファニチャー",
}

PATTERN_LABELS = {
    "none": "なし",
    "A": "A",
    "B": "B",
}

COMBOS = [
    {
        "id": "01-basic-lawn-deck",
        "name": "芝とタイルの基本庭",
        "state": {"fence": "none", "tile": "A", "turf": "A", "pizza": "none", "furniture": "A"},
    },
    {
        "id": "02-dogrun-fence",
        "name": "ドッグラン寄り",
        "state": {"fence": "B", "tile": "none", "turf": "A", "pizza": "none", "furniture": "none"},
    },
    {
        "id": "03-pizza-meal",
        "name": "ピザ窯と食事",
        "state": {"fence": "A", "tile": "A", "turf": "none", "pizza": "B", "furniture": "A"},
    },
    {
        "id": "04-clean-lawn",
        "name": "すっきり芝庭",
        "state": {"fence": "none", "tile": "B", "turf": "B", "pizza": "none", "furniture": "B"},
    },
    {
        "id": "05-fence-lawn-pizza",
        "name": "囲い庭とピザ窯",
        "state": {"fence": "B", "tile": "none", "turf": "A", "pizza": "A", "furniture": "none"},
    },
    {
        "id": "06-tile-dining",
        "name": "タイル上のダイニング",
        "state": {"fence": "none", "tile": "B", "turf": "none", "pizza": "none", "furniture": "A"},
    },
    {
        "id": "07-front-fence-furniture",
        "name": "前面フェンスと休憩席",
        "state": {"fence": "A", "tile": "none", "turf": "B", "pizza": "none", "furniture": "B"},
    },
    {
        "id": "08-pizza-focused",
        "name": "ピザ窯主役",
        "state": {"fence": "none", "tile": "A", "turf": "none", "pizza": "A", "furniture": "B"},
    },
    {
        "id": "09-family-garden",
        "name": "家族で使う庭",
        "state": {"fence": "B", "tile": "A", "turf": "B", "pizza": "none", "furniture": "A"},
    },
    {
        "id": "10-minimal-deck",
        "name": "最小タイルデッキ",
        "state": {"fence": "none", "tile": "A", "turf": "none", "pizza": "none", "furniture": "none"},
    },
    {
        "id": "11-lawn-only",
        "name": "人工芝のみ",
        "state": {"fence": "none", "tile": "none", "turf": "A", "pizza": "none", "furniture": "none"},
    },
    {
        "id": "12-fence-only",
        "name": "フェンスのみ",
        "state": {"fence": "B", "tile": "none", "turf": "none", "pizza": "none", "furniture": "none"},
    },
    {
        "id": "13-pizza-no-deck",
        "name": "芝庭のピザ窯",
        "state": {"fence": "none", "tile": "none", "turf": "B", "pizza": "B", "furniture": "A"},
    },
    {
        "id": "14-full-but-calm",
        "name": "全部入り控えめ",
        "state": {"fence": "A", "tile": "A", "turf": "B", "pizza": "B", "furniture": "A"},
    },
    {
        "id": "15-outdoor-room",
        "name": "アウトドアルーム風",
        "state": {"fence": "B", "tile": "B", "turf": "none", "pizza": "A", "furniture": "A"},
    },
]


def font(size: int) -> ImageFont.ImageFont:
    candidates = [
        "/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc",
        "/System/Library/Fonts/Helvetica.ttc",
        "/Library/Fonts/Arial Unicode.ttf",
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size)
        except Exception:
            continue
    return ImageFont.load_default()


def point(width: int, height: int, xy: tuple[float, float]) -> tuple[int, int]:
    return (round(xy[0] * width), round(xy[1] * height))


def overlay_polygon(base: Image.Image, points: list[tuple[float, float]], color: tuple[int, int, int, int], outline=None) -> None:
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    px = [point(base.width, base.height, p) for p in points]
    draw.polygon(px, fill=color, outline=outline)
    base.alpha_composite(layer)


def clip_layer_alpha(layer: Image.Image, mask: Image.Image) -> Image.Image:
    clipped = layer.copy()
    alpha = clipped.getchannel("A")
    clipped.putalpha(ImageChops.multiply(alpha, mask))
    return clipped


def draw_shadow(base: Image.Image, x: float, y: float, rx: float, ry: float, alpha: int = 45) -> None:
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.ellipse((x - rx, y - ry, x + rx, y + ry), fill=(28, 22, 18, alpha))
    layer = layer.filter(ImageFilter.GaussianBlur(10))
    base.alpha_composite(layer)


def draw_tile(base: Image.Image, pattern: str) -> None:
    if pattern == "none":
        return
    points = (
        [(0.08, 0.55), (0.56, 0.54), (0.60, 0.73), (0.05, 0.77)]
        if pattern == "A"
        else [(0.42, 0.56), (0.91, 0.55), (0.88, 0.78), (0.38, 0.76)]
    )
    overlay_polygon(base, points, (207, 196, 173, 210), (96, 84, 70, 130))
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    mask = Image.new("L", base.size, 0)
    ImageDraw.Draw(mask).polygon([point(base.width, base.height, p) for p in points], fill=255)
    draw = ImageDraw.Draw(layer)
    for x in range(-140, base.width + 180, 74):
        draw.line((x, 0, x + 165, base.height), fill=(92, 82, 70, 85), width=2)
    for y in range(350, base.height, 48):
        draw.line((0, y, base.width, y - 18), fill=(92, 82, 70, 70), width=2)
    base.alpha_composite(clip_layer_alpha(layer, mask))


def draw_turf(base: Image.Image, pattern: str) -> None:
    if pattern == "none":
        return
    points = (
        [(0.12, 0.60), (0.88, 0.58), (0.92, 0.91), (0.07, 0.92)]
        if pattern == "A"
        else [(0.18, 0.60), (0.80, 0.59), (0.84, 0.84), (0.14, 0.86)]
    )
    overlay_polygon(base, points, (74, 125, 45, 205), None)
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    mask = Image.new("L", base.size, 0)
    ImageDraw.Draw(mask).polygon([point(base.width, base.height, p) for p in points], fill=255)
    draw = ImageDraw.Draw(layer)
    for i in range(90):
        y = 430 + i * 5
        draw.line((0, y, base.width, y - 36), fill=(219, 239, 189, 45), width=1)
    base.alpha_composite(clip_layer_alpha(layer, mask))


def draw_fence(base: Image.Image, pattern: str) -> None:
    if pattern == "none":
        return
    routes = (
        [[(0.07, 0.79), (0.91, 0.77)]]
        if pattern == "A"
        else [[(0.10, 0.57), (0.09, 0.84)], [(0.09, 0.84), (0.87, 0.80)]]
    )
    draw = ImageDraw.Draw(base)
    for route in routes:
        a = point(base.width, base.height, route[0])
        b = point(base.width, base.height, route[1])
        draw.line((a, b), fill=(198, 207, 205, 235), width=9)
        draw.line((a, b), fill=(82, 96, 94, 180), width=2)
        for i in range(19):
            t = i / 18
            x = a[0] + (b[0] - a[0]) * t
            y = a[1] + (b[1] - a[1]) * t
            draw.line((x, y - 56, x, y + 16), fill=(82, 96, 94, 185), width=2)
        for s in range(6):
            draw.line((a[0], a[1] - 48 + s * 12, b[0], b[1] - 48 + s * 12), fill=(82, 96, 94, 165), width=2)


def draw_pizza(base: Image.Image, pattern: str) -> None:
    if pattern == "none":
        return
    x = base.width * (0.23 if pattern == "A" else 0.69)
    y = base.height * (0.61 if pattern == "A" else 0.60)
    scale = 0.86 if pattern == "A" else 0.72
    draw_shadow(base, x + 70 * scale, y + 98 * scale, 72 * scale, 16 * scale, 52)
    draw = ImageDraw.Draw(base)
    def xy(rx, ry):
        return (x + rx * scale, y + ry * scale)
    draw.rectangle((*xy(16, 56), *xy(148, 108)), fill=(138, 90, 58, 235))
    for i in range(9):
        draw.rectangle((*xy(18 + i * 14, 58), *xy(28 + i * 14, 70)), fill=(184, 132, 85, 230))
        draw.rectangle((*xy(18 + i * 14, 82), *xy(28 + i * 14, 94)), fill=(184, 132, 85, 230))
    draw.pieslice((x + 27 * scale, y + 3 * scale, x + 137 * scale, y + 113 * scale), 180, 360, fill=(159, 106, 67, 238))
    draw.rectangle((*xy(27, 58), *xy(137, 86)), fill=(159, 106, 67, 238))
    draw.pieslice((x + 46 * scale, y + 27 * scale, x + 118 * scale, y + 99 * scale), 180, 360, fill=(46, 37, 31, 245))


def draw_furniture(base: Image.Image, pattern: str) -> None:
    if pattern == "none":
        return
    x = base.width * (0.62 if pattern == "A" else 0.31)
    y = base.height * (0.75 if pattern == "A" else 0.72)
    draw_shadow(base, x, y + 26, 70, 16, 44)
    draw = ImageDraw.Draw(base)
    draw.ellipse((x - 58, y - 22, x + 58, y + 22), fill=(167, 120, 79, 230), outline=(81, 64, 54, 230), width=4)
    for cx, cy in [(-76, -20), (76, -18), (-68, 44), (70, 42)]:
        draw.rounded_rectangle((x + cx - 18, y + cy - 14, x + cx + 18, y + cy + 14), radius=5, outline=(63, 51, 43, 230), width=4)


def render_combo(base_rgb: Image.Image, combo: dict) -> tuple[Image.Image, float]:
    start = time.perf_counter()
    img = base_rgb.convert("RGBA").resize(CANVAS_SIZE, Image.Resampling.LANCZOS)
    state = combo["state"]
    draw_turf(img, state["turf"])
    draw_tile(img, state["tile"])
    draw_pizza(img, state["pizza"])
    draw_furniture(img, state["furniture"])
    draw_fence(img, state["fence"])
    elapsed_ms = (time.perf_counter() - start) * 1000
    return img.convert("RGB"), elapsed_ms


def draw_label(img: Image.Image, combo: dict) -> Image.Image:
    labeled = Image.new("RGB", (img.width, img.height + 76), "#ffffff")
    labeled.paste(img, (0, 0))
    draw = ImageDraw.Draw(labeled)
    draw.text((18, img.height + 12), combo["name"], fill="#111111", font=font(24))
    state_text = " / ".join(
        f"{PRODUCT_LABELS[key]}:{PATTERN_LABELS[value]}"
        for key, value in combo["state"].items()
        if value != "none"
    ) or "商品なし"
    draw.text((18, img.height + 44), state_text, fill="#706b64", font=font(15))
    return labeled


def create_contact_sheet(images: list[tuple[dict, Image.Image]]) -> Image.Image:
    thumb_w = 360
    cols = 3
    labeled = []
    for combo, img in images:
        ratio = thumb_w / img.width
        thumb = img.resize((thumb_w, round(img.height * ratio)), Image.Resampling.LANCZOS)
        labeled.append(draw_label(thumb, combo))
    cell_w = thumb_w
    cell_h = max(i.height for i in labeled)
    rows = math.ceil(len(labeled) / cols)
    sheet = Image.new("RGB", (cols * cell_w, rows * cell_h), "#f7f3ec")
    for index, img in enumerate(labeled):
        x = (index % cols) * cell_w
        y = (index // cols) * cell_h
        sheet.paste(img, (x, y))
    return sheet


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    if not SOURCE.exists():
        raise FileNotFoundError(f"Template image not found: {SOURCE}")
    base = Image.open(SOURCE).convert("RGB")
    run_log = []
    rendered = []
    for combo in COMBOS:
        img, elapsed_ms = render_combo(base, combo)
        output_path = OUT_DIR / f"{combo['id']}.jpg"
        img.save(output_path, quality=88)
        run_log.append({
            "id": combo["id"],
            "name": combo["name"],
            "state": combo["state"],
            "render_ms": round(elapsed_ms, 2),
            "output": str(output_path.relative_to(ROOT)),
        })
        rendered.append((combo, img))
    sheet = create_contact_sheet(rendered)
    sheet_path = OUT_DIR / "contact-sheet.jpg"
    sheet.save(sheet_path, quality=88)
    (OUT_DIR / "run-log.json").write_text(json.dumps({
        "source": str(SOURCE.relative_to(ROOT)),
        "combo_count": len(COMBOS),
        "average_render_ms": round(sum(item["render_ms"] for item in run_log) / len(run_log), 2),
        "outputs": run_log,
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"rendered {len(COMBOS)} combos")
    print(f"contact sheet: {sheet_path}")
    print(f"average render: {round(sum(item['render_ms'] for item in run_log) / len(run_log), 2)} ms")


if __name__ == "__main__":
    main()
