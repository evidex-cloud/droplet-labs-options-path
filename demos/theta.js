// Main demo for lesson theta: time-decay curves for ATM / OTM / ITM calls, the live theta formula split into
// its "gamma rent" and "interest" parts, and theta as a share of the price.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let K = 100;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("时间损耗：同一段时间，不同期权融化得不一样快", "Time decay: the same days melt different options at different speeds")}</div>
    <div class="demo-row">${seg("th-k", [["95", T("实值 95", "ITM 95")], ["100", T("平值 100", "ATM 100")], ["105", T("虚值 105", "OTM 105")], ["110", T("虚值 110", "OTM 110")]], "100")}</div>
    <div class="demo-grid">
      ${slider("th-d", T("剩余天数", "Days left"), 1, 120, 1, 30)}
      ${slider("th-v", T("波动率 σ", "Volatility σ"), 10, 60, 1, 20)}
    </div>
    <div class="demo-math" id="th-f"></div>
    <div id="th-stats"></div>
    <div id="th-v1"></div>
    <div id="th-v2"></div>
    <p class="demo-tip">${T("试试：平值期权把天数从 30 拉到 7 再到 1，每天的 Theta 从 −0.044 变成 −0.084、−0.214；再切到虚值 110，它在 30 天前后就已经“化”掉大半，按比例算每天掉得最快。", "Try this: on the ATM option, drag days from 30 to 7 to 1 — daily theta goes −0.044, −0.084, −0.214. Switch to OTM 110: most of its value is gone by about 30 days, and in percentage terms it melts fastest of all.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const S = 100, r = 0.04;
  const draw = (v) => {
    const days = v["th-d"], sigma = v["th-v"] / 100, Tm = days / 365;
    const o = { S, K, T: Tm, r, sigma, type: "call" };
    const g = O.greeks(o);
    const a = (-S * O.normPdf(g.d1) * sigma) / (2 * Math.sqrt(Tm)), b = -r * K * Math.exp(-r * Tm) * O.normCdf(g.d2);
    $("#th-f").innerHTML = tex(String.raw`\Theta = \underbrace{-\frac{S\,\varphi(d_1)\,\sigma}{2\sqrt{T}}}_{${a.toFixed(2)}} \underbrace{- rKe^{-rT}\N(d_2)}_{${b.toFixed(2)}} = ${(a + b).toFixed(2)}\ \text{${T("每年", "per year")}} \;\Rightarrow\; \frac{${(a + b).toFixed(2)}}{365} = ${g.theta.toFixed(4)}\ \text{${T("每天", "per day")}}`, true);
    const rent = 0.5 * sigma * sigma * S * S * g.gamma / 365;
    $("#th-stats").innerHTML = stats([
      [T("期权价格", "Option price"), "$" + g.price.toFixed(2), "acc"],
      [T("Theta（每张每天）", "Theta (per contract per day)"), O.fmtUsd(g.theta * 100, 2), "neg"],
      [T("每天掉价格的百分之几", "Daily decay as % of price"), g.price > 0.005 ? (Math.abs(g.theta / g.price) * 100).toFixed(1) + "%" : "—"],
      [T("其中 Gamma 租金（每张每天）", "of which gamma rent (per contract/day)"), O.fmtUsd(-rent * 100, 2)],
      [T("盈亏平衡日变动 Sσ/√365", "Breakeven daily move Sσ/√365"), "$" + (S * sigma / Math.sqrt(365)).toFixed(2)],
    ]);
    const val = (k, d) => O.bsPrice({ S, K: k, T: Math.max(d, 0) / 365, r, sigma, type: "call" });
    const ks = [[95, 1], [100, 0], [105, 3], [110, 4]];
    $("#th-v1").innerHTML = lineChart({
      xmin: 0, xmax: 120, H: 250, xlabel: T("剩余天数（0 = 到期日，时间从右往左流）", "Days left (0 = expiry; time flows right to left)"), ylabel: T("期权价格", "Option price"),
      series: ks.map(([k, c]) => ({ f: (d) => val(k, d), cls: c, label: T(`行权价 ${k}`, `Strike ${k}`), dashed: k !== K })),
      points: [{ x: days, y: g.price, cls: 0, label: "$" + g.price.toFixed(2) }], samples: 240,
    });
    $("#th-v2").innerHTML = lineChart({
      xmin: 1, xmax: 120, H: 220, ymax: 0, ymin: 1.08 * Math.min(...ks.map(([k]) => O.greeks({ S, K: k, T: 1 / 365, r, sigma, type: "call" }).theta)), yfmt: (y) => (Math.abs(y) < 1e-9 ? "0" : y.toFixed(2).replace("-", "−")), xlabel: T("剩余天数", "Days left"), ylabel: T("Theta（每股每天）", "Theta (per share per day)"),
      series: ks.map(([k, c]) => ({ f: (d) => O.greeks({ S, K: k, T: d / 365, r, sigma, type: "call" }).theta, cls: c, label: T(`行权价 ${k}`, `Strike ${k}`), dashed: k !== K })),
      points: [{ x: days, y: g.theta, cls: 0, label: g.theta.toFixed(3) }], samples: 240,
    });
  };
  const run = bindSliders(root, { "th-d": (x) => x + T(" 天", x === 1 ? " day" : " days"), "th-v": (x) => x + "%" }, draw);
  onSeg(root, "th-k", (x) => { K = +x; run(); });
}
