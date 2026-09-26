// Inline demo for lesson orders: legging into the XYZ 100/105 bull call spread versus sending one multi-leg order.
// Between the two fills the stock moves; the second leg is priced off the new stock price.
import * as O from "./_opt.js";
import { seg, onSeg, slider, bindSliders, stats, tex, lineChart } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const r = 0.04, sigma = 0.2, Tm = 30 / 365;
  let first = "long";
  const q = (theo) => { const c = Math.round(theo * 100) / 100, w = theo < 1 ? 0.02 : 0.06; return { bid: c - w / 2, ask: c + w / 2, mid: c }; };
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("分腿成交 vs 组合单：牛市看涨价差 100/105", "Legging vs one spread order: the 100/105 bull call spread")}</div>
    <div class="demo-row">${seg("ol-first", [["long", T("先买 100 看涨", "Buy the 100 call first")], ["short", T("先卖 105 看涨", "Sell the 105 call first")]], first)}</div>
    ${slider("ol-move", T("两次成交之间 XYZ 的变动", "XYZ move between the two fills"), -2, 2, 0.1, -1)}
    <div class="demo-math" id="ol-f"></div>
    <div id="ol-stats"></div>
    <div id="ol-chart"></div>
    <p class="demo-tip">${T("看什么：组合单的成本是一条水平线（1.78 自然价，或挂中间价 1.74）；分腿的成本随股价变动而倾斜——先买后卖时，股价下跌让你多付，上涨让你少付。分腿就是在两次成交之间押了一次方向。",
      "What to notice: the spread order's cost is a flat line (1.78 at natural prices, 1.74 if the mid fills); the legged cost tilts with the stock — buying first, a dip makes you pay more and a rally less. Legging is a bet on direction between the two fills.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const c100 = q(O.bsPrice({ S: 100, K: 100, T: Tm, r, sigma, type: "call" })), c105 = q(O.bsPrice({ S: 100, K: 105, T: Tm, r, sigma, type: "call" }));
  const natural = c100.ask - c105.bid, midCost = c100.mid - c105.mid;
  const legged = (m) => {
    const S2 = 100 + m;
    if (first === "long") return c100.ask - q(O.bsPrice({ S: S2, K: 105, T: Tm, r, sigma, type: "call" })).bid;
    return q(O.bsPrice({ S: S2, K: 100, T: Tm, r, sigma, type: "call" })).ask - c105.bid;
  };
  const draw = (v) => {
    const m = v["ol-move"], lg = legged(m), S2 = 100 + m;
    const f = first === "long"
      ? String.raw`\underbrace{${c100.ask.toFixed(2)}}_{\text{${T("先买 100C", "buy 100C first")}}} - \underbrace{${(c100.ask - lg).toFixed(2)}}_{\text{${T("再卖 105C", "then sell 105C")}\ @\ S = ${S2.toFixed(1)}}} = ${lg.toFixed(2)}`
      : String.raw`\underbrace{${(lg + c105.bid).toFixed(2)}}_{\text{${T("再买 100C", "then buy 100C")}\ @\ S = ${S2.toFixed(1)}}} - \underbrace{${c105.bid.toFixed(2)}}_{\text{${T("先卖 105C", "sell 105C first")}}} = ${lg.toFixed(2)}`;
    $("#ol-f").innerHTML = tex(f, true) + tex(String.raw`\text{${T("组合单（自然价）", "spread order (natural)")}} = ${c100.ask.toFixed(2)} - ${c105.bid.toFixed(2)} = ${natural.toFixed(2)}`, true);
    const diff = (lg - natural) * 100;
    $("#ol-stats").innerHTML = stats([
      [T("分腿净借方", "Legged net debit"), lg.toFixed(2), "acc"],
      [T("组合单净借方", "Spread-order debit"), natural.toFixed(2) + T("（中间价 ", " (mid ") + midCost.toFixed(2) + ")"],
      [T("分腿多付 / 少付（每组）", "Legging costs / saves (per spread)"), (diff > 0 ? "+$" : diff < 0 ? "−$" : "$") + Math.abs(diff).toFixed(0), diff > 0 ? "neg" : "pos"],
    ]);
    $("#ol-chart").innerHTML = lineChart({
      xmin: -2, xmax: 2, xlabel: T("两次成交之间 XYZ 的变动（美元）", "XYZ move between fills ($)"), ylabel: T("净借方", "Net debit"),
      series: [
        { f: (x) => legged(x), cls: 0, label: T("分腿成交", "Legged") },
        { f: () => natural, cls: 5, dashed: true, label: T("组合单（自然价）", "Spread order (natural)") },
      ],
      hlines: [{ y: midCost, label: T("中间价 1.74", "mid 1.74") }],
      points: [{ x: m, y: lg, cls: 0, label: lg.toFixed(2) }], H: 230,
    });
  };
  const run = bindSliders(root, { "ol-move": (x) => (+x >= 0 ? "+$" : "−$") + Math.abs(+x).toFixed(1) }, draw);
  onSeg(root, "ol-first", (v) => { first = v; run(); });
}
