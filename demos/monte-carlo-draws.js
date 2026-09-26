// Inline demo for lesson monte-carlo: draw risk-neutral outcomes one batch at a time for Kai's 1-year 100 call
// (S = 100, σ = 20%, r = 4%) and watch the running estimate, its standard error and the 95% band close in on 9.93.
// Seed 2026 reproduces the ten draws in the lesson's table.
import * as O from "./_opt.js";
import { lineChart, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S0 = 100, K = 100, Tm = 1, r = 0.04, sigma = 0.2;
  const drift = (r - 0.5 * sigma * sigma) * Tm, vol = sigma * Math.sqrt(Tm), df = Math.exp(-r * Tm);
  const truth = O.bsPrice({ S: S0, K, T: Tm, r, sigma, type: "call" });
  const MAXN = 200000;
  let seed = 2026, R, n, mean, m2, last, hist, nextMark;

  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("亲手抽样：小凯的 1 年期看涨期权", "Draw by hand: Kai's 1-year call")}</div>
    <div class="demo-btns">
      <button class="demo-btn" data-add="1">+1</button>
      <button class="demo-btn" data-add="10">+10</button>
      <button class="demo-btn" data-add="100">+100</button>
      <button class="demo-btn" data-add="1000">+1,000</button>
      <button class="demo-btn" data-add="10000">+10,000</button>
      <button class="demo-btn" data-act="reset">${T("重来（同一种子）", "Restart (same seed)")}</button>
      <button class="demo-btn" data-act="seed">${T("换一个种子", "New seed")}</button>
    </div>
    <div class="demo-math" id="mcd-f"></div>
    <div id="mcd-stats"></div>
    <div id="mcd-last" class="demo-out-sm"></div>
    <div id="mcd-chart"></div>
    <p class="demo-tip">${T("看什么：演示一打开就是正文表格里的 10 次抽样（种子 2026），估计值 13.87 美元、误差条很宽。每多按一个数量级，灰色误差带大约收窄到原来的 1/√10 ≈ 0.32；估计值偶尔会跑出带外——95% 的带子本来就会漏掉约 1/20 的时候。", "What to notice: it opens on the ten draws from the table in the text (seed 2026) — an estimate of $13.87 with a wide band. Each extra order of magnitude shrinks the grey band by about 1/√10 ≈ 0.32; the estimate occasionally strays outside it — a 95% band is supposed to miss about one time in twenty.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);

  const reset = () => {
    R = O.rng(seed); n = 0; mean = 0; m2 = 0; last = []; hist = []; nextMark = 1;
  };
  const drawOne = () => {
    const z = R.normal(), ST = S0 * Math.exp(drift + vol * z), pay = Math.max(ST - K, 0), y = df * pay;
    n++; const d = y - mean; mean += d / n; m2 += d * (y - mean);
    last.push([n, z, ST, pay]); if (last.length > 10) last.shift();
    if (n >= nextMark) { const sd = n > 1 ? Math.sqrt(m2 / (n - 1)) : 0; hist.push([Math.log10(n), mean, sd / Math.sqrt(n)]); nextMark = Math.max(n + 1, Math.ceil(n * 1.15)); }
  };
  const fmtN = (v) => (v >= 1000 ? (v / 1000).toLocaleString("en-US", { maximumFractionDigits: 1 }) + "k" : String(Math.round(v)));

  const draw = () => {
    const sd = n > 1 ? Math.sqrt(m2 / (n - 1)) : 0, se = n > 1 ? sd / Math.sqrt(n) : 0;
    const f = n > 1
      ? [String.raw`\hat C_{${n}} = e^{-rT}\,\frac{1}{${n}}\sum_{i=1}^{${n}} \max\!\big(S_T^{(i)} - 100,\,0\big) = ${mean.toFixed(3)}`, String.raw`\text{SE} = \frac{s}{\sqrt{n}} = \frac{${sd.toFixed(2)}}{\sqrt{${n}}} = ${se.toFixed(3)}`]
      : [String.raw`S_T^{(i)} = 100\,e^{(0.04 - \frac12 \cdot 0.2^2) \times 1 + 0.2\sqrt{1}\,Z_i}, \qquad Z_i \sim \mathcal{N}(0,1)`];
    $("#mcd-f").innerHTML = f.map((x) => tex(x, true)).join("");
    const err = mean - truth;
    $("#mcd-stats").innerHTML = stats([
      [T("抽样次数 n", "Draws n"), n.toLocaleString("en-US")],
      [T("蒙特卡洛估计", "Monte Carlo estimate"), n ? "$" + mean.toFixed(3) : "–", "acc"],
      [T("标准误 SE", "Standard error SE"), n > 1 ? "±" + se.toFixed(3) : "–"],
      [T("95% 区间", "95% interval"), n > 1 ? `${(mean - 1.96 * se).toFixed(2)} – ${(mean + 1.96 * se).toFixed(2)}` : "–"],
      [T("公式价（BS）", "Formula (BS)"), "$" + truth.toFixed(3)],
      [T("误差 / SE", "Error / SE"), n > 1 && se > 0 ? (err / se).toFixed(2) : "–", n > 1 && Math.abs(err) > 1.96 * se ? "neg" : "pos"],
    ]);
    $("#mcd-last").innerHTML = last.length
      ? `<div class="demo-label">${T("最近的抽样（最多 10 次）", "Latest draws (up to 10)")}</div><table><thead><tr><th>#</th><th>${tex("Z")}</th><th>${tex("S_T")}</th><th>${T("收益", "Payoff")}</th></tr></thead><tbody>${last.map(([i, z, s, p]) => `<tr${p > 0 ? ' class="itm"' : ""}><td>${i.toLocaleString("en-US")}</td><td>${z.toFixed(2)}</td><td>${s.toFixed(2)}</td><td>${p.toFixed(2)}</td></tr>`).join("")}</tbody></table>`
      : T("还没有抽样——按 +1 开始。", "No draws yet — press +1 to start.");
    const pts = hist.map(([x, m]) => [x, m]);
    const up = hist.filter((h) => h[2] > 0).map(([x, m, s]) => [x, m + 1.96 * s]);
    const lo = hist.filter((h) => h[2] > 0).map(([x, m, s]) => [x, m - 1.96 * s]);
    const xmax = Math.max(1, Math.ceil(Math.log10(Math.max(n, 10))));
    $("#mcd-chart").innerHTML = lineChart({
      xmin: 0, xmax, ymin: 0, ymax: 30, xstep: 1,
      xlabel: T("抽样次数 n（对数刻度）", "Number of draws n (log scale)"), ylabel: T("估计价格", "Estimate"),
      xfmt: (v) => fmtN(10 ** v), yfmt: (v) => "$" + v,
      series: [
        { points: up, cls: 5, dashed: true, label: T("估计 ± 1.96 SE", "Estimate ± 1.96 SE") },
        { points: lo, cls: 5, dashed: true },
        { points: pts, cls: 0, label: T("累计平均", "Running average"), dots: pts.length < 40 },
      ],
      hlines: [{ y: truth, label: T("BS 公式 9.93", "BS formula 9.93") }],
    });
    root.querySelectorAll("[data-add]").forEach((b) => { b.disabled = n + +b.dataset.add > MAXN; });
  };

  root.querySelectorAll("[data-add]").forEach((b) => b.addEventListener("click", () => {
    const k = Math.min(+b.dataset.add, MAXN - n);
    for (let i = 0; i < k; i++) drawOne();
    draw();
  }));
  root.querySelectorAll("[data-act]").forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.act === "seed") seed = (seed * 7919 + 13) % 100003;
    reset(); draw();
  }));
  reset();
  for (let i = 0; i < 10; i++) drawOne(); // open on the ten draws of the lesson's table
  draw();
}
