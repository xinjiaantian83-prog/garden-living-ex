#!/usr/bin/env python3
from __future__ import annotations

import json
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "images/templates/template01/template01-before.jpg"
OUT_DIR = ROOT / "generated/v08-template01-placement"


PRODUCTS = {
    "turf": {
        "label": "人工芝",
        "color": (61, 139, 65, 150),
        "layer_kind": "background",
        "render_group": "background",
        "z": 5,
        "patterns": {
            "A": {"label": "ひろく敷く", "type": "area", "polygon": [[0.06, 0.56], [0.48, 0.50], [0.95, 0.68], [0.96, 0.95], [0.03, 0.95], [0.01, 0.73]]},
            "B": {"label": "控えめに敷く", "type": "area", "polygon": [[0.16, 0.59], [0.53, 0.53], [0.87, 0.68], [0.83, 0.88], [0.15, 0.88], [0.08, 0.73]]},
        },
    },
    "tile_deck": {
        "label": "タイルデッキ",
        "color": (214, 190, 150, 175),
        "layer_kind": "product",
        "render_group": "structure",
        "z": 20,
        "patterns": {
            "A": {"label": "小さめ", "type": "area", "polygon": [[0.47, 0.55], [0.96, 0.67], [0.95, 0.78], [0.42, 0.69]]},
            "B": {"label": "広め", "type": "area", "polygon": [[0.33, 0.52], [0.98, 0.66], [0.98, 0.85], [0.24, 0.74]]},
        },
    },
    "american_fence": {
        "label": "アメリカンフェンス",
        "color": (205, 214, 210, 230),
        "layer_kind": "product",
        "render_group": "structure",
        "z": 50,
        "patterns": {
            "A": {"label": "奥の一辺", "type": "route", "route": [[0.17, 0.48], [0.53, 0.48]]},
            "B": {"label": "左境界+奥のL字", "type": "route", "route": [[0.03, 0.68], [0.18, 0.48], [0.54, 0.48]]},
        },
    },
    "garden_furniture": {
        "label": "ガーデンファニチャー",
        "color": (128, 87, 54, 210),
        "layer_kind": "product",
        "render_group": "equipment_furniture",
        "z": 70,
        "patterns": {
            "A": {"label": "ダイニング", "type": "object", "rect": {"x": 0.68, "y": 0.70, "width": 0.18, "height": 0.12}, "rotation": -4},
            "B": {"label": "休憩席", "type": "object", "rect": {"x": 0.42, "y": 0.70, "width": 0.20, "height": 0.11}, "rotation": -2},
        },
    },
    "pizza_oven": {
        "label": "ピザ窯",
        "color": (166, 93, 49, 220),
        "layer_kind": "product",
        "render_group": "equipment_furniture",
        "z": 60,
        "patterns": {
            "A": {"label": "デッキ脇", "type": "object", "rect": {"x": 0.52, "y": 0.56, "width": 0.10, "height": 0.14}, "rotation": 0},
            "B": {"label": "庭の端", "type": "object", "rect": {"x": 0.78, "y": 0.57, "width": 0.11, "height": 0.15}, "rotation": -3},
        },
    },
}


RECOMMENDED_SETS = [
    {"id": "playable-garden", "label": "まずは遊べる庭", "state": {"turf": "A", "tile_deck": "none", "american_fence": "A", "garden_furniture": "none", "pizza_oven": "none"}},
    {"id": "family-garden", "label": "家族で過ごす庭", "state": {"turf": "A", "tile_deck": "A", "american_fence": "none", "garden_furniture": "A", "pizza_oven": "none"}},
    {"id": "dogrun-garden", "label": "ドッグランの庭", "state": {"turf": "A", "tile_deck": "none", "american_fence": "B", "garden_furniture": "none", "pizza_oven": "none"}},
    {"id": "pizza-weekend", "label": "休日の食事を楽しむ庭", "state": {"turf": "none", "tile_deck": "A", "american_fence": "none", "garden_furniture": "A", "pizza_oven": "B"}},
    {"id": "complete-calm", "label": "全部入り控えめ", "state": {"turf": "B", "tile_deck": "A", "american_fence": "A", "garden_furniture": "A", "pizza_oven": "B"}},
]


