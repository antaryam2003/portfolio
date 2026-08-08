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
  urban-company-insta-help.html         Insta Help PRD
  snabbit-trust-capacity.html           trust & capacity PRD
  pronto-trust-reliability.html         trust & reliability PRD
  buknu-masala-odop.html                design-led expansion strategy
  finlatics-market-research.html        market research & GTM
assets/
  css/style.css                         entire design system, one file
  js/main.js                            theme toggle, scroll reveal, nav, TOC
  img/profile.jpg                       the headshot in the contact card
  Antarya-Mondal-Resume.pdf             linked from nav, contact card, footer
```

The five case studies are listed in this order on the homepage, and every file in
`work/` is linked from it — there are no unreachable pages.

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
data for one, its "Open questions" section is where it goes.

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
  `:root` (light) and `:root[data-theme="dark"]`. Change `--accent` and the whole site follows.
- **The gradient.** `--bg-top`, `--bg-mid`, `--bg-bottom` — currently light blue to light green.

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
- **Progressive enhancement.** With JavaScript disabled the site is fully readable and navigable;
  JS only adds the theme toggle, scroll animations, the mobile menu and the sidebar highlighting.
- **Accessible.** Semantic landmarks, skip link, visible focus rings, `alt` text, ARIA on the
  interactive controls, and `prefers-reduced-motion` honoured throughout.
- **Responsive** from 320px up, with a two-column layout above 820px.
- **Light by default.** Dark mode is opt-in via the toggle in the nav, and the choice is
  remembered in `localStorage`.
- **Prints cleanly** — the nav, background and CTAs drop out, so `Ctrl+P` produces a usable
  leave-behind.

Two fonts load from Google Fonts (Inter and Instrument Serif). If you'd rather have zero external
requests, delete the two `<link>` tags for fonts in each HTML file — the CSS falls back to a
sensible system stack.
