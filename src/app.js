import { stories, styles } from './stories.js';
import { STORAGE_KEY, escapeHTML as e, readRoute, filterStories, sanitizeLibrary } from './core.js';

const $ = selector => document.querySelector(selector);
const iconPaths = {
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  left: '<path d="m14 6-6 6 6 6"/>', right: '<path d="m10 6 6 6-6 6"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  bookmark: '<path d="M6 4h12v17l-6-4-6 4z"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  star: '<path d="m12 3 2.6 5.8 6.4.7-4.7 4.3 1.3 6.2-5.6-3.2-5.6 3.2 1.3-6.2L3 9.5l6.4-.7Z"/>',
  spark: '<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5Z"/>',
  book: '<path d="M12 6C8 3 4 4 2 5v14c4-2 7-1 10 1 3-2 6-3 10-1V5c-2-1-6-2-10 1Zm0 0v14"/>',
  shuffle: '<path d="M3 6h3c4 0 8 12 12 12h3m-4-4 4 4-4 4M3 18h3c1.5 0 3-1.5 4.5-4M14 9c1.5-2 2.5-3 4-3h3m-4-4 4 4-4 4"/>',
  check: '<path d="m5 12 4 4L20 5"/>',
  expand: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'
};
const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.spark}</svg>`;
const brand = `<img src="./assets/favicon.svg" width="30" height="30" alt=""><span>panelune<span class="brand-period">.</span></span>`;
let library;
try { library = sanitizeLibrary(JSON.parse(localStorage.getItem(STORAGE_KEY)), stories); }
catch { library = sanitizeLibrary(null, stories); }
let activeFilter = 'All stories';
let activeStyle = Math.max(0, stories.findIndex(story => story.style === library.favoriteStyle));
let route;
let enlarged = false;
let finished = false;
let toastTimer;
let storageNoticeShown = false;

function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(library)); }
  catch {
    if (!storageNoticeShown) toast('Browser storage is unavailable. Your library will last for this visit.');
    storageNoticeShown = true;
  }
}
function toast(message) {
  clearTimeout(toastTimer);
  $('#toast').textContent = message;
  $('#toast').classList.add('visible');
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3200);
}
function startLink(story) {
  const progress = library.progress[story.id];
  return `#/read/${story.id}/${progress && !progress.complete ? progress.page : 1}`;
}
function savedButton(story, additionalClass = '') {
  const saved = library.saved.includes(story.id);
  return `<button class="save-button ${additionalClass} ${saved ? 'is-saved' : ''}" data-save="${story.id}" aria-pressed="${saved}" aria-label="${saved ? 'Remove' : 'Save'} ${e(story.title)} ${saved ? 'from' : 'to'} your library">${icon(saved ? 'check' : 'bookmark')}</button>`;
}
function cover(story, { decorative = false, eager = false } = {}) {
  return `<div class="cover-art cover-${story.id}" style="--story-accent:${story.accent}"><img src="${story.cover}" alt="${decorative ? '' : e(story.pages[0].alt)}" width="900" height="1600" ${eager ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'} decoding="async"><div class="cover-shade"></div><span class="cover-imprint">PANELUNE ORIGINAL</span><div class="cover-lettering">${e(story.shortTitle).replaceAll('\n', '<br>')}</div><span class="cover-edition">${story.number} / THE FIRST EDITION</span></div>`;
}
function card(story) {
  const progress = library.progress[story.id];
  return `<article class="story-card"><div class="card-image-wrap"><a class="cover-link" href="#/story/${story.id}" aria-label="Discover ${e(story.title)}">${cover(story)}</a>${savedButton(story)}<span class="card-style">${story.style}</span>${progress ? `<div class="card-progress" style="--progress:${progress.complete ? 100 : progress.page / story.pages.length * 100}%" aria-label="${progress.complete ? 'Prologue completed' : `Page ${progress.page} of ${story.pages.length}`}"></div>` : ''}</div><a class="story-title" href="#/story/${story.id}">${e(story.title)}</a><p class="story-genre">${story.genre}</p><div class="card-bottom"><span>${progress?.complete ? 'Prologue read' : 'Prologue available'}</span><a href="${startLink(story)}" aria-label="${progress && !progress.complete ? 'Continue' : 'Read'} ${e(story.title)}">${icon('arrow')}</a></div></article>`;
}
function renderHeader() {
  const reader = route.type === 'read';
  $('#site-header').className = reader ? 'reader-site-header' : '';
  $('#site-header').innerHTML = reader ? `<div class="reader-top"><a class="reader-back" href="#/story/${route.story.id}">${icon('left')}<span>${e(route.story.title)}</span></a><a class="brand reader-brand" href="#/discover" aria-label="Panelune home">${brand}</a><button class="icon-button" data-action="enlarge" aria-label="${enlarged ? 'Fit full page on screen' : 'Enlarge comic page'}" aria-pressed="${enlarged}">${icon('expand')}</button></div>` : `<div class="nav-shell"><a href="#/discover" class="brand" aria-label="Panelune home">${brand}</a><nav aria-label="Main navigation"><a href="#/discover" ${route.type === 'discover' ? 'aria-current="page"' : ''}>Discover</a><a href="#/styles" ${route.type === 'styles' ? 'aria-current="page"' : ''}>Art styles</a><a href="#/library" ${route.type === 'library' ? 'aria-current="page"' : ''}>My library${library.saved.length ? `<span class="library-count">${library.saved.length}</span>` : ''}</a></nav><div class="nav-actions"><button class="search-button" data-action="search" aria-label="Search stories">${icon('search')}<span>Search</span><kbd>/</kbd></button><button class="age-label" data-info="content" aria-label="Content guide for adult readers">18+</button></div></div>`;
}
function renderFooter() {
  $('#site-footer').hidden = route.type === 'read';
  $('#site-footer').innerHTML = `<div class="footer-top"><a href="#/discover" class="brand" aria-label="Panelune home">${brand}</a><p>A world between the pages.</p><div class="footer-links"><button data-info="about">Our story</button><button data-info="content">Content guide</button><button data-info="privacy">Privacy</button></div></div><div class="footer-bottom"><span>© 2026 Panelune. Original stories, endless possibility.</span><span>Made for the love of stories ${icon('spark')}</span></div>`;
}
function renderDiscover() {
  const current = Object.entries(library.progress).filter(([, p]) => !p.complete).sort((a, b) => b[1].updatedAt - a[1].updatedAt)[0];
  const currentStory = current ? stories.find(story => story.id === current[0]) : null;
  $('#main').innerHTML = `<section class="hero"><div class="hero-copy"><div class="eyebrow"><span class="small-orbit"></span> THE FIRST EDITION</div><h1>Just one<br>more <em>page.</em></h1><p>Six original worlds. Six ways to get lost.<br>Find a story that stays with you.</p><div class="hero-actions"><a class="button primary" href="#collection" data-action="collection">Find your story ${icon('arrow')}</a><button class="button text-button" data-action="surprise">${icon('shuffle')} Surprise me</button></div><div class="hero-footnote"><span class="mini-line"></span> GOOD STORIES KEEP YOU UP.</div></div><div class="hero-gallery" aria-label="Featured stories"><a class="hero-book hero-book-left" href="#/story/borrowed-sun" aria-label="Discover Borrowed Sun">${cover(stories[1], {decorative:true, eager:true})}</a><a class="hero-book hero-book-right" href="#/story/signal-zero" aria-label="Discover Signal / Zero">${cover(stories[4], {decorative:true, eager:true})}</a><a class="hero-book hero-book-main" href="#/story/midnight-observatory" aria-label="Discover The Midnight Observatory">${cover(stories[0], {decorative:true, eager:true})}</a><span class="hero-spark spark-one">✦</span><span class="hero-spark spark-two">✧</span><div class="hero-caption"><span class="live-dot"></span> YOUR NEXT WORLD IS WAITING</div></div></section>
    <div class="edition-strip"><span>${icon('book')} Original, from the first page.</span><span>6 stories <i>·</i> 6 art styles <i>·</i> A little something unexpected</span><span class="edition-number">VOL. 001 / 2026</span></div>
    ${currentStory ? `<aside class="continue-banner"><img src="${currentStory.cover}" alt="" width="40" height="56"><div><span>RIGHT WHERE YOU LEFT OFF</span><p>${e(currentStory.title)} <small>· Page ${current[1].page} of 3</small></p></div><a class="text-link" href="${startLink(currentStory)}">Keep reading ${icon('arrow')}</a></aside>` : ''}
    <section class="collection section-shell" id="collection" aria-labelledby="collection-title"><div class="section-heading"><div><div class="eyebrow muted">THE COLLECTION</div><h2 id="collection-title">A story for every side of you.</h2></div><span class="section-aside">Small escapes. Big feelings.</span></div><div class="filter-bar"><div class="filters" role="group" aria-label="Filter stories by art style">${styles.map(style => `<button data-filter="${style}" class="filter ${activeFilter === style ? 'active' : ''}" aria-pressed="${activeFilter === style}">${style}</button>`).join('')}</div><span id="result-count" class="result-count" aria-live="polite">6 stories</span></div><div id="story-grid" class="story-grid">${filterStories(stories, {style: activeFilter}).map(card).join('')}</div></section>
    <section class="style-invitation section-shell"><div class="style-invitation-mark">Aa<span>✳</span></div><div><div class="eyebrow">ONE COLLECTION. MANY PERSPECTIVES.</div><h2>Find your kind of beautiful.</h2><p>Bold ink or soft watercolor? Cinematic or a little whimsical?<br>Explore the artwork. See what speaks to you.</p></div><a class="button outline" href="#/styles">Explore the styles ${icon('arrow')}</a></section>`;
  updateFilterCount();
}
function updateFilterCount() {
  const count = filterStories(stories, {style: activeFilter}).length;
  if ($('#result-count')) $('#result-count').textContent = `${count} ${count === 1 ? 'story' : 'stories'}`;
}
function renderStory(story) {
  const progress = library.progress[story.id];
  const related = stories.filter(s => s.id !== story.id).slice(0,3);
  $('#main').innerHTML = `<section class="story-detail section-shell"><a class="back-link" href="#/discover">${icon('left')} Back to the collection</a><div class="detail-grid"><div class="detail-cover">${cover(story, {eager:true})}</div><div class="detail-copy"><div class="eyebrow" style="color:${story.accent}">PANELUNE ORIGINAL / ${story.number}</div><div class="detail-tags"><a href="#/styles" data-style-link="${e(story.style)}">${story.style}</a><span>${story.genre}</span></div><h1>${e(story.title)}</h1><p class="detail-tagline">${e(story.tagline)}</p><p class="synopsis">${e(story.synopsis)}</p><div class="detail-actions"><a class="button primary" href="${startLink(story)}">${icon('book')}${progress?.complete ? 'Read again' : progress ? 'Continue reading' : 'Start the prologue'} ${icon('arrow')}</a><button class="button outline detail-save" data-save="${story.id}" aria-pressed="${library.saved.includes(story.id)}">${icon(library.saved.includes(story.id) ? 'check' : 'bookmark')}<span>${library.saved.includes(story.id) ? 'Saved to library' : 'Save for later'}</span></button></div><div class="detail-facts"><span>${icon('book')} 3 portrait pages</span><span>${icon('clock')} A short escape</span><span>Free to read</span></div><details class="content-note"><summary>Before you read <span>Content & characters</span></summary><p>${e(story.notes)}</p><p>${e(story.cast)}</p></details></div></div></section><section class="episodes section-shell"><div class="section-heading"><h2>Your first chapter.</h2><span class="section-aside">01 episode available</span></div><a class="episode-row" href="${startLink(story)}"><span class="episode-no">00</span><img src="${story.cover}" alt="" width="50" height="70"><div><span class="eyebrow muted">PROLOGUE</span><h3>${e(story.chapter)}</h3></div><span class="episode-meta">3 pages <i>·</i> ${progress?.complete ? 'Completed' : 'Free'}</span>${icon('arrow')}</a><p class="episode-note">An introduction to this world. The next chapter is still being written.</p></section><section class="more-stories section-shell"><div class="section-heading"><h2>Another world awaits.</h2><a class="text-link" href="#/discover">All stories ${icon('arrow')}</a></div><div class="recommend-grid">${related.map(s=>`<a class="recommend-card" href="#/story/${s.id}"><img src="${s.cover}" alt="" loading="lazy"><div><span class="eyebrow muted">${s.style}</span><h3>${e(s.title)}</h3><p>${s.genre}</p></div>${icon('arrow')}</a>`).join('')}</div></section>`;
}
function renderLibrary() {
  const inProgress = stories.filter(story => library.progress[story.id] && !library.progress[story.id].complete);
  const saved = stories.filter(story => library.saved.includes(story.id));
  const completed = stories.filter(story => library.progress[story.id]?.complete);
  $('#main').innerHTML = `<section class="page-intro section-shell"><div class="eyebrow">YOUR OWN LITTLE UNIVERSE</div><h1>My library<span class="coral">.</span></h1><p>The stories you love. The pages you’ll come back to.</p><span class="local-note">Saved on this browser. No account needed.</span></section><div class="library-content section-shell">${inProgress.length ? `<section><div class="section-heading"><h2>One more page?</h2><span>Continue reading</span></div><div class="recommend-grid">${inProgress.map(story=>`<a class="recommend-card" href="${startLink(story)}"><img src="${story.cover}" alt=""><div><span class="eyebrow muted">PAGE ${library.progress[story.id].page} OF 3</span><h3>${e(story.title)}</h3><p>Pick up where you left off</p></div>${icon('arrow')}</a>`).join('')}</div></section>` : ''}<section><div class="section-heading"><h2>Saved for a good moment.</h2><span class="section-aside">${saved.length} ${saved.length === 1 ? 'story' : 'stories'}</span></div>${saved.length ? `<div class="story-grid library-grid">${saved.map(card).join('')}</div>` : `<div class="empty-state"><div class="empty-icon">${icon('bookmark')}</div><h3>Leave a little room for wonder.</h3><p>Save a story with the bookmark button.<br>It will be waiting for you here.</p><a class="button primary" href="#/discover">Explore the collection ${icon('arrow')}</a></div>`}</section>${completed.length ? `<section><div class="section-heading"><h2>Worlds you’ve visited.</h2><span class="section-aside">${completed.length} ${completed.length === 1 ? 'prologue' : 'prologues'} read</span></div><div class="story-grid library-grid">${completed.map(card).join('')}</div></section>` : ''}</div>`;
}
function renderStyles() {
  const story = stories[activeStyle];
  $('#main').innerHTML = `<section class="page-intro section-shell"><div class="eyebrow">DIFFERENT STROKES. DIFFERENT WORLDS.</div><h1>What’s your <em>style?</em></h1><p>Six visual directions. One shared love of storytelling.</p></section><section class="style-studio section-shell"><div class="style-tabs" role="group" aria-label="Choose an art style">${stories.map((s,i)=>`<button data-style="${i}" aria-pressed="${activeStyle===i}" class="${activeStyle===i?'active':''}"><span>${s.number}</span>${s.style}${activeStyle===i?icon('arrow'):''}</button>`).join('')}</div><div class="style-preview"><img src="${story.cover}" alt="${e(story.pages[0].alt)}" width="900" height="1600"><span>${story.number} / 06</span></div><div class="style-description"><span class="eyebrow" style="color:${story.accent}">THE ART OF THE STORY</span><h2>${story.style}<span class="coral">.</span></h2><p>${e(story.styleNote)}</p><div class="style-story"><span>EXPERIENCE IT IN</span><a href="#/story/${story.id}">${e(story.title)} ${icon('arrow')}</a></div><button class="button outline" data-favorite-style="${e(story.style)}" aria-pressed="${library.favoriteStyle === story.style}">${icon(library.favoriteStyle === story.style ? 'check' : 'star')} ${library.favoriteStyle === story.style ? 'Your favorite style' : 'This is my style'}</button><span class="local-note">Your preference is saved on this browser.</span></div></section><section class="style-closing section-shell"><span class="eyebrow muted">NO NEED TO PICK JUST ONE WORLD</span><h2>The best way to find your favorite?<br>Turn a few pages.</h2><a class="text-link" href="#/discover">Back to the collection ${icon('arrow')}</a></section>`;
}
function renderReader(story, number) {
  if (finished) return renderFinish(story);
  const page = story.pages[number-1];
  const prior = library.progress[story.id];
  library.progress[story.id] = { page: number, complete: prior?.complete === true, updatedAt: Date.now() };
  persist();
  $('#main').innerHTML = `<section class="reader-shell ${enlarged ? 'enlarged' : ''}" aria-label="Comic reader"><div class="reader-subhead"><span>PROLOGUE <i>/</i> ${e(story.chapter)}</span><span>${String(number).padStart(2,'0')} <i>/</i> ${String(story.pages.length).padStart(2,'0')}</span></div><div class="reader-stage"><button class="reader-side previous" data-action="previous" aria-label="Previous page" ${number === 1 ? 'disabled' : ''}>${icon('left')}</button><figure class="comic-page ${page.kind}" id="comic-page"><img class="page-art" src="${page.image}" alt="${e(page.alt)}" width="900" height="1600" fetchpriority="high">${page.kind === 'opening' ? `<figcaption class="opening-caption"><span class="eyebrow">PANELUNE ORIGINAL / PROLOGUE</span><h1>${e(story.title)}</h1><p>${e(page.narration)}</p></figcaption>` : `<figcaption class="comic-captions" style="grid-template-rows:${page.split || 50}% 1fr">${page.captions.map(c=>`<div class="comic-panel-caption"><p><span>${e(c.speaker)}</span>${e(c.text)}</p></div>`).join('')}</figcaption>`}</figure><button class="reader-side next" data-action="next" aria-label="${number === story.pages.length ? 'Finish prologue' : 'Next page'}">${icon('right')}</button></div><div class="reader-controls"><button class="button text-button" data-action="previous" ${number === 1 ? 'disabled' : ''}>${icon('left')}<span>Previous</span></button><div class="page-dots" aria-label="Jump to page">${story.pages.map((_,i)=>`<a href="#/read/${story.id}/${i+1}" class="${number===i+1?'active':''}" aria-label="Page ${i+1}" ${number===i+1?'aria-current="page"':''}></a>`).join('')}</div><button class="button text-button" data-action="next"><span>${number===story.pages.length?'Finish':'Next page'}</span>${icon('right')}</button></div><p class="reader-hint">Swipe or use ${icon('left')}${icon('right')} to turn the page <span>·</span> ${enlarged ? 'Enlarged view' : 'One page. One moment.'}</p></section>`;
  if (number < story.pages.length) { const preload = new Image(); preload.src = story.pages[number].image; }
}
function renderFinish(story) {
  const enlargeButton = $('[data-action="enlarge"]');
  if (enlargeButton) enlargeButton.hidden = true;
  const next = stories[(stories.indexOf(story) + 1) % stories.length];
  $('#main').innerHTML = `<section class="reader-finish section-shell"><div class="finish-icon">${icon('check')}</div><div class="eyebrow">PROLOGUE COMPLETE</div><h1>Some endings<br>are <em>beginnings.</em></h1><p>You’ve reached the first edge of <strong>${e(story.title)}</strong>.<br>The next chapter is still being written.</p><div class="finish-actions"><button class="button outline detail-save" data-save="${story.id}" aria-pressed="${library.saved.includes(story.id)}">${icon(library.saved.includes(story.id)?'check':'bookmark')}<span>${library.saved.includes(story.id)?'Saved to library':'Keep this story'}</span></button><a class="button primary" href="#/discover">Explore more stories ${icon('arrow')}</a></div><a class="finish-recommend" href="#/story/${next.id}"><img src="${next.cover}" alt="" width="64" height="100"><div><span class="eyebrow muted">TRY SOMETHING DIFFERENT</span><h3>${e(next.title)}</h3><p>${next.style} · ${next.genre}</p></div>${icon('arrow')}</a></section>`;
}
function render() {
  route = readRoute(location.hash, stories);
  finished = false;
  document.body.classList.toggle('is-reading', route.type === 'read');
  renderHeader(); renderFooter();
  if (route.type === 'discover') renderDiscover();
  else if (route.type === 'story') renderStory(route.story);
  else if (route.type === 'library') renderLibrary();
  else if (route.type === 'styles') renderStyles();
  else if (route.type === 'read') renderReader(route.story, route.page);
  else $('#main').innerHTML = `<div class="empty-state not-found"><span class="eyebrow">A PAGE OUT OF PLACE</span><h1>This story took a wrong turn.</h1><p>That page doesn’t exist in our collection.</p><a class="button primary" href="#/discover">Back to the stories ${icon('arrow')}</a></div>`;
  document.title = route.story ? `${route.story.title}${route.type==='read'?` · Page ${route.page}`:''} — Panelune` : route.type === 'library' ? 'My library — Panelune' : route.type === 'styles' ? 'Find your art style — Panelune' : 'Panelune — Just one more page.';
  window.scrollTo({top:0,left:0,behavior:'instant'});
  if (location.hash === '#collection') $('#collection')?.scrollIntoView({behavior:'instant'});
}
function toggleSave(id) {
  const story = stories.find(s=>s.id === id);
  if (!story) return;
  const saved = library.saved.includes(id);
  library.saved = saved ? library.saved.filter(value=>value!==id) : [...library.saved,id];
  persist();
  document.querySelectorAll(`[data-save="${id}"]`).forEach(button=>{
    button.setAttribute('aria-pressed',String(!saved));
    button.classList.toggle('is-saved',!saved);
    if (button.classList.contains('detail-save')) button.innerHTML = `${icon(!saved?'check':'bookmark')}<span>${!saved?'Saved to library':'Save for later'}</span>`;
    else {
      button.innerHTML = icon(!saved?'check':'bookmark');
      button.setAttribute('aria-label',`${!saved?'Remove':'Save'} ${story.title} ${!saved?'from':'to'} your library`);
    }
  });
  renderHeader();
  if(route.type==='library') {renderLibrary();$('#main').focus({preventScroll:true});}
  toast(saved ? 'Story removed from your library' : 'A good story, saved for later');
}
function turnPage(direction) {
  if(route.type!=='read' || finished) return;
  const page = route.page + direction;
  if(page<1) return;
  if(page>route.story.pages.length) {
    library.progress[route.story.id].complete = true; persist(); finished=true; renderFinish(route.story);
    $('#main').focus({preventScroll:true}); return;
  }
  location.hash = `/read/${route.story.id}/${page}`;
}
function searchResults(query) {
  const results = filterStories(stories,{query});
  $('#search-results').innerHTML = results.length ? results.map(story=>`<a class="search-result" href="#/story/${story.id}" data-close-search><img src="${story.cover}" alt="" width="42" height="64"><div><strong>${e(story.title)}</strong><span>${story.style} · ${story.genre}</span></div>${icon('arrow')}</a>`).join('') : `<div class="search-empty"><h3>No stories found.</h3><p>Try a title, an art style, or a genre like “mystery”.</p></div>`;
  $('#search-summary').textContent = `${results.length} ${results.length===1?'story':'stories'} ${query ? 'found' : 'to discover'}`;
}
function openSearch() {
  $('#search-dialog').innerHTML = `<div class="dialog-heading"><h2 id="search-title">Find your next story.</h2><button class="icon-button" data-close-dialog aria-label="Close search">${icon('close')}</button></div><label class="search-field">${icon('search')}<input id="search-input" type="search" placeholder="A title, a style, a feeling…" aria-label="Search titles, styles, and genres" autocomplete="off"></label><p id="search-summary" class="search-summary" aria-live="polite"></p><div id="search-results"></div>`;
  searchResults(''); $('#search-dialog').showModal(); $('#search-input').focus();
}
function openInfo(type) {
  const content = {
    about: { title:'A world between the pages.', body:'<p>Panelune is an independent concept collection for people who love getting lost in a story. Six original worlds explore six different visual directions, from luminous webcomic art to soft watercolor.</p><p>These are pilot prologues: a small beginning with room to grow. The original scripts and illustrations were created with AI assistance and curated for this collection. The next chapters are not yet available.</p><p>No accounts. No paywalls. Just a little time and a good story.</p>' },
    content: {title:'Good stories. Thoughtful boundaries.', body:'<p>Panelune is intended for adult readers (18+). Our opening collection includes romance, grief, mystery, and atmospheric suspense. Every principal character is an adult.</p><p>The stories contain no nudity, explicit sexual content, graphic violence, or gambling. Each story has its own content notes before you begin.</p><p>18+ describes our intended audience. It is not a store-assigned rating or age-verification system. Any future mobile app will need its own accurate rating questionnaire and platform review.</p>'},
    privacy: {title:'Your stories stay with you.',body:'<p>Your bookmarks, reading position, and favorite art style are stored only in this browser using local storage. They are not sent to Panelune, and do not sync across devices.</p><p>There are no accounts, advertising trackers, analytics, or user uploads in this edition. GitHub Pages, when used for hosting, may receive ordinary web-request information under its own privacy practices.</p><p>Clearing browser site data removes your library. If browser storage is disabled, your choices work for the current visit only.</p>'}
  }[type];
  if(!content) return;
  $('#info-dialog').innerHTML = `<div class="dialog-heading"><span class="eyebrow">PANELUNE</span><button class="icon-button" data-close-dialog aria-label="Close information">${icon('close')}</button></div><h2 id="info-title">${content.title}</h2><div class="info-body">${content.body}</div>`;
  $('#info-dialog').showModal();
}

