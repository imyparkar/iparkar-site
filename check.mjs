import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const {recommend}=createRequire(import.meta.url)('./pathway-finder.js');
const base={target:'unsure',education:'bachelor',field:'stem',safety:'0',hygiene:'0',fire:'0',environment:'0',preventive:'no',qualifying:'no',foundation:'no'};
const run=(a)=>recommend({...base,...a});
assert(run({}).needsInterest);
assert(run({education:'school'}).courses.some(x=>x.id==='nebosh-igc'));
assert.equal(run({target:'asp',safety:'1',preventive:'yes'}).matches[0].fit,true);
assert.equal(run({target:'asp',safety:'0.9',preventive:'yes'}).matches[0].fit,false);
assert.equal(run({target:'asp',education:'diploma',field:'other',safety:'10',preventive:'yes'}).matches[0].fit,false);
assert.equal(run({target:'csp',safety:'4',preventive:'yes',qualifying:'yes'}).matches[0].fit,true);
assert.equal(run({target:'csp',safety:'4',preventive:'yes',qualifying:'unknown'}).matches[0].fit,false);
assert.equal(run({target:'csp',education:'school',safety:'20',preventive:'yes',qualifying:'yes'}).matches[0].fit,false);
assert.equal(run({target:'cih',safety:'15',hygiene:'0'}).matches[0].fit,false);
assert.equal(run({target:'cih',hygiene:'4'}).matches[0].fit,true);
assert.equal(run({target:'cfps',fire:'20'}).matches[0].fit,false); // handbook review is always needed
assert.equal(run({target:'qep',environment:'5'}).matches[0].fit,true);
assert.equal(run({target:'qep',field:'other',environment:'5'}).matches[0].fit,false);
assert.equal(run({target:'qep',field:'other',environment:'8'}).matches[0].fit,true);
assert.equal(run({target:'epi',education:'student',environment:'0'}).matches[0].fit,true);
assert.equal(run({target:'epi',environment:'5'}).matches[0].fit,false);
assert.equal(run({target:'courses',safety:'8'}).matches.length,0);
assert(run({target:'courses',foundation:'yes',safety:'5'}).courses.some(x=>x.id==='iosh-diploma'));

const pages=['index.html','about/index.html','certification-pathways/index.html','certificate-courses/index.html','resources/index.html','resources/live-quiz/index.html','practice-exams/index.html'];
const titles=new Set(), descriptions=new Set();
for (const path of pages) {
 const html=fs.readFileSync(path,'utf8');
 assert.equal((html.match(/<h1\b/g)||[]).length,1,`${path}: one H1`);
 const title=html.match(/<title>(.*?)<\/title>/)[1]; assert(!titles.has(title)); titles.add(title);
 const desc=html.match(/name="description" content="([^"]+)"/)[1]; assert(!descriptions.has(desc)); descriptions.add(desc);
 assert(html.includes('rel="canonical"')); assert(!html.includes('noindex'));
 assert.equal((html.match(/aria-current="page"/g)||[]).length,path.includes('live-quiz')?2:1);
 for(const match of html.matchAll(/(?:src|href)="(\/(?!\/)[^"?#]*)(?:[?#]([^" ]*))?"/g)) {
  const target=match[1].slice(1); const file=target.endsWith('/')?target+'index.html':target||'index.html';
  assert(fs.existsSync(file),`${path}: missing ${file}`);
  if(match[2] && !match[0].includes('?')) assert(fs.readFileSync(file,'utf8').includes(`id="${match[2]}"`),`${path}: missing fragment ${match[2]}`);
 }
 const schema=JSON.parse(html.match(/type="application\/ld\+json">(.*?)<\/script>/)[1]); assert(schema.length>=2);
}
assert(!fs.readFileSync('resources/index.html','utf8').includes('data-tab="quiz"'));
assert(fs.readFileSync('certification-pathways/index.html','utf8').includes('id="finder-results"'));
assert.equal((fs.readFileSync('sitemap.xml','utf8').match(/<loc>/g)||[]).length,7);
console.log('Passed: 18 pathway cases; 7 pages checked for titles, descriptions, H1s, canonical links, structured data and local links.');
