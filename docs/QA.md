# Verification record

5 October 2026 — expanded collection.

## Content and automated checks

The collection contains ten stories in ten visual directions. All six requested directions have a dedicated story: Manhwa semi-real, Western cartoon, Realistic painterly, Anime cel-shade, Retro pulp, and Noir ink. The original webcomic, watercolor, colored neo-noir, and ligne claire directions remain available.

Each story has a prologue and a two-page Episode 1. The six original prologues retain three pages each; the four new prologues have two pages each. There are 46 distinct illustrations, including 20 Episode 1 pages.

`npm test`: **8 passing tests, 0 failures**. `npm run build`: **passed**.

The automated suite covers:

- Required style coverage, unique story identities, and real Episode 1 content for every story.
- Exact 9:16 WebP dimensions, unique art for every page, descriptive alternatives, dialogue, and a 650 KB per-image budget.
- Episode-aware deep links and compatibility with the first edition’s prologue URLs.
- Migration of old bookmarks, completed prologues, and renamed favorite styles.
- Damaged storage, stale episode IDs, invalid page positions, and independent chapter completion.
- Resuming the next unread chapter, retaining progress after switching chapters, and re-reading completed chapters.
- Search across titles, genres, and all six requested style names.

## Browser verification

Tested in the Codex browser at desktop width 1280 and phone widths 390 and 320. No horizontal document overflow was observed in the checked collection, style explorer, story detail, and reader views.

Manually exercised:

- All six requested style filters; each returns its matching story.
- The ten-direction art explorer, including keeping the selected mobile tab in view.
- Searching for a new style and saving a new story to the browser library.
- Legacy prologue links and direct Episode 1 URLs.
- Prologue completion and the “Read Episode 1” continuation.
- Reader chapter selector, keyboard navigation, page links, refresh, and completion.
- Independent completed and unfinished chapter states on the story detail page.
- Caption alignment against measured artwork gutters and phone-sized artwork.

All generated artwork was visually inspected before web export. The panel split metadata accounts for gutters that differ from the requested 50/50 composition.

## Limits

Phone layouts were tested using viewport emulation, not physical iOS/Android devices. Touch-swipe handling remains implemented; real-device gestures and native app behavior were not tested. This work includes no store submission, official age rating, formal accessibility certification, or native app package.
