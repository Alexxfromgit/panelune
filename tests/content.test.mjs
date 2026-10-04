import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stories } from '../src/stories.js';
import { filterStories, readRoute, sanitizeLibrary, escapeHTML } from '../src/core.js';

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

test('the entire six-story collection has unique, real 9:16 artwork and accessible narrative text',async()=>{
  assert.equal(stories.length,6);
  assert.equal(new Set(stories.map(story=>story.id)).size,6);
  assert.equal(new Set(stories.map(story=>story.style)).size,6);
  const images=new Set();
  for(const story of stories){
    assert.equal(story.pages.length,3);
    assert.ok(story.synopsis.length>100 && story.notes && story.cast);
    for(const page of story.pages){
      assert.ok(page.alt.length>35,'Every page needs descriptive alternative text');
      assert.ok(!images.has(page.image),'Every page needs distinct artwork');
      images.add(page.image);
      const buffer=await readFile(new URL(`../src/${page.image}`,import.meta.url));
      const [width,height]=webpSize(buffer);
      assert.equal(width*16,height*9,`${page.image} must be exactly 9:16`);
      assert.ok(buffer.length<650_000,`${page.image} exceeds the mobile asset budget`);
      if(page.kind==='comic')assert.equal(page.captions.length,2);
      else assert.ok(page.narration.length>40);
    }
  }
  assert.equal(images.size,18);
});

test('deep reader links recover from missing, invalid, and out-of-bounds page values',()=>{
  const id=stories[0].id;
  assert.equal(readRoute(`#/read/${id}/-5`,stories).page,1);
  assert.equal(readRoute(`#/read/${id}/999`,stories).page,3);
  assert.equal(readRoute(`#/read/${id}/NaN`,stories).page,1);
  assert.equal(readRoute(`#/read/${id}/2.8`,stories).page,2);
  assert.equal(readRoute(`#/read/${id}`,stories).page,1);
  assert.equal(readRoute('#/story/deleted',stories).type,'not-found');
  assert.equal(readRoute('#/unknown',stories).type,'not-found');
  assert.equal(readRoute('',stories).type,'discover');
});

test('outdated or damaged browser data does not create invalid bookmarks or progress',()=>{
  const id=stories[0].id;
  assert.deepEqual(sanitizeLibrary(null,stories),{saved:[],progress:{},favoriteStyle:null});
  assert.deepEqual(sanitizeLibrary({saved:[id,id,'deleted'],progress:{[id]:{page:0}}},stories),{saved:[id],progress:{},favoriteStyle:null});
  const restored=sanitizeLibrary({saved:'corrupt',progress:{[id]:{page:2,complete:false,updatedAt:123}},favoriteStyle:'Webcomic'},stories);
  assert.equal(restored.progress[id].page,2);
  assert.equal(restored.favoriteStyle,'Webcomic');
  assert.equal(sanitizeLibrary({progress:{[id]:{page:99}}},stories).progress[id],undefined);
  assert.equal(sanitizeLibrary({favoriteStyle:'retired style'},stories).favoriteStyle,null);
});

test('search combines words across title, genre, and visual style, and fails gracefully',()=>{
  assert.equal(filterStories(stories,{query:'  BORROWED   SUN '})[0].id,'borrowed-sun');
  assert.equal(filterStories(stories,{query:'watercolor romance'})[0].id,'paper-moons');
  assert.equal(filterStories(stories,{style:'Webcomic',query:'mystery'}).length,1);
  assert.equal(filterStories(stories,{style:'Cartoon',query:'observatory'}).length,0);
  assert.equal(filterStories(stories,{query:'<script>alert(1)</script>'}).length,0);
  assert.equal(escapeHTML('<script>"&\''),'&lt;script&gt;&quot;&amp;&#39;');
});
