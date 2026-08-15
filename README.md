# Antarya Mondal — Portfolio

**Live: https://antaryam2003.github.io/portfolio**

A hand-built static portfolio site targeting Associate Product Manager and Product Analyst roles.
No framework, no build step, no dependencies. Open `index.html` and it works.

---

## View it locally

Double-click `index.html`, or serve it properly (recommended — some browsers restrict `file://`):

```bash
npx serve .
# or
python -m http.server 8000
```

Then open http://localhost:8000

---

## File map

```
index.html                              homepage
work/
  salvage-two-problems.html             0→1 prototype teardown
  urban-company-insta-help.html         Insta Help PRD
  snabbit-trust-capacity.html           trust & capacity PRD
  pronto-trust-reliability.html         trust & reliability PRD
  buknu-masala-odop.html                design-led expansion strategy
  finlatics-market-research.html        market research & GTM
assets/
  css/style.css                         the design system, one file
  css/responsive.css                    responsive tables and wide figures
  js/main.js                            theme toggle, scroll reveal, nav, TOC,
                                        responsive tables, scroll hints
  img/profile.jpg                       the headshot in the contact card
  img/salvage-logo.png                  the Salvage wordmark, on its card
  img/salvage-*.jpg                     four prototype screenshots
  Antarya-Mondal-Resume.pdf             linked from nav, contact card, footer
```

The six case studies are listed in this order on the homepage, and every file in
`work/` is linked from it — there are no unreachable pages. Each page also carries a
Previous/Next pager, and the six form a closed ring in the same order, so **adding or
reordering a case study means editing two neighbours' pagers as well as the homepage.**

**Three of the case studies do not load `style.css`.** `salvage-two-problems.html`,
`snabbit-trust-capacity.html` and `urban-company-insta-help.html` were built as
self-contained bundles: each defines its own palette, typography and layout in `<style>`
blocks in its own `<head>`, and lifts in only the site header. Editing `style.css` will not
affect them. Every page loads `responsive.css` and `main.js`.

---

## Before you send the link out

### 1. Your photo — done

`assets/img/profile.jpg` is in place. If you ever swap it, keep it square (~800×800px, under
300 KB, plain background); with the file missing the site falls back to a styled "AM"
monogram, which looks intentional but converts worse than a real face.

### 2. Put real numbers into the case studies

This is the single highest-leverage edit on the whole site. Every claim currently on the
site is drawn from your résumé, and nothing is invented — which also means the **Outcome**
sections are qualitative where your résumé was qualitative.

Recruiters anchor on numbers. Two case studies carry an HTML comment marking exactly where
to add yours — search for `▸` in the `work/` files to jump straight to them:

| Page | What to add |
|---|---|
| `work/buknu-masala-odop.html` | Who you presented to and how it landed; embed packaging mockups or brand boards if you have them |
| `work/finlatics-market-research.html` | Sample size of the market tests, TAM/SAM figures you're free to share, how many recommendations were adopted, any lift you measured |

These are the only two pages carrying a `▸` marker. The three PRD case studies — Urban
Company, Snabbit and Pronto — are self-contained: they argue from their own tables and
charts rather than from résumé claims, so there is nothing to fill in. If you ever get real
data for one, its "Open questions" section is where it goes. Salvage argues from a thing
that exists, so it needs nothing either; its "Honest scope" section is what makes it
credible, and shortening that section is the one edit that would cost it.

### Chart colours

The charts on the Pronto page use a palette validated with the dataviz colour checker: a
single-hue ordinal teal ramp for P0/P1/P2 (monotone lightness, light end clears the surface
at ≥2:1) plus reserved status colours. The tokens live at the top of the "Figures, charts and
tables" section in `style.css`, with separate light and dark steps. If you change them,
re-check contrast rather than eyeballing.

If a number is confidential, a ratio or a range still beats a paragraph of description.

### 3. Check the quotation sounds like you

The hero quote is in `index.html`, in the `<blockquote class="quote">` block:

> Every product is a bet that someone's day gets easier.
> My job is to make the bet *smaller* — and the payoff obvious.

It's a placeholder for *your* product thesis. If it doesn't sound like something you'd
actually say in an interview, replace it — a line you can defend for ninety seconds is
worth more than a polished one you can't.

---

## Other things you may want to change

- **Location.** The contact card says just "India". Make it specific if you'd rather.
- **Colours.** All of them are CSS custom properties at the top of `assets/css/style.css`, under
  `:root` (light) and `:root[data-theme="dark"]`. Change `--accent` and the homepage, Pronto,
  Buknu and Finlatics all follow. The Snabbit, Insta Help and Salvage pages define their own
  tokens in their own `<head>` and have to be changed there too — Snabbit's are `--sc-NN`,
  Salvage's are `--sv-NN`, each with a light and a dark value.
- **The gradient.** `--bg-top`, `--bg-mid`, `--bg-bottom` — currently light blue to light green.

---

## How the case studies behave on a phone

The case studies were written for a desktop column — wide tables, a service blueprint, a
Gantt chart. Three mechanisms adapt them, and it's worth knowing which one you're touching
before you edit a case study.

### Tables stack into cards below 640px

