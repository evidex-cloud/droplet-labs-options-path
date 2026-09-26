// Inline demo for lesson risk-neutral: the real-world distribution (drift μ) vs the risk-neutral one (drift r).
// Moving μ shifts the ℙ curve and the real-world odds; the option price (from ℚ) does not move. Moving σ changes both.
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("ℙ 与 ℚ：只差一个漂移", "ℙ and ℚ: one drift apart")}</div>
    <div class="demo-grid">
      ${slider("rnd-mu", T("真实期望收益 μ", "Real expected return μ"), -10, 25, 1, 10)}
      ${slider("rnd-v", T("波动率 σ", "Volatility σ"), 10, 40, 1, 20)}
    </div>
    <div id="rnd-chart"></div>
    <div class="demo-math" id="rnd-f"></div>
    <div id="rnd-stats"></div>
    <p class="demo-tip">${T("看什么：拖 μ，虚线（真实世界 ℙ）左右平移，真实的实值概率跟着变，但期权价格一分不动；拖 σ，两条曲线一起变宽，价格才变。1 年期、行权价 100，S = 100，r = 4%。", "What to notice: drag μ and the dashed real-world curve ℙ slides left and right, and the real odds of finishing in the money change, yet the option price does not move a cent. Drag σ and both curves widen together, and only then does the price change. 1-year, 100-strike call; S = 100, r = 4%.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const S = 100, K = 100, Tm = 1, r = 0.04;
  bindSliders(root, { "rnd-mu": (x) => x + "%", "rnd-v": (x) => x + "%" }, (v) => {
    const mu = v["rnd-mu"] / 100, sigma = v["rnd-v"] / 100;
    const price = O.bsPrice({ S, K, T: Tm, r, sigma, type: "call" });
    const pQ = O.probAbove(S, K, Tm, sigma, r), pP = O.probAbove(S, K, Tm, sigma, mu);
    // fixed vertical scale per σ: the tallest curve the μ slider can produce (μ = −10%)
    const peak = (m0) => { const s = sigma * Math.sqrt(Tm), xm = Math.exp(Math.log(S) + (m0 - sigma * sigma / 2) * Tm - s * s); return O.lognormalPdf(xm, S, Tm, sigma, m0); };
    const ymax = peak(-0.1) * 1.05;
    $("#rnd-chart").innerHTML = lineChart({
      xmin: 30, xmax: 220, ymin: 0, ymax, xlabel: T("一年后的 XYZ 价格", "XYZ price in one year"), yfmt: () => "",
      series: [
        { f: (x) => O.lognormalPdf(x, S, Tm, sigma, r), cls: 0, area: true, label: T("ℚ：漂移 r = 4%（定价用）", "ℚ: drift r = 4% (used for pricing)") },
        { f: (x) => O.lognormalPdf(x, S, Tm, sigma, mu), cls: 1, dashed: true, label: T("ℙ：漂移 μ（真实世界）", "ℙ: drift μ (real world)") },
      ],
      markers: [{ x: K, label: "K = 100" }],
    });
    $("#rnd-f").innerHTML = tex(String.raw`\P:\ \ln S_T \sim \mathcal{N}\big(\ln 100 + (${mu.toFixed(2)} - \tfrac12 \cdot ${sigma.toFixed(2)}^2),\ ${sigma.toFixed(2)}^2\big)`, true) + tex(String.raw`\Q:\ \ln S_T \sim \mathcal{N}\big(\ln 100 + (0.04 - \tfrac12 \cdot ${sigma.toFixed(2)}^2),\ ${sigma.toFixed(2)}^2\big)`, true) +
      tex(String.raw`C = e^{-rT}\,\E^{\Q}[\max(S_T - 100, 0)] = ${price.toFixed(2)}`, true);
    $("#rnd-stats").innerHTML = stats([
      [T("期权价格（来自 ℚ）", "Option price (from ℚ)"), "$" + price.toFixed(2), "acc"],
      [T("ℚ 下实值概率", "ℚ chance of ITM"), (pQ * 100).toFixed(1) + "%"],
      [T("ℙ 下实值概率", "ℙ chance of ITM"), (pP * 100).toFixed(1) + "%"],
      [T("ℚ 下的平均终值", "Average end price under ℚ"), "$" + (S * Math.exp(r * Tm)).toFixed(2)],
      [T("ℙ 下的平均终值", "Average end price under ℙ"), "$" + (S * Math.exp(mu * Tm)).toFixed(2)],
    ]);
  });
}
