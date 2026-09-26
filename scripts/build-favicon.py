"""
Build the favicon from the client's own artwork.

Source of truth: images/Sivam_Enterprise_Logo_Transparent.svg
That file is a 1.85 MB SVG wrapper around a 941x1672 base64 PNG - it contains
zero <path> elements, so there is no vector to extract. Pointing <link rel=icon>
at it directly would make every visitor download 1.85 MB to paint a 16-32 px
glyph, and the artwork is PORTRAIT (ink aspect 0.736), so a full lockup inside a
square browser tab is an unreadable sliver.

This script therefore unpacks the embedded PNG, crops a square emblem, and emits
real favicon sizes (a few KB total).

TWO CANDIDATE CROPS are emitted, because the emblem and the wordmark in this
artwork form one continuous mass - there is no empty seam to detect between
them, so the split point is a judgement call that needs a human eye:
  emblem  - the upper mark only, square  (the conventional favicon)
  lockup  - the whole logo, padded square (legible, but small in the tab)
Check them in logo-check.html and keep one.

Crop bounds are measured from the artwork, not hardcoded per-run; the SPLIT
fraction below is the single knob to turn if the wrong region is chosen.

Run:  python scripts/build-favicon.py     (needs Pillow)
Output is deterministic, so re-running is safe.
"""
import base64
import binascii
import io
import re
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "images" / "Sivam_Enterprise_Logo_Transparent.svg"
OUT = ROOT / "images"

# Fraction of the artwork's ink height treated as the emblem. The ink runs
# y236-1489; fill is ~45% through the upper mark and peaks at 87% across the
# wordmark, so ~0.62 is where the wordmark takes over.
SPLIT = 0.62

# Breathing room around the cropped ink, as a fraction of its side.
PAD = 0.06

# Sizes a browser actually asks for.
PNG_SIZES = (16, 32, 48, 180)
SVG_SIZE = 64


def unpack_svg_raster(svg_text):
    """Pull the embedded PNG bytes out of the SVG wrapper."""
    m = re.search(r"base64,([^\"]+)", svg_text)
    if not m:
        raise SystemExit("no base64 image payload found in %s" % SRC)
    try:
        return base64.b64decode(m.group(1))
    except binascii.Error as exc:
        raise SystemExit("embedded payload is not valid base64: %s" % exc)


def ink_bbox(img, box=None):
    """Bounding box of pixels that are actually visible."""
    alpha = img.getchannel("A")
    if box:
        alpha = alpha.crop(box)
    return alpha.getbbox()


def square_from(img, crop):
    """Trim to `crop`, then centre the result on a square canvas with padding."""
    piece = img.crop(crop)
    box = ink_bbox(piece)
    if not box:
        raise SystemExit("crop %s is empty" % (crop,))
    piece = piece.crop(box)

    side = max(piece.size)
    side = int(round(side * (1 + PAD * 2)))
    canvas = Image.new("RGBA", (side, side), (255, 255, 255, 0))
    canvas.alpha_composite(piece, ((side - piece.width) // 2, (side - piece.height) // 2))
    return canvas


def resample_to(canvas, size):
    return canvas.resize((size, size), Image.LANCZOS)


def write_svg(path, png_bytes, size):
    """A tiny SVG favicon that embeds the already-downscaled PNG.

    An SVG favicon is not smaller than a PNG here, but it scales cleanly and
    keeps the single <link> working in browsers that ignore the PNG sizes.
    """
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" '
        'width="%d" height="%d"><image width="%d" height="%d" '
        'href="data:image/png;base64,%s"/></svg>'
        % (size, size, size, size, size, size, base64.b64encode(png_bytes).decode("ascii"))
    )
    path.write_text(svg, encoding="utf-8")


def main():
    raw = unpack_svg_raster(SRC.read_text(encoding="utf-8", errors="replace"))
    src = Image.open(io.BytesIO(raw)).convert("RGBA")
    print("source artwork: %dx%d %s" % (src.width, src.height, src.mode))

    full = ink_bbox(src)
    if not full:
        raise SystemExit("source artwork is fully transparent")
    x0, y0, x1, y1 = full
    print("ink bounds: x%d-%d y%d-%d" % (x0, x1, y0, y1))

    split_y = int(round(y0 + (y1 - y0) * SPLIT))
    crops = {
        "emblem": (x0, y0, x1, split_y),
        "lockup": (x0, y0, x1, y1),
    }

    for variant, crop in crops.items():
        square = square_from(src, crop)
        stem = "favicon" if variant == "emblem" else "favicon-lockup"
        for s in PNG_SIZES:
            out = OUT / ("%s-%d.png" % (stem, s))
            resample_to(square, s).save(out, "PNG", optimize=True)
            print("  wrote %-34s %7d B" % (out.name, out.stat().st_size))
        buf = io.BytesIO()
        resample_to(square, SVG_SIZE).save(buf, "PNG", optimize=True)
        svg_out = OUT / ("%s.svg" % stem)
        write_svg(svg_out, buf.getvalue(), SVG_SIZE)
        print("  wrote %-34s %7d B" % (svg_out.name, svg_out.stat().st_size))
        print("     %s crop y%d-%d -> %dx%d square" % (variant, crop[1], crop[3], square.width, square.height))


if __name__ == "__main__":
    main()
