# Shivam Enterprise — Website

Static one-page **company profile** for Shivam Enterprise, a yarn machine and mixture unit in Sachin, Surat. No build step, no
dependencies, no `npm install`. Open `index.html` or serve the folder.

Follows `design.md`: three colours only, three fonts, minimal and spacious.

> **This is not an online shop.** There are no prices, no cart, no product
> catalogue and no ordering. Visitors read what the business supplies and what
> services it offers, then get in touch. Please keep it that way when editing.

---

## 0. Still to confirm

These details were **not** available and have been left blank or generic on
purpose. Nothing below is invented — please fill it in.

| Item | Where | Current state |
|---|---|---|
| Business name | `SITE.business.name` | set to **"Shivam Enterprise"**. The signage still reads "Shivam Yarn" - that is the brand on the building |
| Year established | `SITE.business.established` | **blank** — no "since 19XX" claim is made |
| Email address | `SITE.contact.email` | **blank** — the email row is hidden rather than showing a dead `mailto:` |
| PIN code | 3rd line of `SITE.contact.address` | reads "Surat, Gujarat, India" without a PIN |
| Product list | `#what-we-sell` | only the 3 cards your signage confirms (TPM yarn, yarn machine & mixture, wide range) |
| Service list | `#services` | only yarn machine, yarn mixture, quality checking |
| Areas we serve | `SITE.areas` | still **placeholders** (Surat, Ahmedabad, Rajkot, Vadodara, Mumbai, Delhi NCR) |
| Second contact role | `SITE.contact.person.role` | blank, so the row is labelled just "Contact" |
| Social profiles | `SITE.contact.social` | blank, so the icon row is hidden |

Deliberate omissions rather than gaps: **business hours** and **GSTIN** are not
shown. Add them only if you want them public.

---

## 1. Preview locally

Opening `index.html` directly works, but serving it is closer to production:

```powershell
cd "D:\Shivam Enterprise"
python -m http.server 8000
```

Then open <http://localhost:8000>. The VS Code "Live Server" extension works
too.

---

## 2. What to replace

Everything below is a placeholder. There are only **three** places to edit.

### 2.1 `js/data.js` — the one file for business details

Search for `<-- REPLACE`. This is the single source of truth: the Location
panel, the Contact column, the footer, every `tel:` / `mailto:` link, the
WhatsApp button, the areas-served pills and the map are **all** generated from
it. You never need to touch contact details in the HTML.

| Value | Field |
|---|---|
| Business name | `SITE.business.name` (currently "Shivam Enterprise") |
| Tagline | `SITE.business.tagline` |
| Year established | `SITE.business.established` — blank, no claim is made |
| WhatsApp number | `SITE.contact.whatsapp` |
| Phone (shown) | `SITE.contact.phoneDisplay` |
| Phone (click-to-call) | `SITE.contact.phoneTel` |
| Email | `SITE.contact.email` — blank, so the row is hidden |
| Address | `SITE.contact.address` — one line per array item |
| Second contact person | `SITE.contact.person` (currently Vinod Patel) |
| Instagram / Facebook | `SITE.contact.social.instagram` / `.facebook` |
| Areas we serve | `SITE.areas` — one string per array item |
| Embedded map | `SITE.mapEmbed` |
| Form delivery | `SITE.form.endpoint` + `SITE.form.mode` |

**WhatsApp number format:** country code first, digits only, no `+`, no spaces.
India example: `919876543210` = `91` + `9876543210`.

**Social links:** leave a value as `""` and that icon is hidden. If both are
empty the whole row disappears, so the site never ships a dead `href="#"`.

**The map** points at 1075-1076, Diamond Eco-3, Gabeni Gam, Sachin, Surat. It needs no API key and no billing. Paste your address into the `?q=`
part:

```js
mapEmbed: "https://www.google.com/maps?q=YOUR+FULL+ADDRESS+HERE&output=embed"
```

A full `https://www.google.com/maps/embed?pb=...` share URL also works.

> **One trade-off to know about.** Because contact details are rendered by
> JavaScript from `data.js`, a crawler with JavaScript disabled sees them only
> in the `<noscript>` block. That block currently repeats the phone, email and
> address as plain text. Keep it in sync when you change them, or paste the
> details directly into the HTML instead. Google itself renders JavaScript, so
> this mainly affects older crawlers and text-only browsers.

