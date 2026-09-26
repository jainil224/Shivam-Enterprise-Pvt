# Shivam Enterprise — Website Design Document

## 1. Brand Overview

| Field | Detail |
|---|---|
| Business Name | Shivam Enterprise |
| Industry | Yarn Wholesale / Retail |
| Website Goal | Showcase products, build trust, let customers browse yarn types and easily contact/order |
| Design Approach | Simple, minimal, clean — content and product first, no visual clutter |
| Color Rule | Strict 3-color palette only, applied in 60% / 30% / 10% ratio |

The website should feel calm, trustworthy, and easy to navigate — like a well-organized yarn shop. No extra colors, no gradients, no decorative noise. Every color used must come from the 3 approved colors below.

---

## 2. Color System (60 / 30 / 10 Rule)

Only **3 colors** are used across the entire website. No other colors (no random blues, greens, reds) are allowed anywhere — not in icons, not in illustrations, not in charts.

### 2.1 The 3 Core Colors

| Role | Color Name | Hex | Usage % |
|---|---|---|---|
| Dominant (Background) | Platinum | `#edf2f4` | 60% |
| Secondary (Supporting/Sections) | Lavender Grey | `#8d99ae` | 30% |
| Accent (Buttons/CTA/Highlights) | Space Indigo | `#2b2d42` | 10% |

### 2.2 How the 60/30/10 Rule Applies

**60% — Platinum `#edf2f4` (Dominant)**
- Main page background
- Content section backgrounds
- Card backgrounds (default state)
- This color should be what the user sees "most of the screen" as — light, airy, clean

**30% — Lavender Grey `#8d99ae` (Secondary)**
- Section dividers / alternate section backgrounds (to create rhythm without adding a new color)
- Borders, dividers, and outlines
- Secondary text (subtext, captions, muted labels)
- Icons (default/inactive state)
- Navbar background (optional variant) or footer background
- Placeholder text in forms
- Disabled buttons / inactive states

**10% — Space Indigo `#2b2d42` (Accent)**
- Primary buttons ("Buy Now", "Contact Us", "Enquire", "Get Quote")
- Main headings (H1/H2) for strong emphasis
- Logo text
- Active navigation link/underline
- Icon highlight on hover
- Links and call-to-action text
- Important price tags or "In Stock" tags

⚠️ Rule of thumb: If a user takes a screenshot of any page, roughly 60% of the pixels should be Platinum, 30% Lavender Grey, and only about 10% Space Indigo. Space Indigo is reserved for things that need attention — buttons and key actions — not for decoration.

### 2.3 Extended Shade Reference (for hover/active states only)

Use these only as tints/shades of the same 3 colors for interactive states — never introduce a 4th color.

**Space Indigo (Accent) shades**
- Hover/Darker: `#191b27` (300)
- Pressed/Darkest: `#11121a` (200)
- Lighter tint (for accent backgrounds, e.g. tag chips): `#6d71a0` (700)

**Lavender Grey (Secondary) shades**
- Hover: `#697994` (400)
- Border default: `#bbc2cf` (700)
- Light background variant: `#e8ebef` (900)

**Platinum (Dominant) shades**
- Card slightly-off-white: `#f0f4f6` (600)
- Section alternate background: `#f4f7f8` (700)
- Divider hairline on light bg: `#b1c6cf` (400)

### 2.4 Text Color Rules

| Text Type | Color | Notes |
|---|---|---|
| Primary heading (H1, H2) | Space Indigo `#2b2d42` | Strong, high contrast on Platinum bg |
| Body text / paragraphs | Space Indigo (600) `#4a4d72` OR Lavender Grey 400 `#697994` | Slightly softer than pure headings, still readable |
| Secondary/muted text (captions, dates, meta) | Lavender Grey `#8d99ae` | Lower visual weight |
| Text on dark (Space Indigo) background | Platinum `#edf2f4` | Buttons, footer if dark |
| Links | Space Indigo `#2b2d42`, underline on hover | Keep same accent, don't add new color |

**Contrast check:** Space Indigo text (`#2b2d42`) on Platinum background (`#edf2f4`) gives strong readability (dark-on-light) — ideal for headings and body copy.

---

## 3. Typography

