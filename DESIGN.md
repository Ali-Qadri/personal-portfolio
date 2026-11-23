# Ali Qadri: design system

The visual system behind the portfolio, written so it can be reused for social posts, carousels, reels and slides. The website's source of truth is `Assets/css/tokens.css`; this file translates it into values you can type into Figma, Canva or any design tool.

**In one line:** a precise grey-on-white sheet, one typeface, ruled lines instead of boxes, and the real product doing the talking.

---

## 1. Principles

1. **Greys only.** Near-black ink on near-white paper. No brand colour. Colour only comes from real product screenshots.
2. **One typeface.** Manrope, in three weights. Hierarchy comes from size and weight, never from a second font.
3. **Ruled, not boxed.** Sections and lists are separated by thin horizontal lines (hairlines). Cards and drop shadows are rare.
4. **Show the work.** Every post leads with something real: a screenshot, a demo clip, a step of the process, a real fact.
5. **Big and few.** One idea per post, set large. Fewer words, bigger type.

---

## 2. Colour

| Role | Hex | Use |
|---|---|---|
| Paper | `#FAFAFC` | Main background |
| Paper 2 | `#F1F2F4` | Tinted band or panel (alternate slides, wells) |
| Paper 3 | `#E6E7EA` | Image placeholders, inline code background |
| Ink | `#17181B` | Headlines, body text, primary buttons, dark panels |
| Ink 2 | `#3B3D40` | Secondary text, lead paragraphs |
| Muted | `#5E6064` | Captions, labels, meta text |
| Rule | `#D3D4D7` | Light hairlines between rows |
| Rule strong | `#A3A5A8` | Stronger dividers, step numbers |

**Balance:** about 85% paper, 10% ink text, 5% dark panels. A fully dark slide (Ink background, Paper text) is allowed once per carousel as an accent, like the "Back to 01" step on the site.

**Never:** pure `#000000` or `#FFFFFF`, gradients, glows, coloured highlights on words, emoji as icons.

*(Website-only: a blue `#114CBF` is used only for keyboard focus rings. Do not use it in posts.)*

---

## 3. Typography