### 2.2 `index.html` — page copy

| What | Where |
|---|---|
| Hero heading + sub-line | section `#home` |
| The four stat numbers | `.stats` |
| About story + checklist | section `#about` |
| The 3 "What We Sell" cards (name, description, pill) | section `#what-we-sell` |
| The 3 service entries (title, copy, icon) | section `#services` |
| Contact form labels + button text | section `#contact` |
| Footer tagline + quick links | `<footer>` |
| Canonical domain | `<link rel="canonical">` |

**The sell cards are plain HTML**, not generated — there is no products array
any more. To change one, edit its `<article class="card card--info">`. To add a
ninth, copy a whole `<article>`; the grid reflows on its own.

**Services** use `<article class="service">`. To add one, copy a whole article
and pick an icon `id` from the SVG sprite at the top of `index.html` (`#i-truck`,
`#i-tag`, `#i-swatch`, `#i-shield`, `...`).

**Testimonials:** a ready-made commented-out block sits directly above the
Contact section. Uncomment it and fill in the quotes. No CSS changes needed.

### 2.3 `images/` — real photography

| Slot | File | Size | Status |
|---|---|---|---|
| About | `images/company-unit.webp` | 800 × 600 | **real photo** of the company signage |
| Hero | `images/hero-yarn.svg` | 800 × 1000 | placeholder — swap for a yarn photo |
| Sell card 1 | `images/categories/dyed.svg` | 600 × 600 | placeholder |
| Sell card 2 | `images/categories/blended.svg` | 600 × 600 | placeholder |
| Sell card 3 | `images/categories/cotton.svg` | 600 × 600 | placeholder |

Spare placeholders, ready if you add more products: `images/categories/acrylic.svg`,
`crochet.svg`, `knitting.svg`, `raw.svg`, `wool.svg`, and `images/about-showroom.svg`.

The original upload is kept at
`images/e0ad2626-b1d3-4908-9331-b13c4fc1a305.jpg` (1536 × 1024, 180 KB). It is not
referenced by the page — delete it before deploying if you do not need it.

- Format **WebP** (or AVIF), each under ~80 KB. The real photo is 57 KB.
- Keep the same pixel dimensions, or update the `width`/`height` attributes in
  the HTML so the layout does not shift.
- Photograph on a light neutral background so the yarn colour reads clearly.
- Update the `alt` text — the placeholders still say "Placeholder image".

---

## 3. Turning on email for the contact form

Out of the box the form opens **WhatsApp** with the message pre-filled. That
works immediately, with nothing to configure.

To also receive messages by **email**:

1. Create a free account at <https://formspree.io>.
2. Create a form and point it at your business email.
3. Copy the endpoint it gives you, shaped like `https://formspree.io/f/abcdwxyz`.
4. In `js/data.js`:

```js
form: {
  endpoint: "https://formspree.io/f/abcdwxyz",
  mode: "email",
}
```

5. Confirm the activation email Formspree sends you — the first time only.

If the POST ever fails (offline visitor, Formspree outage) the form
**automatically falls back to WhatsApp**, so a message is never lost and the
visitor's typing is preserved.

The form has exactly four fields — name, phone, email, message. All are
required. There is deliberately no yarn-type dropdown and no quantity field.

---

## 4. Deploying