**Three families total: one UI sans, two display faces used together in the hero
headline only.** Everything below the H1 is Inter.

| Element | Font | Weight | Color |
|---|---|---|---|
| Logo / Brand Name | Inter | 600–700 | Space Indigo |
| **H1 (hero headline)** | **Source Serif 4 + Instrument Serif mixed** | **700 roman / 400 italic** | Space Indigo |
| H2 (Section titles) | Inter | 600 | Space Indigo |
| H3 (Card titles / product names) | Inter | 600 | Space Indigo |
| Body text | Inter / system-ui | 400 (Regular) | Space Indigo 600 or Lavender Grey 400 |
| Button text | Inter | 500–600 | Platinum (on Space Indigo button) |
| Captions / labels | Inter | 400, smaller size | Lavender Grey |

**The hero headline is a two-font editorial mix.** Words alternate between the
two display faces, set inline on two forced lines:

```
Quality  Yarn.  Reliable Supply.
Trusted  by Businesses.
```

- `.font-source-serif` → Source Serif 4, `normal`, **700** — the structural words
- `.font-serif-italic` → Instrument Serif, `italic`, **400** — the accent words
- `.hero__title-line` → `display: block`, forces the line break between the two lines
- `.hero__title` itself sets **no** `font-family`; each word span picks its own

**Rules:**
- Both display faces are used **only** inside `.hero__title`. Do not apply them
  to H2, H3, buttons or body copy.
- Instrument Serif is a single weight (400). It is only ever used in *italic*,
  so it never needs a faux bold. Never set it to 500+ anywhere.
- Source Serif 4 is a variable font; use weight 700 for the roman accent words.
- Do not add a fourth family. Inter is loaded at 400/500/600/700 — stay within
  those four weights.

**Font sizing scale (suggested, rem-based):**
- H1: 2.5rem (40px) — the hero is `clamp(2.25rem, 5.8vw, 3.25rem)`, larger than
  the base H1 because serif faces read smaller than Inter at the same size
- H2: 1.875rem (30px)
- H3: 1.25rem (20px)
- Body: 1rem (16px)
- Caption/small: 0.875rem (14px)

**Loading (Google Fonts):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=Source+Serif+4:ital,opsz,wght@0,8..60,400..700;1,8..60,400..700&display=swap" rel="stylesheet">
```
Use `<link>` tags rather than an `@import` in CSS: it starts the download in
parallel with the stylesheet instead of after it.

Note: `Instrument+Serif:ital@0;1` **is** required — the hero uses the italic
face. `Source+Serif+4` requests italic too; that half is currently unused and
can be dropped to `wght@0,8..60,400..700;1,8..60,400..700` → `wght@0,8..60,400..700`
if you want to save the request.

---

## 4. Layout & Spacing Principles

- **Grid:** 12-column responsive grid, generous white space (Platinum) between sections
- **Max content width:** ~1200px, centered, with padding on smaller screens
- **Section spacing:** Minimum 64–96px vertical padding between major sections (desktop), 40–56px on mobile
- **Card spacing:** 16–24px internal padding, 24px gap between grid cards
- **Alignment:** Left-aligned text blocks for readability; center-aligned only for hero section and section intros
- **Whitespace usage:** Since Platinum (60%) dominates, let it "breathe" — don't crowd elements. Minimalism relies on space, not just color count.

---

## 5. Core UI Components

### 5.1 Navbar
- Background: Platinum (or Platinum 600 `#f0f4f6` for subtle separation)
- Logo text: Space Indigo, bold
- Nav links: Space Indigo 600 text, Lavender Grey when inactive/default
- Active link: Space Indigo with underline or bottom border accent
- Bottom border: 1px Lavender Grey hairline (`#bbc2cf`) to separate navbar from content
- CTA button in navbar (e.g. "Contact Us"): Space Indigo background, Platinum text

### 5.2 Buttons
| Type | Background | Text | Border | Hover |
|---|---|---|---|---|
| Primary (main CTA) | Space Indigo `#2b2d42` | Platinum `#edf2f4` | none | Darker Indigo `#191b27` |
| Secondary (outline) | Transparent | Space Indigo | 1px Space Indigo | Fills light Lavender Grey tint |
| Disabled | Lavender Grey 900 `#e8ebef` | Lavender Grey `#8d99ae` | none | n/a |

