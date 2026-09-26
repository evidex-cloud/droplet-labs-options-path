// Inline demo for lesson random-walk: the typical (1σ) move grows like √T, not like T.
// Horizon and volatility sliders; calendar-day (365) vs trading-day (252) convention.
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let D = 365;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("典型幅度按 √T 增长", "The typical move grows like √T")}</div>
    <div class="demo-row">${seg("rws-conv", [["365", T("日历日（÷365）", "Calendar days (÷365)")], ["252", T("交易日（÷252）", "Trading days (÷252)")]], "365")}</div>
    <div class="demo-grid">
      ${slider("rws-d", T("期限（天）", "Horizon (days)"), 1, 500, 1, 30)}
      ${slider("rws-v", T("年化波动率 σ", "Annual volatility σ"), 5, 80, 1, 20)}
    </div>
    <div id="rws-chart"></div>
    <div class="demo-math" id="rws-f"></div>
    <div id="rws-stats"></div>
    <p class="demo-tip">${T("看什么：蓝线（√T）一开始爬得快，后来越来越平；红虚线是“如果风险随时间线性增长”，很快就冲出图外。期限拉到 4 倍，典型幅度只翻一倍。XYZ 现价 100。", "What to notice: the blue √T curve climbs fast at first and then flattens; the red dashed line (what you'd get if risk grew linearly with time) shoots off the chart. Four times the horizon only doubles the typical move. XYZ at $100.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const run = bindSliders(root, { "rws-d": (x) => x + T(" 天", " days"), "rws-v": (x) => x + "%" }, (v) => {
    const days = v["rws-d"], sigma = v["rws-v"] / 100;
    const one = 100 * sigma / Math.sqrt(D), move = (d) => 100 * sigma * Math.sqrt(d / D), mv = move(days);
    const ymax = move(500) * 1.15;
    $("#rws-chart").innerHTML = lineChart({
      xmin: 1, xmax: 500, ymin: 0, ymax, xlabel: T("期限（天）", "Horizon (days)"), ylabel: T("1σ 幅度（美元）", "1σ move ($)"),
      series: [
        { f: (d) => move(d), cls: 0, label: T("√T：真实的增长方式", "√T: how it really grows") },
        { f: (d) => one * d, cls: 2, dashed: true, label: T("如果按时间线性增长", "if it grew linearly with time") },
      ],
      markers: [{ x: days, label: days + T(" 天", " d") }], points: [{ x: days, y: mv, cls: 0, label: "$" + mv.toFixed(2) }],
    });
    $("#rws-f").innerHTML = tex(String.raw`S\sigma\sqrt{T} = 100 \times ${sigma.toFixed(2)} \times \sqrt{\tfrac{${days}}{${D}}} = ${mv.toFixed(2)} \qquad \text{${T("一天", "one day")}}: 100 \times ${sigma.toFixed(2)} / \sqrt{${D}} = ${one.toFixed(2)}`, true);
    $("#rws-stats").innerHTML = stats([
      [T("典型幅度（1σ）", "Typical move (1σ)"), "$" + mv.toFixed(2), "acc"],
      [T("占股价", "As % of price"), (mv).toFixed(2) + "%"],
      [T("是一天幅度的几倍", "Multiple of one day"), "×" + Math.sqrt(days).toFixed(2)],
      [T("按线性会是", "Linear scaling would say"), "$" + (one * days).toFixed(2)],
      [T("约 68% 的结局落在", "About 68% of outcomes within"), `$${(100 * Math.exp(-sigma * Math.sqrt(days / D))).toFixed(2)} – $${(100 * Math.exp(sigma * Math.sqrt(days / D))).toFixed(2)}`],
    ]);
  });
  onSeg(root, "rws-conv", (x) => { D = +x; run(); });
}