`main.js` reads each table's `<thead>`, copies every column heading onto the matching cells
as a `data-label`, and tags the table `data-stack`. `responsive.css` then turns each row into
a small card where every value sits under its own heading. Nothing is cut off and nothing
scrolls sideways.

This is automatic. **Add a normal `<table>` with a `<thead>` to any page and it just works** —
there is nothing to wire up. Two-column tables are left as tables and only lose their authored
minimum width.

The one requirement is a real `<thead>` row. A table without one is skipped, and a table using
`colspan` or `rowspan` would mislabel its cells — none currently do.

### Wide diagrams scroll, and say so

A blueprint or a Gantt chart is two-dimensional; stacking it destroys the comparison it exists
to make. Those keep their shape and scroll sideways. `main.js` measures anything scrollable and,
where more than 28px is actually hidden, shows a scrollbar and a line of text beneath it. It
re-measures on resize, so the hint appears and disappears with the figure rather than being
tied to a breakpoint — on a desktop, where everything currently fits, none are shown.

To make a new wide block behave this way, wrap it in `<div class="scroll-x">`.

### Insta Help collapses its own grids — carefully

`urban-company-insta-help.html` has no shared stylesheet to hang responsive rules on, and its
grids are inline with pixel column widths (`290px 1fr` and friends). Its `<head>` carries a
`@media (max-width: 700px)` block that collapses them by **matching the authored inline values
literally**:

```css
[style*="grid-template-columns:290px 1fr"] { grid-template-columns: minmax(0, 1fr) !important; }
```

⚠️ **This is the fragile part of the site.** Change one of those inline declarations — even
adding a space — and the mobile rule silently stops matching and that block breaks on phones
again, with nothing to warn you. If you edit a grid on that page, check the corresponding
selector in its `<head>`, or give the element a `data-` attribute and target that instead
(`data-prose-grid` and `data-blueprint` are already used this way).

Snabbit does the same job more robustly through `data-cols` attributes on its grids, and
Salvage through `data-sv-paths` and `data-sv-mat-row`. Prefer that pattern for anything new.

### Salvage carries one interactive figure

"Drag the score across the fork" is about 90 lines of plain JavaScript at the bottom of
`salvage-two-problems.html`, holding the same constants the prototype's own engine uses —
category weights, material rates, the 45-point threshold and the pricing formula. **If you
ever change a rate or the threshold in the real app, change it here too**, or the figure
starts quoting numbers the product no longer produces. With JavaScript off the figure still
renders its authored state (a sofa at 74, above the threshold, priced) and simply stops
responding.

### Checking your work

Resize a desktop browser down to about 390px — that reproduces it faithfully. Worth a look at
320px too, which is the narrowest width the site supports. What to confirm: the page never
scrolls horizontally, no text is cut off at the right edge, and no column of prose ends up
under about 130px wide.

---

## Deploying

Already set up. This repo publishes to GitHub Pages from `main` / root, so **any push to `main`
goes live within about a minute**:

```bash
git add -A
git commit -m "Update case study metrics"
git push
```

No build step runs — GitHub serves the files exactly as they are in the repo.

### A custom domain

`antaryamondal.com` or similar costs roughly ₹800–1,200/year, and reads noticeably better on a
résumé than a `github.io` subpath. To point one here:

1. Buy the domain, then add a `CNAME` file to this repo containing just the domain name.
2. At your registrar, add a `CNAME` record for `www` → `antaryam2003.github.io`, and four `A`
   records for the apex pointing at `185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
   `185.199.111.153`.
3. In **Settings → Pages**, enter the domain and tick **Enforce HTTPS** once the certificate
   is issued.

---

## Notes on how it's built

- **No dependencies.** Nothing to install, nothing to update, nothing that breaks in six months.
- **Progressive enhancement.** With JavaScript disabled the site stays readable and navigable.
  JS adds the theme toggle, scroll animations, the mobile menu, the sidebar highlighting, and
  the table stacking described above. Without it the tables keep their full width and scroll
  sideways instead — a `:has()` rule makes sure the wrappers scroll rather than clip, so no
  content becomes unreachable.
- **Accessible.** Semantic landmarks, skip link, visible focus rings, `alt` text, ARIA on the
  interactive controls, and `prefers-reduced-motion` honoured throughout. Stacked tables hide
  their heading row visually but keep it for screen readers.
- **Responsive** from 320px up: a two-column layout above 820px, tables stacking below 640px.
  Verified at 320, 390 and 1280px on every page in both themes.
- **Light by default.** Dark mode is opt-in via the toggle in the nav, and the choice is
  remembered in `localStorage`.
- **Prints cleanly** — the nav, background and CTAs drop out, so `Ctrl+P` produces a usable
  leave-behind.

Fonts load from Google Fonts, and two of the self-contained case studies use a different set:

| Pages | Families |
|---|---|
| Homepage, Pronto, Buknu, Finlatics, Salvage | Inter, Instrument Serif |
| Insta Help | Inter, Instrument Serif, IBM Plex Sans, IBM Plex Mono |
| Snabbit | Inter, Newsreader, IBM Plex Sans, IBM Plex Mono |

If you'd rather have zero external requests, delete the font `<link>` tags in each HTML file —
the CSS falls back to a sensible system stack.
