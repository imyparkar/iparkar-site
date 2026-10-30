import assert from 'node:assert/strict';
import fs from 'node:fs';
const pages=['contact/index.html','certificate-courses/nebosh/index.html','certificate-courses/iosh/index.html','certification-pathways/environmental/epi/index.html','certification-pathways/environmental/qep/index.html','certification-pathways/safety/asp/index.html','certification-pathways/safety/csp/index.html','certification-pathways/safety/cfps/index.html','certification-pathways/industrial-hygiene/cih/index.html','certification-pathways/industrial-hygiene/bohs/index.html','certification-pathways/select/index.html','certification-pathways/safety/index.html','certification-pathways/industrial-hygiene/index.html','certification-pathways/environmental/index.html','index.html','about/index.html','certification-pathways/index.html','certificate-courses/index.html','resources/index.html','live-quiz/index.html','practice-exams/index.html'];
const titles=new Set(), descriptions=new Set();
for (const path of pages) {
 const html=fs.readFileSync(path,'utf8');
 assert.equal((html.match(/<h1\b/g)||[]).length,1,`${path}: one H1`);
 const title=html.match(/<title>(.*?)<\/title>/)[1]; assert(!titles.has(title)); titles.add(title);
 const desc=html.match(/name="description" content="([^"]+)"/)[1]; assert(!descriptions.has(desc)); descriptions.add(desc);
 assert(html.includes('rel="canonical"')); assert(!html.includes('noindex'));
 assert.equal((html.match(/aria-current="page"/g)||[]).length,path==='index.html'||path==='contact/index.html'?1:2);
 for(const match of html.matchAll(/(?:src|href)="(\/(?!\/)[^"?#]*)(?:[?#]([^" ]*))?"/g)) {
  const target=match[1].slice(1); const file=target.endsWith('/')?target+'index.html':target||'index.html';
  assert(fs.existsSync(file),`${path}: missing ${file}`);
  if(match[2] && !match[0].includes('?')) assert(fs.readFileSync(file,'utf8').includes(`id="${match[2]}"`),`${path}: missing fragment ${match[2]}`);
 }
 const schema=JSON.parse(html.match(/type="application\/ld\+json">(.*?)<\/script>/)[1]); assert(schema.length>=2);
}
assert(!fs.readFileSync('resources/index.html','utf8').includes('data-tab="quiz"'));
assert(!fs.readFileSync('certification-pathways/index.html','utf8').includes('finder-results'));
assert(!fs.readFileSync('resources/index.html','utf8').includes('Start practising'));
assert(!fs.readFileSync('certificate-courses/index.html','utf8').includes('M507'));
assert(fs.readFileSync('certification-pathways/industrial-hygiene/bohs/index.html','utf8').includes('M507'));
assert(!fs.readFileSync('live-quiz/index.html','utf8').includes('<iframe')); // click-to-load only
assert.equal((fs.readFileSync('sitemap.xml','utf8').match(/<loc>/g)||[]).length,21);
console.log('Passed: 21 pages checked for titles, descriptions, H1s, canonical links, structured data and local links.');
