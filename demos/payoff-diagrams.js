// Main demo for lesson payoff-diagrams: "name that shape". The demo draws the expiry P&L of a hidden position
// (priced with Black-Scholes on the course's XYZ numbers); the reader names it, then sees the five-step reading.
import * as O from "./_opt.js";
import { payoffChart, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const Tm = 30 / 365, r = O.XYZ.r, sigma = O.XYZ.sigma;
  const px = (K, type) => Math.round(O.bsPrice({ S: 100, K, T: Tm, r, sigma, type }) * 100) / 100;
  const C = (side, K) => ({ type: "call", side, K, premium: px(K, "call") });
  const P = (side, K) => ({ type: "put", side, K, premium: px(K, "put") });
  const STOCK = { type: "stock", side: "long", entry: 100 };
  const SHAPES = [
    { id: "lc", name: T("买入看涨（100）", "Long call (100)"), legs: [C("long", 100)] },
    { id: "sc", name: T("卖出看涨（100）", "Short call (100)"), legs: [C("short", 100)] },
    { id: "lp", name: T("买入看跌（100）", "Long put (100)"), legs: [P("long", 100)] },
    { id: "sp", name: T("卖出看跌（95）", "Short put (95)"), legs: [P("short", 95)] },
    { id: "cc", name: T("备兑看涨：股票 + 卖 105 看涨", "Covered call: shares + short 105 call"), legs: [STOCK, C("short", 105)] },
    { id: "pp", name: T("保护性看跌：股票 + 买 95 看跌", "Protective put: shares + long 95 put"), legs: [STOCK, P("long", 95)] },
    { id: "sd", name: T("买入跨式：100 看涨 + 100 看跌", "Long straddle: 100 call + 100 put"), legs: [C("long", 100), P("long", 100)] },
    { id: "bc", name: T("牛市看涨价差：买 100、卖 105", "Bull call spread: buy 100, sell 105"), legs: [C("long", 100), C("short", 105)] },
  ];
  const R = O.rng(2026);
  const shuffle = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  let order = shuffle(SHAPES.map((_, i) => i)), round = 0, score = 0, tries = 0, answered = false, choices = [];

  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("猜猜这是什么头寸：8 个形状", "Name that position: 8 shapes")}</div>
    <div class="demo-meta" id="pdg-meta"></div>
    <div id="pdg-chart"></div>
    <div class="demo-label">${T("这张到期损益图（每张合约，美元）属于哪个头寸？", "Which position has this expiry P&L (per contract, $)?")}</div>
    <div class="demo-btns" id="pdg-choices"></div>
    <div id="pdg-out"></div>
    <div class="demo-btns"><button class="demo-btn" id="pdg-next">${T("下一个形状 →", "Next shape →")}</button><button class="demo-btn" id="pdg-reset">${T("重新开始", "Start over")}</button></div>
    <p class="demo-tip">${T("做法：先别看选项，用五步读图——单位、拐点、两端斜率、盈亏平衡点、极值（别忘了 S<sub>T</sub> = 0 那一端）。拐点在哪个行权价、右端是平的还是一直往上，通常就足够认出它。", "How to play: before looking at the choices, run the five steps: units, kinks, slopes of the two ends, breakevens, extremes (don't forget the S<sub>T</sub> = 0 end). Where the kinks sit and whether the right end is flat or keeps rising usually give the answer away.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const money = (x) => (!isFinite(x) ? (x > 0 ? T("无上限", "unlimited") : T("无下限", "unlimited")) : (x < 0 ? "−$" : "$") + Math.abs(x * 100).toFixed(0));

  const explain = (sh) => {
    const st = O.payoffStats(sh.legs, 0, 250);
    const ks = [...new Set(sh.legs.filter((l) => l.K != null).map((l) => l.K))].sort((a, b) => a - b);
    const net = sh.legs.reduce((a, l) => a + (l.type === "stock" ? 0 : (l.side === "long" ? -1 : 1) * l.premium), 0);
    const be = st.breakevens.length ? st.breakevens.map((b) => b.toFixed(2)).join(" / ") : "—";
    const legsTxt = sh.legs.map((l) => l.type === "stock" ? T("持有 100 股（成本 100）", "own 100 shares (cost 100)")
      : `${l.side === "long" ? T("买入", "buy") : T("卖出", "sell")} ${l.K} ${l.type === "call" ? T("看涨", "call") : T("看跌", "put")} @ ${l.premium.toFixed(2)}`).join(T("；", "; "));
    return `<div class="demo-log">${T("五步读图：", "The five steps: ")}
      ${T("拐点在", "kinks at")} <b>${ks.join(", ")}</b>${T("；左端斜率", "; slope of the left end")} <b>${st.slopeLeft > 0 ? "+" : ""}${st.slopeLeft}</b>${T("，右端斜率", ", of the right end")} <b>${st.slopeRight > 0 ? "+" : ""}${st.slopeRight}</b>${T("；盈亏平衡点", "; breakeven(s)")} <b>${be}</b>.</div>
      ${stats([[T("最大盈利/张", "Max profit / contract"), money(st.maxProfit), "pos"], [T("最大亏损/张", "Max loss / contract"), money(st.maxLoss), "neg"], [T("净权利金/股", "Net premium / share"), (net >= 0 ? T("收入 ", "received ") : T("支出 ", "paid ")) + "$" + Math.abs(net).toFixed(2)]])}
      <div class="demo-math">${tex(String.raw`\text{slope}_{\text{left}} = ${st.slopeLeft},\qquad \text{slope}_{\text{right}} = ${st.slopeRight}`, true)}</div>
      <div class="demo-meta">${T("腿：", "Legs: ")}${legsTxt}</div>`;
  };

  const show = () => {
    const sh = SHAPES[order[round % order.length]];
    answered = false;
    const others = shuffle(SHAPES.filter((x) => x.id !== sh.id)).slice(0, 3);
    choices = shuffle([sh, ...others]);
    $("#pdg-meta").textContent = T(`第 ${(round % order.length) + 1} / ${order.length} 题 · 得分 ${score} / ${tries}`, `Shape ${(round % order.length) + 1} of ${order.length} · score ${score} / ${tries}`);
    $("#pdg-chart").innerHTML = payoffChart({ legs: sh.legs, lo: 75, hi: 125, mult: 100, xlabel: T("到期时的 XYZ 价格", "XYZ price at expiry"), ylabel: T("盈亏（美元/张）", "P&L ($ per contract)"), labels: { expiry: T("到期盈亏", "P&L at expiry"), be: T("平衡", "BE") } }).html;
    $("#pdg-choices").innerHTML = choices.map((c, i) => `<button class="demo-btn" data-choice="${i}">${c.name}</button>`).join("");
    $("#pdg-out").innerHTML = "";
  };
  $("#pdg-choices").addEventListener("click", (e) => {
    const b = e.target.closest("[data-choice]"); if (!b || answered) return;
    answered = true; tries++;
    const sh = SHAPES[order[round % order.length]], pick = choices[+b.dataset.choice], ok = pick.id === sh.id;
    if (ok) score++;
    root.querySelectorAll("[data-choice]").forEach((x) => x.classList.toggle("on", choices[+x.dataset.choice].id === sh.id));
    $("#pdg-meta").textContent = T(`第 ${(round % order.length) + 1} / ${order.length} 题 · 得分 ${score} / ${tries}`, `Shape ${(round % order.length) + 1} of ${order.length} · score ${score} / ${tries}`);
    $("#pdg-out").innerHTML = `<div class="demo-log ${ok ? "ok" : "bad"}">${ok ? T("答对了：", "Correct: ") : T("不对，答案是：", "Not quite. It is: ")}<b>${sh.name}</b></div>` + explain(sh);
  });
  $("#pdg-next").addEventListener("click", () => { round++; if (round % order.length === 0) order = shuffle(order); show(); });
  $("#pdg-reset").addEventListener("click", () => { round = 0; score = 0; tries = 0; order = shuffle(order); show(); });
  show();
}
