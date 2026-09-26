// Main demo for lesson higher-order-greeks: a spot × vol scenario grid for a small position, with full revaluation,
// first- and second-order Greek estimates, and a per-cell attribution (delta, gamma, vega, theta, vanna, volga).
import * as O from "./_opt.js";
import { seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

const R = 0.04, SIG = 0.2, S0 = 100;
const BOOKS = {
  collar: [{ type: "stock", n: 1 }, { type: "put", K: 95, T: 30 / 365, n: 1 }, { type: "call", K: 105, T: 30 / 365, n: -1 }],
  straddle: [{ type: "call", K: 100, T: 30 / 365, n: 1 }, { type: "put", K: 100, T: 30 / 365, n: 1 }],
  strangle: [{ type: "call", K: 105, T: 30 / 365, n: -1 }, { type: "put", K: 95, T: 30 / 365, n: -1 }],
  rr: [{ type: "call", K: 105, T: 30 / 365, n: 1 }, { type: "put", K: 95, T: 30 / 365, n: -1 }],
  calendar: [{ type: "call", K: 100, T: 30 / 365, n: -1 }, { type: "call", K: 100, T: 60 / 365, n: 1 }],
};
const SPOTS = [90, 95, 98, 100, 102, 105, 110], VOLS = [10, 5, 0, -5, -10];

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let book = "collar", mode = "exact", cell = [105, 5];
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("股价 × 波动率情景矩阵：把整个仓位重新定价", "Spot × vol scenario grid: reprice the whole position")}</div>
    <div class="demo-row">${seg("hg-book", [
      ["collar", T("小凯的领口（含 100 股）", "Kai's collar (with 100 shares)")],
      ["straddle", T("买 30 天跨式", "Long 30d straddle")],
      ["strangle", T("卖 95/105 宽跨", "Short 95/105 strangle")],
      ["rr", T("风险逆转 +105C −95P", "Risk reversal +105C −95P")],
      ["calendar", T("日历 −30 天 +60 天", "Calendar −30d +60d")],
    ], book)}</div>
    <div class="demo-row">${seg("hg-mode", [
      ["exact", T("精确重估", "Exact reprice")],
      ["first", T("一阶估计", "First-order")],
      ["second", T("二阶估计", "Second-order")],
      ["err", T("二阶误差", "Second-order error")],
    ], mode)}</div>
    <div class="demo-grid">${slider("hg-days", T("情景时点（几天后）", "Horizon (days later)"), 0, 10, 1, 1)}</div>
    <div id="hg-greeks"></div>
    <div id="hg-grid" style="overflow-x:auto"></div>
    <div class="demo-math" id="hg-attr"></div>
    <p class="demo-tip">${T("试试：点矩阵里的任意格子，看它的盈亏由哪几项构成。选“小凯的领口”对比 90 和 110 两列：波动率上升在下跌时帮忙、在上涨时拖累——这就是 Vanna。切到“二阶误差”，看估计在角落里失灵。", "Try this: click any cell to see its attribution. With Kai's collar, compare the 90 and 110 columns: higher vol helps on the way down and hurts on the way up — that is vanna. Switch to “second-order error” and watch the estimate fail in the corners.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const valueAt = (legs, S, dv, days) => legs.reduce((a, l) => a + (l.type === "stock" ? l.n * S : l.n * O.bsPrice({ S, K: l.K, T: Math.max(l.T - days / 365, 0), r: R, sigma: SIG + dv / 100, type: l.type })), 0);
  const bookGreeks = (legs) => {
    const g = { delta: 0, gamma: 0, vega: 0, theta: 0, vanna: 0, volga: 0, charm: 0 };
    for (const l of legs) {
      if (l.type === "stock") { g.delta += l.n; continue; }
      const x = O.greeks({ S: S0, K: l.K, T: l.T, r: R, sigma: SIG, type: l.type });
      g.delta += l.n * x.delta; g.gamma += l.n * x.gamma; g.vega += l.n * x.vega; g.theta += l.n * x.theta;
      g.vanna += l.n * x.vanna / 100; g.volga += l.n * x.volga / 1e4; g.charm += l.n * x.charm / 365;
    }
    for (const k in g) g[k] *= 100; // per contract (×100)
    return g;
  };
  const terms = (g, dS, dv, days) => ({
    delta: g.delta * dS, gamma: 0.5 * g.gamma * dS * dS, vega: g.vega * dv, theta: g.theta * days,
    vanna: g.vanna * dS * dv, volga: 0.5 * g.volga * dv * dv,
  });
  const mn = (x, d) => x.toFixed(d).replace("-", "−");
  const draw = (v) => {
    const days = v["hg-days"], legs = BOOKS[book], g = bookGreeks(legs), v0 = valueAt(legs, S0, 0, 0);
    $("#hg-greeks").innerHTML = stats([
      ["Δ " + T("（股）", "(shares)"), mn(g.delta, 1)],
      ["Γ", mn(g.gamma, 2)],
      [T("Vega（美元/点）", "Vega ($/pt)"), mn(g.vega, 2)],
      [T("Theta（美元/天）", "Theta ($/day)"), mn(g.theta, 2)],
      [T("Vanna（股/点）", "Vanna (sh/pt)"), mn(g.vanna, 2), "acc"],
      [T("Volga（美元/点²）", "Volga ($/pt²)"), mn(g.volga, 3)],
      [T("Charm（股/天）", "Charm (sh/day)"), mn(g.charm, 2), "acc"],
    ]);
    const cellVal = (S, dv) => {
      const ex = 100 * (valueAt(legs, S, dv, days) - v0);
      const t = terms(g, S - S0, dv, days);
      const first = t.delta + t.vega + t.theta, second = first + t.gamma + t.vanna + t.volga;
      return mode === "exact" ? ex : mode === "first" ? first : mode === "second" ? second : second - ex;
    };
    const vals = VOLS.map((dv) => SPOTS.map((S) => cellVal(S, dv)));
    const mx = Math.max(1, ...vals.flat().map(Math.abs));
    const bg = (x) => `background:color-mix(in srgb, var(${x >= 0 ? "--green" : "--red"}) ${Math.round(8 + 55 * Math.min(1, Math.abs(x) / mx))}%, transparent)`;
    let h = `<table style="font-size:.9em;font-variant-numeric:tabular-nums"><thead><tr><th>${T("IV ↓ 股价 →", "IV ↓ spot →")}</th>${SPOTS.map((S) => `<th>${S}</th>`).join("")}</tr></thead><tbody>`;
    VOLS.forEach((dv, i) => {
      h += `<tr><th>${dv > 0 ? "+" + dv : dv < 0 ? "−" + -dv : "0"}</th>`;
      SPOTS.forEach((S, j) => {
        const x = vals[i][j], on = cell[0] === S && cell[1] === dv;
        h += `<td data-cell="${S},${dv}" style="${bg(x)};cursor:pointer;text-align:right;padding:6px 5px;${on ? "outline:2px solid var(--ink);" : ""}">${x >= 0 ? "+" : "−"}${Math.abs(x).toFixed(0)}</td>`;
      });
      h += `</tr>`;
    });
    h += `</tbody></table>`;
    $("#hg-grid").innerHTML = h;
    root.querySelectorAll("[data-cell]").forEach((td) => td.addEventListener("click", () => { cell = td.dataset.cell.split(",").map(Number); draw(v); }));
    const [cS, cv] = cell, t = terms(g, cS - S0, cv, days), ex = 100 * (valueAt(legs, cS, cv, days) - v0);
    const f = (x) => (x >= 0 ? "+" : "-") + Math.abs(x).toFixed(1);
    const sum = t.delta + t.gamma + t.vega + t.theta + t.vanna + t.volga;
    $("#hg-attr").innerHTML =
      tex(String.raw`S = ${cS},\ \dd\sigma = ${cv >= 0 ? "+" : ""}${cv}\ \text{${T("点", "pts")}},\ \dd t = ${days}\ \text{${T("天", "days")}}`, true) +
      tex(String.raw`\underbrace{${f(t.delta)}}_{\Delta\,\dd S}\ \underbrace{${f(t.gamma)}}_{\frac12\Gamma\,\dd S^2}\ \underbrace{${f(t.vega)}}_{\nu\,\dd\sigma}\ \underbrace{${f(t.theta)}}_{\Theta\,\dd t}\ \underbrace{${f(t.vanna)}}_{\text{vanna}\,\dd S\,\dd\sigma}\ \underbrace{${f(t.volga)}}_{\frac12\text{volga}\,\dd\sigma^2} = ${f(sum)}\quad \text{${T("精确", "exact")}}: ${f(ex)}`, true);
  };
  const run = bindSliders(root, { "hg-days": (x) => x + T(" 天", x === 1 ? " day" : " days") }, draw);
  onSeg(root, "hg-book", (b) => { book = b; run(); });
  onSeg(root, "hg-mode", (m) => { mode = m; run(); });
}
