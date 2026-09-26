// Inline demo for lesson payoff-diagrams: pick a position, slide the expiry price S_T,
// read the P&L off the diagram (per share or per contract) and see the arithmetic and the local slope.
import * as O from "./_opt.js";
import { payoffChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const Tm = 30 / 365, r = O.XYZ.r, sigma = O.XYZ.sigma;
  const px = (K, type) => Math.round(O.bsPrice({ S: 100, K, T: Tm, r, sigma, type }) * 100) / 100;
  const c100 = px(100, "call"), p100 = px(100, "put"), p95 = px(95, "put"), c105 = px(105, "call");
  const f2 = (x) => x.toFixed(2);
  const POS = {
    lc: { name: T("买入 100 看涨", "Long 100 call"), legs: [{ type: "call", side: "long", K: 100, premium: c100 }],
      f: (s) => String.raw`\Pi = \max(${f2(s)} - 100,\ 0) - ${f2(c100)}` },
    lp: { name: T("买入 100 看跌", "Long 100 put"), legs: [{ type: "put", side: "long", K: 100, premium: p100 }],
      f: (s) => String.raw`\Pi = \max(100 - ${f2(s)},\ 0) - ${f2(p100)}` },
    sc: { name: T("卖出 100 看涨", "Short 100 call"), legs: [{ type: "call", side: "short", K: 100, premium: c100 }],
      f: (s) => String.raw`\Pi = ${f2(c100)} - \max(${f2(s)} - 100,\ 0)` },
    sp: { name: T("卖出 95 看跌", "Short 95 put"), legs: [{ type: "put", side: "short", K: 95, premium: p95 }],
      f: (s) => String.raw`\Pi = ${f2(p95)} - \max(95 - ${f2(s)},\ 0)` },
    st: { name: T("小凯的股票", "Kai's shares"), legs: [{ type: "stock", side: "long", entry: 100 }],
      f: (s) => String.raw`\Pi = ${f2(s)} - 100` },
    cc: { name: T("备兑看涨", "Covered call"), legs: [{ type: "stock", side: "long", entry: 100 }, { type: "call", side: "short", K: 105, premium: c105 }],
      f: (s) => String.raw`\Pi = (${f2(s)} - 100) + ${f2(c105)} - \max(${f2(s)} - 105,\ 0)` },
  };
  let pos = "lc", unit = "share";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("读一个点：到期价在这里，我赚多少？", "Read one point: if XYZ ends here, what do I make?")}</div>
    <div class="demo-row">${seg("pdr-pos", Object.entries(POS).map(([k, v]) => [k, v.name]), pos)}</div>
    <div class="demo-row">${seg("pdr-unit", [["share", T("每股", "Per share")], ["contract", T("每张合约（×100）", "Per contract (×100)")]], unit)}</div>
    ${slider("pdr-s", T("到期时 XYZ 的价格 S<sub>T</sub>", "XYZ price at expiry S<sub>T</sub>"), 80, 120, 0.5, 110)}
    <div class="demo-math" id="pdr-f"></div>
    <div id="pdr-stats"></div>
    <div id="pdr-chart"></div>
    <p class="demo-tip">${T("试试：把 S<sub>T</sub> 从 80 慢慢拉到 120，看“这里的斜率”什么时候变——它只在行权价处变。切到每张合约，纵轴乘 100，横轴和盈亏平衡点不动。", "Try this: drag S<sub>T</sub> slowly from 80 to 120 and watch when “slope here” changes: only at a strike. Switch to per contract: the vertical axis is multiplied by 100, while the horizontal axis and the breakeven stay put.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const s = v["pdr-s"], P = POS[pos], mult = unit === "contract" ? 100 : 1;
    const pl = O.netPL(P.legs, s), slope = Math.round((O.netPL(P.legs, s + 0.01) - O.netPL(P.legs, s - 0.01)) / 0.02);
    const tail = mult === 100 ? String.raw` \quad\Rightarrow\quad ${f2(pl)} \times 100 = ${pl < 0 ? "-" : ""}\$${Math.abs(pl * 100).toFixed(0)}` : "";
    $("#pdr-f").innerHTML = tex(P.f(s) + String.raw` = ${f2(pl)}` + tail, true);
    $("#pdr-stats").innerHTML = stats([
      [T("到期价 S<sub>T</sub>", "Expiry price S<sub>T</sub>"), "$" + s.toFixed(2)],
      [T("盈亏", "P&L") + (mult === 100 ? T("（每张）", " (contract)") : T("（每股）", " (per share)")), (pl * mult >= 0 ? "+" : "−") + "$" + Math.abs(pl * mult).toFixed(mult === 100 ? 0 : 2), pl >= 0 ? "pos" : "neg"],
      [T("这里的斜率", "Slope here"), (slope > 0 ? "+" : "") + slope, "acc"],
    ]);
    const { html } = payoffChart({
      legs: P.legs, lo: 80, hi: 120, spot: s, mult,
      xlabel: T("到期时的 XYZ 价格 S_T", "XYZ price at expiry S_T"), ylabel: mult === 100 ? T("盈亏（美元/张）", "P&L ($ per contract)") : T("盈亏（美元/股）", "P&L ($ per share)"),
      labels: { expiry: T("到期盈亏", "P&L at expiry"), spot: T("到期价", "ends here"), be: T("平衡", "BE") },
    });
    $("#pdr-chart").innerHTML = html;
  };
  const run = bindSliders(root, { "pdr-s": (x) => "$" + (+x).toFixed(1) }, draw);
  onSeg(root, "pdr-pos", (k) => { pos = k; run(); });
  onSeg(root, "pdr-unit", (k) => { unit = k; run(); });
}
