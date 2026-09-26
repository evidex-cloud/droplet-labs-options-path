// Inline demo for lesson common-traps: "I was right and still lost" — a call or straddle bought the night before
// earnings, repriced the next morning after the IV crush. Exact sequential attribution: stock move, vol drop, time.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const r = 0.04, K = 100, S0 = 100;
  let kind = "straddle";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("财报后的 IV 崩塌：看对了为什么还亏？", "The post-earnings IV crush: right, and still losing?")}</div>
    <div class="demo-row">${seg("ctc-kind", [["call", T("买入 100 看涨", "Long 100 call")], ["straddle", T("买入 100 跨式", "Long 100 straddle")]], kind)}</div>
    <div class="demo-grid">
      ${slider("ctc-pre", T("财报前 IV", "IV before earnings"), 20, 90, 1, 37)}
      ${slider("ctc-post", T("财报后 IV", "IV after earnings"), 10, 50, 1, 20)}
      ${slider("ctc-move", T("第二天股价变动", "Next-day stock move"), -12, 12, 0.5, 3)}
      ${slider("ctc-days", T("财报前剩余天数", "Days to expiry before earnings"), 2, 45, 1, 7)}
    </div>
    <div class="demo-math" id="ctc-f"></div>
    <div id="ctc-stats"></div>
    <div id="ctc-chart"></div>
    <p class="demo-tip">${T("试试：把“财报后 IV”拉到和“财报前 IV”一样，崩塌就消失了——同样的股价变动突然变成盈利。再把剩余天数拉长：期限越长，事件那一跳在总方差里占比越小，崩塌越温和。", "Try this: set the IV after equal to the IV before and the crush disappears — the same stock move suddenly makes money. Then lengthen the expiry: the longer the option, the smaller the event's share of total variance and the gentler the crush.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  let last = null;
  const value = (S, days, sigma) => {
    const o = { S, K, T: days / 365, r, sigma };
    const c = O.bsPrice({ ...o, type: "call" });
    return kind === "call" ? c : c + O.bsPrice({ ...o, type: "put" });
  };
  const draw = (v) => {
    last = v;
    const pre = v["ctc-pre"] / 100, post = v["ctc-post"] / 100, mv = v["ctc-move"] / 100, d0 = v["ctc-days"], d1 = d0 - 1;
    const S1 = S0 * (1 + mv);
    const V0 = value(S0, d0, pre), Va = value(S1, d0, pre), Vb = value(S1, d0, post), V1 = value(S1, d1, post);
    const pnl = (V1 - V0) * 100;
    const implied = kind === "straddle" ? V0 : value(S0, d0, pre) + O.bsPrice({ S: S0, K, T: d0 / 365, r, sigma: pre, type: "put" });
    // breakeven moves after the crush (search both sides)
    const f = (m) => value(S0 * (1 + m), d1, post) - V0;
    const solve = (a, b) => { if (f(a) * f(b) > 0) return NaN; for (let i = 0; i < 60; i++) { const m = (a + b) / 2; if (f(a) * f(m) <= 0) b = m; else a = m; } return (a + b) / 2; };
    const beUp = solve(0, 0.6), beDn = kind === "straddle" ? solve(-0.6, 0) : NaN;
    const sg = (x) => (x >= 0 ? "+" : "") + x.toFixed(2);
    $("#ctc-f").innerHTML = tex(String.raw`\Delta V = \underbrace{${sg(Va - V0)}}_{\text{${T("股价", "stock move")}}} \; \underbrace{${sg(Vb - Va)}}_{\text{${T("IV 崩塌", "IV crush")}}} \; \underbrace{${sg(V1 - Vb)}}_{\text{${T("一天时间", "one day")}}} = ${sg(V1 - V0)} \text{ ${T("每股", "per share")}}`, true);
    $("#ctc-stats").innerHTML = stats([
      [T("财报前价格", "Price before"), "$" + V0.toFixed(2)],
      [T("隐含波动幅度 ≈ 跨式/S", "Implied move ≈ straddle/S"), "±" + (implied / S0 * 100).toFixed(1) + "%"],
      [T("第二天价值", "Value next day"), "$" + V1.toFixed(2)],
      [T("每张盈亏", "P&L per contract"), (pnl >= 0 ? "+$" : "−$") + Math.abs(pnl).toFixed(0), pnl >= 0 ? "pos" : "neg"],
      [T("崩塌后回本需要", "Move needed after the crush"), (isFinite(beUp) ? "+" + (beUp * 100).toFixed(1) + "%" : "–") + (isFinite(beDn) ? " / " + (beDn * 100).toFixed(1) + "%" : "")],
    ]);
    $("#ctc-chart").innerHTML = lineChart({
      xmin: -12, xmax: 12, xlabel: T("第二天股价变动（%）", "Next-day stock move (%)"), ylabel: T("每张盈亏（$）", "P&L per contract ($)"),
      xfmt: (x) => x + "%",
      series: [
        { f: (m) => (value(S0 * (1 + m / 100), d1, post) - V0) * 100, cls: 0, label: T("IV 崩塌到财报后水平", "IV crushed to the after level") },
        { f: (m) => (value(S0 * (1 + m / 100), d1, pre) - V0) * 100, cls: 1, dashed: true, label: T("如果 IV 不变（假想）", "If IV stayed put (hypothetical)") },
      ],
      markers: [{ x: implied / S0 * 100, label: T("+隐含", "+implied") }, { x: -implied / S0 * 100, label: T("−隐含", "−implied") }],
      points: [{ x: mv * 100, y: pnl, cls: pnl >= 0 ? 3 : 2 }],
      hlines: [{ y: 0 }],
    });
  };
  const run = bindSliders(root, { "ctc-pre": (x) => x + "%", "ctc-post": (x) => x + "%", "ctc-move": (x) => (x > 0 ? "+" : "") + x + "%", "ctc-days": (x) => x + T(" 天", " days") }, draw);
  onSeg(root, "ctc-kind", (k) => { kind = k; run(); });
}
