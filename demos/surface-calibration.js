// Main demo for lesson surface-calibration: fit raw SVI to noisy synthetic XYZ quotes (30-day and 91-day slices),
// then run the three arbitrage checks (butterfly g(k) >= 0, calendar w91 >= w30, Lee wing slopes <= 2).
// "True" smiles come from an arbitrage-free SSVI surface (Gatheral–Jacquier); quotes = truth + bid/ask noise (+ optional bad prints).
// Fit: quasi-explicit SVI — for fixed (m, s) the parameters (a, b·ρ·s, b·s) enter linearly (weighted least squares);
// Nelder–Mead searches (m, ln s) from several starts. Optional penalties on negative g(k) and on w30 > w91 (calendar).
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, stats, tex } from "./_viz.js";

const r = 0.04, S = 100;
const SL = { 30: { T: 30 / 365, atm: 0.18, lo: 85, hi: 115 }, 91: { T: 91 / 365, atm: 0.19, lo: 80, hi: 120 } };
const ssvi = (theta, eta = 0.8, gamma = 0.4, rho = -0.6) => { const phi = eta * theta ** -gamma; return { a: (theta * (1 - rho * rho)) / 2, b: (theta * phi) / 2, rho, m: -rho / phi, s: Math.sqrt(1 - rho * rho) / phi }; };

