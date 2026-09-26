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

Outputs
-------
footer-card.webp          1400x788  desktop/tablet: the whole artwork, for a
                                    card that is wider than it is tall
footer-card-mobile.webp   680x941   phone only: a PORTRAIT crop, because the
                                    card inverts to ~0.38 aspect when the
                                    columns stack and `cover` would otherwise
                                    keep a ~21%-wide vertical smear

Why the phone crop exists, and why it is cut from the LEFT
--------------------------------------------------------
The artwork is 1.78 landscape and 45% of its width (x 68-90%) is a near-black
block: measured floor L=0.0000, and 0.5% of the frame sits below L=0.02. That
block is what forced the 0.66-0.80 veil, which in turn is what makes the photo
look washed out on a phone.

Measured per-column floors show the usable region is x 0-744, where the floor
is 0.25-0.53. A crop taken from there needs only a ~0.45 veil, so the phone
gets a visibly stronger image at the same contrast - the veil is sized to the
crop, not inherited from the desktop one.

Note on the "detail" metric when auditing this crop: local-detail energy is
HIGHEST at x 1100+, but that is the hard edge of the black block, not a
subject. Do not let a detail-maximising crop pick the right-hand side.

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

# The phone image is a SEPARATE upload, not a crop of the desktop one. Desktop
# and phone were supplied as different photographs, so they are built from
# different sources and can be re-pointed independently.
MOBILE_SRC = ROOT / "images" / "footer-card-mobile-source.png"
OUT_MOBILE = ROOT / "images" / "footer-card-mobile.webp"

# Where the artwork came from. Kept for provenance; nothing fetches at runtime.
SRC_URL = (
    "https://res.cloudinary.com/dgqd54pbl/image/upload/v1790442293/"
    "26adc4f4-e378-4af3-95e2-4ef74db4acd5_jnebwf.png"
)
MOBILE_SRC_URL = (
    "https://res.cloudinary.com/dgqd54pbl/image/upload/v1790446918/"
    "ChatGPT_Image_Sep_26_2026_11_51_34_PM_jggkss.png"
)

# The card is inset inside .container, so it never needs viewport width. 1400
# covers the pane at 1x on a wide desktop with room to spare, and the source is
# 1672 px so this stays a downscale.
WIDTH = 1400

# Lower than the band's q=72: this one is viewed through a heavier veil, so
# banding in the smooth sky areas is even less visible, and the file is smaller.
QUALITY = 70

# ---- phone image ------------------------------------------------------------
# The phone source is 941x1672 portrait. We preserve the full composition
# (draped fabric at top, spun cotton filaments, and the central cotton boll)
# by scaling to 750px wide rather than cropping out the flower.
WIDTH_MOBILE = 750


def main():
    if not SRC.exists():
        raise SystemExit(
            "source artwork not found: %s\n"
            "Download it from:\n  %s" % (SRC, SRC_URL))
    if not MOBILE_SRC.exists():
        raise SystemExit(
            "phone artwork not found: %s\n"
            "Download it from:\n  %s\n"
            "(the desktop and phone photos are separate uploads)"
            % (MOBILE_SRC, MOBILE_SRC_URL))

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

    # ---- phone image --------------------------------------------------------
    mob_im = Image.open(MOBILE_SRC).convert("RGB")
    mw, mh = mob_im.size
    target_h = round(mh * WIDTH_MOBILE / mw)
    mob = mob_im.resize((WIDTH_MOBILE, target_h), Image.LANCZOS)
    mob.save(OUT_MOBILE, "WEBP", quality=75, method=6)
    mob_bytes = OUT_MOBILE.stat().st_size

    # Report the crop's real floor, so the CSS veil is a measured number rather
    # than a guess. This is the value that has to clear 4.5:1 for body text.
    def lin(c):
        c = c / 255.0
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4

    def lum(rgb):
        r, g, b = rgb
        return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)

    def over(base, a):
        return base * (1 - a) + PLAT * a

    def ratio(a, b):
        return (max(a, b) + 0.05) / (min(a, b) + 0.05)

    lums = sorted(lum(p) for p in mob.resize((96, 96)).getdata())
    floor = lums[0]
    p1 = lums[int(len(lums) * 0.01)]
    plat = lum((0xED, 0xF2, 0xF4))
    body = lum((0x4A, 0x4D, 0x72))
    need = 4.5 * (body + 0.05) - 0.05
    a_floor = (need - floor) / (plat - floor) if plat > floor else 0.0
    a_p1 = (need - p1) / (plat - p1) if plat > p1 else 0.0

    print()
    print("phone image: %s  %dx%d  %s bytes  (aspect %.3f)" % (
        OUT_MOBILE.name, mob.size[0], mob.size[1], f"{mob_bytes:,}",
        mob.size[0] / mob.size[1]))
    print("             floor %.4f   p1 %.4f" % (floor, p1))

    if mob_bytes > 120_000:
        print()
        print("WARNING: over 120 KB for a phone background. Lower QUALITY.")


if __name__ == "__main__":
    main()
