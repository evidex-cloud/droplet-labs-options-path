// Inline demo for lesson capstone: the three candidate structures (long 100 call, 100/105 call spread, short 95 put)
// repriced on any day after earnings, at any implied vol — per contract or as sized by Kai's $400 budget.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const r = 0.04, T0 = 30 / 365, iv0 = 0.25;
  const px = (K, type) => O.bsPrice({ S: 100, K, T: T0, r, sigma: iv0, type });
  const cands = [
    { id: "A", name: T("A · 买入 100 看涨", "A · long 100 call"), n: 1, cls: 0, legs: [{ type: "call", side: "long", K: 100, premium: px(100, "call"), T: T0 }] },
    { id: "B", name: T("B · 100/105 看涨价差", "B · 100/105 call spread"), n: 2, cls: 3, legs: [{ type: "call", side: "long", K: 100, premium: px(100, "call"), T: T0 }, { type: "call", side: "short", K: 105, premium: px(105, "call"), T: T0 }] },
    { id: "C", name: T("C · 卖出 95 看跌", "C · short 95 put"), n: 0, cls: 2, legs: [{ type: "put", side: "short", K: 95, premium: px(95, "put"), T: T0 }] },
  ];
  let mode = "contract", shares = "off";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("三个候选，财报后的任意一天", "Three candidates on any day after earnings")}</div>
    <div class="demo-row">${seg("cc-mode", [["contract", T("每张合约", "Per contract")], ["sized", T("按 400 美元预算定仓（A×1、B×2、C×0）", "As sized by the $400 budget (A×1, B×2, C×0)")]], mode)}
      ${seg("cc-sh", [["off", T("不含股票", "Without shares")], ["on", T("加上小凯的 100 股", "Add Kai's 100 shares")]], shares)}</div>
    <div class="demo-grid">
      ${slider("cc-s", T("那天的 XYZ", "XYZ that day"), 80, 120, 0.5, 105.5)}
      ${slider("cc-v", T("那天的隐含波动率", "Implied vol that day"), 10, 40, 1, 20)}
      ${slider("cc-d", T("第几天", "Day"), 22, 30, 1, 22)}
    </div>
    <div class="demo-math" id="cc-f"></div>
    <div id="cc-stats"></div>
    <div id="cc-chart"></div>
    <p class="demo-tip">${T("试试：把股价拉到 85，看 C 的亏损冲出预算；切换“按预算定仓”，C 直接消失。再把股价放在 105、隐含波动率拉高：这时价差的 vega 是负的，波动率上升反而伤它。", "Try this: drag XYZ to 85 and watch C's loss break the budget; switch to “as sized” and C disappears. Then park XYZ at 105 and raise implied vol: near the short strike the spread is short vega, so higher vol hurts it.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const S = v["cc-s"], sig = v["cc-v"] / 100, day = v["cc-d"], el = day / 365, opt = { elapsed: el, sigma: sig, r };
    const mult = (c) => (mode === "sized" ? c.n : 1) * 100;
    const shareOn = shares === "on";
    const pl = (c, x) => O.netPLAt(c.legs, x, opt) * mult(c) + (shareOn ? (x - 100) * 100 : 0);
    const vals = cands.map((c) => pl(c, S));
    const left = (30 - day);
    const bVal = O.bsPrice({ S, K: 100, T: left / 365, r, sigma: sig, type: "call" }) - O.bsPrice({ S, K: 105, T: left / 365, r, sigma: sig, type: "call" });
    $("#cc-f").innerHTML = tex(String.raw`V_B = C(${S.toFixed(1)}, 100) - C(${S.toFixed(1)}, 105) = ${bVal.toFixed(2)}\quad (${left}\ \text{${T("天", "days left")}},\ \sigma = ${(sig * 100).toFixed(0)}\%)`, true);
    $("#cc-stats").innerHTML = stats(cands.map((c, i) => [c.name + (mode === "sized" ? ` ×${c.n}` : ""), (vals[i] >= 0 ? "+$" : "−$") + Math.abs(vals[i]).toFixed(0), vals[i] >= 0 ? "pos" : "neg"]).concat([[T("预算", "Budget"), "−$400"]]));
    $("#cc-chart").innerHTML = lineChart({
      xmin: 80, xmax: 120, xlabel: T(`第 ${day} 天的 XYZ 股价`, `XYZ on day ${day}`), ylabel: T("盈亏（$）", "P&L ($)"),
      series: cands.map((c) => ({ f: (x) => pl(c, x), cls: c.cls, label: c.name + (mode === "sized" ? ` ×${c.n}` : "") })),
      hlines: [{ y: -400, label: T("400 美元预算", "$400 budget") }],
      markers: [{ x: S, label: "S" }],
    });
  };
  const run = bindSliders(root, { "cc-s": (x) => "$" + x, "cc-v": (x) => x + "%", "cc-d": (x) => T("第 " + x + " 天", "day " + x) }, draw);
  onSeg(root, "cc-mode", (m) => { mode = m; run(); });
  onSeg(root, "cc-sh", (m) => { shares = m; run(); });
}
