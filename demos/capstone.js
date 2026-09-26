// Main demo for lesson capstone: a guided trade-plan builder. It runs a view on XYZ before earnings through the whole
// pipeline — vol read, structure, Greeks, stress grid, size, order, rules — and writes a one-page trade plan.
import * as O from "./_opt.js";
import { payoffChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const r = 0.04, S0 = 100, D = 365, dExp = 30, dEvent = 21, T0 = dExp / D;
  let kind = "spread";
  const kinds = [["call", T("买入看涨", "Long call")], ["spread", T("牛市看涨价差", "Bull call spread")], ["shortput", T("卖出看跌", "Short put")], ["straddle", T("买入跨式", "Long straddle")]];
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("交易计划生成器：从观点到一页计划", "Trade-plan builder: from a view to a one-page plan")}</div>
    <div class="demo-label">${T("1 · 观点", "1 · View")}</div>
    <div class="demo-grid">
      ${slider("cp-tgt", T("到期目标价", "Target at expiry"), 100, 120, 0.5, 107)}
      ${slider("cp-stop", T("判断失效线（财报后收盘低于）", "Thesis broken below (after earnings)"), 85, 100, 0.5, 97)}
    </div>
    <div class="demo-label">${T("2–3 · 期权链与波动率", "2–3 · Chain and volatility")}</div>
    <div class="demo-grid">
      ${slider("cp-iv", T("30 天隐含波动率（含财报）", "30-day implied vol (with earnings)"), 15, 45, 0.5, 25)}
      ${slider("cp-base", T("平日波动率", "Everyday vol"), 10, 30, 0.5, 20)}
      ${slider("cp-hist", T("过去财报的平均绝对变动", "Average absolute past earnings move"), 1, 10, 0.1, 3.7)}
    </div>
    <div class="demo-math" id="cp-vol"></div>
    <div class="demo-label">${T("4–5 · 结构与希腊字母", "4–5 · Structure and Greeks")}</div>
    <div class="demo-row">${seg("cp-kind", kinds, kind)}</div>
    <div class="demo-grid">
      ${slider("cp-k", T("行权价（价差为低行权价）", "Strike (lower strike for the spread)"), 90, 110, 1, 100)}
      ${slider("cp-w", T("价差宽度", "Spread width"), 2, 15, 1, 5)}
    </div>
    <div id="cp-greeks"></div>
    <div id="cp-chart"></div>
    <div class="demo-label">${T("6–7 · 压力测试与仓位（第 22 天早上）", "6–7 · Stress test and size (morning of day 22)")}</div>
    <div class="demo-grid">
      ${slider("cp-post", T("财报后隐含波动率", "Implied vol after earnings"), 10, 40, 0.5, 20)}
      ${slider("cp-bud", T("单笔风险预算", "Risk budget per trade"), 100, 2000, 50, 400)}
    </div>
    <div id="cp-stress"></div>
    <div class="demo-label">${T("8–10 · 订单、规则与计划", "8–10 · Order, rules and the plan")}</div>
    <div id="cp-plan" class="demo-out"></div>
    <p class="demo-tip">${T("试试：换成“卖出看跌”，看它在仓位这一步变成 0 张；换成“买入跨式”，看波动率这一步的警告——没有波动率优势时，最干净的是 vega 最小的那个结构。", "Try this: switch to the short put and watch the size step give zero contracts; switch to the straddle and read the volatility warning — with no vol edge, the cleanest structure is the one with the least vega.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const money = (x, d = 0) => (x < 0 ? "−$" : "$") + Math.abs(x).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  const quote = (K, type, sigma) => {
    // quotes as in the lesson's chain: mid rounded to the cent, half-spread = 2 cents + 1% of mid
    const mid = O.bsPrice({ S: S0, K, T: T0, r, sigma, type });
    const m = Math.round(mid * 100) / 100, half = Math.round((0.02 + 0.01 * mid) * 100) / 100;
    return { mid, bid: Math.max(0.01, m - half), ask: m + half };
  };
  const draw = (v) => {
    const tgt = v["cp-tgt"], stop = v["cp-stop"], iv = v["cp-iv"] / 100, base = Math.min(v["cp-base"] / 100, iv - 0.001), hist = v["cp-hist"] / 100;
    const K = v["cp-k"], W = v["cp-w"], post = v["cp-post"] / 100, bud = v["cp-bud"];
    // --- 3 · volatility read
    const evVar = Math.max(iv * iv * T0 - base * base * (T0 - 1 / D), 0), evSd = Math.sqrt(evVar), evAbs = Math.sqrt(2 / Math.PI) * evSd;
    const strad = quote(100, "call", iv).mid + quote(100, "put", iv).mid;
    const edge = hist - evAbs, volView = Math.abs(edge) < 0.005 ? "none" : edge > 0 ? "cheap" : "rich";
    $("#cp-vol").innerHTML = tex(String.raw`\sigma_{\text{${T("事件", "event")}}} = \sqrt{${iv.toFixed(3)}^2 \cdot \tfrac{30}{365} - ${base.toFixed(3)}^2 \cdot \tfrac{29}{365}} = ${(evSd * 100).toFixed(2)}\%,\quad 0.8\,\sigma_{\text{${T("事件", "event")}}} \approx ${(evAbs * 100).toFixed(1)}\% \ \text{${T("对比历史", "vs history")}}\ ${(hist * 100).toFixed(1)}\%,\quad \text{${T("跨式", "straddle")}} = ${strad.toFixed(2)}`, true);
    // --- 4 · legs at mid (entry IV = iv)
    const leg = (type, side, k) => ({ type, side, K: k, premium: quote(k, type, iv).mid, T: T0 });
    let legs;
    if (kind === "call") legs = [leg("call", "long", K)];
    else if (kind === "spread") legs = [leg("call", "long", K), leg("call", "short", K + W)];
    else if (kind === "shortput") legs = [leg("put", "short", K)];
    else legs = [leg("call", "long", K), leg("put", "long", K)];
    const g = O.positionGreeks(legs, S0, { sigma: iv, r });
    const net = legs.reduce((a, l) => a + (l.side === "long" ? 1 : -1) * l.premium, 0); // + debit, − credit
    const st = O.payoffStats(legs, 0.01, 250);
    // --- 6 · stress grid on day 22 at the post-earnings vol
    const moves = [-0.15, -0.1, -0.05, 0, 0.05, 0.1];
    const grid = moves.map((m) => O.netPLAt(legs, S0 * (1 + m), { elapsed: (dEvent + 1) / D, sigma: post, r }) * 100);
    const worst = Math.min(...grid);
    const n = worst >= 0 ? 0 : Math.floor(bud / -worst);
    $("#cp-greeks").innerHTML = stats([
      [T("净权利金（每股）", "Net premium (per share)"), (net >= 0 ? T("付 ", "pay ") : T("收 ", "receive ")) + "$" + Math.abs(net).toFixed(2)],
      ["Δ " + T("（股/张）", "(shares/contract)"), (g.delta * 100).toFixed(1)],
      ["Γ", (g.gamma * 100).toFixed(2)],
      ["Θ " + T("每天", "per day"), money(g.theta * 100, 2), g.theta >= 0 ? "pos" : "neg"],
      ["ν " + T("每点", "per vol pt"), money(g.vega * 100, 2)],
      [T("盈亏平衡", "Breakeven"), st.breakevens.length ? st.breakevens.map((b) => b.toFixed(2)).join(" / ") : "–"],
    ]);
    const pf = payoffChart({ legs, lo: 80, hi: 120, spot: S0, mult: 100 * Math.max(n, 1), today: { elapsed: (dEvent + 1) / D, sigma: post, r }, xlabel: T("XYZ 股价", "XYZ price"), ylabel: T(`盈亏（$，${Math.max(n, 1)} 张）`, `P&L ($, ${Math.max(n, 1)} contract${Math.max(n, 1) > 1 ? "s" : ""})`), labels: { expiry: T("到期", "At expiry"), today: T("第 22 天、财报后 IV", "Day 22, post-earnings IV"), spot: "S", be: "BE" } });
    $("#cp-chart").innerHTML = pf.html;
    $("#cp-stress").innerHTML = `<table><thead><tr><th>${T("第 22 天 XYZ", "XYZ on day 22")}</th>${moves.map((m) => `<th>${(S0 * (1 + m)).toFixed(0)}</th>`).join("")}</tr></thead><tbody>
      <tr><td>${T("每张盈亏", "P&L per contract")}</td>${grid.map((y) => `<td class="${y < 0 ? "itm" : ""}">${money(y)}</td>`).join("")}</tr>
      <tr><td>${T("小凯的 100 股", "Kai's 100 shares")}</td>${moves.map((m) => `<td>${money(m * 10000)}</td>`).join("")}</tr></tbody></table>` +
      stats([[T("最坏压力亏损 / 张", "Worst stress loss / contract"), money(worst), "neg"], [T("张数", "Contracts"), String(n), n > 0 ? "acc" : "neg"], [T("账户在 −15% 时", "Account at −15%"), money(-1500 + n * grid[0]), "neg"]]) +
      `<div class="demo-math">${tex(String.raw`n = \left\lfloor \frac{${bud}}{${Math.abs(worst).toFixed(0)}} \right\rfloor = ${n}`, true)}</div>`;
    // --- 8 · order
    const q = legs.map((l) => quote(l.K, l.type, iv));
    const natural = legs.reduce((a, l, i) => a + (l.side === "long" ? q[i].ask : -q[i].bid), 0);
    const limit = Math.round(net * 100) / 100;
    // --- 9 · rules
    const maxP = isFinite(st.maxProfit) ? st.maxProfit : NaN;
    const tp = kind === "spread" ? 0.8 * W : kind === "shortput" ? 0.2 * Math.abs(net) : kind === "call" ? 2 * net : 1.5 * net; // exit value per share
    // --- 10 · checks and plan
    const checks = [];
    const tgtPL = O.netPL(legs, tgt) * 100;
    checks.push([tgtPL > 0, T(`到期在目标价 ${tgt} 时每张 ${money(tgtPL)}`, `At the ${tgt} target at expiry: ${money(tgtPL)} per contract`)]);
    const vegaBig = Math.abs(g.vega * 100 * Math.max(n, 1)) > 6;
    if (volView === "none") checks.push([!vegaBig, vegaBig ? T(`没有波动率优势，却有 ${money(g.vega * 100 * Math.max(n, 1), 2)}/点 的 vega`, `No vol edge, yet ${money(g.vega * 100 * Math.max(n, 1), 2)} per vol point of vega`) : T("没有波动率优势，vega 也很小：匹配", "No vol edge and little vega: a match")]);
    else checks.push([(volView === "cheap") === g.vega > 0, T(`你的历史数据认为事件${volView === "cheap" ? "定价偏低" : "定价偏高"}；vega ${g.vega > 0 ? "为正" : "为负"}`, `Your history says the event is priced ${volView === "cheap" ? "low" : "high"}; vega is ${g.vega > 0 ? "positive" : "negative"}`)]);
    checks.push([n > 0, n > 0 ? T(`仓位：${n} 张，最坏压力亏损 ${money(n * worst)}，在预算 ${money(bud)} 之内`, `Size: ${n} contract(s), worst stress loss ${money(n * worst)}, inside the ${money(bud)} budget`) : T("仓位：0 张——最坏压力亏损超过整个预算", "Size: 0 contracts — the worst stress loss exceeds the whole budget")]);
    if (kind === "shortput") checks.push([false, T(`现金担保需要 ${money(K * 100)} 每张`, `Cash-secured needs ${money(K * 100)} per contract`)]);
    const lines = [
      `<b>${T("交易计划", "TRADE PLAN")}</b> · XYZ · ${kinds.find((k) => k[0] === kind)[1]}`,
      T(`观点：第 30 天收在 ${tgt} 附近；财报后收盘低于 ${stop} 即判断失效。`, `View: XYZ near ${tgt} at the day-30 expiry; thesis broken on a close below ${stop} after earnings.`),
      T(`波动率：事件定价约 ${(evAbs * 100).toFixed(1)}%，历史 ${(hist * 100).toFixed(1)}% → ${volView === "none" ? "没有波动率优势" : volView === "cheap" ? "事件偏便宜" : "事件偏贵"}。`, `Vol: event priced at about ${(evAbs * 100).toFixed(1)}%, history ${(hist * 100).toFixed(1)}% → ${volView === "none" ? "no vol edge" : volView === "cheap" ? "event looks cheap" : "event looks rich"}.`),
      T(`订单：${n} 张，一张组合单；中间价 ${Math.abs(limit).toFixed(2)}（${net >= 0 ? "付" : "收"}），对手价 ${Math.abs(natural).toFixed(2)}；从中间价开始，一次只让 1–2 美分。`, `Order: ${n} contract(s) as one ticket; mid ${Math.abs(limit).toFixed(2)} ${net >= 0 ? "debit" : "credit"}, natural ${Math.abs(natural).toFixed(2)}; start at the mid, give 1–2 cents at a time.`),
      T(`规则：① 价值到 ${Math.abs(tp).toFixed(2)} 止盈${isFinite(maxP) ? `（最大 ${money(maxP * 100)}/张）` : ""}；② 财报后收盘 < ${stop} 离场；③ 最晚第 29 天平仓，不把卖出腿带进到期日；④ 不展期、不加仓。`, `Rules: ① take profit at a value of ${Math.abs(tp).toFixed(2)}${isFinite(maxP) ? ` (max ${money(maxP * 100)}/contract)` : ""}; ② exit on a close < ${stop} after earnings; ③ close by day 29, never carry a short leg into expiry; ④ no rolling, no adding.`),
      T("复盘：按股价、波动率、时间三项归因；用同样的问题给过程打分，无论盈亏。", "Post-mortem: attribute P&L to stock move, vol change and time; grade the process with the same questions, win or lose."),
      ...checks.map(([ok, s]) => `<span class="tag ${ok ? "ok" : "bad"}">${ok ? "✓" : "✗"}</span> ${s}`),
    ];
    $("#cp-plan").innerHTML = lines.join("<br>");
  };
  const run = bindSliders(root, {
    "cp-tgt": (x) => "$" + x, "cp-stop": (x) => "$" + x, "cp-iv": (x) => x + "%", "cp-base": (x) => x + "%", "cp-hist": (x) => x + "%",
    "cp-k": (x) => "$" + x, "cp-w": (x) => "$" + x, "cp-post": (x) => x + "%", "cp-bud": (x) => "$" + x,
  }, draw);
  onSeg(root, "cp-kind", (k) => {
    kind = k;
    const kEl = $("#cp-k");
    kEl.value = k === "shortput" ? 95 : 100;
    run();
  });
}
