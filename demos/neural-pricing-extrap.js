// Inline demo for lesson neural-pricing: a one-input surrogate C(σ) for the XYZ 30-day ATM call, fitted with random tanh
// features + ridge regression on a training range of σ. Inside the range it is excellent; outside it can say anything.
import * as O from "./_opt.js";
import { ridgeSolve } from "./neural-pricing.js";
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

const bs = (s) => O.bsPrice({ S: 100, K: 100, T: 30 / 365, r: 0.04, sigma: Math.max(s, 1e-6), type: "call" });

export function fit1D({ M = 20, hi = 0.4, lo = 0.1, seed = 9, lam = 1e-10 }) {
  const R = O.rng(seed), a = [], b = [];
  for (let j = 0; j < M; j++) { a.push(R.normal() * 2); b.push(R.normal() * 1.5); }
  const u = (s) => (2 * (s - lo)) / (hi - lo) - 1, P = M + 2, f = new Float64Array(P);
  const feat = (s) => { const x = u(s); f[0] = 1; f[1] = x; for (let j = 0; j < M; j++) f[j + 2] = Math.tanh(a[j] * x + b[j]); return f; };
  const A = new Float64Array(P * P), y = new Float64Array(P), N = 200;
  for (let i = 0; i < N; i++) {
    const s = lo + ((hi - lo) * (i + 0.5)) / N, x = feat(s), t = bs(s);
    for (let p = 0; p < P; p++) { y[p] += x[p] * t; for (let q = 0; q < P; q++) A[p * P + q] += x[p] * x[q]; }
  }
  for (let p = 0; p < P; p++) A[p * P + p] += lam * N;
  const beta = ridgeSolve(A, y, P);
  return (s) => { const x = feat(s); let v = 0; for (let p = 0; p < P; p++) v += x[p] * beta[p]; return v; };
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("外推：替身在训练范围外会说什么？", "Extrapolation: what does a surrogate say outside its training range?")}</div>
    <div class="demo-grid">
      ${slider("npe-hi", T("训练范围上限 σ", "Top of training range σ"), 30, 90, 5, 40)}
      ${slider("npe-m", T("隐藏特征个数 M", "Hidden features M"), 4, 40, 1, 20)}
    </div>
    <div class="demo-math" id="npe-f"></div>
    <div id="npe-chart"></div>
    <div id="npe-stats"></div>
    <p class="demo-tip">${T("看什么：灰线是 XYZ 30 天平值看涨期权的真实价格，蓝线是只在阴影范围里学过的替身。范围内两线重合；一出范围，蓝线可以往任何方向跑。把训练范围上限拉宽，误差才会消失——替身只知道它见过的东西。", "What to notice: the grey line is the true price of XYZ's 30-day ATM call; the blue line is a surrogate that only saw the shaded range. Inside, the two coincide; outside, the blue line can run off in any direction. Only widening the training range fixes it — a surrogate knows only what it has seen.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  bindSliders(root, { "npe-hi": (x) => x + "%", "npe-m": (x) => x }, (v) => {
    const hi = v["npe-hi"] / 100, M = v["npe-m"], f = fit1D({ M, hi });
    $("#npe-f").innerHTML = tex(String.raw`\hat C(\sigma) = \beta_0 + \beta_1 u + \sum_{j=1}^{${M}} \beta_j \tanh(a_j u + b_j)`, true) + tex(String.raw`u = \sigma\ \text{${T("线性缩放到", "rescaled to")}}\ [-1, 1]\ \text{${T("（训练范围）", "(training range)")}}`, true);
    $("#npe-chart").innerHTML = lineChart({
      series: [{ f: (x) => bs(x / 100), cls: 5, label: T("真实价格", "True price") }, { f: (x) => f(x / 100), cls: 0, label: T("替身", "Surrogate") }],
      xmin: 1, xmax: 100, ymin: -4, ymax: 16, bands: [{ x0: 10, x1: hi * 100, cls: 0, label: T("训练范围", "training range") }],
      xlabel: T("波动率 σ（%）", "Volatility σ (%)"), ylabel: T("价格（美元）", "Price ($)"), H: 240,
    });
    const e = (s) => f(s) - bs(s);
    const d = (x) => (x < 0 ? "−$" : "+$") + Math.abs(x).toFixed(2);
    $("#npe-stats").innerHTML = stats([
      [T("σ = 20% 的误差", "Error at σ = 20%"), (e(0.2) < -0.00005 ? "−" : "") + Math.abs(e(0.2) * 100).toFixed(2) + T(" 美分", "¢"), "pos"],
      [T("σ = 60% 的误差", "Error at σ = 60%"), d(e(0.6)), Math.abs(e(0.6)) > 0.05 ? "neg" : "pos"],
      [T("σ = 90% 的误差", "Error at σ = 90%"), d(e(0.9)), Math.abs(e(0.9)) > 0.05 ? "neg" : "pos"],
      [T("σ = 60% 的真实价", "True price at σ = 60%"), "$" + bs(0.6).toFixed(2)],
    ]);
  });
}
