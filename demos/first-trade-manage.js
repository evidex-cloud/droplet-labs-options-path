// Inline demo for lesson first-trade: move the day and XYZ's price; the 105 call is repriced with
// Black-Scholes and the pre-written rule that applies is shown.
import * as O from "./_opt.js";
import { slider, bindSliders, lineChart, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const K = 105, S0 = 100, c0 = 0.71, r = 0.04, D = 30;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("按规则管理：今天该做什么？", "Managing by the rules: what does today call for?")}</div>
    <div class="demo-grid">
      ${slider("ftm-day", T("已过天数", "Days elapsed"), 0, 30, 1, 12)}
      ${slider("ftm-s", T("XYZ 价格", "XYZ price"), 85, 112, 0.5, 100)}
      ${slider("ftm-iv", T("隐含波动率", "Implied volatility"), 10, 40, 1, 20)}
      ${slider("ftm-tp", T("止盈比例", "Take-profit share"), 30, 90, 5, 50)}
    </div>
    <div class="demo-math" id="ftm-f"></div>
    <div id="ftm-stats"></div>
    <div id="ftm-rule"></div>
    <div id="ftm-chart"></div>
    <p class="demo-tip">${T("试试：价格停在 100，把天数从 0 拉到 30，看止盈在第 12 天左右触发；再把价格拉到 104、天数拉到 29，进入展期区。把 IV 调到 30%（财报前常见）——同样的价格，看涨期权更贵，止盈来得更晚。", "Try this: keep XYZ at 100 and drag the days from 0 to 30 — the take-profit fires around day 12. Then set 104 and day 29: the roll zone. Raise IV to 30% (common before earnings): at the same price the call is dearer and the take-profit comes later.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const call = (S, left, sig) => O.bsPrice({ S, K, T: left / 365, r, sigma: sig, type: "call" });
  bindSliders(root, { "ftm-day": (x) => x + T(" 天", " days"), "ftm-s": (x) => "$" + x, "ftm-iv": (x) => x + "%", "ftm-tp": (x) => x + "%" }, (v) => {
    const day = v["ftm-day"], S = v["ftm-s"], sig = v["ftm-iv"] / 100, p = v["ftm-tp"] / 100, left = D - day;
    const c = call(S, left, sig), tp = Math.floor((1 - p) * c0 * 100 + 1e-6) / 100;
    const pnlCall = (c0 - c) * 100, pnlStock = (S - S0) * 100, cap = (c0 - c) / c0;
    $("#ftm-f").innerHTML = tex(String.raw`c = C_{\text{BS}}(S = ${S.toFixed(1)},\ K = 105,\ T = \tfrac{${left}}{365},\ \sigma = ${(sig * 100).toFixed(0)}\%) = ${c.toFixed(2)}`, true) + tex(String.raw`\text{threshold } \lfloor (1 - ${p.toFixed(2)}) \times 0.71 \rfloor_{\text{cent}} = ${tp.toFixed(2)}`, true);
    $("#ftm-stats").innerHTML = stats([
      [T("看涨现值", "Call now"), "$" + c.toFixed(2), "acc"],
      [T("已锁定权利金", "Premium captured"), (cap * 100).toFixed(0) + "%", cap >= 0 ? "pos" : "neg"],
      [T("看涨盈亏", "Call P&L"), O.fmtUsd(pnlCall, 0), pnlCall >= 0 ? "pos" : "neg"],
      [T("股票盈亏", "Shares P&L"), O.fmtUsd(pnlStock, 0), pnlStock >= 0 ? "pos" : "neg"],
      [T("合计", "Total"), O.fmtUsd(pnlCall + pnlStock, 0), pnlCall + pnlStock >= 0 ? "pos" : "neg"],
    ]);
    let rule;
    if (S < 95) rule = `<div class="demo-log bad">${T(`观点失效：收盘低于 95。以约 $${(c * 100).toFixed(0)} 买回看涨，然后重新决定股票——看涨从来没有保护它们。`, `Thesis broken: a close below 95. Buy back the call for about $${(c * 100).toFixed(0)}, then decide about the shares — the call never protected them.`)}</div>`;
    else if (c <= tp + 1e-9) rule = `<div class="demo-log ok">${T(`止盈：看涨只值 ${c.toFixed(2)} ≤ ${tp.toFixed(2)}。买入平仓，锁定约 $${(pnlCall).toFixed(0)}。`, `Take profit: the call is worth ${c.toFixed(2)} ≤ ${tp.toFixed(2)}. Buy to close and lock about $${pnlCall.toFixed(0)}.`)}</div>`;
    else if (S >= K && left <= 7) rule = `<div class="demo-log warn">${T("高于行权价、临近到期：按计划接受被行权（等于以 105.71 卖出），或以净收入展期到更远、更高的行权价。", "Above the strike near expiry: per the plan, accept assignment (a sale at 105.71) or roll up and out for a net credit.")}</div>`;
    else if (S >= 103 && (left <= 7 || (day >= 19 && day <= 21))) rule = `<div class="demo-log warn">${T(`展期区（${left <= 7 ? "最后一周" : "财报前"}）：在“接受被行权”与“展期”之间做决定。下月 105 看涨约 $${call(S, 30, sig).toFixed(2)}。`, `Roll zone (${left <= 7 ? "last week" : "before earnings"}): decide between accepting assignment and rolling. Next month's 105 call is about $${call(S, 30, sig).toFixed(2)}.`)}</div>`;
    else rule = `<div class="demo-log">${T("没有规则触发：让时间价值继续流走，什么都不做。", "No rule fires: let time decay work and do nothing.")}</div>`;
    $("#ftm-rule").innerHTML = rule;
    const pts = [];
    for (let d = 0; d <= D; d++) pts.push([d, call(S, D - d, sig)]);
    $("#ftm-chart").innerHTML = lineChart({
      xmin: 0, xmax: 30, ymin: 0, xlabel: T("已过天数（XYZ 固定在当前价）", "Days elapsed (XYZ held at the current price)"), ylabel: T("105 看涨价值", "105 call value"),
      series: [{ points: pts, cls: 0, label: T("看涨价值", "Call value") }],
      hlines: [{ y: tp, label: T("止盈线", "take-profit line") }], markers: [{ x: 21, label: T("财报", "earnings") }],
      points: [{ x: day, y: c, cls: 2, label: c.toFixed(2) }],
    });
  });
}
