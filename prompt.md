# Website Build Prompt — Shivam Enterprise (Yarn Business)

This document is the full build brief for the Shivam Enterprise website. It follows the visual system defined in `design.md` (Platinum 60% / Lavender Grey 30% / Space Indigo 10%). Use this as the single source of truth when building the site.

---

## 1. Project Summary

- **Business:** Shivam Enterprise
- **Industry:** Yarn — wholesale & retail (cotton, wool, acrylic, blended yarns, etc.)
- **Website Type:** Single business/catalog website (not full e-commerce checkout — enquiry/contact-based ordering, unless stated otherwise below)
- **Platform:** Responsive website (mobile, tablet, desktop) — single-page or multi-section scroll site, built as clean HTML/CSS (+ light JS), OR multi-page if preferred (see Section 3)
- **Tone:** Trustworthy, established, simple — a business that has been selling quality yarn and wants to look professional online
- **Design Reference:** Strictly follow `design.md` — only 3 colors (`#edf2f4`, `#8d99ae`, `#2b2d42`), Inter/Poppins font, minimal spacing-driven layout, no gradients, no extra colors except real product photos

---

## 2. Goals of the Website

1. Establish credibility for Shivam Enterprise as a serious yarn supplier
2. Showcase yarn product categories clearly (type, material, weight/thickness, color range)
3. Make it effortless for a customer/retailer to enquire or place a bulk order
4. Provide easy contact via phone, WhatsApp, and email
5. Be fast-loading, mobile-friendly (many customers may browse on phone), and easy to update later

---

## 3. Site Structure

Choose **one-page scroll site** (recommended for a simple minimal business site) with anchor navigation, OR a **multi-page site**. Default recommendation: **one-page site** with these sections in order:

1. Navbar (sticky)
2. Hero Section
3. About Us
4. Product Categories (Yarn Types)
5. Why Choose Us
6. Product Gallery / Featured Products
7. Testimonials (optional, if available)
8. Contact / Enquiry Form
9. Footer

If a multi-page structure is preferred instead, split into: `Home`, `About`, `Products`, `Contact` — reuse the same sections but distributed across pages.

---

## 4. Section-by-Section Detail

### 4.1 Navbar
- Left: Logo — "Shivam Enterprise" (text-based logo is fine, Space Indigo, bold, Inter/Poppins semi-bold)
- Center/Right: Nav links — `Home | About | Products | Why Us | Contact`
- Right-most: CTA button — **"Enquire Now"** (Primary button style: Space Indigo bg, Platinum text)
- Sticky on scroll, background Platinum with a subtle bottom hairline border (Lavender Grey)
- Mobile: collapses into a hamburger menu (Space Indigo icon)

### 4.2 Hero Section
- Large heading (H1): e.g. *"Premium Quality Yarn for Every Craft"* (placeholder — replace with your actual tagline)
- Subheading: 1–2 lines about the business, e.g. *"Shivam Enterprise supplies premium cotton, wool, and acrylic yarns to retailers and manufacturers across [region]."*
- Two buttons: 
  - Primary: "View Products" (scrolls to Products section)
  - Secondary (outline): "Contact Us"
- Right/background: A clean product photo (yarn skeins/balls) — real photography provides the "color" here, keeping UI itself neutral
- Background: Platinum

### 4.3 About Us
- Short business story: how long Shivam Enterprise has been operating, what makes it trustworthy
- Key stats row (optional): e.g. "X+ Years in Business", "X+ Yarn Varieties", "X+ Happy Clients" — displayed as simple number + label blocks, Space Indigo numbers, Lavender Grey labels
- Optional: photo of shop/warehouse/founder

**Fields to fill in (please provide):**
- Year established
- Number of yarn varieties/products
- Number of clients/retailers served
- Any certifications or specializations (e.g. handloom yarn, export quality, etc.)

### 4.4 Product Categories (Yarn Types)
Display as a card grid (3–4 columns desktop, 1–2 mobile). Each card = one yarn category.

**Suggested categories (edit to match your actual stock):**
- Cotton Yarn
- Wool Yarn
- Acrylic Yarn
- Blended Yarn
- Knitting Yarn
- Crochet Yarn
- Dyed / Colored Yarn
- Raw / Undyed Yarn

Each card includes:
- Product photo
- Category name (H3, Space Indigo)
- 1-line description
- Small tag/pill (e.g. "Wholesale Available") — Lavender Grey background, Space Indigo text
- "View Details" or "Enquire" button

**Fields to fill in:**
- Actual list of yarn types you sell
- Whether you sell by weight (kg), by roll, by color-lot, etc.
- Minimum order quantity (MOQ) for wholesale, if any

