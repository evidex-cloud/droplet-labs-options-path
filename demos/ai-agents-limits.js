// Inline demo for lesson ai-agents: deterministic pre-trade risk checks, the kind of gate that should sit between any
// AI agent and a broker. Pick a proposed order and the limits; every inequality is evaluated with the pricing engine.
import * as O from "./_opt.js";
import { seg, onSeg, slider, bindSliders, tex } from "./_viz.js";

const r = 0.04, sig = 0.2, D = 30 / 365;
const px = (type, S, K) => O.bsPrice({ S, K, T: D, r, sigma: sig, type });
const STRUCT = {
  cc: { legs: (q) => [{ type: "call", K: 105, q: -q }], zh: "卖出备兑看涨 105", en: "Sell covered calls 105" },
  naked: { legs: (q) => [{ type: "call", K: 100, q: -q }], zh: "卖出看涨 100", en: "Sell calls 100" },
  spread: { legs: (q) => [{ type: "put", K: 95, q }, { type: "put", K: 90, q: -q }], zh: "买入看跌价差 95/90", en: "Buy put spread 95/90" },
  csp: { legs: (q) => [{ type: "put", K: 95, q: -q }], zh: "卖出现金担保看跌 95", en: "Sell cash-secured puts 95" },
};

export function checkOrder(kind, q, lim) {
  const legs = STRUCT[kind].legs(q).map((l) => ({ ...l, p: px(l.type, 100, l.K) }));
  let delta = 100, vega = 0;
  for (const l of legs) { const g = O.greeks({ S: 100, K: l.K, T: D, r, sigma: sig, type: l.type }); delta += l.q * 100 * g.delta; vega += l.q * 100 * g.vega; }
  const pnl = (S) => 100 * (S - 100) + legs.reduce((a, l) => a + l.q * 100 * (px(l.type, S, l.K) - l.p), 0);
  const worst = Math.min(...[-0.2, -0.1, 0.1, 0.2].map((m) => pnl(100 * (1 + m))));
  const shortCalls = legs.filter((l) => l.type === "call" && l.q < 0).reduce((a, l) => a - l.q, 0);
  // short puts need cash K × 100 unless covered by long puts with a higher strike; long options need their premium
  const shortPut = legs.filter((l) => l.type === "put" && l.q < 0).reduce((a, l) => a - l.q * l.K * 100, 0);
  const longPut = legs.filter((l) => l.type === "put" && l.q > 0).reduce((a, l) => a + l.q * l.K * 100, 0);
  const cashNeed = Math.max(0, shortPut - longPut) + legs.filter((l) => l.q > 0).reduce((a, l) => a + l.q * l.p * 100, 0) - legs.filter((l) => l.q < 0 && l.type === "put" && longPut > 0).reduce((a, l) => a - l.q * l.p * 100, 0);
  return {
    delta, vega, worst, cashNeed, uncovered: Math.max(0, shortCalls - 1),
    checks: [
      ["delta", Math.abs(delta) <= lim.delta], ["vega", Math.abs(vega) <= lim.vega], ["stress", worst >= -lim.stress],
      ["cover", Math.max(0, shortCalls - 1) === 0], ["cash", cashNeed <= 10000],
    ],
  };
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let kind = "cc";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("下单前的风险闸门：每一条都是一个不等式", "A pre-trade risk gate: every rule is an inequality")}</div>
    ${seg("al-k", Object.entries(STRUCT).map(([k, v]) => [k, en ? v.en : v.zh]), "cc")}
    <div class="demo-grid">
      ${slider("al-q", T("合约张数", "Contracts"), 1, 20, 1, 1)}
      ${slider("al-s", T("压力亏损上限 L（美元）", "Stress-loss limit L ($)"), 1000, 10000, 500, 3000)}
      ${slider("al-d", T("Delta 上限（股）", "Delta limit (shares)"), 50, 500, 10, 150)}
      ${slider("al-v", T("Vega 上限（每波动率点，美元）", "Vega limit ($ per vol point)"), 10, 300, 10, 50)}
    </div>
    <div id="al-out"></div>
    <p class="demo-tip">${T("看什么：账户里有 100 股 XYZ 和 10,000 美元现金。一张备兑看涨轻松过关；把“卖出看涨 100”加到 5 张，Delta、Vega、压力亏损和“裸卖”四条同时亮红。这些检查不需要任何 AI——正因如此，AI 绕不过它们。", "What to notice: the account holds 100 XYZ shares and $10,000 cash. One covered call passes easily; push “Sell calls 100” to 5 contracts and delta, vega, stress loss and the uncovered rule all turn red at once. None of these checks needs any AI — which is exactly why an AI cannot talk its way past them.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const run = bindSliders(root, { "al-q": (x) => x, "al-s": (x) => "$" + (+x).toLocaleString("en-US"), "al-d": (x) => x, "al-v": (x) => "$" + x }, (v) => {
    const lim = { stress: v["al-s"], delta: v["al-d"], vega: v["al-v"] }, c = checkOrder(kind, v["al-q"], lim);
    const ok = Object.fromEntries(c.checks);
    const pill = (b) => `<span class="pill ${b ? "ok" : "bad"}">${b ? T("通过", "pass") : T("拦截", "block")}</span>`;
    const row = (name, formula, b) => `<tr><td>${name}</td><td style="text-align:left">${tex(formula)}</td><td>${pill(b)}</td></tr>`;
    const all = c.checks.every((x) => x[1]);
    const k = (x) => Math.round(Math.abs(x)).toLocaleString("en-US").replace(/,/g, "{,}"), le = (b) => (b ? String.raw`\le` : ">"), ge = (b) => (b ? String.raw`\ge` : "<");
    $("#al-out").innerHTML = `<table><tr><th>${T("规则", "Rule")}</th><th style="text-align:left">${T("检查（实时数字；压力情景 m = ±10%、±20%）", "Check (live numbers; stress scenarios m = ±10%, ±20%)")}</th><th></th></tr>`
      + row(T("方向敞口", "Direction"), String.raw`\lvert \Delta_{\text{book}} + \Delta_{\text{order}} \rvert = ${k(c.delta)} ${le(ok.delta)} ${k(lim.delta)}`, ok.delta)
      + row(T("波动率敞口", "Volatility"), String.raw`\lvert \nu \rvert = \$${k(c.vega)} ${le(ok.vega)} \$${k(lim.vega)}`, ok.vega)
      + row(T("压力测试", "Stress test"), String.raw`\min_{m} \Pi = ${c.worst < 0 ? "-" : ""}\$${k(c.worst)} ${ge(ok.stress)} -\$${k(lim.stress)}`, ok.stress)
      + row(T("不许裸卖看涨", "No uncovered calls"), String.raw`\text{${T("裸卖张数", "uncovered")}} = ${c.uncovered} ${ok.cover ? "=" : ">"} 0`, ok.cover)
      + row(T("现金担保", "Cash cover"), String.raw`\text{${T("所需现金", "cash needed")}} = \$${k(c.cashNeed)} ${le(ok.cash)} \$10{,}000`, ok.cash)
      + `</table><div class="demo-out" style="margin-top:10px">${all ? T("✓ 全部通过：订单可以进入人工批准环节。", "✓ All checks pass: the order may go on to human approval.") : T("✗ 订单被拦截，不会发送给券商——无论智能体怎么说。", "✗ Order blocked and never sent to the broker — whatever the agent says.")}</div>`;
  });
  onSeg(root, "al-k", (v) => { kind = v; run(); });
}
