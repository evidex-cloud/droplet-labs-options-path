// Main demo for lesson neural-pricing: train a small surrogate (random tanh features + ridge regression, i.e. a one-hidden-layer
// network whose hidden weights are random and only the output layer is fitted) on Black-Scholes prices inside a training box,
// then (1) map its error inside and outside the box, (2) look at one slice, (3) use it to calibrate σ to synthetic quotes.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export const BOX = { m: [-0.2, 0.2], d: [7, 90], s: [0.1, 0.4] };
const sc = (x, [lo, hi]) => (2 * (x - lo)) / (hi - lo) - 1;
export const truth = (m, d, s) => O.bsPrice({ S: 100, K: 100 * Math.exp(m), T: d / 365, r: 0.04, sigma: s, type: "call" });

// Solve (A + lam I) beta = b for symmetric positive-definite A (Cholesky). A is P×P in a flat array.
export function ridgeSolve(A, b, P) {
  const L = new Float64Array(P * P);
  for (let i = 0; i < P; i++) for (let j = 0; j <= i; j++) {
    let s = A[i * P + j];
    for (let k = 0; k < j; k++) s -= L[i * P + k] * L[j * P + k];
    L[i * P + j] = i === j ? Math.sqrt(Math.max(s, 1e-300)) : s / L[j * P + j];
  }
  const z = new Float64Array(P), x = new Float64Array(P);
  for (let i = 0; i < P; i++) { let s = b[i]; for (let k = 0; k < i; k++) s -= L[i * P + k] * z[k]; z[i] = s / L[i * P + i]; }
  for (let i = P - 1; i >= 0; i--) { let s = z[i]; for (let k = i + 1; k < P; k++) s -= L[k * P + i] * x[k]; x[i] = s / L[i * P + i]; }
  return x;
}

// Fit the surrogate price(m = ln K/S, days, sigma) on N random points in BOX. Returns predict(m, d, s).
export function fitSurrogate({ M = 300, N = 3000, lam = 1e-9, scale = 1, seed = 5 }) {
  const R = O.rng(seed), W = [], C = [];
  for (let j = 0; j < M; j++) { W.push([R.normal() * scale, R.normal() * scale, R.normal() * scale]); C.push(R.normal() * 1.5); }
  const P = M + 4, f = new Float64Array(P);
  const feat = (m, d, s) => {
    const u0 = sc(m, BOX.m), u1 = sc(d, BOX.d), u2 = sc(s, BOX.s);
    f[0] = 1; f[1] = u0; f[2] = u1; f[3] = u2;
    for (let j = 0; j < M; j++) f[j + 4] = Math.tanh(W[j][0] * u0 + W[j][1] * u1 + W[j][2] * u2 + C[j]);
    return f;
  };
  const A = new Float64Array(P * P), b = new Float64Array(P);
  for (let i = 0; i < N; i++) {
    const m = BOX.m[0] + R() * (BOX.m[1] - BOX.m[0]), d = BOX.d[0] + R() * (BOX.d[1] - BOX.d[0]), s = BOX.s[0] + R() * (BOX.s[1] - BOX.s[0]);
    const x = feat(m, d, s), y = truth(m, d, s);
    for (let a = 0; a < P; a++) { const xa = x[a]; b[a] += xa * y; for (let c = a; c < P; c++) A[a * P + c] += xa * x[c]; }
  }
  for (let a = 0; a < P; a++) { for (let c = 0; c < a; c++) A[a * P + c] = A[c * P + a]; A[a * P + a] += lam * N; }
  const beta = ridgeSolve(A, b, P);
  return (m, d, s) => { const x = feat(m, d, s); let y = 0; for (let a = 0; a < P; a++) y += x[a] * beta[a]; return y; };
}

export function testError(pred, seed = 77, n = 2000) {
  const R = O.rng(seed);
  let se = 0, mx = 0;
  for (let i = 0; i < n; i++) {
    const m = BOX.m[0] + R() * 0.4, d = 7 + R() * 83, s = 0.1 + R() * 0.3;
    const e = pred(m, d, s) - truth(m, d, s);
    se += e * e; mx = Math.max(mx, Math.abs(e));
  }
  return { rmse: Math.sqrt(se / n), max: mx };
}

