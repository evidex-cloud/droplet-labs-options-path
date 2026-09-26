// Inline demo for lesson moneyness: the same strike is more or fewer standard deviations away as time changes.
// Standardised moneyness z = ln(K/F) / (σ√T), drawn on a bell curve of the log price at expiry.
import * as O from "./_opt.js";
import { slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S = 100, r = 0.04;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("同一个行权价，离“有价值”有几个标准差？", "Same strike — how many standard deviations from paying?")}</div>
    <div class="demo-grid">
      ${slider("mz-k", T("看涨行权价 K", "Call strike K"), 80, 130, 1, 105)}
      ${slider("mz-d", T("离到期天数", "Days to expiry"), 1, 365, 1, 30)}
      ${slider("mz-v", T("波动率 σ", "Volatility σ"), 5, 80, 1, 20)}
    </div>
    <div class="demo-math" id="mz-f"></div>
    <div id="mz-bell"></div>
    <div id="mz-stats"></div>
    <p class="demo-tip">${T("试试：K = 105 不动，把天数从 7 拉到 365。7 天时它在 1.7 个标准差之外，几乎没人要；一年时只差 0.04 个标准差，几乎就是平值。时间和波动率会把“远”变“近”。", "Try this: keep K = 105 and move days from 7 to 365. At 7 days it is 1.7 standard deviations away and nearly worthless; at one year it is only 0.04 away — practically at the money. Time and volatility turn “far” into “near”.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const K = v["mz-k"], days = v["mz-d"], sigma = v["mz-v"] / 100, Tm = days / 365;
    const F = O.forward(S, Tm, r), sd = sigma * Math.sqrt(Tm), k = Math.log(K / F), z = k / sd;
    const g = O.greeks({ S, K, T: Tm, r, sigma, type: "call" });
    $("#mz-f").innerHTML = tex(String.raw`z = \frac{\ln(K/F)}{\sigma\sqrt{T}} = \frac{\ln(${K}/${F.toFixed(2)})}{${sigma.toFixed(2)} \times \sqrt{${days}/365}} = \frac{${k.toFixed(4)}}{${sd.toFixed(4)}} = ${z.toFixed(2)}`, true);
    // bell curve in z units, the strike marked; shaded area to the right ≈ chance of finishing above K (centre at the forward)
    const W = 600, H = 170, m = 30, X = (x) => m + ((x + 4) / 8) * (W - 2 * m), Y = (y) => H - 30 - y * 320;
    const zc = Math.max(-4, Math.min(4, z));
    let path = "", area = `M ${X(zc).toFixed(1)},${Y(0)} `;
    for (let i = 0; i <= 160; i++) { const x = -4 + (8 * i) / 160, y = O.normPdf(x); path += `${i ? "L" : "M"}${X(x).toFixed(1)},${Y(y).toFixed(1)} `; if (x >= zc) area += `L${X(x).toFixed(1)},${Y(y).toFixed(1)} `; }
    area += `L ${X(4)},${Y(0)} Z`;
    let ticks = "";
    for (let t = -3; t <= 3; t++) ticks += `<line class="grid" x1="${X(t)}" y1="${Y(0)}" x2="${X(t)}" y2="${Y(0) + 5}"/><text class="lbl-axis" x="${X(t)}" y="${Y(0) + 17}" text-anchor="middle">${t > 0 ? "+" : ""}${t}σ</text>`;
    $("#mz-bell").innerHTML = `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img">
      <path d="${area}" class="area0"/><path d="${path}" class="s5" fill="none"/>
      <line class="axis" x1="${m}" y1="${Y(0)}" x2="${W - m}" y2="${Y(0)}"/>${ticks}
      <line class="marker" x1="${X(zc)}" y1="14" x2="${X(zc)}" y2="${Y(0)}"/>
      <text class="lbl" x="${X(zc) + (zc < 2 ? 6 : -6)}" y="26" text-anchor="${zc < 2 ? "start" : "end"}">K = ${K} (z = ${z.toFixed(2)})</text>
      <text class="lbl" x="${X(0)}" y="${Y(0) + 32}" text-anchor="middle">${T("中心 = 远期价 F", "centre = forward F")} = ${F.toFixed(2)}</text>
    </svg></div>`;
    $("#mz-stats").innerHTML = stats([
      [T("一个标准差（美元，约）", "One std. dev. (≈ $)"), "$" + (F * sd).toFixed(2)],
      [T("离 K 的标准差个数 z", "Std. devs to K, z"), z.toFixed(2), "acc"],
      [T("看涨 Δ", "Call Δ"), g.delta.toFixed(3)],
      [T("看涨价格（每股）", "Call price per share"), "$" + g.price.toFixed(2)],
    ]);
  };
  bindSliders(root, { "mz-k": (x) => "$" + x, "mz-d": (x) => x + T(" 天", " days"), "mz-v": (x) => x + "%" }, draw);
}
