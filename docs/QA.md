# Verification record

5 October 2026.

## Automated checks

`npm test`: **4 passing tests, 0 failures**.

- All six stories have three distinct page assets, descriptive alternatives, and narrative text.
- All 18 WebP assets are exactly 900 × 1600 (9:16), and each is smaller than 650 KB.
- Reader routes handle unknown stories, missing pages, invalid numbers, and out-of-range page numbers.
- Storage recovery rejects damaged records, duplicate bookmarks, stale story IDs, and invalid progress.
- Search combines terms across titles, genres, and art styles; escaping covers HTML metacharacters.

`npm run build`: **passed**. Production output is a static `dist/` directory; it has no required external services.

## Browser checks

Tested with the Codex browser at desktop width 1280 and phone widths 390 and 320. No horizontal document overflow was observed. The story collection, story details, style explorer, content dialog, and portrait reader were inspected. All loaded images in the inspected views decoded correctly; the inspected browser console had no errors.

Manually exercised:

- Art filters and multiword search, including search-dialog results and close behavior.
- Save to library, library navigation, and persisted reading state.
- Style selection and preference feedback.
- Reader next/previous controls, keyboard navigation, page links, reload on a deep reader URL, enlarged view, and episode completion.
- Story content notes and the intended-audience information dialog.

Every generated illustration was visually inspected before web export. Caption positions are aligned to the actual panel gutters; three pages specify a split percentage slightly different from 50.

## Limits

Phone layouts were tested using viewport emulation, not physical iOS/Android devices. Touch-swipe handling is implemented, but real-device gestures and native app behavior have not been tested. This work includes no app-store submission, official age rating, formal accessibility certification, or native app package.