**Font:** [Manrope](https://fonts.google.com/specimen/Manrope) (free, Google Fonts). Weights used: **400** Regular, **600** SemiBold, **800** ExtraBold.

| Role | Weight | Letter spacing | Line height | Web size | On a 1080px-wide post |
|---|---|---|---|---|---|
| Giant (project name, "20+") | 800 | −6% | 0.85 to 0.9 | up to 168px | 180 to 240px |
| Display (hero headline) | 800 | −4.5% | 0.96 | up to 100px | 110 to 140px |
| Section heading | 800 | −4.5% | 1.0 | up to 72px | 72 to 96px |
| Title (step, item) | 800 | −2% | 1.15 | 20 to 26px | 44 to 52px |
| Lead paragraph | 400 | 0 | 1.45 | 18 to 22px | 34 to 40px |
| Body | 400 | 0 | 1.6 | 16px | 30 to 32px |
| Label, caption | 400 or 600 | 0 | 1.5 | 14px | 24 to 26px |

Rules:
- **Sentence case everywhere.** No ALL CAPS labels, no letter-spaced small text.
- **Headlines are tight:** big sizes always get negative letter spacing.
- **One weight and one colour per headline.** Don't bold or colour a single word inside it; use a line break for emphasis instead.
- **Code only in monospace:** if you show a Markdown or code snippet, use a system mono font (Menlo, SF Mono, Consolas) on an Ink panel.

---

## 4. Layout

**Grid:** 12 columns. On the site: 1440px max width, 64px side margins, 32px gutters.

**For social canvases:**

| Format | Size | Margins | Columns |
|---|---|---|---|
| Instagram / LinkedIn square | 1080 × 1080 | 80px | 6 columns, 24px gutter |
| Instagram portrait (carousel) | 1080 × 1350 | 80px | 6 columns, 24px gutter |
| Story / Reel | 1080 × 1920 | 80px sides, 200px top and bottom safe area | 6 columns |
| LinkedIn / X landscape | 1200 × 627 | 64px | 12 columns, 24px gutter |

**Spacing scale** (multiply by 2 for 1080px posts): 4 · 8 · 12 · 16 · 24 · 40 · 64 · 96 · 144.

**Composition habits:**
- Headlines sit **top-left** and are left-aligned. Avoid centred stacks.
- A **1px Ink line** sits above each group (facts, steps, contact links), with its label above the value.
- Leave generous empty space; whitespace is part of the look.
- Put your name **"Ali Qadri"** (Manrope 800) bottom-left, and a short fact or page number bottom-right in Muted.

---

## 5. Elements

**Primary button / tag:** Ink fill, Paper text, fully rounded pill, Manrope 600. Example: *Read the case study*.

**Secondary button:** transparent with a 1px Ink outline, same pill shape.

**Hairline list (ledger):** rows separated by 1px Rule lines. Label on the left in 600 weight, detail in Ink 2, date right-aligned in Muted.

**Fact group:** three columns, each with a 1px Ink line on top, a Muted label (*My role*, *Built with*), then a 600-weight value.

**Process step:** a large step number in Rule strong (`01` to `07`), a title in 800, one line in Ink 2, then an "artifact" panel in Paper 2 with 6px radius.

**Checklist:** small square boxes; done items are filled Ink, open items are outlined.

**Markdown panel:** Ink background, Paper text, mono font, headings (`#`) in a brighter weight.

**Corner radius:** 6px for images and panels, fully round for buttons and pills. Nothing in between.

---

## 6. Imagery

- **Product screenshots and demo clips** are the main pictures. Show them big, with 6px rounded corners and a 1px Rule outline. Don't put them inside fake phone or browser frames.
- **Portrait:** black and white (grayscale, slight contrast boost), 3:4 crop, 6px corners.
- **No stock photos, no illustrations, no 3D blobs.**
- Available captures: `Projects/PrepRoom/*.webp`, `Projects/Restaurant ERP/*.webp`, `Projects/SiteSlap/*.webp`, plus the three demo videos.

---

## 7. Motion (for reels and animated posts)

- **Character:** calm and precise. Things rise into place; nothing bounces.
- **Easing:** strong ease-out, `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Durations:** 0.12s for small taps, 0.22s for hovers, 0.4 to 0.8s for entrances.
- **Signature moves from the site:**
  - Headline words slide up from behind a mask, one after another (about 45ms apart).
  - A product video starts small beside the text, then grows to fill the frame.
  - A statement goes from faint grey to full ink, word by word.
  - Process steps slide sideways while a thin progress line fills across the top.

---

## 8. Voice and copy

- **Plain, first person, specific.** "I build web products, then improve them."
- **Short.** Headlines 7 words or fewer; one or two short sentences per slide.
- **Real nouns:** name the product, the tool, the place (Karachi).
- **No em or en dashes.** Use commas, colons or full stops.
- **No hype words:** seamless, robust, supercharge, elevate, game-changer, unlock.
- **Never invent numbers or quotes.** Only use facts that are true (see below).

**Facts you can use:**
- Product developer and designer in the JavaScript ecosystem, based in Karachi, Pakistan, working remotely
- Available for full-time roles and freelance products
- 20+ clients across web builds, design and content work
- PrepRoom: real-time study rooms; Next.js 15, TypeScript, Supabase Realtime, LiveKit; every sensitive action checked on the server
- Restaurant ERP: orders, menu, stock, bookings, staff and expenses; each restaurant sees only its own data; AI assistant acts only after you confirm
- SiteSlap: audits a site in a real browser, about fifty checks, scores from measured checks, then an honest roast
- Process: write it down → Markdown spec → design system → build in slices → test against the doc → ship → improve and go again
- Off the clock: football, chess, cards, geography and history

---

## 9. Post templates

1. **Project cover:** product name at Giant size top-left, one lead line, a large screenshot filling the bottom half, a pill reading *Case study*.
2. **Process carousel (7 slides + cover):** one step per slide: big step number, title, one line, artifact panel. The last slide is dark Ink: "Back to 01".
3. **Statement:** one sentence of 10 to 20 words in Section size, left-aligned, nothing else but your name bottom-left.
4. **Number:** "20+" at Giant size, the caption "clients so far, across web builds, design and content work" beneath it.
5. **Before / after or feature detail:** two screenshots side by side with Muted captions underneath, separated by a 1px rule.
6. **Contact / availability:** "Have a product to build?" in Section size, then your email in Display size with a 3px underline.

---

## 10. Quick checklist before posting

- [ ] Only greys (plus colour from real screenshots)
- [ ] Manrope only, 400 / 600 / 800
- [ ] Headline top-left, sentence case, tight letter spacing
- [ ] One idea, few words
- [ ] Hairlines instead of boxes; 6px corners on images
- [ ] Every fact is true
