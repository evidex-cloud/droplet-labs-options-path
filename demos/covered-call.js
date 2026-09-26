// Main demo for lesson covered-call: 100 XYZ shares + one short call. Pick strike, expiry, implied vol and how far
// into the trade you are; see the expiry payoff, today's mark-to-model curve, the three key numbers and the Greek signature.
import * as O from "./_opt.js";
import { payoffChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S0 = 100, r = 0.04;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("备兑看涨：选行权价，看租金与天花板", "Covered call: pick a strike, see the rent and the ceiling")}</div>
    <div class="demo-grid">
      ${slider("cc-k", T("卖出看涨的行权价 K", "Strike K of the call sold"), 98, 115, 1, 105)}
      ${slider("cc-d", T("到期天数", "Days to expiry"), 7, 90, 1, 30)}
      ${slider("cc-v", T("隐含波动率 σ", "Implied vol σ"), 10, 50, 1, 20)}
      ${slider("cc-e", T("已经过去的时间（到期前的曲线）", "Time already passed (the before-expiry curve)"), 0, 100, 5, 0)}
    </div>
    <div id="cc-chart"></div>
    <div class="demo-math" id="cc-f"></div>
    <div id="cc-stats"></div>
    <div class="demo-label">${T("整个仓位的希腊字母签名（1 张合约 = 100 股 + 1 张空头看涨）", "Greek signature of the whole position (one unit = 100 shares + 1 short call)")}</div>
    <div id="cc-greeks"></div>
    <p class="demo-tip">${T("试试：把 K 拉到 100，租金最高但天花板就在现价；拉到 112，几乎没有租金，也几乎不封顶。再把“已经过去的时间”拉到一半，看虚线：股价大涨时，到期前的盈亏还够不到天花板——空头看涨里还剩时间价值。", "Try this: drag K to 100 — the most rent, but the ceiling sits right at today's price; drag it to 112 — almost no rent and almost no cap. Then move “time already passed” to halfway and watch the dashed curve: after a big rally the P&L is still below the ceiling, because the short call still holds time value.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  bindSliders(root, { "cc-k": (x) => "$" + x, "cc-d": (x) => x + T(" 天", " days"), "cc-v": (x) => x + "%", "cc-e": (x) => x + "%" }, (v) => {
    const K = v["cc-k"], days = v["cc-d"], sigma = v["cc-v"] / 100, Tm = days / 365;
    const g = O.greeks({ S: S0, K, T: Tm, r, sigma, type: "call" });
    const c = g.price;
    const legs = [{ type: "stock", side: "long", entry: S0 }, { type: "call", side: "short", K, premium: c, T: Tm }];
    const elDays = Math.round((v["cc-e"] / 100) * days);
    const pc = payoffChart({
      legs, lo: 75, hi: 125, spot: S0, mult: 100, today: elDays < days ? { elapsed: elDays / 365, sigma, r } : null,
      xlabel: T("到期时 XYZ 价格", "XYZ price"), ylabel: T("盈亏（1 张，美元）", "P&L per unit ($)"),
      labels: { expiry: T("备兑看涨·到期", "Covered call at expiry"), today: T(`备兑看涨·第 ${elDays} 天`, `Covered call on day ${elDays}`), spot: T("现价", "spot"), be: T("平衡", "BE") },
      extra: [{ f: (x) => (x - S0) * 100, cls: 5, dashed: true, label: T("只持股", "Shares only") }],
    });
    $("#cc-chart").innerHTML = pc.html;
    const maxP = K - S0 + c, be = S0 - c, stat = c / S0, ann = Math.pow(1 + stat, 365 / days) - 1, called = maxP / S0, annC = Math.pow(1 + called, 365 / days) - 1;
    $("#cc-f").innerHTML = tex(String.raw`\begin{gathered}\text{${T("最大盈利", "max profit")}} = (K - S_0) + c \\ = (${K} - 100) + ${c.toFixed(2)} = ${maxP.toFixed(2)} \\ \text{${T("平衡价", "breakeven")}} = S_0 - c = ${be.toFixed(2)}\end{gathered}`, true)
      + tex(String.raw`\begin{gathered}\text{${T("静态收益年化", "static yield, annualised")}} \\ = \left(1 + \frac{${c.toFixed(2)}}{100}\right)^{365/${days}} - 1 = ${(ann * 100).toFixed(1)}\%\end{gathered}`, true);
    $("#cc-stats").innerHTML = stats([
      [T("收到的租金（1 张）", "Rent received (1 contract)"), "+$" + (c * 100).toFixed(0), "pos"],
      [T("最大盈利", "Max profit"), "$" + (maxP * 100).toFixed(0), "pos"],
      [T("盈亏平衡", "Breakeven"), "$" + be.toFixed(2), "acc"],
      [T("被行权时的收益（年化）", "Return if called (annualised)"), (called * 100).toFixed(2) + "% (" + (annC * 100).toFixed(0) + "%)"],
      [T("风险中性 P(被行权)", "Risk-neutral P(called)"), (g.probITM * 100).toFixed(1) + "%"],
    ]);
    const pg = O.positionGreeks(legs, S0, { elapsed: 0, sigma, r });
    $("#cc-greeks").innerHTML = stats([
      ["Δ", (pg.delta * 100).toFixed(0) + T(" 股", " sh")],
      ["Γ", "−" + Math.abs(pg.gamma * 100).toFixed(2), "neg"],
      [T("Θ（每天）", "Θ per day"), "+$" + (pg.theta * 100).toFixed(2), "pos"],
      [T("ν（每波动率点）", "ν per vol pt"), "−$" + Math.abs(pg.vega * 100).toFixed(2), "neg"],
    ]);
  });
}
