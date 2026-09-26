// Inline demo for lesson trading-psychology: expectancy E = p·W̄ − (1−p)·L̄, the break-even win rate,
// and how noisy 50 trades are even when the edge is real.
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let seed = 3;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("期望值：胜率、平均盈利与平均亏损", "Expectancy: win rate, average win and average loss")}</div>
    <div class="demo-grid">
      ${slider("te-p", T("胜率 p", "Win rate p"), 10, 95, 1, 75)}
      ${slider("te-w", T("平均盈利（美元）", "Average win ($)"), 10, 400, 5, 60)}
      ${slider("te-l", T("平均亏损（美元）", "Average loss ($)"), 10, 400, 1, 228)}
    </div>
    <div class="demo-math" id="te-f"></div>
    <div id="te-s"></div>
    <div class="demo-label">${T("期望值随胜率变化（平均盈亏不变）", "Expectancy as the win rate changes (average win and loss fixed)")}</div>
    <div id="te-c"></div>
    <div class="demo-label">${T("按这组参数随机交易 50 笔，重复 8 次（累计损益）", "50 random trades with these parameters, 8 times (cumulative P&L)")}</div>
    <div id="te-p2"></div>
    <div class="demo-btns"><button class="demo-btn" id="te-seed">${T("换一组运气", "New luck")}</button></div>
    <p class="demo-tip">${T("看什么：默认是小凯日志的数字——胜率 75%，期望却是负的，因为打平需要约 79%。把平均亏损拉到 120（按计划止损），期望立刻翻正。再看下面 8 条路径：即使期望为正，50 笔之后也可能有人在亏钱——别用几笔交易的结果评价一套方法。", "What to notice: the defaults are Kai's journal — a 75% win rate yet negative expectancy, because break-even needs about 79%. Pull the average loss down to 120 (honouring planned exits) and expectancy turns positive at once. Then look at the 8 paths: even with a positive edge, someone can still be down after 50 trades — don't judge a method by a handful of trades.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const p = v["te-p"] / 100, W = v["te-w"], L = v["te-l"];
    const E = p * W - (1 - p) * L, pStar = L / (W + L);
    $("#te-f").innerHTML = tex(String.raw`E = p\,\bar W - (1-p)\,\bar L`, true) + tex(String.raw`= ${p.toFixed(2)} \times ${W} - ${(1 - p).toFixed(2)} \times ${L} = ${E.toFixed(1)}`, true) + tex(String.raw`p^* = \frac{\bar L}{\bar W + \bar L} = \frac{${L}}{${W + L}} = ${(pStar * 100).toFixed(1)}\%`, true);
    $("#te-s").innerHTML = stats([
      [T("每笔期望值", "Expectancy per trade"), (E >= 0 ? "+$" : "−$") + Math.abs(E).toFixed(1), E >= 0 ? "pos" : "neg"],
      [T("打平所需胜率", "Break-even win rate"), (pStar * 100).toFixed(1) + "%", "acc"],
      [T("赔率 W̄ / L̄", "Payoff ratio W̄ / L̄"), (W / L).toFixed(2)],
      [T("100 笔的期望总损益", "Expected P&L over 100 trades"), (E >= 0 ? "+$" : "−$") + Math.abs(E * 100).toLocaleString("en-US", { maximumFractionDigits: 0 })],
    ]);
    $("#te-c").innerHTML = lineChart({
      xmin: 0, xmax: 100, H: 200, xlabel: T("胜率（%）", "Win rate (%)"), ylabel: T("每笔期望（美元）", "Expectancy ($)"),
      xfmt: (x) => x + "%", series: [{ f: (x) => (x / 100) * W - (1 - x / 100) * L, cls: 0, label: "E(p)" }],
      markers: [{ x: pStar * 100, label: "p*" }], points: [{ x: p * 100, y: E, cls: E >= 0 ? 3 : 2, label: T("你", "you") }], hlines: [{ y: 0 }],
    });
    const R = O.rng(seed), series = [];
    for (let k = 0; k < 8; k++) { let c = 0; const pts = [[0, 0]]; for (let i = 1; i <= 50; i++) { c += R() < p ? W : -L; pts.push([i, c]); } series.push({ points: pts, cls: k % 2 ? 5 : 0 }); }
    $("#te-p2").innerHTML = lineChart({ xmin: 0, xmax: 50, H: 200, xlabel: T("第几笔", "Trade number"), series, hlines: [{ y: 0 }, { y: E * 50, label: T("期望", "expected") }] });
  };
  const run = bindSliders(root, { "te-p": (x) => x + "%", "te-w": (x) => "$" + x, "te-l": (x) => "$" + x }, draw);
  $("#te-seed").addEventListener("click", () => { seed += 1; run(); });
}
