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
    return `${header(q.title, q.lead)}<div class="grid grid--2 quiz-choices"><section class="ip-card ip-card--marigold quiz-choice"><span class="ip-pill ip-pill--white">Ready to present</span><h2 class="ip-card__title">Live HSE Quiz</h2><p>Present a live quiz from our 500-question HSE bank. Choose your topics and difficulty, share the QR code and watch the leaderboard.</p><a class="ip-btn ip-btn--ghost ip-btn--lg" href="${esc(q.url)}">Open Live HSE Quiz</a></section><section class="ip-card ip-card--sky quiz-choice"><span class="ip-pill ip-pill--white">Your questions, live</span><h2 class="ip-card__title">Custom Quiz</h2><p>Create a free account to write your own questions, choose the correct answers and save quizzes to your profile. Present live with a QR code, timer and leaderboard.</p><a class="ip-btn ip-btn--ghost ip-btn--lg" href="${esc(q.url)}custom.html?mode=signup">Create Quiz</a></section></div><p class="fineprint page-note">Participants join using the presenter’s QR code or room code. No creator account is needed to play.</p>`;
  }

  /* ---------- Tab 4: Practice exam ---------- */
  function renderPractice() {
    const p = S.practice;
    const exams = p.plans.filter(pl => pl.period);
    const codes = ["ASP", "CSP", "CIH"];
    return `
      <div class="practice-heading"><p class="eyebrow">ASP / CSP / CIH PRACTICE EXAMS</p>${header(p.title, p.lead)}
      <div class="practice-assurances"><span>90 to 365 days of access</span><span>One certification per package</span><span>No automatic renewal</span></div></div>
      <div id="exam-area"></div>
      <div id="plans">
        <section class="practice-sample" aria-labelledby="sample-heading"><div><span class="eyebrow">START WITH A SAMPLE</span><h2 id="sample-heading">Ten questions. A clearer starting point.</h2><p>Try 10 random questions with answer explanations. Free, with no account needed.</p></div><button class="ip-btn ip-btn--ghost" data-action="start-free">Start free sample</button></section>
        <section class="practice-pricing" aria-labelledby="pricing-heading">
          <header class="practice-pricing__heading"><p class="eyebrow">CHOOSE YOUR PACKAGE</p><h2 id="pricing-heading">Make room for your preparation.</h2><p>Choose an exam, then the access period that works for you.</p></header>
          <div class="exam-picker" role="group" aria-label="Choose your certification">${codes.map((code,i)=>`<button type="button" class="exam-picker__button" data-pricing-exam="${code}" aria-pressed="${i===0}">${code}</button>`).join("")}</div>
          <p class="practice-selection" aria-live="polite" id="pricing-selection">Showing ASP practice exam packages</p>
          <noscript><p>JavaScript is off. Use the certification-specific links in each plan below.</p></noscript>
          <div class="pricing-grid">${p.durations.map((plan,i)=>`
            <article class="pricing-card ${i===2?'pricing-card--annual':''}" aria-labelledby="duration-${plan.days}">
              <span class="pricing-card__badge ${i===1?'pricing-card__badge--recommended':''}">${esc(plan.badge)}</span>
              <h3 id="duration-${plan.days}">${esc(plan.name)}</h3><p class="pricing-card__duration">${plan.days} days of access</p>
              <p class="pricing-card__price"><span class="pricing-card__currency">US$</span>${plan.price}</p><p class="pricing-card__billing">One-time payment</p>
              <p class="pricing-card__description">${esc(plan.description)}</p>
              <ul><li>Full bank for your selected exam</li><li>Timed mock exams and practice</li><li>Answer explanations</li><li>Score history and analytics</li></ul>
              <div class="pricing-card__actions">${codes.map((code,j)=>{
                const href=plan.available?`${p.appUrl}/checkout/${code}?days=${plan.days}`:`mailto:support@iparkar.com?subject=${encodeURIComponent(code+' - '+plan.name+' - '+plan.days+' days')}&body=${encodeURIComponent('Hello iParkar, I would like '+code+' '+plan.name+' access for '+plan.days+' days at US$'+plan.price+'. Please share the purchase details.')}`;
                return `<a class="ip-btn ${i===2?'ip-btn--primary':'ip-btn--dark'}" data-plan-exam="${code}" href="${esc(href)}">${plan.available?'Get':'Request'} ${code} access - ${plan.days} days</a>`;
              }).join('')}</div><p class="pricing-card__availability">${plan.available?'Sign in and continue to secure checkout.':'Request access by email while checkout is being prepared.'}</p>
            </article>`).join('')}</div>
          <p class="fineprint pricing-terms">Prices are in USD and cover one certification package. Applicable taxes are calculated at checkout. All durations include the same features for your selected exam. Access begins when payment is confirmed.</p>
        </section>
        <section class="practice-features" aria-labelledby="included-heading"><div><p class="eyebrow">INCLUDED IN YOUR PACKAGE</p><h2 id="included-heading">Practice with purpose.</h2><p>The same practice tools, with the time you need to use them.</p></div>
        <div class="practice-features__content">${exams.map((pl,i)=>`<article data-feature-exam="${codes[i]}"><h3>${codes[i]} practice features</h3><ul>${pl.features.map(f=>`<li>${esc(f)}</li>`).join('')}</ul></article>`).join('')}</div></section>
        <section class="pricing-faq" aria-labelledby="pricing-faq-heading"><h2 id="pricing-faq-heading">Before you choose</h2><details><summary>Does one purchase include all three certifications?</summary><p>Each purchase covers one selected certification: ASP, CSP or CIH. The same three access durations are offered for each exam.</p></details><details><summary>Will I be charged again automatically?</summary><p>No. These are one-time purchases with 90, 180 or 365 days of access. There is no automatic renewal.</p></details><details><summary>How do I get a 180-day or 365-day package?</summary><p>Choose your certification and select Get access for the duration you need. Sign in or create an account, then complete secure checkout. Access activates after payment is verified.</p></details><details><summary>Where can I find the refund policy?</summary><p>Read our <a href="/refunds.html">refund policy</a> before purchasing. For purchase questions, <a href="/contact/">contact iParkar Learning</a>.</p></details></section>
      </div>
      <p class="fineprint">${esc(p.member.text)} <a href="${esc(p.member.href)}">${esc(p.member.label)}</a></p>
      <p class="fineprint">${esc(p.note)}</p>`;
  }

  // Enhance the static pricing links without changing checkout or payment state.
  function selectPricingExam(code) {
    document.querySelectorAll("[data-pricing-exam]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.pricingExam === code)));
    document.querySelectorAll("[data-plan-exam]").forEach(link => { link.hidden = link.dataset.planExam !== code; });
    document.querySelectorAll("[data-feature-exam]").forEach(panel => { panel.hidden = panel.dataset.featureExam !== code; });
    const selection = $("#pricing-selection");
    if (selection) selection.textContent = `Showing ${code} practice exam packages`;
  }
  if ($("[data-pricing-exam]")) selectPricingExam("ASP");

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
    if (pricingExam) return selectPricingExam(pricingExam.dataset.pricingExam);
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
