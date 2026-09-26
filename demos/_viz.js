// demos/_viz.js — shared chart + control helpers for every demo (Options Path v3).
// Colours come only from CSS classes in styles.css, so demos match the brand and never hard-code hex:
//   series strokes .s0–.s5 · fills .f0–.f5 · area .area0/.area1 · legend swatches .c0–.c5
//   0 brand blue · 1 violet · 2 red · 3 green · 4 bitcoin orange · 5 ink/grey
import { tex } from "../math.js?v=1";
import { netPL, netPLAt, payoffStats } from "./_opt.js";
export { tex };

export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
export const tr = (lang) => (zh, en) => (lang === "en" ? en : zh);

// compact number formatting for axes: 1234 → "1.23k"
export function fmt(v, digits = 3) {
  if (!isFinite(v)) return String(v);
  const a = Math.abs(v);
  if (a === 0) return "0";
  const units = [[1e12, "T"], [1e9, "B"], [1e6, "M"], [1e3, "k"]];
  for (const [u, s] of units) if (a >= u) return +(v / u).toPrecision(digits) + s;
  if (a >= 1) return String(+v.toPrecision(Math.max(digits, Math.ceil(Math.log10(a + 1)))));
  if (a >= 1e-4) return String(+v.toPrecision(digits));
  return v.toExponential(2);
}
// number → LaTeX (9.54e-7 → 9.54 \times 10^{-7}); use inside tex()
export function texNum(v, digits = 3) {
  if (!isFinite(v)) return String(v);
  const a = Math.abs(v);
  if (a !== 0 && (a < 1e-3 || a >= 1e6)) { const [m, e] = v.toExponential(digits - 1).split("e"); return `${+m} \\times 10^{${+e}}`; }
  return String(+v.toPrecision(digits));
}

function ticks(lo, hi, n = 5) {
  const span = hi - lo || 1, step0 = span / n, mag = 10 ** Math.floor(Math.log10(step0));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= n + 0.5) || step0;
  const out = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi + step * 1e-9; v += step) out.push(+v.toPrecision(12));
  return out;
}
let uidN = 0;
const uid = (p) => `${p}${++uidN}${Math.random().toString(36).slice(2, 6)}`;

/**
 * Line chart.
 * o = { series: [{ points:[[x,y]…] | f:(x)=>y, cls:0-5, label, dashed, area, dots, dotsOnly, r }],
 *       xmin, xmax, ymin, ymax (auto if omitted), logY, W, H, xlabel, ylabel, xfmt, yfmt, xstep, xticks,
 *       markers:[{x, label}], hlines:[{y, label}], points:[{x, y, label, cls}], bands:[{x0, x1, cls, label}], samples }
 * → HTML string <div class="chart">…</div>
 */
