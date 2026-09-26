// Inline demo for lesson strategy-matrix: name the strategy from its Greek signature (signs and sizes of Δ, Γ, Θ, ν),
// all computed live for 30-day XYZ structures.
import * as O from "./_opt.js";
import { stats } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S0 = 100, r = 0.04, sigma = 0.2, D = 30;
  const L = (type, side, K, Td = D, qty = 1) => ({ type, side, K, qty, T: Td / 365, premium: O.bsPrice({ S: S0, K, T: Td / 365, r, sigma, type }) });
  const STOCK = { type: "stock", side: "long", entry: S0 };
  const LIB = [
    [T("买入看涨 100", "Long call 100"), [L("call", "long", 100)]],
    [T("买入看跌 100", "Long put 100"), [L("put", "long", 100)]],
    [T("备兑看涨 105", "Covered call 105"), [STOCK, L("call", "short", 105)]],
    [T("现金担保卖出看跌 95", "Cash-secured put 95"), [L("put", "short", 95)]],
    [T("保护性看跌 95", "Protective put 95"), [STOCK, L("put", "long", 95)]],
    [T("领口 95/105", "Collar 95/105"), [STOCK, L("put", "long", 95), L("call", "short", 105)]],
    [T("牛市看涨价差 100/105", "Bull call spread 100/105"), [L("call", "long", 100), L("call", "short", 105)]],
    [T("熊市看涨价差 100/105", "Bear call spread 100/105"), [L("call", "short", 100), L("call", "long", 105)]],
    [T("买入跨式 100", "Long straddle 100"), [L("call", "long", 100), L("put", "long", 100)]],
    [T("铁鹰 90/95/105/110", "Iron condor 90/95/105/110"), [L("put", "long", 90), L("put", "short", 95), L("call", "short", 105), L("call", "long", 110)]],
    [T("日历价差 100（卖 30 天、买 60 天）", "Calendar 100 (sell 30 d, buy 60 d)"), [L("call", "short", 100), L("call", "long", 100, 60)]],
  ];
  const R = O.rng(2026);
  let q = null, score = 0, tries = 0, answered = false;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("看签名，猜策略", "Name the strategy from its signature")}</div>
    <div class="demo-label">${T("某个 30 天的 XYZ 仓位（每 1 份，× 100 股）的希腊字母：", "The Greeks of some 30-day XYZ position (per unit, × 100 shares):")}</div>
    <div id="sms-sig"></div>
    <div class="demo-btns" id="sms-opts"></div>
    <div class="demo-log" id="sms-log"></div>
    <div class="demo-btns"><button type="button" class="demo-btn" id="sms-next">${T("下一题", "Next")}</button><span class="demo-meta" id="sms-score"></span></div>
    <p class="demo-tip">${T("思路：先看 Δ 判断方向，再看 Γ 和 ν 的符号判断你是在买还是卖波动率，最后看大小——领口和日历价差的某些希腊字母接近 0，这本身就是线索。", "How to think: read Δ for direction, then the signs of Γ and ν for whether you are buying or selling volatility, and finally the sizes — the collar and the calendar have Greeks close to zero, which is itself a clue.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const f = (x, d) => (x >= 0 ? "+" : "−") + Math.abs(x).toFixed(d);
  function next() {
    const i = Math.floor(R() * LIB.length);
    const others = LIB.map((_, k) => k).filter((k) => k !== i);
    const pickd = [];
    while (pickd.length < 3) { const k = others[Math.floor(R() * others.length)]; if (!pickd.includes(k)) pickd.push(k); }
    const opts = [i, ...pickd].sort(() => R() - 0.5);
    q = { i, opts }; answered = false;
    const g = O.positionGreeks(LIB[i][1], S0, { elapsed: 0, sigma, r });
    $("#sms-sig").innerHTML = stats([["Δ", f(g.delta * 100, 1)], ["Γ", f(g.gamma * 100, 2)], [T("Θ（每天）", "Θ per day"), f(g.theta * 100, 2)], [T("ν（每波动率点）", "ν per vol pt"), f(g.vega * 100, 2)]]);
    $("#sms-opts").innerHTML = opts.map((k) => `<button type="button" class="demo-btn" data-o="${k}">${LIB[k][0]}</button>`).join("");
    $("#sms-log").innerHTML = `<span>${T("选一个答案。", "Pick an answer.")}</span>`;
    root.querySelectorAll("[data-o]").forEach((b) => b.addEventListener("click", () => answer(+b.dataset.o, b)));
  }
  function answer(k, btn) {
    if (answered) return;
    answered = true; tries++;
    const ok = k === q.i; if (ok) score++;
    btn.classList.add("on");
    const g = O.positionGreeks(LIB[q.i][1], S0, { elapsed: 0, sigma, r });
    const why = `${g.delta > 0.05 ? T("Δ 为正：看涨方向", "Δ positive: bullish") : g.delta < -0.05 ? T("Δ 为负：看跌方向", "Δ negative: bearish") : T("Δ 接近 0：中性", "Δ near zero: neutral")}；${g.vega > 0.005 ? T("ν 为正：买入波动率", "ν positive: long volatility") : g.vega < -0.005 ? T("ν 为负：卖出波动率", "ν negative: short volatility") : T("ν 接近 0：对波动率几乎中性", "ν near zero: almost volatility-neutral")}；${g.gamma * g.vega < 0 ? T("Γ 与 ν 符号相反：典型的时间价差", "Γ and ν of opposite sign: the mark of a time spread") : T("Γ 与 ν 同号", "Γ and ν share a sign")}.`;
    $("#sms-log").innerHTML = `<span class="${ok ? "ok" : "bad"}">${ok ? T("答对了：", "Correct: ") : T("不对，答案是：", "Not quite — it is: ")}${LIB[q.i][0]}</span><span>${why.replace(/；/g, en ? "; " : "；")}</span>`;
    $("#sms-score").textContent = T(`得分 ${score} / ${tries}`, `Score ${score} / ${tries}`);
  }
  $("#sms-next").addEventListener("click", next);
  next();
}
