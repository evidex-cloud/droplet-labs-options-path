// Inline demo for lesson long-options: elasticity (leverage) Ω = Δ·S/V versus the chance of finishing in the money.
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S = 100, r = 0.04, sigma = 0.2;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("杠杆的价格：弹性 Ω 与实值概率", "The price of leverage: elasticity Ω vs the chance of paying off")}</div>
    <div class="demo-grid">
      ${slider("loe-k", T("看涨行权价 K", "Call strike K"), 85, 115, 1, 100)}
      ${slider("loe-d", T("到期天数", "Days to expiry"), 7, 365, 1, 30)}
    </div>
    <div class="demo-math" id="loe-f"></div>
    <div id="loe-stats"></div>
    <div id="loe-chart"></div>
    <p class="demo-tip">${T("看什么：K 越高，Ω 越大（同样 1% 的股价变动，期权变动的百分比更大），但到期实值的概率同时在塌。拉长天数，整条 Ω 曲线往下压——长期期权更像股票。", "What to notice: the higher the strike, the larger Ω (the same 1% stock move moves the option by more percent), while the chance of finishing in the money collapses. Lengthen the expiry and the whole Ω curve sinks — long-dated options behave more like stock.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  bindSliders(root, { "loe-k": (x) => "$" + x, "loe-d": (x) => x + T(" 天", " days") }, (v) => {
    const K = v["loe-k"], Tm = v["loe-d"] / 365;
    const g = O.greeks({ S, K, T: Tm, r, sigma, type: "call" });
    const om = g.delta * S / g.price;
    $("#loe-f").innerHTML = tex(String.raw`\begin{gathered}\Omega = \Delta \cdot \frac{S}{V} = ${g.delta.toFixed(3)} \times \frac{100}{${g.price.toFixed(2)}} = ${om.toFixed(1)} \\ \Rightarrow\ \text{${T("股价 +1\\%，期权约","stock +1\\%, option about")}} +${om.toFixed(1)}\%\end{gathered}`, true);
    $("#loe-stats").innerHTML = stats([
      [T("期权价（每股）", "Option price (per share)"), "$" + g.price.toFixed(2)],
      [T("弹性 Ω", "Elasticity Ω"), om.toFixed(1) + "×", "acc"],
      [T("风险中性 P(到期实值)", "Risk-neutral P(ITM)"), (g.probITM * 100).toFixed(1) + "%"],
      [T("股价 +1 美元时期权变动", "Option change for +$1 in stock"), "+" + (g.delta / g.price * 100).toFixed(0) + "%"],
    ]);
    const ks = O.range(85, 115, 60);
    $("#loe-chart").innerHTML = lineChart({
      xmin: 85, xmax: 115, ymin: 0, xlabel: T("行权价 K", "Strike K"), ylabel: T("Ω（倍）", "Ω (times)"),
      series: [
        { points: ks.map((k) => { const x = O.greeks({ S, K: k, T: Tm, r, sigma, type: "call" }); return [k, Math.min(x.delta * S / x.price, 80)]; }), cls: 0, label: T("弹性 Ω", "Elasticity Ω") },
        { points: ks.map((k) => [k, O.greeks({ S, K: k, T: Tm, r, sigma, type: "call" }).probITM * 40]), cls: 1, dashed: true, label: T("P(实值) × 40（便于同图比较）", "P(ITM) × 40 (scaled to share the chart)") },
      ],
      markers: [{ x: K, label: "K" }], points: [{ x: K, y: Math.min(om, 80), cls: 0 }],
    });
  });
}
