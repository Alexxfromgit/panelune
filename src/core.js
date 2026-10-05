export const STORAGE_KEY = 'panelune-library-v1';

export function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

export function readerLink(story, episode, page = 1) {
  return `#/read/${story.id}/${episode.id}/${page}`;
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
    // Keep the first edition's /read/story/page links working.
    const legacy = !parts[2] || !Number.isNaN(Number(parts[2])) || ['NaN', 'Infinity', '-Infinity'].includes(parts[2]);
    const episode = legacy ? story.episodes[0] : story.episodes.find(item => item.id === parts[2]);
    if (!episode) return { type: 'not-found' };
    const parsed = Number((legacy ? parts[2] : parts[3]) || 1);
    const page = Number.isFinite(parsed) ? Math.max(1, Math.min(episode.pages.length, Math.floor(parsed))) : 1;
    return { type, story, episode, page };
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
    if (!progress || typeof progress !== 'object' || Array.isArray(progress)) continue;
    // Original progress was one page/completion record for the prologue.
    const records = progress.episodes || { prologue: progress };
    const episodes = {};
    for (const episode of story.episodes) {
      const entry = records[episode.id];
      if (entry && Number.isInteger(entry.page) && entry.page >= 1 && entry.page <= episode.pages.length) {
        episodes[episode.id] = { page: entry.page, complete: entry.complete === true };
      }
    }
    const validIds = Object.keys(episodes);
    if (validIds.length) {
      blank.progress[story.id] = {
        episodeId: Object.hasOwn(episodes, progress.episodeId) ? progress.episodeId : validIds[0], episodes,
        updatedAt: Number.isFinite(progress.updatedAt) ? progress.updatedAt : 0
      };
    }
  }
  const aliases = { Cartoon: 'Western cartoon', Realistic: 'Realistic painterly' };
  const favorite = aliases[value.favoriteStyle] || value.favoriteStyle;
  if (stories.some(story => story.style === favorite)) blank.favoriteStyle = favorite;
  return blank;
}

export function isStoryComplete(story, progress) {
  return story.episodes.every(episode => progress?.episodes?.[episode.id]?.complete === true);
}

export function readingTarget(story, progress) {
  const current = story.episodes.find(episode => episode.id === progress?.episodeId);
  if (current && !progress.episodes[current.id]?.complete) {
    return { episode: current, page: progress.episodes[current.id]?.page || 1 };
  }
  const next = story.episodes.find(episode => !progress?.episodes?.[episode.id]?.complete);
  const episode = next || story.episodes[0];
  return { episode, page: next ? progress?.episodes?.[episode.id]?.page || 1 : 1 };
}

export function recordProgress(prior, episode, page, complete = false, updatedAt = Date.now()) {
  return {
    episodeId: episode.id, updatedAt,
    episodes: {
      ...prior?.episodes,
      [episode.id]: { page, complete: complete || prior?.episodes?.[episode.id]?.complete === true }
    }
  };
}