function nelderMead(f, x0, iters, step) {
  const n = x0.length; let P = [x0.slice()];
  for (let i = 0; i < n; i++) { const x = x0.slice(); x[i] += step; P.push(x); }
  let F = P.map(f);
  for (let it = 0; it < iters; it++) {
    const idx = F.map((_, i) => i).sort((a, b) => F[a] - F[b]); P = idx.map((i) => P[i]); F = idx.map((i) => F[i]);
    const c = Array(n).fill(0); for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) c[j] += P[i][j] / n;
    const lin = (t) => c.map((v, j) => v + t * (P[n][j] - v));
    const xr = lin(-1), fr = f(xr);
    if (fr < F[0]) { const xe = lin(-2), fe = f(xe); if (fe < fr) { P[n] = xe; F[n] = fe; } else { P[n] = xr; F[n] = fr; } }
    else if (fr < F[n - 1]) { P[n] = xr; F[n] = fr; }
    else {
      const xc = fr < F[n] ? lin(-0.5) : lin(0.5), fc = f(xc);
      if (fc < Math.min(fr, F[n])) { P[n] = xc; F[n] = fc; }
      else for (let i = 1; i <= n; i++) { P[i] = P[i].map((v, j) => P[0][j] + 0.5 * (v - P[0][j])); F[i] = f(P[i]); }
    }
  }
  const i0 = F.indexOf(Math.min(...F)); return { x: P[i0], f: F[i0] };
}
const det3 = (M) => M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
function inner(Q, T, W, m, s) {
  const A = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], v = [0, 0, 0];
  for (let i = 0; i < Q.length; i++) {
    const y = (Q[i].k - m) / s, x = [1, y, Math.sqrt(y * y + 1)], t = Q[i].iv ** 2 * T;
    for (let a = 0; a < 3; a++) { v[a] += W[i] * x[a] * t; for (let b = 0; b < 3; b++) A[a][b] += W[i] * x[a] * x[b]; }
  }
  const D = det3(A); if (Math.abs(D) < 1e-20) return null;
  const sol = [0, 1, 2].map((j) => det3(A.map((row, a) => row.map((val, b) => (b === j ? v[a] : val)))) / D);
  let [a, d, c] = sol; c = Math.max(c, 1e-8); d = Math.max(-0.999 * c, Math.min(0.999 * c, d));
  return { a, b: c / s, rho: d / c, m, s };
}
function fitSVI(Q, T, W, pen, upper) {
  const obj = (x) => {
    const s = Math.exp(x[1]), p = inner(Q, T, W, x[0], s); if (!p) return 1e9;
    let e = 0;
    for (let i = 0; i < Q.length; i++) { const w = O.sviW(Q[i].k, p); if (!(w > 0)) return 1e9; const d = Math.sqrt(w / T) - Q[i].iv; e += W[i] * d * d; }
    const mv = p.a + p.b * p.s * Math.sqrt(1 - p.rho * p.rho); if (mv < 0) e += 1 + mv * mv;
    if (pen) for (let k = -0.8; k <= 0.8001; k += 0.04) { const g = O.sviG(k, p); if (g < 0.01) e += 1e-3 * (2e-2 - g); }
    if (pen && upper) for (let k = -0.4; k <= 0.4001; k += 0.02) { const x = O.sviW(k, p) - upper(k); if (x > -1e-5) e += 1e-3 * (1e-3 + x); }
    return e;
  };
  let best = null;
  for (const m0 of [-0.1, 0, 0.1]) for (const s0 of [0.05, 0.2]) { const res = nelderMead(obj, [m0, Math.log(s0)], 150, 0.2); if (!best || res.f < best.f) best = res; }
  best = nelderMead(obj, best.x, 200, 0.02);
  return inner(Q, T, W, best.x[0], Math.exp(best.x[1]));
}
function makeQuotes(seed, bad) {
  const R = O.rng(seed), out = {};
  for (const d of [30, 91]) {
    const { T, atm, lo, hi } = SL[d], F = S * Math.exp(r * T), truth = ssvi(atm * atm * T), Q = [];
    for (let K = lo; K <= hi + 1e-9; K += 2.5) {
      const k = Math.log(K / F), tv = O.sviVol(k, T, truth), hs = 0.003 + (0.006 * Math.abs(k)) / Math.sqrt(T);
      Q.push({ K, k, tv, iv: tv + (R() - 0.5) * hs, vega: O.greeks({ S, K, T, r, sigma: tv }).vega, bad: false });
    }
    if (bad) { const i = d === 30 ? 3 : 14; Q[i].iv += d === 30 ? 0.04 : -0.03; Q[i].bad = true; }
    out[d] = { T, F, truth, Q };
  }
  return out;
}
export function calibrate({ seed = 2026, bad = false, weights = "eq", pen = true } = {}) {
  const data = makeQuotes(seed, bad), fits = {};
  for (const d of [91, 30]) {
    const { T, Q } = data[d], vmax = Math.max(...Q.map((q) => q.vega));
    const W = Q.map((q) => (weights === "eq" ? 1 : q.vega / vmax));
    const up = d === 30 && fits[91] ? (k) => O.sviW(k, fits[91].p) : null;
    const p = fitSVI(Q, T, W, pen, up);
    const rmse = Math.sqrt(Q.reduce((a, q) => a + (O.sviVol(q.k, T, p) - q.iv) ** 2, 0) / Q.length);
    const rmseT = Math.sqrt(Q.reduce((a, q) => a + (O.sviVol(q.k, T, p) - q.tv) ** 2, 0) / Q.length);
    let gmin = Infinity, kg = 0; for (let k = -0.6; k <= 0.6001; k += 0.005) { const g = O.sviG(k, p); if (g < gmin) { gmin = g; kg = k; } }
    fits[d] = { p, rmse, rmseT, gmin, kg, lee: p.b * (1 + Math.abs(p.rho)) };
  }
  let cal = Infinity, kc = 0; for (let k = -0.4; k <= 0.4001; k += 0.005) { const x = O.sviW(k, fits[91].p) - O.sviW(k, fits[30].p); if (x < cal) { cal = x; kc = k; } }
  return { data, fits, cal, kc };
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const st = { slice: "91", view: "iv", bad: "0", weights: "eq", pen: "1", seed: 2026 };
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("把 SVI 拟合到嘈杂的报价上，再做三项无套利检查", "Fit SVI to noisy quotes, then run three no-arbitrage checks")}</div>
    <div class="demo-row"><span style="display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap"><span class="demo-label">${T("期限", "Expiry")}</span>${seg("sc-sl", [["30", T("30 天", "30 days")], ["91", T("91 天", "91 days")]], st.slice)}</span>
      <span style="display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap"><span class="demo-label">${T("看", "View")}</span>${seg("sc-v", [["iv", T("隐含波动率", "Implied vol")], ["w", T("总方差（两条）", "Total variance (both)")], ["g", "g(k)"]], st.view)}</span></div>
    <div class="demo-row"><span style="display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap"><span class="demo-label">${T("数据", "Data")}</span>${seg("sc-b", [["0", T("已清洗", "Cleaned")], ["1", T("含坏报价", "With bad prints")]], st.bad)}</span>
      <span style="display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap"><span class="demo-label">${T("权重", "Weights")}</span>${seg("sc-w", [["eq", T("等权", "Equal")], ["vega", "Vega"]], st.weights)}</span>
      <span style="display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap"><span class="demo-label">${T("套利惩罚", "Arbitrage penalty")}</span>${seg("sc-p", [["1", T("开", "On")], ["0", T("关", "Off")]], st.pen)}</span>
      <div class="demo-btns" style="margin:0"><button class="demo-btn" data-noise="1">${T("重新抽取噪声", "Redraw noise")}</button></div></div>
    <div class="demo-math" id="sc-f"></div>
    <div id="sc-stats"></div>
    <div id="sc-chart"></div>
    <p class="demo-tip">${T("试试：先看干净数据的拟合（误差约 0.1 个波动率点）；再打开“含坏报价”，曲线被一个坏点拽歪；然后选 30 天、换成 Vega 权重并关掉套利惩罚，看这条切片是否冒出 g(k) < 0 与日历套利。多按几次“重新抽取噪声”：参数跳来跳去，曲线却几乎不动。", "Try this: look at the clean fit first (errors about 0.1 vol points); switch on bad prints and watch one quote drag the curve; then pick the 30-day expiry, Vega weights and penalty off, and see whether that slice develops g(k) < 0 and a calendar violation. Press “Redraw noise” a few times: the parameters jump around while the curve barely moves.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const ok = (b) => (b ? "✓" : "✗");
  function draw() {
    const res = calibrate({ seed: st.seed, bad: st.bad === "1", weights: st.weights, pen: st.pen === "1" });
    const d = +st.slice, { T: Tm, F, truth, Q } = res.data[d], f = res.fits[d], p = f.p;
    $("#sc-f").innerHTML = tex(String.raw`w(k) = ${p.a.toFixed(4)} + ${p.b.toFixed(4)}\Big(${p.rho.toFixed(3)}\,(k - ${p.m.toFixed(3)}) + \sqrt{(k - ${p.m.toFixed(3)})^{2} + ${p.s.toFixed(3)}^{2}}\Big)`, true);
    const calOK = res.cal >= -1e-6, gOK = f.gmin >= 0, leeOK = Math.max(res.fits[30].lee, res.fits[91].lee) <= 2;
    $("#sc-stats").innerHTML = stats([
      [T("对报价的误差（RMSE）", "Error vs quotes (RMSE)"), (f.rmse * 100).toFixed(2) + T(" 点", " pts"), "acc"],
      [T("对真实曲线的误差", "Error vs true curve"), (f.rmseT * 100).toFixed(2) + T(" 点", " pts")],
      [T("蝶式：min g(k)", "Butterfly: min g(k)"), ok(gOK) + " " + f.gmin.toFixed(3), gOK ? "pos" : "neg"],
      [T("日历：min(w₉₁ − w₃₀)", "Calendar: min(w₉₁ − w₃₀)"), ok(calOK) + " " + res.cal.toFixed(4), calOK ? "pos" : "neg"],
      [T("Lee 翼斜率 ≤ 2", "Lee wing slope ≤ 2"), ok(leeOK) + " " + Math.max(res.fits[30].lee, res.fits[91].lee).toFixed(3), leeOK ? "pos" : "neg"],
    ]);
    const kmin = Math.log(SL[d].lo / F) - 0.08, kmax = Math.log(SL[d].hi / F) + 0.08;
    let html;
    if (st.view === "iv") {
      const good = Q.filter((q) => !q.bad).map((q) => [q.K, q.iv * 100]), badq = Q.filter((q) => q.bad).map((q) => [q.K, q.iv * 100]);
      const Kf = (k) => F * Math.exp(k);
      const series = [
        { f: (K) => O.sviVol(Math.log(K / F), Tm, p) * 100, cls: 0, label: T("SVI 拟合", "SVI fit") },
        { f: (K) => O.sviVol(Math.log(K / F), Tm, truth) * 100, cls: 5, dashed: true, label: T("真实曲线（合成）", "True curve (synthetic)") },
        { points: good, cls: 1, dotsOnly: true, label: T("报价中间价", "Quote mids") },
      ];
      if (badq.length) series.push({ points: badq, cls: 2, dotsOnly: true, r: 5, label: T("坏报价", "Bad print") });
      html = lineChart({ series, xmin: Kf(kmin), xmax: Kf(kmax), xlabel: T("行权价 K", "Strike K"), ylabel: T("隐含波动率（%）", "Implied vol (%)"), markers: [{ x: F, label: "F" }] });
    } else if (st.view === "w") {
      html = lineChart({
        xmin: -0.4, xmax: 0.4, xlabel: T("对数价内程度 k = ln(K/F)", "Log-moneyness k = ln(K/F)"), ylabel: T("总方差 w = σ²T", "Total variance w = σ²T"), yfmt: (x) => x.toFixed(3),
        series: [
          { f: (k) => O.sviW(k, res.fits[30].p), cls: 2, label: T("30 天拟合", "30-day fit") },
          { f: (k) => O.sviW(k, res.fits[91].p), cls: 0, label: T("91 天拟合", "91-day fit") },
        ],
        markers: res.cal < 0 ? [{ x: res.kc, label: T("交叉", "cross") }] : [],
      });
    } else {
      html = lineChart({
        xmin: -0.6, xmax: 0.6, xlabel: T("对数价内程度 k", "Log-moneyness k"), ylabel: "g(k)",
        series: [{ f: (k) => Math.max(-2, Math.min(3, O.sviG(k, p))), cls: gOK ? 3 : 2, label: T("g(k)：必须 ≥ 0", "g(k): must be ≥ 0") }],
        hlines: [{ y: 0, label: "0" }], markers: gOK ? [] : [{ x: f.kg, label: T("最小值", "min") }],
      });
    }
    $("#sc-chart").innerHTML = html;
  }
  onSeg(root, "sc-sl", (x) => { st.slice = x; draw(); });
  onSeg(root, "sc-v", (x) => { st.view = x; draw(); });
  onSeg(root, "sc-b", (x) => { st.bad = x; draw(); });
  onSeg(root, "sc-w", (x) => { st.weights = x; draw(); });
  onSeg(root, "sc-p", (x) => { st.pen = x; draw(); });
  root.querySelector("[data-noise]").addEventListener("click", () => { st.seed += 1; draw(); });
  draw();
}
