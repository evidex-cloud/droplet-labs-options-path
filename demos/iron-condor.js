// Main demo for lesson iron-condor: build a condor (or a wingless short strangle), price it at implied vol,
// then score it under a realized-vol world: win rate, average win/loss and expected P&L by numerical integration.
import * as O from "./_opt.js";
import { payoffChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let kind = "condor";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("铁鹰搭建器：收多少、冒多大险、真正的期望是多少", "Iron condor builder: credit, risk and the real expectation")}</div>
    <div class="demo-row">${seg("ic-kind", [["condor", T("铁鹰（有翅膀）", "Iron condor (with wings)")], ["strangle", T("卖出宽跨（无翅膀）", "Short strangle (no wings)")]], kind)}</div>
    <div class="demo-grid">
      ${slider("ic-kp", T("卖出看跌行权价", "Short put strike"), 85, 99, 1, 95)}
      ${slider("ic-kc", T("卖出看涨行权价", "Short call strike"), 101, 115, 1, 105)}
      ${slider("ic-w", T("翅膀宽度", "Wing width"), 1, 10, 1, 5)}
      ${slider("ic-d", T("到期天数", "Days to expiry"), 7, 60, 1, 30)}
      ${slider("ic-iv", T("隐含波动率（定价）", "Implied vol (pricing)"), 10, 40, 1, 20)}
      ${slider("ic-rv", T("实现波动率（真实世界）", "Realized vol (real world)"), 5, 45, 1, 20)}
    </div>
    <div id="ic-stats"></div>
    <div class="demo-math" id="ic-f"></div>
    <div id="ic-chart"></div>
    <p class="demo-tip">${T("试试：实现波动率等于隐含时，期望损益总在 0 附近，不管你把行权价放多远——胜率越高，平均亏损越大。把实现波动率降到 15%，期望才转正。切到“卖出宽跨”，看最大亏损变成“无上限”。", "Try this: with realized equal to implied, the expected P&L sits near zero wherever you put the strikes — a higher win rate always comes with a bigger average loss. Drop realized to 15% and only then does the expectation turn positive. Switch to the short strangle and the maximum loss becomes unlimited.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const r = 0.04, S0 = 100;
  const draw = (v) => {
    const Kp = v["ic-kp"], Kc = v["ic-kc"], W = v["ic-w"], days = v["ic-d"], Tm = days / 365, sI = v["ic-iv"] / 100, sR = v["ic-rv"] / 100;
    const px = (K, type) => O.bsPrice({ S: S0, K, T: Tm, r, sigma: sI, type });
    const legs = [
      { type: "put", side: "short", K: Kp, premium: px(Kp, "put"), T: Tm },
      { type: "call", side: "short", K: Kc, premium: px(Kc, "call"), T: Tm },
    ];
    if (kind === "condor") legs.push({ type: "put", side: "long", K: Kp - W, premium: px(Kp - W, "put"), T: Tm }, { type: "call", side: "long", K: Kc + W, premium: px(Kc + W, "call"), T: Tm });
    const credit = -legs.reduce((a, l) => a + (l.side === "long" ? 1 : -1) * l.premium, 0);
    const beLo = Kp - credit, beHi = Kc + credit;
    const maxLoss = kind === "condor" ? W - credit : Infinity;
    const popQ = O.probAbove(S0, beLo, Tm, sI, r) - O.probAbove(S0, beHi, Tm, sI, r);
    // real-world expectation by integration over z
    let pw = 0, sw = 0, sl = 0, ev = 0;
    const dz = 0.01, sq = sR * Math.sqrt(Tm), drift = (r - sR * sR / 2) * Tm;
    for (let z = -7; z <= 7; z += dz) {
      const w = O.normPdf(z) * dz, ST = S0 * Math.exp(drift + sq * z), pl = O.netPL(legs, ST);
      ev += w * pl;
      if (pl > 0) { pw += w; sw += w * pl; } else sl += w * pl;
    }
    const avgW = pw > 0 ? sw / pw : 0, avgL = pw < 1 ? -sl / (1 - pw) : 0;
    const g = O.positionGreeks(legs, S0, { sigma: sI, r });
    const d$ = (x) => (Math.abs(x * 100) < 0.5 ? "$0" : (x < 0 ? "−$" : "+$") + Math.abs(x * 100).toFixed(0));
    $("#ic-stats").innerHTML = stats([
      [T("收到的权利金", "Credit received"), "$" + (credit * 100).toFixed(0), "pos"],
      [T("最大亏损", "Maximum loss"), isFinite(maxLoss) ? "−$" + (maxLoss * 100).toFixed(0) : T("无上限", "unlimited"), "neg"],
      [T("盈亏平衡点", "Breakevens"), beLo.toFixed(2) + " / " + beHi.toFixed(2)],
      [T("风险回报率", "Return on risk"), isFinite(maxLoss) ? ((credit / maxLoss) * 100).toFixed(1) + "%" : "–"],
      [T("风险中性胜率（按 IV）", "Risk-neutral POP (at IV)"), (popQ * 100).toFixed(1) + "%"],
      [T("真实世界胜率（按 RV）", "Real-world win rate (at RV)"), (pw * 100).toFixed(1) + "%", "acc"],
      [T("期望损益（按 RV）", "Expected P&L (at RV)"), d$(ev), ev >= 0 ? "pos" : "neg"],
      [T("Γ / 每天 Θ / Vega", "Γ / Θ per day / vega"), [g.gamma, g.theta, g.vega].map((x) => (x >= 0 ? "+" : "−") + Math.abs(x).toFixed(3)).join(" / ")],
    ]);
    $("#ic-f").innerHTML = tex(String.raw`\begin{gathered}\E[\Pi] = p\,\bar W - (1-p)\,\bar L \\ = ${pw.toFixed(3)} \times ${avgW.toFixed(2)} - ${(1 - pw).toFixed(3)} \times ${avgL.toFixed(2)} \\ = ${ev < 0 ? "-" : "+"}${Math.abs(ev).toFixed(3)}\ \text{${T("每股", "per share")}}\end{gathered}`, true);
    const lo = Math.max(1, Math.min(Kp - W - 8, 80)), hi = Math.max(Kc + W + 8, 120);
    const { html } = payoffChart({ legs, lo, hi, spot: S0, mult: 100, xlabel: T("到期时 XYZ 价格", "XYZ price at expiry"), ylabel: T("每组损益（美元）", "P&L per set ($)"), labels: { expiry: T("到期损益", "P&L at expiry"), spot: T("今天", "today"), be: T("平衡", "BE") } });
    $("#ic-chart").innerHTML = html;
  };
  const run = bindSliders(root, { "ic-kp": (x) => "$" + x, "ic-kc": (x) => "$" + x, "ic-w": (x) => "$" + x, "ic-d": (x) => x + T(" 天", " days"), "ic-iv": (x) => x + "%", "ic-rv": (x) => x + "%" }, draw);
  onSeg(root, "ic-kind", (v) => { kind = v; root.querySelector("#ic-w").disabled = v !== "condor"; run(); });
}
