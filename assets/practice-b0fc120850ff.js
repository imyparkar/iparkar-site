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
   Keep the same prices in the Paddle catalogue (price overrides per country)
   so the checkout charges what the website shows.
   --------------------------------------------------------------------------- */
(function () {
  const REGIONS = [
    { name: "India",                currency: "INR", countries: ["IN"], exam: [3999, 5999, 7999], cit: [1999, 2999, 3999], sps: 4999 },
    { name: "Kuwait",               currency: "KWD", countries: ["KW"], exam: [30, 45, 60],        cit: [15, 24, 30],        sps: 37 },
    { name: "United Arab Emirates", currency: "AED", countries: ["AE"], exam: [365, 549, 729],     cit: [179, 289, 365],     sps: 439 },
    { name: "Saudi Arabia",         currency: "SAR", countries: ["SA"], exam: [375, 559, 749],     cit: [185, 299, 375],     sps: 449 },
    { name: "Qatar",                currency: "QAR", countries: ["QA"], exam: [360, 545, 725],     cit: [179, 289, 360],     sps: 439 },
    { name: "Bahrain",              currency: "BHD", countries: ["BH"], exam: [37, 56, 75],        cit: [19, 30, 37],        sps: 45 },
    { name: "Oman",                 currency: "OMR", countries: ["OM"], exam: [38, 57, 77],        cit: [19, 30, 38],        sps: 46 },
    { name: "United Kingdom",       currency: "GBP", countries: ["GB"], exam: [79, 119, 159],      cit: [39, 65, 79],        sps: 95 },
    { name: "Euro area",            currency: "EUR", countries: ["AT","BE","HR","CY","EE","FI","FR","DE","GR","IE","IT","LV","LT","LU","MT","NL","PT","SK","SI","ES"], exam: [95, 139, 185], cit: [45, 75, 95], sps: 109 },
  ];

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
      if (currency === "USD") {
        const num = decimals ? amount.toFixed(decimals) : String(Math.round(amount));
        return { sym: "US$", num, text: "US$" + num };
      }
      const f = new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en", {
        style: "currency", currency, currencyDisplay: "symbol",
        minimumFractionDigits: decimals || 0, maximumFractionDigits: decimals || 0,
      }).formatToParts(amount);
      const sym = f.filter(p => p.type === "currency").map(p => p.value).join("");
      const num = f.filter(p => !["currency", "literal"].includes(p.type)).map(p => p.value).join("");
      const space = /^[A-Z]{3}$/.test(sym) ? " " : "";
      return { sym: sym + space, num, text: sym + space + num };
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
