# Art direction

Panelune uses a quiet charcoal library with coral accents, warm display typography, and book-cover compositions. The interface stays visually consistent while each story has its own visual language. On phones, the discovery catalog uses two columns; the reading experience focuses on one 9:16 page at a time.

## Artwork

All 18 original raster illustrations were made with the built-in ImageGen tool. Each story has one opening illustration and two narrative pages, with its opening illustration used as a character and style reference for subsequent pages. The six styles are webcomic, cartoon, painted realism, watercolor, neo-noir, and ligne claire.

ImageGen returned images close to 9:16; web delivery assets were mechanically exported to exact **900 × 1600** WebP at quality 86 with `cwebp`. No source artwork from the reference websites was copied. Each prologue has its own original premise and cliffhanger.

Final image prompts are recorded in `artwork-prompts.json`. Human-readable story scripts, caption text, content notes, and cast descriptions live in `src/stories.js`. Characters remain fully clothed adults. Page text is HTML rather than baked into the image, supporting screen readers and future localization.

## New artwork contract

- Opening image: one portrait scene, with major faces in the upper and middle area and room for title/narration toward the bottom.
- Narrative image: aim for two equal-height horizontal comic panels stacked into a portrait page, with a narrow divider at the middle. Leave the lower quarter of each panel relatively quiet for captions. The optional `split` percentage in a page record aligns captions to the actual illustrated gutter when it differs slightly from the midpoint.
- Export each page as its own 9:16 file. Never stitch an entire episode into one very long image.
- Keep a stable character reference for every episode. Review hands, faces, continuity, text artifacts, composition, and content boundaries before publishing.
- Supply meaningful scene descriptions in `alt`; use captions for dialogue, not as a substitute for describing the illustration.

The style preference control is local feedback for this first edition. It is not a global poll and no vote or popularity count is fabricated.
