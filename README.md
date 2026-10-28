# iParkar HSE Academy — iparkar.com

Static website for Cloudflare Pages. The main pages contain their text, navigation and metadata in HTML; JavaScript enhances the pathway finder and practice exam.

## Pages

- `/` — Home overview (default landing page)
- `/about/` — About iParkar and its founder
- `/certification-pathways/` — guided pathway finder, certification / certificate comparison, credential details
- `/certificate-courses/` — IOSH and NEBOSH qualifications
- `/resources/` — learning resources hub
- `/resources/live-quiz/` — Live Quiz, nested under Resources
- `/practice-exams/` — free sample and premium exam links

Former `/#about`, `/#certifications`, `/#courses`, `/#quiz` and `/#practice` bookmarks are mapped to the corresponding pages by `legacy-routes.js`.

## Editing and validation

1. Edit copy and credential details in `site-config.js`.
2. Edit page structure in `build.mjs`, styles in `styles.css`, or finder logic in `pathway-finder.js`.
3. Run `node build.mjs` to regenerate the HTML and sitemap.
4. Run `node check.mjs`, `node --check app.js` and `node --check pathway-finder.js`.
5. Commit the source and generated pages together.

No packages, installation or build command are required on Cloudflare. Node is needed only to regenerate pages and run local checks. Generated HTML is tracked, so existing deployments keep working with output directory `/` and framework preset None.

## Design reference

The signed-in iParkar design artifact supplied by the owner was inspected on 28 October 2026. The implementation follows its paper canvas, white cards, midnight / marigold / coral / sky flat fills, Inter UI, Source Serif 4 leads, 12px cards, 8px buttons, supplied logo SVGs and no photography or ad-hoc icon set. Blue fills are reserved for Sign in; secondary buttons use a light sky fill with midnight text to improve small-text contrast. Cards do not gain shadows on hover.

## Finder behaviour and sources

Answers stay in memory in the page, are not persisted, and are not sent to a server. Reset clears the recommendations. Experience is collected independently for safety, industrial hygiene, fire-loss prevention and environmental practice. Results are preliminary guidance, never approval or a guarantee of eligibility.

Rules reviewed 28 October 2026:

- ASP: https://www.bcsp.org/associate-safety-professional-asp
- CSP: https://www.bcsp.org/certified-safety-professional-csp
- CIH: https://gobgc.org/cih/
- CIH checklist: https://gobgc.org/wp-content/uploads/2023/08/CIH-Eligibility-Checklist-6-2023.pdf
- QEP: https://gobgc.org/qep/
- EPI: https://gobgc.org/applicants_epi_eligibility/
- CFPS: https://www.nfpa.org/en/for-professionals/certification/cfps
- NEBOSH IGC: https://www.nebosh.org.uk/qualifications/international-general-certificate/
- IOSH Diploma: https://iosh.com/qualifications-and-courses/qualifications/iosh-diploma

CFPS always asks for handbook review because the tool does not establish the precise NFPA education/experience route. CIH highlights the coursework, ethics, active practice and reference checks even with four years of IH experience. QEP does not automatically apply specialist degree experience reductions. A diploma is not automatically treated as a BCSP-qualifying associate degree. EPI is explicitly an interim designation and is not recommended as a potential fit at five or more years of environmental experience.

Existing detailed credential and course content retains its original review dates; recheck fees, syllabus versions, recognition and eligibility with each awarding body before application. iParkar is an independent guidance and practice site.

## SEO and Cloudflare checks

The main pages have unique titles and descriptions, one H1, canonical URLs, Open Graph metadata, WebPage / WebSite structured data and breadcrumbs on inner pages. `sitemap.xml` lists seven principal pages and `robots.txt` points to it. A real `404.html` prevents Cloudflare Pages from falling back to an SPA page for missing URLs.

Before production rollout:

- Check Cloudflare's branch preview on desktop and mobile, including finder submission/reset, course anchors, all credential disclosures, legacy hash links, and the ten-question exam.
- Confirm Cloudflare serves missing pages as HTTP 404 and public pages as HTTP 200; do not add a catch-all 200 rewrite.
- Choose `https://iparkar.com` as the canonical host and configure the www/HTTP redirects in Cloudflare if needed.
- Verify that Cloudflare bot rules allow Googlebot to fetch the public site. This change does not alter Access policies on quiz.iparkar.com or app.iparkar.com.
- Submit `https://iparkar.com/sitemap.xml` in the existing Search Console property, use URL Inspection on the Home and pathway pages, and review Page Indexing.
- Measure real performance with PageSpeed Insights and the Search Console Core Web Vitals report. Target LCP <= 2.5s, INP <= 200ms and CLS <= 0.1. These measurements have not been collected in this checkout.

Google Search Essentials: https://developers.google.com/search/docs/essentials
Core Web Vitals: https://developers.google.com/search/docs/appearance/core-web-vitals

Indexing and rankings are not guaranteed. No Search Console property reports or Cloudflare dashboard settings were available for this implementation.

## Existing services

`quiz.iparkar.com` and `app.iparkar.com` remain separate services. Premium questions, account handling and payments are not changed by this redesign. Legal pages retain their existing content and need owner review before relying on them for commercial activity.

## Preview build verification

The owner confirmed that this project uses Cloudflare Workers Builds, with preview-branch builds enabled and `npx wrangler preview` configured. Check the build for `redesign/home-pathways-seo` before merging. The Pages deployment notes above are not confirmation that the current Worker configuration can deploy this repository; inspect the preview build log and resolve any Wrangler configuration errors first.