ANALYSIS = {
    "garden_area": {"label": "庭", "polygon": [[0.02, 0.56], [0.19, 0.46], [0.53, 0.46], [0.98, 0.67], [0.98, 0.98], [0.00, 0.98]], "color": (97, 153, 63, 70)},
    "building_area": {"label": "建物", "polygon": [[0.39, 0.00], [1.00, 0.00], [1.00, 0.67], [0.52, 0.47], [0.38, 0.43]], "color": (96, 126, 180, 60)},
    "placement_safe_area": {"label": "配置可能エリア", "polygon": [[0.09, 0.58], [0.50, 0.50], [0.93, 0.69], [0.92, 0.92], [0.06, 0.93]], "color": (240, 165, 70, 90)},
}


def font(size: int) -> ImageFont.ImageFont:
    candidates = [
        "/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size)
        except Exception:
            continue
    return ImageFont.load_default()


def p(img: Image.Image, xy: list[float]) -> tuple[int, int]:
    return round(xy[0] * img.width), round(xy[1] * img.height)


def rect_px(img: Image.Image, rect: dict) -> tuple[int, int, int, int]:
    return (
        round(rect["x"] * img.width),
        round(rect["y"] * img.height),
        round((rect["x"] + rect["width"]) * img.width),
        round((rect["y"] + rect["height"]) * img.height),
    )


def label(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, fill=(255, 255, 255, 255), bg=(25, 25, 25, 190)) -> None:
    f = font(18)
    box = draw.textbbox(xy, text, font=f)
    pad = 6
    draw.rounded_rectangle((box[0] - pad, box[1] - pad, box[2] + pad, box[3] + pad), radius=8, fill=bg)
    draw.text(xy, text, font=f, fill=fill)


def draw_area(base: Image.Image, item: dict, product_label: str, pattern_label: str) -> None:
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    points = [p(base, pt) for pt in item["polygon"]]
    d.polygon(points, fill=item["color"], outline=(255, 255, 255, 200))
    d.line(points + [points[0]], fill=(60, 60, 60, 170), width=2)
    cx = sum(x for x, _ in points) // len(points)
    cy = sum(y for _, y in points) // len(points)
    label(d, (cx - 52, cy - 12), f"{product_label} {pattern_label}")
    base.alpha_composite(layer)


def draw_route(base: Image.Image, item: dict, product_label: str, pattern_label: str) -> None:
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    route = [p(base, pt) for pt in item["route"]]
    d.line(route, fill=item["color"], width=8, joint="curve")
    d.line(route, fill=(70, 80, 78, 230), width=2, joint="curve")
    for x, y in route:
        d.ellipse((x - 7, y - 7, x + 7, y + 7), fill=(255, 255, 255, 230), outline=(60, 60, 60, 230), width=2)
    label(d, (route[-1][0] + 8, route[-1][1] - 30), f"{product_label} {pattern_label}")
    base.alpha_composite(layer)


def draw_object(base: Image.Image, item: dict, product_label: str, pattern_label: str, color: tuple[int, int, int, int]) -> None:
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    r = rect_px(base, item["rect"])
    d.rounded_rectangle(r, radius=10, fill=color, outline=(255, 255, 255, 210), width=2)
    cx = (r[0] + r[2]) // 2
    cy = (r[1] + r[3]) // 2
    if "ピザ" in product_label:
        d.arc((r[0] + 12, r[1] + 8, r[2] - 12, r[3] - 6), 180, 360, fill=(60, 35, 24, 230), width=5)
    else:
        d.ellipse((cx - 22, cy - 12, cx + 22, cy + 12), outline=(65, 43, 30, 230), width=4)
        for ox, oy in [(-40, -24), (40, -24), (-40, 24), (40, 24)]:
            d.rectangle((cx + ox - 9, cy + oy - 7, cx + ox + 9, cy + oy + 7), outline=(65, 43, 30, 230), width=3)
    label(d, (r[0], r[1] - 34), f"{product_label} {pattern_label}")
    base.alpha_composite(layer)


def draw_product(base: Image.Image, product_key: str, pattern: str) -> None:
    if pattern == "none":
        return
    product = PRODUCTS[product_key]
    item = product["patterns"][pattern]
    item = dict(item, color=product["color"])
    if item["type"] == "area":
        draw_area(base, item, product["label"], pattern)
    elif item["type"] == "route":
        draw_route(base, item, product["label"], pattern)
    else:
        draw_object(base, item, product["label"], pattern, product["color"])


def render_state(base: Image.Image, state: dict, title: str) -> Image.Image:
    img = base.convert("RGBA")
    ordered = sorted(PRODUCTS.keys(), key=lambda key: PRODUCTS[key]["z"])
    for key in ordered:
        draw_product(img, key, state.get(key, "none"))
    d = ImageDraw.Draw(img)
    label(d, (18, 16), title, bg=(0, 0, 0, 180))
    return img.convert("RGB")


def render_analysis(base: Image.Image) -> Image.Image:
    img = base.convert("RGBA")
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for item in ANALYSIS.values():
        pts = [p(img, pt) for pt in item["polygon"]]
        d.polygon(pts, fill=item["color"], outline=(255, 255, 255, 190))
        cx = sum(x for x, _ in pts) // len(pts)
        cy = sum(y for _, y in pts) // len(pts)
        label(d, (cx - 36, cy - 12), item["label"])
    # windows
    for text, rect in [
        ("中央掃き出し窓", {"x": 0.50, "y": 0.29, "width": 0.12, "height": 0.24}),
        ("右掃き出し窓", {"x": 0.76, "y": 0.13, "width": 0.17, "height": 0.42}),
    ]:
        r = rect_px(img, rect)
        d.rectangle(r, outline=(255, 200, 0, 240), width=4)
        label(d, (r[0], max(8, r[1] - 34)), text, bg=(80, 58, 0, 190))
    img.alpha_composite(layer)
    return img.convert("RGB")


def make_contact_sheet(paths: list[Path], output: Path) -> None:
    thumbs = []
    for path in paths:
        im = Image.open(path).convert("RGB")
        w = 360
        h = round(im.height * (w / im.width))
        thumbs.append((path, im.resize((w, h), Image.Resampling.LANCZOS)))
    cols = 2
    cell_h = max(im.height for _, im in thumbs) + 54
    sheet = Image.new("RGB", (cols * 360, math.ceil(len(thumbs) / cols) * cell_h), "#f7f3ec")
    d = ImageDraw.Draw(sheet)
    for i, (path, im) in enumerate(thumbs):
        x = (i % cols) * 360
        y = (i // cols) * cell_h
        sheet.paste(im, (x, y))
        d.text((x + 12, y + im.height + 12), path.stem, fill="#111", font=font(20))
    sheet.save(output, quality=90)


def export_layout_json() -> None:
    data = {
        "template_id": "template01",
        "version": "1.0.0",
        "before_image": "images/templates/template01/template01-before.jpg",
        "image_size": {"width": 829, "height": 568},
        "layer_model": {
            "background_layers": ["soil", "turf", "gravel", "decomposed_granite", "concrete"],
            "product_layers": [
                "tile_deck",
                "american_fence",
                "garden_furniture",
                "pizza_oven",
                "gabion",
                "water_stand",
                "sauna",
            ],
            "render_order": ["background", "structure", "equipment_furniture"],
        },
        "products": PRODUCTS,
        "recommended_sets": RECOMMENDED_SETS,
    }
    (OUT_DIR / "template01-layout-config.json").write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    if not SOURCE.exists():
        raise FileNotFoundError(SOURCE)
    base = Image.open(SOURCE).convert("RGB")
    outputs = []
    analysis = OUT_DIR / "00-analysis-zones.jpg"
    render_analysis(base).save(analysis, quality=90)
    outputs.append(analysis)

    for product_key, product in PRODUCTS.items():
        for pattern in ["A", "B"]:
            state = {key: "none" for key in PRODUCTS}
            state[product_key] = pattern
            output = OUT_DIR / f"product-{product_key}-{pattern}.jpg"
            render_state(base, state, f"{product['label']} {pattern}").save(output, quality=90)
            outputs.append(output)

    all_state = {key: "A" for key in PRODUCTS}
    all_output = OUT_DIR / "all-products-integrated-rough.jpg"
    render_state(base, all_state, "5商品すべて A 統合ラフ").save(all_output, quality=90)
    outputs.append(all_output)

    for rec in RECOMMENDED_SETS:
        output = OUT_DIR / f"recommended-{rec['id']}.jpg"
        render_state(base, rec["state"], rec["label"]).save(output, quality=90)
        outputs.append(output)

    make_contact_sheet(outputs, OUT_DIR / "contact-sheet.jpg")
    export_layout_json()
    print(f"created {len(outputs)} rough images")
    print(f"output: {OUT_DIR}")


if __name__ == "__main__":
    main()
