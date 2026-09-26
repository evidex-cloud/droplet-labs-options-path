// Main demo for lesson arbitrage-bounds: type in a small chain of European quotes and check every
// model-free rule (walls, strike monotonicity, slope, convexity, calendar, parity preview).
// For each broken rule it prints the exact trade and today's cash flow.
import * as O from "./_opt.js";
import { slider, bindSliders, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const inp = (id, label) => `<div class="demo-field"><label class="demo-label" for="${id}">${label}</label><input class="demo-inp" id="${id}" type="number" step="0.01" min="0"></div>`;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("套利边界检查器：输入一小段期权链", "Arbitrage-bound checker: type in a small chain")}</div>
    <div class="demo-grid">
      ${slider("ab-s", T("现价 S", "Spot S"), 80, 120, 0.5, 100)}
      ${slider("ab-t", T("到期天数 T", "Days to expiry T"), 5, 365, 1, 30)}
      ${slider("ab-r", T("利率 r", "Rate r"), 0, 8, 0.25, 4)}
    </div>
    <div class="demo-label">${T("欧式期权报价（假设你能按这些价格成交；无股息）", "European quotes (assume you can trade at these prices; no dividend)")}</div>
    <div class="demo-grid-3">
      ${inp("ab-c95", T("95 看涨", "95 call"))}${inp("ab-c100", T("100 看涨", "100 call"))}${inp("ab-c105", T("105 看涨", "105 call"))}
      ${inp("ab-p100", T("100 看跌", "100 put"))}${inp("ab-cl", T("100 看涨，期限 2T", "100 call, expiry 2T"))}
    </div>
    <div class="demo-btns">
      <button class="demo-btn" data-ab="fair">${T("公平报价（σ = 20%）", "Fair quotes (σ = 20%)")}</button>
      <button class="demo-btn" data-ab="floor">${T("95 看涨跌破地板", "95 call below its floor")}</button>
      <button class="demo-btn" data-ab="inv">${T("行权价倒挂", "Inverted strikes")}</button>
      <button class="demo-btn" data-ab="fly">${T("蝶式为负", "Negative butterfly")}</button>
      <button class="demo-btn" data-ab="cal">${T("长期反而便宜", "Longer is cheaper")}</button>
      <button class="demo-btn" data-ab="put">${T("看跌超过 K 的现值", "Put above PV(K)")}</button>
    </div>
    <div id="ab-rules"></div>
    <div id="ab-trades"></div>
    <p class="demo-tip">${T("试试：按“公平报价”，再把 100 看涨一分一分往上加：平价几乎立刻被打破，蝶式在加了约 0.82 后变负，日历规则在约 1.11 后被打破，而上下墙要等它超过 100 才会反对。", "Try this: press “Fair quotes”, then raise the 100 call a few cents at a time: parity breaks almost at once, the butterfly turns negative after about $0.82, the calendar rule after about $1.11 — while the walls don't object until the call passes $100.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const ids = ["ab-c95", "ab-c100", "ab-c105", "ab-p100", "ab-cl"];
  let env = { S: 100, Tm: 30 / 365, r: 0.04 };
  const q = (id) => parseFloat($("#" + id).value);
  const fairQuotes = () => {
    const { S, Tm, r } = env, c = (K, t) => O.bsPrice({ S, K, T: t, r, sigma: 0.2, type: "call" });
    return { "ab-c95": c(95, Tm), "ab-c100": c(100, Tm), "ab-c105": c(105, Tm), "ab-p100": O.bsPrice({ S, K: 100, T: Tm, r, sigma: 0.2, type: "put" }), "ab-cl": c(100, 2 * Tm) };
  };
  const setQuotes = (o) => { for (const [id, v] of Object.entries(o)) $("#" + id).value = Math.max(0, v).toFixed(2); check(); };
  const usd = (x) => (x < 0 ? "−$" : "+$") + Math.abs(x).toFixed(2);
  const check = () => {
    const { S, Tm, r } = env, D = Math.exp(-r * Tm);
    const c95 = q("ab-c95"), c100 = q("ab-c100"), c105 = q("ab-c105"), p = q("ab-p100"), cl = q("ab-cl");
    if ([c95, c100, c105, p, cl].some((x) => !isFinite(x))) { $("#ab-rules").innerHTML = `<div class="demo-log warn">${T("请填入全部五个报价。", "Fill in all five quotes.")}</div>`; $("#ab-trades").innerHTML = ""; return; }
    const rules = [], trades = [];
    const add = (name, latex, ok, edge, trade) => { rules.push({ name, latex, ok }); if (!ok) trades.push({ name, edge, trade }); };
    for (const [K, c] of [[95, c95], [100, c100], [105, c105]]) {
      const lb = Math.max(S - K * D, 0);
      add(T(`${K} 看涨 ≥ 地板`, `${K} call ≥ floor`), String.raw`${c.toFixed(2)} \ge \max(S - ${K}e^{-rT},0) = ${lb.toFixed(2)}`, c >= lb - 1e-9, lb - c,
        T(`买入 ${K} 看涨，卖空 1 股，把 ${(K * D).toFixed(2)} 存到到期`, `buy the ${K} call, short one share, lend ${(K * D).toFixed(2)} until expiry`));
      add(T(`${K} 看涨 ≤ 股价`, `${K} call ≤ stock`), String.raw`${c.toFixed(2)} \le S = ${S}`, c <= S + 1e-9, c - S, T(`卖出 ${K} 看涨，买入 1 股`, `sell the ${K} call, buy one share`));
    }
    const plb = Math.max(100 * D - S, 0), pub = 100 * D;
    add(T("100 看跌 ≥ 地板", "100 put ≥ floor"), String.raw`${p.toFixed(2)} \ge \max(100e^{-rT} - S,0) = ${plb.toFixed(2)}`, p >= plb - 1e-9, plb - p, T(`买入看跌，买入 1 股，借入 ${pub.toFixed(2)}`, `buy the put, buy one share, borrow ${pub.toFixed(2)}`));
    add(T("100 看跌 ≤ K 的现值", "100 put ≤ PV(K)"), String.raw`${p.toFixed(2)} \le 100e^{-rT} = ${pub.toFixed(2)}`, p <= pub + 1e-9, p - pub, T(`卖出看跌，把 ${pub.toFixed(2)} 存到到期（足够支付最大赔付 100）`, `sell the put, deposit ${pub.toFixed(2)} until expiry (enough to pay the maximum 100)`));
    add(T("递减：95 ≥ 100", "falling: 95 ≥ 100"), String.raw`${c95.toFixed(2)} \ge ${c100.toFixed(2)}`, c95 >= c100 - 1e-9, c100 - c95, T("买入 95 看涨，卖出 100 看涨（牛市价差，到期 ≥ 0）", "buy the 95 call, sell the 100 call (bull spread, payoff ≥ 0)"));
    add(T("递减：100 ≥ 105", "falling: 100 ≥ 105"), String.raw`${c100.toFixed(2)} \ge ${c105.toFixed(2)}`, c100 >= c105 - 1e-9, c105 - c100, T("买入 100 看涨，卖出 105 看涨", "buy the 100 call, sell the 105 call"));
    const w = 5 * D;
    add(T("限速：95 − 100", "speed limit: 95 − 100"), String.raw`${c95.toFixed(2)} - ${c100.toFixed(2)} \le 5e^{-rT} = ${w.toFixed(2)}`, c95 - c100 <= w + 1e-9, c95 - c100 - w, T(`卖出 95 看涨，买入 100 看涨，把 ${w.toFixed(2)} 存到到期`, `sell the 95 call, buy the 100 call, deposit ${w.toFixed(2)} until expiry`));
    add(T("限速：100 − 105", "speed limit: 100 − 105"), String.raw`${c100.toFixed(2)} - ${c105.toFixed(2)} \le ${w.toFixed(2)}`, c100 - c105 <= w + 1e-9, c100 - c105 - w, T(`卖出 100 看涨，买入 105 看涨，把 ${w.toFixed(2)} 存到到期`, `sell the 100 call, buy the 105 call, deposit ${w.toFixed(2)} until expiry`));
    const fly = c95 - 2 * c100 + c105;
    add(T("凸性（蝶式 ≥ 0）", "convexity (butterfly ≥ 0)"), String.raw`${c95.toFixed(2)} - 2(${c100.toFixed(2)}) + ${c105.toFixed(2)} = ${fly.toFixed(2)} \ge 0`, fly >= -1e-9, -fly, T("买入 95 和 105 看涨，卖出两张 100 看涨", "buy the 95 and 105 calls, sell two 100 calls"));
    add(T("日历：2T 的看涨 ≥ T 的看涨", "calendar: 2T call ≥ T call"), String.raw`${cl.toFixed(2)} \ge ${c100.toFixed(2)}`, cl >= c100 - 1e-9, c100 - cl, T("买入长期看涨，卖出短期看涨（无股息时成立）", "buy the longer call, sell the shorter one (holds with no dividend)"));
    const gap = c100 - p - (S - 100 * D);
    add(T("平价（预告）", "parity (preview)"), String.raw`C - P = ${(c100 - p).toFixed(2)} \;\text{vs}\; S - 100e^{-rT} = ${(S - 100 * D).toFixed(2)}`, Math.abs(gap) < 0.011, Math.abs(gap),
      gap > 0 ? T("卖出看涨、买入看跌、买入股票、借入 K 的现值（转换）", "sell the call, buy the put, buy the stock, borrow PV(K) (a conversion)") : T("买入看涨、卖出看跌、卖空股票、借出 K 的现值（反转换）", "buy the call, sell the put, short the stock, lend PV(K) (a reversal)"));
    $("#ab-rules").innerHTML = `<table><thead><tr><th>${T("规则", "Rule")}</th><th>${T("检查", "Check")}</th><th></th></tr></thead><tbody>${rules.map((x) => `<tr class="${x.ok ? "" : "hl"}"><td>${x.name}</td><td>${tex(x.latex)}</td><td><span class="tag ${x.ok ? "ok" : "bad"}">${x.ok ? T("通过", "ok") : T("违反", "broken")}</span></td></tr>`).join("")}</tbody></table>`;
    $("#ab-trades").innerHTML = trades.length
      ? trades.map((t) => `<div class="demo-log bad"><div><b>${t.name}</b> · ${t.trade}. ${T("今天净收", "Cash today")} ${usd(t.edge)} ${T("每股", "per share")} (${usd(t.edge * 100)} ${T("每组", "per set")})${T("，到期不会欠钱。", ", and nothing is owed at expiry.")}</div></div>`).join("")
      : `<div class="demo-log ok">${T("全部规则通过：这些报价之间没有无模型的套利。但注意——把所有报价同时乘以 1.5，大多数规则照样通过：边界管不住价格的“水平”。", "Every rule passes: no model-free arbitrage among these quotes. But notice — scale all option quotes up together and most rules still pass: bounds can't pin down the level.")}</div>`;
  };
  bindSliders(root, { "ab-s": (x) => "$" + x, "ab-t": (x) => x + T(" 天", " days"), "ab-r": (x) => x + "%" }, (v) => {
    env = { S: v["ab-s"], Tm: v["ab-t"] / 365, r: v["ab-r"] / 100 };
    if (!isFinite(q("ab-c95"))) setQuotes(fairQuotes()); else check();
  });
  ids.forEach((id) => $("#" + id).addEventListener("input", check));
  root.querySelectorAll("[data-ab]").forEach((b) => b.addEventListener("click", () => {
    const f = fairQuotes(), D = Math.exp(-env.r * env.Tm), k = b.dataset.ab;
    if (k === "floor") f["ab-c95"] = Math.max(env.S - 95 * D, 0) - 0.4;
    if (k === "inv") f["ab-c105"] = f["ab-c100"] + 0.1;
    if (k === "fly") f["ab-c100"] = (f["ab-c95"] + f["ab-c105"]) / 2 + 0.33;
    if (k === "cal") f["ab-cl"] = f["ab-c100"] - 0.15;
    if (k === "put") f["ab-p100"] = 100 * D + 0.5;
    setQuotes(f);
  }));
}
