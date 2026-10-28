# iParkar Learning — iparkar.com

Static website deployed with Cloudflare Workers Builds. Public pages contain their copy, navigation and metadata in HTML; JavaScript enhances only the free practice exam only.

## Pages and navigation

Home, Certification pathways, Certificate courses, Resources, Practice exam, About us.

- `/` — overview
- `/certification-pathways/` — comparison and credential guidance; no finder
- `/certificate-courses/` — IOSH, NEBOSH and BOHS M-series courses
- `/resources/` — live session entry and curated official resource links
- `/resources/live-quiz/` — quiz information within the website shell and same-tab launch
- `/practice-exams/` — free sample and premium links
- `/about/` — founder and learning approach

Legacy hash bookmarks continue to redirect to the corresponding static pages.

## Editing

Edit copy in `site-config.js`, page structure and curated BOHS/resources data in `build.mjs`, and styling in `styles.css`. Run `node build.mjs`, `node check.mjs` and `node --check app.js`; commit the generated HTML with the sources. No dependencies or Cloudflare build command are needed because generated files are tracked.

`wrangler.jsonc` declares static assets at the repository root, proper 404 responses and an empty previews block. `.assetsignore` excludes development files from public assets. Production uses `main`; review the `redesign/home-pathways-seo` preview before merging.

## Quiz behaviour and performance

The quiz is linked in the same tab from its page under Resources. An on-demand embedded player was tested and failed to load with the existing Cloudflare Access setup, so the broken player was removed. No quiz-service request is made until the visitor chooses to continue. Access policies, quiz infrastructure and authentication are unchanged. Keeping the full quiz in the site shell requires a compatible sign-in or hosting setup. ASP access also navigates in the same tab.

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
