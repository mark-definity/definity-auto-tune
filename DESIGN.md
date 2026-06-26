---
name: Definity Auto-Tune
description: Cost-optimization dashboard where Definity autonomously tunes data pipelines and reports the savings.
register: product
designSystem: MUI (Material UI) — canonical tokens only
colors:
  primary-main: "oklch(0.684 0.11 197)"
  primary-dark: "oklch(0.53 0.09 195)"
  primary-light: "oklch(0.85 0.0933 196)"
  primary-lightest: "oklch(0.9 0.04 175)"
  success-lightest: "#e8f5e9"
  error-main: "#d32f2f"
  text-primary: "#292929"
  text-secondary: "#858585"
  divider: "rgba(0,0,0,0.12)"
  background-paper: "#ffffff"
  background-default: "oklch(0.98 0.001 200)"
typography:
  title:
    fontFamily: "Inter, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  subtitle:
    fontFamily: "Inter, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "16px"
    textColor: "{colors.text-secondary}"
  value:
    fontFamily: "Inter, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "clamp(18px, 1.5vw, 23px)"
    fontWeight: 700
    lineHeight: 1
rounded:
  sm: "4px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
components:
  kpi-card:
    backgroundColor: "{colors.background-paper}"
    rounded: "{rounded.sm}"
    padding: "16px"
  kpi-card-savings:
    backgroundColor: "{colors.primary-lightest}"
    rounded: "{rounded.sm}"
    padding: "0"
  chip-autotuning:
    backgroundColor: "{colors.primary-lightest}"
    textColor: "{colors.primary-dark}"
    height: "18px"
  log-drawer:
    backgroundColor: "{colors.background-paper}"
    width: "440px"
---

# Design System: Definity Auto-Tune

## 1. Overview

**Creative North Star: "The instrument panel, not the brochure."**

Definity Auto-Tune is a data-engineering control surface: dense tables, KPI strips, and time-series charts that an operator reads at a glance to see where compute is wasted and how much Auto-Tune has saved them. Every pixel serves comprehension, never decoration. The interface is built entirely on **Material UI (MUI)** — its palette, typography scale, elevation, and components are the single source of truth.

The governing rule is absolute: **use canonical MUI only — tokens, CSS variables (`--mui-palette-*`, `--mui-shape-*`, `--mui-shadows-*`), and real MUI components. Never hand-roll custom hex, rgba, or bespoke styling.** New surfaces are assembled from the same MUI primitives already on the page (clone a real `MuiChip`, reuse `MuiDataGrid`, render inside `MuiPaper`) rather than reinvented. This is what keeps the prototype indistinguishable from the shipping app.

This system explicitly rejects: warm "editorial" neutrals, gradient accents, glassmorphism, decorative shadows, custom one-off colors, and anything that reads as a marketing page. Consistency is the affordance.

**Key Characteristics:**
- MUI design tokens are normative; no custom values.
- Teal primary on near-white surfaces; restrained color, ≤1 accent hue.
- Data-dense: tight grids, predictable column widths, no wasted strip space.
- The big number is the anchor — KPI values align to one baseline across the strip.

## 2. Colors

A restrained, single-accent product palette: one teal primary carries all interactive and "Auto-Tune" meaning; everything else is neutral ink, paper, and dividers.

### Primary
- **Teal** (`oklch(0.684 0.11 197)`): primary actions, links, the Auto-Tune savings figures, chart cost line.
- **Teal Dark** (`oklch(0.53 0.09 195)`): text on tinted teal surfaces, chip labels, "View log" affordance.
- **Teal Lightest** (`oklch(0.9 0.04 175)`): the grouped savings card background and the "Auto-Tuning" chip fill. Signals "Auto-Tune touched this."

