// Inline demo for lesson realized-vol: how noisy is a realized-vol estimate? Draw 400 windows of n daily returns
// from a stock whose true volatility never changes, estimate each, and look at the spread.
import * as O from "./_opt.js";
import { barChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const M = 400;
  let seed = 21;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("同一只股票，400 个窗口：估计值能差多远？", "One stock, 400 windows: how far apart can the estimates be?")}</div>
    <div class="demo-grid">
      ${slider("rvw-n", T("窗口里的日收益数 n", "Daily returns per window n"), 5, 252, 1, 21)}
      ${slider("rvw-s", T("真实波动率 σ（恒定）", "True volatility σ (constant)"), 10, 60, 1, 20)}
    </div>
    <div class="demo-btns"><button class="demo-btn" data-act="resample">${T("重新抽样", "Draw again")}</button></div>
    <div id="rvw-chart"></div>
    <div id="rvw-stats"></div>
    <div class="demo-math" id="rvw-f"></div>
    <p class="demo-tip">${T("看什么：真实波动率从头到尾没变，但 21 天窗口的估计值常常偏离 3 个波动率点以上；把 n 拉到 252，柱子挤成一根。要把误差减半，需要四倍的数据。", "What to notice: the true volatility never changes, yet 21-day estimates often miss it by more than 3 vol points. Push n to 252 and the bars squeeze into a spike. Halving the error takes four times the data.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const n = v["rvw-n"], sig = v["rvw-s"] / 100;
    const R = O.rng(seed), sd = sig / Math.sqrt(252), est = [];
    for (let j = 0; j < M; j++) {
      let s = 0, s2 = 0;
      for (let i = 0; i < n; i++) { const x = sd * R.normal(); s += x; s2 += x * x; }
      const m = s / n;
      est.push(Math.sqrt(((s2 - n * m * m) / (n - 1)) * 252) * 100);
    }
    const se = (sig * 100) / Math.sqrt(2 * n);
    const lo = Math.max(0, sig * 100 - 4 * se), hi = sig * 100 + 4 * se, B = 16, w = (hi - lo) / B;
    const counts = new Array(B).fill(0);
    for (const e of est) counts[Math.min(B - 1, Math.max(0, Math.floor((e - lo) / w)))]++;
    const center = Math.floor((sig * 100 - lo) / w);
    $("#rvw-chart").innerHTML = barChart({
      bars: counts.map((c, i) => ({ label: (lo + (i + 0.5) * w).toFixed(1) + "%", value: c, cls: i === center ? 0 : 1 })),
      xlabel: T("估计出的年化波动率（400 个窗口）", "Estimated annualized vol (400 windows)"), yfmt: (x) => String(Math.round(x)),
    });
    const sorted = [...est].sort((a, b) => a - b), mean = est.reduce((a, x) => a + x, 0) / M;
    const simSd = Math.sqrt(est.reduce((a, x) => a + (x - mean) ** 2, 0) / (M - 1));
    const miss3 = est.filter((e) => Math.abs(e - sig * 100) > 3).length / M;
    $("#rvw-stats").innerHTML = stats([
      [T("估计值的平均", "Average estimate"), mean.toFixed(1) + "%"],
      [T("中间 90% 的范围", "Middle 90% range"), sorted[Math.floor(0.05 * M)].toFixed(1) + "% – " + sorted[Math.floor(0.95 * M)].toFixed(1) + "%", "acc"],
      [T("模拟的标准误", "Simulated standard error"), simSd.toFixed(2) + T(" 点", " pts")],
      [T("偏离超过 3 个点的比例", "Share missing by > 3 pts"), (miss3 * 100).toFixed(0) + "%"],
    ]);
    $("#rvw-f").innerHTML = tex(String.raw`\operatorname{SE}(\hat\sigma) \approx \frac{\sigma}{\sqrt{2n}} = \frac{${(sig * 100).toFixed(0)}\%}{\sqrt{${2 * n}}} = ${se.toFixed(2)}\ \text{${T("个波动率点", "vol points")}}`, true);
  };
  const run = bindSliders(root, { "rvw-n": (x) => x + T(" 个", ""), "rvw-s": (x) => x + "%" }, draw);
  root.querySelector('[data-act="resample"]').addEventListener("click", () => { seed += 1; run(); });
}
