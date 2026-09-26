"""
Optimise the navbar logo.

Source of truth: images/ChatGPT Image Sep 26, 2026, 08_24_03 PM.png
                 (1124x1399 RGBA, 1.33 MB) - the artwork supplied by the client.

The page was downloading that whole 1.33 MB file to paint a mark roughly
39x48 CSS px in the navbar. This script crops to the true ink bounds, then
emits 1x/2x/3x WebP + PNG at the size the browser actually paints, so a
visitor fetches 2-27 KB instead of 1.33 MB.

The artwork is PORTRAIT (ink aspect ~0.81), not a wide wordmark. It is
reproduced in full and never recomposed: cropping or re-flowing a logo is a
design decision for the client, so this script only removes empty canvas.
If a horizontal lockup is wanted, get one from the designer and point
SRC at it.

Run:  python scripts/build-logo-assets.py     (needs Pillow)
Output is deterministic, so re-running is safe.
"""
import os
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "images" / "ChatGPT Image Sep 26, 2026, 08_24_03 PM.png"
OUT = ROOT / "images"

PAD = 8

# CSS box for the navbar logo. Deliberately matches the artwork's own aspect
# (~0.81) so object-fit never letterboxes the mark inside a wider empty box -
# that is what left ~100px of dead space next to the logo at 140x48.
DISPLAY_W, DISPLAY_H = 39, 48
SCALES = (1, 2, 3)


def main():
    if not SRC.exists():
        raise SystemExit("source artwork not found: %s" % SRC)

    im = Image.open(SRC).convert("RGBA")
    print("source      : %dx%d  %s bytes" % (
        im.size[0], im.size[1], f"{os.path.getsize(SRC):,}"))

    bbox = im.getchannel("A").getbbox()
    if bbox is None:
        raise SystemExit("source has no visible pixels")
    l, t, r, b = bbox
    l, t = max(0, l - PAD), max(0, t - PAD)
    r, b = min(im.size[0], r + PAD), min(im.size[1], b + PAD)
    crop = im.crop((l, t, r, b))
    print("ink bbox    : x %d..%d y %d..%d -> %dx%d" % (
        bbox[0], bbox[2], bbox[1], bbox[3],
        bbox[2] - bbox[0], bbox[3] - bbox[1]))
    print("cropped     : %dx%d  (aspect %.4f)" % (
        crop.size[0], crop.size[1], crop.size[0] / crop.size[1]))
    print("display box : %dx%d  (aspect %.4f)" % (
        DISPLAY_W, DISPLAY_H, DISPLAY_W / DISPLAY_H))
    print()

    total = 0
    for s in SCALES:
        w, h = DISPLAY_W * s, DISPLAY_H * s
        # LANCZOS downscale: 1116x1384 source into a 117x144 target, so this
        # is always a downscale and never invents detail.
        out = crop.resize((w, h), Image.LANCZOS)
        png_p = OUT / ("logo-%dx.png" % s if s > 1 else "logo.png")
        webp_p = OUT / ("logo-%dx.webp" % s if s > 1 else "logo.webp")
        out.save(png_p, "PNG", optimize=True)
        out.save(webp_p, "WEBP", quality=88, method=6)

        alpha = out.getchannel("A")
        ink = sum(1 for px in alpha.get_flattened_data() if px >= 8) / (w * h)
        lo, hi = alpha.getextrema()
        if lo == 0 and hi < 250:
            raise SystemExit("%s lost its alpha channel" % png_p.name)
        print("  %-14s %3dx%-3d  png %6s  webp %6s   ink %5.1f%%  alpha %d-%d" % (
            png_p.name, w, h, f"{png_p.stat().st_size:,}",
            f"{webp_p.stat().st_size:,}", ink * 100, lo, hi))
        total += png_p.stat().st_size + webp_p.stat().st_size

    src_bytes = os.path.getsize(SRC)
    one = min((OUT / "logo.webp").stat().st_size, (OUT / "logo-3x.webp").stat().st_size)
    print()
    print("all six derivatives : %s bytes" % f"{total:,}")
    print("source PNG          : %s bytes" % f"{src_bytes:,}")
    print("a visitor downloads ONE derivative: %s - %s bytes" % (
        f"{one:,}", f"{(OUT / 'logo-3x.png').stat().st_size:,}"))
    print("reduction           : %.1f%% (1x webp)" % (100 * (1 - one / src_bytes)))


if __name__ == "__main__":
    main()