### 4.5 Why Choose Us
Simple 3–4 column icon + text layout (no photos needed here, just clean icons in Lavender Grey/Space Indigo):
- Quality Assurance
- Bulk/Wholesale Supply
- Wide Color & Material Range
- Timely Delivery
- Competitive Pricing
- Years of Trusted Experience

(Pick 4–6 points that are actually true for your business — replace placeholders.)

### 4.6 Product Gallery / Featured Products
- Grid of individual product photos (not just categories) — e.g. specific yarn rolls/colors currently in stock
- Optional filter buttons at top: "All | Cotton | Wool | Acrylic | Blended" (simple JS filter, no reload)
- Each item: image, name, price (if you want to display pricing) or "Contact for Price", Enquire button

**Fields to fill in:**
- Do you want prices shown publicly, or "Contact for Price" only?
- List of actual products/photos to feature (you can send images separately)

### 4.7 Testimonials (Optional)
- If you have client/retailer feedback, show 2–3 short quotes in simple cards
- Skip this section entirely if no testimonials are available yet

### 4.8 Contact / Enquiry Section
- Left side: Contact details
  - Phone number (click-to-call)
  - WhatsApp button (click-to-chat link)
  - Email address
  - Business address
  - Business hours
  - Embedded Google Map (if address is provided)
- Right side: Enquiry form
  - Fields: Name, Phone, Email, Yarn Type interested in (dropdown), Quantity needed, Message
  - Submit button (Primary style)
  - Form should send to your business email (needs backend/email service like Formspree, or a `mailto:` fallback if no backend)

**Fields to fill in:**
- Phone number
- WhatsApp number
- Email address
- Full business address
- Business hours
- Google Maps link (if available)

### 4.9 Footer
- Background: Space Indigo (dark accent footer) with Platinum text
- Columns: 
  - Logo + short tagline
  - Quick links (Home, About, Products, Contact)
  - Contact info repeated (phone, email, address)
  - Social media icons (if applicable — Instagram/Facebook for product photos)
- Bottom line: "© 2026 Shivam Enterprise. All Rights Reserved."

---

## 5. Functionality Requirements

- Fully responsive (mobile-first, breakpoints for tablet ~768px and desktop ~1200px)
- Smooth scroll navigation for anchor links
- Sticky navbar with active-section highlighting
- Product filter (JS, no page reload) if using a single product gallery
- Click-to-call phone number (`tel:` link)
- Click-to-chat WhatsApp button (`https://wa.me/<number>` link)
- Contact form validation (required fields, valid email/phone format)
- Fast load: optimized/compressed images, no heavy animation libraries
- No pop-ups, no auto-playing sound/video — keep it clean and minimal
- Basic SEO: proper `<title>`, meta description, alt text on all images, semantic HTML (`<header>`, `<section>`, `<footer>`)

---

## 6. Design System To Follow (Recap from design.md)

```
Background (60%)  : #edf2f4  Platinum
Sections/Secondary (30%) : #8d99ae  Lavender Grey
Buttons/Accent (10%) : #2b2d42  Space Indigo

Headings : Space Indigo, Inter/Poppins Bold
Body text: Space Indigo (#4a4d72) or Lavender Grey (#697994)
Buttons  : Space Indigo bg + Platinum text (primary), outline style (secondary)
Font     : Inter or Poppins only, max 2–3 weights
Style    : Minimal, spacious, no gradients, no shadows except subtle neutral card shadow
Icons    : Line-style only, Lavender Grey default / Space Indigo active
```

Do not introduce any color outside these 3 (and their tint/shade variants listed in design.md) anywhere in the UI — only real product photography may show natural yarn colors.

---

## 7. Information Needed From You Before Final Build

To make this site accurate (not placeholder text), please provide:

1. Business tagline / short description (1–2 lines)
2. Year the business was established
3. Full list of yarn types/categories you sell
4. Whether pricing should be public or "Contact for Price"
5. Minimum order quantity (MOQ), if applicable for wholesale
6. Phone number, WhatsApp number, email
7. Full business address + Google Maps link (if any)
8. Business working hours
9. Any product photos or a logo file (if you have one)
10. Social media links (Instagram/Facebook), if applicable
11. Any client testimonials (optional)
12. Preference: one-page scrolling site vs. multi-page site

---

## 8. Deliverable

Once the above details are provided, the final output will be a fully coded, responsive website (HTML/CSS/JS or React, as preferred) strictly following the 3-color design system from `design.md`, ready to preview and publish.