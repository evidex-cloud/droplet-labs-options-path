// Main demo for lesson first-trade: a guided wizard for Kai's covered call. Each step is a decision;
// every decision is checked, and the result is a written trade plan plus a journal entry.
import * as O from "./_opt.js";
import { seg, onSeg, slider, bindSliders, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S0 = 100, r = 0.04, sigma = 0.2, EARN = 21, COMM = 0.65;
  const st = { view: "range", K: 105, days: 30, thin: false, n: 1, otype: "limit", step: "1" };
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("交易向导：小凯的第一笔备兑看涨", "Trade wizard: Kai's first covered call")}</div>
    <div class="demo-row">${seg("ftw-step", [["1", T("① 观点", "① Thesis")], ["2", T("② 结构", "② Structure")], ["3", T("③ 流动性与规模", "③ Liquidity & size")], ["4", T("④ 订单", "④ Order")], ["5", T("⑤ 管理规则", "⑤ Rules")], ["6", T("⑥ 计划与日志", "⑥ Plan & journal")]], "1")}</div>
    <div class="demo-block" data-panel="1">
      <div class="demo-label">${T("未来一个月，小凯对 XYZ 的看法是？", "Kai's view on XYZ for the next month:")}</div>
      ${seg("ftw-view", [["range", T("区间：95–105，愿意在 105 卖出", "Range: 95–105, happy to sell at 105")], ["bull", T("大涨：财报后涨 15%", "Big rally: +15% after earnings")], ["bear", T("看跌：可能跌破 95", "Bearish: may break 95")]], "range")}
    </div>
    <div class="demo-block" data-panel="2" hidden>
      <div class="demo-label">${T("行权价", "Strike")}</div>${seg("ftw-k", [["102.5", "102.5"], ["105", "105"], ["107.5", "107.5"], ["110", "110"]], "105")}
      <div class="demo-label">${T("到期天数（财报约在第 21 天）", "Days to expiry (earnings around day 21)")}</div>${seg("ftw-d", [["14", "14"], ["30", "30"], ["45", "45"]], "30")}
    </div>
    <div class="demo-block" data-panel="3" hidden>
      <div class="demo-label">${T("标的流动性", "Underlying liquidity")}</div>${seg("ftw-liq", [["liquid", T("XYZ：流动性好", "XYZ: liquid")], ["thin", T("冷门股：报价很宽", "Thin stock: wide quote")]], "liquid")}
      <div class="demo-label">${T("卖出几张（小凯有 100 股）", "Contracts to sell (Kai owns 100 shares)")}</div>${seg("ftw-n", [["1", "1"], ["2", "2"]], "1")}
    </div>
    <div class="demo-block" data-panel="4" hidden>
      <div class="demo-label">${T("订单类型", "Order type")}</div>${seg("ftw-ot", [["limit", T("限价单", "Limit")], ["market", T("市价单", "Market")]], "limit")}
      ${slider("ftw-lim", T("限价相对中间价（美分）", "Limit vs mid (cents)"), -5, 5, 1, 0)}
    </div>
    <div class="demo-block" data-panel="5" hidden>
      ${slider("ftw-tp", T("止盈：锁定权利金的比例", "Take profit: share of premium captured"), 30, 90, 5, 50)}
      ${slider("ftw-stop", T("观点失效线（收盘低于）", "Thesis-broken line (close below)"), 88, 99, 1, 95)}
    </div>
    <div class="demo-block" data-panel="6" hidden><div id="ftw-plan"></div></div>
    <div class="demo-math" id="ftw-math"></div>
    <div id="ftw-checks"></div>
    <p class="demo-tip">${T("试试：把观点换成“大涨”，或者卖 2 张、改用市价单，看哪一项检查变红。第 ⑥ 步把所有决定写成一份交易计划和一条日志——这就是课里说的“下单前写下来”。", "Try this: switch the view to “big rally”, sell 2 contracts, or use a market order, and see which check turns red. Step ⑥ turns every decision into a written trade plan and a journal line — the lesson's “write it down before the order”.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const log = (cls, txt) => `<div class="demo-log ${cls}">${txt}</div>`;
  const draw = (v) => {
    const Tm = st.days / 365, K = st.K;
    const g = O.greeks({ S: S0, K, T: Tm, r, sigma, type: "call" });
    const mid = Math.round(g.price * 100) / 100, half = st.thin ? Math.max(Math.round(0.15 * mid * 100) / 100, 0.01) : 0.01;
    const bid = Math.max(mid - half, 0), ask = mid + half;
    const lim = mid + v["ftw-lim"] / 100;
    const fill = st.otype === "market" ? bid : lim <= ask + 1e-9 ? lim : NaN;
    const prem = isFinite(fill) ? fill : mid;
    const tpPx = Math.floor((1 - v["ftw-tp"] / 100) * prem * 100 + 1e-6) / 100, stop = v["ftw-stop"];
    const maxP = (K - S0 + prem) * 100 * st.n, be = S0 - prem;
    $("#ftw-math").innerHTML = tex(String.raw`\Pi(S_T) = 100 \times [\min(S_T, ${K}) - 100 + ${prem.toFixed(2)}]`, true)
      + tex(String.raw`\text{max } \$${((K - S0 + prem) * 100).toFixed(0)}, \quad \text{breakeven } ${be.toFixed(2)}`, true)
      + tex(String.raw`\text{take profit: } c_{\text{exit}} \le (1 - ${(v["ftw-tp"] / 100).toFixed(2)}) \times ${prem.toFixed(2)} = ${tpPx.toFixed(2)}`, true);
    const checks = [];
    // 1 thesis–structure fit
    if (st.view === "range") checks.push(log("ok", T("① 观点与结构一致：区间观点 + 已持股 → 备兑看涨。", "① Thesis fits: a range view with shares owned → covered call.")));
    else if (st.view === "bull") checks.push(log("warn", T("① 不一致：备兑看涨会封顶你预期的那段上涨；考虑不卖看涨，或买入看涨。", "① Mismatch: the call caps the very rally you expect; consider not selling it, or buying a call.")));
    else checks.push(log("bad", T("① 不一致：备兑看涨几乎保留全部下跌风险；看跌时考虑卖股或买保护性看跌。", "① Mismatch: a covered call keeps almost all the downside; if bearish, consider selling shares or buying a put.")));
    // 2 strike & expiry
    const pITM = g.probITM;
    if (K <= 102.5) checks.push(log("warn", T(`② 行权价 ${K}：风险中性下约 ${(pITM * 100).toFixed(0)}% 的概率被行权，最大盈利仅 $${((K - S0 + prem) * 100).toFixed(0)}。你真的愿意在这里卖吗？`, `② Strike ${K}: about ${(pITM * 100).toFixed(0)}% risk-neutral chance of being called away, max profit only $${((K - S0 + prem) * 100).toFixed(0)}. Are you truly happy to sell here?`)));
    else if (mid * 100 < 20) checks.push(log("warn", T(`② 权利金只有 $${(mid * 100).toFixed(0)}：扣掉佣金和价差后所剩无几。`, `② Premium only $${(mid * 100).toFixed(0)}: little is left after commission and spread.`)));
    else checks.push(log("ok", T(`② 行权价 ${K}、${st.days} 天：权利金 $${(mid * 100).toFixed(0)}，Δ ${g.delta.toFixed(2)}，风险中性下收在行权价之上的概率 ${(pITM * 100).toFixed(1)}%。`, `② Strike ${K}, ${st.days} days: premium $${(mid * 100).toFixed(0)}, Δ ${g.delta.toFixed(2)}, risk-neutral chance of ending above the strike ${(pITM * 100).toFixed(1)}%.`)));
    checks.push(st.days >= EARN ? log("warn", T("② 到期跨过财报：写下“若财报大涨，我接受在行权价卖出”。", "② Expiry spans earnings: write down “if earnings jump, I accept selling at the strike”.")) : log("ok", T("② 到期在财报之前：没有财报跳空，但权利金更少。", "② Expires before earnings: no earnings gap, but less premium.")));
    // 3 liquidity & size
    const sprPct = (ask - bid) / mid;
    checks.push(sprPct > 0.1 ? log("bad", T(`③ 报价 ${bid.toFixed(2)} / ${ask.toFixed(2)}，价差占中间价 ${(sprPct * 100).toFixed(0)}%：超过小凯 10% 的上限，跳过。`, `③ Quote ${bid.toFixed(2)} / ${ask.toFixed(2)}, spread ${(sprPct * 100).toFixed(0)}% of mid: above Kai's 10% limit — skip.`)) : log("ok", T(`③ 报价 ${bid.toFixed(2)} / ${ask.toFixed(2)}，价差占中间价 ${(sprPct * 100).toFixed(1)}%。`, `③ Quote ${bid.toFixed(2)} / ${ask.toFixed(2)}, spread ${(sprPct * 100).toFixed(1)}% of mid.`)));
    checks.push(st.n > 1 ? log("bad", T("③ 第 2 张看涨没有股票覆盖：是裸卖，风险无上限，需要更高审批层级。", "③ The second call is not covered by shares: it is naked, unlimited risk, a higher approval tier.")) : log("ok", T(`③ 1 张对 100 股。持仓 Δ ≈ +${(100 * (1 - g.delta)).toFixed(0)} 股，Θ ≈ +$${(-100 * g.theta).toFixed(2)}/天，Vega ≈ −$${(100 * g.vega).toFixed(2)}/波动率点。`, `③ One contract per 100 shares. Position Δ ≈ +${(100 * (1 - g.delta)).toFixed(0)} shares, Θ ≈ +$${(-100 * g.theta).toFixed(2)}/day, vega ≈ −$${(100 * g.vega).toFixed(2)}/vol pt.`)));
    // 4 order
    if (st.otype === "market") checks.push(log("warn", T(`④ 市价单：按买价 ${bid.toFixed(2)} 成交，比中间价少收 $${((mid - bid) * 100).toFixed(0)}。`, `④ Market order: fills at the bid ${bid.toFixed(2)}, $${((mid - bid) * 100).toFixed(0)} less than the mid.`)));
    else if (!isFinite(fill)) checks.push(log("warn", T(`④ 卖出限价 ${lim.toFixed(2)} 高于卖价 ${ask.toFixed(2)}：很可能不会成交。`, `④ Sell limit ${lim.toFixed(2)} is above the ask ${ask.toFixed(2)}: unlikely to fill.`)));
    else if (lim < bid - 1e-9) checks.push(log("bad", T(`④ 限价 ${lim.toFixed(2)} 低于买价：比市价单让出更多。`, `④ Limit ${lim.toFixed(2)} is below the bid: gives away more than a market order.`)));
    else checks.push(log("ok", T(`④ 卖出开仓 ${st.n} 张，限价 ${lim.toFixed(2)}，当日有效；净收约 $${(prem * 100 * st.n - COMM * st.n).toFixed(2)}（示意佣金 $0.65）。`, `④ Sell to open ${st.n}, limit ${lim.toFixed(2)}, day order; about $${(prem * 100 * st.n - COMM * st.n).toFixed(2)} net (illustrative $0.65 commission).`)));
    // 5 rules
    checks.push(stop >= 97 ? log("warn", T(`⑤ 失效线 ${stop} 离现价太近：日常波动（约 $1.05/天）就可能触发。`, `⑤ Thesis line ${stop} is very close: ordinary daily moves (about $1.05) may trigger it.`)) : log("ok", T(`⑤ 规则：看涨卖价 ≤ ${tpPx.toFixed(2)} 时止盈；最后一周或财报前高于 103 进入展期区；收盘低于 ${stop} 视为观点失效。`, `⑤ Rules: take profit when the call's ask ≤ ${tpPx.toFixed(2)}; roll zone above 103 in the last week or before earnings; a close below ${stop} breaks the thesis.`)));
    $("#ftw-checks").innerHTML = `<div class="demo-label">${T("检查", "Checks")}</div>` + checks.join("");
    const bad = checks.filter((c) => c.includes("demo-log bad")).length, warn = checks.filter((c) => c.includes("demo-log warn")).length;
    $("#ftw-plan").innerHTML = `<div class="kv"><span class="k">${T("状态", "Status")}</span><span class="v hl">${bad ? T(`有 ${bad} 项红色检查：先别下单`, `${bad} red check(s): do not send yet`) : warn ? T(`可以下单；${warn} 项黄色提示已写进计划`, `ready; ${warn} caution(s) written into the plan`) : T("全部通过", "all checks pass")}</span></div>
      <div class="kv"><span class="k">${T("交易", "Trade")}</span><span class="v">${T(`卖出开仓 ${st.n} 张 XYZ ${st.days} 天 ${K} 看涨 @ ${prem.toFixed(2)}`, `Sell to open ${st.n} XYZ ${st.days}-day ${K} call @ ${prem.toFixed(2)}`)}</span></div>
      <div class="kv"><span class="k">${T("最大盈利 / 盈亏平衡", "Max profit / breakeven")}</span><span class="v">${st.n > 1 ? T("第 2 张裸卖：上方亏损无上限", "second call naked: unlimited loss above the strike") : "$" + maxP.toFixed(0) + " / " + be.toFixed(2)}</span></div>
      <div class="kv"><span class="k">${T("下跌到 80 时", "If XYZ falls to 80")}</span><span class="v">${O.fmtUsd((80 - S0 + st.n * prem) * 100, 0)}</span></div>
      <div class="demo-label">${T("日志条目", "Journal entry")}</div>
      <div class="demo-out-sm">${T(`第 0 天 · XYZ 100.00 · 观点：${st.view === "range" ? "一个月内在 95–105，愿意在 105 卖出" : st.view === "bull" ? "财报后大涨" : "可能跌破 95"} · 卖出 ${st.n}×${K} 看涨 @ ${prem.toFixed(2)}，IV 20.0% · 止盈 ${tpPx.toFixed(2)} · 失效线 ${stop} · 过程评分：待填 · 教训：待填`, `Day 0 · XYZ 100.00 · Thesis: ${st.view === "range" ? "stays 95–105 for a month, happy to sell at 105" : st.view === "bull" ? "big rally after earnings" : "may break 95"} · Sold ${st.n}×${K} call @ ${prem.toFixed(2)}, IV 20.0% · TP ${tpPx.toFixed(2)} · thesis line ${stop} · process score: tbd · lesson: tbd`)}</div>`;
  };
  const run = bindSliders(root, { "ftw-lim": (x) => (x > 0 ? "+" : "") + x + "¢", "ftw-tp": (x) => x + "%", "ftw-stop": (x) => String(x) }, draw);
  onSeg(root, "ftw-step", (k) => { st.step = k; root.querySelectorAll("[data-panel]").forEach((p) => { p.hidden = p.dataset.panel !== k; }); });
  onSeg(root, "ftw-view", (k) => { st.view = k; run(); });
  onSeg(root, "ftw-k", (k) => { st.K = +k; run(); });
  onSeg(root, "ftw-d", (k) => { st.days = +k; run(); });
  onSeg(root, "ftw-liq", (k) => { st.thin = k === "thin"; run(); });
  onSeg(root, "ftw-n", (k) => { st.n = +k; run(); });
  onSeg(root, "ftw-ot", (k) => { st.otype = k; run(); });
}
