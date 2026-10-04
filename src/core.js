export const STORAGE_KEY = 'panelune-library-v1';

export function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

export function readRoute(hash, stories) {
  const parts = hash.replace(/^#\/?/, '').split('/');
  const type = parts[0] || 'discover';
  if (type === 'main' || type === 'collection') return { type: 'discover' };
  if (['discover', 'library', 'styles'].includes(type)) return { type };
  if (['story', 'read'].includes(type)) {
    const story = stories.find(item => item.id === parts[1]);
    if (!story) return { type: 'not-found' };
    if (type === 'story') return { type, story };
    const parsed = Number(parts[2] || 1);
    const page = Number.isFinite(parsed) ? Math.max(1, Math.min(story.pages.length, Math.floor(parsed))) : 1;
    return { type, story, page };
  }
  return { type: 'not-found' };
}

export function filterStories(stories, { style = 'All stories', query = '' } = {}) {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return stories.filter(story => (style === 'All stories' || story.style === style) && words.every(word =>
    [story.title, story.style, story.genre, story.tagline, story.synopsis].join(' ').toLocaleLowerCase().includes(word)));
}

export function sanitizeLibrary(value, stories) {
  const blank = { saved: [], progress: {}, favoriteStyle: null };
  if (!value || typeof value !== 'object' || Array.isArray(value)) return blank;
  const ids = new Set(stories.map(story => story.id));
  blank.saved = Array.isArray(value.saved) ? [...new Set(value.saved.filter(id => ids.has(id)))] : [];
  for (const story of stories) {
    const progress = value.progress?.[story.id];
    if (progress && Number.isInteger(progress.page) && progress.page >= 1 && progress.page <= story.pages.length) {
      blank.progress[story.id] = { page: progress.page, complete: progress.complete === true,
        updatedAt: Number.isFinite(progress.updatedAt) ? progress.updatedAt : 0 };
    }
  }
  if (stories.some(story => story.style === value.favoriteStyle)) blank.favoriteStyle = value.favoriteStyle;
  return blank;
}
