// Inline demo for lesson margin-liquidation: a liquidation cascade. Clusters of leveraged longs sit at their
// liquidation prices; a price shock triggers forced market sells, which push the price into the next cluster.
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const P0 = 100000, MMR = 0.005;
  // illustrative clusters of long open interest: leverage → liquidation price, notional in $ billions
  const CL = [[50, 0.3], [25, 0.4], [20, 0.6], [10, 0.9], [5, 0.7], [3, 0.4]].map(([L, bn]) => ({ L, bn, liq: O.liqPrice(P0, L, MMR) }));
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("连环强平：一次冲击，几轮被迫卖出", "A liquidation cascade: one shock, several rounds of forced selling")}</div>
    <div class="demo-grid">
      ${slider("mlc-shock", T("初始冲击（价格先跌）", "Initial shock (first drop)"), 0, 10, 0.5, 3)}
      ${slider("mlc-imp", T("订单簿深度：每 10 亿美元被迫卖出砸价", "Book depth: price impact per $1B of forced selling"), 0.5, 8, 0.5, 3)}
    </div>
    <div id="mlc-table"></div>
    <div class="demo-math" id="mlc-f"></div>
    <div id="mlc-chart"></div>
    <div id="mlc-stats"></div>
    <p class="demo-tip">${T("试试：冲击固定 3%，把“每 10 亿美元砸价”从 1% 拉到 5%——订单簿越薄，同一个冲击引爆的层数越多，最终跌幅可以是冲击的两倍以上。", "Try this: keep the shock at 3% and raise the impact from 1% to 5% per $1B — the thinner the book, the more clusters the same shock detonates, and the final fall can be more than twice the shock.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const k = (x) => "$" + Math.round(x).toLocaleString("en-US");

  bindSliders(root, { "mlc-shock": (x) => (+x).toFixed(1) + "%", "mlc-imp": (x) => (+x).toFixed(1) + "%" }, (v) => {
    const shock = v["mlc-shock"] / 100, imp = v["mlc-imp"] / 100;
    let p = P0 * (1 - shock);
    const done = CL.map(() => false), rounds = [[0, P0], [1, p]];
    let total = 0, n = 0;
    for (let guard = 0; guard < 10; guard++) {
      let sold = 0;
      CL.forEach((c, i) => { if (!done[i] && p <= c.liq) { done[i] = true; sold += c.bn; } });
      if (!sold) break;
      total += sold; n++;
      p *= 1 - imp * sold;
      rounds.push([rounds.length, p]);
    }
    $("#mlc-table").innerHTML = `<table><thead><tr><th>${T("杠杆", "Leverage")}</th><th>${T("强平价", "Liquidation price")}</th><th>${T("多单规模", "Long size")}</th><th>${T("状态", "Status")}</th></tr></thead><tbody>${CL.map((c, i) => `<tr${done[i] ? ' class="hl"' : ""}><td>${c.L}×</td><td>${k(c.liq)}</td><td>$${c.bn.toFixed(1)}B</td><td>${done[i] ? `<span class="tag bad">${T("被强平", "liquidated")}</span>` : `<span class="tag ok">${T("幸存", "survives")}</span>`}</td></tr>`).join("")}</tbody></table>`;
    const fall = 1 - p / P0;
    $("#mlc-f").innerHTML = tex(String.raw`P_{\text{${T("下一轮", "next")}}} = P \times \left(1 - \underbrace{${(imp * 100).toFixed(1)}\%}_{\text{${T("每 10 亿美元砸价", "impact per \\$1B")}}} \times \underbrace{\text{${T("本轮被迫卖出", "forced sales")}}}_{\text{${T("十亿美元", "\\$ billions")}}}\right)`, true);
    $("#mlc-chart").innerHTML = lineChart({
      points: null, xmin: 0, xmax: Math.max(3, rounds.length - 1), ymin: Math.min(p, 88000) * 0.99, ymax: P0 * 1.005,
      xlabel: T("轮次（0 = 冲击前）", "round (0 = before the shock)"), ylabel: T("BTC 价格", "BTC price"), xstep: 1,
      yfmt: (y) => (y / 1000).toFixed(1) + "k",
      series: [{ points: rounds, cls: 2, dots: true, label: T("价格", "price") }],
      hlines: [{ y: P0 * (1 - shock), label: T("只有冲击时的价格", "price after the shock alone") }],
    });
    $("#mlc-stats").innerHTML = stats([
      [T("被强平的多单", "Longs liquidated"), "$" + total.toFixed(1) + "B", total ? "neg" : ""],
      [T("连环轮数", "Cascade rounds"), String(n)],
      [T("最终价格", "Final price"), k(p), "acc"],
      [T("总跌幅 ÷ 初始冲击", "Total fall ÷ initial shock"), shock > 0 ? (fall / shock).toFixed(2) + "×" : "–"],
    ]);
  });
}
