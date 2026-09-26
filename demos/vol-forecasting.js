// Main demo for lesson vol-forecasting: a horse race on simulated GARCH(1,1) data.
// First half = training (fit GARCH by a small maximum-likelihood grid, HAR by least squares); second half = test.
// Target: the average daily variance over the next 21 trading days, shown as annualized vol (×252).
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, tex } from "./_viz.js";

export const H = 21, PPY = 252;

export function simulate({ alpha = 0.08, beta = 0.9, vol = 0.2, n = 1500, seed = 5 }) {
  const R = O.rng(seed), lr = (vol * vol) / PPY, omega = lr * (1 - alpha - beta);
  let v = lr; const r = [];
  for (let t = 0; t < n; t++) { const e = Math.sqrt(v) * R.normal(); r.push(e); v = omega + alpha * e * e + beta * v; }
  return r;
}

// Gaussian log-likelihood of GARCH(1,1) with variance targeting
function garchLL(r, a, b, lr) {
  const w = lr * (1 - a - b); let v = lr, ll = 0;
  for (const e of r) { ll += -0.5 * (Math.log(v) + (e * e) / v); v = w + a * e * e + b * v; }
  return ll;
}
export function fitGarch(r) {
  const lr = r.reduce((s, e) => s + e * e, 0) / r.length;
  let best = { ll: -Infinity };
  for (let a = 0.02; a <= 0.2001; a += 0.02) for (let b = 0.7; b <= 0.9701; b += 0.01) {
    if (a + b >= 0.995) continue;
    const ll = garchLL(r, a, b, lr); if (ll > best.ll) best = { ll, alpha: a, beta: b, omega: lr * (1 - a - b), lr };
  }
  return best;
}
// ordinary least squares for y ~ X (X includes a constant column); normal equations, 4×4
function ols(X, y) {
  const k = X[0].length, A = Array.from({ length: k }, () => new Array(k).fill(0)), c = new Array(k).fill(0);
  X.forEach((x, i) => { for (let p = 0; p < k; p++) { c[p] += x[p] * y[i]; for (let q = 0; q < k; q++) A[p][q] += x[p] * x[q]; } });
  for (let p = 0; p < k; p++) { // Gaussian elimination with partial pivoting
    let m = p; for (let q = p + 1; q < k; q++) if (Math.abs(A[q][p]) > Math.abs(A[m][p])) m = q;
    [A[p], A[m]] = [A[m], A[p]]; [c[p], c[m]] = [c[m], c[p]];
    for (let q = p + 1; q < k; q++) { const f = A[q][p] / A[p][p]; for (let j = p; j < k; j++) A[q][j] -= f * A[p][j]; c[q] -= f * c[p]; }
  }
  const b = new Array(k).fill(0);
  for (let p = k - 1; p >= 0; p--) { let s = c[p]; for (let j = p + 1; j < k; j++) s -= A[p][j] * b[j]; b[p] = s / A[p][p]; }
  return b;
}
export const qlike = (f, y) => y / f - Math.log(y / f) - 1;

