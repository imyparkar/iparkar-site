/* iParkar Learning — country-specific prices.
   ---------------------------------------------------------------------------
   Visitors see the prices for their country (from Cloudflare's IP lookup via
   /api/geo). Countries not listed here see the US$ prices in site-config.js
   (practice exams) and build.mjs (Self Paced Study Courses).

   To change a price, edit the numbers below, then run `node build.mjs`.
   Each region lists:
     exam : [90-day, 180-day, 365-day] for ASP, CSP, CIH, GES/EPI and QEP
     cit  : [90-day, 180-day, 365-day] for CIT
     sps  : Self Paced Study Course (ASP / CSP), 365 days
   Prices follow the US$ prices at Nov 2026 exchange rates (US$1 ≈ ₹94,
   KWD 0.307, AED 3.67, SAR 3.75, QAR 3.64, BHD 0.376, OMR 0.385, £0.75, €0.86).
   Gulf prices are rounded to the nearest 5 or 10; India is set about 10% lower
   and rounded to the nearest …,999.
   Keep the same prices in the LMS checkout catalogue (iparkar-lms repo,
   src/lib/payments/catalogue.ts) so Razorpay charges what the website shows.
   --------------------------------------------------------------------------- */
(function () {
  const REGIONS = [
    { name: "India",                currency: "INR", countries: ["IN"], exam: [7999, 12999, 16999], cit: [3999, 6999, 7999], sps: 9999 },
    { name: "Kuwait",               currency: "KWD", countries: ["KW"], exam: [30, 45, 60],          cit: [15, 25, 30],        sps: 35 },
    { name: "United Arab Emirates", currency: "AED", countries: ["AE"], exam: [365, 550, 730],       cit: [180, 290, 365],     sps: 440 },
    { name: "Saudi Arabia",         currency: "SAR", countries: ["SA"], exam: [375, 560, 750],       cit: [185, 300, 375],     sps: 450 },
    { name: "Qatar",                currency: "QAR", countries: ["QA"], exam: [360, 545, 725],       cit: [180, 290, 360],     sps: 440 },
    { name: "Bahrain",              currency: "BHD", countries: ["BH"], exam: [35, 55, 75],          cit: [20, 30, 35],        sps: 45 },
    { name: "Oman",                 currency: "OMR", countries: ["OM"], exam: [40, 55, 75],          cit: [20, 30, 40],        sps: 45 },
    { name: "United Kingdom",       currency: "GBP", countries: ["GB"], exam: [75, 112, 149],        cit: [37, 59, 75],        sps: 90 },
    { name: "Euro area",            currency: "EUR", countries: ["AT","BE","HR","CY","EE","FI","FR","DE","GR","IE","IT","LV","LT","LU","MT","NL","PT","SK","SI","ES"], exam: [85, 129, 169], cit: [42, 68, 85], sps: 105 },
  ];
  // Currency symbols where a common one exists; Gulf currencies show their codes (KWD, AED, SAR, QAR, BHD, OMR).
  const SYMBOLS = { USD: "US$", INR: "₹", GBP: "£", EUR: "€" };

  const NAMES = { USD: "US dollars", INR: "Indian rupees", KWD: "Kuwaiti dinars", AED: "UAE dirhams", SAR: "Saudi riyals", QAR: "Qatari riyals", BHD: "Bahraini dinars", OMR: "Omani rials", GBP: "pounds sterling", EUR: "euros" };
  const listeners = [];
  const P = {
    regions: REGIONS,
    region: null,       // the visitor's region, or null for US$ prices
    country: "",
    ready: false,
    /* Price for a product. code: "ASP", "CIT", "SPS"…; i: duration index; usd: the US$ price. */
    price(code, i, usd) {
      const r = P.region;
      if (!r) return { amount: usd, currency: "USD" };
      const amount = code === "SPS" ? r.sps : (code === "CIT" ? r.cit : r.exam)[i];
      return amount == null ? { amount: usd, currency: "USD" } : { amount, currency: r.currency };
    },
    /* Split a price into its symbol and number, e.g. { sym: "₹", num: "3,999", text: "₹3,999" }. */
    parts(amount, currency, decimals) {
      const num = new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en", {
        minimumFractionDigits: decimals || 0, maximumFractionDigits: decimals || 0,
      }).format(amount);
      const raw = SYMBOLS[currency] || currency;
      const arabic = /[\u0600-\u06FF]/.test(raw), code = /^[A-Z]{3}$/.test(raw);
      const sym = arabic ? "\u2067" + raw + "\u2069 " : code ? raw + " " : raw;
      return { sym, num, text: sym + num };
    },
    format(amount, currency, decimals) { return P.parts(amount, currency, decimals).text; },
    currencyName(currency) { return NAMES[currency] || currency; },
    onReady(fn) { if (P.ready) fn(P); else listeners.push(fn); },
  };
  window.IP_PRICES = P;
  if (window.IPARKAR_BUILD || typeof fetch !== "function") return;

  function apply(country) {
    P.country = country || "";
    P.region = REGIONS.find(r => r.countries.includes(P.country)) || null;
    P.ready = true;
    // Static price tags on any page: <span data-local-price="SPS" data-usd="120" data-i="0">US$120</span>
    document.querySelectorAll("[data-local-price]").forEach(el => {
      const p = P.price(el.dataset.localPrice, Number(el.dataset.i || 0), Number(el.dataset.usd));
      el.textContent = P.format(p.amount, p.currency);
    });
    document.querySelectorAll("[data-local-currency-note]").forEach(el => {
      el.textContent = P.region ? `Prices shown in ${P.currencyName(P.region.currency)} for ${P.region.name}. ` : "";
    });
    listeners.splice(0).forEach(fn => fn(P));
  }

  // ?country=IN previews another country's prices (for checking only; checkout uses the billing country).
  const preview = new URLSearchParams(location.search).get("country");
  if (preview && /^[A-Za-z]{2}$/.test(preview)) return apply(preview.toUpperCase());
  let cached = null;
  try { cached = sessionStorage.getItem("ip-country"); } catch (e) {}
  if (cached !== null) return apply(cached);
  fetch("/api/geo", { cache: "no-store" })
    .then(r => (r.ok ? r.json() : {}))
    .catch(() => ({}))
    .then(d => {
      const c = typeof d.country === "string" && /^[A-Z]{2}$/.test(d.country) ? d.country : "";
      try { sessionStorage.setItem("ip-country", c); } catch (e) {}
      apply(c);
    });
})();
