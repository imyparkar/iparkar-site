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
    return `<a class="ip-btn ip-btn--${style}" href="${esc(b.href)}"${linkAttrs(b.href)}>${esc(b.label)}</a>`;
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

  /* ---------- shell: nav + footer ---------- */
  const tabs = S.tabs.filter((t) => t.show !== false);
  document.title = S.brand.tagline ? `${S.brand.fullName} · ${S.brand.tagline}` : S.brand.fullName;
  $("#brand").innerHTML = `
    <img src="${esc(S.brand.logo)}" alt="" width="36" height="36">
    <span class="brand__name">${esc(S.brand.name)} <span>${esc(S.brand.wordmark || "")}</span></span>`;
  $("#nav-links").innerHTML = tabs.map((t) => `<a class="ip-nav-link" href="#${t.id}" data-tab="${t.id}">${esc(t.label)}</a>`).join("");
  $("#nav-actions").innerHTML = S.navAction ? btn(S.navAction, "primary") : "";
  $("#footer").innerHTML = `
    <span>${esc(S.footer.copyright)}</span>
    <nav aria-label="Legal">${S.footer.links.map((l) => `<a href="${esc(l.href)}">${esc(l.label)}</a>`).join("")}
      ${S.brand.contactEmail ? `<a href="mailto:${esc(S.brand.contactEmail)}">Contact</a>` : ""}</nav>`;

  /* ---------- Tab 1: About ---------- */
  function renderAbout() {
    const a = S.about;
    return `
      <section class="hero">
        <div>
          <h1 class="hero__title">${esc(a.heroBefore)} <span class="ip-highlight ip-highlight--marigold">${esc(a.highlight)}</span> ${esc(a.heroAfter)}</h1>
          <p class="hero__lead">${esc(a.lead)}</p>
          <div class="ip-btn-row">${a.heroButtons.map((b) => btn(b)).join("")}</div>
        </div>
        <aside class="ip-card ip-card--dark profile-card" aria-label="Profile">
          <div class="profile-card__head">
            <img src="assets/iparkar-mark-reversed.svg" alt="" width="64" height="64">
            <div>
              <p class="profile-card__name">${esc(a.name)}</p>
              <p class="profile-card__role">${esc(a.role)}</p>
            </div>
          </div>
          <div class="pill-row cred-row">${a.credentials.map((c) => `<span class="ip-pill">${esc(c)}</span>`).join("")}</div>
        </aside>
      </section>

      <section class="bio">
        ${header(a.sectionTitle || "About us")}
        <div class="bio__text">
          ${a.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}
          ${(a.sections || []).map((sec) => `
            <h3 class="bio__heading">${esc(sec.heading)}</h3>
            ${(sec.paragraphs || []).map((p) => `<p>${esc(p)}</p>`).join("")}
            ${sec.list ? `<ul class="bio__list">${sec.list.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}`).join("")}
          <p class="bio__closing">${esc(a.closing)}</p>
        </div>
      </section>

      <section class="grid grid--3">
        ${a.highlights.map((h) => `
          <article class="${cardClass(h.color)}">
            <h3 class="ip-card__title">${esc(h.title)}</h3>
            <p class="ip-card__body">${esc(h.body)}</p>
          </article>`).join("")}
      </section>`;
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
      <p class="fineprint">${esc(c.disclaimer)}</p>`;
  }
  function renderCert(id) {
    const it = S.certifications.items.find((x) => x.id === id) || S.certifications.items[0];
    const list = (arr) => `<ol class="step-list">${arr.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>`;
    $("#cert-body").innerHTML = `
      <div class="cert-head">
        <div>
          <p class="eyebrow">${esc(it.body)} · checked ${esc(it.lastChecked)}</p>
          <h3>${esc(it.name)} (${esc(it.short)})</h3>
          <p>${esc(it.summary)}</p>
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
  function renderCourses() {
    const c = S.courses;
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
      <p class="fineprint">${esc(c.disclaimer)}</p>`;
  }

  /* ---------- Tab 3: Live quiz ---------- */
  function renderQuiz() {
    const q = S.quiz;
    return `
      ${header(q.title, q.lead)}
      <section class="quiz-hero">
        <article class="ip-card ip-card--marigold">
          <h3 class="quiz-hero__title">Ready when the session starts.</h3>
          <p class="ip-card__body" style="margin-bottom:24px">Open the quiz in a new tab and keep this page for reference.</p>
          <a class="ip-btn ip-btn--dark ip-btn--lg" href="${esc(q.url)}" target="_blank" rel="noopener">${esc(q.buttonLabel)}</a>
        </article>
        <article class="ip-card">
          <h3 class="ip-card__title">Topics we cover</h3>
          <div class="pill-row" style="margin-top:12px">${q.topics.map((t) => `<span class="ip-pill ip-pill--todo">${esc(t)}</span>`).join("")}</div>
        </article>
      </section>
      <section class="grid grid--3">
        ${q.howItWorks.map((s, i) => `
          <article class="ip-card">
            <p class="big-num">Step ${i + 1}</p>
            <h3 class="ip-card__title">${esc(s.title)}</h3>
            <p class="ip-card__body">${esc(s.body)}</p>
          </article>`).join("")}
      </section>
      ${q.embed ? `<iframe class="quiz-frame" src="${esc(q.url)}" title="Live HSE quiz" loading="lazy"></iframe>` : ""}`;
  }

  /* ---------- Tab 4: Practice exam ---------- */
  function renderPractice() {
    const p = S.practice;
    const best = store.get("ip-free-best");
    return `
      ${header(p.title, p.lead)}
      <div id="exam-area"></div>
      <section class="grid grid--3" id="plans">
        ${p.plans.map((pl) => `
          <article class="${cardClass(pl.color)} plan">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
              <h3 class="ip-card__title" style="margin:0">${esc(pl.name)}</h3>
              <span class="ip-pill ${pl.color === "white" ? "ip-pill--todo" : "ip-pill--white"}">${esc(pl.status)}</span>
            </div>
            <div class="plan__price">${esc(pl.price)} ${pl.period ? `<small>/ ${esc(pl.period)}</small>` : ""}</div>
            <ul>${pl.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
            ${btn(pl.button, pl.color === "white" ? "ghost" : "dark")}
          </article>`).join("")}
      </section>
            ${p.member ? `<p class="fineprint">${esc(p.member.text)} <a href="${esc(p.member.href)}">${esc(p.member.label)}</a></p>` : ""}
      ${best != null ? `<p class="fineprint">Your best free-sample score on this device: <strong>${best} / ${p.freeCount}</strong></p>` : ""}
      <p class="fineprint">${esc(p.note)}</p>`;
  }

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

  /* ---------- render all panels ---------- */
  const renderers = { about: renderAbout, certifications: renderCerts, courses: renderCourses, quiz: renderQuiz, practice: renderPractice };
  $("#panels").innerHTML = tabs.map((t) => `<div class="tab-panel" id="panel-${t.id}" role="region" aria-label="${esc(t.label)}" hidden></div>`).join("");
  tabs.forEach((t) => { const el = $(`#panel-${t.id}`); if (renderers[t.id]) el.innerHTML = renderers[t.id](); });
  if ($("#cert-body")) renderCert(S.certifications.items[0].id);

  /* ---------- routing (#about, #certifications, #quiz, #practice) ---------- */
  function show() {
    const id = (location.hash || "").slice(1);
    const current = tabs.find((t) => t.id === id) ? id : tabs[0].id;
    tabs.forEach((t) => { $(`#panel-${t.id}`).hidden = t.id !== current; });
    document.querySelectorAll("[data-tab]").forEach((a) => {
      if (a.dataset.tab === current) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    window.scrollTo({ top: 0 });
  }
  window.addEventListener("hashchange", show);
  show();

  /* ---------- clicks ---------- */
  document.addEventListener("click", (e) => {
    const cert = e.target.closest("[data-cert]");
    if (cert) return renderCert(cert.dataset.cert);
    const opt = e.target.closest("[data-opt]");
    if (opt && !opt.disabled) return choose(Number(opt.dataset.opt));
    const act = e.target.closest("[data-action]");
    if (!act) return;
    const a = act.dataset.action;
    if (a === "start-free") startFree();
    if (a === "next") { if (exam.i < exam.items.length - 1) { exam.i++; drawQuestion(); } else finish(); }
    if (a === "show-plans") { $("#exam-area").innerHTML = ""; $("#plans").hidden = false; $("#plans").scrollIntoView({ behavior: "smooth" }); }
  });
})();
