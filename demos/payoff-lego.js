// Main demo for lesson payoff-lego: a leg-by-leg payoff builder. Each leg is drawn thin and dashed,
// the sum thick with profit/loss shading; slopes per segment, net premium, breakevens and extremes update live.
import * as O from "./_opt.js";
import { payoffChart, seg, onSeg, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const Tm = 30 / 365, r = O.XYZ.r, sigma = O.XYZ.sigma;
  const px = (K, type) => Math.round(O.bsPrice({ S: 100, K, T: Tm, r, sigma, type }) * 100) / 100;
  const mkLeg = (type, side, K, qty = 1) => type === "stock" ? { type, side, entry: 100, qty } : { type, side, K, qty, premium: px(K, type) };
  const PRESETS = {
    straddle: [mkLeg("call", "long", 100), mkLeg("put", "long", 100)],
    bull: [mkLeg("call", "long", 100), mkLeg("call", "short", 105)],
    collar: [mkLeg("stock", "long"), mkLeg("put", "long", 95), mkLeg("call", "short", 105)],
    fly: [mkLeg("call", "long", 95), mkLeg("call", "short", 100, 2), mkLeg("call", "long", 105)],
    synth: [mkLeg("call", "long", 100), mkLeg("put", "short", 100)],
    cc: [mkLeg("stock", "long"), mkLeg("call", "short", 105)],
  };
  let legs = PRESETS.straddle.map((l) => ({ ...l })), nType = "call", nSide = "long", nK = "100";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("损益积木：一条一条加腿", "Payoff Lego: add legs one at a time")}</div>
    <div class="demo-label">${T("预设", "Presets")}</div>
    <div class="demo-btns">
      <button class="demo-btn" data-preset="straddle">${T("跨式", "Straddle")}</button>
      <button class="demo-btn" data-preset="bull">${T("牛市看涨价差", "Bull call spread")}</button>
      <button class="demo-btn" data-preset="collar">${T("领口", "Collar")}</button>
      <button class="demo-btn" data-preset="fly">${T("蝶式", "Butterfly")}</button>
      <button class="demo-btn" data-preset="synth">${T("合成股票", "Synthetic share")}</button>
      <button class="demo-btn" data-preset="cc">${T("备兑看涨", "Covered call")}</button>
      <button class="demo-btn" data-preset="clear">${T("清空", "Clear")}</button>
    </div>
    <div class="demo-label">${T("新的一条腿", "New leg")}</div>
    <div class="demo-row">${seg("pl-type", [["call", T("看涨", "Call")], ["put", T("看跌", "Put")], ["stock", T("股票", "Shares")]], nType)}
      ${seg("pl-side", [["long", T("买入", "Buy")], ["short", T("卖出", "Sell")]], nSide)}</div>
    <div class="demo-row">${seg("pl-k", [85, 90, 95, 100, 105, 110, 115].map((k) => [String(k), "K " + k]), nK)}
      <button class="demo-btn" id="pl-add">${T("+ 加上这条腿", "+ Add this leg")}</button></div>
    <div class="legs" id="pl-legs"></div>
    <div class="demo-math" id="pl-f"></div>
    <div id="pl-stats"></div>
    <div id="pl-chart"></div>
    <p class="demo-tip">${T("试试：从“跨式”开始，再卖出一张 105 看涨——右半边的 V 被压平，成本少了 0.71。再点“合成股票”：两张期权的拐点互相抵消，只剩一条斜率 +1 的直线。", "Try this: start from the straddle and add a short 105 call: the right side of the V flattens and the cost drops by 0.71. Then load “Synthetic share”: the two options' kinks cancel and a single straight line of slope +1 is left.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const legName = (l) => {
    const side = l.side === "long" ? T("买入", "Long") : T("卖出", "Short");
    if (l.type === "stock") return `${side} ${T("100 股（成本 100）", "100 shares (cost 100)")}`;
    return `${side} ${l.qty > 1 ? l.qty + " × " : ""}${l.K} ${l.type === "call" ? T("看涨", "call") : T("看跌", "put")} @ ${l.premium.toFixed(2)}`;
  };
  const draw = () => {
    $("#pl-legs").innerHTML = legs.length ? legs.map((l, i) => `<div class="leg side-${l.side}"><span>${legName(l)}</span> <button class="demo-btn" data-rm="${i}" aria-label="${T("删除", "Remove")}">✕</button></div>`).join("")
      : `<div class="demo-meta">${T("还没有腿。加一条，或点一个预设。", "No legs yet. Add one, or pick a preset.")}</div>`;
    if (!legs.length) { $("#pl-f").innerHTML = ""; $("#pl-stats").innerHTML = ""; $("#pl-chart").innerHTML = ""; return; }
    const sgn = (l) => (l.side === "long" ? 1 : -1);
    const net = legs.reduce((a, l) => a + (l.type === "stock" ? 0 : sgn(l) * l.qty * l.premium), 0);
    const st = O.payoffStats(legs, 0, 300);
    // slope ledger between strikes
    const ks = [...new Set(legs.filter((l) => l.K != null).map((l) => l.K))].sort((a, b) => a - b);
    const edges = [0, ...ks, Infinity];
    const slopeAt = (x) => Math.round((O.netPL(legs, x + 0.01) - O.netPL(legs, x - 0.01)) / 0.02);
    const segs = edges.slice(0, -1).map((a, i) => { const b = edges[i + 1]; const mid = isFinite(b) ? (a + b) / 2 : a + 10; return { a, b, s: slopeAt(Math.max(mid, 0.5)) }; });
    const ledger = segs.map((g) => `${isFinite(g.b) ? (g.a === 0 ? "S_T<" + g.b : g.a + "\\text{–}" + g.b) : "S_T>" + g.a}: ${g.s > 0 ? "+" : ""}${g.s}`).join(",\\quad ");
    $("#pl-f").innerHTML = tex(String.raw`\Pi(S_T) = \sum_i n_i\,\pi_i(S_T),\qquad \text{${en ? "net premium" : "净权利金"}} = ${net >= 0 ? "" : "-"}${Math.abs(net).toFixed(2)}\ \text{(${net >= 0 ? (en ? "debit" : "付出") : (en ? "credit" : "收入")})}`, true)
      + tex(String.raw`\text{${en ? "slopes" : "斜率"}}\quad ${ledger}`, true);
    const money = (x) => (!isFinite(x) ? T("无上限", "unlimited") : (x < 0 ? "−$" : "$") + Math.abs(x * 100).toFixed(0));
    $("#pl-stats").innerHTML = stats([
      [T("净权利金/股", "Net premium / share"), (net >= 0 ? T("付 ", "pay ") : T("收 ", "receive ")) + "$" + Math.abs(net).toFixed(2), "acc"],
      [T("最大盈利", "Max profit"), money(st.maxProfit), "pos"],
      [T("最大亏损", "Max loss"), money(st.maxLoss), "neg"],
      [T("盈亏平衡点", "Breakeven(s)"), st.breakevens.length ? st.breakevens.map((b) => b.toFixed(2)).join(" / ") : "—"],
    ]);
    const extra = legs.map((l, i) => ({ f: (x) => O.legPL(l, x) * 100, cls: [0, 1, 4, 3, 2][i % 5], dashed: true, label: legName(l) }));
    $("#pl-chart").innerHTML = payoffChart({
      legs, lo: 75, hi: 125, mult: 100, spot: 100, extra,
      xlabel: T("到期时的 XYZ 价格", "XYZ price at expiry"), ylabel: T("盈亏（美元，每组）", "P&L ($ per set)"),
      labels: { expiry: T("合计（到期）", "Sum (at expiry)"), spot: T("今天", "today"), be: T("平衡", "BE") },
    }).html;
  };
  onSeg(root, "pl-type", (v) => { nType = v; });
  onSeg(root, "pl-side", (v) => { nSide = v; });
  onSeg(root, "pl-k", (v) => { nK = v; });
  $("#pl-add").addEventListener("click", () => {
    if (legs.length >= 8) return;
    const same = legs.find((l) => l.type === nType && l.side === nSide && (nType === "stock" || l.K === +nK));
    if (same) same.qty += 1; else legs.push(mkLeg(nType, nSide, +nK));
    draw();
  });
  root.querySelector(".demo").addEventListener("click", (e) => {
    const rm = e.target.closest("[data-rm]"); if (rm) { legs.splice(+rm.dataset.rm, 1); draw(); return; }
    const p = e.target.closest("[data-preset]"); if (!p) return;
    legs = p.dataset.preset === "clear" ? [] : PRESETS[p.dataset.preset].map((l) => ({ ...l }));
    draw();
  });
  draw();
}
