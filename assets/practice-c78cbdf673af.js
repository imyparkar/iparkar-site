/* =====================================================================
   iParkar Learning — free sample exam (practice-exams page)
   Mirrors the app.iparkar.com practice-exam workspace: countdown timer,
   question navigator, TI-30XS MultiView calculator, flag for review,
   Previous · Cancel · Next / Submit. Started from app.js ("start-free").
   The calculator engine is ported from iparkar-lms src/lib/calculator/engine.ts.
   ===================================================================== */
(function () {
  "use strict";
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ICONS = {
    calc: '<rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01"/>',
    grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    left: '<path d="m15 18-6-6 6-6"/>',
    right: '<path d="m9 18 6-6-6-6"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    max: '<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/>',
    min: '<polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" x2="21" y1="10" y2="3"/><line x1="3" x2="10" y1="21" y2="14"/>',
  };
  const icon = (name, size = 16, fill = false) => `<svg class="fx-ico" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;

  /* ---------- calculator engine (tokenizer + recursive-descent parser, never eval) ---------- */
  class CalcError extends Error {
    constructor(kind, message) {
      super(message ?? kind);
      this.kind = kind;
    }
  }
  const FUNCS = {
    sin: "sin",
    cos: "cos",
    tan: "tan",
    asin: "asin",
    acos: "acos",
    atan: "atan",
    "sin\u207B\xB9": "asin",
    "cos\u207B\xB9": "acos",
    "tan\u207B\xB9": "atan",
    sinh: "sinh",
    cosh: "cosh",
    tanh: "tanh",
    "sinh\u207B\xB9": "asinh",
    "cosh\u207B\xB9": "acosh",
    "tanh\u207B\xB9": "atanh",
    log: "log",
    ln: "ln",
    sqrt: "sqrt",
    "\u221A": "sqrt",
    cbrt: "cbrt",
    "\u221B": "cbrt",
    abs: "abs",
    exp: "exp",
    root: "root"
  };
  const FUNC_KEYS = Object.keys(FUNCS).sort((a, b) => b.length - a.length);
  const VARIABLES = ["x", "y", "z", "t", "a", "b", "c"];
  function tokenize(src) {
    const s = src.replace(/\s+/g, "");
    const out = [];
    let i = 0;
    while (i < s.length) {
      const ch = s[i];
      const num = s.slice(i).match(/^(\d+\.?\d*|\.\d+)(E[−-]?\d+)?/);
      if (num) {
        const literal = num[0].replace("\u2212", "-");
        const v = Number(literal);
        if (!Number.isFinite(v)) throw new CalcError("OVERFLOW");
        out.push({ t: "num", v });
        i += num[0].length;
        continue;
      }
      const fn = FUNC_KEYS.find((k) => s.startsWith(k, i));
      if (fn) {
        i += fn.length;
        const paren = s[i] === "(";
        if (paren) i++;
        out.push({ t: "fn", v: FUNCS[fn], paren });
        continue;
      }
      if (s.startsWith("Ans", i)) {
        out.push({ t: "const", v: "ans" });
        i += 3;
        continue;
      }
      if (s.startsWith("\u207B\xB9", i)) {
        out.push({ t: "post", v: "\u207B\xB9" });
        i += 2;
        continue;
      }
      if (s.startsWith("nPr", i) || s.startsWith("nCr", i)) {
        out.push({ t: "op", v: s.slice(i, i + 3) });
        i += 3;
        continue;
      }
      if (s.startsWith("\u02E3\u221A", i)) {
        out.push({ t: "op", v: "xroot" });
        i += 2;
        continue;
      }
      switch (ch) {
        case "+":
          out.push({ t: "op", v: "+" });
          break;
        case "-":
        case "\u2212":
          out.push({ t: "op", v: "-" });
          break;
        case "*":
        case "\xD7":
        case "\xB7":
          out.push({ t: "op", v: "*" });
          break;
        case "/":
        case "\xF7":
        case "\u2044":
          out.push({ t: "op", v: "/" });
          break;
        case "\u207B":
          out.push({ t: "neg" });
          break;
        case "\xB0":
        case "\u02B3":
          out.push({ t: "post", v: ch });
          break;
        case "x":
        case "y":
        case "z":
        case "t":
        case "a":
        case "b":
        case "c":
          out.push({ t: "var", v: ch });
          break;
        case "^":
          out.push({ t: "op", v: "^" });
          break;
        case "!":
        case "\xB2":
        case "\xB3":
        case "%":
          out.push({ t: "post", v: ch });
          break;
        case "(":
          out.push({ t: "lp" });
          break;
        case ")":
          out.push({ t: "rp" });
          break;
        case ",":
          out.push({ t: "comma" });
          break;
        case "\u03C0":
          out.push({ t: "const", v: "pi" });
          break;
        case "e":
          out.push({ t: "const", v: "e" });
          break;
        case "M":
          out.push({ t: "const", v: "mem" });
          break;
        default:
          throw new CalcError("SYNTAX", `Unexpected "${ch}"`);
      }
      i++;
    }
    return out;
  }
  const FACT_LIMIT = 170;
  function factorial(n) {
    if (n < 0 || !Number.isInteger(n)) throw new CalcError("DOMAIN", "n! needs a whole number \u2265 0");
    if (n > FACT_LIMIT) throw new CalcError("OVERFLOW");
    let r = 1;
    for (let k = 2; k <= n; k++) r *= k;
    return r;
  }
  function cleanTrig(x) {
    return Math.abs(x) < 1e-12 ? 0 : x;
  }
  function evaluate(src, ctx) {
    const toks = tokenize(src);
    if (!toks.length) throw new CalcError("SYNTAX", "Empty expression");
    let pos = 0;
    const peek = () => toks[pos];
    const next = () => toks[pos++];
    const toRad = (x) => ctx.angle === "DEG" ? x * Math.PI / 180 : x;
    const fromRad = (x) => ctx.angle === "DEG" ? x * 180 / Math.PI : x;
    const applyFn = (f, args) => {
      const need = f === "root" ? 2 : 1;
      if (args.length !== need) throw new CalcError("SYNTAX", `${f} takes ${need} argument(s)`);
      const [x, y] = args;
      switch (f) {
        case "sin":
          return cleanTrig(Math.sin(toRad(x)));
        case "cos":
          return cleanTrig(Math.cos(toRad(x)));
        case "tan": {
          if (ctx.angle === "DEG" && Math.abs((x % 180 + 180) % 180 - 90) < 1e-12) throw new CalcError("DOMAIN", "tan undefined");
          return cleanTrig(Math.tan(toRad(x)));
        }
        case "asin":
          if (x < -1 || x > 1) throw new CalcError("DOMAIN");
          return fromRad(Math.asin(x));
        case "acos":
          if (x < -1 || x > 1) throw new CalcError("DOMAIN");
          return fromRad(Math.acos(x));
        case "atan":
          return fromRad(Math.atan(x));
        case "log":
          if (x <= 0) throw new CalcError("DOMAIN");
          return Math.log10(x);
        case "ln":
          if (x <= 0) throw new CalcError("DOMAIN");
          return Math.log(x);
        case "sqrt":
          if (x < 0) throw new CalcError("DOMAIN");
          return Math.sqrt(x);
        case "cbrt":
          return Math.cbrt(x);
        case "abs":
          return Math.abs(x);
        case "exp":
          return Math.exp(x);
        case "sinh":
          return Math.sinh(x);
        case "cosh":
          return Math.cosh(x);
        case "tanh":
          return Math.tanh(x);
        case "asinh":
          return Math.asinh(x);
        case "acosh":
          if (x < 1) throw new CalcError("DOMAIN");
          return Math.acosh(x);
        case "atanh":
          if (x <= -1 || x >= 1) throw new CalcError("DOMAIN");
          return Math.atanh(x);
        case "root": {
          if (y === 0) throw new CalcError("DOMAIN");
          if (x < 0) {
            if (Number.isInteger(y) && Math.abs(y) % 2 === 1) return -Math.pow(-x, 1 / y);
            throw new CalcError("DOMAIN");
          }
          return Math.pow(x, 1 / y);
        }
      }
    };
    const startsPrimary = (t) => !!t && (t.t === "num" || t.t === "const" || t.t === "fn" || t.t === "lp" || t.t === "var" || t.t === "neg");
    function expr() {
      let v = term();
      for (; ; ) {
        const t = peek();
        if (!(t?.t === "op" && (t.v === "+" || t.v === "-"))) break;
        next();
        const op = t.v;
        const r = term();
        v = op === "+" ? v + r : v - r;
      }
      return v;
    }
    function term() {
      let v = combo();
      for (; ; ) {
        const t = peek();
        if (t?.t === "op" && (t.v === "*" || t.v === "/")) {
          next();
          const r = combo();
          if (t.v === "/") {
            if (r === 0) throw new CalcError("DIVIDE_BY_ZERO");
            v = v / r;
          } else v = v * r;
        } else if (startsPrimary(t)) {
          v = v * combo();
        } else break;
      }
      return v;
    }
    function combo() {
      let v = unary();
      for (let t = peek(); t?.t === "op" && (t.v === "nPr" || t.v === "nCr"); t = peek()) {
        next();
        const r = unary();
        if (!Number.isInteger(v) || !Number.isInteger(r) || v < 0 || r < 0) throw new CalcError("DOMAIN");
        if (r > v) {
          v = 0;
          continue;
        }
        let p = 1;
        for (let k = 0; k < r; k++) p *= v - k;
        v = t.v === "nPr" ? p : Math.round(p / factorial(r));
      }
      return v;
    }
    function unary() {
      const t = peek();
      if (t?.t === "neg") {
        next();
        return -unary();
      }
      if (t?.t === "op" && t.v === "-") {
        next();
        return -unary();
      }
      if (t?.t === "op" && t.v === "+") {
        next();
        return unary();
      }
      return power();
    }
    function power() {
      const base = postfix();
      const t = peek();
      if (t?.t === "op" && t.v === "xroot") {
        next();
        return applyFn("root", [unary(), base]);
      }
      if (t?.t === "op" && t.v === "^") {
        next();
        const exp = unary();
        if (base === 0 && exp < 0) throw new CalcError("DIVIDE_BY_ZERO");
        if (base < 0 && !Number.isInteger(exp)) throw new CalcError("DOMAIN");
        return Math.pow(base, exp);
      }
      return base;
    }
    function postfix() {
      let v = primary();
      for (let t = peek(); t?.t === "post"; t = peek()) {
        next();
        const p = t.v;
        if (p === "!") v = factorial(v);
        else if (p === "\xB2") v = v * v;
        else if (p === "\xB3") v = v * v * v;
        else if (p === "%") v = v / 100;
        else if (p === "\xB0") v = ctx.angle === "RAD" ? v * Math.PI / 180 : v;
        else if (p === "\u02B3") v = ctx.angle === "DEG" ? v * 180 / Math.PI : v;
        else {
          if (v === 0) throw new CalcError("DIVIDE_BY_ZERO");
          v = 1 / v;
        }
      }
      return v;
    }
    function primary() {
      const t = next();
      if (!t) throw new CalcError("SYNTAX", "Expression ends too early");
      switch (t.t) {
        case "num":
          return t.v;
        case "const":
          return t.v === "pi" ? Math.PI : t.v === "e" ? Math.E : t.v === "ans" ? ctx.ans : ctx.memory;
        case "var":
          return ctx.vars?.[t.v] ?? 0;
        case "lp": {
          const v = expr();
          if (peek()?.t === "rp") next();
          else if (peek() !== void 0) throw new CalcError("SYNTAX", "Missing )");
          return v;
        }
        case "fn": {
          if (!t.paren) return applyFn(t.v, [power()]);
          const args = [expr()];
          while (peek()?.t === "comma") {
            next();
            args.push(expr());
          }
          if (peek()?.t === "rp") next();
          else if (peek() !== void 0) throw new CalcError("SYNTAX", "Missing )");
          return applyFn(t.v, args);
        }
        default:
          throw new CalcError("SYNTAX", "Unexpected symbol");
      }
    }
    const value = expr();
    if (pos < toks.length) throw new CalcError("SYNTAX", "Unexpected input");
    if (!Number.isFinite(value)) throw new CalcError("OVERFLOW");
    if (Math.abs(value) >= 1e100) throw new CalcError("OVERFLOW");
    return value;
  }
  function formatNumber(x) {
    if (x === 0 || Object.is(x, -0)) return "0";
    const ax = Math.abs(x);
    if (ax >= 1e10 || ax < 1e-9) {
      const [m, e] = x.toExponential(9).split("e");
      return `${trimZeros(m)}E${Number(e)}`;
    }
    const s = Number(x.toPrecision(10)).toString();
    return s.includes("e") ? formatNumber(Number(s)) : s;
  }
  function trimZeros(m) {
    return m.includes(".") ? m.replace(/0+$/, "").replace(/\.$/, "") : m;
  }
  function toFraction(x, maxDen = 1e4) {
    if (!Number.isFinite(x)) return null;
    const sign = Math.sign(x) || 1;
    let v = Math.abs(x);
    let h1 = 1, h0 = 0, k1 = 0, k0 = 1;
    for (let i = 0; i < 40; i++) {
      const a = Math.floor(v);
      const h2 = a * h1 + h0, k2 = a * k1 + k0;
      if (k2 > maxDen) break;
      h0 = h1;
      h1 = h2;
      k0 = k1;
      k1 = k2;
      if (Math.abs(Math.abs(x) - h1 / k1) < 1e-10) break;
      const frac = v - a;
      if (frac < 1e-12) break;
      v = 1 / frac;
    }
    if (k1 === 0 || Math.abs(Math.abs(x) - h1 / k1) > 1e-9) return null;
    return { num: sign * h1, den: k1 };
  }
  function formatFraction(x, mixed = false) {
    const f = toFraction(x);
    if (!f || f.den === 1) return null;
    if (!mixed || Math.abs(f.num) < f.den) return `${f.num}/${f.den}`;
    const whole = Math.trunc(f.num / f.den);
    const rest = Math.abs(f.num % f.den);
    return `${whole} ${rest}/${f.den}`;
  }

  /* =====================================================================
     TI-30XS MultiView — vanilla port of the app.iparkar.com exam calculator
     (Pearson VUE layout: 41 keys, 2nd functions, 4-line LCD with history,
     (−) key, prb / angle / mode menus, sto→ with x y z t a b c, ⟷ toggle).
     ===================================================================== */
  const ERROR_TEXT = { SYNTAX: "SYNTAX ERROR", DOMAIN: "DOMAIN ERROR", DIVIDE_BY_ZERO: "DIVIDE BY 0", OVERFLOW: "OVERFLOW" };
  const LCD_WIDTH = 16;
  const NEEDS_LEFT = new Set(["+", "−", "×", "÷", "^", "²", "⁻¹", "!", "nPr", "nCr", "ˣ√", "→", "▸%", "%", "°", "ʳ"]);
  const SHOW = { "⁄": "/", nPr: " nPr ", nCr: " nCr " };
  const show = (u) => SHOW[u] ?? u;
  const SUP = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻" };
  function lcdNumber(s) {
    const [m, e] = s.split("E");
    const mant = m.replace(/^-/, "⁻");
    return e === undefined ? mant : `${mant}×10${[...e].map((c) => SUP[c] ?? c).join("")}`;
  }
  function resultText(e) {
    if (e.pct) return `${lcdNumber(formatNumber(e.value * 100))}%`;
    if (e.view !== "dec") { const f = formatFraction(e.value, e.view === "mixed"); if (f) return f.replace(/^-/, "⁻"); }
    return lcdNumber(formatNumber(e.value));
  }
  const K = (id, label, tone, aria, second) => ({ id, label, tone, aria, second });
  const ROWS = [
    [K("2nd", "2nd", "second", "2nd"), K("mode", "mode", "fn", "mode", "quit"), K("delete", "delete", "fn", "delete", "insert")],
    [K("log", "log", "fn", "log", "10ˣ"), K("prb", "prb", "fn", "probability menu", "angle"), K("data", "data", "fn", "data", "stat")],
    [K("ln", "ln", "fn", "natural log", "eˣ"), K("nd", "n/d", "fn", "fraction", "Uⁿ/d"), K("toggle", "⟷", "fn", "answer toggle", "f◂▸d"), K("table", "table", "fn", "table"), K("clear", "clear", "fn", "clear")],
    [K("pi", "π", "fn", "pi", "hyp"), K("sin", "sin", "fn", "sine", "sin⁻¹"), K("cos", "cos", "fn", "cosine", "cos⁻¹"), K("tan", "tan", "fn", "tangent", "tan⁻¹"), K("pow", "^", "op", "power", "ˣ√")],
    [K("inv", "x⁻¹", "fn", "reciprocal"), K("x10", "×10ⁿ", "fn", "times ten to the power"), K("lp", "(", "fn", "open parenthesis", "%"), K("rp", ")", "fn", "close parenthesis", "▸%"), K("div", "÷", "op", "divide", "K")],
    [K("sq", "x²", "fn", "square", "√"), K("7", "7", "num", "7"), K("8", "8", "num", "8"), K("9", "9", "num", "9"), K("mul", "×", "op", "multiply")],
    [K("var", "x yzt abc", "fn", "variables x y z t a b c", "clear var"), K("4", "4", "num", "4"), K("5", "5", "num", "5"), K("6", "6", "num", "6"), K("sub", "−", "op", "subtract")],
    [K("sto", "sto→", "fn", "store", "recall"), K("1", "1", "num", "1"), K("2", "2", "num", "2"), K("3", "3", "num", "3"), K("add", "+", "op", "add")],
    [K("on", "on", "fn", "on", "off"), K("0", "0", "num", "0", "reset"), K("dot", ".", "num", "decimal point"), K("neg", "(−)", "num", "negative", "ans"), K("enter", "enter", "op", "enter")],
  ];
  const MENU_ITEMS = {
    prb: { head: "PRB", items: [{ label: "nPr", units: ["nPr"] }, { label: "nCr", units: ["nCr"] }, { label: "!", units: ["!"] }] },
    angle: { head: "DMS", items: [{ label: "°", units: ["°"] }, { label: "r", units: ["ʳ"] }] },
  };

  function createCalculator(onClose) {
    const c = { input: [], cursor: 0, history: [], angle: "DEG", second: false, hyp: false, ans: 0, vars: {}, error: null, menu: null, sel: null, lastKey: "" };
    const panel = document.createElement("div");
    panel.className = "ti";
    panel.hidden = true;
    panel.tabIndex = -1;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "false");
    panel.setAttribute("aria-label", "TI-30XS MultiView calculator");
    const keyHtml = (k) => `<div class="ti-key"><span class="ti-key__2nd">${esc(k.second || "")}</span><button type="button" class="ti-btn ti-btn--${k.tone}${k.label.length > 5 ? " ti-btn--small" : ""}" data-ti="${k.id}" aria-label="${esc(k.aria)}">${k.id === "var" ? '<span class="ti-var"><i>x</i> yzt<br>abc</span>' : esc(k.label)}</button></div>`;
    const arrow = (id, glyph, label) => `<button type="button" class="ti-arrow ti-arrow--${id}" data-ti="${id}" aria-label="${label}">${glyph}</button>`;
    panel.innerHTML = `
      <div class="ti-bar" title="Drag to move"><span>Calculator</span><button type="button" class="ti-bar__close" data-ti-close aria-label="Hide calculator">${icon("x", 15)}</button></div>
      <div class="ti-wrap"><div class="ti-body">
        <div class="ti-brand"><span>TEXAS INSTRUMENTS</span><b>TI-30XS <i>MultiView</i><sup>™</sup></b></div>
        <div class="ti-lcd-frame"><div class="ti-lcd" aria-live="polite"></div></div>
        <div class="ti-keys">${ROWS[0].map(keyHtml).join("")}<div class="ti-pad"><div class="ti-pad__ring">${arrow("up", "▲", "up")}${arrow("down", "▼", "down")}${arrow("left", "◀", "left")}${arrow("right", "▶", "right")}</div></div>${ROWS.slice(1).flat().map(keyHtml).join("")}</div>
      </div>
      <p class="ti-hint"><b>2nd</b> = green labels · <b>▲</b> then <b>enter</b> reuses a line · <b>(−)</b> for negatives</p></div>`;
    const lcd = panel.querySelector(".ti-lcd");
    const keyDefs = Object.fromEntries(ROWS.flat().map((k) => [k.id, k]));

    const historyLines = () => c.history.flatMap((e, i) => [
      { text: e.units.map(show).join(""), right: false, entry: i, units: e.units },
      { text: resultText(e), right: true, entry: i, units: null },
    ]);
    function insert(units) {
      c.error = null; c.sel = null;
      const add = c.input.length === 0 && NEEDS_LEFT.has(units[0]) && c.history.length ? ["Ans", ...units] : units;
      c.input = [...c.input.slice(0, c.cursor), ...add, ...c.input.slice(c.cursor)];
      c.cursor += add.length;
    }
    function evaluateLine() {
      let units = [...c.input];
      if (!units.length) return;
      let pct = false;
      if (units[units.length - 1] === "▸%") { pct = true; units = units.slice(0, -1); }
      let target;
      const arrowAt = units.indexOf("→");
      try {
        if (arrowAt >= 0) {
          target = units[arrowAt + 1];
          if (!target || !VARIABLES.includes(target) || arrowAt + 2 !== units.length) throw new CalcError("SYNTAX");
        }
        const exprUnits = arrowAt >= 0 ? units.slice(0, arrowAt) : units;
        const value = evaluate(exprUnits.join(""), { angle: c.angle, ans: c.ans, memory: 0, vars: c.vars });
        const view = c.input.includes("⁄") && formatFraction(value) ? "frac" : "dec";
        if (target) c.vars = { ...c.vars, [target]: value };
        c.history = [...c.history.slice(-29), { units: c.input, value, pct, view, stored: target }];
        c.ans = value; c.input = []; c.cursor = 0;
      } catch (e) {
        c.error = e instanceof CalcError ? ERROR_TEXT[e.kind] : "ERROR";
      }
    }
    function chooseMenu(m, idx) {
      if (m.kind === "prb" || m.kind === "angle") {
        const item = MENU_ITEMS[m.kind].items[idx]; if (!item) return;
        c.menu = null; insert(item.units);
      } else if (m.kind === "recall") {
        const v = VARIABLES[idx]; if (!v) return;
        c.menu = null; insert([v]);
      } else if (m.kind === "mode") { c.angle = idx === 0 ? "DEG" : "RAD"; c.menu = null; }
      else c.menu = null;
    }
    const notice = (text) => { c.menu = { kind: "notice", idx: 0, text }; };
    function toggleLast(mode) {
      if (!c.history.length) return;
      const last = c.history[c.history.length - 1];
      if (last.pct || !formatFraction(last.value)) return;
      c.history = [...c.history.slice(0, -1), { ...last, view: last.view === mode ? "dec" : mode }];
    }

    function press(id) {
      const is2nd = c.second && id !== "2nd";
      if (id !== "2nd") c.second = false;
      const prevKey = c.lastKey;
      c.lastKey = id;
      const menu = c.menu;
      if (menu) {
        if (menu.kind === "notice") { c.menu = null; return; }
        const count = menu.kind === "mode" ? 2 : menu.kind === "recall" ? VARIABLES.length : MENU_ITEMS[menu.kind].items.length;
        const horizontal = menu.kind === "mode";
        if ((id === "up" && !horizontal) || (id === "left" && horizontal)) { menu.idx = Math.max(0, menu.idx - 1); return; }
        if ((id === "down" && !horizontal) || (id === "right" && horizontal)) { menu.idx = Math.min(count - 1, menu.idx + 1); return; }
        if (id === "enter") { chooseMenu(menu, menu.idx); return; }
        if (/^[1-9]$/.test(id) && !horizontal) { chooseMenu(menu, Number(id) - 1); return; }
        if (id === "clear" || id === "mode" || id === "on") { c.menu = null; return; }
        if (id === "2nd") { c.second = !c.second; return; }
        return;
      }
      if (c.error && id !== "2nd") { c.error = null; if (id === "clear" || id === "enter") return; }
      const lines = historyLines();
      switch (id) {
        case "2nd": c.second = !c.second; return;
        case "mode": if (is2nd) { c.sel = null; return; } c.menu = { kind: "mode", idx: c.angle === "DEG" ? 0 : 1 }; return;
        case "delete": {
          if (is2nd) return;
          c.sel = null;
          if (!c.input.length) return;
          const at = c.cursor < c.input.length ? c.cursor : c.cursor - 1;
          c.input = c.input.filter((_, i) => i !== at); c.cursor = at;
          return;
        }
        case "log": insert([is2nd ? "10^(" : "log("]); return;
        case "ln": insert([is2nd ? "e^(" : "ln("]); return;
        case "prb": c.menu = { kind: is2nd ? "angle" : "prb", idx: 0 }; return;
        case "data": case "table": notice([is2nd ? "STAT" : id.toUpperCase(), "Not used in this", "exam simulator"]); return;
        case "nd": if (is2nd) toggleLast("mixed"); else insert(["⁄"]); return;
        case "toggle": toggleLast("frac"); return;
        case "clear": c.sel = null; if (c.input.length) { c.input = []; c.cursor = 0; } else c.history = []; return;
        case "pi": if (is2nd) c.hyp = !c.hyp; else insert(["π"]); return;
        case "sin": case "cos": case "tan": insert([`${id}${c.hyp ? "h" : ""}${is2nd ? "⁻¹" : ""}(`]); c.hyp = false; return;
        case "pow": insert([is2nd ? "ˣ√" : "^"]); return;
        case "inv": insert(["⁻¹"]); return;
        case "x10": insert(["×10^"]); return;
        case "lp": insert([is2nd ? "%" : "("]); return;
        case "rp": insert([is2nd ? "▸%" : ")"]); return;
        case "div": if (is2nd) { notice(["K (constant)", "Not used in this", "exam simulator"]); return; } insert(["÷"]); return;
        case "mul": insert(["×"]); return;
        case "sub": insert(["−"]); return;
        case "add": insert(["+"]); return;
        case "sq": insert([is2nd ? "√(" : "²"]); return;
        case "var": {
          if (is2nd) { c.vars = {}; notice(["CLEAR VAR", "Variables x y z t", "a b c set to 0"]); return; }
          const prev = c.input[c.cursor - 1];
          if (prevKey === "var" && prev && VARIABLES.includes(prev)) {
            const nextVar = VARIABLES[(VARIABLES.indexOf(prev) + 1) % VARIABLES.length];
            c.input = [...c.input.slice(0, c.cursor - 1), nextVar, ...c.input.slice(c.cursor)];
            return;
          }
          insert(["x"]); return;
        }
        case "sto": if (is2nd) c.menu = { kind: "recall", idx: 0 }; else insert(["→"]); return;
        case "on": if (is2nd) { onClose(); return; } c.input = []; c.cursor = 0; c.sel = null; c.hyp = false; return;
        case "0":
          if (is2nd) { Object.assign(c, { input: [], cursor: 0, history: [], vars: {}, ans: 0, angle: "DEG", hyp: false, sel: null }); notice(["RESET", "Memory cleared"]); return; }
          insert(["0"]); return;
        case "dot": insert(["."]); return;
        case "neg": insert([is2nd ? "Ans" : "⁻"]); return;
        case "enter": {
          if (c.sel !== null) {
            const line = lines[c.sel];
            if (line) {
              const units = line.units ?? [...formatNumber(c.history[line.entry].value)].map((ch) => (ch === "-" ? "⁻" : ch));
              c.sel = null;
              c.input = [...c.input.slice(0, c.cursor), ...units, ...c.input.slice(c.cursor)];
              c.cursor += units.length;
            }
            return;
          }
          evaluateLine(); return;
        }
        case "up":
          if (!lines.length) return;
          if (is2nd) { c.sel = 0; return; }
          c.sel = c.sel === null ? lines.length - 1 : Math.max(0, c.sel - 1); return;
        case "down":
          if (c.sel === null) return;
          if (is2nd) { c.sel = null; return; }
          c.sel = c.sel + 1 >= lines.length ? null : c.sel + 1; return;
        case "left": c.sel = null; c.cursor = is2nd ? 0 : Math.max(0, c.cursor - 1); return;
        case "right": c.sel = null; c.cursor = is2nd ? c.input.length : Math.min(c.input.length, c.cursor + 1); return;
        default: if (/^[0-9]$/.test(id)) insert([id]);
      }
    }

    const row = (html, cls = "") => `<div class="ti-row${cls}">${html}</div>`;
    const inv = (s, on) => (on ? `<span class="ti-inv">${s}</span>` : s);
    function render() {
      const status = `<div class="ti-status"><span${c.second ? "" : ' class="ti-hide"'}>2nd</span><span>${c.angle}</span>${c.hyp ? "<span>HYP</span>" : ""}</div>`;
      let screen = "";
      const m = c.menu;
      if (m && m.kind === "notice") {
        screen = m.text.map((t, i) => row(esc(t), i === 0 ? " ti-row--bold" : "")).join("");
      } else if (m && m.kind === "mode") {
        screen = row(["DEG", "RAD"].map((x, i) => `<span class="ti-mode${c.angle === x ? " ti-mode--on" : ""}">${inv(x, i === m.idx)}</span>`).join(""))
          + row("◂ ▸ then enter", " ti-row--dim") + row("") + row("");
      } else if (m) {
        const items = m.kind === "recall" ? VARIABLES.map((v) => ({ label: `${v}=${lcdNumber(formatNumber(c.vars[v] ?? 0))}` })) : MENU_ITEMS[m.kind].items;
        const head = m.kind === "recall" ? "RECALL VAR" : MENU_ITEMS[m.kind].head;
        const first = Math.min(Math.max(0, m.idx - 2), Math.max(0, items.length - 3));
        screen = row(`<span class="ti-inv ti-inv--pad">${head}</span>`)
          + items.slice(first, first + 3).map((it, i) => row(`${inv(`${first + i + 1}:`, first + i === m.idx)}${esc(it.label)}`)).join("")
          + Array.from({ length: Math.max(0, 3 - items.length) }, () => row("")).join("");
      } else {
        const lines = historyLines();
        const total = lines.length + 1;
        const start = c.sel === null ? Math.max(0, total - 4) : Math.min(c.sel, Math.max(0, total - 4));
        const rows = [];
        for (let i = start; i < Math.min(total, start + 4); i++) {
          if (i === lines.length) rows.push(`<div class="ti-row ti-row--input" role="group" aria-label="Current entry">${inputLine()}</div>`);
          else { const l = lines[i]; rows.push(row(inv(esc(l.text), c.sel === i), l.right ? " ti-row--right" : "")); }
        }
        while (rows.length < 4) rows.unshift(row(""));
        screen = rows.join("");
      }
      lcd.innerHTML = status + screen;
      panel.querySelectorAll("[data-ti]").forEach((b) => {
        const k = keyDefs[b.dataset.ti]; if (!k) return;
        b.setAttribute("aria-label", c.second && k.second ? k.second : k.aria);
        if (k.id === "2nd") b.classList.toggle("is-on", c.second);
      });
    }
    function inputLine() {
      if (c.error) return `<b>${c.error}</b>`;
      const parts = c.input.map(show);
      let start = c.cursor, used = 0;
      while (start > 0 && used + parts[start - 1].length <= LCD_WIDTH - 1) { used += parts[start - 1].length; start--; }
      let end = c.cursor;
      while (end < parts.length && used + parts[end].length <= LCD_WIDTH - (c.cursor === parts.length ? 1 : 0)) { used += parts[end].length; end++; }
      let h = start > 0 ? '<span class="ti-more ti-more--l">◂</span>' : "";
      h += parts.slice(start, end).map((p, i) => (start + i === c.cursor && c.sel === null ? `<span class="ti-blink ti-inv">${esc(p)}</span>` : esc(p))).join("");
      if (c.cursor === parts.length && c.sel === null) h += '<span class="ti-blink ti-caret" aria-hidden="true"></span>';
      if (end < parts.length) h += '<span class="ti-more ti-more--r">▸</span>';
      return h;
    }

    panel.addEventListener("click", (e) => {
      if (e.target.closest("[data-ti-close]")) { onClose(); return; }
      const b = e.target.closest("[data-ti]");
      if (!b) return;
      press(b.dataset.ti); render(); panel.focus({ preventScroll: true });
    });
    panel.addEventListener("keydown", (e) => {
      e.stopPropagation(); // keep exam shortcuts from firing while typing here
      const map = { Enter: "enter", "=": "enter", Backspace: "delete", Delete: "delete", ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
        "+": "add", "-": "sub", "*": "mul", x: "mul", "/": "div", "^": "pow", "(": "lp", ")": "rp", ".": "dot" };
      if (e.key === "Escape") { e.preventDefault(); if (c.menu || c.input.length || c.error) { press("clear"); render(); } else onClose(); return; }
      if (/^[0-9]$/.test(e.key)) { e.preventDefault(); press(e.key); render(); return; }
      if (e.key === "!" || e.key === "%") { e.preventDefault(); insert([e.key]); render(); return; }
      if (map[e.key]) { e.preventDefault(); press(map[e.key]); render(); }
    });

    // Drag by the title bar on larger screens; default dock is bottom-right above the exam footer.
    const bar = panel.querySelector(".ti-bar");
    let drag = null;
    bar.addEventListener("pointerdown", (e) => {
      if (window.innerWidth < 640 || e.target.closest("button")) return;
      const r = panel.getBoundingClientRect();
      drag = { dx: e.clientX - r.left, dy: e.clientY - r.top };
      bar.setPointerCapture(e.pointerId);
    });
    bar.addEventListener("pointermove", (e) => {
      if (!drag) return;
      const w = panel.offsetWidth, h = panel.offsetHeight;
      panel.style.left = Math.min(Math.max(8, e.clientX - drag.dx), window.innerWidth - w - 8) + "px";
      panel.style.top = Math.min(Math.max(8, e.clientY - drag.dy), window.innerHeight - h - 8) + "px";
      panel.style.right = "auto"; panel.style.bottom = "auto";
    });
    const endDrag = () => { drag = null; };
    bar.addEventListener("pointerup", endDrag);
    bar.addEventListener("pointercancel", endDrag);

    render();
    return {
      el: panel,
      get open() { return !panel.hidden; },
      show() { panel.hidden = false; render(); panel.focus({ preventScroll: true }); },
      hide() { panel.hidden = true; },
    };
  }

  /* =====================================================================
     Free sample workspace — same layout as the app.iparkar.com practice
     exams: top bar (navigator, calculator, full screen, countdown), question
     card with flag, Previous · Cancel · Next / Submit footer.
     ===================================================================== */
  const LETTERS = "ABCDEFGH";
  function formatClock(ms) {
    const total = Math.ceil(ms / 1000), m = Math.floor(total / 60), s = total % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  function clockLevel(ms) { return ms <= 60 * 1000 ? "critical" : ms <= 5 * 60 * 1000 ? "warning" : "normal"; }

  let x = null; // the running sample

  function start(items, opts = {}) {
    if (x) close(true);
    const minutes = opts.minutes || 15;
    x = {
      items, opts, i: 0, pick: null, filter: "all", navOpen: false, finished: false, dialog: null,
      sel: items.map(() => null), flag: items.map(() => false), checked: items.map(() => false),
      duration: minutes * 60 * 1000, t0: performance.now(), left: minutes * 60 * 1000, timer: 0, lastFocus: document.activeElement,
    };
    const root = document.createElement("div");
    root.className = "fx";
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-label", "Free sample exam");
    const canFs = !!document.documentElement.requestFullscreen;
    root.innerHTML = `
      <header class="fx-top">
        <img src="/assets/iparkar-mark-primary.svg" alt="iParkar" width="30" height="30">
        <div class="fx-top__title"><p class="fx-top__name">${opts.code ? `${esc(opts.code)} free sample` : "Free sample"} · ${items.length} questions</p><p class="fx-top__sub">Timed sample exam<span class="fx-wide"> · <span data-fx-count></span></span></p></div>
        <button type="button" class="fx-tool" data-fx="nav" aria-controls="fx-nav" aria-pressed="false">${icon("grid")}<span class="fx-md" data-fx-navlabel>Questions</span><span class="fx-sm fx-num" data-fx-navcount></span></button>
        ${opts.calculator === false ? "" : `<button type="button" class="fx-tool" data-fx="calc" aria-pressed="false">${icon("calc")}<span class="fx-md" data-fx-calclabel>Show calculator</span></button>`}
        ${canFs ? `<button type="button" class="fx-tool fx-tool--text fx-wide-btn" data-fx="fs" aria-label="Enter full screen">${icon("max", 18)}</button>` : ""}
        <div class="fx-timer" role="timer" aria-live="off" data-fx-timer></div>
      </header>
      <div class="fx-notice" role="status" hidden data-fx-notice></div>
      <div class="fx-body">
        <main class="fx-main" data-fx-main></main>
        <aside class="fx-aside" id="fx-nav" aria-label="Question navigator" hidden data-fx-aside></aside>
      </div>
      <footer class="fx-foot" data-fx-foot></footer>
      <div class="fx-drawer" hidden data-fx-drawer><div class="fx-drawer__sheet" role="dialog" aria-modal="true" aria-label="Question navigator" data-fx-drawer-sheet></div></div>
      <div class="fx-modal" hidden data-fx-modal><div class="fx-modal__box" role="alertdialog" aria-modal="true" aria-labelledby="fx-modal-title" data-fx-modal-box></div></div>`;
    document.body.appendChild(root);
    document.documentElement.classList.add("fx-open");
    x.root = root;
    x.calc = createCalculator(() => toggleCalc(false));
    root.appendChild(x.calc.el);
    root.addEventListener("click", onClick);
    root.addEventListener("change", onChange);
    root.addEventListener("dragstart", onDragStart);
    root.addEventListener("dragover", onDragOver);
    root.addEventListener("drop", onDrop);
    document.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFs);
    window.addEventListener("popstate", onPop);
    try { if (!(history.state && history.state.fx)) history.pushState({ fx: 1 }, "", location.href); } catch (e) { /* ignore */ }
    x.timer = setInterval(tick, 250);
    tick();
    draw();
  }

  const $x = (sel) => x.root.querySelector(sel);

  function tick() {
    if (!x || x.finished) return;
    x.left = Math.max(0, x.duration - (performance.now() - x.t0));
    const el = $x("[data-fx-timer]"), lvl = clockLevel(x.left);
    el.textContent = formatClock(x.left);
    el.className = `fx-timer fx-timer--${lvl}`;
    el.setAttribute("aria-label", `Time remaining ${formatClock(x.left)}`);
    el.setAttribute("aria-live", lvl === "critical" ? "assertive" : "off");
    if (x.left <= 0) { setNotice("Time is up — your answers have been submitted."); submit(); }
  }
  function setNotice(text) { const n = $x("[data-fx-notice]"); n.textContent = text || ""; n.hidden = !text; }

  function draw() {
    if (x.finished) return;
    drawQuestion(); drawNav(); drawFoot();
    $x("[data-fx-count]").textContent = `Question ${x.i + 1} of ${x.items.length}`;
    $x("[data-fx-navcount]").textContent = `${x.i + 1}/${x.items.length}`;
  }

  /* ---------- question types ----------
     Mirrors app.iparkar.com: single best answer, multiple response, pull-down,
     matching, drag-and-drop onto an exhibit and hotspot. Scoring is all-or-nothing,
     as in the LMS. Responses: index (single / pull-down), index[] (multiple response),
     region id[] (hotspot), { left: right } (matching), { item: target } (drag-and-drop). */
  const kind = (it) => it.type || "single_best_answer";
  const sameSet = (a, b) => a.length === b.length && a.every((v) => b.includes(v));
  function isCorrect(it, r) {
    if (r === null || r === undefined) return false;
    const ix = it.interaction || {};
    switch (kind(it)) {
      case "multiple_response": return sameSet(r.map((k) => LETTERS[k]), it.key);
      case "hotspot": return sameSet(r, it.key);
      case "matching": return ix.left.every((l) => r[l.id] === it.key[l.id]);
      case "enhanced_matching": return Object.keys(it.key).every((d) => it.key[d].includes(r[d]));
      default: return r === it.answer;
    }
  }
  const optText = (it, k) => `${LETTERS[k]}. ${it.options[k]}`;
  const nameOf = (list, id) => (list.find((e) => e.id === id) || {}).text || (list.find((e) => e.id === id) || {}).label || id;
  function correctText(it) {
    const ix = it.interaction || {};
    switch (kind(it)) {
      case "multiple_response": return it.key.map((l) => optText(it, LETTERS.indexOf(l))).join("; ");
      case "hotspot": return it.key.map((id) => nameOf(ix.regions, id)).join("; ");
      case "matching": return ix.left.map((l) => `${l.text} → ${nameOf(ix.right, it.key[l.id])}`).join("; ");
      case "enhanced_matching": return ix.draggables.map((d) => `${d.label} → ${nameOf(ix.targets, it.key[d.id][0])}`).join("; ");
      default: return optText(it, it.answer);
    }
  }
  function answerText(it, r) {
    if (r === null) return "No answer";
    const ix = it.interaction || {};
    switch (kind(it)) {
      case "multiple_response": return r.map((k) => optText(it, k)).join("; ");
      case "hotspot": return r.map((id) => nameOf(ix.regions, id)).join("; ");
      case "matching": return ix.left.map((l) => `${l.text} → ${r[l.id] ? nameOf(ix.right, r[l.id]) : "not matched"}`).join("; ");
      case "enhanced_matching": return ix.draggables.map((d) => `${d.label} → ${r[d.id] ? nameOf(ix.targets, r[d.id]) : "not placed"}`).join("; ");
      default: return optText(it, r);
    }
  }
  // Keep "no answer" as null so the navigator, progress and submit dialog count it correctly.
  function setResponse(r) {
    if (x.checked[x.i] || x.finished) return;
    const empty = r === null || (Array.isArray(r) ? !r.length : typeof r === "object" && !Object.values(r).some(Boolean));
    x.sel[x.i] = empty ? null : r;
    drawQuestion(); drawNav();
  }
  const pill = (ok) => ok ? '<span class="fx-pill fx-pill--ok">Correct</span>' : '<span class="fx-pill fx-pill--bad">Incorrect</span>';
  const svgSrc = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  function exhibitHtml(ex, overlay) {
    const table = ex.table ? `<details class="fx-ex__text"><summary>Text version of the exhibit</summary><div class="fx-ex__scroll"><table><thead><tr>${ex.table.headers.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${ex.table.rows.map((row) => `<tr>${row.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div></details>` : "";
    return `<figure class="fx-ex">${ex.title ? `<figcaption>${esc(ex.title)}</figcaption>` : ""}<div class="fx-ex__frame" style="aspect-ratio:${ex.width} / ${ex.height}"><img src="${svgSrc(ex.svg)}" alt="${esc(ex.alt || ex.title || "Exhibit")}" draggable="false">${overlay || ""}</div>${table}</figure>`;
  }
  const box = (c) => `left:${c[0] * 100}%;top:${c[1] * 100}%;width:${c[2] * 100}%;height:${c[3] * 100}%`;

  function bodyHtml(it, i, r, checked) {
    const ix = it.interaction || {}, t = kind(it), dis = checked ? " disabled" : "";
    if (t === "single_best_answer" || t === "multiple_response") {
      const multi = t === "multiple_response", chosen = multi ? (r || []) : [r];
      const right = (k) => multi ? it.key.includes(LETTERS[k]) : k === it.answer;
      const opts = it.options.map((o, k) => {
        const on = chosen.includes(k), ok = checked && right(k), bad = checked && on && !right(k);
        const cls = ok ? " is-correct" : bad ? " is-wrong" : on ? " is-chosen" : "";
        const input = multi ? `<input type="checkbox" class="fx-sr" data-fx-mr value="${k}"${on ? " checked" : ""}${dis}>` : `<input type="radio" class="fx-sr" name="fx-q${i}" value="${k}"${on ? " checked" : ""}${dis}>`;
        return `<li><label class="fx-opt${multi ? " fx-opt--multi" : ""}${cls}">${input}<span class="fx-opt__key" aria-hidden="true">${LETTERS[k]}</span><span class="fx-opt__text">${esc(o)}</span>${ok ? `<span class="fx-pill fx-pill--ok">${multi ? "Correct" : "Correct answer"}</span>` : bad ? '<span class="fx-pill fx-pill--bad">Your answer</span>' : ""}</label></li>`;
      }).join("");
      const need = multi && ix.select_count;
      return `<fieldset class="fx-opts"><legend class="fx-sr">Answer options${need ? `, select ${need}` : ""}</legend><ul>${opts}</ul></fieldset>${need && !checked ? `<p class="fx-count" aria-live="polite">${chosen.length} of ${need} selected${chosen.length > need ? " — that is more than the question asks for" : ""}</p>` : ""}`;
    }
    if (t === "pulldown") {
      const cls = checked ? (r === it.answer ? " is-correct" : " is-wrong") : "";
      return `<div class="fx-field"><label for="fx-pd" class="fx-field__label">Your answer for the blank</label><select id="fx-pd" class="fx-select${cls}" data-fx-pd${dis}><option value="">Select an option…</option>${it.options.map((o, k) => `<option value="${k}"${r === k ? " selected" : ""}>${esc(o)}</option>`).join("")}</select>${checked && r !== it.answer ? `<p class="fx-field__note">Correct answer: ${esc(it.options[it.answer])}</p>` : ""}</div>`;
    }
    if (t === "matching") {
      const pairs = r || {}, used = new Set(Object.values(pairs));
      const rows = ix.left.map((l, n) => {
        const ok = checked && pairs[l.id] === it.key[l.id];
        return `<li class="fx-match${checked ? (ok ? " is-correct" : " is-wrong") : ""}"><label for="fx-m-${l.id}"><b>${n + 1}.</b> ${esc(l.text)}</label><div class="fx-match__pick"><select id="fx-m-${l.id}" class="fx-select" data-fx-match="${l.id}"${dis}><option value="">${ix.right_title ? `Choose ${esc(ix.right_title.toLowerCase())}…` : "Choose…"}</option>${ix.right.map((o) => `<option value="${o.id}"${pairs[l.id] === o.id ? " selected" : ""}${!ix.options_reusable && used.has(o.id) && pairs[l.id] !== o.id ? " disabled" : ""}>${esc(o.text)}</option>`).join("")}</select>${checked ? pill(ok) : ""}</div>${checked && !ok ? `<p class="fx-field__note">Correct: ${esc(nameOf(ix.right, it.key[l.id]))}</p>` : ""}</li>`;
      }).join("");
      return `<p class="fx-count">${ix.options_reusable ? "Options can be used more than once." : "Each option can be used once."}${ix.right.length > ix.left.length ? " Some options are not used." : ""}</p><ul class="fx-matches">${rows}</ul>`;
    }
    if (t === "enhanced_matching") {
      const pl = r || {}, here = (tid) => ix.draggables.filter((d) => pl[d.id] === tid);
      const unplaced = ix.draggables.filter((d) => !pl[d.id]);
      const tray = checked ? "" : `<div class="fx-tray" aria-label="Items to place">${unplaced.map((d) => `<button type="button" class="fx-drag${x.pick === d.id ? " is-picked" : ""}" draggable="true" data-fx-pick="${d.id}" aria-pressed="${x.pick === d.id}">${esc(d.label)}</button>`).join("") || '<p class="fx-count">All items placed. Use the lists below to move one.</p>'}</div>${x.pick ? `<p class="fx-count" aria-live="polite">Now click where “${esc(nameOf(ix.draggables, x.pick))}” belongs.</p>` : ""}`;
      const overlay = ix.targets.map((tg) => `<button type="button" class="fx-drop${x.pick && !checked ? " is-armed" : ""}" style="${box(tg.coords)}" data-fx-drop="${tg.id}" tabindex="-1" aria-hidden="true"${checked || !x.pick ? " disabled" : ""}>${here(tg.id).map((d) => `<span class="fx-placed${checked ? (it.key[d.id].includes(tg.id) ? " is-correct" : " is-wrong") : ""}">${esc(d.label)}</span>`).join("")}</button>`).join("");
      const lists = ix.draggables.map((d) => {
        const ok = checked && it.key[d.id].includes(pl[d.id]);
        return `<li><label for="fx-em-${d.id}">${esc(d.label)}</label><select id="fx-em-${d.id}" class="fx-select" data-fx-em="${d.id}"${dis}><option value="">Choose a place…</option>${ix.targets.map((tg) => `<option value="${tg.id}"${pl[d.id] === tg.id ? " selected" : ""}>${esc(tg.label)}</option>`).join("")}</select>${checked ? pill(ok) : ""}</li>`;
      }).join("");
      return `${tray}${exhibitHtml(it.exhibit, overlay)}<fieldset class="fx-place"><legend>Placements</legend><ul>${lists}</ul></fieldset>`;
    }
    if (t === "hotspot") {
      const on = r || [], need = ix.select_count || 1;
      const overlay = ix.regions.map((g) => {
        const sel = on.includes(g.id), ok = checked && it.key.includes(g.id);
        const cls = checked ? (ok ? " is-correct" : sel ? " is-wrong" : "") : sel ? " is-on" : "";
        return `<button type="button" class="fx-hs${cls}" style="${box(g.coords)}" data-fx-hs="${g.id}" aria-pressed="${sel}" aria-label="Select area: ${esc(g.label)}"${dis}></button>`;
      }).join("");
      return `${exhibitHtml(it.exhibit, overlay)}<p class="fx-count" aria-live="polite">${need === 1 ? "Select one area." : `Select ${need} areas (${on.length} selected).`} Tab moves between areas; Space or Enter selects.</p>`;
    }
    return "";
  }
  // Per-option or per-part feedback from the bank, shown after Check answer.
  function feedbackHtml(it, r) {
    const fb = it.feedback, ix = it.interaction || {}, t = kind(it);
    if (!fb) return "";
    let rows = [];
    if (t === "single_best_answer" || t === "pulldown") rows = r === null ? [] : [[LETTERS[r], fb[LETTERS[r]]]];
    else if (t === "multiple_response") rows = (r || []).map((k) => [LETTERS[k], fb[LETTERS[k]]]);
    else if (t === "hotspot") rows = (r || []).map((id) => [nameOf(ix.regions, id), fb[id]]);
    else if (t === "matching") rows = ix.left.map((l) => [l.text, fb[l.id]]);
    else if (t === "enhanced_matching") rows = ix.draggables.map((d) => [d.label, fb[d.id]]);
    rows = rows.filter((x2) => x2[1]);
    return rows.length ? `<ul class="fx-fb">${rows.map(([k, v]) => `<li><b>${esc(k)}</b> ${esc(v)}</li>`).join("")}</ul>` : "";
  }

  function drawQuestion() {
    const it = x.items[x.i], i = x.i, r = x.sel[i], checked = x.checked[i], t = kind(it);
    const stem = t === "pulldown" ? esc(it.q).replace(/\[\[F1\]\]/g, `<span class="fx-blank">${r !== null ? esc(it.options[r]) : "______"}</span>` ) : esc(it.q);
    const ok = checked && isCorrect(it, r);
    $x("[data-fx-main]").innerHTML = `
      <article class="fx-card" aria-labelledby="fx-stem">
        <div class="fx-card__head"><p class="fx-card__meta">Question ${i + 1} of ${x.items.length} <span class="fx-topic">${esc(it.domain || it.topic || "")}</span></p>
          <button type="button" class="fx-flag${x.flag[i] ? " is-on" : ""}" data-fx="flag" aria-pressed="${x.flag[i]}">${icon("flag", 15, x.flag[i])}${x.flag[i] ? "Flagged for review" : "Flag for review"}</button></div>
        <div class="fx-progress" aria-hidden="true"><span style="width:${(x.sel.filter((s) => s !== null).length / x.items.length) * 100}%"></span></div>
        <h2 id="fx-stem" class="fx-stem" tabindex="-1">${stem}</h2>
        ${it.instructions ? `<p class="fx-instr">${esc(it.instructions)}</p>` : ""}
        ${bodyHtml(it, i, r, checked)}
        ${!checked ? `<button type="button" class="ip-btn ip-btn--primary fx-check" data-fx="check"${r === null ? " disabled" : ""}>Check answer</button>` : ""}
        ${checked ? `<div class="fx-feedback"><p class="fx-feedback__head">${ok ? "Correct." : "Not quite."}</p>${ok ? "" : `<p class="fx-feedback__key">Correct answer: ${esc(correctText(it))}</p>`}<p>${esc(it.explain)}</p>${feedbackHtml(it, r)}</div>` : ""}
        ${!checked && r !== null ? '<p class="fx-tip">Check your answer to see the explanation, or move on and come back to it.</p>' : ""}
      </article>`;
  }

  function navHtml(drawer) {
    const n = x.items.length, answered = x.sel.filter((s) => s !== null).length, flagged = x.flag.filter(Boolean).length;
    const list = x.items.map((_, i) => i).filter((i) => x.filter === "all" || (x.filter === "flagged" ? x.flag[i] : x.sel[i] === null));
    const tabs = [["all", "All"], ["flagged", `Flagged (${flagged})`], ["unanswered", `Unanswered (${n - answered})`]]
      .map(([k, l]) => `<button type="button" role="tab" aria-selected="${x.filter === k}" data-fx-filter="${k}">${l}</button>`).join("");
    const grid = list.length ? `<ol class="fx-grid">${list.map((i) => {
      const a = x.sel[i] !== null, label = `Question ${i + 1}: ${a ? "answered" : "unanswered"}${x.flag[i] ? ", flagged" : ""}${i === x.i ? ", current" : ""}`;
      return `<li><button type="button" class="fx-cell${a ? " is-answered" : ""}${i === x.i ? " is-current" : ""}" data-fx-go="${i}" aria-label="${label}"${i === x.i ? ' aria-current="step"' : ""}>${i + 1}${x.flag[i] ? `<span class="fx-cell__flag" aria-hidden="true">${icon("flag", 9, true)}</span>` : ""}</button></li>`;
    }).join("")}</ol>` : `<p class="fx-empty">${x.filter === "flagged" ? "No flagged questions." : "Every question has an answer."}</p>`;
    return `${drawer ? "" : `<div class="fx-aside__hide"><button type="button" class="fx-tool fx-tool--text" data-fx="nav-close" aria-label="Hide question navigator">${icon("x", 16)} Hide</button></div>`}
      <div class="fx-navcard"><div class="fx-navcard__head"><h2>Questions</h2><span>${answered}/${n} answered</span></div>
        <div class="fx-filter" role="tablist" aria-label="Filter questions">${tabs}</div>${grid}
        <ul class="fx-legend" aria-label="Legend"><li><span class="fx-key fx-key--a"></span>Answered</li><li><span class="fx-key"></span>Unanswered</li><li><span class="fx-key fx-key--f">${icon("flag", 9, true)}</span>Flagged</li><li><span class="fx-key fx-key--c"></span>Current</li></ul></div>
      <div class="fx-navsum"><p>${answered} answered · ${n - answered} unanswered · ${flagged} flagged</p><button type="button" class="ip-btn ip-btn--primary" data-fx="submit-ask">Submit sample</button></div>
      ${drawer ? '<button type="button" class="fx-tool fx-tool--text fx-drawer__close" data-fx="nav-close">Close</button>' : ""}`;
  }
  function drawNav() {
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    const aside = $x("[data-fx-aside]"), drawer = $x("[data-fx-drawer]");
    aside.hidden = !(x.navOpen && wide);
    x.root.classList.toggle("fx--nav", !aside.hidden);
    drawer.hidden = !(x.navOpen && !wide);
    if (!aside.hidden) aside.innerHTML = navHtml(false);
    if (!drawer.hidden) $x("[data-fx-drawer-sheet]").innerHTML = navHtml(true);
    const b = $x('[data-fx="nav"]');
    b.setAttribute("aria-pressed", String(x.navOpen));
    b.setAttribute("aria-label", x.navOpen ? "Hide question navigator" : "Show question navigator");
    $x("[data-fx-navlabel]").textContent = x.navOpen ? "Hide questions" : "Questions";
  }
  function drawFoot() {
    const last = x.i === x.items.length - 1;
    $x("[data-fx-foot]").innerHTML = `<div class="fx-foot__grid">
      <div><button type="button" class="fx-outline" data-fx="prev"${x.i === 0 ? " disabled" : ""} aria-label="Previous question">${icon("left", 16)}<span class="fx-wide">Previous</span></button></div>
      <div><button type="button" class="fx-tool fx-tool--text" data-fx="cancel-ask">${icon("x", 16)}Cancel</button></div>
      <div>${last ? `<button type="button" class="ip-btn ip-btn--primary fx-submit" data-fx="submit-ask">${icon("send", 16)}Submit<span class="fx-wide"> sample</span></button>`
        : `<button type="button" class="fx-outline" data-fx="next" aria-label="Next question"><span class="fx-wide">Next</span>${icon("right", 16)}</button>`}</div></div>`;
  }

  function go(i) {
    const n = Math.max(0, Math.min(x.items.length - 1, i));
    if (n === x.i) return;
    x.i = n; x.pick = null; draw();
    $x("#fx-stem")?.focus({ preventScroll: true });
    $x("[data-fx-main]").scrollTop = 0;
  }
  function choose(k) {
    if (x.checked[x.i] || x.finished || kind(x.items[x.i]) !== "single_best_answer") return;
    x.sel[x.i] = k; drawQuestion(); drawNav();
    $x(`input[name="fx-q${x.i}"][value="${k}"]`)?.focus({ preventScroll: true });
  }
  function toggleCalc(on) {
    if (!$x('[data-fx="calc"]')) return;
    const open = on ?? !x.calc.open;
    open ? x.calc.show() : x.calc.hide();
    const b = $x('[data-fx="calc"]');
    b.setAttribute("aria-pressed", String(open));
    $x("[data-fx-calclabel]").textContent = open ? "Hide calculator" : "Show calculator";
    if (!open) b.focus({ preventScroll: true });
  }

  function modal(html) {
    x.dialog = true;
    const m = $x("[data-fx-modal]"), box = $x("[data-fx-modal-box]");
    box.innerHTML = html; m.hidden = false;
    box.querySelector("[data-fx-default]")?.focus();
  }
  function closeModal() { x.dialog = null; $x("[data-fx-modal]").hidden = true; }
  function askSubmit() {
    x.navOpen = false; drawNav();
    const n = x.items.length, un = x.items.map((_, i) => i).filter((i) => x.sel[i] === null), fl = x.items.map((_, i) => i).filter((i) => x.flag[i]);
    const jump = (arr) => arr.map((i) => `<button type="button" class="fx-chip" data-fx-go="${i}">${i + 1}</button>`).join("");
    modal(`<h2 id="fx-modal-title">Submit your sample?</h2>
      <p>${n - un.length} of ${n} questions answered · ${fl.length} flagged.</p>
      ${un.length ? `<p class="fx-modal__warn">Unanswered questions are marked wrong.</p><p class="fx-modal__label">Unanswered</p><div class="fx-chips">${jump(un)}</div>` : ""}
      ${fl.length ? `<p class="fx-modal__label">Flagged for review</p><div class="fx-chips">${jump(fl)}</div>` : ""}
      <div class="fx-modal__actions"><button type="button" class="fx-tool fx-tool--text" data-fx="modal-close">Return to questions</button><button type="button" class="ip-btn ip-btn--primary" data-fx="submit" data-fx-default>Submit sample</button></div>`);
  }
  function askCancel() {
    const a = x.sel.filter((s) => s !== null).length;
    modal(`<h2 id="fx-modal-title">Cancel this sample?</h2>
      <p>${a ? `Your ${a} answer${a === 1 ? "" : "s"} will be discarded and not scored.` : "Nothing has been answered yet."} You can start the sample again any time.</p>
      <div class="fx-modal__actions"><button type="button" class="fx-tool fx-tool--text" data-fx="modal-close" data-fx-default>Keep going</button><button type="button" class="ip-btn fx-danger" data-fx="cancel">Cancel sample</button></div>`);
  }

  function submit() {
    if (!x || x.finished) return;
    x.finished = true;
    clearInterval(x.timer);
    closeModal();
    x.navOpen = false; drawNav();
    toggleCalc(false);
    const n = x.items.length, used = Math.min(x.duration, performance.now() - x.t0);
    const score = x.items.reduce((s, it, i) => s + (isCorrect(it, x.sel[i]) ? 1 : 0), 0);
    if (x.opts.onScore) x.opts.onScore(score);
    const t = $x("[data-fx-timer]"); t.textContent = "Finished"; t.className = "fx-timer fx-timer--done"; t.removeAttribute("aria-label");
    $x("[data-fx-count]").textContent = "Results";
    x.root.querySelectorAll('[data-fx="nav"],[data-fx="calc"]').forEach((b) => { b.hidden = true; });
    $x("[data-fx-main]").innerHTML = `
      <article class="fx-card fx-result" aria-labelledby="fx-result-title">
        <p class="eyebrow">Your score</p>
        <h2 id="fx-result-title" class="fx-result__num" tabindex="-1">${score}/${n}</h2>
        <p class="fx-result__msg">${score / n >= 0.7 ? "Strong result — keep the momentum with full timed mocks." : "Good start. Review the explanations and try another set."}</p>
        <p class="fx-result__time">Time used ${formatClock(used)} of ${formatClock(x.duration)}</p>
        <ol class="fx-review">${x.items.map((it, i) => {
          const s = x.sel[i], ok = isCorrect(it, s);
          return `<li class="fx-review__item"><details${ok ? "" : " open"}><summary><span class="fx-pill ${ok ? "fx-pill--ok" : "fx-pill--bad"}">${ok ? "Correct" : s === null ? "Unanswered" : "Missed"}</span><span class="fx-review__q"><b>${i + 1}.</b> ${esc(it.q.replace(/\[\[F1\]\]/g, "______"))}</span></summary>
            <p class="fx-review__ans">${s === null ? "No answer" : `Your answer: ${esc(answerText(it, s))}`}${ok ? "" : `<br>Correct answer: ${esc(correctText(it))}`}</p>
            <p class="fx-review__exp">${esc(it.explain)}</p></details></li>`;
        }).join("")}</ol>
      </article>`;
    $x("[data-fx-foot]").innerHTML = `<div class="fx-foot__row">
      <button type="button" class="fx-tool fx-tool--text" data-fx="close">${icon("x", 16)}Close</button>
      <button type="button" class="ip-btn ip-btn--ghost" data-fx="plans">See premium plans</button>
      <button type="button" class="ip-btn ip-btn--primary" data-fx="again">Try again</button></div>`;
    $x("[data-fx-main]").scrollTop = 0;
    $x("#fx-result-title").focus({ preventScroll: true });
  }

  function close(silent) {
    if (!x) return;
    const s = x;
    clearInterval(s.timer);
    document.removeEventListener("keydown", onKey);
    document.removeEventListener("fullscreenchange", onFs);
    window.removeEventListener("popstate", onPop);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    s.root.remove();
    document.documentElement.classList.remove("fx-open");
    x = null;
    if (!silent) {
      try { if (history.state && history.state.fx) history.back(); } catch (e) { /* ignore */ }
      if (s.lastFocus && s.lastFocus.focus) s.lastFocus.focus({ preventScroll: true });
    }
  }

  function onClick(e) {
    const goBtn = e.target.closest("[data-fx-go]");
    if (goBtn) { const i = Number(goBtn.dataset.fxGo); closeModal(); if (!window.matchMedia("(min-width: 1024px)").matches) x.navOpen = false; go(i); drawNav(); return; }
    const f = e.target.closest("[data-fx-filter]");
    if (f) { x.filter = f.dataset.fxFilter; drawNav(); return; }
    if (e.target.matches("[data-fx-drawer]")) { x.navOpen = false; drawNav(); return; }
    if (e.target.matches("[data-fx-modal]") && !x.finished) { closeModal(); return; }
    const hs = e.target.closest("[data-fx-hs]");
    if (hs) { toggleRegion(hs.dataset.fxHs); return; }
    const pk = e.target.closest("[data-fx-pick]");
    if (pk) { x.pick = x.pick === pk.dataset.fxPick ? null : pk.dataset.fxPick; drawQuestion(); return; }
    const dp = e.target.closest("[data-fx-drop]");
    if (dp) { if (x.pick) place(x.pick, dp.dataset.fxDrop); return; }
    const b = e.target.closest("[data-fx]");
    if (!b) return;
    const a = b.dataset.fx, opts = x.opts;
    if (a === "nav") { x.navOpen = !x.navOpen; drawNav(); }
    else if (a === "nav-close") { x.navOpen = false; drawNav(); $x('[data-fx="nav"]').focus(); }
    else if (a === "calc") toggleCalc();
    else if (a === "fs") { (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => {}); }
    else if (a === "flag") { x.flag[x.i] = !x.flag[x.i]; drawQuestion(); drawNav(); $x('[data-fx="flag"]').focus(); }
    else if (a === "check") { if (x.sel[x.i] !== null) { x.checked[x.i] = true; drawQuestion(); $x(".fx-feedback")?.scrollIntoView({ block: "nearest" }); } }
    else if (a === "prev") go(x.i - 1);
    else if (a === "next") go(x.i + 1);
    else if (a === "submit-ask") askSubmit();
    else if (a === "submit") submit();
    else if (a === "cancel-ask") askCancel();
    else if (a === "modal-close") closeModal();
    else if (a === "cancel" || a === "close") close();
    else if (a === "plans") { close(); if (opts.onPlans) opts.onPlans(); }
    else if (a === "again") { close(true); if (opts.onAgain) opts.onAgain(); }
  }
  function toggleRegion(id) {
    const it = x.items[x.i], need = (it.interaction && it.interaction.select_count) || 1, cur = x.sel[x.i] || [];
    const next = need === 1 ? (cur.includes(id) ? [] : [id]) : cur.includes(id) ? cur.filter((v) => v !== id) : it.interaction.regions.map((g) => g.id).filter((g) => g === id || cur.includes(g));
    setResponse(next);
    x.root.querySelector(`[data-fx-hs="${id}"]`)?.focus({ preventScroll: true });
  }
  function place(d, t) {
    const it = x.items[x.i], ix = it.interaction, next = { ...(x.sel[x.i] || {}) };
    if (!t) delete next[d];
    else { if (!ix.targets_reusable) for (const k of Object.keys(next)) if (next[k] === t && k !== d) delete next[k]; next[d] = t; }
    x.pick = null;
    setResponse(next);
  }
  function onDragStart(e) {
    const pk = e.target.closest && e.target.closest("[data-fx-pick]");
    if (!pk) return;
    e.dataTransfer.setData("text/plain", pk.dataset.fxPick);
    x.pick = pk.dataset.fxPick;
    x.root.querySelectorAll("[data-fx-drop]").forEach((el) => { el.disabled = false; el.classList.add("is-armed"); });
  }
  function onDragOver(e) { if (e.target.closest && e.target.closest("[data-fx-drop]")) e.preventDefault(); }
  function onDrop(e) {
    const dp = e.target.closest && e.target.closest("[data-fx-drop]");
    if (!dp) return;
    e.preventDefault();
    const d = e.dataTransfer.getData("text/plain") || x.pick;
    if (d) place(d, dp.dataset.fxDrop);
  }
  function onChange(e) {
    const el = e.target;
    if (el.matches('input[type="radio"][name^="fx-q"]')) { choose(Number(el.value)); return; }
    if (el.matches("[data-fx-mr]")) { setResponse([...x.root.querySelectorAll("[data-fx-mr]:checked")].map((c) => Number(c.value))); x.root.querySelector(`[data-fx-mr][value="${el.value}"]`)?.focus({ preventScroll: true }); return; }
    if (el.matches("[data-fx-pd]")) { setResponse(el.value === "" ? null : Number(el.value)); $x("[data-fx-pd]")?.focus({ preventScroll: true }); return; }
    if (el.matches("[data-fx-match]")) { const id = el.dataset.fxMatch; setResponse({ ...(x.sel[x.i] || {}), [id]: el.value }); $x(`[data-fx-match="${id}"]`)?.focus({ preventScroll: true }); return; }
    if (el.matches("[data-fx-em]")) { const id = el.dataset.fxEm; place(id, el.value || null); $x(`[data-fx-em="${id}"]`)?.focus({ preventScroll: true }); return; }
  }
  function onKey(e) {
    if (!x) return;
    const t = e.target;
    if (e.key === "Escape") {
      if (x.dialog && !x.finished) { e.preventDefault(); closeModal(); return; }
      if (x.navOpen) { e.preventDefault(); x.navOpen = false; drawNav(); return; }
      return;
    }
    if (e.key === "Tab") { trapFocus(e); return; }
    if (x.finished || x.dialog || x.navOpen && !window.matchMedia("(min-width: 1024px)").matches) return;
    if (t.closest(".ti") || ["INPUT", "SELECT", "TEXTAREA"].includes(t.tagName) && t.type !== "radio" || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase(), it = x.items[x.i];
    const idx = "abcdefgh".indexOf(k) >= 0 ? "abcdefgh".indexOf(k) : "12345678".indexOf(k);
    if (idx >= 0 && kind(it) === "single_best_answer" && idx < it.options.length) { e.preventDefault(); choose(idx); }
    else if (k === "arrowright" || k === "n") { e.preventDefault(); go(x.i + 1); }
    else if (k === "arrowleft" || k === "p") { e.preventDefault(); go(x.i - 1); }
    else if (k === "f") { e.preventDefault(); x.flag[x.i] = !x.flag[x.i]; drawQuestion(); drawNav(); }
  }
  function trapFocus(e) {
    const scope = !$x("[data-fx-modal]").hidden ? $x("[data-fx-modal-box]") : x.root;
    const f = [...scope.querySelectorAll('button:not([disabled]):not([tabindex="-1"]), input:not([disabled]), select:not([disabled]), summary, [tabindex="-1"]#fx-stem')].filter((el) => el.offsetParent !== null || el === document.activeElement);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (!scope.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function onFs() {
    const b = x && $x('[data-fx="fs"]');
    if (!b) return;
    const on = !!document.fullscreenElement;
    b.innerHTML = icon(on ? "min" : "max", 18);
    b.setAttribute("aria-label", on ? "Exit full screen" : "Enter full screen");
  }
  // Browser Back asks before leaving instead of silently dropping the sample.
  function onPop() {
    if (!x) return;
    if (x.finished) { close(true); return; }
    try { history.pushState({ fx: 1 }, "", location.href); } catch (e) { /* ignore */ }
    askCancel();
  }
  window.addEventListener("resize", () => { if (x && !x.finished && x.navOpen) drawNav(); });

  window.IP_FREE_EXAM = { start, close: () => close() };
})();
