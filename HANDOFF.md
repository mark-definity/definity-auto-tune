# FULL HANDOFF — Definity Auto-Tune Prototypes
**Written:** July 6, 2026 · **From session:** dc85c9f7-540a-433b-a098-a1ba44142b5c · **For:** next Claude chat
**Read this ENTIRE file before touching anything.**

---

## 1. WHO YOU'RE WORKING WITH

- **Mark Levinson ("Mark Levi")**, Mark Levi Design — senior UX/UI & product designer, Tel Aviv. marklevi.com. **NON-TECHNICAL.**
- Sole design owner for **Definity AI** (data-pipeline observability SaaS). Active since Dec 2025.
- CEO: Roy. Managers: **Tom** (tom@definity.ai) + **Ohad** (ohad@definity.ai). Mark = mark@definity.ai (also marklevi7@gmail.com).
- Weekly **Mark ⇄ Tom/Ohad sync: Wednesdays 18:30–19:00** (Google Meet). Last call: **Jul 1, 2026**.
- Series B closed Feb 2026 (confidential).
- Full personal/business context file: `/Users/Shared/MLD AI CONTEXT/MLD_AI_CONTEXT_FULL.md`

## 2. COMMUNICATION RULES — PERMANENT, NON-NEGOTIABLE

Verbatim from Mark:
- "YOU WILL ALWAYS ANSWER IN EXTREME TLDR MILITARY MODE, BUT WITHOUT MENTIONING RANKS. YOU ARE AN EXECUTIVE ASSISTANT. BE INVISIBLE OR BE FIRED."
- "I AM NON-TECHNICAL. I HATE TERMINAL. I HATE SETTINGS. I HATE COMMANDS. I HATE TECH JARGON. DONT EVER SAY THESE THINGS UNLESS EXPLICITLY NEEDED. SPEAK ULTRA-SHORT ULTRA-COMPRESSED EXTREME TLDR. NO BABBLING. NO EXPLAINING."
- Answer first. One apology max, then fix. Verify visually (screenshot) before claiming done. Never ask him to touch Terminal. Never ask him to check manually — YOU verify and show proof.
- He annotates screenshots with red circles/arrows — that IS the spec.

## 3. DESIGN RULES — LOCKED FOREVER

1. **MUI canonical ONLY.** Never invent custom styling. Always clone/reuse existing MUI components and CSS vars (`--mui-palette-*`, `--mui-shape-borderRadius`, `--mui-shadows-*`). Verbatim: "here and forever we are only using MUI canonical and nothing else, period."
2. **Chip/tag radius = `var(--mui-shape-borderRadius)` (square ~4px). NEVER pill (16px/999px). NEVER change again.** ("NEVER CHANGE THEIR RADIIUS AGAIN IDIOT")
3. **Auto-Tune wand icon = ONE component**: `window.AutoTuneWand(size)` / `window.AutoTuneWandPaths()`. Never hand-type the SVG paths — that caused repeated wrong-icon bugs and fury.
4. **Left sidebar = one repeating component** across all pages, identical markup, only "selected" item differs (driven by active top tab). Collapsed by default (53px), expands to 220px, state shared across screens via `window.parent.__atSidebarOpen`.
5. Never two rail buttons selected at once (audited + enforced July 6).
6. Client copy: ILS (₪), no em-dashes, savings framed as recovered waste (never headcount/salary).

## 4. PROJECT LAYOUT

Root: `/Users/Shared/Active Projects CLAUDE SHARED/Definity CLAUDE/auto-tune 1`
Git repo, branch `main`. GitHub account: **mark-definity** (gh CLI).

