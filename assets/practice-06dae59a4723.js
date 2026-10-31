/* =====================================================================
   iParkar Learning — page behaviour
   Reads everything from site-config.js and questions-free.js.
   You normally don't need to edit this file.
   ===================================================================== */
(function () {
  "use strict";
  const S = window.SITE;
  const Q = window.FREE_QUESTIONS || [];

  /* ---------- tiny helpers ---------- */
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $ = (sel, root = document) => root.querySelector(sel);
  const isExternal = (href) => /^https?:\/\//.test(href);
  const linkAttrs = (href) => isExternal(href) ? ' target="_blank" rel="noopener"' : "";
  const btn = (b, fallbackStyle = "ghost") => {
    const style = b.style || fallbackStyle;
    if (b.disabled) return `<button class="ip-btn ip-btn--${style}" disabled>${esc(b.label)}</button>`;
    if (b.action) return `<button class="ip-btn ip-btn--${style}" data-action="${esc(b.action)}">${esc(b.label)}</button>`;
    return `<a class="ip-btn ip-btn--${style}" href="${esc(b.href)}"${b.sameTab ? "" : linkAttrs(b.href)}>${esc(b.label)}</a>`;
  };
  const header = (title, lead) => `
    <header class="ip-section-header">
      <h2 class="ip-section-header__title">${esc(title)}</h2>
      ${lead ? `<p class="ip-section-header__lead">${esc(lead)}</p>` : ""}
    </header>`;
  const cardClass = (c) => (c && c !== "white" ? `ip-card ip-card--${c}` : "ip-card");
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
  };

  // Build the public HTML ahead of time; the browser enhances only interactive tools.
  if (window.IPARKAR_BUILD) {
    window.IPARKAR_RENDER = { about: renderAbout, courses: renderCourses,
      quiz: renderQuiz, practice: renderPractice, cert: renderCert };
    return;
  }

  /* ---------- Tab 1: About ---------- */
  function renderAbout() {
    const a = S.about.company;
    return `<article class="company-about"><header class="ip-section-header"><h1 class="ip-section-header__title">${esc(a.title)}</h1><p class="ip-section-header__lead">${esc(a.lead)}</p></header>${a.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}${a.sections.map(section=>`<section><h2>${esc(section.heading)}</h2>${section.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</section>`).join('')}<div class="ip-btn-row"><a class="ip-btn ip-btn--ghost" href="/certification-pathways/">Explore learning pathways</a><a class="ip-btn ip-btn--text" href="/contact/">Contact iParkar Learning</a></div></article>`;
  }

  /* ---------- Tab 2: Certifications ---------- */
  function renderCerts() {
    const c = S.certifications;
    return `
      ${header(c.title, c.lead)}
      <div class="seg" role="tablist" aria-label="Certification">
        ${c.items.map((it, i) => `<button role="tab" data-cert="${it.id}" aria-selected="${i === 0}">${esc(it.short)}</button>`).join("")}
      </div>
      <div id="cert-body"></div>
      <p class="fineprint page-note">${esc(c.disclaimer)}</p>`;
  }
  function renderCert(id, options = {}) {
    const it = S.certifications.items.find((x) => x.id === id) || S.certifications.items[0];
    const list = (arr) => `<ol class="step-list">${arr.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>`;
    $("#cert-body").innerHTML = `
      <div class="cert-head">
        <div>
          <p class="eyebrow">${esc(it.body)} · checked ${esc(it.lastChecked)}</p>
          ${options.detail ? "" : `<h3>${esc(it.name)} (${esc(it.short)})</h3><p>${esc(it.summary)}</p>`}
          ${it.note ? `<p class="cert-note"><span class="ip-pill ip-pill--progress">Note</span> ${esc(it.note)}</p>` : ""}
        </div>
        <a class="ip-btn ip-btn--outlined" href="${esc(it.officialUrl)}" target="_blank" rel="noopener">Official page</a>
      </div>
      <div class="cert-cols">
        <article class="ip-card"><h4 class="ip-card__title">Requirements</h4>${list(it.requirements)}</article>
        <article class="ip-card"><h4 class="ip-card__title">Application process</h4>${list(it.application)}</article>
        <article class="ip-card ip-card--tint"><h4 class="ip-card__title">Exam preparation</h4>${list(it.prep)}
          <a class="ip-btn ip-btn--dark" href="#practice">Try free practice questions</a></article>
      </div>
      <div class="link-list">${it.links.map((l) => `<a class="ip-btn ip-btn--ghost" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join("")}</div>`;
    document.querySelectorAll("[data-cert]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.cert === it.id)));
  }

  /* ---------- Tab: Certificate courses ---------- */
  function renderCourses(provider) {
    const c = provider ? {...S.courses, title:provider+" courses", lead:provider+" qualifications for safety and environmental practice.", note:provider === "NEBOSH" ? "Enrol through an approved NEBOSH accredited Learning Partner. iParkar provides independent guidance and practice materials." : "Enrol through an approved IOSH Study Centre. iParkar provides independent guidance and practice materials.", items:S.courses.items.filter(it=>it.provider===provider)} : S.courses;
    return `
      ${header(c.title, c.lead)}
      <div class="notice ip-card ip-card--tint" role="note"><span class="ip-pill ip-pill--progress">Note</span><span>${esc(c.note)}</span></div>
      <section class="grid grid--2 course-grid">
        ${c.items.map((it) => `
          <article class="ip-card course">
            <div class="course__head ${cardClass(it.color)}">
              <div style="display:flex;justify-content:space-between;gap:8px;align-items:center">
                <span class="ip-pill ${it.color === "dark" ? "" : "ip-pill--white"}">${esc(it.provider)}</span>
                <span class="course__level">${esc(it.level)}</span>
              </div>
              <h3 class="course__title">${esc(it.name)}</h3>
            </div>
            <p class="ip-card__body">${esc(it.summary)}</p>
            <dl class="facts">${it.facts.map((f) => `<dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd>`).join("")}</dl>
            <div class="course__foot">
              <span class="fineprint" style="margin:0">Checked ${esc(it.lastChecked)}</span>
              <a class="ip-btn ip-btn--outlined" href="${esc(it.officialUrl)}" target="_blank" rel="noopener">Official page</a>
            </div>
          </article>`).join("")}
      </section>
      <p class="fineprint page-note">${esc(c.disclaimer)}</p>`;
  }

  /* ---------- Tab 3: Live quiz ---------- */
  function renderQuiz() {
    const q = S.quiz;
    const tones = ["coral", "marigold", "sky"];
    const topicTones = ["marigold", "sky", "coral", "forest", "peach", "tint"];
    return `<section class="quiz-banner"><div class="quiz-banner__text"><p class="quiz-banner__eyebrow">Live HSE quizzes for teams and classrooms</p><h1 class="quiz-banner__title">Live <span class="ip-highlight ip-highlight--marigold">Quiz.</span></h1><p class="quiz-banner__lead">${esc(q.lead)}</p></div><ul class="quiz-banner__stats"><li><strong>500</strong><span>HSE questions</span></li><li><strong>40s</strong><span>per question</span></li><li><strong>QR</strong><span>join from any phone</span></li></ul></section>
      <div class="grid grid--2 quiz-choices"><section class="ip-card ip-card--marigold quiz-choice"><span class="quiz-choice__icon" aria-hidden="true">01</span><span class="ip-pill ip-pill--white">Ready to present</span><h2 class="ip-card__title">Live HSE Quiz</h2><p>Present a live quiz from our 500-question HSE bank. Choose your topics and difficulty, share the QR code and watch the leaderboard.</p><ul class="quiz-choice__list"><li>Topic and difficulty picker</li><li>Live leaderboard and podium</li><li>Download results as CSV</li></ul><a class="ip-btn ip-btn--dark ip-btn--lg" href="${esc(q.url)}">Open Live HSE Quiz</a></section><section class="ip-card ip-card--sky quiz-choice"><span class="quiz-choice__icon" aria-hidden="true">02</span><span class="ip-pill ip-pill--white">Your questions, live</span><h2 class="ip-card__title">Custom Quiz</h2><p>Create a free account to write your own questions, choose the correct answers and save quizzes to your profile. Present live with a QR code, timer and leaderboard.</p><ul class="quiz-choice__list"><li>Free creator account</li><li>Save, edit and reuse quizzes</li><li>Resume sessions and download results</li></ul><a class="ip-btn ip-btn--dark ip-btn--lg" href="${esc(q.url)}custom.html?mode=signup">Create Quiz</a></section></div>
      <section class="quiz-steps" aria-labelledby="quiz-steps-heading"><h2 id="quiz-steps-heading" class="quiz-steps__title">How a live round works</h2><ol>${q.howItWorks.map((s, i) => `<li class="quiz-step quiz-step--${tones[i % 3]}"><span class="quiz-step__num">${i + 1}</span><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p></li>`).join("")}</ol></section>
      <section class="quiz-topics" aria-labelledby="quiz-topics-heading"><h2 id="quiz-topics-heading">Popular topics</h2><ul>${q.topics.map((t, i) => `<li class="topic topic--${topicTones[i % topicTones.length]}">${esc(t)}</li>`).join("")}</ul></section>
      <p class="fineprint page-note">Participants join using the presenter’s QR code or room code. No creator account is needed to play.</p>`;
  }

  /* ---------- Tab 4: Practice exam ---------- */
  function renderPractice() {
    const p = S.practice;
    const exams = p.plans.filter(pl => pl.period);
    const codes = ["ASP", "CSP", "CIH"];
    const examNames = ["Associate Safety Professional", "Certified Safety Professional", "Certified Industrial Hygienist"];
    const perDay = plan => (plan.price / plan.days).toFixed(2);
    const links = [];
    p.durations.forEach((plan, i) => codes.forEach((code, j) => links.push({ code, i, label: `${plan.available ? "Get" : "Request"} ${code} · ${plan.days} days`, href: plan.available ? exams[j].button.href : `mailto:support@iparkar.com?subject=${encodeURIComponent(code + " - " + plan.name + " - " + plan.days + " days")}&body=${encodeURIComponent("Hello iParkar, I would like " + code + " " + plan.name + " access for " + plan.days + " days at US$" + plan.price + ". Please share the purchase details.")}` })));
    return `
      <div class="practice-heading"><div class="practice-heading__text"><p class="eyebrow">ASP / CSP / CIH PRACTICE EXAMS</p>${header(p.title, p.lead)}
      <div class="practice-assurances"><span>90 to 365 days of access</span><span>One certification per package</span><span>No automatic renewal</span></div></div>
      <aside class="practice-signin" aria-label="Returning students"><span>${esc(p.member.text)}</span><a class="ip-btn ip-btn--outlined" href="${esc(p.member.href)}">${esc(p.member.label)}</a></aside></div>
      <div id="exam-area"></div>
      <div id="plans">
        <section class="practice-pricing" id="pricing" aria-labelledby="pricing-heading">
          <h2 id="pricing-heading" class="plan-sr">Choose your package</h2>
          <p class="plan-sr" aria-live="polite" id="pricing-selection">Selected: ASP, Extended Prep, 180 days, US$149</p>
          <div class="plan-config" data-plan-config style="--fill:50%">
            <div class="plan-config__steps">
              <div class="plan-step plan-anim" style="--d:0ms">
                <p class="plan-step__label" id="plan-step-exam">1 · Choose your certification</p>
                <div class="plan-exams" role="group" aria-labelledby="plan-step-exam">${codes.map((code,i)=>`<button type="button" class="plan-exam" data-pricing-exam="${code}" aria-pressed="${i===0}"><span class="plan-exam__code">${code}</span><span class="plan-exam__name">${esc(examNames[i])}</span></button>`).join("")}</div>
              </div>
              <div class="plan-step plan-anim" style="--d:80ms">
                <p class="plan-step__label" id="plan-step-time">2 · Choose how long you need</p>
                <div class="plan-timeline">
                  <span class="plan-timeline__track" aria-hidden="true"><span class="plan-timeline__fill"></span></span>
                  <div class="plan-durations" role="group" aria-labelledby="plan-step-time">${p.durations.map((plan,i)=>`<button type="button" class="plan-duration${i===2?' plan-duration--annual':''}" data-pricing-plan="${i}" aria-pressed="${i===1}"><span class="plan-duration__pip" aria-hidden="true"></span><span class="plan-duration__label">${plan.days} days</span><span class="plan-duration__name">${esc(plan.name)}</span>${i?`<span class="plan-duration__badge">${esc(plan.badge)}</span>`:''}<span class="plan-duration__price"><small>US$</small>${plan.price}</span><span class="plan-duration__per">US$${perDay(plan)} a day</span></button>`).join("")}</div>
                </div>
              </div>
            </div>
            <div class="plan-summary plan-anim" style="--d:160ms">
              <div class="plan-summary__top"><p class="plan-summary__title" data-plan-title>ASP · ${esc(p.durations[1].name)}</p><span class="plan-summary__badge" data-plan-badge>${esc(p.durations[1].badge)}</span></div>
              <p class="plan-summary__price"><span class="plan-summary__currency">US$</span><span data-plan-price>${p.durations[1].price}</span></p>
              <p class="plan-summary__meta" data-plan-meta>${p.durations[1].days} days of access · US$${perDay(p.durations[1])} a day · One-time payment</p>
              <ul class="plan-summary__list"><li>Full <span data-plan-exam-name>ASP</span> question bank</li><li>Timed mock exams and practice</li><li>Answer explanations</li><li>Score history and analytics</li></ul>
              <div class="plan-summary__actions">${links.map(l=>`<a class="ip-btn ip-btn--primary" data-plan-exam="${l.code}" data-plan-index="${l.i}" href="${esc(l.href)}"${l.code==='ASP'&&l.i===1?'':' hidden'}>${esc(l.label)}</a>`).join("")}</div>
              <p class="plan-summary__note" data-plan-note>${p.durations[1].available?'Continue to your course to get access.':'Request access by email while checkout is being prepared.'}</p>
            </div>
          </div>
          <noscript><p class="fineprint">JavaScript is off. Choose a package directly:</p><ul class="plan-noscript">${links.map(l=>`<li><a href="${esc(l.href)}">${esc(l.label)} · US$${p.durations[l.i].price}</a></li>`).join("")}</ul></noscript>
          <div class="plan-buybar" data-plan-buybar role="region" aria-label="Selected package">
            <p class="plan-buybar__text"><span data-plan-bar-title>ASP · ${esc(p.durations[1].name)}</span><strong>US$<span data-plan-bar-price>${p.durations[1].price}</span> <span data-plan-bar-days>· ${p.durations[1].days} days</span></strong></p>
            <a class="ip-btn ip-btn--primary" data-plan-bar-cta href="${esc(links.find(l=>l.code==='ASP'&&l.i===1).href)}">${p.durations[1].available?'Get access':'Request'}</a>
          </div>
          <p class="fineprint pricing-terms">Prices are in USD and cover one certification package. Applicable taxes are calculated at checkout. All durations include the same features for your selected exam. Access begins when payment is confirmed.</p>
        </section>
        <section class="practice-sample" aria-labelledby="sample-heading"><div><span class="eyebrow">START WITH A SAMPLE</span><h2 id="sample-heading">Ten questions. A clearer starting point.</h2><p>Try 10 random questions with answer explanations. Free, with no account needed.</p></div><button class="ip-btn ip-btn--ghost" data-action="start-free">Start free sample</button></section>
        <section class="practice-features" aria-labelledby="included-heading"><div><p class="eyebrow">INCLUDED IN YOUR PACKAGE</p><h2 id="included-heading">Practice with purpose.</h2><p>The same practice tools, with the time you need to use them.</p></div>
        <div class="practice-features__content">${exams.map((pl,i)=>`<article data-feature-exam="${codes[i]}"><h3>${codes[i]} practice features</h3><ul>${pl.features.map(f=>`<li>${esc(f)}</li>`).join('')}</ul></article>`).join('')}</div></section>
        <section class="pricing-faq" aria-labelledby="pricing-faq-heading"><h2 id="pricing-faq-heading">Before you choose</h2><details><summary>Does one purchase include all three certifications?</summary><p>Each purchase covers one selected certification: ASP, CSP or CIH. The same three access durations are offered for each exam.</p></details><details><summary>Will I be charged again automatically?</summary><p>No. These are one-time purchases with 90, 180 or 365 days of access. There is no automatic renewal.</p></details><details><summary>How do I get a 180-day or 365-day package?</summary><p>Choose your certification and select Request access. Your email app will open a request to support@iparkar.com with the exam, duration and price included. We will help you arrange access; sending a request does not make a payment.</p></details><details><summary>Where can I find the refund policy?</summary><p>Read our <a href="/refunds.html">refund policy</a> before purchasing. For purchase questions, <a href="/contact/">contact iParkar Learning</a>.</p></details></section>
      </div>
      <p class="fineprint">${esc(p.note)}</p>`;
  }

  // Option C configurator (desktop) + swipe cards and buy bar (mobile). Links stay static; JS only switches them.
  const planState = { exam: "ASP", plan: 1 };
  const reduceMotion = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function replay(el, cls) { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
  function countPrice(el, to) {
    if (!el) return;
    const from = Number(el.textContent) || to;
    if (el._raf) cancelAnimationFrame(el._raf);
    if (reduceMotion() || from === to) { el.textContent = to; return; }
    let t0 = null;
    const step = (t) => { t0 ??= t; const k = Math.min(1, (t - t0) / 360); el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))); if (k < 1) el._raf = requestAnimationFrame(step); };
    el._raf = requestAnimationFrame(step);
  }
  function updatePricing(change = {}) {
    const config = $("[data-plan-config]");
    if (!config) return;
    Object.assign(planState, change);
    const { exam: code, plan: i } = planState;
    const plan = S.practice.durations[i];
    const perDay = (plan.price / plan.days).toFixed(2);
    document.querySelectorAll("[data-pricing-exam]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.pricingExam === code)));
    document.querySelectorAll("[data-pricing-plan]").forEach(b => b.setAttribute("aria-pressed", String(Number(b.dataset.pricingPlan) === i)));
    document.querySelectorAll("[data-feature-exam]").forEach(panel => { panel.hidden = panel.dataset.featureExam !== code; });
    let active;
    document.querySelectorAll("[data-plan-exam]").forEach(link => { const on = link.dataset.planExam === code && Number(link.dataset.planIndex) === i; link.hidden = !on; if (on) active = link; });
    config.style.setProperty("--fill", `${i * 50}%`);
    const set = (sel, text) => { const el = $(sel); if (el) el.textContent = text; };
    set("[data-plan-title]", `${code} · ${plan.name}`);
    set("[data-plan-meta]", `${plan.days} days of access · US$${perDay} a day · One-time payment`);
    set("[data-plan-exam-name]", code);
    set("[data-plan-note]", plan.available ? "Continue to your course to get access." : "Request access by email while checkout is being prepared.");
    set("[data-plan-bar-title]", `${code} · ${plan.name}`);
    set("[data-plan-bar-price]", plan.price);
    set("[data-plan-bar-days]", `· ${plan.days} days`);
    set("#pricing-selection", `Selected: ${code}, ${plan.name}, ${plan.days} days, US$${plan.price}`);
    const badge = $("[data-plan-badge]");
    if (badge) { badge.textContent = i ? plan.badge : ""; badge.hidden = !i; badge.classList.toggle("plan-summary__badge--value", i === 2); }
    const barCta = $("[data-plan-bar-cta]");
    if (barCta && active) { barCta.href = active.href; barCta.textContent = plan.available ? "Get access" : "Request"; }
    countPrice($("[data-plan-price]"), plan.price);
    if (change.exam || change.plan !== undefined) { replay(active, "plan-swap"); replay($(".plan-buybar__text"), "plan-swap"); replay($("[data-plan-title]"), "plan-swap"); }
    if (change.plan !== undefined && window.matchMedia("(max-width: 760px)").matches) {
      const card = $(`[data-pricing-plan="${i}"]`), rail = $(".plan-durations");
      if (card && rail) rail.scrollTo({ left: card.offsetLeft - (rail.clientWidth - card.offsetWidth) / 2, behavior: reduceMotion() ? "auto" : "smooth" });
    }
  }
  function initPricing() {
    const config = $("[data-plan-config]");
    if (!config) return;
    updatePricing();
    const rail = $(".plan-durations"), card = $(`[data-pricing-plan="${planState.plan}"]`);
    if (rail && card && window.matchMedia("(max-width: 760px)").matches) rail.scrollLeft = card.offsetLeft - (rail.clientWidth - card.offsetWidth) / 2;
    if (!("IntersectionObserver" in window)) return;
    if (!reduceMotion()) {
      config.classList.add("plan-config--animate");
      new IntersectionObserver((entries, obs) => entries.forEach(e => { if (e.isIntersecting) { config.classList.add("is-in"); obs.disconnect(); } }), { threshold: 0.15 }).observe(config);
    }
    const bar = $("[data-plan-buybar]"), cta = $(".plan-summary__actions");
    if (!bar || !cta) return;
    let inConfig = false, ctaSeen = false;
    const sync = () => bar.classList.toggle("is-visible", inConfig && !ctaSeen);
    new IntersectionObserver(([e]) => { inConfig = e.isIntersecting; sync(); }).observe(config);
    new IntersectionObserver(([e]) => { ctaSeen = e.isIntersecting; sync(); }).observe(cta);
  }
  initPricing();

  /* Free sample engine — 10 random questions, instant feedback */
  const exam = { items: [], i: 0, answers: [] };
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function startFree() {
    exam.items = shuffle(Q).slice(0, Math.min(S.practice.freeCount, Q.length));
    exam.i = 0; exam.answers = [];
    $("#plans").hidden = true;
    drawQuestion();
    $("#exam-area").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function drawQuestion() {
    const n = exam.items.length, it = exam.items[exam.i];
    $("#exam-area").innerHTML = `
      <section class="ip-card exam" aria-live="polite">
        <div class="exam__top">
          <span class="ip-pill ip-pill--todo">${esc(it.topic)}</span>
          <span style="font-size:14px;color:var(--slate)">Question ${exam.i + 1} of ${n}</span>
        </div>
        <div class="progress"><div class="progress__bar" style="width:${(exam.i / n) * 100}%"></div></div>
        <h3 class="exam__q">${esc(it.q)}</h3>
        <div class="options">${it.options.map((o, k) => `<button class="option" data-opt="${k}"><span class="option__key">${"ABCDEFG"[k]}</span><span>${esc(o)}</span></button>`).join("")}</div>
        <div id="fb"></div>
      </section>`;
  }
  function choose(k) {
    const it = exam.items[exam.i], ok = k === it.answer;
    exam.answers[exam.i] = k;
    document.querySelectorAll(".option").forEach((b) => {
      const idx = Number(b.dataset.opt);
      b.disabled = true;
      if (idx === it.answer) b.classList.add("is-correct");
      else if (idx === k) b.classList.add("is-wrong");
    });
    const last = exam.i === exam.items.length - 1;
    $("#fb").innerHTML = `
      <div class="feedback">
        <span class="ip-pill ${ok ? "ip-pill--done" : "ip-pill--alert"}">${ok ? "Correct" : "Not quite"}</span>
        <p>${esc(it.explain)}</p>
      </div>
      <div class="exam__nav"><button class="ip-btn ip-btn--primary" data-action="next">${last ? "See my score" : "Next question"}</button></div>`;
    $("[data-action='next']").focus();
  }
  function finish() {
    const n = exam.items.length;
    const score = exam.items.reduce((s, it, i) => s + (exam.answers[i] === it.answer ? 1 : 0), 0);
    const best = store.get("ip-free-best");
    if (best == null || score > best) store.set("ip-free-best", score);
    $("#exam-area").innerHTML = `
      <section class="ip-card exam">
        <div class="score">
          <p class="eyebrow">Your score</p>
          <div class="score__num">${score}/${n}</div>
          <p>${score / n >= 0.7 ? "Strong result — keep the momentum with full timed mocks." : "Good start. Review the explanations and try another set."}</p>
          <div class="ip-btn-row" style="justify-content:center;margin-top:16px">
            <button class="ip-btn ip-btn--primary" data-action="start-free">Try another 10</button>
            <button class="ip-btn ip-btn--ghost" data-action="show-plans">See premium plans</button>
          </div>
        </div>
        <div class="review">${exam.items.map((it, i) => `
          <div class="review__item">
            <span class="ip-pill ip-pill--sm ${exam.answers[i] === it.answer ? "ip-pill--done" : "ip-pill--alert"}">${exam.answers[i] === it.answer ? "Correct" : "Missed"}</span>
            <span>${esc(it.q)}</span>
          </div>`).join("")}</div>
      </section>`;
  }

  /* ---------- clicks ---------- */
  document.addEventListener("click", (e) => {
    const pricingExam = e.target.closest("[data-pricing-exam]");
    if (pricingExam) return updatePricing({ exam: pricingExam.dataset.pricingExam });
    const pricingPlan = e.target.closest("[data-pricing-plan]");
    if (pricingPlan) return updatePricing({ plan: Number(pricingPlan.dataset.pricingPlan) });
    const cert = e.target.closest("[data-cert]");
    if (cert) return renderCert(cert.dataset.cert);
    const opt = e.target.closest("[data-opt]");
    if (opt && !opt.disabled) return choose(Number(opt.dataset.opt));
    const act = e.target.closest("[data-action]");
    if (!act) return;
    const a = act.dataset.action;
    if (a === "start-free") startFree();
    if (a === "next") { if (exam.i < exam.items.length - 1) { exam.i++; drawQuestion(); } else finish(); }
    if (a === "show-plans") { $("#exam-area").innerHTML = ""; $("#plans").hidden = false; $("#plans").scrollIntoView({ behavior: "smooth" }); $("[data-pricing-exam][aria-pressed='true']")?.focus({ preventScroll: true }); }
  });
})();
