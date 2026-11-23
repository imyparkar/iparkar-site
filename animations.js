/* iParkar Learning — site-wide motion
   Added to every page by build.mjs: <script src="/animations.js" defer></script>
   - Page titles rise in word by word; highlights sweep in behind their word.
   - Hero banners, breadcrumbs and leads fade in on load.
   - Everything below appears as it scrolls into view, once; grids and lists come in one item after another.
   - Link cards lift and tilt slightly on hover; arrows slide.
   - Home page extras: steps count up, study-course pill shines, Answer / Review / Try again cycle, live-quiz dot.
   Nothing animates for visitors who turn on reduced motion, and without JavaScript the page is fully visible. */
(function () {
  "use strict";
  if (window.__ipMotion) return; window.__ipMotion = true;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!("IntersectionObserver" in window)) return;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const isHome = !!$(".home-hero");

  const css = `
  .ipm-up{opacity:0;transform:translateY(22px);transition:opacity .7s ease-out,transform .7s cubic-bezier(.2,.8,.2,1);transition-delay:calc(var(--d,0)*.1s)}
  .ipm-left{opacity:0;transform:translateX(-40px);transition:opacity .8s ease-out,transform .8s cubic-bezier(.2,.8,.2,1)}
  .ipm-right{opacity:0;transform:translateX(40px);transition:opacity .8s ease-out,transform .8s cubic-bezier(.2,.8,.2,1);transition-delay:.5s}
  .ipm-up.ipm-in,.ipm-left.ipm-in,.ipm-right.ipm-in{opacity:1;transform:none}

  .site-nav{transition:box-shadow .3s ease}
  .site-nav.ipm-scrolled{box-shadow:0 8px 24px -18px rgba(2,9,58,.55)}
  .ipm-home .site-nav .brand{animation:ipm-pop .7s cubic-bezier(.2,.8,.2,1) both}
  .ipm-home .site-nav .nav-item,.ipm-home .site-nav .nav-actions{animation:ipm-down .5s ease-out both;animation-delay:calc(.2s + var(--i,0)*.05s)}

  .ipm-load{animation:ipm-fade .7s ease-out both;animation-delay:calc(var(--t,0)*1s)}
  .ipm-w{display:inline-block;animation:ipm-rise .7s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(.15s + var(--i)*.08s)}
  .ip-highlight.ipm-hl{background:linear-gradient(var(--ipm-hl),var(--ipm-hl)) no-repeat 0 0/0% 100%;animation:ipm-rise .7s cubic-bezier(.2,.8,.2,1) both,ipm-sweep .6s cubic-bezier(.6,0,.2,1) forwards;animation-delay:calc(.15s + var(--i)*.08s),var(--sweep,.9s)}
  .ipm-pop{animation:ipm-pop .6s cubic-bezier(.2,.8,.2,1) backwards;animation-delay:calc(var(--t,0)*1s)}

  .ip-btn{transition:transform .25s ease,box-shadow .25s ease}
  .ip-btn:not(:disabled):hover{transform:translateY(-2px)}
  .ipm-arrow{display:inline-block;transition:transform .25s ease}
  a:hover .ipm-arrow{transform:translateX(4px)}

  .ipm-lift{transition:opacity .7s ease-out,transform .7s cubic-bezier(.2,.8,.2,1),box-shadow .35s ease}
  .ipm-lift.ipm-in{transition:opacity .7s ease-out,transform .25s ease-out,box-shadow .35s ease}
  .ipm-lift.ipm-in:hover{box-shadow:0 22px 40px -24px rgba(2,9,58,.5)}
  .ipm-tiltwrap{perspective:900px}

  .ipm-in .ip-pill--progress,.ipm-in.ip-pill--progress{animation:ipm-pulse .6s .7s ease-out}
  .ipm-in .stage__num,.ipm-in .member-path__num{animation:ipm-pop .6s .35s cubic-bezier(.2,.8,.2,1) backwards}
  .ipm-row{opacity:0;transform:translateY(10px);transition:opacity .5s ease-out,transform .5s ease-out;transition-delay:calc(var(--d,0)*.05s)}
  .ipm-in .ipm-row{opacity:1;transform:none}

  .pathway-preview ol li{position:relative;opacity:0;transform:translateX(14px);transition:opacity .5s ease-out,transform .5s ease-out;transition-delay:calc(.9s + var(--i)*.25s)}
  .pathway-preview ol li::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;background:#ffb110;transform:scaleX(0);transform-origin:left;transition:transform .7s cubic-bezier(.6,0,.2,1);transition-delay:calc(1.1s + var(--i)*.25s)}
  .pathway-preview.ipm-in ol li{opacity:1;transform:none}
  .pathway-preview.ipm-in ol li::after{transform:scaleX(1)}

  .ipm-shine{position:relative;overflow:hidden}
  .ipm-shine::after{content:"";position:absolute;inset:0;background:linear-gradient(100deg,transparent 30%,rgba(255,255,255,.75) 50%,transparent 70%);transform:translateX(-120%);pointer-events:none}
  .ipm-in .ipm-shine{animation:ipm-pulse .6s .9s ease-out}
  .ipm-in .ipm-shine::after{animation:ipm-shinemove 1s 1s ease-out}
  .ipm-num{font-variant-numeric:tabular-nums}

  .ipm-step{padding:2px 8px;margin:0 -4px;border-radius:999px;-webkit-box-decoration-break:clone;box-decoration-break:clone;transition:background .4s,color .4s}
  .ipm-step.ipm-on{background:#fff;color:#02093a}
  .ipm-mask{display:inline-block;clip-path:inset(0 100% 0 0);transition:clip-path 1s cubic-bezier(.6,0,.2,1) .15s}
  .ipm-in .ipm-mask{clip-path:inset(0 -2% 0 0)}
  .ipm-dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:#ff4d6d;margin-right:8px;vertical-align:middle;animation:ipm-live 1.8s infinite}

  @keyframes ipm-rise{from{opacity:0;transform:translateY(.45em)}to{opacity:1;transform:none}}
  @keyframes ipm-fade{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
  @keyframes ipm-down{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}
  @keyframes ipm-pop{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:none}}
  @keyframes ipm-sweep{to{background-size:100% 100%}}
  @keyframes ipm-pulse{50%{transform:scale(1.1)}}
  @keyframes ipm-shinemove{to{transform:translateX(120%)}}
  @keyframes ipm-live{0%{box-shadow:0 0 0 0 rgba(255,77,109,.7)}70%,100%{box-shadow:0 0 0 9px rgba(255,77,109,0)}}`;

  const style = document.createElement("style");
  style.id = "ipm-style"; style.textContent = css; document.head.appendChild(style);
  if (isHome) document.documentElement.classList.add("ipm-home");

  /* Elements that hold fixed or sticky parts (buy bar, filter tabs, exam workspace) are never moved:
     their children animate instead, so nothing jumps out of place. */
  const PINNED = ".plan-buybar, .book-tabs, .fx, [data-plan-mobile] .plan-tabs";
  const holdsPinned = (el) => el.matches(PINNED) || !!el.querySelector(PINNED);

  const reveal = [];
  const mark = (el, cls = "ipm-up", d = 0) => {
    if (!el || el.classList.contains("ipm-up") || el.classList.contains("ipm-left") || el.classList.contains("ipm-right")) return;
    if (el.closest(".plan-courses--animate, .fx")) return; // these already have their own motion
    if (holdsPinned(el)) { [...el.children].forEach((c, i) => mark(c, cls, i)); return; }
    el.classList.add(cls); el.style.setProperty("--d", Math.min(d, 8)); reveal.push(el);
  };

  /* ---------- header ---------- */
  $$(".site-nav .nav-item, .site-nav .nav-actions").forEach((el, i) => el.style.setProperty("--i", i));
  const nav = $(".site-nav");
  const onScroll = () => nav && nav.classList.toggle("ipm-scrolled", scrollY > 40);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- page title: words rise, highlight sweeps ---------- */
  const title = $(".home-hero .hero__title, main h1");
  let words = 0;
  if (title) {
    const out = document.createDocumentFragment();
    [...title.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { out.appendChild(document.createTextNode(part)); return; }
          const s = document.createElement("span"); s.className = "ipm-w"; s.style.setProperty("--i", words++); s.textContent = part; out.appendChild(s);
        });
      } else if (n.nodeType === 1 && n.tagName !== "BR") {
        n.classList.add("ipm-w"); n.style.setProperty("--i", words++);
        if (n.classList.contains("ip-highlight")) {
          n.style.setProperty("--ipm-hl", getComputedStyle(n).backgroundColor);
          n.style.setProperty("--sweep", (0.5 + words * 0.08).toFixed(2) + "s");
          n.classList.add("ipm-hl");
        }
        out.appendChild(n);
      } else out.appendChild(n);
    });
    title.textContent = ""; title.appendChild(out);
  }
  const afterTitle = 0.35 + words * 0.08;

  /* ---------- the block that holds the title: fade the rest of it in on load ---------- */
  const panelRoot = $("main .tab-panel") || $("main");
  let heroBox = title && (title.closest(".home-hero > div, .px-hero, .course-hero__text, .quiz-banner__text, .ip-section-header, .practice-heading__text, .company-about") || title.parentElement);
  if (heroBox && (heroBox === panelRoot || heroBox.matches("main, article") || heroBox.children.length > 6)) heroBox = null; // long pages: only the title animates on load
  if (heroBox) {
    let t = afterTitle;
    $$(":scope > *", heroBox).forEach((el) => {
      if (el === title) return;
      if (el.contains(title)) {
        $$(":scope > *", el).forEach((c) => { if (c !== title && !c.contains(title)) { c.classList.add("ipm-load"); c.style.setProperty("--t", (t += 0.12).toFixed(2)); } });
        return;
      }
      if (el.matches(".ip-btn-row")) { $$(".ip-btn", el).forEach((b) => { b.classList.add("ipm-pop"); b.style.setProperty("--t", (t += 0.12).toFixed(2)); }); return; }
      el.classList.add("ipm-load"); el.style.setProperty("--t", (t += 0.12).toFixed(2));
    });
  }
  const crumbs = $(".breadcrumbs"); if (crumbs) crumbs.classList.add("ipm-load");

  /* side panel next to a hero (price box, pathway card) slides in */
  $$(".course-hero > .course-buy, .home-hero > .pathway-preview, .quiz-banner > .quiz-banner__stats").forEach((el) => { el.classList.add("ipm-right"); reveal.push(el); });

  /* ---------- arrows slide on hover ---------- */
  $$("a").forEach((a) => {
    const t = a.lastChild;
    if (t && t.nodeType === 3 && /→\s*$/.test(t.textContent)) {
      t.textContent = t.textContent.replace(/\s*→\s*$/, " ");
      const s = document.createElement("span"); s.className = "ipm-arrow"; s.setAttribute("aria-hidden", "true"); s.textContent = "→"; a.appendChild(s);
    }
  });
  $$("a span[aria-hidden]").forEach((s) => { if (s.textContent.trim() === "→") s.classList.add("ipm-arrow"); });

  /* ---------- grids and lists: items one after another ---------- */
  const GRIDS = [
    ".grid", ".category-grid", ".provider-grid", ".path-choice", ".px-plans__grid", ".sps-grid", ".member-grid",
    ".course-cols", ".cert-cols", ".res-pair", ".quiz-choices", ".stage-list", ".member-path__list", ".quiz-steps ol",
    ".quiz-topics ul", ".course-steps", ".free-course__mods", ".book-sections", ".link-list", ".pxc-exams", ".tick-list",
  ].join(",");
  const gridItems = new Set();
  $$(GRIDS, $("main") || document).forEach((g) => {
    if (g.closest(".pathway-preview, .home-hero, .fx")) return;
    [...g.children].forEach((c, i) => { if (!gridItems.has(c)) { gridItems.add(c); mark(c, "ipm-up", i + 1); } });
  });

  /* tables: rows come in one after another */
  $$("main .table-wrap").forEach((w) => {
    mark(w);
    $$("tbody tr", w).forEach((tr, i) => { tr.classList.add("ipm-row"); tr.style.setProperty("--d", Math.min(i, 14)); });
  });

  /* ---------- home page extras ---------- */
  const card = $(".pathway-preview");
  if (card) {
    $$("ol li", card).forEach((li, i) => {
      li.style.setProperty("--i", i);
      const n = $("span", li); if (n && /^\d+$/.test(n.textContent.trim())) { n.classList.add("ipm-num"); n.dataset.count = parseInt(n.textContent, 10); n.dataset.pad = 2; n.textContent = "00"; }
    });
  }
  const guide = $(".home-guide");
  if (guide) {
    guide.classList.add("ipm-left"); reveal.push(guide);
    const pill = $(".ip-pill", guide); if (pill) pill.classList.add("ipm-shine");
    const p = $("p", guide);
    if (p) p.innerHTML = p.innerHTML.replace(/\b35(-hour)/, '<span class="ipm-num" data-count="35">0</span>$1');
  }
  const panel = $(".feature-panel");
  let steps = [];
  if (panel) {
    const p = [...panel.querySelectorAll("p")].find((x) => /^\s*Answer\./.test(x.textContent));
    if (p) {
      p.innerHTML = '<span class="ipm-step">Answer.</span> <span class="ipm-step">Review the explanation.</span> <span class="ipm-step">Try again.</span>';
      steps = $$(".ipm-step", p);
    }
    const side = panel.nextElementSibling;
    const t = side && $(".feature-title", side); if (t) t.innerHTML = `<span class="ipm-mask">${t.innerHTML}</span>`;
  }

  /* live quiz buttons get a pulsing "live" dot */
  $$("a.ip-btn").forEach((b) => {
    if (/\blive quiz\b/i.test(b.textContent) && !$(".ipm-dot", b)) b.insertAdjacentHTML("afterbegin", '<span class="ipm-dot" aria-hidden="true"></span>');
  });

  /* live quiz stats count up (500 → 500 HSE questions, 40s per question) */
  $$(".quiz-banner__stats strong").forEach((s) => {
    const m = s.textContent.trim().match(/^(\d+)(\D*)$/);
    if (m) { s.dataset.count = m[1]; s.dataset.suffix = m[2]; s.classList.add("ipm-num"); s.textContent = "0" + m[2]; }
  });

  /* ---------- everything else in the page body, section by section ---------- */
  if (panelRoot) {
    [...panelRoot.children].forEach((el) => {
      if (el === crumbs || el === heroBox || el.contains(title)) {
        // inside the title's section, reveal the parts below the hero
        if (el !== crumbs && el.contains(title)) [...el.children].forEach((c, i) => { if (!c.contains(title) && c !== heroBox && !c.classList.contains("ipm-right") && !c.querySelector(".ipm-up") && !gridItems.has(c)) mark(c, "ipm-up", i); });
        return;
      }
      if (el.classList.contains("ipm-left") || el.classList.contains("ipm-right")) return;
      if (el.querySelector(".ipm-up")) {
        // the section has its own animated items: reveal its other direct parts
        [...el.children].forEach((c, i) => { if (!c.querySelector(".ipm-up") && !gridItems.has(c) && !c.classList.contains("ipm-up")) mark(c, "ipm-up", i); });
        return;
      }
      mark(el);
    });
  }
  $$(".site-footer__inner > *").forEach((el, i) => mark(el, "ipm-up", i));

  /* hover lift on link cards, with a gentle tilt */
  const LINK_CARDS = "a.card-link, a.provider-card, a.stage, .path-card, .quiz-choice, .sps-grid > *";
  $$(LINK_CARDS).forEach((c) => {
    c.classList.add("ipm-lift");
    if (c.parentElement) c.parentElement.classList.add("ipm-tiltwrap");
    if (c.tagName !== "A") return;
    c.addEventListener("pointermove", (ev) => {
      if (!c.classList.contains("ipm-in") || ev.pointerType !== "mouse") return;
      const r = c.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width - 0.5, y = (ev.clientY - r.top) / r.height - 0.5;
      c.style.transform = `rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg) translateY(-4px)`;
    });
    c.addEventListener("pointerleave", () => { c.style.transform = ""; });
  });

  /* ---------- count-up ---------- */
  const countUp = (el) => {
    const end = +el.dataset.count, pad = +el.dataset.pad || 0, sfx = el.dataset.suffix || "";
    const dur = end > 9 ? 1200 : 700, t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur), v = Math.round(end * (1 - (1 - p) ** 3));
      el.textContent = String(v).padStart(pad, "0") + sfx; if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  /* Answer → Review → Try again, only while it is on screen */
  let loop = null;
  const startLoop = () => { if (loop || !steps.length) return; let i = 0;
    const go = () => { steps.forEach((s, k) => s.classList.toggle("ipm-on", k === i)); i = (i + 1) % steps.length; };
    go(); loop = setInterval(go, 1300); };
  const stopLoop = () => { clearInterval(loop); loop = null; steps.forEach((s) => s.classList.remove("ipm-on")); };
  if (panel && steps.length) new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? startLoop() : stopLoop())), { threshold: 0.4 }).observe(panel);

  /* ---------- play each item once as it comes into view ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add("ipm-in");
      // once it has arrived, hand the element back to the site's own styles (hover effects etc.)
      const settle = (ev) => { if (ev.target !== el) return; el.classList.remove("ipm-up", "ipm-left", "ipm-right"); el.removeEventListener("transitionend", settle); };
      el.addEventListener("transitionend", settle);
      const nums = el.matches("[data-count]") ? [el] : $$("[data-count]", el);
      nums.forEach((c, i) => setTimeout(() => countUp(c), el === card ? 1000 + i * 250 : 400));
      io.unobserve(el);
    });
  }, { threshold: 0.05 });
  reveal.forEach((el) => io.observe(el));
  $$(".quiz-banner__stats").forEach((el) => { if (!reveal.includes(el)) io.observe(el); });

  /* at the very bottom of the page, show whatever is left (short footers may never cross the threshold) */
  const atBottom = () => { if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) reveal.forEach((el) => { if (!el.classList.contains("ipm-in") && el.getBoundingClientRect().top < innerHeight) { el.classList.add("ipm-in"); io.unobserve(el); } }); };
  addEventListener("scroll", atBottom, { passive: true });

  /* safety net: anything still hidden after a jump (anchor links, print) is shown */
  const showAll = () => reveal.forEach((el) => el.classList.add("ipm-in"));
  addEventListener("beforeprint", showAll);
  addEventListener("hashchange", () => setTimeout(() => { const t = location.hash && document.getElementById(location.hash.slice(1)); if (t) $$(".ipm-up, .ipm-left, .ipm-right", t).concat(t.closest(".ipm-up") ? [t.closest(".ipm-up")] : []).forEach((el) => el.classList.add("ipm-in")); }, 50));
})();
