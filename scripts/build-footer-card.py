"""
Optimise the photo that sits INSIDE the single footer card.

Source of truth: images/footer-card-source.png
                  (1672x941 RGB, 1.69 MB) - the client-supplied artwork,
                  downloaded from the Cloudinary URL recorded in SRC_URL.

This is the second image in the footer, and it is a different problem from
build-footer-bg.py:

  - the BAND image (footer-bg.webp) is full-bleed behind everything, seen at
    34-58% under a Platinum veil, and no text sits directly on it
  - the CARD image is the surface the footer's text actually sits on, inside a
    pane that is roughly 1000x450 at desktop and much narrower on a phone

So it is emitted at a width that matches the card rather than the viewport, and
the veil it needs is heavier. Measured on this artwork, the true floor is
L=0.0031 (0.5% of the frame is near-black) and body text #4a4d72 needs a
background luminance of 0.5340 for 4.5:1. A Platinum veil below alpha 0.61
fails against those darkest pixels no matter how good it looks on average.
That arithmetic lives in css/style.css next to the rule it protects; see the
comment on .footer__glass for the solved numbers.

The veil is NOT baked in here, for the same reason as the band: the contrast
budget is measured against known values in the stylesheet, and baking a
fixed darkening into the pixels would make the two disagree the moment the
artwork is swapped.

No PNG fallback, same reasoning as the band: WebP has been in every major
browser since 2020, and .footer__glass keeps a flat Platinum `background-color`
underneath, so a decode failure degrades to a plain light card.

Run:  python scripts/build-footer-card.py     (needs Pillow)
Output is deterministic, so re-running is safe.
"""
import os
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "images" / "footer-card-source.png"
OUT = ROOT / "images" / "footer-card.webp"

# Where the artwork came from. Kept for provenance; nothing fetches at runtime.
SRC_URL = (
    "https://res.cloudinary.com/dgqd54pbl/image/upload/v1790442293/"
    "26adc4f4-e378-4af3-95e2-4ef74db4acd5_jnebwf.png"
)

# The card is inset inside .container, so it never needs viewport width. 1400
# covers the pane at 1x on a wide desktop with room to spare, and the source is
# 1672 px so this stays a downscale.
WIDTH = 1400

# Lower than the band's q=72: this one is viewed through a heavier veil, so
# banding in the smooth sky areas is even less visible, and the file is smaller.
QUALITY = 70


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

    if dst_bytes > 250_000:
        print()
        print("WARNING: over 250 KB for a decorative background. Lower QUALITY.")


if __name__ == "__main__":
    main()
