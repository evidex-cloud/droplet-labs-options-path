// Main demo for lesson butterfly: build a call fly, put fly, short iron fly or broken-wing fly on XYZ;
// see the tent at expiry and today, and read the fly's price as a probability.
import * as O from "./_opt.js";
import { payoffChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let kind = "call";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("蝶式搭建器：帐篷、时间与隐含概率", "Butterfly builder: the tent, time and the implied probability")}</div>
    <div class="demo-row">${seg("bf-kind", [["call", T("看涨蝶式", "Call fly")], ["put", T("看跌蝶式", "Put fly")], ["iron", T("卖出铁蝶", "Short iron fly")], ["broken", T("断翼看涨蝶式", "Broken-wing call fly")]], kind)}</div>
    <div class="demo-grid">
      ${slider("bf-k", T("身体（卖出行权价）", "Body (short strike)"), 90, 110, 1, 100)}
      ${slider("bf-w", T("翅膀间距", "Wing spacing"), 1, 10, 1, 5)}
      ${slider("bf-d", T("建仓时的到期天数", "Days to expiry at entry"), 5, 60, 1, 30)}
      ${slider("bf-e", T("已经过去的天数", "Days already passed"), 0, 59, 1, 20)}
      ${slider("bf-iv", T("隐含波动率", "Implied vol"), 10, 40, 1, 20)}
    </div>
    <div class="demo-math" id="bf-f"></div>
    <div id="bf-stats"></div>
    <div id="bf-chart"></div>
    <p class="demo-tip">${T("试试：把“已经过去的天数”从 0 拖到接近到期，看虚线怎样从一条平缓的小丘长成尖帐篷——大部分利润在最后几天才出现。再把间距调到 1，蝶式价格 ÷ 间距² 就几乎等于 100 处的概率密度。", "Try this: drag “days already passed” from 0 towards expiry and watch the dashed curve grow from a low hill into the sharp tent — most of the profit appears in the last few days. Set the spacing to 1 and the fly's price divided by spacing² is almost exactly the probability density at the body.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const r = 0.04, S0 = 100;
  const draw = (v) => {
    const K = v["bf-k"], w = v["bf-w"], dte = v["bf-d"], Tm = dte / 365, sig = v["bf-iv"] / 100;
    const eIn = $("#bf-e");
    eIn.max = String(dte - 1);
    const el = Math.min(v["bf-e"], dte - 1);
    if (+eIn.value > el) eIn.value = String(el);
    $("#bf-e-v").textContent = el + T(" 天", " days");
    const px = (k, type) => O.bsPrice({ S: S0, K: k, T: Tm, r, sigma: sig, type });
    const L = (type, side, k, qty = 1) => ({ type, side, K: k, qty, premium: px(k, type), T: Tm });
    let legs;
    if (kind === "call") legs = [L("call", "long", K - w), L("call", "short", K, 2), L("call", "long", K + w)];
    else if (kind === "put") legs = [L("put", "long", K - w), L("put", "short", K, 2), L("put", "long", K + w)];
    else if (kind === "iron") legs = [L("call", "short", K), L("put", "short", K), L("put", "long", K - w), L("call", "long", K + w)];
    else legs = [L("call", "long", K - w), L("call", "short", K, 2), L("call", "long", K + 2 * w)];
    const cash = legs.reduce((a, l) => a + (l.side === "long" ? -1 : 1) * l.premium * l.qty, 0); // + = credit
    const st = O.payoffStats(legs, 1, 250);
    const cK = px(K, "call"), cLo = px(K - w, "call"), cHi = px(K + w, "call");
    const fly = cLo - 2 * cK + cHi;
    const probFly = (fly / w) * Math.exp(r * Tm);
    const probLN = O.probAbove(S0, K - w / 2, Tm, sig, r) - O.probAbove(S0, K + w / 2, Tm, sig, r);
    const dens = O.lognormalPdf(K, S0, Tm, sig, r);
    $("#bf-f").innerHTML = tex(String.raw`\begin{gathered}\text{Fly} = C(${K - w}) - 2\,C(${K}) + C(${K + w}) \\ = ${cLo.toFixed(3)} - 2 \times ${cK.toFixed(3)} + ${cHi.toFixed(3)} = ${fly.toFixed(3)} \\ \approx e^{-rT} f_{\Q}(${K})\,(${w})^2 = ${(Math.exp(-r * Tm) * dens * w * w).toFixed(3)}\end{gathered}`, true);
    const g = O.positionGreeks(legs, S0, { sigma: sig, r });
    // the grid in payoffStats can step over the body, so check the body strike itself
    const mp = Math.max(st.maxProfit, O.netPL(legs, K)), ml = st.maxLoss;
    const sg = (x) => (x >= 0 ? "+" : "−") + Math.abs(x).toFixed(3);
    $("#bf-stats").innerHTML = stats([
      [cash >= 0 ? T("收到", "Credit") : T("付出", "Debit"), "$" + Math.abs(cash * 100).toFixed(0), "acc"],
      [T("最大利润", "Max profit"), isFinite(mp) ? "$" + (mp * 100).toFixed(0) : "∞", "pos"],
      [T("最大亏损", "Max loss"), isFinite(ml) ? "−$" + Math.abs(ml * 100).toFixed(0) : "∞", "neg"],
      [T("盈亏平衡点", "Breakevens"), st.breakevens.map((b) => b.toFixed(2)).join(" / ") || "–"],
      [T(`蝶式隐含：落在 ${K}±${w / 2} 的概率`, `Fly-implied P(${K}±${w / 2})`), (probFly * 100).toFixed(1) + "%"],
      [T("对数正态模型下的同一概率", "Same probability, lognormal"), (probLN * 100).toFixed(1) + "%"],
      [T("建仓 Δ / Γ", "Entry Δ / Γ"), `${sg(g.delta)} / ${sg(g.gamma)}`],
      [T("建仓每天 Θ / Vega", "Entry Θ per day / vega"), `${sg(g.theta)} / ${sg(g.vega)}`],
    ]);
    const { html } = payoffChart({
      legs, lo: Math.max(1, K - w - 12), hi: K + (kind === "broken" ? 2 * w : w) + 12, spot: S0, mult: 100, today: { elapsed: el / 365, sigma: sig, r },
      xlabel: T("XYZ 价格", "XYZ price"), ylabel: T("每组损益（美元）", "P&L per set ($)"),
      labels: { expiry: T("到期", "At expiry"), today: T(`过去 ${el} 天后（剩 ${dte - el} 天）`, `After ${el} days (${dte - el} left)`), spot: T("今天", "today"), be: T("平衡", "BE") },
    });
    $("#bf-chart").innerHTML = html;
  };
  const run = bindSliders(root, { "bf-k": (x) => "$" + x, "bf-w": (x) => "$" + x, "bf-d": (x) => x + T(" 天", " days"), "bf-e": (x) => x + T(" 天", " days"), "bf-iv": (x) => x + "%" }, draw);
  onSeg(root, "bf-kind", (v) => { kind = v; run(); });
}
