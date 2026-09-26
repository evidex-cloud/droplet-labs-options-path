// Main demo for lesson vertical-spreads: build any of the four verticals on XYZ, see the expiry payoff, the before-expiry
// curve, max profit/loss, breakeven, risk-neutral probability of profit and the Greek signature (vs the single long leg).
import * as O from "./_opt.js";
import { payoffChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S0 = 100, r = 0.04;
  let kind = "bullcall", W = 5, v = {};
  const NAMES = { bullcall: T("牛市看涨（借记）", "Bull call (debit)"), bearput: T("熊市看跌（借记）", "Bear put (debit)"), bullput: T("牛市看跌（贷记）", "Bull put (credit)"), bearcall: T("熊市看涨（贷记）", "Bear call (credit)") };
  const K1DEF = { bullcall: 100, bearput: 95, bullput: 95, bearcall: 100 };
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("垂直价差构建器", "Vertical spread builder")}</div>
    <div class="demo-row">${seg("vs-kind", Object.entries(NAMES), kind)}</div>
    <div class="demo-row">${seg("vs-w", [["2.5", T("宽度 2.5", "width 2.5")], ["5", T("宽度 5", "width 5")], ["10", T("宽度 10", "width 10")]], "5")}</div>
    <div class="demo-grid">
      ${slider("vs-k", T("较低的行权价 K₁", "Lower strike K₁"), 85, 112.5, 2.5, 100)}
      ${slider("vs-d", T("到期天数", "Days to expiry"), 7, 90, 1, 30)}
      ${slider("vs-v", T("隐含波动率 σ", "Implied vol σ"), 10, 50, 1, 20)}
      ${slider("vs-e", T("已经过去的时间（到期前的曲线）", "Time already passed (before-expiry curve)"), 0, 100, 5, 0)}
    </div>
    <div class="legs" id="vs-legs"></div>
    <div id="vs-chart"></div>
    <div class="demo-math" id="vs-f"></div>
    <div id="vs-stats"></div>
    <div class="demo-label" id="vs-glab"></div>
    <div id="vs-greeks"></div>
    <p class="demo-tip">${T("试试：在四种价差之间切换，保持同样的两个行权价——借记和贷记的形状成对出现。再把“已经过去的时间”拉到 20%，然后把现价想象成 110：曲线离到期的最大盈利还差一截，价差要靠时间才能兑现。宽度改成 10，看最大盈利和风险中性胜率怎样此消彼长。", "Try this: switch between the four spreads while keeping the same two strikes — debit and credit shapes come in pairs. Then set “time already passed” to 20% and look at the curve around 110: it is still short of the maximum, because a spread needs time to pay out. Change the width to 10 and watch maximum profit and the risk-neutral chance of profit trade off.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  function build(K1, K2, Tm, sigma) {
    const c1 = O.bsCall(S0, K1, Tm, r, sigma), c2 = O.bsCall(S0, K2, Tm, r, sigma), p1 = O.bsPut(S0, K1, Tm, r, sigma), p2 = O.bsPut(S0, K2, Tm, r, sigma);
    const L = (type, side, K, premium) => ({ type, side, K, premium, T: Tm });
    switch (kind) {
      case "bullcall": return { legs: [L("call", "long", K1, c1), L("call", "short", K2, c2)], net: c1 - c2, debit: true, bull: true, be: K1 + (c1 - c2) };
      case "bearput": return { legs: [L("put", "long", K2, p2), L("put", "short", K1, p1)], net: p2 - p1, debit: true, bull: false, be: K2 - (p2 - p1) };
      case "bullput": return { legs: [L("put", "short", K2, p2), L("put", "long", K1, p1)], net: p2 - p1, debit: false, bull: true, be: K2 - (p2 - p1) };
      default: return { legs: [L("call", "short", K1, c1), L("call", "long", K2, c2)], net: c1 - c2, debit: false, bull: false, be: K1 + (c1 - c2) };
    }
  }
  function draw() {
    const K1 = v["vs-k"], K2 = K1 + W, days = v["vs-d"], Tm = days / 365, sigma = v["vs-v"] / 100;
    const b = build(K1, K2, Tm, sigma);
    const maxP = b.debit ? W - b.net : b.net, maxL = b.debit ? b.net : W - b.net;
    $("#vs-legs").innerHTML = b.legs.map((l) => `<div class="leg"><span class="${l.side === "long" ? "side-long" : "side-short"}">${l.side === "long" ? T("买入", "Buy") : T("卖出", "Sell")}</span> ${days}${T(" 天", "-day")} ${l.K} ${l.type === "call" ? T("看涨", "call") : T("看跌", "put")} <span class="demo-meta" style="margin:0">@ ${l.premium.toFixed(2)}</span></div>`).join("");
    const elDays = Math.round((v["vs-e"] / 100) * days);
    $("#vs-chart").innerHTML = payoffChart({
      legs: b.legs, lo: 80, hi: 125, spot: S0, mult: 100, today: elDays < days ? { elapsed: elDays / 365, sigma, r } : null,
      xlabel: T("XYZ 价格", "XYZ price"), ylabel: T("盈亏（1 张，美元）", "P&L per spread ($)"),
      labels: { expiry: T("到期时", "At expiry"), today: T(`第 ${elDays} 天`, `Day ${elDays}`), spot: T("现价", "spot"), be: T("平衡", "BE") },
    }).html;
    const w = String(W);
    $("#vs-f").innerHTML = b.debit
      ? tex(String.raw`\begin{gathered}\text{${T("借记", "debit")}}\ D = ${b.net.toFixed(2)} \\ \text{${T("最大盈利", "max profit")}} = (K_2 - K_1) - D = ${w} - ${b.net.toFixed(2)} = ${maxP.toFixed(2)} \\ \text{${T("平衡", "BE")}} = ${b.be.toFixed(2)}\end{gathered}`, true)
      : tex(String.raw`\begin{gathered}\text{${T("贷记", "credit")}}\ C_r = ${b.net.toFixed(2)} \\ \text{${T("最大亏损", "max loss")}} = (K_2 - K_1) - C_r = ${w} - ${b.net.toFixed(2)} = ${maxL.toFixed(2)} \\ \text{${T("平衡", "BE")}} = ${b.be.toFixed(2)}\end{gathered}`, true);
    const pAbove = O.probAbove(S0, b.be, Tm, sigma, r), pop = b.bull ? pAbove : 1 - pAbove;
    $("#vs-stats").innerHTML = stats([
      [b.debit ? T("付出（借记）", "Paid (debit)") : T("收到（贷记）", "Received (credit)"), "$" + (b.net * 100).toFixed(0), b.debit ? "neg" : "pos"],
      [T("最大盈利", "Max profit"), "$" + (maxP * 100).toFixed(0), "pos"],
      [T("最大亏损", "Max loss"), "$" + (maxL * 100).toFixed(0), "neg"],
      [T("盈亏比", "Reward : risk"), (maxP / maxL).toFixed(2) + " : 1"],
      [T("风险中性 P(到期盈利)", "Risk-neutral P(profit at expiry)"), (pop * 100).toFixed(1) + "%", "acc"],
    ]);
    const g = O.positionGreeks(b.legs, S0, { elapsed: 0, sigma, r });
    const longLeg = b.legs.find((l) => l.side === "long");
    const gl = O.greeks({ S: S0, K: longLeg.K, T: Tm, r, sigma, type: longLeg.type });
    $("#vs-glab").textContent = T(`价差的希腊字母（1 张），括号里是只买 ${longLeg.K} ${longLeg.type === "call" ? "看涨" : "看跌"} 这一条腿的值`, `Spread Greeks (1 spread); in brackets, the single long ${longLeg.K} ${longLeg.type} alone`);
    const f = (x, d = 2) => (x >= 0 ? "+" : "−") + Math.abs(x).toFixed(d);
    $("#vs-greeks").innerHTML = stats([
      ["Δ", f(g.delta * 100, 1) + " (" + f(gl.delta * 100, 1) + ")"],
      ["Γ", f(g.gamma * 100) + " (" + f(gl.gamma * 100) + ")"],
      [T("Θ（每天）", "Θ per day"), f(g.theta * 100) + " (" + f(gl.theta * 100) + ")", g.theta >= 0 ? "pos" : "neg"],
      [T("ν（每波动率点）", "ν per vol pt"), f(g.vega * 100) + " (" + f(gl.vega * 100) + ")"],
    ]);
  }
  const run = bindSliders(root, { "vs-k": (x) => "$" + x, "vs-d": (x) => x + T(" 天", " days"), "vs-v": (x) => x + "%", "vs-e": (x) => x + "%" }, (vals) => { v = vals; draw(); });
  onSeg(root, "vs-kind", (k) => { kind = k; $("#vs-k").value = K1DEF[k]; run(); });
  onSeg(root, "vs-w", (x) => { W = +x; draw(); });
}