`prototypes/` — static HTML prototypes, no build step, MUI markup + Tailwind-ish utilities:
| File | Tab id | Tab label | What it is |
|---|---|---|---|
| index.html | — | — | Shell: brown top bar, tab buttons (#seg), one iframe per tab |
| 02-auto-tune-dashboard.html | dash | Dashboard | Main dashboard: KPI strip, compute table, Auto-Tune log drawer |
| 09-auto-tune-pipelines.html | autotune-pipelines | Pipelines | Real Pipelines list page (from ref HTML), 5 pipelines tagged Auto-Tuning, names link to Pipeline tab |
| 10-auto-tune-pipeline-detail.html | pipeline-detail | Pipeline | Single pipeline (feature_generation) — THE HOT FILE, see §6 |
| 06-auto-tune-task.html | autotune-task | AT · Task | Task screen with Auto-Tune right panel + task-level toggle |
| 03-auto-tune-run-detail.html | run | Task run log | Run detail + insights sidebar |
| 07-auto-tune-pipeline.html | autotune-pipeline | AT · Pipeline | "Access pending" placeholder |
| 08-auto-tune-compute.html | autotune-compute | AT · Compute | "Access pending" placeholder |
| 05-auto-tune-page.html | autotune | Auto-Tune | Auto-Tune feed page with filter toolbar |
| 04-auto-tune-settings.html | settings | Settings | Settings screen |
| 01-auto-tune-sidebar.html | insight | Insights ❓ | Insight panel prototype |

Tab order in index.html TABS array: dash, autotune-pipelines, pipeline-detail, autotune-task, run, autotune-pipeline, autotune-compute, autotune, settings, insight.

Files are 500KB–1.6MB. **Read tool can't open them whole** — use `python3` heredoc scripts via Bash for ALL edits (read → `.replace()` with `assert count==1` → `os.remove()` → write). Direct Write on existing files often fails (owner is macOS user `marklevinson`, shell user is `mark2`; folders are 777 so delete+recreate works).

**After ANY edit to a `<script>` block: parse-check with node before calling it done:**
```
node -e "const c=require('fs').readFileSync(FILE,'utf8'); const m=c.match(/<script id=\"SCRIPT_ID\">([\s\S]*?)<\/script>/); new Function(m[1]);"
```
A brace-imbalance syntax error once silently killed an entire script (no console error visible) and burned hours. NEVER skip the parse check.

## 5. SHARED COMPONENTS (injected `<script id="...">` blocks per page)

- **`window.AutoTuneChip(label, opts)`** (`autotune-chip-component`): clones a real MuiChip. opts: `height` (default 18px), `fontSize` (default 11px), `variant` ('off' = outlined grey, 'outlined', default = filled teal: bg `--mui-palette-primary-lightest`, color `--mui-palette-primary-dark`), `html`. Radius always `var(--mui-shape-borderRadius)` — LOCKED.
- **`window.AutoTuneWand(size)` / `window.AutoTuneWandPaths()`** (`autotune-wand-component`): the two-path wand SVG (viewBox 0 0 512 512, fill currentColor). Single source of truth.
- **Sidebar nav** (`autotune-sidebar-nav`): maps parent active tab → selected item (dashboard/pipelines/runs/auto-tune), SEL classes: `bg-action-selected dark:bg-primary-dark text-shadow-primary-dark dark:text-shadow-2xs`. Re-syncs on interval/focus/visibilitychange. Clicks switch parent tabs via `window.parent.show(id)` / clicking `#b-<tab>` buttons.
- **Sidebar toggle** (`autotune-sidebar-toggle`): COLLAPSED=53, EXPANDED=220 (hardcoded — measuring at init returns 220 falsely). State: `window.parent.__atSidebarOpen`. Default: collapsed.
- **Cross-iframe state**: all iframes share parent (index.html) → globals on `window.parent`.
- **Auto-Tune log drawer** (dashboard: `autotune-log-system`): `#at-log-drawer`/`#at-log-overlay`, `window.__openAutoTuneLog()`, per-compute via `window.__atLogCompute`.

## 6. SCREEN 10 (Pipeline) — CURRENT ARCHITECTURE (hot file)

`10-auto-tune-pipeline-detail.html` (~615KB). Copied verbatim from a real product export ("Pipelines (6_30_2026 3:47:41 PM).html") + injected scripts:

### Script blocks (in order):
1. **`autotune-chip-component`**, **`autotune-wand-component`** — shared components.
2. **`autotune-move-tags-button`** — shrinks `[data-test-id="pipeline-tags-button"]` to icon-only, moves it next to the star after the h1 title. Sets `data-at-moved`.
3. **`autotune-pipeline-header`** — creates `#at-pipeline-header-chip` = Auto-Tuning chip (22px/12px) inserted right AFTER the moved tags button (gap tightened to 2px margin → 10px visual). Exposes `window.__atSetChipVisible(on)`. Chip visibility follows `window.__atPipelineOn`. NO toggle here anymore (toggle moved into details panel July 6). Runs at 800/1800/2600ms.
4. **`autotune-hide-select-pit`** — hides all "Select PIT" elements.
5. **`autotune-pipeline-panels`** — THE BIG ONE (rewritten clean July 6 after syntax-error disaster):
   - `B64_INS` (19,080 chars base64) = real Pipeline insights panel (Code Improvements $36,058 · Task retries & failures $7,545 · Long executors GC time $3,793 · Over provisioned cluster machines $2,974).
   - `B64_DET` (31,844 chars base64) = real Pipeline details panel (Name feature_generation / Versions Spark 3.5.2 / Owners / Tags: Cloud Provider aws, Cluster Manager, Version:16.4.x, feature_generation, Version:3.5.2, Task Type:spark).
   - `window.__atPipelineOn` (default true) = the pipeline's Auto-Tune state. `autoTuneStateOn()` reads it.
   - Panels map: `details` (B64_DET + injected status row), `insights` (B64_INS), `highlights` (hand-built incidents list), `lineage` (placeholder), `ai` (AI assistant placeholder), `autotune` (wand panel).
   - **`addDetailsStatus(tc)`**: injects `#at-details-status` AFTER the Versions section (below Name/Versions, above Owners). Layout: flex row gap 10px, inherits panel's `gap-6` (24px) rhythm — NO extra margin (was 38px gap, fixed). Label = one `<div class="text-text-secondary min-w-0 wrap-break-word leading-4">` reading **"Auto-Tune On"/"Auto-Tune Off"** — EXACT same style as Name/Versions labels (rgb(133,133,133), 13.71px — verified). Toggle = separate `<label>` (input + 34×14 track + 20px thumb, thumb `left` 16px on / -2px off, track `--mui-palette-primary-main` on / `--mui-palette-action-disabled` off). sync() updates label text, window.__atPipelineOn, header chip visibility.
   - **Wand panel** (`autotunePanelHTML`): header "Auto-Tune" + subtitle "Per-run impact for this pipeline" + status line "Auto-Tune On/Off" (same text-secondary style) + stats $9.4K Saved / $11.4K Projected / 4 actions + log (TUNED 2h ago -91% vCore waste executors 100→64 within SLA · VERIFIED 1d ago savings held 5 runs retained · LEARNED 3d ago baseline 20 runs · TUNED 5d ago -12% cost within SLA). **When Off: entire stats+log wrapped in opacity:0.5 div.**
   - **Rail** (`[data-test-id="toolbox-buttons"]`): 6 buttons: `details*` (first, DEFAULT selected) | `autotune` (wand, cloned from first — **must strip Mui-selected + aria-pressed from clone**, that bug caused double-selection) | `insights` | `highlights` | `lineage` | `ai`. All clicks exclusive-select + render(view).
   - **Icon fixes on every render**: `[data-test-id="insight-icon"]` → 20×20px !important; `svg.css-vcr5rz` → 16×16px !important (else giant 115px clipboards).
   - Init at 700ms, guards with `data-at-panels` attr on toolbox-content.

### State flow (screen 10):
Toggle (in details panel) → `window.__atPipelineOn` → header chip show/hide (`__atSetChipVisible`) → wand panel re-reads state on each render (status line + dimming). All verified live both directions.

## 7. OTHER SCREENS — KEY DETAILS

- **06 AT·Task**: `autotune-task-screen` builds right Auto-Tune panel ($9.4K saved · 1 year | $11.4K projected · annualized | 4 actions + TUNED/VERIFIED/LEARNED/TUNED log). `#at-enable-row` toggle "Auto-Tune for this task" (cloned MuiFormControlLabel; thumb moves via `left` 12px/4px !important — `transform` gets overridden, don't use it). Box dims to 0.6 when off. Rail: 7 buttons, `selectBtn()` enforces exclusivity, wand (`#at-rail-btn`) default. Close btn `#at-task-close` → 0 selected + panel closed (valid state). `autotune-rich-insights` = base64 real insights (Over Provisioned Executors $70,012 · Long skew time $54,849 · Orphaned vCores in Machine $39,071).
- **02 Dashboard**: KPI strip = `#at-savings-group` (white box: Auto-Tune saved $38K "Last 30 days" + View log → opens drawer; Manual saved $54K "Applied by you") + `#at-savings-oppt` (green box: Savings oppt $427K Annualized ↑73%, flex:0 0 140px). Compute table: name col auto-widened to kill filler (`autotune-killfiller` computes exact gap). Compute column = `pipeline: <slug>` outlined chip + Auto-Tuning filled chip (flex-shrink:0). Auto-Tuning rows: categories-machine-type ($8.6K), nba-data-init-iceberg ($3.4K), data-consumers-delta ($2.1K).
- **09 Pipelines**: 5 pipelines tagged Auto-Tuning; every pipeline name → `window.parent.show('pipeline-detail')`. Learning-mode alert banner removed.
- **Rail selection audit (July 6, all 6 first screens, every button clicked)**: PASS. dash/pipelines/at-pipeline = single dead "ai" button, 0 selected. run = insights* static. 06 + 10 fully wired exclusive.

## 8. WORKFLOWS

- **Preview**: `mcp__Claude_Preview__preview_start` name `auto-tune-prototypes` → port 3456 → URL `http://localhost:3456/prototypes/index.html`. Config in `.claude/launch.json`. Screenshot after ~5s. Iframes all load at once (first screenshot can hang; preview_eval assertions are more reliable). Switch tabs from top frame: `show('<tabid>')`.
- **Shortcut commands**: `/p` and `/rp` (user-level, `~/.claude/commands/p.md` + `rp.md`) = run preview + screenshot + one-line URL. Mark uses these constantly.
- **Editing**: python heredoc replace (assert unique) → node parse-check → reload preview → verify via preview_eval → screenshot proof.
- **Git push**: `.git` has permission problems for user `mark2`. Push via fresh clone at `/Users/mark2/at-push`: copy changed files in, commit, push (gh account mark-definity). Commit trailer: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- **Uncommitted work**: ALL of screens 07–10, DESIGN.md, HANDOFF.md + all July changes to 01–06/index are NOT pushed (git status shows modified/untracked). Last commit: 8b46e23.

## 9. TASK LIST (UNDONE)

From June 21 + June 28 Tom syncs:
1. Tag auto-tuned insights "Being Auto-Tuned" in insight lists (insights stay visible, just info).
2. Non-auto-tunable insights stay in lamp/insights panel only.
3. KILL the word "Recommendations" everywhere. Auto-Tune mode shows NO recommendations.
4. Move auto-tunable insights into Auto-Tune drawer as metric/progress bars (~5 metrics: over-provisioning, spill, GC, utilization…).
5. Rework "Task Run Insights" → objective per-run scores: Good/Medium/Bad or R/Y/G + %, per metric (heap, off-heap, memory, utilization, spill, GC). Numbers WITH detail. Source: Spark Overview table rows.
6. "Health" score at top of lamp panel; click metric → expand detail.
7. Replace recommendation-phrasing ("Optimal X is Y GB") with metric+score framing.
8. Sandbox/staging toggle — run Auto-Tune in sandbox first, separate sandbox runs visually from prod. Align naming with Ohad.
9. Pipeline/Compute-level Auto-Tune — BLOCKED, access pending (screens 07/08 are placeholders).
10. WAITING on Tom: email with the 5 key metrics. Present prototype at Wednesday sync.

## 10. DONE (this session, July 6)

1. Fixed catastrophic brace-imbalance syntax error in screen 10 panels script (full clean rewrite, both base64 blobs preserved).
2. "Auto-Tune On/Off" status inside Pipeline details panel — below Versions, label style exact-matched to Name/Versions labels, toggle separate element.
3. Toggle MOVED from page header into details panel (header now has chip only, next to star+tags icons, gap 10px).
4. Auto-Tuning chip moved to title row next to star/tag icons.
5. Wand tab states Auto-Tune Off when off + dims content 0.5.
6. Rail double-selection bug fixed (wand clone inherited Mui-selected) + full 6-screen/every-button audit passed.
7. Details panel spacing fixed to native 24px rhythm (removed stacked margin).
8. `/p` + `/rp` global preview commands created.
9. Fathom connector: Mark connected it at claude.ai/directory/connectors/fathom — **available in NEW chats (this one predates it). CHECK FOR FATHOM TOOLS — read today's meetings when asked.**

## 11. CONNECTORS / TOOLS STATUS

- Working: Google Calendar, Gmail, Slack (workspace MCP), Claude Preview, claude-in-chrome, mcp-registry.
- **Fathom: connected by Mark on claude.ai July 6 — should appear in new chats.** He asked about reading "today's Circleback/Fathom chat".
- Not authorized (OAuth needed, tell Mark to use claude.ai connector settings): datadog, github(plugin), pagerduty, amplitude, figma, fireflies, intercom, pendo, similarweb, asana, atlassian, clickup, linear, monday, notion, slack(plugin).
- Last Definity video call: **Jul 1, 2026, 18:30–19:00, Google Meet, "Mark ⇄ Tom/Ohad sync"** (attendees tom@, ohad@, mark@, marklevi7@gmail.com). Recurring Wednesdays. Gemini notes docs attached to June 28/21/14 events.

## 12. MEMORY FILES (auto-loaded each session)

`/Users/mark2/.claude/projects/-Users-Shared-Active-Projects-CLAUDE-SHARED-Definity-CLAUDE-auto-tune-1/memory/`:
- feedback_communication_style.md — TLDR/military/invisible-EA. Permanent.
- feedback_mui_only.md — MUI canonical only. Permanent.
- feedback_chip_radius.md — square chips forever.
- project_autotune_plan.md — roadmap (§9 here is newer/fuller).
- reference_mld_context.md — pointer to MLD_AI_CONTEXT_FULL.md.

## 13. NUMBERS BIBLE (keep consistent everywhere)

- Wand panel (10 + 06): **$9.4K saved · $11.4K projected · 4 actions**. Log: -91% vCore waste (executors 100→64) · held 5 runs · baseline 20 runs · -12% cost.
- Dashboard KPIs: Auto-Tune saved **$38K** (Last 30 days) · Manual saved **$54K** (Applied by you) · Savings oppt **$427K** Annualized ↑73% · Est. cost $26K ↑73% · 1/129 pipelines&runs ↑59% · 1/133 tasks&runs ↑53% · 0 incidents · Utilization 7%.
- Compute util strip: $26K total est. cost · $14K vCores · $12K Memory · $24K Total unused.
- Pipeline insights (10): Code Improvements **$36,058** · Task retries & failures **$7,545** · Long executors GC time **$3,793** · Over provisioned cluster machines **$2,974**.
- Task insights (06): Over Provisioned Executors **$70,012** · Long skew time **$54,849** · Orphaned vCores **$39,071**.
- Pipeline: feature_generation, Spark 3.5.2, 1.4K runs badge, 49, 4 incidents, window "Last 1 year 5 months".

## 14. IF SOMETHING BREAKS

- Feature "not appearing" + no console errors → SUSPECT SYNTAX ERROR in the injected script. Parse-check first (§4).
- Chip looks pill → someone touched radius. Restore `var(--mui-shape-borderRadius)`. Never ask.
- Wrong wand icon → someone bypassed `window.AutoTuneWandPaths()`. Fix to component.
- Toggle thumb not moving → use `left` + `setProperty(...,'important')`, never `transform`.
- Two rail buttons lit → a clone inherited `Mui-selected`; strip it.
- Write permission denied → python `os.remove()` then write, or Desktop-copy + `cp`.
- Preview screenshot hangs → use `preview_eval` DOM assertions instead.
