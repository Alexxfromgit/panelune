import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stories, requiredStyles } from '../src/stories.js';
import { filterStories, readRoute, sanitizeLibrary, escapeHTML, readingTarget, isStoryComplete, recordProgress, readerLink } from '../src/core.js';

function webpSize(buffer) {
  assert.equal(buffer.toString('ascii',0,4),'RIFF');
  assert.equal(buffer.toString('ascii',8,12),'WEBP');
  for(let offset=12;offset+8<buffer.length;) {
    const type=buffer.toString('ascii',offset,offset+4), length=buffer.readUInt32LE(offset+4), start=offset+8;
    if(type==='VP8 ')return [buffer.readUInt16LE(start+6)&0x3fff,buffer.readUInt16LE(start+8)&0x3fff];
    if(type==='VP8X')return [buffer.readUIntLE(start+4,3)+1,buffer.readUIntLE(start+7,3)+1];
    if(type==='VP8L'){const value=buffer.readUInt32LE(start+1);return [(value&0x3fff)+1,((value>>>14)&0x3fff)+1];}
    offset=start+length+(length%2);
  }
  throw new Error('Missing WebP dimensions');
}

test('all requested styles have a distinct story and every story has a real Episode 1', () => {
  assert.equal(stories.length, 10);
  assert.equal(new Set(stories.map(story => story.id)).size, 10);
  for (const style of requiredStyles) assert.ok(stories.some(story => story.style === style), style);
  assert.deepEqual(requiredStyles, ['Manhwa semi-real', 'Western cartoon', 'Realistic painterly', 'Anime cel-shade', 'Retro pulp', 'Noir ink']);
  for (const story of stories) {
    assert.deepEqual(story.episodes.map(episode => episode.id), ['prologue', 'episode-1']);
    assert.equal(story.episodes[1].pages.length, 2);
    assert.ok(story.synopsis.length > 100 && story.notes && story.cast);
    assert.equal(story.cover, story.episodes[0].pages[0].image);
  }
});

test('all 46 pages have unique, optimized 9:16 artwork and accessible narrative text', async () => {
  const images = new Set();
  for (const story of stories) for (const episode of story.episodes) {
    assert.ok(episode.title && episode.label && episode.pages.length >= 2);
    for (const page of episode.pages) {
      assert.ok(page.alt.length > 35, 'Every page needs descriptive alternative text');
      assert.ok(!images.has(page.image), `Repeated artwork: ${page.image}`);
      images.add(page.image);
      const buffer = await readFile(new URL(`../src/${page.image}`, import.meta.url));
      const [width, height] = webpSize(buffer);
      assert.equal(width * 16, height * 9, `${page.image} must be exactly 9:16`);
      assert.ok(buffer.length < 650_000, `${page.image} exceeds the mobile asset budget`);
      if (page.kind === 'comic') {
        assert.equal(page.captions.length, 2);
        assert.ok(page.split > 35 && page.split < 65);
        page.captions.forEach(caption => assert.ok(caption.speaker && caption.text.length > 30));
      } else assert.ok(page.narration.length > 40);
    }
  }
  assert.equal(images.size, 46);
});

test('new episode URLs and first-edition prologue links recover bounded page positions', () => {
  const story = stories[0], id = story.id;
  for (const [path, page] of [['-5',1],['999',3],['NaN',1],['2.8',2],['',1]]) {
    const result = readRoute(`#/read/${id}/${path}`, stories);
    assert.equal(result.page, page);
    assert.equal(result.episode.id, 'prologue');
  }
  assert.equal(readRoute(readerLink(story, story.episodes[1], 2), stories).page, 2);
  assert.equal(readRoute(`#/read/${id}/episode-1/999`, stories).page, 2);
  assert.equal(readRoute(`#/read/${id}/episode-1/-1`, stories).page, 1);
  assert.equal(readRoute(`#/read/${id}/episode-1/invalid`, stories).page, 1);
  assert.equal(readRoute(`#/read/${id}/episode-1`, stories).episode.id, 'episode-1');
  assert.equal(readRoute(`#/read/${id}/episode-99/1`, stories).type, 'not-found');
  assert.equal(readRoute('#/story/deleted', stories).type, 'not-found');
  assert.equal(readRoute('#/unknown', stories).type, 'not-found');
  assert.equal(readRoute('', stories).type, 'discover');
});

