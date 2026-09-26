// Inline demo for lesson basis-trades: cash-and-carry locks F0 − S0 whatever the price does at expiry,
// and splits the basis into interest (no-arbitrage part) and excess carry.
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S0 = 100000, r = 0.04;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("期现套利：两条腿加起来是一条水平线", "Cash-and-carry: two legs that add up to a flat line")}</div>
    <div class="demo-grid-3">
      ${slider("btl-st", T("到期时的比特币 S<sub>T</sub>", "Bitcoin at expiry S<sub>T</sub>"), 60000, 140000, 1000, 80000)}
      ${slider("btl-f", T("期货价 F<sub>0</sub>", "Futures price F<sub>0</sub>"), 99000, 106000, 250, 102000)}
      ${slider("btl-d", T("离到期天数", "Days to expiry"), 30, 180, 5, 90)}
    </div>
    <div class="demo-math" id="btl-f1"></div>
    <div id="btl-stats"></div>
    <div id="btl-chart"></div>
    <div class="demo-math" id="btl-f2"></div>
    <p class="demo-tip">${T("试试：先随意拖 S<sub>T</sub>——合计纹丝不动；再把期货价拉到合理价附近（90 天约 100,991），超额收益变成零：这时套利只是在赚利息。", "Try this: drag S<sub>T</sub> anywhere — the total does not move. Then pull the futures price toward its fair value (about 100,991 for 90 days): the excess carry goes to zero and the trade just earns interest.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const usd = (x) => (x < 0 ? "−$" : "$") + Math.round(Math.abs(x)).toLocaleString("en-US");
  const n = (x) => Math.round(x).toLocaleString("en-US").replace(/,/g, "{,}");
  bindSliders(root, { "btl-st": usd, "btl-f": usd, "btl-d": (x) => x + T(" 天", " days") }, (v) => {
    const ST = v["btl-st"], F0 = v["btl-f"], d = v["btl-d"], Tm = d / 365;
    const spot = ST - S0, fut = F0 - ST, tot = spot + fut;
    const fair = O.futuresFair(S0, Tm, r), yCont = O.annualizedBasis(F0, S0, Tm), ySimple = ((F0 - S0) / S0) * (365 / d);
    $("#btl-f1").innerHTML = tex(String.raw`\Pi = \underbrace{(${n(ST)} - ${n(S0)})}_{${spot < 0 ? "-" : "+"}${n(Math.abs(spot))}} + \underbrace{(${n(F0)} - ${n(ST)})}_{${fut < 0 ? "-" : "+"}${n(Math.abs(fut))}} = ${tot < 0 ? "-" : ""}${n(Math.abs(tot))}`, true);
    $("#btl-stats").innerHTML = stats([
      [T("现货腿", "Spot leg"), usd(spot), spot >= 0 ? "pos" : "neg"],
      [T("期货空单", "Short future"), usd(fut), fut >= 0 ? "pos" : "neg"],
      [T("合计（锁定）", "Total (locked)"), usd(tot), "acc"],
      [T("合理期货价（r = 4%）", "Fair future (r = 4%)"), usd(fair)],
    ]);
    $("#btl-chart").innerHTML = lineChart({
      xmin: 60000, xmax: 140000, xlabel: T("到期时的比特币", "bitcoin at expiry"), ylabel: T("到期盈亏", "P&L at expiry"),
      xfmt: (x) => Math.round(x / 1000) + "k", yfmt: (y) => Math.round(y / 1000) + "k",
      series: [
        { f: (x) => x - S0, cls: 1, label: T("现货多头", "long spot") },
        { f: (x) => F0 - x, cls: 4, label: T("期货空单", "short future") },
        { f: () => F0 - S0, cls: 0, label: T("合计", "total") },
      ],
      markers: [{ x: ST, label: T("到期价", "at expiry") }],
    });
    $("#btl-f2").innerHTML = tex(String.raw`y_{\text{cont}} = \frac{1}{T}\ln\frac{F_0}{S_0} = ${(yCont * 100).toFixed(2)}\%, \quad y_{\text{${T("单利", "simple")}}} = ${(ySimple * 100).toFixed(2)}\%, \quad y_{\text{cont}} - r = ${((yCont - r) * 100).toFixed(2)}\%\ \ (\text{${T("超额", "excess")}} = ${F0 - fair < 0 ? "-" : ""}\$${n(Math.abs(F0 - fair))})`, true);
  });
}
