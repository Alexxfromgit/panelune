# Panelune

**Just one more page.** An original comic discovery site and portrait reader, built as a static website for GitHub Pages.

[Website](https://alexxfromgit.github.io/panelune/) · [Source repository](https://github.com/Alexxfromgit/panelune)

## Start in WebStorm

Open this directory as a project. Node.js 22 or newer is the only requirement. No package installation is needed.

```sh
npm run dev
```

Open `http://127.0.0.1:4173`. To use another port: `PORT=4174 npm run dev`.

```sh
npm test       # Content, artwork dimensions, routing, storage recovery, and search
npm run build  # Creates the deployable dist/ folder
npm run preview
```

`npm run dev` serves source files. Refresh the browser after editing. `npm run preview` serves the last build. The server binds to the local machine only.

## The first edition

| Story | Art direction | Genre |
| --- | --- | --- |
| The Midnight Observatory | Luminous webcomic | Mystery / slow-burn romance |
| Borrowed Sun | Western cartoon | Fantasy / romantic comedy |
| The Last Light | Realistic painterly | Drama / coastal mystery |
| Paper Moons | Ink and watercolor | Romance / magical realism |
| Signal / Zero | Neon neo-noir | Science fiction / urban thriller |
| Velvet City | European ligne claire | Mystery / period drama |
| After the Rain | Manhwa semi-real | Romance / urban fantasy |
| Skybound Letters | Anime cel-shade | Fantasy / sky adventure |
| Sunset Dispatch | Retro pulp | Adventure / desert mystery |
| Blackwater Ledger | Noir ink | Mystery / detective fiction |

Every story has a prologue and a two-page **Episode 1**. The original six keep their three-page prologues; the four new stories each have a two-page prologue. There are **46 distinct illustrated pages** in total, including 20 new Episode 1 pages, exported as 900 × 1600 WebP images (exactly 9:16). Each narrative page contains two panels, with live HTML dialogue that remains selectable, accessible, and easy to translate. Scripts and illustrations were created with AI assistance for this project. These are short introductory chapters, not complete seasons.

## Included

- Responsive library, art-style filters, instant search, and story detail pages.
- Art-style explorer with a locally saved preference.
- Bookmarks, continue reading, completion state, and cross-tab library updates.
- Chapter selector, prologue-to-Episode-1 continuation, reader buttons, arrow-key navigation, touch swipes, page dots, and an enlarged view.
- Independent progress and completion for each chapter, with automatic migration of first-edition bookmarks, progress, and renamed style preferences.
- Descriptive image alternatives, visible keyboard focus, native modal focus management, and reduced-motion support.
- Static hash routes that refresh correctly at both a domain root and a GitHub project subdirectory.
- No external fonts, runtime dependencies, accounts, analytics, forms, payments, backend, or user uploads.

## Project map

```text
src/
  index.html       Document, metadata, and dialog hosts
  styles.css       Responsive design and reader presentation
  app.js           Views, navigation, interactions, browser storage
  core.js          Pure route, search, and storage functions
  stories.js       Original prologues and assembled story/episode catalog
  chapters.js      New stories, Episode 1 scripts, characters, and assets
  assets/          Local WebP artwork and SVG favicon
scripts/
  build.mjs        Copies source to dist and adds .nojekyll / 404.html
  serve.mjs        Minimal local preview server
tests/
  content.test.mjs Content and behavior contracts
docs/
  CONTENT-GUIDE.md Editorial boundaries and mobile-store considerations
  ART-DIRECTION.md Asset provenance and how to add a story
  artwork-prompts.json Final image generation prompts
.github/workflows/pages.yml
```

## Publish on GitHub Pages

The included workflow builds and deploys on pushes to `main`, and can also be run manually.

1. Create a GitHub repository and push this project to its `main` branch.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions**.
3. Run **Deploy Panelune to GitHub Pages** or push a commit to `main`.

For a repository called `panelune`, the default public URL is `https://<owner>.github.io/panelune/`. Every asset URL is relative; no base-path setting is required. Bookmarks belong to the browser and origin, so localhost and the published site have separate libraries.

The production build contains only `src/` plus generated static metadata. Documentation and image-generation prompts are not shipped as website assets, but are visible in a public source repository. The development server should not be used as an internet-facing production server.

## Future mobile release

The 18+ marker is an intended-audience statement, not an official rating or identity verification. See `docs/CONTENT-GUIDE.md`. Native packaging, genuine age-assurance requirements, legal privacy disclosures, payments, accounts, and app-store submissions are future work. An adult rating never guarantees review approval.

## Extending the collection

Edit `src/stories.js` and `src/chapters.js`, and add unique 9:16 WebP files to `src/assets/`. Each narrative page has two stacked panels with caption space in the lower quarter of each panel. Keep image files under 650 KB and retain descriptive `alt` text. Story and chapter counts are derived from the catalog. Each episode needs a stable `id`, `label`, `title`, and `pages` array. New reader URLs use `#/read/story-id/episode-id/page`; original `#/read/story-id/page` URLs still open the prologue. Extend the content contract tests when adding chapters or stories. Run the content tests before publishing.