document.addEventListener('click',event=>{
  const target = event.target.closest('button, a');
  if(!target) return;
  if(target.classList.contains('skip-link')) {event.preventDefault();$('#main').focus();return;}
  if(target.dataset.save) toggleSave(target.dataset.save);
  if(target.dataset.info) openInfo(target.dataset.info);
  if(target.hasAttribute('data-close-dialog')) target.closest('dialog').close();
  if(target.hasAttribute('data-close-search')) $('#search-dialog').close();
  if(target.dataset.filter) {
    activeFilter=target.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(button=>{button.classList.toggle('active',button===target);button.setAttribute('aria-pressed',String(button===target));});
    $('#story-grid').innerHTML=filterStories(stories,{style:activeFilter}).map(card).join(''); updateFilterCount();
  }
  if(target.dataset.style!==undefined) { activeStyle=Number(target.dataset.style);renderStyles();document.querySelector(`[data-style="${activeStyle}"]`).focus({preventScroll:true}); }
  if(target.dataset.styleLink) activeStyle=stories.findIndex(story=>story.style===target.dataset.styleLink);
  if(target.dataset.favoriteStyle) { library.favoriteStyle=target.dataset.favoriteStyle;persist();renderStyles();$('[data-favorite-style]').focus({preventScroll:true});toast(`${library.favoriteStyle} saved as your favorite style`); }
  switch(target.dataset.action) {
    case 'search':openSearch();break;
    case 'surprise':location.hash=`/story/${stories[Math.floor(Math.random()*stories.length)].id}`;break;
    case 'collection':event.preventDefault();$('#collection').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});break;
    case 'previous':turnPage(-1);break;
    case 'next':turnPage(1);break;
    case 'enlarge':enlarged=!enlarged;renderHeader();renderReader(route.story,route.page);break;
  }
});
document.addEventListener('input',event=>{if(event.target.id==='search-input')searchResults(event.target.value);});
document.addEventListener('keydown',event=>{
  const editing = event.target.matches('input,textarea,select,[contenteditable="true"]');
  if(event.key==='/'&&!editing&&!document.querySelector('dialog[open]')) {event.preventDefault();openSearch();return;}
  if(editing||document.querySelector('dialog[open]')||event.altKey||event.ctrlKey||event.metaKey) return;
  if(route.type==='read'&&!finished) {
    if(event.key==='ArrowRight'){event.preventDefault();turnPage(1);}
    if(event.key==='ArrowLeft'){event.preventDefault();turnPage(-1);}
    if(event.key==='Escape')location.hash=`/story/${route.story.id}`;
  }
});
let touchStart;
document.addEventListener('touchstart',event=>{if(event.target.closest('#comic-page'))touchStart={x:event.changedTouches[0].clientX,y:event.changedTouches[0].clientY};else touchStart=null;},{passive:true});
document.addEventListener('touchend',event=>{
  if(!touchStart)return;
  const touch=event.changedTouches[0],dx=touch.clientX-touchStart.x,dy=touch.clientY-touchStart.y;
  if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)turnPage(dx<0?1:-1);
  touchStart=null;
},{passive:true});
window.addEventListener('hashchange',()=>{render();$('#main').focus({preventScroll:true});});
window.addEventListener('storage',event=>{
  if(event.key!==STORAGE_KEY&&event.key!==null)return;
  try{library=sanitizeLibrary(JSON.parse(event.newValue),stories);}catch{library=sanitizeLibrary(null,stories);}
  if(route.type!=='read')render();
});
render();