It is a plain static folder, so anything works. Drag it onto
[Netlify Drop](https://app.netlify.com/drop), or:

```powershell
npx vercel --prod
```

GitHub Pages, Cloudflare Pages, Hostinger, cPanel or any shared host all work
as-is. There is nothing to compile.

**Before going live:**
- [ ] Set the real domain in the `<link rel="canonical">` tag
- [ ] Replace every `<-- REPLACE` placeholder in `js/data.js`
- [ ] Replace the page copy in `index.html`
- [ ] Swap the placeholder images
- [ ] Add social URLs, or leave them empty to hide the icons
- [ ] Configure the Formspree endpoint if you want email delivery
- [ ] Keep the `<noscript>` contact text in sync (see §2.1)

---

## 5. File map

```
index.html              6 sections + inline SVG icon sprite
css/style.css           design tokens -> components -> responsive rules
js/data.js              <-- EDIT THIS for all business details
js/main.js              menu, scroll-spy, validation, form submit, rendering
images/                 10 in-palette placeholder SVGs
design.md               the visual design system (source of truth)
prompt.md               the build brief (source of truth)
```

### Sections and how they are built

| Section | `id` | Content source |
|---|---|---|
| Hero | `home` | static HTML |
| Stats | — | static HTML |
| About | `about` | static HTML |
| What We Sell | `what-we-sell` | static HTML cards + `images/categories/` |
| Services | `services` | static HTML articles |
| Location | `location` | `SITE.contact` + `SITE.areas` + `SITE.mapEmbed` |
| Contact | `contact` | `SITE.contact` + the form |

---

## 6. Design system notes

**Colour contract — only these 13 values may appear in the project:**

| Token | Hex | Contrast note |
|---|---|---|
| `--platinum` | `#edf2f4` | page background, 60% |
| `--lavender` | `#8d99ae` | section bands, 30% |
| `--indigo` | `#2b2d42` | buttons, headings, footer, 10% |
| `--indigo-300` | `#191b27` | accent hover / pressed |
| `--indigo-200` | `#11121a` | accent pressed, large numerals |
| `--indigo-700` | `#6d71a0` | text on Lavender Grey |
| `--lav-400` | `#697994` | muted text, input borders, icon strokes |
| `--lav-700` | `#bbc2cf` | decorative hairlines only |
| `--lav-900` | `#e8ebef` | disabled button fill |
| `--plat-600` | `#f0f4f6` | card background |
| `--plat-700` | `#f4f7f8` | alternate section background |
| `--plat-400` | `#b1c6cf` | hairline on light background |

Plus the two text shades sanctioned in `design.md` §2.4: `#4a4d72` (body) and
`#697994` (muted).

**Measured coverage at 1440 px** is **68% Platinum / 25% Lavender / 7% Indigo**.
The Lavender Grey band carries the stats strip, the What We Sell section and the
Location section; the two Lavender sections exist to move the ratio toward the
60/30/10 target without changing the palette.

**One deviation from `design.md`, deliberate.** §2.4 lists Lavender Grey
`#8d99ae` for muted text, but that is only **2.67:1** on Platinum and fails the
**4.5:1** minimum that §8 of the same document requires. Body and label text
therefore uses `#4a4d72` (**7.17:1**) and muted text uses Lavender Grey 400
`#697994` (**3.91:1**, large/bold and decorative only). Lavender Grey 400 is
also used for input borders (**3.91:1**) rather than Lavender Grey 700, since
form controls need 3:1 to be perceivable.

Text sitting **directly on** a Lavender Grey section uses Space Indigo instead
of Platinum — `.section--lav .lead` and `.section--lav .eyebrow` switch to
`--indigo-700`, which passes AA. The `.card--info` and `.location__panel`
surfaces keep their Platinum fill, so body copy on them is unaffected.

**Adding a colour:** there should never be a reason to. If you need a fourth
colour, it is a change to the brand, not to this site — update `design.md`
first, then add a token in the `:root` block at the top of `css/style.css`.

---

## 7. Accessibility & browser support

- Skip-to-content link, visible focus rings, full keyboard operation
- Every image has `alt` text and explicit `width`/`height`
- Form errors use bold Space Indigo text **plus** a warning icon **plus** a
  thicker border — never colour alone, and never red (`design.md` §5.4)
- Invalid fields are marked `aria-invalid`; the status line is `aria-live`
- Animations are disabled under `prefers-reduced-motion`
- `[hidden]` is forced to `display: none`, so JS can hide a component
  regardless of the `display` its CSS sets
- The map iframe is lazy-loaded and carries a `title` for screen readers
- Social icons are generated only when real URLs exist, so there is no
  keyboard-focusable dead link
- Works without JavaScript: all copy is static and contact details are
  duplicated in a `<noscript>` block
- Evergreen browsers. Uses `IntersectionObserver`, `fetch` and `FormData`;
  `fetch` has a WhatsApp fallback for older browsers rather than failing
  silently
