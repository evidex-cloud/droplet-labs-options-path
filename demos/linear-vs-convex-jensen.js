// Inline demo for lesson linear-vs-convex: Jensen's inequality with a whole distribution of outcomes.
// XYZ's price at expiry is lognormal with average exactly 100 (zero drift, zero rates). The call's average payoff
// E[max(S_T − 100, 0)] is positive and grows with σ√T, while the payoff at the average price stays 0.
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("很多个结局：不确定性本身有价值", "Many outcomes: uncertainty itself is worth something")}</div>
    <div class="demo-grid">
      ${slider("lvj-v", T("波动率 σ", "Volatility σ"), 5, 80, 1, 20)}
      ${slider("lvj-d", T("到期天数", "Days to expiry"), 1, 365, 1, 30)}
    </div>
    <div class="demo-math" id="lvj-f"></div>
    <div id="lvj-stats"></div>
    <div id="lvj-chart"></div>
    <p class="demo-tip">${T("看什么：分布的平均值永远是 100，所以“平均价处的收益”永远是 0；可分布越宽（σ 越大、时间越长），落在 100 以上的那部分越远，看涨期权的平均收益就越大——近似 0.4 × 100 × σ × √T。", "What to notice: the average of the distribution is always 100, so the payoff at the average is always 0; but the wider the distribution (bigger σ, more time), the further its right side reaches, and the call's average payoff grows — roughly 0.4 × 100 × σ × √T.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const sigma = v["lvj-v"] / 100, Tm = v["lvj-d"] / 365;
    // With zero drift and zero rates, Black-Scholes is exactly the average payoff E[max(S_T − 100, 0)].
    const Ef = O.bsPrice({ S: 100, K: 100, T: Tm, r: 0, sigma, type: "call" });
    const approx = 0.4 * 100 * sigma * Math.sqrt(Tm);
    const sd = sigma * Math.sqrt(Tm);
    const lo = Math.max(1, 100 * Math.exp(-3.2 * sd)), hi = 100 * Math.exp(3.2 * sd);
    $("#lvj-f").innerHTML = tex(String.raw`\E\big[\max(S_T - 100,\,0)\big] = ${Ef.toFixed(2)} \;\ge\; \max\big(\E[S_T] - 100,\,0\big) = 0`, true)
      + tex(String.raw`0.4\,S\sigma\sqrt{T} = 0.4 \times 100 \times ${sigma.toFixed(2)} \times \sqrt{${v["lvj-d"]}/365} \approx ${approx.toFixed(2)}`, true);
    $("#lvj-stats").innerHTML = stats([
      [T("到期价格的平均值", "Average price at expiry"), "$100.00"],
      [T("平均价处的收益", "Payoff at the average price"), "$0.00"],
      [T("看涨期权的平均收益", "Average call payoff"), "$" + Ef.toFixed(2), "acc"],
      [T("一个标准差的波动", "One standard deviation"), "±$" + (100 * sd).toFixed(2)],
    ]);
    $("#lvj-chart").innerHTML = lineChart({
      xmin: lo, xmax: hi, xlabel: T("到期时 XYZ 的价格", "XYZ price at expiry"), ylabel: T("可能性（密度）", "Likelihood (density)"), yfmt: () => "",
      series: [{ f: (x) => O.lognormalPdf(x, 100, Tm, sigma, 0), cls: 0, area: true, label: T("到期价格的分布（平均 = 100）", "Distribution of the price at expiry (average = 100)") }],
      bands: [{ x0: 100, x1: hi, cls: 1, label: T("看涨期权有收益的区域", "where the call pays") }],
      markers: [{ x: 100, label: "K = 100" }],
    });
  };
  bindSliders(root, { "lvj-v": (x) => x + "%", "lvj-d": (x) => x + T(" 天", " days") }, draw);
}
