# iParkar Learning — www.iparkar.com

Static landing site (4 tabs) styled with the iParkar design system.

## What to edit

| You want to change… | Edit this file |
|---|---|
| Any text, link, price, button, credential, certification step, tab name/order | `site-config.js` |
| Free sample questions (10 are drawn at random) | `questions-free.js` |
| Colours, fonts, spacing | the `:root` block at the top of `styles.css` |
| Logo / favicon | `assets/`, `favicon.svg`, `apple-touch-icon.png` |

You should rarely need `index.html` or `app.js`.

- Hide a tab: set `show: false` in `tabs`.
- Add a certification (e.g. CIH, CIT): copy one `{ id: "asp", ... }` block in `certifications.items`.
- Turn on a premium plan: replace `href: "#"` with your checkout link and delete `disabled: true`.
- Embed the live quiz in the page: set `quiz.embed: true` (only after the Cloudflare Access login is removed from quiz.iparkar.com).

## Deploy on Cloudflare Pages (free)

1. Create a GitHub repo (e.g. `iparkar-site`) and upload every file in this folder.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick the repo.
   Framework preset: **None**. Build command: *(empty)*. Output directory: `/`.
3. In the Pages project → Custom domains → add `iparkar.com` and `www.iparkar.com`.
4. Every `git push` (or edit in the GitHub web editor) redeploys in about a minute.

`quiz.iparkar.com` stays as it is. It is currently behind **Cloudflare Access**, so the public sees a login screen — in Zero Trust → Access → Applications, remove it or add a **Bypass / Everyone** policy if the quiz should be public.

## Before you take payments (checklist)

- [ ] Fill in the [BRACKETED] placeholders in `terms.html`, `privacy.html` and `refunds.html`, and have a lawyer review them.
- [ ] Replace `hello@iparkar.com` and the LinkedIn link in `site-config.js`.
- [ ] Merchant-of-record account approved (Paddle or Lemon Squeezy).
- [ ] Accounts + progress tracking live at `app.iparkar.com` (see roadmap).

## Premium roadmap (accounts, purchases, progress history)

Recommended stack — all have free tiers, so cost is near zero until you have sales:

| Piece | Service | Job |
|---|---|---|
| Landing site | Cloudflare Pages (this repo) | Marketing, free sample |
| Exam app | `app.iparkar.com` on Cloudflare Pages | Login, timed exams, dashboard |
| Accounts + database | Supabase (Auth + Postgres) | Sign-up, sign-in, question bank, attempts, scores |
| Payments | Paddle (merchant of record) | Checkout, global tax/VAT, invoices, refunds |
| Webhook | Supabase Edge Function or Cloudflare Worker | On `transaction.completed`, grant access (e.g. ASP, 90 days) |

Database tables: `profiles`, `products` (asp, csp, cfps), `entitlements` (user, product, expires_at),
`questions` (stem, options, answer, explanation, domain), `attempts`, `attempt_answers`.
Protect `questions` with Row Level Security so only users with a live entitlement can read them —
never ship premium questions in public JavaScript.

Lower-effort alternative: a hosted course platform with built-in quizzes and checkout
(less control, monthly fee, takes a cut), linked from the "Get access" buttons.