export function race(r, lambda = 0.94) {
  const n = r.length, half = Math.floor(n / 2), sq = r.map((e) => e * e);
  const avg = (i0, i1) => { let s = 0; for (let i = i0; i < i1; i++) s += sq[i]; return s / (i1 - i0); };
  const target = (t) => avg(t + 1, t + 1 + H); // realized average daily variance over the next 21 days
  // EWMA and GARCH filtered variances (σ²_{t+1} known at the end of day t)
  const ew = []; let v = avg(0, 22); for (let t = 0; t < n; t++) { v = lambda * v + (1 - lambda) * sq[t]; ew.push(v); }
  const G = fitGarch(r.slice(0, half));
  const gs = []; let g = G.lr; for (let t = 0; t < n; t++) { g = G.omega + G.alpha * sq[t] + G.beta * g; gs.push(g); }
  const p = G.alpha + G.beta;
  const garchAvg = (v1) => { let s = 0; for (let h = 1; h <= H; h++) s += G.lr + p ** (h - 1) * (v1 - G.lr); return s / H; };
  // HAR on squared returns: daily, weekly (5), monthly (22) averages
  const har = (t) => [1, sq[t], avg(t - 4, t + 1), avg(t - 21, t + 1)];
  const Xtr = [], ytr = [];
  for (let t = 22; t < half - H - 1; t++) { Xtr.push(har(t)); ytr.push(target(t)); }
  const b = ols(Xtr, ytr);
  const rows = { hist: [], ewma: [], garch: [], har: [] }, real = [];
  for (let t = half; t < n - H - 1; t++) {
    const y = target(t); real.push(y);
    rows.hist.push(avg(t - H + 1, t + 1));
    rows.ewma.push(ew[t]);
    rows.garch.push(garchAvg(gs[t]));
    rows.har.push(Math.max(1e-7, har(t).reduce((s, x, i) => s + x * b[i], 0)));
  }
  const score = {};
  for (const k of Object.keys(rows)) {
    let mse = 0, ql = 0; rows[k].forEach((f, i) => { mse += (f * PPY - real[i] * PPY) ** 2; ql += qlike(f, real[i]); });
    score[k] = { mse: (mse / real.length) * 1e4, ql: ql / real.length };
  }
  return { rows, real, score, G, b, half };
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let seed = 1; // opens on a typical draw (GARCH wins about 60% of seeds); "New simulated data" shows the others
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("四个预测模型赛跑（模拟的 GARCH 数据）", "A four-model horse race (simulated GARCH data)")}</div>
    <div class="demo-grid">
      ${slider("vf-a", T("真实过程的 α（冲击反应）", "True α (reaction to shocks)"), 0.02, 0.2, 0.01, 0.08)}
      ${slider("vf-b", T("真实过程的 β（记忆）", "True β (memory)"), 0.6, 0.97, 0.01, 0.9)}
      ${slider("vf-l", T("EWMA 的 λ", "EWMA λ"), 0.8, 0.99, 0.01, 0.94)}
    </div>
    <div class="demo-btns"><button type="button" class="demo-btn" id="vf-new">${T("换一段模拟数据", "New simulated data")}</button></div>
    <div id="vf-table"></div>
    <div id="vf-chart"></div>
    <div class="demo-math" id="vf-f"></div>
    <p class="demo-tip">${T("试试：把 β 调低（记忆变短），均值回归变快，只看过去 21 天的“历史波动率”就明显落后；把 α + β 推近 1，EWMA 和 GARCH 几乎打平。注意 QLIKE 对“低估”罚得更重。", "Try this: lower β (shorter memory) and fast mean reversion leaves the 21-day historical estimate clearly behind; push α + β close to 1 and EWMA nearly ties GARCH. Notice that QLIKE punishes under-forecasts harder.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const names = { hist: T("21 天历史波动率", "21-day historical"), ewma: "EWMA", garch: "GARCH(1,1)", har: "HAR" };
  const run = (v) => {
    let a = v["vf-a"], b = v["vf-b"];
    const clipped = a + b > 0.99;
    if (clipped) b = 0.99 - a;
    const r = simulate({ alpha: a, beta: b, seed });
    const res = race(r, v["vf-l"]);
    const order = Object.keys(res.score).sort((x, y) => res.score[x].ql - res.score[y].ql);
    $("#vf-table").innerHTML = `<table><thead><tr><th>${T("模型（样本外）", "Model (out of sample)")}</th><th>MSE</th><th>QLIKE</th><th>${T("排名", "Rank")}</th></tr></thead><tbody>${order.map((k, i) => `<tr${i === 0 ? ' class="hl"' : ""}><td>${names[k]}</td><td>${res.score[k].mse.toFixed(2)}</td><td>${res.score[k].ql.toFixed(4)}</td><td>${i + 1}</td></tr>`).join("")}</tbody></table>
      <p class="demo-meta">${T(`拟合出的 GARCH：α = ${res.G.alpha.toFixed(2)}，β = ${res.G.beta.toFixed(2)}（真实值 ${a.toFixed(2)}、${b.toFixed(2)}）；${clipped ? "β 已自动下调，保证 α + β < 1；" : ""}MSE 按年化方差计算（例如 20% 波动率 = 0.04），再乘以 10⁴ 便于阅读。`, `Fitted GARCH: α = ${res.G.alpha.toFixed(2)}, β = ${res.G.beta.toFixed(2)} (true ${a.toFixed(2)}, ${b.toFixed(2)})${clipped ? "; β was lowered so that α + β < 1" : ""}. MSE is computed on annualized variance (20% vol = 0.04) and multiplied by 10⁴ for readability.`)}</p>`;
    const step = 3, pts = (arr) => arr.map((x, i) => [i, Math.sqrt(x * PPY) * 100]).filter((_, i) => i % step === 0);
    $("#vf-chart").innerHTML = lineChart({
      xlabel: T("测试期（交易日）", "Test period (trading days)"), ylabel: T("年化波动率 %", "Annualized vol %"), ymin: 0,
      series: [
        { points: pts(res.real), cls: 5, label: T("未来 21 天实际波动率", "Realized vol, next 21 days") },
        { points: pts(res.rows.hist), cls: 2, dashed: true, label: names.hist },
        { points: pts(res.rows.garch), cls: 0, label: names.garch },
        { points: pts(res.rows.har), cls: 3, label: names.har },
      ],
      yfmt: (x) => x.toFixed(0) + "%",
    });
    $("#vf-f").innerHTML = tex(String.raw`\text{QLIKE}(\hat\sigma^2, \text{RV}) = \frac{\text{RV}}{\hat\sigma^2} - \ln\frac{\text{RV}}{\hat\sigma^2} - 1`, true)
      + tex(String.raw`\text{HAR: } \widehat{\text{RV}}_{t+1} = ${(res.b[0] * 1e5).toFixed(2)}\times 10^{-5} + ${res.b[1].toFixed(2)}\,r_t^2 + ${res.b[2].toFixed(2)}\,\overline{r^2}_{\text{wk}} + ${res.b[3].toFixed(2)}\,\overline{r^2}_{\text{mo}}`, true);
  };
  const go = bindSliders(root, { "vf-a": (x) => x.toFixed(2), "vf-b": (x) => x.toFixed(2), "vf-l": (x) => x.toFixed(2) }, run);
  $("#vf-new").addEventListener("click", () => { seed++; go(); });
}
