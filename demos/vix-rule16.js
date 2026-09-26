// Inline demo for lesson vix: translate a VIX level into daily and monthly moves (rule of 16) and into
// how often big days should happen if moves were normal.
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("16 法则：把 VIX 翻译成每天的涨跌", "The rule of 16: turning the VIX into daily moves")}</div>
    <div class="demo-grid">
      ${slider("r16-v", "VIX", 9, 90, 1, 16)}
      ${slider("r16-big", T("“大日子”的门槛（单日涨跌幅）", "A “big day” threshold (daily move)"), 1, 6, 0.5, 2)}
    </div>
    <div class="demo-math" id="r16-f"></div>
    <div id="r16-stats"></div>
    <div id="r16-chart"></div>
    <p class="demo-tip">${T("看什么：VIX 从 16 拉到 32，典型日波动从 1% 变成 2%，而“单日涨跌超过 2%”从一年几天变成一年几十天——波动率翻倍，大日子的频率远不止翻倍。", "What to notice: move the VIX from 16 to 32 and the typical day goes from 1% to 2%, while days beyond 2% go from a handful a year to dozens — double the vol, far more than double the big days.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  bindSliders(root, { "r16-v": (x) => x, "r16-big": (x) => (+x).toFixed(1) + "%" }, (v) => {
    const vix = v["r16-v"], big = v["r16-big"];
    const day = vix / Math.sqrt(252), cal = vix / Math.sqrt(365), month = vix * Math.sqrt(30 / 365);
    const pBig = 2 * (1 - O.normCdf(big / day));
    $("#r16-f").innerHTML = tex(String.raw`\frac{\text{VIX}}{\sqrt{252}} = \frac{${vix}}{15.87} = ${day.toFixed(2)}\%\ \text{${T("每个交易日", "per trading day")}},\qquad \text{VIX}\sqrt{\tfrac{30}{365}} = ${month.toFixed(2)}\%\ \text{${T("每 30 天", "per 30 days")}}`, true);
    $("#r16-stats").innerHTML = stats([
      [T("典型交易日波动", "Typical trading-day move"), "±" + day.toFixed(2) + "%", "acc"],
      [T("每个日历日（÷√365）", "Per calendar day (÷√365)"), "±" + cal.toFixed(2) + "%"],
      [T("30 天 1σ", "30-day 1σ"), "±" + month.toFixed(2) + "%"],
      [T("在 10,000 美元仓位上（每天）", "On a $10,000 position (per day)"), "±$" + (100 * day).toFixed(0)],
      [T("超过 ±", "Days beyond ±") + big.toFixed(1) + "%" + T(" 的交易日/年", " per year"), (252 * pBig).toFixed(1), pBig > 0.1 ? "neg" : ""],
      [T("超过 ±1σ 的交易日/月", "Days beyond ±1σ per month"), (21 * 2 * (1 - O.normCdf(1))).toFixed(1)],
    ]);
    const hi = Math.max(4 * day, big * 1.3);
    $("#r16-chart").innerHTML = lineChart({
      series: [{ f: (x) => O.normPdf(x / day) / day, cls: 0, area: true, label: T("正态近似下的单日涨跌幅分布", "daily move distribution (normal approximation)") }],
      xmin: -hi, xmax: hi, ymin: 0, H: 200, xlabel: T("单日涨跌幅 %", "daily move %"), xfmt: (x) => x.toFixed(1) + "%", yfmt: () => "",
      bands: [{ x0: -hi, x1: -big, cls: 2 }, { x0: big, x1: hi, cls: 2 }],
      markers: [{ x: -day, label: "−1σ" }, { x: day, label: "+1σ" }],
    }) + `<p class="demo-meta">${T("注意：真实的日收益有肥尾，极端日子比这条正态曲线预测的更常见。", "Note: real daily returns have fat tails, so extreme days are more common than this normal curve predicts.")}</p>`;
  });
}