// Calibrate sigma to quotes: coarse grid over [lo, hi] (robust to wiggly surrogates), then golden-section refinement.
export function calibrate(priceFn, quotes, lo = 0.05, hi = 1.0) {
  const loss = (s) => quotes.reduce((a, q) => a + (priceFn(q.m, q.d, s) - q.p) ** 2, 0);
  let best = lo, bl = Infinity, evals = 0;
  for (let s = lo; s <= hi + 1e-9; s += 0.01) { const l = loss(s); evals++; if (l < bl) { bl = l; best = s; } }
  const g = (Math.sqrt(5) - 1) / 2;
  let a = Math.max(lo, best - 0.01), b = Math.min(hi, best + 0.01), c = b - g * (b - a), d = a + g * (b - a), fc = loss(c), fd = loss(d);
  evals += 2;
  while (b - a > 1e-5) {
    if (fc < fd) { b = d; d = c; fd = fc; c = b - g * (b - a); fc = loss(c); } else { a = c; c = d; fc = fd; d = a + g * (b - a); fd = loss(d); }
    evals++;
  }
  return { sigma: (a + b) / 2, evals: evals * quotes.length };
}

export const makeQuotes = (sigStar) => [-0.1, -0.075, -0.05, -0.025, 0, 0.025, 0.05, 0.075, 0.1].map((m, i) => ({ m, d: 30, p: truth(m, 30, sigStar) + 0.004 * Math.sin(3 * i + 1) }));

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let M = 300, seed = 5, pred = null, hestonMs = null;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("训练一个定价“替身”：盒子里很准，盒子外乱说", "Train a pricing surrogate: accurate inside the box, confidently wrong outside")}</div>
    <p class="demo-meta">${T("模型：3 个输入（对数价内程度 ln(K/S)、到期天数、σ）→ M 个随机 tanh 特征 → 岭回归拟合输出权重。训练盒子：ln(K/S) ∈ [−0.2, 0.2]，7–90 天，σ ∈ [10%, 40%]，3,000 个 Black-Scholes 价格（S = 100，r = 4%）。", "Model: 3 inputs (log-moneyness ln(K/S), days to expiry, σ) → M random tanh features → ridge regression for the output weights. Training box: ln(K/S) ∈ [−0.2, 0.2], 7–90 days, σ ∈ [10%, 40%], 3,000 Black-Scholes prices (S = 100, r = 4%).")}</p>
    <div class="demo-row"><div class="demo-field"><div class="demo-label">${T("隐藏特征个数 M", "Hidden features M")}</div>${seg("np-M", [["50", "50"], ["150", "150"], ["300", "300"]], "300")}</div>
    <div class="demo-btns" style="margin:0"><button class="demo-btn" data-retrain>${T("换一组随机特征重训", "Retrain with new random features")}</button></div></div>
    <div id="np-stats"></div>
    <div class="demo-grid">
      ${slider("np-s", T("误差地图用的 σ", "σ for the error map"), 5, 80, 1, 20)}
      ${slider("np-star", T("“市场”真实 σ*（用于校准）", "True market σ* (for calibration)"), 10, 70, 1, 27)}
    </div>
    <div class="demo-label">${T("误差地图：替身价 − 真实价（单位美分；1 美元以上的误差标 $），行 = 到期天数，列 = ln(K/S)；虚线框内 = 训练盒子", "Error map: surrogate − true price (in cents; errors of $1 or more shown in $); rows = days to expiry, columns = ln(K/S); dashed cells = inside the training box")}</div>
    <div id="np-map"></div>
    <div id="np-slice"></div>
    <div class="demo-math" id="np-cal"></div>
    <p class="demo-tip">${T("试试：σ 放在 20%，地图几乎全白；拉到 60%，盒子外一片通红。把 σ* 拉过 40%，替身校准出来的 σ 就和真值分道扬镳——它从没见过那样的市场。", "Try this: at σ = 20% the map is almost blank; drag it to 60% and everything outside the box turns red. Push σ* past 40% and the surrogate's calibrated σ parts ways with the truth — it has never seen such a market.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const train = () => {
    const t0 = performance.now();
    pred = fitSurrogate({ M, seed });
    const ms = performance.now() - t0, err = testError(pred);
    let t1 = performance.now();
    for (let i = 0; i < 2000; i++) pred(0.01 * (i % 7), 30, 0.2);
    const us = ((performance.now() - t1) / 2000) * 1000;
    if (hestonMs === null) { t1 = performance.now(); O.hestonPrice({ S: 100, K: 100, T: 30 / 365, r: 0.04, v0: 0.04, kappa: 2, theta: 0.04, xi: 0.5, rho: -0.7 }); hestonMs = performance.now() - t1; }
    $("#np-stats").innerHTML = stats([
      [T("盒内测试误差 RMSE", "In-box test RMSE"), (err.rmse * 100).toFixed(1) + T(" 美分", "¢"), "acc"],
      [T("盒内最大误差", "In-box max error"), (err.max * 100).toFixed(0) + T(" 美分", "¢")],
      [T("训练用时", "Training time"), ms.toFixed(0) + " ms"],
      [T("替身：每个价格", "Surrogate: per price"), us.toFixed(1) + " µs", "pos"],
      [T("Heston（本课引擎）：每个价格", "Heston (course engine): per price"), hestonMs.toFixed(1) + " ms", "neg"],
    ]);
  };
  const draw = (v) => {
    const s = v["np-s"] / 100, sStar = v["np-star"] / 100;
    const ms = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3], ds = [7, 30, 60, 90, 180, 365];
    const inBox = (m, d) => m >= BOX.m[0] - 1e-9 && m <= BOX.m[1] + 1e-9 && d >= BOX.d[0] && d <= BOX.d[1] && s >= BOX.s[0] - 1e-9 && s <= BOX.s[1] + 1e-9;
    // errors under $1 in cents (one decimal); $1 or more in dollars, marked with $
    const cell = (e) => { const a = Math.abs(e), sg = e < -0.05 ? "−" : ""; return a >= 100 ? sg + "$" + (a / 100).toFixed(a >= 1000 ? 0 : 2) : sg + a.toFixed(1); };
    let h = `<table><tr><th>${T("天数 / ln(K/S)", "days / ln(K/S)")}</th>${ms.map((m) => `<th>${m.toFixed(1)}</th>`).join("")}</tr>`;
    for (const d of ds) {
      h += `<tr><td>${d}</td>`;
      for (const m of ms) {
        const e = (pred(m, d, s) - truth(m, d, s)) * 100, a = Math.min(100, Math.round((Math.abs(e) / 50) * 100));
        const bord = inBox(m, d) ? "border:2px dashed var(--orange);" : "";
        h += `<td style="${bord}background:color-mix(in srgb, var(--red) ${a}%, transparent)">${cell(e)}</td>`;
      }
      h += `</tr>`;
    }
    $("#np-map").innerHTML = h + `</table>`;
    $("#np-slice").innerHTML = lineChart({
      series: [
        { f: (x) => truth(0, 30, x / 100), cls: 5, label: T("真实 Black-Scholes（ATM，30 天）", "True Black-Scholes (ATM, 30 days)") },
        { f: (x) => pred(0, 30, x / 100), cls: 0, label: T("替身网络", "Surrogate") },
      ],
      xmin: 5, xmax: 80, ymin: -2, ymax: 14, bands: [{ x0: 10, x1: 40, cls: 0, label: T("训练范围", "training range") }],
      markers: [{ x: s * 100, label: "" }], xlabel: T("波动率 σ（%）", "Volatility σ (%)"), ylabel: T("期权价格（美元）", "Option price ($)"), H: 240,
    });
    const quotes = makeQuotes(sStar);
    const cs = calibrate(pred, quotes), ce = calibrate(truth, quotes);
    $("#np-cal").innerHTML = tex(String.raw`\hat\sigma = \arg\min_{\sigma} \sum_{i=1}^{9} \big(C_{\text{model}}(K_i;\sigma) - C^{\text{mkt}}_i\big)^2`, true) + tex(String.raw`\hat\sigma_{\text{${T("替身", "surrogate")}}} = ${(cs.sigma * 100).toFixed(1)}\%,\ \ \hat\sigma_{\text{${T("精确", "exact")}}} = ${(ce.sigma * 100).toFixed(1)}\%\ \ (\sigma^{*} = ${(sStar * 100).toFixed(0)}\%)`, true)
      + `<div class="demo-meta">${T("校准调用了定价函数 ", "Calibration called the pricer ")}${cs.evals.toLocaleString("en-US")}${T(" 次；用 Heston 这样的慢模型要约 ", " times; with a slow model like Heston that would take about ")}${((cs.evals * hestonMs) / 1000).toFixed(1)} s${T("，用替身几乎是瞬间。", "; with the surrogate it is instant.")}</div>`;
  };
  const run = bindSliders(root, { "np-s": (x) => x + "%", "np-star": (x) => x + "%" }, (v) => { if (!pred) train(); draw(v); });
  onSeg(root, "np-M", (v) => { M = +v; train(); run(); });
  $("[data-retrain]").addEventListener("click", () => { seed += 1; train(); run(); });
}
