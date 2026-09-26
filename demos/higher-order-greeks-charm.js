// Inline demo for lesson higher-order-greeks: an option's delta drifting while the stock stands still —
// charm (time) and vanna (implied vol), estimate vs exact.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

const OPTS = {
  c105: { K: 105, d: 30, type: "call" },
  p95: { K: 95, d: 30, type: "put" },
  c105w: { K: 105, d: 7, type: "call" },
  c100: { K: 100, d: 30, type: "call" },
};

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let pick = "c105";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("股价不动，Delta 也会漂：Charm 与 Vanna", "The stock stands still, the delta drifts: charm and vanna")}</div>
    <div class="demo-row">${seg("hc-opt", [
      ["c105", T("30 天 105 看涨", "30d 105 call")],
      ["p95", T("30 天 95 看跌", "30d 95 put")],
      ["c105w", T("7 天 105 看涨", "7d 105 call")],
      ["c100", T("30 天 100 看涨（平值）", "30d 100 call (ATM)")],
    ], pick)}</div>
    <div class="demo-grid">
      ${slider("hc-days", T("过去的天数", "Days passed"), 0, 6, 1, 3)}
      ${slider("hc-dv", T("IV 变动（点）", "IV shift (pts)"), -10, 10, 1, 0)}
    </div>
    <div class="demo-math" id="hc-f"></div>
    <div id="hc-stats"></div>
    <div id="hc-chart"></div>
    <p class="demo-tip">${T("看什么：XYZ 一直是 100 美元。虚值期权的 Delta 随时间流向 0，随波动率上升流向平值；平值期权几乎不动。换成 7 天的 105 看涨，Charm 大得多。", "What to notice: XYZ stays at $100 throughout. Out-of-the-money deltas drift toward 0 as time passes and toward the at-the-money value as vol rises; the at-the-money option barely moves. Switch to the 7-day 105 call: charm is much larger.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const S = 100, r = 0.04, sig = 0.2;
  const draw = (v) => {
    const o = OPTS[pick], days = Math.min(v["hc-days"], o.d - 1), dv = v["hc-dv"];
    const g = O.greeks({ S, K: o.K, T: o.d / 365, r, sigma: sig, type: o.type });
    const exact = O.greeks({ S, K: o.K, T: (o.d - days) / 365, r, sigma: sig + dv / 100, type: o.type }).delta;
    const charmDay = g.charm / 365, vannaPt = g.vanna / 100;
    const est = g.delta + charmDay * days + vannaPt * dv;
    const s = (x, d = 4) => (x >= 0 ? "+" : "-") + Math.abs(x).toFixed(d);
    $("#hc-f").innerHTML = tex(String.raw`\Delta_{\text{${T("之后", "later")}}} \approx \underbrace{${g.delta.toFixed(3)}}_{\Delta} ${s(charmDay)} \times ${days} ${s(vannaPt)} \times (${dv}) = ${est.toFixed(3)} \quad(\text{${T("精确", "exact")}}: ${exact.toFixed(3)})`, true);
    $("#hc-stats").innerHTML = stats([
      [T("今天的 Delta", "Delta today"), g.delta.toFixed(3)],
      [T("Charm（每天）", "Charm (per day)"), s(charmDay), "acc"],
      [T("Vanna（每个 IV 点）", "Vanna (per IV pt)"), s(vannaPt), "acc"],
      [T("之后的 Delta（精确）", "Delta later (exact)"), exact.toFixed(3), "pos"],
      [T("10 张合约的对冲变化（股）", "Hedge change for 10 contracts (shares)"), ((exact - g.delta) * 1000).toFixed(0).replace("-", "−")],
    ]);
    const maxD = o.d - 1;
    $("#hc-chart").innerHTML = lineChart({
      xmin: 0, xmax: Math.min(maxD, 20), xlabel: T("过去的天数（股价不变）", "Days passed (stock unchanged)"), ylabel: T("Delta Δ", "delta Δ"),
      series: [
        { f: (x) => O.greeks({ S, K: o.K, T: (o.d - x) / 365, r, sigma: sig, type: o.type }).delta, cls: 0, label: T("IV 不变", "IV unchanged") },
        { f: (x) => O.greeks({ S, K: o.K, T: (o.d - x) / 365, r, sigma: sig + dv / 100, type: o.type }).delta, cls: 1, dashed: true, label: T("IV 按滑块变动", "IV shifted by the slider") },
      ],
      markers: [{ x: days, label: T("现在看的这一天", "selected day") }],
    });
  };
  const run = bindSliders(root, { "hc-days": (x) => x + T(" 天", x === 1 ? " day" : " days"), "hc-dv": (x) => (x > 0 ? "+" : "") + x }, draw);
  onSeg(root, "hc-opt", (p) => { pick = p; run(); });
}