Buttons should have rounded corners (6–10px radius), medium padding (12px × 24px), no shadows or minimal soft shadow only if needed for elevation.

### 5.3 Cards (Product Cards for Yarn Items)
- Background: Platinum / Platinum 600
- Border: 1px Lavender Grey hairline OR subtle shadow (no color shadow, just neutral grey shadow at low opacity)
- Product image area: neutral, let yarn product photos be the "color" of the page (this is allowed — product photography is real content, not decorative UI color)
- Product name: H3, Space Indigo
- Price: Bold, Space Indigo
- "View" / "Enquire" button: Primary button style (Space Indigo)
- Category tag (e.g. "Cotton Yarn", "Wool"): small pill, Lavender Grey background, Space Indigo text

### 5.4 Forms (Contact / Enquiry Form)
- Input background: Platinum 600 or white-ish platinum
- Input border: Lavender Grey 700 (`#bbc2cf`)
- Input border on focus: Space Indigo
- Placeholder text: Lavender Grey
- Submit button: Primary button (Space Indigo)
- Error text: Keep within palette — use Space Indigo bold text or an icon indicator rather than introducing red. (If a status color is absolutely required for error/success, note it as an approved exception — otherwise rely on icons/text like "✕ Invalid" in Space Indigo.)

### 5.5 Footer
- Background: Space Indigo (this is where the 10% accent can also live as a strong footer band) OR Lavender Grey — background: Lavender Grey 100/dark variant if a dark footer is preferred
- Text: Platinum (light text on dark background)
- Links: Platinum with hover to Lavender Grey 800
- Divider lines: subtle Lavender Grey at low opacity

### 5.6 Icons
- Style: Simple line icons (outline style, not filled), consistent stroke width
- Default color: Lavender Grey
- Active/hover color: Space Indigo
- No multi-color icon sets

---

## 6. Imagery Guidelines

- Product photography (yarn skeins, balls, colors) is the only place where "real world color variety" appears — this is acceptable since it's actual product content, not UI decoration
- Use clean, well-lit product photos on neutral (Platinum) backgrounds so the yarn colors stand out naturally without needing colorful UI around them
- Avoid colorful banners, gradients, or illustrations that compete with product photos
- Hero section: one high-quality yarn/product image or a simple textured yarn photo, paired with Space Indigo heading text on a Platinum background

---

## 7. Suggested Pages / Sections (to be detailed further when you share full requirements)

1. **Home** — Hero, About snippet, Featured yarn categories, Why Choose Us, CTA
2. **About Us** — Company story, years in business, mission
3. **Products / Catalog** — Yarn categories (cotton, wool, acrylic, etc.), filter by type/color/weight
4. **Product Detail** — Single yarn product with specs, images, enquiry button
5. **Contact Us** — Form, phone, WhatsApp, address, map
6. **Gallery** (optional) — Photos of stock, factory, or workspace

*(Full feature list and page-by-page content will be detailed in the next prompt as you mentioned.)*

---

## 8. Accessibility & Consistency Rules

- Maintain minimum text contrast ratio of 4.5:1 (Space Indigo on Platinum passes comfortably)
- Never use color alone to convey meaning (pair with text/icons)
- Keep consistent spacing, font sizes, and button styles across every page
- No more than 3 colors anywhere in the UI (excluding real product photography)
- Consistent border-radius and shadow style across all components

---

## 9. Design Summary (Quick Reference)

```
Primary Background   : #edf2f4  (Platinum)      → 60%
Secondary/Sections   : #8d99ae  (Lavender Grey) → 30%
Accent/Buttons/CTA   : #2b2d42  (Space Indigo)  → 10%

Headings Text        : #2b2d42
Body Text            : #4a4d72 / #697994
Muted/Caption Text   : #8d99ae
Button Text (on dark): #edf2f4

Font                 : Inter 400/500/600/700 (all UI + headings) +
                       Source Serif 4 700 + Instrument Serif 400 italic
                       (hero headline only, mixed per word)
Style                : Minimal, spacious, no gradients, no extra colors
```

---

*This document defines the visual design system only. Once approved, the next step will cover detailed website structure, page-by-page features, and content requirements for Shivam Enterprise's yarn business website.*