// Main demo for lesson vega: vega of a position across spot, and an IV-shock simulator with separate
// front-month and back-month shifts (vega estimate vs exact reprice, per contract).
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

const R = 0.04, BASE = 0.2, FRONT_MAX = 45 / 365;
const BOOKS = {
  call: [{ type: "call", K: 100, T: 30 / 365, n: 1 }],
  leaps: [{ type: "call", K: 100, T: 1, n: 1 }],
  straddle: [{ type: "call", K: 100, T: 30 / 365, n: 1 }, { type: "put", K: 100, T: 30 / 365, n: 1 }],
  strangle: [{ type: "call", K: 105, T: 30 / 365, n: -1 }, { type: "put", K: 95, T: 30 / 365, n: -1 }],
  calendar: [{ type: "call", K: 100, T: 30 / 365, n: -1 }, { type: "call", K: 100, T: 60 / 365, n: 1 }],
};

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let book = "call";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("Vega 实验台：隐含波动率一动，仓位动多少？", "Vega lab: when implied vol moves, how much does the position move?")}</div>
    <div class="demo-row">${seg("vg-book", [
      ["call", T("买 30 天 100 看涨", "Long 30d 100 call")],
      ["leaps", T("买 1 年 100 看涨", "Long 1y 100 call")],
      ["straddle", T("买 30 天跨式", "Long 30d straddle")],
      ["strangle", T("卖 95/105 宽跨", "Short 95/105 strangle")],
      ["calendar", T("日历价差 30/60 天", "Calendar 30d/60d")],
    ], book)}</div>
    <div class="demo-grid-3">
      ${slider("vg-s", T("现价 S", "Spot S"), 80, 120, 0.5, 100)}
      ${slider("vg-f", T("近月 IV 变动（≤45 天）", "Front IV shift (≤45 days)"), -15, 15, 1, 4)}
      ${slider("vg-b", T("远月 IV 变动（>45 天）", "Back IV shift (>45 days)"), -15, 15, 1, 2)}
    </div>
    <div class="demo-math" id="vg-f-out"></div>
    <div id="vg-stats"></div>
    <div id="vg-chart"></div>
    <p class="demo-tip">${T("试试：默认是近月 IV +4、远月 +2。选“日历价差”——净 Vega 是正的，仓位却亏钱。再选“卖宽跨”，把两个 IV 都拉到 +15：精确亏损比 Vega 估计的还大，那是 Volga 在起作用。", "Try this: the defaults lift front IV 4 points and back IV 2. Pick the calendar — net vega is positive, yet the position loses. Then pick the short strangle and push both shifts to +15: the exact loss is bigger than the vega estimate; that extra is volga at work.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const legVal = (l, S, sig) => O.bsPrice({ S, K: l.K, T: l.T, r: R, sigma: sig, type: l.type });
  const shiftOf = (l, v) => (l.T <= FRONT_MAX ? v["vg-f"] : v["vg-b"]);
  const draw = (v) => {
    const legs = BOOKS[book], S = v["vg-s"];
    let est = 0, exact = 0, vFront = 0, vBack = 0, vNet = 0;
    const terms = [];
    for (const l of legs) {
      const g = O.greeks({ S, K: l.K, T: l.T, r: R, sigma: BASE, type: l.type });
      const dv = shiftOf(l, v);
      const nv = l.n * g.vega * 100;
      vNet += nv;
      if (l.T <= FRONT_MAX) vFront += nv; else vBack += nv;
      est += nv * dv;
      exact += l.n * (legVal(l, S, BASE + dv / 100) - legVal(l, S, BASE)) * 100;
      terms.push(`(${nv >= 0 ? "" : "-"}${Math.abs(nv).toFixed(2)})(${dv >= 0 ? "+" : "-"}${Math.abs(dv)})`);
    }
    const sgn = (x) => (x >= 0 ? "+" : "-") + "\\$" + Math.abs(x).toFixed(2);
    $("#vg-f-out").innerHTML =
      tex(String.raw`\Delta V \approx \sum_i n_i\,\nu_i\,\Delta\sigma_i = ${terms.join(" + ")} = ${sgn(est)}`, true) +
      tex(String.raw`\text{${T("精确重估", "exact reprice")}} = ${sgn(exact)}\qquad \text{${T("差额", "gap")}} = ${sgn(exact - est)}`, true);
    $("#vg-stats").innerHTML = stats([
      [T("净 Vega（每张/点）", "Net vega (per contract/pt)"), "$" + vNet.toFixed(2), "acc"],
      [T("近月桶", "Front bucket"), "$" + vFront.toFixed(2)],
      [T("远月桶", "Back bucket"), "$" + vBack.toFixed(2)],
      [T("Vega 估计", "Vega estimate"), sgn(est).replace("\\", ""), est >= 0 ? "pos" : "neg"],
      [T("精确盈亏", "Exact P&L"), sgn(exact).replace("\\", ""), exact >= 0 ? "pos" : "neg"],
    ]);
    const vegaAt = (x, shift) => legs.reduce((a, l) => a + l.n * O.greeks({ S: x, K: l.K, T: l.T, r: R, sigma: BASE + (shift ? shiftOf(l, v) / 100 : 0), type: l.type }).vega * 100, 0);
    $("#vg-chart").innerHTML = lineChart({
      xmin: 80, xmax: 120, xlabel: T("标的价格 S", "Underlying price S"), ylabel: T("仓位 Vega（美元/点）", "Position vega ($ per vol pt)"),
      series: [
        { f: (x) => vegaAt(x, false), cls: 0, label: T("IV 不变时的 Vega", "Vega at today's IV") },
        { f: (x) => vegaAt(x, true), cls: 1, dashed: true, label: T("IV 变动后的 Vega", "Vega after the IV shift") },
      ],
      markers: [{ x: S, label: "S" }],
    });
  };
  const run = bindSliders(root, { "vg-s": (x) => "$" + x, "vg-f": (x) => (x > 0 ? "+" : "") + x + T(" 点", " pts"), "vg-b": (x) => (x > 0 ? "+" : "") + x + T(" 点", " pts") }, draw);
  onSeg(root, "vg-book", (b) => { book = b; run(); });
}
