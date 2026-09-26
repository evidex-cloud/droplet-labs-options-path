// Main demo for lesson before-expiry: expiry P&L (solid) vs today's mark-to-model P&L (dashed) for six positions.
// Entry premiums are priced at 30 days and σ = 20%; the sliders move the date, the implied volatility and the stock.
import * as O from "./_opt.js";
import { payoffChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const T0 = 30 / 365, r = O.XYZ.r, sig0 = O.XYZ.sigma;
  const px = (K, type) => O.bsPrice({ S: 100, K, T: T0, r, sigma: sig0, type });
  const C = (side, K) => ({ type: "call", side, K, premium: px(K, "call"), T: T0 });
  const P = (side, K) => ({ type: "put", side, K, premium: px(K, "put"), T: T0 });
  const POS = {
    lc: [T("买入 100 看涨", "Long 100 call"), [C("long", 100)]],
    lp: [T("买入 100 看跌", "Long 100 put"), [P("long", 100)]],
    sc: [T("卖出 100 看涨", "Short 100 call"), [C("short", 100)]],
    sd: [T("买入跨式", "Long straddle"), [C("long", 100), P("long", 100)]],
    bc: [T("牛市看涨价差 100/105", "Bull call spread 100/105"), [C("long", 100), C("short", 105)]],
    cc: [T("备兑看涨", "Covered call"), [{ type: "stock", side: "long", entry: 100 }, C("short", 105)]],
  };
  let pos = "lc", ghosts = "on";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("今天的曲线与到期的折线", "Today's curve versus the expiry line")}</div>
    <div class="demo-row">${seg("be-pos", Object.entries(POS).map(([k, v]) => [k, v[0]]), pos)}</div>
    <div class="demo-grid">
      ${slider("be-d", T("离到期还剩（天）", "Days left to expiry"), 0, 30, 1, 30)}
      ${slider("be-v", T("隐含波动率 σ（买入时 20%）", "Implied volatility σ (20% at entry)"), 5, 60, 1, 20)}
      ${slider("be-s", T("XYZ 现在的价格", "XYZ price now"), 85, 115, 0.5, 100)}
    </div>
    <div class="demo-row">${seg("be-gh", [["on", T("显示 21/14/7 天的曲线", "Show 21/14/7-day curves")], ["off", T("只看当前日期", "Current date only")]], ghosts)}</div>
    <div class="demo-math" id="be-f"></div>
    <div id="be-stats"></div>
    <div id="be-chart"></div>
    <p class="demo-tip">${T("试试：选买入看涨，把天数从 30 拉到 0，虚线一路沉到折线上，最后几天沉得最快。再把 σ 从 20% 拉到 30%：虚线整体上抬。换成卖出看涨，同样的操作方向全反。", "Try this: with the long call, drag the days from 30 to 0 and watch the dashed curve sink onto the solid line, fastest in the last few days. Then push σ from 20% to 30%: the whole dashed curve lifts. Switch to the short call and every move goes the other way.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const days = v["be-d"], sigma = v["be-v"] / 100, S = v["be-s"], elapsed = (30 - days) / 365;
    const legs = POS[pos][1];
    const opts = { elapsed, sigma, r };
    const plNow = O.netPLAt(legs, S, opts), plExp = O.netPL(legs, S);
    const g = O.positionGreeks(legs, S, opts);
    const prem = legs.reduce((a, l) => a + (l.type === "stock" ? 0 : (l.side === "long" ? 1 : -1) * l.premium), 0);
    const value = g.value - legs.reduce((a, l) => a + (l.type === "stock" ? (l.side === "long" ? 1 : -1) * l.entry : 0), 0);
    $("#be-f").innerHTML = tex(String.raw`\Pi_{\text{${en ? "today" : "今天"}}}(S) = V(S,\ \tau = ${days}/365,\ \sigma = ${(sigma * 100).toFixed(0)}\%) - V_{\text{${en ? "entry" : "买入"}}} = ${value.toFixed(2)} - (${prem.toFixed(2)}) = ${plNow.toFixed(2)}`, true);
    $("#be-stats").innerHTML = stats([
      [T("今天的盈亏/股", "P&L today / share"), (plNow >= 0 ? "+" : "−") + Math.abs(plNow).toFixed(2), plNow >= 0 ? "pos" : "neg"],
      [T("若到期时仍在此价", "At expiry, same price"), (plExp >= 0 ? "+" : "−") + Math.abs(plExp).toFixed(2), plExp >= 0 ? "pos" : "neg"],
      [T("差值（时间价值）", "Gap (time value)"), (plNow - plExp >= 0 ? "+" : "−") + Math.abs(plNow - plExp).toFixed(2), "acc"],
      ["Δ", g.delta.toFixed(3).replace("-", "−")],
      [T("Θ（每天）", "Θ (per day)"), g.theta.toFixed(3).replace("-", "−")],
      [T("ν（每个波动率点）", "ν (per vol point)"), g.vega.toFixed(3).replace("-", "−")],
    ]);
    const extra = ghosts === "on" ? [21, 14, 7].filter((d) => d < 30).map((d, i) => ({
      f: (x) => O.netPLAt(legs, x, { elapsed: (30 - d) / 365, sigma, r }), cls: [1, 4, 3][i], dashed: true, label: T(`剩 ${d} 天`, `${d} days left`),
    })) : [];
    $("#be-chart").innerHTML = payoffChart({
      legs, lo: 85, hi: 115, spot: S, today: { elapsed, sigma, r }, extra,
      xlabel: T("XYZ 价格", "XYZ price"), ylabel: T("盈亏（美元/股）", "P&L ($ per share)"),
      labels: { expiry: T("到期", "At expiry"), today: T(`今天（剩 ${days} 天）`, `Today (${days} days left)`), spot: T("现价", "now"), be: T("平衡", "BE") },
    }).html;
  };
  const run = bindSliders(root, { "be-d": (x) => x + T(" 天", " days"), "be-v": (x) => x + "%", "be-s": (x) => "$" + (+x).toFixed(1) }, draw);
  onSeg(root, "be-pos", (k) => { pos = k; run(); });
  onSeg(root, "be-gh", (k) => { ghosts = k; run(); });
}
