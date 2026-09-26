// Main demo for lesson position-sizing: the Kelly growth curve g(f) and simulated wealth paths for a chosen bet fraction.
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

// Simulate `paths` gamblers who each bet fraction f of wealth, n times, on a bet that wins b×stake with prob p.
function simulate(f, p, b, n, paths, seed, keep) {
  const R = O.rng(seed), finals = [], kept = [];
  let hitDD = 0;
  for (let k = 0; k < paths; k++) {
    let w = 1, peak = 1, dd = false;
    const pts = k < keep ? [[0, 1]] : null;
    for (let i = 1; i <= n; i++) {
      w *= R() < p ? 1 + f * b : 1 - f;
      if (w > peak) peak = w;
      if (w <= peak * 0.5) dd = true;
      if (pts && (i % Math.max(1, Math.floor(n / 100)) === 0 || i === n)) pts.push([i, Math.max(w, 1e-6)]);
    }
    if (dd) hitDD++;
    finals.push(w);
    if (pts) kept.push(pts);
  }
  finals.sort((a, c) => a - c);
  return { kept, median: finals[paths >> 1], pDD: hitDD / paths, pLoss: finals.filter((x) => x < 1).length / paths };
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let seed = 7;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("凯利曲线与财富路径：同一个优势，不同的下注比例", "Kelly curve and wealth paths: one edge, different bet sizes")}</div>
    <div class="demo-btns">
      <button class="demo-btn" data-pre="coin">${T("55% 胜率、1 赔 1", "55% win, 1:1 payoff")}</button>
      <button class="demo-btn" data-pre="lottery">${T("买虚值期权型：20% 胜率、1 赔 5", "Option-buyer style: 20% win, pays 5:1")}</button>
      <button class="demo-btn" data-pre="seller">${T("卖权利金型：80% 胜率、1 赔 0.3", "Premium-seller style: 80% win, pays 0.3:1")}</button>
    </div>
    <div class="demo-grid">
      ${slider("ps-p", T("胜率 p", "Win probability p"), 5, 95, 1, 55)}
      ${slider("ps-b", T("赔率 b（赢时赚下注额的 b 倍）", "Payoff ratio b (a win earns b × the stake)"), 0.1, 5, 0.1, 1)}
      ${slider("ps-m", T("实际下注 = 凯利比例的几倍", "Actual bet = multiple of the Kelly fraction"), 0, 3, 0.05, 1)}
      ${slider("ps-n", T("下注次数", "Number of bets"), 50, 500, 10, 100)}
    </div>
    <div class="demo-math" id="ps-f"></div>
    <div id="ps-stats"></div>
    <div class="demo-label">${T("每次下注的期望对数增长 g(f)：峰顶就是凯利比例", "Expected log growth per bet g(f): the peak is the Kelly fraction")}</div>
    <div id="ps-curve"></div>
    <div class="demo-label">${T("20 条模拟财富路径（对数刻度，起点 = 1）", "20 simulated wealth paths (log scale, start = 1)")}</div>
    <div id="ps-paths"></div>
    <div class="demo-btns"><button class="demo-btn" id="ps-seed">${T("换一组运气（新随机种子）", "New luck (new random seed)")}</button></div>
    <p class="demo-tip">${T("试试：55% / 1 赔 1 时把倍数拉到 2，增长率几乎归零、路径中位数原地踏步；拉到 0.5（半凯利），增长只少四分之一，回撤却小得多。再点“卖权利金型”，把胜率从 80% 往下调几个点，看凯利比例多快变成 0。", "Try this: at 55% / 1:1, push the multiple to 2 — growth drops to about zero and the median path goes nowhere; at 0.5 (half Kelly) you keep three-quarters of the growth with far smaller drawdowns. Then load the premium-seller preset and lower the win rate a few points: watch how fast the Kelly fraction hits 0.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const p = v["ps-p"] / 100, b = v["ps-b"], m = v["ps-m"], n = v["ps-n"];
    const fStar = O.kellyFraction(p, b);
    const edge = p * b - (1 - p);
    let f = Math.max(fStar, 0) * m, capped = false;
    if (f > 0.99) { f = 0.99; capped = true; }
    $("#ps-f").innerHTML =
      tex(String.raw`f^* = p - \frac{1-p}{b} = ${p.toFixed(2)} - \frac{${(1 - p).toFixed(2)}}{${b.toFixed(1)}} = ${fStar.toFixed(3)}`, true) +
      tex(String.raw`g(f) = p\ln(1+fb) + (1-p)\ln(1-f)`, true) +
      tex(String.raw`f = ${f.toFixed(3)} \;\Rightarrow\; g = ${O.kellyGrowth(f, p, b).toFixed(5)}`, true);
    const sim = simulate(f, p, b, n, 2000, seed, 20);
    const gMax = fStar > 0 ? O.kellyGrowth(fStar, p, b) : 0;
    const gF = O.kellyGrowth(f, p, b);
    $("#ps-stats").innerHTML = stats([
      [T("每注期望收益（按 1 元下注）", "Expected profit per $1 staked"), (edge >= 0 ? "+" : "−") + "$" + Math.abs(edge).toFixed(3), edge > 0 ? "pos" : "neg"],
      [T("凯利比例 f*", "Kelly fraction f*"), fStar > 0 ? (fStar * 100).toFixed(1) + "%" : T("0（没有优势）", "0 (no edge)"), "acc"],
      [T("你的下注比例", "Your bet fraction"), (f * 100).toFixed(1) + "%" + (capped ? T("（封顶）", " (capped)") : "")],
      [T("增长率占最大值", "Growth vs the maximum"), gMax > 0 ? ((gF / gMax) * 100).toFixed(0) + "%" : "–"],
      [T("中位数终值（× 本金）", "Median final wealth (× start)"), "×" + sim.median.toFixed(2), sim.median >= 1 ? "pos" : "neg"],
      [T("途中出现 −50% 回撤的概率", "Chance of a −50% drawdown on the way"), (sim.pDD * 100).toFixed(0) + "%", sim.pDD > 0.2 ? "neg" : ""],
    ]);
    const xmax = Math.min(0.99, Math.max(0.05, 2.4 * Math.max(fStar, 0), f * 1.15));
    const marks = [];
    const nearKelly = fStar > 0 && Math.abs(f - fStar) < 0.08 * xmax;
    if (fStar > 0) marks.push({ x: fStar, label: nearKelly ? "" : "f*" });
    $("#ps-curve").innerHTML = lineChart({
      xmin: 0, xmax, H: 220, xlabel: T("每次下注占本金的比例 f", "Fraction of wealth per bet f"), ylabel: "g(f)",
      xfmt: (x) => (x * 100).toFixed(0) + "%", yfmt: (y) => y.toFixed(3),
      series: [{ f: (x) => O.kellyGrowth(x, p, b), cls: 0, label: T("期望对数增长", "Expected log growth") }],
      markers: marks, points: [{ x: f, y: gF, cls: 2, label: nearKelly ? T("你 ≈ f*", "you ≈ f*") : T("你", "you") }],
    });
    const all = sim.kept.flat().map((q) => q[1]);
    const lo = Math.max(1e-3, Math.min(...all)), hi = Math.max(...all, 1.5);
    $("#ps-paths").innerHTML = lineChart({
      xmin: 0, xmax: n, logY: true, ymin: lo, ymax: hi, H: 240, xlabel: T("第几次下注", "Bet number"), ylabel: T("财富（× 本金）", "Wealth (× start)"),
      yfmt: (y) => "×" + (y >= 1 ? y.toFixed(0) : y.toPrecision(1)),
      series: sim.kept.map((pts, i) => ({ points: pts, cls: i % 2 ? 5 : 0 })),
      hlines: [{ y: 1, label: T("本金", "start") }],
    });
  };
  const run = bindSliders(root, { "ps-p": (x) => x + "%", "ps-b": (x) => (+x).toFixed(1), "ps-m": (x) => "×" + (+x).toFixed(2), "ps-n": (x) => x }, draw);
  $("#ps-seed").addEventListener("click", () => { seed += 1; run(); });
  const set = (vals) => { for (const [id, x] of Object.entries(vals)) $("#" + id).value = x; run(); };
  root.querySelectorAll("[data-pre]").forEach((btn) => btn.addEventListener("click", () => {
    const k = btn.dataset.pre;
    if (k === "coin") set({ "ps-p": 55, "ps-b": 1, "ps-m": 1 });
    else if (k === "lottery") set({ "ps-p": 20, "ps-b": 5, "ps-m": 1 });
    else set({ "ps-p": 80, "ps-b": 0.3, "ps-m": 1 });
  }));
}
