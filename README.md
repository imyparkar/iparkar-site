# iParkar Learning — iparkar.com

Static website deployed with Cloudflare Workers Builds. Public pages contain their copy, navigation and metadata in HTML; JavaScript enhances only the free practice exam and on-demand live quiz.

## Pages and navigation

Home, Certification pathways, Certificate courses, Resources, Practice exam, About us.

- `/` — overview
- `/certification-pathways/` — comparison and credential guidance; no finder
- `/certificate-courses/` — IOSH, NEBOSH and BOHS M-series courses
- `/resources/` — live session entry and curated official resource links
- `/resources/live-quiz/` — click-to-load quiz player within the website shell
- `/practice-exams/` — free sample and premium links
- `/about/` — founder and learning approach

Legacy hash bookmarks continue to redirect to the corresponding static pages.

## Editing

Edit copy in `site-config.js`, page structure and curated BOHS/resources data in `build.mjs`, and styling in `styles.css`. Run `node build.mjs`, `node check.mjs`, `node --check app.js` and `node --check quiz-embed.js`; commit the generated HTML with the sources. No dependencies or Cloudflare build command are needed because generated files are tracked.

`wrangler.jsonc` declares static assets at the repository root, proper 404 responses and an empty previews block. `.assetsignore` excludes development files from public assets. Production uses `main`; review the `redesign/home-pathways-seo` preview before merging.

## Quiz behaviour and performance

No iframe or quiz-service request is created on initial load. Clicking Load live quiz creates one iframe with a reserved height. The current quiz endpoint redirects unauthenticated visitors to Cloudflare Access. Its sign-in screen may not work inside an iframe; a same-tab link remains available. Access policies, quiz infrastructure and authentication are unchanged. Test the authorised session in the player before relying on embedded sign-in. ASP access also navigates in the same tab.

## Sources reviewed 28 October 2026

- BOHS qualifications, M200 and M501–M507: https://www.bohs.org/education/qualifications/
- BCSP exam blueprints/reference links: https://www.bcsp.org/associate-safety-professional-asp and https://www.bcsp.org/certified-safety-professional-csp
- BGC CIH library, including equation sheets: https://gobgc.org/applicants_CIH_library/
- NFPA public fire safety handouts: https://www.nfpa.org/education-and-research/home-fire-safety/safety-tip-sheets
- IOSH guides: https://iosh.com/resources/guides
- BOHS technical guidance: https://www.bohs.org/information-guidance/technical-guidance/

Resource files remain with their publishers; links do not grant redistribution permission. Access conditions vary and some linked materials may require membership or payment. Course details retained from earlier site content keep their original review dates. Always confirm current awarding-body requirements.

## SEO follow-up

Seven public pages have unique titles/descriptions, canonical URLs, structured data and sitemap entries. `robots.txt` references the sitemap and missing URLs use `404.html`. Check public production HTTP responses, canonical-host redirects, Search Console URL Inspection/Page Indexing, and Core Web Vitals after rollout. Search Console reports and field performance have not been verified. Indexing and rankings are not guaranteed.
