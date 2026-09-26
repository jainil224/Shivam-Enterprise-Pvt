"""
Optimise the footer background photo.

Source of truth: images/footer-bg-source.png
                  (2046x768 RGB, 1.58 MB) - the client-supplied artwork,
                  downloaded from the Cloudinary URL recorded in SRC_URL.

The band is decorative and sits behind a heavy Indigo scrim, so it never needs
to be pixel-perfect - but it is 2046 px of photographic detail painted across
the full width of every page, and the raw PNG was 1.58 MB. That is the same
mistake as shipping the 1.33 MB logo: a megabyte of decoration.

This emits a single WebP per breakpoint width. There is no PNG fallback on
purpose: WebP has been in every major browser since 2020, and the band keeps
its flat Indigo `background-color` underneath, so a decode failure degrades to
the plain dark band the footer already was - not to a broken layout.

The scrim is what makes this legible, and it is NOT applied here. The
footer's own text-contrast budget is measured against a known flat value, so
the darkening lives in css/style.css next to the rules it protects, not baked
into the pixels.

Run:  python scripts/build-footer-bg.py     (needs Pillow)
Output is deterministic, so re-running is safe.
"""
import os
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "images" / "footer-bg-source.png"
OUT = ROOT / "images" / "footer-bg.webp"

# Where the artwork came from. Kept for provenance; nothing fetches at runtime.
SRC_URL = (
    "https://res.cloudinary.com/dgqd54pbl/image/upload/v1790442276/"
    "ChatGPT_Image_Sep_26_2026_10_33_20_PM_bvwwln.png"
)

# The band is full-bleed. 1920 covers every desktop viewport at 1x; the source
# is 2046 wide so this is a slight downscale and never invents detail.
WIDTH = 1920

# q=72 is deliberate. The image is viewed at 12-88% opacity behind a scrim, so
# the difference between q=72 and q=88 is invisible while the byte count is not.
QUALITY = 72


def main():
    if not SRC.exists():
        raise SystemExit(
            "source artwork not found: %s\n"
            "Download it from:\n  %s" % (SRC, SRC_URL))

    im = Image.open(SRC).convert("RGB")
    src_bytes = os.path.getsize(SRC)
    print("source     : %dx%d  %s bytes" % (
        im.size[0], im.size[1], f"{src_bytes:,}"))
    print("aspect     : %.3f" % (im.size[0] / im.size[1]))

    if im.size[0] <= WIDTH:
        out = im
        print("note       : source is already <= %d px wide, not upscaled" % WIDTH)
    else:
        h = round(im.size[1] * WIDTH / im.size[0])
        out = im.resize((WIDTH, h), Image.LANCZOS)
        print("resized    : %dx%d" % out.size)

    out.save(OUT, "WEBP", quality=QUALITY, method=6)
    dst_bytes = OUT.stat().st_size

    print()
    print("output     : %s  %dx%d  %s bytes" % (
        OUT.name, out.size[0], out.size[1], f"{dst_bytes:,}"))
    print("reduction  : %.1f%%  (%s -> %s)" % (
        100 * (1 - dst_bytes / src_bytes), f"{src_bytes:,}", f"{dst_bytes:,}"))

    # Guard the thing that actually matters: if this ever ships at megabyte
    # size again, the build should say so rather than let it slide.
    if dst_bytes > 250_000:
        print()
        print("WARNING: over 250 KB for a decorative background. Lower QUALITY.")


if __name__ == "__main__":
    main()
