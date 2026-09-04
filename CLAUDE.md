# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

This repo plans Carter and Rola's December 2026 trip to Hokkaido. The source of truth is markdown data (interests, itinerary, logistics). There are two rendered outputs built from that data:

- `web/` — a hand-generated static HTML/CSS export (legacy, no build step). See "Structure and data flow" below.
- `app/` — the active React + Vite application (see "Development (app/)" below). This is where new feature work happens.

## Development (app/)

`app/` is a Vite + React app (React Router, no TypeScript, Oxlint for linting). To run it:

```
cd app && npm run dev   # http://localhost:5173
```

"Open the dev server" for this repo means this Vite dev server — not a static file server over `web/*.html`. Other scripts: `npm run build`, `npm run lint`, `npm run preview`.

Pages live in `app/src/pages/` (day board, map, interests, logistics, packing, sync) with data adapters in `app/src/data/` and the local device-sync engine (export/import/QR/paste, diff + conflict resolution) in `app/src/sync/`.

## Structure and data flow

```
interests/carter.md, interests/rola.md   individual lists of places each person wants to go, with notes + coordinates
interests/shared.md                      places both Carter and Rola want to go, with notes + coordinates
        │                     │
        ▼                     ▼
itinerary/logistics.md    web/map.html   pin map generated FROM the 座標 (coordinates) columns above + hotel coordinate
(fixed constraints: dates,
flights, lodging, transport)
        │
        ▼
itinerary/outline.md                     draft day-by-day skeleton (which day, which area, no timing yet)
        │
        ▼
itinerary/detailed.md                    full itinerary: per-day tables with time / place / notes / transport
        │
        ▼
web/index.html                           responsive day-board (mobile + desktop), currently generated FROM outline.md
```

Each file links to its neighbors in the pipeline — follow those links to see what feeds what.

## Key workflow rule

Everything in `web/` is generated output, not hand-edited. `web/index.html` currently renders `itinerary/outline.md` (self-contained HTML/CSS, no build step, responsive layout for mobile and desktop) — once `itinerary/detailed.md` has real content, switch the source to that instead. `web/map.html` renders the 座標 (coordinates) column in `interests/*.md` plus the hotel coordinate in `itinerary/logistics.md`. When any of those source files change and the user asks to update the page(s), regenerate — don't hand-maintain content in `web/`, it should always be a straight rendering of its source.

## Editing itinerary/detailed.md

Each day is a `## Day N - YYYY/MM/DD (weekday)` heading followed by a `住宿：` line and a table with columns `時間 | 地點 | 內容 / 備註 | 交通方式`. Keep this structure consistent across days — the webpage generation step parses it directly.

## web/index.html conventions

Currently a horizontally-scrollable day-board: one column per day (uniform header style, no per-day color), grouped rows for 早/午/晚/TBD. Each item card is color-coded by activity type using this fixed 6-category taxonomy (with a legend on the page) — reuse it rather than inventing new categories:

- 交通 (transport), 美食 (food), 購物 (shopping), 景點 (sightseeing), 住宿 (lodging), 活動 (activity)

Category colors come from the `dataviz` skill's validated categorical palette (slots 1–6, in that fixed order) — reuse the same hex values and re-run `scripts/validate_palette.js` if the set of categories ever changes.

## web/map.html conventions

A Leaflet + OpenStreetMap page (CDN, not vendored) plotting every place in `interests/*.md` that has a 座標 value, plus the hotel from `itinerary/logistics.md`. Marker color reuses the 景點/活動/購物/住宿 categories and hex values from `web/index.html`'s taxonomy (交通/美食 unused here so far — add them if flight/food pins are ever added). Places with 座標 = 待定 are listed in a text callout instead of a pin, not silently dropped. When `interests/*.md` coordinates change, regenerate this file's inline `places` array to match.

## Git workflow

This repo never uses a PR workflow. Land work with a short-lived branch fast-forward-merged straight to `main`, or commit directly to `main` — never `gh pr create`. This is a two-person personal trip-planning repo with no reviewer on the other end, so a PR only adds ceremony.

Pattern: `git checkout -b feat/<issue#>-<slug>` → implement with per-section commits → `git checkout main && git merge --ff-only <branch> && git branch -d <branch>` → `git push origin main` → close the GitHub issue with a comment summarizing what shipped. A short-lived branch is still fine for isolation; just don't open a PR for it. This applies even when a general-purpose skill (e.g. `new-feature`) defaults to a branch → PR → review flow — skip the PR step.

## Agent skills

### Issue tracker

Issues live as GitHub issues on this repo (`CarterChen247/trip-2026-hokaido`), managed via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`), used as-is. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
