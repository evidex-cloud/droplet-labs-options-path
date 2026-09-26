// Inline demo for lesson futures-basis: rolling a one-month future for 12 months in contango or backwardation.
// Each month the long buys the next future at F = S(1 + c) and it converges to spot at expiry.
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("展期一年：升水的拖累与贴水的顺风", "Rolling for a year: the contango drag and the backwardation tailwind")}</div>
    <div class="demo-grid">
      ${slider("fbr-c", T("一个月期货相对现货（+ 升水 / − 贴水）", "One-month future vs spot (+ contango / − backwardation)"), -8, 15, 0.5, 2)}
      ${slider("fbr-g", T("现货每月涨跌", "Spot change per month"), -5, 5, 0.5, 0)}
    </div>
    <div class="demo-math" id="fbr-f"></div>
    <div id="fbr-stats"></div>
    <div id="fbr-chart"></div>
    <p class="demo-tip">${T("看什么：现货每月涨跌设为 0 时，现货线是平的，而滚动持有期货的多头线每月都掉一截（升水）或抬一截（贴水）——这就是展期收益。再把现货调成每月 +2%：多头仍然落后现货，差距正好来自基差。（忽略保证金现金的利息。）", "What to notice: with spot change at 0 the spot line is flat, yet the rolling long steps down each month (contango) or up (backwardation): that is roll yield. Now set spot to +2% a month: the long still trails spot, and the gap is exactly the basis. (Interest on the collateral is ignored.)")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  bindSliders(root, { "fbr-c": (x) => (x > 0 ? "+" : "") + x + "%", "fbr-g": (x) => (x > 0 ? "+" : "") + x + "%" }, (v) => {
    const c = v["fbr-c"] / 100, g = v["fbr-g"] / 100;
    let S = 100, W = 100;
    const spot = [[0, 100]], fut = [[0, 100]];
    for (let k = 1; k <= 12; k++) {
      const F = S * (1 + c), S1 = S * (1 + g);
      W *= S1 / F;
      S = S1;
      spot.push([k, S]); fut.push([k, W]);
    }
    const roll = 1 / (1 + c) - 1;
    const shape = c > 0 ? T("升水", "contango") : c < 0 ? T("贴水", "backwardation") : T("平坦", "flat");
    const F0 = (100 * (1 + c)).toFixed(1), unit = T("每月（现货不动时）", "per month (spot flat)");
    $("#fbr-f").innerHTML = tex(String.raw`R_{\text{roll}} = \frac{S - F_0}{F_0} = \frac{100 - ${F0}}{${F0}} = ${(roll * 100).toFixed(2)}\%\ \text{${unit}}`, true);
    $("#fbr-stats").innerHTML = stats([
      [T("曲线形状", "Curve shape"), shape, "acc"],
      [T("每月展期收益", "Roll yield per month"), (roll * 100).toFixed(2) + "%", roll < 0 ? "neg" : "pos"],
      [T("现货 12 个月", "Spot over 12 months"), ((S / 100 - 1) * 100).toFixed(1) + "%"],
      [T("滚动多头 12 个月", "Rolling long over 12 months"), ((W / 100 - 1) * 100).toFixed(1) + "%", W < S ? "neg" : "pos"],
    ]);
    $("#fbr-chart").innerHTML = lineChart({
      xmin: 0, xmax: 12, xstep: 1, xlabel: T("月份", "Month"), ylabel: T("价值（起点 = 100）", "Value (start = 100)"),
      series: [
        { points: spot, cls: 5, label: T("持有现货", "Hold spot"), dots: true },
        { points: fut, cls: 0, label: T("每月展期的期货多头", "Long futures, rolled monthly"), dots: true },
      ],
    });
  });
}
