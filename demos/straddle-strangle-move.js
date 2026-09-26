// Inline demo for lesson straddle-strangle: one scenario (move, days passed, IV change) → exact straddle P&L
// versus the Greek split Δ·dS + ½Γ·dS² + Θ·days + ν·dσ.
import * as O from "./_opt.js";
import { payoffChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("一次波动，三股力量：跨式的损益拆解", "One move, three forces: a straddle's P&L split")}</div>
    <div class="demo-grid-3">
      ${slider("ssv-ds", T("XYZ 变动", "XYZ move"), -10, 10, 0.5, 3)}
      ${slider("ssv-t", T("过去的天数", "Days passed"), 0, 29, 1, 5)}
      ${slider("ssv-iv", T("隐含波动率变化", "Change in implied vol"), -10, 10, 1, 0)}
    </div>
    <div class="demo-math" id="ssv-f"></div>
    <div id="ssv-stats"></div>
    <div id="ssv-chart"></div>
    <p class="demo-tip">${T("看什么：股价不动、只让时间过去，损益就是 Theta 的流失；股价走得够远，Gamma 项（½Γ·dS²）盖过 Theta；再把隐含波动率调低几点，看 Vega 项怎样吃掉一部分利润。移动越大，二阶近似越偏离精确值。", "What to notice: with no move, the loss is pure theta; move far enough and the gamma term (½Γ·dS²) beats theta; lower implied vol a few points and watch the vega term eat part of the gain. The bigger the move, the more the second-order estimate drifts from the exact reprice.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const r = 0.04, S0 = 100, T0 = 30 / 365, sig = 0.2;
  const c = O.greeks({ S: S0, K: 100, T: T0, r, sigma: sig, type: "call" }), p = O.greeks({ S: S0, K: 100, T: T0, r, sigma: sig, type: "put" });
  const G = { delta: c.delta + p.delta, gamma: c.gamma + p.gamma, theta: c.theta + p.theta, vega: c.vega + p.vega };
  const legs = [{ type: "call", side: "long", K: 100, premium: c.price, T: T0 }, { type: "put", side: "long", K: 100, premium: p.price, T: T0 }];
  const sgn = (x, d = 2) => (x < 0 ? "-" : "+") + Math.abs(x).toFixed(d);
  bindSliders(root, { "ssv-ds": (x) => (x > 0 ? "+" : x < 0 ? "−" : "") + "$" + Math.abs(x), "ssv-t": (x) => x + T(" 天", " days"), "ssv-iv": (x) => (x > 0 ? "+" : x < 0 ? "−" : "") + Math.abs(x) + T(" 个点", " pts") }, (v) => {
    const dS = v["ssv-ds"], days = v["ssv-t"], dv = v["ssv-iv"];
    const el = days / 365, sNew = Math.max(0.01, sig + dv / 100);
    const exact = O.netPLAt(legs, S0 + dS, { elapsed: el, sigma: sNew, r });
    const dTerm = G.delta * dS, gTerm = 0.5 * G.gamma * dS * dS, tTerm = G.theta * days, vTerm = G.vega * dv;
    const approx = dTerm + gTerm + tTerm + vTerm;
    $("#ssv-f").innerHTML = tex(String.raw`\begin{gathered}\Pi \approx \underbrace{${G.delta.toFixed(3)}\times ${dS.toFixed(1)}}_{\Delta:\ ${sgn(dTerm)}} + \underbrace{\tfrac12 \times ${G.gamma.toFixed(3)}\times ${dS.toFixed(1)}^2}_{\Gamma:\ ${sgn(gTerm)}} \\ \underbrace{- ${Math.abs(G.theta).toFixed(3)}\times ${days}}_{\Theta:\ ${sgn(tTerm)}} + \underbrace{${G.vega.toFixed(3)}\times ${dv}}_{\nu:\ ${sgn(vTerm)}} = ${sgn(approx)}\end{gathered}`, true);
    $("#ssv-stats").innerHTML = stats([
      [T("二阶估计（每股）", "Greek estimate (per share)"), sgn(approx), approx >= 0 ? "pos" : "neg"],
      [T("精确重新定价（每股）", "Exact reprice (per share)"), sgn(exact), exact >= 0 ? "pos" : "neg"],
      [T("每组合约（×100）", "Per set of contracts (×100)"), (exact < 0 ? "−$" : "+$") + Math.abs(exact * 100).toFixed(0), exact >= 0 ? "pos" : "neg"],
      [T("剩余天数", "Days left"), String(30 - days)],
    ]);
    const { html } = payoffChart({ legs, lo: 84, hi: 116, spot: S0 + dS, today: { elapsed: el, sigma: sNew, r }, xlabel: T("XYZ 价格", "XYZ price"), ylabel: T("每股损益", "P&L per share"), labels: { expiry: T("到期", "At expiry"), today: T(`第 ${days} 天、IV ${(sNew * 100).toFixed(0)}%`, `Day ${days}, IV ${(sNew * 100).toFixed(0)}%`), spot: T("此刻 XYZ", "XYZ now"), be: T("平衡", "BE") } });
    $("#ssv-chart").innerHTML = html;
  });
}
