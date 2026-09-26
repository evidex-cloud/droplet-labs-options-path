// Inline demo for lesson black-scholes: the two terms of the formula as "what you receive" minus "what you pay",
// and N(d2) as an area under the bell curve.
import * as O from "./_opt.js";
import { slider, bindSliders, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("把公式拆成两根柱子", "The formula as two bars")}</div>
    <div class="demo-grid">
      ${slider("bst-s", T("现价 S", "Spot S"), 70, 130, 1, 100)}
      ${slider("bst-v", T("波动率 σ", "Volatility σ"), 5, 60, 1, 20)}
    </div>
    <div id="bst-bars"></div>
    <div id="bst-bell"></div>
    <p class="demo-tip">${T("看什么：蓝柱是“到期可能拿到的股票（折成今天）”，紫柱是“可能要付的行权价（折成今天）”，差就是看涨价。S 往上拉，两根柱子都变长，但蓝柱长得更快。", "What to notice: the blue bar is the stock you may receive (in today's money), the violet bar the strike you may pay (in today's money); the call is the gap. Raise S and both bars grow, the blue one faster.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const K = 100, Tm = 1, r = 0.04;
  bindSliders(root, { "bst-s": (x) => "$" + x, "bst-v": (x) => x + "%" }, (v) => {
    const S = v["bst-s"], sigma = v["bst-v"] / 100;
    const { d1, d2 } = O.d1d2({ S, K, T: Tm, r, sigma });
    const recv = S * O.normCdf(d1), pay = K * Math.exp(-r * Tm) * O.normCdf(d2), c = recv - pay;
    const max = Math.max(S, K) * 1.05;
    const bar = (label, val, color) => `<div class="bar2"><span class="lab" style="width:150px">${label}</span><span class="track"><span class="fill" style="display:block;width:${(val / max) * 100}%;background:${color}"></span></span><span class="val">$${val.toFixed(2)}</span></div>`;
    $("#bst-bars").innerHTML =
      bar(T("收到 ", "Receive ") + tex(String.raw`S\,\N(d_1)`), recv, "var(--orange)") +
      bar(T("付出 ", "Pay ") + tex(String.raw`Ke^{-rT}\N(d_2)`), pay, "var(--blue)") +
      `<div class="demo-math">${tex(String.raw`C = ${recv.toFixed(2)} - ${pay.toFixed(2)} = ${c.toFixed(2)} \qquad (K = 100,\ T = 1,\ r = 4\%)`, true)}</div>`;
    // bell curve with the area N(d2) shaded: z > −d2 corresponds to finishing in the money
    const W = 600, H = 170, m = 30, X = (z) => m + ((z + 4) / 8) * (W - 2 * m), Y = (y) => H - 28 - y * 320;
    let path = "", area = `M ${X(-d2).toFixed(1)},${Y(0)} `;
    for (let i = 0; i <= 160; i++) { const z = -4 + (8 * i) / 160, y = O.normPdf(z); path += `${i ? "L" : "M"}${X(z).toFixed(1)},${Y(y).toFixed(1)} `; if (z >= -d2) area += `L${X(z).toFixed(1)},${Y(y).toFixed(1)} `; }
    area += `L ${X(4)},${Y(0)} Z`;
    $("#bst-bell").innerHTML = `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img">
      <path d="${area}" class="area0"/><path d="${path}" class="s0" fill="none"/>
      <line class="axis" x1="${m}" y1="${Y(0)}" x2="${W - m}" y2="${Y(0)}"/>
      <line class="marker" x1="${X(-d2)}" y1="20" x2="${X(-d2)}" y2="${Y(0)}"/>
      <text class="lbl" x="${X(-d2) + (d2 < 0 ? 8 : -8)}" y="${Y(0) - 8}" text-anchor="${d2 < 0 ? "start" : "end"}">z = −d₂ = ${(-d2).toFixed(2)}</text>
      <text class="lbl" x="${W - m}" y="${H - 8}" text-anchor="end">${T("阴影面积 = N(d₂) = 到期实值的风险中性概率", "shaded area = N(d₂) = risk-neutral probability of finishing ITM")} = ${(O.normCdf(d2) * 100).toFixed(1)}%</text>
    </svg></div>`;
  });
}
