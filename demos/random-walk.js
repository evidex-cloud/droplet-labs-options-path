// Main demo for lesson random-walk: simulate geometric Brownian motion paths for XYZ and draw the ±1σ / ±2σ cone
// (symmetric in log price). Counts how many simulated end points fall inside each band, and compares the simulated
// mean and median with the lognormal formulas.
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let seed = 21;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("随机游走模拟器：路径与 √T 锥", "Random-walk simulator: paths and the √T cone")}</div>
    <div class="demo-grid">
      ${slider("rw-v", T("波动率 σ", "Volatility σ"), 5, 80, 1, 20)}
      ${slider("rw-mu", T("漂移 μ", "Drift μ"), -20, 30, 1, 4)}
      ${slider("rw-days", T("期限（日历日）", "Horizon (calendar days)"), 5, 730, 5, 365)}
      ${slider("rw-n", T("模拟路径数", "Simulated paths"), 20, 400, 10, 200)}
    </div>
    <div class="demo-btns"><button class="demo-btn" data-new="1">${T("换一批路径", "New paths")}</button></div>
    <div id="rw-chart"></div>
    <div class="demo-math" id="rw-f"></div>
    <div id="rw-stats"></div>
    <p class="demo-tip">${T("试试：把期限从 30 天拉到 730 天，锥口按 √T 张开，而不是按直线；把 σ 拉到 60%，锥变得明显不对称，均值远高于中位数（波动率拖累）。无论怎么调，落在 ±1σ 内的终点都在 68% 左右。", "Try this: stretch the horizon from 30 to 730 days and the cone opens like √T, not like a straight wedge. Push σ to 60% and the cone turns visibly lopsided, with the mean far above the median (volatility drag). Whatever you set, about 68% of end points land inside ±1σ.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const S0 = 100;
  const draw = (v) => {
    const sigma = v["rw-v"] / 100, mu = v["rw-mu"] / 100, days = v["rw-days"], n = v["rw-n"];
    const Tm = days / 365, steps = Math.min(days, 150), R = O.rng(seed);
    const paths = [];
    for (let i = 0; i < n; i++) paths.push(O.gbmPath(R, S0, mu, sigma, Tm, steps));
    const tAt = (j) => (j * days) / steps;
    const band = (k) => Array.from({ length: steps + 1 }, (_, j) => { const t = (j * Tm) / steps; return [tAt(j), S0 * Math.exp((mu - sigma * sigma / 2) * t + k * sigma * Math.sqrt(t))]; });
    const series = paths.slice(0, 20).map((p) => ({ points: p.map((s, j) => [tAt(j), s]), cls: 5 }));
    series.push({ points: band(2), cls: 1, dashed: true, label: "±2σ" }, { points: band(-2), cls: 1, dashed: true });
    series.push({ points: band(1), cls: 0, label: "±1σ" }, { points: band(-1), cls: 0 });
    series.push({ points: band(0), cls: 3, dashed: true, label: T("中位数路径", "median path") });
    const hi = band(2)[steps][1] * 1.08, lo = Math.max(0, band(-2)[steps][1] * 0.9);
    $("#rw-chart").innerHTML = lineChart({ series, xmin: 0, xmax: days, ymin: lo, ymax: hi, xlabel: T("天数", "days"), ylabel: T("XYZ 价格", "XYZ price"), H: 300 });
    // statistics of the end points
    const ends = paths.map((p) => p[steps]), m = (mu - sigma * sigma / 2) * Tm, s = sigma * Math.sqrt(Tm);
    const zs = ends.map((x) => (Math.log(x / S0) - m) / s);
    const in1 = zs.filter((z) => Math.abs(z) <= 1).length / n, in2 = zs.filter((z) => Math.abs(z) <= 2).length / n;
    const mean = ends.reduce((a, x) => a + x, 0) / n, sorted = [...ends].sort((a, b) => a - b), median = sorted[Math.floor(n / 2)];
    const below0 = ends.filter((x) => x < S0).length / n;
    $("#rw-f").innerHTML = tex(String.raw`\ln S_T \sim \mathcal{N}\big(\ln 100 + (${mu.toFixed(2)} - \tfrac12 \cdot ${sigma.toFixed(2)}^2)\times ${Tm.toFixed(3)},\ (${sigma.toFixed(2)}\sqrt{${Tm.toFixed(3)}})^2\big),\qquad \sigma\sqrt{T} = ${s.toFixed(3)}`, true) +
      tex(String.raw`\E[S_T] = 100\,e^{\mu T} = ${(S0 * Math.exp(mu * Tm)).toFixed(2)},\qquad \operatorname{median} = 100\,e^{(\mu - \frac12\sigma^2)T} = ${(S0 * Math.exp(m)).toFixed(2)}`, true);
    $("#rw-stats").innerHTML = stats([
      [T("落在 ±1σ 内（理论 68.3%）", "Inside ±1σ (theory 68.3%)"), (in1 * 100).toFixed(1) + "%", "acc"],
      [T("落在 ±2σ 内（理论 95.4%）", "Inside ±2σ (theory 95.4%)"), (in2 * 100).toFixed(1) + "%"],
      [T("模拟均值 / 理论均值", "Simulated / theoretical mean"), `${mean.toFixed(1)} / ${(S0 * Math.exp(mu * Tm)).toFixed(1)}`],
      [T("模拟中位数 / 理论中位数", "Simulated / theoretical median"), `${median.toFixed(1)} / ${(S0 * Math.exp(m)).toFixed(1)}`],
      [T("终点低于起点的比例", "Share ending below 100"), (below0 * 100).toFixed(1) + "%"],
      [T("1σ 幅度（美元，近似）", "1σ move ($, approx.)"), "$" + (S0 * s).toFixed(2)],
    ]);
  };
  const run = bindSliders(root, { "rw-v": (x) => x + "%", "rw-mu": (x) => x + "%", "rw-days": (x) => x + T(" 天", " days"), "rw-n": (x) => String(x) }, draw);
  root.querySelector("[data-new]").addEventListener("click", () => { seed += 1000; run(); });
}
