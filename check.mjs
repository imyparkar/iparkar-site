import assert from 'node:assert/strict';
import fs from 'node:fs';
const newPages=['resources/study-courses/index.html','resources/study-courses/asp/index.html','resources/study-courses/csp/index.html','resources/study-courses/pmp/index.html','resources/sat/index.html','resources/learning-resources/index.html',...['asp','csp','cih','ges-epi','qep','cit','pmp'].map(c=>`practice-exams/${c}/index.html`)];
const pages=[...newPages,'contact/index.html','resources/reference-books/index.html','certificate-courses/nebosh/index.html','certificate-courses/iosh/index.html','certificate-courses/level-3/index.html','certificate-courses/level-6/index.html','certificate-courses/membership-pathways/index.html','certification-pathways/environmental/epi/index.html','certification-pathways/environmental/qep/index.html','certification-pathways/safety/asp/index.html','certification-pathways/safety/csp/index.html','certification-pathways/safety/cfps/index.html','certification-pathways/industrial-hygiene/cih/index.html','certificate-courses/bohs/index.html','certification-pathways/industrial-hygiene/certoh/index.html','certification-pathways/select/index.html','certification-pathways/safety/index.html','certification-pathways/industrial-hygiene/index.html','certification-pathways/environmental/index.html','certification-pathways/training/index.html','certification-pathways/training/cit/index.html','certification-pathways/project-management/index.html','certification-pathways/project-management/pmp/index.html','index.html','about/index.html','certification-pathways/index.html','certificate-courses/index.html','resources/index.html','live-quiz/index.html','practice-exams/index.html'];
const titles=new Set(), descriptions=new Set();
for (const path of pages) {
 const html=fs.readFileSync(path,'utf8');
 assert.equal((html.match(/<h1\b/g)||[]).length,1,`${path}: one H1`);
 const title=html.match(/<title>(.*?)<\/title>/)[1]; assert(!titles.has(title)); titles.add(title);
 const desc=html.match(/name="description" content="([^"]+)"/)[1]; assert(!descriptions.has(desc)); descriptions.add(desc);
 assert(html.includes('rel="canonical"')); assert(!html.includes('noindex'));
 const url='/'+path.replace(/index\.html$/,''); const inNav=html.includes(`href="${url}" aria-current="page"`);
 assert.equal((html.match(/aria-current="page"/g)||[]).length,(inNav?1:0)+(path==='index.html'?0:1),`${path}: aria-current`);
 // Navigation: only Resources and Practice Exam have dropdown toggles, in the requested order.
 const toggles=[...html.matchAll(/aria-label="([^"]+) menu" data-nav-toggle/g)].map(m=>m[1]); assert.deepEqual(toggles,['Resources','Practice Exam'],`${path}: toggles`);
 const menu=id=>{const m=html.match(new RegExp(`id="nav-menu-${id}">([\\s\\S]*?)</div></li>`)); return [...m[1].matchAll(/class="nav-menu__link[^"]*" href="([^"]+)"/g)].map(x=>x[1]);};
 assert.deepEqual(menu('resources'),['/resources/study-courses/','/resources/study-courses/asp/','/resources/study-courses/csp/','/resources/study-courses/pmp/','/resources/sat/','/resources/reference-books/','/resources/learning-resources/'],`${path}: resources menu`);
 assert.deepEqual(menu('practice'),['asp','csp','cih','ges-epi','qep','cit','pmp'].map(c=>`/practice-exams/${c}/`),`${path}: practice menu`);
 assert(html.includes('href="/resources/" ') || html.includes('href="/resources/">'), `${path}: Resources label links to overview`);
 assert(html.includes('src="/nav.js"'),`${path}: nav.js`);
 for(const match of html.matchAll(/(?:src|href)="(\/(?!\/)[^"?#]*)(?:[?#]([^" ]*))?"/g)) {
  const target=match[1].slice(1); let file=target.endsWith('/')?target+'index.html':target||'index.html'; if(!fs.existsSync(file)&&fs.existsSync(file+'.html')) file+='.html';
  assert(fs.existsSync(file),`${path}: missing ${file}`);
  if(match[2] && !match[0].includes('?')) assert(fs.readFileSync(file,'utf8').includes(`id="${match[2]}"`),`${path}: missing fragment ${match[2]}`);
 }
 const schema=JSON.parse(html.match(/type="application\/ld\+json">(.*?)<\/script>/)[1]); assert(schema.length>=2);
}
assert(!fs.readFileSync('resources/index.html','utf8').includes('data-tab="quiz"'));
assert(!fs.readFileSync('certification-pathways/index.html','utf8').includes('finder-results'));
assert(!fs.readFileSync('resources/index.html','utf8').includes('Start practising'));
assert(fs.readFileSync('certificate-courses/index.html','utf8').includes('/certificate-courses/bohs/'));
assert(!fs.readFileSync('certification-pathways/industrial-hygiene/index.html','utf8').includes('/certificate-courses/bohs/'));
assert(!fs.readFileSync('certificate-courses/bohs/index.html','utf8').includes('Build knowledge of workplace exposures'));
assert(fs.readFileSync('certificate-courses/bohs/index.html','utf8').includes('M507'));
{const h=fs.readFileSync('certificate-courses/index.html','utf8'); for(const r of ['/certificate-courses/level-3/','/certificate-courses/level-6/','/certificate-courses/membership-pathways/']) assert(h.includes(`href="${r}"`),'stage link '+r);}
{const h=fs.readFileSync('certificate-courses/iosh/index.html','utf8'); assert(h.indexOf('id="iosh-certificate"')<h.indexOf('id="iosh-diploma"'),'IOSH Level 3 card first');}
for(const p of ['terms','privacy','refunds']){const h=fs.readFileSync(p+'.html','utf8'); assert(h.includes(`rel="canonical" href="https://iparkar.com/${p}"`),p+': canonical'); assert(!/href="[^"]*\.html"/.test(h),p+': .html link');}
assert(!fs.readFileSync('live-quiz/index.html','utf8').includes('<iframe')); // click-to-load only
assert.equal((fs.readFileSync('sitemap.xml','utf8').match(/<loc>/g)||[]).length,46);
{const sm=fs.readFileSync('sitemap.xml','utf8'); for(const p of newPages) assert(sm.includes(`<loc>https://iparkar.com/${p.replace(/index\.html$/,'')}</loc>`),'sitemap '+p);}
// Resources overview links to all four courses and both resource pages; practice overview lists all seven packages.
{const h=fs.readFileSync('resources/index.html','utf8'); for(const r of ['/resources/study-courses/asp/','/resources/study-courses/csp/','/resources/study-courses/pmp/','/resources/sat/','/resources/reference-books/','/resources/learning-resources/']) assert(h.split('<main')[1].includes(`href="${r}"`),'resources overview → '+r);
 for(const id of ['study-courses','study-guides','free-courses']) assert(h.includes(`id="${id}"`),'old anchor #'+id);}
{const h=fs.readFileSync('practice-exams/index.html','utf8').split('<main')[1]; for(const c of ['asp','csp','cih','ges-epi','qep','cit','pmp']) assert(h.includes(`href="/practice-exams/${c}/"`),'practice overview → '+c); assert(h.includes('id="sample"'));}
// PMP practice exam: Coming soon, no buy or checkout action anywhere on its page or card.
{const h=fs.readFileSync('practice-exams/pmp/index.html','utf8').split('<main')[1].split('</main>')[0]; assert(h.includes('Coming soon')); assert(!/app\.iparkar\.com|>\s*Buy\b|Buy PMP|data-course-cta|razorpay/i.test(h),'PMP practice: no buy or checkout');
 const o=fs.readFileSync('practice-exams/index.html','utf8'); assert(!/app\.iparkar\.com\/courses\/PMP/i.test(o),'no PMP practice checkout on overview');}
// Study courses and practice exams keep separate destinations and product identifiers.
{const h=fs.readFileSync('resources/study-courses/pmp/index.html','utf8'); assert(h.includes('https://app.iparkar.com/learn/pmp-sps/buy')); assert(h.includes('data-local-price="PMP-SPS" data-usd="299"')); assert(h.includes('35-hour')); assert(h.includes('3 Days Free Trial')&&!h.includes('7 Days Free Trial'),'PMP: 3-day trial'); assert(fs.readFileSync('resources/study-courses/asp/index.html','utf8').includes('7 Days Free Trial'),'ASP keeps 7 days');
 for(const c of ['asp','csp']){const x=fs.readFileSync(`resources/study-courses/${c}/index.html`,'utf8'); assert(x.includes(`https://app.iparkar.com/learn/${c}-sps/buy`));}
 for(const c of ['ASP','CSP','CIH','QEP','CIT']){const x=fs.readFileSync(`practice-exams/${c.toLowerCase()}/index.html`,'utf8'); assert(x.includes(`https://app.iparkar.com/courses/${c}?plan=90`),c);}
 assert(fs.readFileSync('practice-exams/ges-epi/index.html','utf8').includes('https://app.iparkar.com/courses/EPI?plan=180'));}
for(const p of ['terms.html','privacy.html','refunds.html','404.html']){const h=fs.readFileSync(p,'utf8'); assert(h.includes('data-nav-toggle')&&h.includes('src="/nav.js"'),p+': shared header');}
console.log('Passed: '+pages.length+' pages checked for titles, descriptions, H1s, canonical links, structured data and local links; legal pages use clean canonical URLs.');