### Neutral
- **Ink** (`#292929`): primary text, KPI values, headings.
- **Muted** (`#858585`): subtitles, secondary labels, captions.
- **Divider** (`rgba(0,0,0,0.12)`): the `--mui-palette-divider` token — all hairlines and the savings-group internal dividers.
- **Paper** (`#ffffff`) / **Default** (`oklch(0.98 0.001 200)`): card surfaces vs. app canvas.

### Status
- **Error** (`#d32f2f`): low-utilization warning chips (e.g. the red 7%).
- **Success Lightest** (`#e8f5e9`): MUI's native highlight band on Auto-Tuned table rows.

## 3. Typography

One family — **Inter** — across the whole product, differentiated by weight and the app's MUI utility classes, never by mixing typefaces.

- **Title** (`.text-sm color-primary`): 14px / 400 / ink — card and section titles.
- **Subtitle** (`.typo-subtitle`): 14px / 400 / muted — qualifiers like "Custom", "Last 30 days", "Annualized".
- **Value** (`.fl-text-lg/2xl font-bold`): fluid ~18–23px / 700 / ink — the dominant KPI numbers. These align to a single baseline (≈73px from card top) across every card in a strip so the eye reads them as one row.
- **Body / table** (`.text-sm`, `.text-xs`): 14px / 12px for DataGrid cells and metadata.

## 4. Elevation

Mostly flat: cards are defined by a 1px `--mui-palette-divider` border and `4px` radius, not shadow. Elevation is reserved for things that float above the page.

- **Flat** (cards, KPI tiles, table): border + radius, no shadow.
- **Drawer / overlay**: the per-compute Auto-Tune log uses `MuiPaper` `elevation16` (`var(--mui-shadows-16)`) and slides in from the right over a `rgba(0,0,0,0.35)` scrim. Z-order: scrim below, drawer above.

## 5. Components

- **KPI card**: `MuiPaper`-style surface, 16px padding, 4px radius, title → subtitle → big value → trend. Values baseline-aligned across the strip.
- **Grouped savings card**: one `primary-lightest` box holding three sub-metrics (Auto-Tune saved / Manual saved / Savings oppt) split by vertical `divider` rules. Mirrors the KPI card's type rhythm so it reads as part of the strip.
- **Auto-Tuning chip**: cloned `MuiChip` (filled), `primary-lightest` fill, `primary-dark` label, 18px tall — marks pipelines under Auto-Tune.
- **Compute table**: `MuiDataGrid`. Leftmost (Compute) column absorbs slack so the grid fills width with no trailing dead space. Rows are clickable → navigate to the task's Auto-Tune view. The teal Auto-Tune savings figure is independently clickable → opens the per-compute log drawer.
- **Auto-Tune log drawer**: right-anchored `MuiPaper elevation16`, 440px. Header (grey wand icon + scoped title), a metric summary row (saved / actions / pipeline), a details grid (Pipeline, Task, Compute, Time window, Runs, Last action), then a timeline of TUNED / VERIFIED / REVERTED / LEARNED / GUARDRAIL entries, each tagged with a cloned `MuiChip`.
- **Collapsible sidebar**: icon rail (53px) that expands to 220px with labels via the arrow toggle; starts collapsed, 200ms MUI easing.

## 6. Do's and Don'ts

**Do**
- Use `--mui-palette-*`, `--mui-shadows-*`, `--mui-shape-*` and the app's `.typo-subtitle` / `.text-sm` / `.fl-text-*` utility classes.
- Clone real MUI components already on the page (Chip, Paper, DataGrid) when building new UI.
- Keep spacing on the 8pt grid (`16px` = `spacing(2)`).
- Align KPI values to a single baseline across a strip.
- Let the leftmost table column absorb slack so the grid fills its width.

**Don't**
- Don't write custom hex, rgba, or px colors — ever. No bespoke styling.
- Don't add shadows as decoration; flat cards use borders.
- Don't mix font families or introduce a second accent hue.
- Don't leave trailing dead space in tables or KPI strips.
- Don't reinvent a component MUI already provides.
