// Inline demo for lesson implied-vol: IV rank vs IV percentile on a simulated year of implied vol.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

// a year (252 days) of implied vol: mean-reverting in logs around 18%, optionally with one panic spike
function history(seed, spike) {
  const R = O.rng(seed), out = [];
  let x = Math.log(0.18);
  for (let t = 0; t < 252; t++) {
    x += 0.06 * (Math.log(0.18) - x) + 0.045 * R.normal();
    let v = Math.exp(x);
    if (spike && t >= 150 && t < 175) v += 0.27 * Math.exp(-(t - 150) / 5);
    out.push(v * 100);
  }
  return out;
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let seed = 3, spike = "yes";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("IV 排名与 IV 百分位：同一个今天，两种说法", "IV rank vs IV percentile: one day, two readings")}</div>
    <div class="demo-row">${seg("ivr-sp", [["yes", T("这一年有过一次恐慌", "A year with one panic spike")], ["no", T("平静的一年", "A calm year")]], spike)}
      <div class="demo-btns" style="margin:0"><button class="demo-btn" data-act="year">${T("换一年", "Another year")}</button></div></div>
    <div class="demo-grid">${slider("ivr-t", T("今天的隐含波动率", "Today's implied vol"), 8, 60, 0.5, 25)}</div>
    <div id="ivr-chart"></div>
    <div id="ivr-stats"></div>
    <div class="demo-math" id="ivr-f"></div>
    <p class="demo-tip">${T("看什么：有那次恐慌时，25% 的排名只有三成多，但它可能高过全年九成以上的日子——一个尖峰就能把排名压低。切到“平静的一年”，两个数字会靠得更近。", "What to notice: with the panic in the history, 25% ranks only around a third of the way up the range, yet it can be higher than on nine days out of ten — one spike squashes the rank. Switch to the calm year and the two numbers move closer together.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  let hist = history(seed, true);
  const run = bindSliders(root, { "ivr-t": (x) => (+x).toFixed(1) + "%" }, (v) => {
    const today = v["ivr-t"];
    const mn = Math.min(...hist), mx = Math.max(...hist);
    const rank = Math.min(1, Math.max(0, (today - mn) / (mx - mn)));
    const below = hist.filter((x) => x < today).length, pct = below / hist.length;
    $("#ivr-chart").innerHTML = lineChart({
      H: 230, xmin: 0, xmax: 251, ymin: 0, xlabel: T("过去一年的交易日", "Trading days over the past year"), ylabel: T("隐含波动率 %", "Implied vol %"), yfmt: (x) => x + "%",
      series: [{ points: hist.map((y, i) => [i, y]), cls: 1, label: T("每天的隐含波动率", "Daily implied vol") }],
      hlines: [{ y: today, label: T("今天 ", "today ") + today.toFixed(1) + "%" }, { y: mx, label: T("最高 ", "max ") + mx.toFixed(1) + "%" }, { y: mn }],
    });
    $("#ivr-stats").innerHTML = stats([
      [T("一年最低", "Year's low"), mn.toFixed(1) + "%"],
      [T("一年最高", "Year's high"), mx.toFixed(1) + "%"],
      [T("IV 排名", "IV rank"), (rank * 100).toFixed(0) + "%", "acc"],
      [T("IV 百分位", "IV percentile"), (pct * 100).toFixed(0) + "%", "acc"],
    ]);
    $("#ivr-f").innerHTML =
      tex(String.raw`\text{${T("IV 排名", "IV rank")}} = \frac{${today.toFixed(1)} - ${mn.toFixed(1)}}{${mx.toFixed(1)} - ${mn.toFixed(1)}} = ${(rank * 100).toFixed(0)}\%,\qquad \text{${T("IV 百分位", "IV percentile")}} = \frac{${below}}{252} = ${(pct * 100).toFixed(0)}\%`, true);
  });
  const regen = () => { hist = history(seed, spike === "yes"); run(); };
  onSeg(root, "ivr-sp", (x) => { spike = x; regen(); });
  root.querySelector('[data-act="year"]').addEventListener("click", () => { seed += 1; regen(); });
}
