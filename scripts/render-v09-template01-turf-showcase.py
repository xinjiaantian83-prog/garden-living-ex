from pathlib import Path
import math
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance


ROOT = Path(__file__).resolve().parents[1]
BEFORE = ROOT / "images/templates/template01/template01-before.jpg"
TURF_SOURCE = ROOT / "images/g20-material/water-stand/real-grass-pan.jpg"
OUT_DIR = ROOT / "generated/v09-template01-showcase"
OUT = OUT_DIR / "template01-shiba-garden.jpg"


def make_soft_polygon_mask(size, polygon, subtract=None, blur=2):
    scale = 4
    mask = Image.new("L", (size[0] * scale, size[1] * scale), 0)
    draw = ImageDraw.Draw(mask)
    poly = [(int(x * scale), int(y * scale)) for x, y in polygon]
    draw.polygon(poly, fill=255)
    for cut in subtract or []:
        draw.polygon([(int(x * scale), int(y * scale)) for x, y in cut], fill=0)
    mask = mask.filter(ImageFilter.GaussianBlur(blur * scale))
    return mask.resize(size, Image.Resampling.LANCZOS)


def crop_grass_texture():
    src = Image.open(TURF_SOURCE).convert("RGB")
    # Crop only the actual artificial-grass surface from the product reference.
    crop = src.crop((1750, 1180, 2500, 1500))
    crop = ImageEnhance.Color(crop).enhance(0.82)
    crop = ImageEnhance.Brightness(crop).enhance(1.12)
    crop = ImageEnhance.Contrast(crop).enhance(0.92)
    return crop


def make_tiled_texture(size):
    tile = crop_grass_texture().resize((82, 35), Image.Resampling.BICUBIC)
    canvas = Image.new("RGB", size)
    for y in range(-64, size[1], tile.height):
        for x in range(-120, size[0], tile.width):
            canvas.paste(tile, (x, y))
    # Align the grass slightly with the yard perspective.
    return canvas.filter(ImageFilter.GaussianBlur(0.35))


def add_depth_shading(turf, mask):
    w, h = turf.size
    shade = Image.new("L", (w, h), 0)
    px = shade.load()
    for y in range(h):
        # Darker in the foreground and left boundary shadow, lighter near the house.
        base = int(25 + 34 * (y / max(1, h - 1)))
        for x in range(w):
            left_shadow = max(0, 38 - int(x * 0.16))
            right_wall_shadow = 0
            if x > 650 and y > 310:
                right_wall_shadow = min(20, int((x - 650) * 0.12))
            px[x, y] = min(80, base + left_shadow + right_wall_shadow)
    shade = shade.filter(ImageFilter.GaussianBlur(18))
    dark = Image.new("RGB", (w, h), (0, 0, 0))
    turf = Image.composite(Image.blend(turf, dark, 0.18), turf, shade)

    # Add a subtle sunlight lift near the center so the lawn does not feel flat.
    light = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(light)
    draw.ellipse((235, 210, 760, 620), fill=46)
    light = light.filter(ImageFilter.GaussianBlur(80))
    warm = Image.new("RGB", (w, h), (215, 230, 165))
    turf = Image.composite(Image.blend(turf, warm, 0.13), turf, light)
    return turf


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    base = Image.open(BEFORE).convert("RGB")
    w, h = base.size

    # Hand-fitted yard polygon for Template01. It keeps the house, foundation,
    # concrete steps, left wall, and rear boundary visible while replacing only
    # the exposed soil with artificial turf.
    yard = [
        (4, 562),
        (827, 564),
        (827, 398),
        (781, 374),
        (724, 354),
        (655, 326),
        (558, 291),
        (438, 263),
        (318, 247),
        (180, 249),
        (86, 284),
        (26, 352),
        (2, 409),
    ]
    subtract = [
        # Right sweep-window concrete step.
        [(606, 332), (738, 350), (761, 388), (626, 388), (595, 364)],
        # Center small concrete step.
        [(454, 271), (492, 275), (503, 304), (461, 304), (446, 292)],
        # Rear AC/base area, kept slightly dirty instead of covering completely.
        [(528, 250), (575, 257), (587, 283), (540, 283)],
    ]
    mask = make_soft_polygon_mask((w, h), yard, subtract=subtract, blur=1.4)

    turf = make_tiled_texture((w, h))
    turf = add_depth_shading(turf, mask)

    result = Image.composite(turf, base, mask)

    # Blend a little original ground texture back in, so the lawn follows the
    # photo's lighting and does not look pasted on.
    ground_detail = ImageEnhance.Contrast(base).enhance(0.9).filter(ImageFilter.GaussianBlur(0.8))
    result = Image.composite(Image.blend(result, ground_detail, 0.08), result, mask.point(lambda p: int(p * 0.45)))

    # Clean final polish, no labels or debug overlays.
    result = ImageEnhance.Color(result).enhance(1.04)
    result = ImageEnhance.Contrast(result).enhance(1.02)
    result.save(OUT, quality=94, subsampling=1)
    print(OUT)


if __name__ == "__main__":
    main()
