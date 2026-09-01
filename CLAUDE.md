# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

This repo plans Carter and Rola's December 2026 trip to Hokkaido. It has no build system, no tests, and no application code — it's markdown data plus one generated static webpage.

## Structure and data flow

```
interests/carter.md, interests/rola.md   individual lists of places each person wants to go, with notes
        │
        ▼
itinerary/logistics.md                   fixed constraints: dates, flights, lodging, transport (not places-of-interest)
itinerary/outline.md                     draft day-by-day skeleton (which day, which area, no timing yet)
        │
        ▼
itinerary/detailed.md                    full itinerary: per-day tables with time / place / notes / transport
        │
        ▼
web/index.html                           responsive static page (mobile + desktop) generated FROM detailed.md
```

Each file links to its neighbors in the pipeline — follow those links to see what feeds what.

## Key workflow rule

`web/index.html` is generated output, not hand-edited. When `itinerary/detailed.md` changes and the user asks to update the webpage, regenerate `web/index.html` from it (self-contained HTML/CSS, no build step, responsive layout that works well on both mobile and desktop). Do not maintain the webpage's content by hand — it should always be a straight rendering of `detailed.md`.

## Editing itinerary/detailed.md

Each day is a `## Day N - YYYY/MM/DD (weekday)` heading followed by a `住宿：` line and a table with columns `時間 | 地點 | 內容 / 備註 | 交通方式`. Keep this structure consistent across days — the webpage generation step parses it directly.