test('first-edition bookmarks, completed prologues, and renamed style preferences migrate', () => {
  const story = stories[1], id = story.id;
  const restored = sanitizeLibrary({ saved: [id, id, 'deleted'], progress: {
    [id]: { page: 3, complete: true, updatedAt: 123 }
  }, favoriteStyle: 'Cartoon' }, stories);
  assert.deepEqual(restored.saved, [id]);
  assert.deepEqual(restored.progress[id], { episodeId: 'prologue', episodes: { prologue: { page: 3, complete: true } }, updatedAt: 123 });
  assert.equal(restored.favoriteStyle, 'Western cartoon');
  assert.equal(readingTarget(story, restored.progress[id]).episode.id, 'episode-1');
  assert.equal(isStoryComplete(story, restored.progress[id]), false);
  assert.equal(sanitizeLibrary({ favoriteStyle: 'Realistic' }, stories).favoriteStyle, 'Realistic painterly');
});

test('corrupt or obsolete storage cannot introduce invalid episode progress', () => {
  const id = stories[0].id;
  assert.deepEqual(sanitizeLibrary(null, stories), { saved: [], progress: {}, favoriteStyle: null });
  const restored = sanitizeLibrary({ saved: 'corrupt', progress: { [id]: {
    episodeId: 'deleted', episodes: {
      prologue: { page: 2, complete: false }, 'episode-1': { page: 99 }, deleted: { page: 1 }
    }, updatedAt: 'invalid'
  } }, favoriteStyle: 'retired style' }, stories);
  assert.deepEqual(restored.progress[id], { episodeId: 'prologue', episodes: { prologue: { page: 2, complete: false } }, updatedAt: 0 });
  assert.equal(restored.favoriteStyle, null);
  for (const page of [0, 99, 1.5, '1', null]) {
    assert.equal(sanitizeLibrary({ progress: { [id]: { page } } }, stories).progress[id], undefined);
  }
  assert.equal(sanitizeLibrary({ progress: { [id]: { episodeId: 'toString', episodes: { prologue: { page: 1 } } } } }, stories).progress[id].episodeId, 'prologue');
});

test('reading and re-reading preserve completion and positions in other chapters', () => {
  const story = stories[0], [prologue, episodeOne] = story.episodes;
  let progress = recordProgress(null, prologue, 3, true, 1);
  progress = recordProgress(progress, episodeOne, 2, false, 2);
  assert.equal(progress.episodes.prologue.complete, true);
  assert.equal(readingTarget(story, progress).page, 2);
  progress = recordProgress(progress, episodeOne, 2, true, 3);
  assert.equal(isStoryComplete(story, progress), true);
  progress = recordProgress(progress, prologue, 1, false, 4);
  assert.equal(isStoryComplete(story, progress), true);
  assert.equal(progress.episodes['episode-1'].page, 2);
  assert.equal(progress.updatedAt, 4);
  assert.equal(readingTarget(story, progress).episode.id, 'prologue');
  assert.equal(readingTarget(story, progress).page, 1);
});

test('starting Episode 1 directly leaves an unread prologue available', () => {
  const story = stories[6];
  const progress = recordProgress(null, story.episodes[1], 2, true);
  assert.equal(isStoryComplete(story, progress), false);
  assert.equal(readingTarget(story, progress).episode.id, 'prologue');
  assert.deepEqual(readingTarget(story), { episode: story.episodes[0], page: 1 });
});

test('search finds each visual direction and combines terms across story fields', () => {
  for (const style of requiredStyles) assert.ok(filterStories(stories, { query: style }).length);
  assert.equal(filterStories(stories, { query: '  BORROWED   SUN ' })[0].id, 'borrowed-sun');
  assert.equal(filterStories(stories, { query: 'watercolor romance' })[0].id, 'paper-moons');
  assert.equal(filterStories(stories, { style: 'Noir ink', query: 'detective' })[0].id, 'blackwater-ledger');
  assert.equal(filterStories(stories, { style: 'Western cartoon', query: 'observatory' }).length, 0);
  assert.equal(filterStories(stories, { query: '<script>alert(1)</script>' }).length, 0);
  assert.equal(escapeHTML('<script>"&\''), '&lt;script&gt;&quot;&amp;&#39;');
});
