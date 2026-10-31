# iParkar Learning — iparkar.com

Static website deployed with Cloudflare Workers Builds. Public pages contain their copy, navigation and metadata in HTML; JavaScript enhances only the free practice exam only.

## Pages and navigation

Home, Certification pathways, Certificate courses, Live Quiz, Resources, Practice exam, About us.

- `/` — overview
- `/certification-pathways/` — two decision cards (professional certification vs taught course) above the fold, with the detailed comparison table below
- `/certification-pathways/select/` — Safety, Industrial Hygiene and Environmental cards
- `/certification-pathways/safety/` — ASP, CSP and CFPS summary cards, each opening a detailed requirements page
- `/certification-pathways/industrial-hygiene/` — CIH and Occupational hygiene with BOHS cards, each opening a detail page
- `/certification-pathways/environmental/` — QEP and EPI requirements
- `/certificate-courses/` — IOSH and NEBOSH courses; BOHS M-series now sits under Industrial Hygiene
- `/resources/` — Reference books feature card plus official BCSP, BGC and BOHS resource links
- `/resources/reference-books/` — most-used references for ASP, CSP, CIH, QEP and CFPS with publisher purchase links; the certification chips filter the list with CSS `:target`
- `/live-quiz/` — quiz information within the website shell and same-tab launch
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
- BOHS technical guidance: https://www.bohs.org/information-guidance/technical-guidance/

Resource files remain with their publishers; links do not grant redistribution permission. Access conditions vary and some linked materials may require membership or payment. Course details retained from earlier site content keep their original review dates. Always confirm current awarding-body requirements.

## SEO follow-up

Twenty public pages have unique titles/descriptions, canonical URLs, structured data and sitemap entries. `robots.txt` references the sitemap and missing URLs use `404.html`. Check public production HTTP responses, canonical-host redirects, Search Console URL Inspection/Page Indexing, and Core Web Vitals after rollout. Search Console reports and field performance have not been verified. Indexing and rankings are not guaranteed.

Buttons and navigation follow the original flat-fill design system; the Liquid Glass experiment has been removed. Course colour bands use natural text height and CSS subgrid to align neighbouring headers without a fixed oversized band. NEBOSH and IOSH each have a provider selection card and dedicated course list. Environmental categories use Forest Green #2E6F40, with QEP in Forest and EPI in Moss Green #8A9A5B; these tokens extend the supplied palette using the owner’s Figma reference. Pills fit their labels. The IGC header includes SCQF Level 6 (comparable to RQF Level 3). Old quiz URLs redirect to /live-quiz/; old credential anchors route to the appropriate category.

A fresh unauthenticated request to https://quiz.iparkar.com/ was verified to return HTTP 302 to the existing Cloudflare Access login. An already authorised browser session may open the quiz directly. The website does not change Access policies, cookies, or session duration and does not force users to log out.

## Sign-in placement

The header no longer carries a site-wide Sign in button. Returning students sign in from the "Already enrolled?" panel beside the practice exam heading, or from the "Student sign in" link in every page footer.

## Reference book sources reviewed 31 October 2026

BCSP ASP/CSP blueprint reference lists, BGC CIH Selected References (2025), the BGC QEP candidate handbook reading list, and the NFPA CFPS programme (Fire Protection Handbook, 21st edition). Purchase links go to the publisher (CRC Press, ASSP, NSC, AIHA, ACGIH, Wiley, Pearson, Elsevier, McGraw Hill, Waveland, NFPA).
