// Main demo for lesson retail-flows: a stylised gamma-squeeze simulator for XYZ.
// Customers buy out-of-the-money calls; dealers are short them and delta-hedge with stock: hedge shares H = Δ × OI × 100.
// Each day an outside "sentiment" push moves the price; dealer hedging adds (H_new − H_old) / D, solved as a fixed point.
// Compare with the same pushes when dealers hedge with other options instead of stock (no feedback into XYZ).
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

const r = 0.04, SIG = 0.2;
const hedgeShares = (S, K, days, oi) => (days <= 0 ? (S > K ? oi * 100 : 0) : O.greeks({ S, K, T: days / 365, r, sigma: SIG, type: "call" }).delta * oi * 100);

export function simulate({ oi, K, depth, days, push, feedback, seed }) {
  const R = O.rng(seed);
  let S = 100, H = feedback ? hedgeShares(S, K, days, oi) : 0, unstable = false;
  const path = [[0, S]], hedge = [[0, H]];
  let bought = 0, peak = S;
  for (let d = 1; d <= days; d++) {
    // sentiment: buying for the first half of the period, fading after it
    const eps = (d <= Math.ceil(days / 2) ? push : -push * 0.6) + 0.3 * R.normal();
    const left = days - d;
    let x = Math.max(1, S + eps);
    if (feedback) {
      for (let i = 0; i < 60; i++) {
        const nx = Math.max(1, S + eps + (hedgeShares(x, K, left, oi) - H) / depth);
        if (Math.abs(nx - x) < 1e-6) { x = nx; break; }
        x = 0.5 * x + 0.5 * nx; // damped iteration
      }
      if (x > S * 1.3) { x = S * 1.3; unstable = true; } // cap a runaway day at +30%
      const nH = hedgeShares(x, K, left, oi);
      bought = Math.max(bought, nH);
      H = nH;
    }
    S = x; peak = Math.max(peak, S);
    path.push([d, S]); hedge.push([d, H]);
  }
  return { path, hedge, peak, bought, unstable, end: S };
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let K = 110, seed = 5;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("Gamma 挤压模拟器：散户买看涨，做市商买股票", "Gamma-squeeze simulator: customers buy calls, dealers buy stock")}</div>
    <div class="demo-row">${seg("rf-k", [["105", T("行权价 105", "Strike 105")], ["110", T("行权价 110", "Strike 110")], ["115", T("行权价 115", "Strike 115")]], String(K))}
      <div class="demo-btns" style="margin:0"><button type="button" class="demo-btn" data-act="seed">${T("换一组随机噪声", "New random noise")}</button></div></div>
    <div class="demo-grid">
      ${slider("rf-oi", T("客户买入的看涨（千张）", "Calls bought by customers (thousand contracts)"), 0, 100, 5, 40)}
      ${slider("rf-d", T("市场深度 D（推动 1 美元的股数，千股）", "Market depth D (shares to move $1, thousands)"), 100, 3000, 100, 500)}
      ${slider("rf-t", T("离到期天数", "Days to expiry"), 10, 30, 1, 20)}
      ${slider("rf-p", T("情绪买盘：前半段每天推动（美元）", "Sentiment push per day, first half ($)"), 0, 2, 0.1, 0.8)}
    </div>
    <div class="demo-math" id="rf-f"></div>
    <div id="rf-chart"></div>
    <div id="rf-stats"></div>
    <p class="demo-tip">${T("试试：把深度 D 调到 20 万股、看涨调到 8 万张，同样的情绪买盘被放大好几倍；再把深度调到 200 万股，“挤压”几乎消失。这正是争论的核心：机制成立，但它有多大取决于持仓相对流动性的规模。", "Try this: set depth D to 200k shares and the calls to 80k contracts and the same sentiment push is amplified several times; raise depth to 2M shares and the “squeeze” almost disappears. That is the heart of the debate: the mechanism is real, but its size depends on positions relative to liquidity.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const oi = v["rf-oi"] * 1000, depth = v["rf-d"] * 1000, days = v["rf-t"], push = v["rf-p"];
    const a = simulate({ oi, K, depth, days, push, feedback: true, seed });
    const b = simulate({ oi, K, depth, days, push, feedback: false, seed });
    const g0 = O.greeks({ S: 100, K, T: days / 365, r, sigma: SIG, type: "call" });
    const d4 = g0.delta < 0.1 ? g0.delta.toFixed(4) : g0.delta.toFixed(3);
    const p3 = g0.price.toFixed(3), prem = +p3 * oi * 100;
    const n = (x) => Math.round(x).toLocaleString("en-US").replace(/,/g, "{,}");
    $("#rf-f").innerHTML = tex(String.raw`\begin{aligned} H_0 &= \Delta \times \text{OI} \times 100 \\ &= ${d4} \times ${n(oi)} \times 100 \\ &\approx ${n(g0.delta * oi * 100)}\ \text{${T("股（第 0 天的对冲）", "shares (day-0 hedge)")}} \end{aligned}`, true)
      + tex(String.raw`\begin{aligned} \text{${T("权利金", "premium")}} &= ${p3} \times 100 \times ${n(oi)} \\ &= \$${n(prem)} \end{aligned}`, true);
    $("#rf-chart").innerHTML = lineChart({
      xmin: 0, xmax: days, xlabel: T("天", "Day"), ylabel: "XYZ",
      series: [
        { points: b.path, cls: 5, dashed: true, label: T("做市商不用股票对冲（无反馈）", "Dealers hedge without stock (no feedback)") },
        { points: a.path, cls: 2, label: T("做市商用股票做 Delta 对冲", "Dealers delta-hedge with stock") },
      ],
      hlines: [{ y: K, label: "K " + K }],
    });
    const rise = (x) => x.peak - 100;
    const share = rise(a) > 0.01 ? Math.max(0, 1 - rise(b) / rise(a)) : 0;
    $("#rf-stats").innerHTML = stats([
      [T("最高价：有对冲反馈", "Peak: with hedging feedback"), "$" + a.peak.toFixed(2), "neg"],
      [T("最高价：无反馈", "Peak: no feedback"), "$" + b.peak.toFixed(2)],
      [T("涨幅中来自对冲的比例", "Share of the rise from hedging"), (share * 100).toFixed(0) + "%", "acc"],
      [T("做市商最多持有的对冲股数", "Most shares dealers held as a hedge"), Math.round(a.bought).toLocaleString("en-US")],
      [T("到期价：有反馈 / 无反馈", "Price at expiry: feedback / none"), "$" + a.end.toFixed(2) + " / $" + b.end.toFixed(2)],
      ...(a.unstable ? [[T("警告", "Warning"), T("反馈失控：某天涨幅被封顶在 30%", "Runaway feedback: a day was capped at +30%"), "neg"]] : []),
    ]);
  };
  const spec = { "rf-oi": (x) => x + "k", "rf-d": (x) => x + "k", "rf-t": (x) => x, "rf-p": (x) => "$" + (+x).toFixed(1) };
  const rerun = bindSliders(root, spec, draw);
  onSeg(root, "rf-k", (x) => { K = +x; rerun(); });
  root.querySelector('[data-act="seed"]').addEventListener("click", () => { seed = (seed * 31 + 7) % 997; rerun(); });
}
