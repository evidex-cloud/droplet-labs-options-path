// Inline demo for lesson put-option: Kai's 100 XYZ shares (bought at $100) with and without a 30-day put.
// The put turns an open-ended loss into a floor at K − S0 − p per share.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S0 = 100;
  const prem = (K) => Math.round(O.bsPrice({ S: S0, K, T: 30 / 365, r: 0.04, sigma: 0.2, type: "put" }) * 100) / 100;
  let K = 95;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("小凯的地板：100 股 + 1 张看跌期权", "Kai's floor: 100 shares + 1 put")}</div>
    <div class="demo-row"><span class="demo-label">${T("买哪个行权价的看跌", "Put strike to buy")}</span>
      ${seg("pof-k", [[90, "90"], [95, "95"], [100, "100"]], K)}</div>
    ${slider("pof-st", T("30 天后 XYZ 的价格", "XYZ price in 30 days"), 60, 130, 0.5, 80)}
    <div class="demo-math" id="pof-f"></div>
    <div id="pof-stats"></div>
    <div id="pof-chart"></div>
    <p class="demo-tip">${T("看什么：灰色虚线是只拿股票，往下没有底；蓝线加了看跌期权，跌到行权价以下就变平——那就是地板。行权价越低，保费越便宜，地板也越低，像保险里的“免赔额”。", "What to notice: the dashed grey line is shares alone, with no bottom; the blue line adds the put and goes flat below the strike — that flat part is the floor. A lower strike costs less but sets a lower floor, like an insurance deductible.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const ST = v["pof-st"], p = prem(K);
    const stock = ST - S0, put = Math.max(K - ST, 0) - p, both = stock + put, floor = K - S0 - p;
    $("#pof-f").innerHTML = tex(String.raw`\underbrace{(${ST.toFixed(2)} - 100)}_{\text{${T("股票", "shares")}}} + \underbrace{\max(${K} - ${ST.toFixed(2)},\,0) - ${p.toFixed(2)}}_{\text{${T("看跌期权", "put")}}} = ${both.toFixed(2)}\ \text{${T("每股", "per share")}}`, true)
      + tex(String.raw`\text{${T("地板", "floor")}} = K - S_0 - p = ${K} - 100 - ${p.toFixed(2)} = ${floor.toFixed(2)} \;\Rightarrow\; ${floor.toFixed(2)} \times 100 = -\$${Math.abs(floor * 100).toFixed(0)}`, true);
    const m = (x) => (x < 0 ? "−$" : "+$") + Math.round(Math.abs(x * 100)).toLocaleString("en-US");
    $("#pof-stats").innerHTML = stats([
      [T("保费（100 股）", "Insurance cost (100 sh)"), "$" + (p * 100).toFixed(0), "acc"],
      [T("只拿股票", "Shares only"), m(stock), stock >= 0 ? "pos" : "neg"],
      [T("看跌期权这一腿", "The put leg"), m(put), put >= 0 ? "pos" : "neg"],
      [T("股票 + 看跌", "Shares + put"), m(both), both >= 0 ? "pos" : "neg"],
      [T("最坏情况（地板）", "Worst case (floor)"), m(floor), "neg"],
    ]);
    $("#pof-chart").innerHTML = lineChart({
      xmin: 60, xmax: 130, xlabel: T("30 天后 XYZ 的价格（美元）", "XYZ price in 30 days ($)"), ylabel: T("盈亏（美元，100 股）", "P&L ($, 100 shares)"),
      series: [
        { f: (x) => (x - S0) * 100, cls: 5, dashed: true, label: T("只拿股票", "Shares only") },
        { f: (x) => (x - S0 + Math.max(K - x, 0) - p) * 100, cls: 0, label: T("股票 + 看跌期权", "Shares + put") },
      ],
      markers: [{ x: K, label: "K = " + K }], hlines: [{ y: floor * 100, label: T("地板 ", "floor ") + m(floor) }],
      points: [{ x: ST, y: both * 100, cls: 0 }],
    });
  };
  const run = bindSliders(root, { "pof-st": (x) => "$" + x.toFixed(2) }, draw);
  onSeg(root, "pof-k", (v) => { K = +v; run(); });
}
