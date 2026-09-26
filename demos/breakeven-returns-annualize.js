// Inline demo for lesson breakeven-returns: annualizing a short-period return, simple vs compound,
// and what one or more bad periods do to the "annual yield".
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("年化收益率：假设一年里每一期都一样", "Annualizing: assuming every period of the year is the same")}</div>
    <div class="demo-grid">
      ${slider("bra-r", T("每一期的收益率 R", "Return per trade R"), 0.1, 5, 0.01, 0.71)}
      ${slider("bra-d", T("每一期的天数 d", "Days per trade d"), 7, 91, 1, 30)}
      ${slider("bra-l", T("坏的一期亏损", "Loss in a bad period"), 0, 30, 0.01, 9.29)}
      ${slider("bra-b", T("一年里坏的期数", "Bad periods per year"), 0, 3, 1, 1)}
    </div>
    <div class="demo-math" id="bra-f"></div>
    <div id="bra-stats"></div>
    <div id="bra-chart"></div>
    <p class="demo-tip">${T("默认数字就是小凯的备兑看涨：平盘时每 30 天赚 0.71%，XYZ 跌到 90 的那个月亏 9.29%。把“坏的期数”拉到 0 再拉回 1，看年化“约 9%”怎样变成小亏。", "The defaults are Kai's covered call: +0.71% every 30 days when XYZ is flat, −9.29% in a month when XYZ falls to 90. Move “bad periods” to 0 and back to 1, and watch “about 9% a year” turn into a small loss.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const pc = (x) => (x < 0 ? "−" : "") + Math.abs(x * 100).toFixed(2) + "%";
  bindSliders(root, { "bra-r": (x) => (+x).toFixed(2) + "%", "bra-d": (x) => x + T(" 天", " days"), "bra-l": (x) => "−" + (+x).toFixed(2) + "%", "bra-b": (x) => String(x) }, (v) => {
    const R = v["bra-r"] / 100, d = v["bra-d"], L = v["bra-l"] / 100, bad = v["bra-b"];
    const n = 365 / d, periods = Math.floor(n);
    const simple = R * n, comp = Math.pow(1 + R, n) - 1;
    const nb = Math.min(bad, periods), withBad = Math.pow(1 + R, periods - nb) * Math.pow(1 - L, nb) - 1;
    $("#bra-f").innerHTML = tex(String.raw`R_{\text{ann}} = (1 + R)^{365/d} - 1 = (1 + ${R.toFixed(4)})^{${n.toFixed(2)}} - 1 = ${(comp * 100).toFixed(2)}\%`, true)
      + tex(String.raw`\text{${en ? "with bad periods" : "有坏的期数"}:}\ (1 + ${R.toFixed(4)})^{${periods - nb}} \times (1 - ${L.toFixed(4)})^{${nb}} - 1 = ${(withBad * 100).toFixed(2)}\%`, true);
    $("#bra-stats").innerHTML = stats([
      [T("单利年化 R×365/d", "Simple annualized R×365/d"), pc(simple)],
      [T("复利年化", "Compound annualized"), pc(comp), "acc"],
      [T(`${periods} 期里有 ${nb} 期坏`, `${periods} periods, ${nb} bad`), pc(withBad), withBad >= 0 ? "pos" : "neg"],
    ]);
    // equity paths: all good vs bad periods spread through the year
    const badAt = new Set(Array.from({ length: nb }, (_, i) => Math.round(((i + 1) * periods) / (nb + 1))));
    const good = [[0, 100]], mixed = [[0, 100]];
    let g = 100, m = 100;
    for (let i = 1; i <= periods; i++) { g *= 1 + R; m *= badAt.has(i) ? 1 - L : 1 + R; good.push([i, g]); mixed.push([i, m]); }
    $("#bra-chart").innerHTML = lineChart({
      series: [
        { points: good, cls: 3, label: T("每一期都顺利", "Every period goes to plan"), dots: periods <= 20 },
        { points: mixed, cls: 2, label: T("其中有坏的期", "With bad period(s)"), dots: periods <= 20 },
      ],
      xlabel: T("第几期", "Period"), ylabel: T("资金（起点 100）", "Capital (start 100)"), H: 240, xstep: periods > 20 ? 5 : periods > 10 ? 2 : 1,
      hlines: [{ y: 100, label: T("起点", "start") }],
    });
  });
}
