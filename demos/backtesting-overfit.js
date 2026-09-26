// Inline demo for lesson backtesting: try N strategy variants that have NO real edge,
// keep the best in-sample Sharpe ratio, then look at the same variant out of sample.
import * as O from "./_opt.js";
import { barChart, slider, bindSliders, stats, tex } from "./_viz.js";

const EULER = 0.5772156649;
export const expectedMaxZ = (N) => (N < 2 ? 0 : (1 - EULER) * O.normInv(1 - 1 / N) + EULER * O.normInv(1 - 1 / (N * Math.E)));

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let seed = 3;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("试 N 个“毫无优势”的策略，挑出最好的那个", "Try N variants with no edge at all, keep the best one")}</div>
    <div class="demo-grid">
      ${slider("bo-n", T("尝试的策略变体数 N", "Variants tried N"), 1, 500, 1, 100)}
      ${slider("bo-y", T("样本内年数", "In-sample years"), 2, 15, 1, 5)}
    </div>
    <div class="demo-btns"><button type="button" class="demo-btn" id="bo-roll">${T("换一批随机数", "New random draw")}</button></div>
    <div id="bo-stats"></div>
    <div id="bo-chart"></div>
    <div class="demo-math" id="bo-f"></div>
    <p class="demo-tip">${T("看什么：每个变体的真实夏普都是 0。N 越大，“最好的那个”样本内夏普越高，可它在样本外依旧在 0 附近晃。样本年数加长，运气造出来的夏普才会缩小。", "What to notice: every variant has a true Sharpe of exactly 0. The larger N, the better the in-sample 'winner' looks — yet out of sample it still wobbles around 0. Only a longer sample shrinks the Sharpe that luck can manufacture.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const run = (v) => {
    const N = v["bo-n"], Y = v["bo-y"], M = Y * 12, R = O.rng(seed * 7919 + N);
    const vol = 0.1 / Math.sqrt(12);
    let best = -Infinity, bestOOS = 0;
    const srs = [];
    for (let k = 0; k < N; k++) {
      let s1 = 0, q1 = 0, s2 = 0, q2 = 0;
      for (let t = 0; t < M; t++) { const x = vol * R.normal(); s1 += x; q1 += x * x; }
      for (let t = 0; t < M; t++) { const x = vol * R.normal(); s2 += x; q2 += x * x; }
      const sr = (s, q) => { const m = s / M, sd = Math.sqrt(Math.max(q / M - m * m, 1e-12) * (M / (M - 1))); return (m / sd) * Math.sqrt(12); };
      const a = sr(s1, q1); srs.push(a);
      if (a > best) { best = a; bestOOS = sr(s2, q2); }
    }
    const theory = expectedMaxZ(N) / Math.sqrt(Y);
    // histogram of in-sample Sharpe ratios
    const lo = -2.5, hi = 2.5, nb = 20, w = (hi - lo) / nb, cnt = new Array(nb).fill(0);
    for (const a of srs) cnt[Math.min(nb - 1, Math.max(0, Math.floor((a - lo) / w)))]++;
    const bi = Math.min(nb - 1, Math.max(0, Math.floor((best - lo) / w)));
    $("#bo-chart").innerHTML = barChart({ bars: cnt.map((c, i) => ({ label: (lo + (i + 0.5) * w).toFixed(1), value: c, cls: i === bi ? 2 : 5 })), xlabel: T("样本内年化夏普比率（红柱 = 被选中的“赢家”）", "In-sample annualized Sharpe (red bar = the chosen 'winner')") });
    $("#bo-stats").innerHTML = stats([
      [T("最佳样本内夏普", "Best in-sample Sharpe"), best.toFixed(2), "acc"],
      [T("它的样本外夏普", "Its out-of-sample Sharpe"), bestOOS.toFixed(2), bestOOS < 0 ? "neg" : ""],
      [T("理论：纯运气的期望最大值", "Theory: expected best by luck"), theory.toFixed(2)],
    ]);
    $("#bo-f").innerHTML = tex(String.raw`\E\big[\max_{n \le N}\widehat{\text{SR}}_n\big] \approx \frac{1}{\sqrt{${Y}}}\Big[(1-\gamma)\,Z^{-1}\!\big(1-\tfrac{1}{${N}}\big) + \gamma\,Z^{-1}\!\big(1-\tfrac{1}{${N}e}\big)\Big] = ${theory.toFixed(2)}`, true);
  };
  const go = bindSliders(root, { "bo-n": (x) => String(x), "bo-y": (x) => x + T(" 年", " yrs") }, run);
  $("#bo-roll").addEventListener("click", () => { seed++; go(); });
}