export function lineChart(o) {
  const W = o.W || 600, H = o.H || 280, mL = 54, mR = 16, mT = 18, mB = o.xlabel ? 42 : 28;
  const N = o.samples || 160;
  const series = o.series.map((s) => {
    let pts = s.points;
    if (!pts && s.f) { pts = []; for (let i = 0; i <= N; i++) { const x = o.xmin + (o.xmax - o.xmin) * (i / N); pts.push([x, s.f(x)]); } }
    return { ...s, pts: (pts || []).filter(([x, y]) => isFinite(x) && isFinite(y) && (!o.logY || y > 0)) };
  });
  const xs = series.flatMap((s) => s.pts.map((p) => p[0])), ys = series.flatMap((s) => s.pts.map((p) => p[1]));
  let xmin = o.xmin ?? Math.min(...xs), xmax = o.xmax ?? Math.max(...xs);
  let ymin = o.ymin ?? Math.min(...ys, ...(o.hlines || []).map((h) => h.y)), ymax = o.ymax ?? Math.max(...ys, ...(o.hlines || []).map((h) => h.y));
  if (!isFinite(ymin) || !isFinite(ymax)) { ymin = 0; ymax = 1; }
  if (xmin === xmax) xmax = xmin + 1;
  if (o.logY) { ymin = Math.log10(Math.max(ymin, 1e-300)); ymax = Math.log10(ymax); }
  if (ymin === ymax) { ymin -= 1; ymax += 1; }
  if (o.ymin == null && !o.logY) { const pad = (ymax - ymin) * 0.08; ymax += pad; if (ymin !== 0) ymin -= pad; }
  else if (o.ymax == null && !o.logY) ymax += (ymax - ymin) * 0.06;
  const X = (x) => mL + ((x - xmin) / (xmax - xmin)) * (W - mL - mR);
  const Y = (y) => { const v = o.logY ? Math.log10(y) : y; return H - mB - ((v - ymin) / (ymax - ymin)) * (H - mT - mB); };
  const xf = o.xfmt || ((v) => fmt(v)), yf = o.yfmt || ((v) => fmt(v));
  let g = "";
  for (const b of o.bands || []) g += `<rect class="band${b.cls ?? 0}" x="${X(Math.max(b.x0, xmin))}" y="${mT}" width="${Math.max(0, X(Math.min(b.x1, xmax)) - X(Math.max(b.x0, xmin)))}" height="${H - mT - mB}"/>${b.label ? `<text class="lbl" x="${(X(Math.max(b.x0, xmin)) + X(Math.min(b.x1, xmax))) / 2}" y="${mT + 12}" text-anchor="middle">${esc(b.label)}</text>` : ""}`;
  const xt = o.xstep ? Array.from({ length: Math.floor((xmax - xmin) / o.xstep + 1e-9) + 1 }, (_, i) => xmin + i * o.xstep) : ticks(xmin, xmax, o.xticks || 6);
  for (const t of xt) g += `<line class="grid" x1="${X(t)}" y1="${mT}" x2="${X(t)}" y2="${H - mB}"/><text class="lbl-axis" x="${X(t)}" y="${H - mB + 15}" text-anchor="middle">${esc(xf(t))}</text>`;
  const yt = o.logY ? Array.from({ length: Math.floor(ymax) - Math.ceil(ymin) + 1 }, (_, i) => 10 ** (Math.ceil(ymin) + i)) : ticks(ymin, ymax, 5);
  yt.forEach((t) => { g += `<line class="grid" x1="${mL}" y1="${Y(t)}" x2="${W - mR}" y2="${Y(t)}"/><text class="lbl-axis" x="${mL - 6}" y="${Y(t) + 4}" text-anchor="end">${esc(yf(t))}</text>`; });
  g += `<line class="axis" x1="${mL}" y1="${H - mB}" x2="${W - mR}" y2="${H - mB}"/><line class="axis" x1="${mL}" y1="${mT}" x2="${mL}" y2="${H - mB}"/>`;
  if (!o.logY && ymin < 0 && ymax > 0) g += `<line class="zero" x1="${mL}" y1="${Y(0)}" x2="${W - mR}" y2="${Y(0)}"/>`;
  for (const h of o.hlines || []) g += `<line class="marker" x1="${mL}" y1="${Y(h.y)}" x2="${W - mR}" y2="${Y(h.y)}"/>${h.label ? `<text class="lbl" x="${W - mR - 4}" y="${Y(h.y) - 5}" text-anchor="end">${esc(h.label)}</text>` : ""}`;
  for (const m of o.markers || []) if (m.x >= xmin && m.x <= xmax) g += `<line class="marker" x1="${X(m.x)}" y1="${mT}" x2="${X(m.x)}" y2="${H - mB}"/>${m.label ? `<text class="lbl" x="${X(m.x) + 4}" y="${mT + 11}">${esc(m.label)}</text>` : ""}`;
  const clip = uid("clip");
  g += `<clipPath id="${clip}"><rect x="${mL}" y="${mT - 4}" width="${W - mL - mR}" height="${H - mT - mB + 8}"/></clipPath><g clip-path="url(#${clip})">`;
  for (const s of series) {
    if (!s.pts.length) continue;
    const d = s.pts.map(([x, y]) => `${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join(" ");
    const c = s.cls ?? 0;
    if (s.area) { const base = !o.logY && ymin < 0 && ymax > 0 ? Y(0) : H - mB; g += `<polygon class="area${c % 2}" points="${X(s.pts[0][0])},${base} ${d} ${X(s.pts[s.pts.length - 1][0])},${base}"/>`; }
    if (!s.dotsOnly) g += `<polyline class="s${c}" points="${d}"${s.dashed ? ' stroke-dasharray="6 4"' : ""}/>`;
    if (s.dots || s.dotsOnly) g += s.pts.map(([x, y]) => `<circle class="f${c}" cx="${X(x).toFixed(1)}" cy="${Y(y).toFixed(1)}" r="${s.r || 3}"/>`).join("");
  }
  g += `</g>`;
  for (const p of o.points || []) if (isFinite(p.y)) {
    const right = X(p.x) > mL + (W - mL - mR) * 0.75; // near the right edge: label to the left so it can't clip
    g += `<circle class="f${p.cls ?? 0} dot-ring" cx="${X(p.x)}" cy="${Y(p.y)}" r="5"/>${p.label ? `<text class="lbl" x="${X(p.x) + (right ? -8 : 8)}" y="${Y(p.y) - 8}" text-anchor="${right ? "end" : "start"}">${esc(p.label)}</text>` : ""}`;
  }
  if (o.xlabel) g += `<text class="lbl-axis" x="${(mL + W - mR) / 2}" y="${H - 6}" text-anchor="middle">${esc(o.xlabel)}</text>`;
  if (o.ylabel) g += `<text class="lbl-axis" x="12" y="${(mT + H - mB) / 2}" text-anchor="middle" transform="rotate(-90 12 ${(mT + H - mB) / 2})">${esc(o.ylabel)}</text>`;
  const legend = series.filter((s) => s.label).map((s) => `<span><i class="c${s.cls ?? 0}${s.dashed ? " dashed" : ""}"></i>${esc(s.label)}</span>`).join("");
  return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img">${g}</svg>${legend ? `<div class="chart-legend">${legend}</div>` : ""}</div>`;
}

/** Bar chart / histogram. o = { bars:[{label, value, cls}], W, H, yfmt, xlabel, highlight, ymax, ymin } (negative values allowed) */
export function barChart(o) {
  const W = o.W || 600, H = o.H || 240, mL = 50, mR = 10, mT = 14, mB = o.xlabel ? 44 : 34;
  const n = o.bars.length, vals = o.bars.map((b) => b.value);
  const max = o.ymax ?? Math.max(...vals, 0), min = o.ymin ?? Math.min(...vals, 0);
  const span = max - min || 1, bw = (W - mL - mR) / n;
  const Y = (v) => H - mB - ((v - min) / span) * (H - mT - mB), yf = o.yfmt || ((v) => fmt(v));
  let g = "";
  for (const t of ticks(min, max, 4)) g += `<line class="grid" x1="${mL}" y1="${Y(t)}" x2="${W - mR}" y2="${Y(t)}"/><text class="lbl-axis" x="${mL - 6}" y="${Y(t) + 4}" text-anchor="end">${esc(yf(t))}</text>`;
  const every = Math.max(1, Math.ceil(n / 14));
  o.bars.forEach((b, i) => {
    const x = mL + i * bw + bw * 0.12, y0 = Y(Math.max(0, min)), y1 = Y(b.value);
    const top = Math.min(y0, y1), h = Math.abs(y1 - y0);
    g += `<rect class="f${b.cls ?? (i === o.highlight ? 0 : b.value < 0 ? 2 : 1)}" x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${(bw * 0.76).toFixed(1)}" height="${h.toFixed(1)}" rx="2"><title>${esc(b.label)}: ${esc(yf(b.value))}</title></rect>`;
    if (i % every === 0) g += `<text class="lbl-axis" x="${(x + bw * 0.38).toFixed(1)}" y="${H - mB + 14}" text-anchor="middle">${esc(b.label)}</text>`;
  });
  if (min < 0 && max > 0) g += `<line class="zero" x1="${mL}" y1="${Y(0)}" x2="${W - mR}" y2="${Y(0)}"/>`;
  g += `<line class="axis" x1="${mL}" y1="${H - mB}" x2="${W - mR}" y2="${H - mB}"/>`;
  if (o.xlabel) g += `<text class="lbl-axis" x="${(mL + W - mR) / 2}" y="${H - 6}" text-anchor="middle">${esc(o.xlabel)}</text>`;
  return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img">${g}</svg></div>`;
}

/**
 * Payoff (P&L) chart for an options position: expiry P&L with green profit / red loss shading,
 * optional "today" curve (mark-to-model before expiry), strikes, breakevens and spot marker.
 * o = { legs, lo, hi, spot, today:{elapsed, sigma, r, q} | null, mult (default 1; use 100 for per-contract $),
 *       W, H, xlabel, ylabel, labels:{expiry, today, spot, be}, extra:[{f, cls, label, dashed}] }
 * → { html, stats }
 */
export function payoffChart(o) {
  const W = o.W || 600, H = o.H || 290, mL = 58, mR = 16, mT = 16, mB = 42;
  const { legs, lo, hi } = o, mult = o.mult || 1, N = 240;
  const xs = Array.from({ length: N + 1 }, (_, i) => lo + ((hi - lo) * i) / N);
  const exp = xs.map((x) => netPL(legs, x) * mult);
  const tod = o.today ? xs.map((x) => netPLAt(legs, x, o.today) * mult) : null;
  const extras = (o.extra || []).map((e) => ({ ...e, ys: xs.map((x) => e.f(x)) }));
  let ymin = Math.min(...exp, ...(tod || []), ...extras.flatMap((e) => e.ys)), ymax = Math.max(...exp, ...(tod || []), ...extras.flatMap((e) => e.ys));
  if (ymin === ymax) { ymin -= 1; ymax += 1; }
  const pad = (ymax - ymin) * 0.14; ymin -= pad; ymax += pad;
  if (ymin > 0) ymin = -pad; if (ymax < 0) ymax = pad;
  const X = (x) => mL + ((x - lo) / (hi - lo)) * (W - mL - mR);
  const Y = (y) => H - mB - ((y - ymin) / (ymax - ymin)) * (H - mT - mB);
  const zy = Y(0), id = uid("pf");
  const pts = xs.map((x, i) => `${X(x).toFixed(1)},${Y(exp[i]).toFixed(1)}`);
  const area = `M ${X(lo).toFixed(1)},${zy.toFixed(1)} L ${pts.join(" L ")} L ${X(hi).toFixed(1)},${zy.toFixed(1)} Z`;
  let g = `<defs><clipPath id="${id}u"><rect x="${mL}" y="${mT}" width="${W - mL - mR}" height="${Math.max(0, zy - mT)}"/></clipPath><clipPath id="${id}d"><rect x="${mL}" y="${zy}" width="${W - mL - mR}" height="${Math.max(0, H - mB - zy)}"/></clipPath></defs>`;
  for (const t of ticks(lo, hi, 6)) g += `<line class="grid" x1="${X(t)}" y1="${mT}" x2="${X(t)}" y2="${H - mB}"/><text class="lbl-axis" x="${X(t)}" y="${H - mB + 15}" text-anchor="middle">${fmt(t)}</text>`;
  for (const t of ticks(ymin, ymax, 5)) g += `<line class="grid" x1="${mL}" y1="${Y(t)}" x2="${W - mR}" y2="${Y(t)}"/><text class="lbl-axis" x="${mL - 6}" y="${Y(t) + 4}" text-anchor="end">${fmt(t)}</text>`;
  g += `<path d="${area}" class="pf-profit" clip-path="url(#${id}u)"/><path d="${area}" class="pf-loss" clip-path="url(#${id}d)"/>`;
  g += `<line class="zero" x1="${mL}" y1="${zy}" x2="${W - mR}" y2="${zy}"/><line class="axis" x1="${mL}" y1="${H - mB}" x2="${W - mR}" y2="${H - mB}"/>`;
  const strikes = [...new Set(legs.filter((l) => l.K != null).map((l) => l.K))];
  for (const k of strikes) if (k > lo && k < hi) g += `<line class="pf-strike" x1="${X(k)}" y1="${mT}" x2="${X(k)}" y2="${H - mB}"/><text class="lbl-sm" x="${X(k)}" y="${H - mB - 4}" text-anchor="middle">K=${fmt(k)}</text>`;
  for (const e of extras) g += `<polyline class="s${e.cls ?? 5}" points="${xs.map((x, i) => `${X(x).toFixed(1)},${Y(e.ys[i]).toFixed(1)}`).join(" ")}"${e.dashed ? ' stroke-dasharray="6 4"' : ""}/>`;
  if (tod) g += `<polyline class="pf-today" points="${xs.map((x, i) => `${X(x).toFixed(1)},${Y(tod[i]).toFixed(1)}`).join(" ")}"/>`;
  g += `<polyline class="pf-line" points="${pts.join(" ")}"/>`;
  const stats = payoffStats(legs, Math.max(0, lo - (hi - lo)), hi + (hi - lo));
  // breakeven labels sit on the empty side of the crossing: up-left of a rising line, up-right of a falling one
  for (const b of stats.breakevens) if (b > lo && b < hi) {
    const rising = netPL(legs, b + (hi - lo) * 0.01) > netPL(legs, b - (hi - lo) * 0.01);
    g += `<circle class="pf-be" cx="${X(b)}" cy="${zy}" r="4.5"/><text class="lbl" x="${X(b) + (rising ? -8 : 8)}" y="${zy - 9}" text-anchor="${rising ? "end" : "start"}">${(o.labels && o.labels.be) || "BE"} ${fmt(b, 4)}</text>`;
  }
  if (o.spot != null && o.spot > lo && o.spot < hi) g += `<line class="pf-spot" x1="${X(o.spot)}" y1="${mT}" x2="${X(o.spot)}" y2="${H - mB}"/><text class="lbl" x="${X(o.spot) + 4}" y="${mT + 11}">${esc((o.labels && o.labels.spot) || "S")}</text>`;
  if (o.xlabel) g += `<text class="lbl-axis" x="${(mL + W - mR) / 2}" y="${H - 6}" text-anchor="middle">${esc(o.xlabel)}</text>`;
  if (o.ylabel) g += `<text class="lbl-axis" x="13" y="${(mT + H - mB) / 2}" text-anchor="middle" transform="rotate(-90 13 ${(mT + H - mB) / 2})">${esc(o.ylabel)}</text>`;
  const lab = o.labels || {};
  const legend = `<div class="chart-legend"><span><i class="pf-key-line"></i>${esc(lab.expiry || "At expiry")}</span>${tod ? `<span><i class="pf-key-today"></i>${esc(lab.today || "Today")}</span>` : ""}${extras.filter((e) => e.label).map((e) => `<span><i class="c${e.cls ?? 5}${e.dashed ? " dashed" : ""}"></i>${esc(e.label)}</span>`).join("")}</div>`;
  return { html: `<div class="chart payoff"><svg viewBox="0 0 ${W} ${H}" role="img">${g}</svg>${legend}</div>`, stats };
}

/* ---------------- controls ---------------- */
/** Segmented control: returns HTML; wire with onSeg(root, name, cb) */
export const seg = (name, options, active) =>
  `<div class="demo-seg" data-seg="${name}">${options.map(([v, label]) => `<button type="button" data-v="${esc(v)}" class="${String(v) === String(active) ? "on" : ""}">${label}</button>`).join("")}</div>`;
export function onSeg(root, name, cb) {
  const box = root.querySelector(`[data-seg="${name}"]`);
  box.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    box.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
    cb(b.dataset.v);
  });
}
/** Slider: label + live value <b id="{id}-v">. Read with root.querySelector('#id').value */
export const slider = (id, label, min, max, step, value) =>
  `<div class="demo-field"><label class="demo-label" for="${id}">${label}: <b id="${id}-v"></b></label><input class="demo-slider" id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"></div>`;
/**
 * Wire a group of sliders: spec = { id: [formatter] }. Calls update(values) on every input with numeric values.
 * Returns a function that re-runs update. Example: bindSliders(root, { "bs-s": (v) => "$" + v }, (v) => draw(v))
 */
export function bindSliders(root, spec, update) {
  const run = () => {
    const vals = {};
    for (const id of Object.keys(spec)) {
      const el = root.querySelector("#" + id); if (!el) continue;
      vals[id] = +el.value;
      const out = root.querySelector(`#${id}-v`); if (out) out.textContent = spec[id] ? spec[id](+el.value) : el.value;
    }
    update(vals);
  };
  for (const id of Object.keys(spec)) root.querySelector("#" + id)?.addEventListener("input", run);
  run();
  return run;
}
/** Stat tiles: items = [[label, value, cls?]] (cls: "pos" | "neg" | "acc") */
export const stats = (items) => `<div class="stat-row">${items.map(([k, v, c]) => `<div class="stat"><div class="k">${k}</div><div class="v${c ? " " + c : ""}">${v}</div></div>`).join("")}</div>`;
/** Legend-free explanation line with inline math */
export const mathLine = (latex) => `<div class="demo-math">${tex(latex, true)}</div>`;
