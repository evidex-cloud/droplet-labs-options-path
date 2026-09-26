// Inline demo for lesson theta: one day of a delta-hedged long ATM call = gamma gain ½Γ(dS)² minus gamma rent
// ½Γ S²σ²/365. The breakeven move Sσ/√365 is the same for every expiry; only the stakes change.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let days = 30;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("Gamma 与 Theta 的一天：股价要动多少才回本？", "One day of gamma vs theta: how far must XYZ move to pay the rent?")}</div>
    ${seg("tb-d", [["1", T("1 天", "1 day")], ["7", T("7 天", "7 days")], ["30", T("30 天", "30 days")], ["90", T("90 天", "90 days")]], "30")}
    <div class="demo-grid" style="margin-top:.5rem">
      ${slider("tb-v", T("隐含波动率 σ（定价用）", "Implied vol σ (used to price)"), 10, 60, 1, 20)}
      ${slider("tb-m", T("今天 XYZ 实际变动 |dS|", "XYZ's actual move today |dS|"), 0, 3, 0.05, 1.5)}
    </div>
    <div class="demo-math" id="tb-f"></div>
    <div id="tb-stats"></div>
    <div id="tb-chart"></div>
    <p class="demo-tip">${T("看什么：换到期日时，盈亏平衡点纹丝不动——它只取决于隐含波动率（σ 20% 时约 1.05 美元）；变的是抛物线的深浅：1 天期权输得多、赢得也多。把 σ 调高，平衡点跟着外移。", "What to notice: switching expiries leaves the breakeven exactly where it is — it depends only on implied vol (about $1.05 at σ 20%). What changes is how deep the parabola is: the 1-day option loses more on quiet days and wins more on busy ones. Raise σ and the breakeven moves out.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const run = bindSliders(root, { "tb-v": (x) => x + "%", "tb-m": (x) => "$" + x.toFixed(2) }, (v) => {
    const sigma = v["tb-v"] / 100, m = v["tb-m"];
    const g = O.greeks({ S: 100, K: 100, T: days / 365, r: 0.04, sigma, type: "call" });
    const rent = 0.5 * g.gamma * 100 * 100 * sigma * sigma / 365;
    const pl = (x) => 100 * (0.5 * g.gamma * x * x - rent);
    const be = 100 * sigma / Math.sqrt(365);
    $("#tb-f").innerHTML = tex(String.raw`\Pi_{\text{${T("一天", "1 day")}}} \approx \tfrac12\Gamma(\dd S)^2 - \tfrac12\Gamma S^2\sigma^2\,\dd t = \tfrac12 \times ${g.gamma.toFixed(4)} \times ${m.toFixed(2)}^2 - ${rent.toFixed(4)} = ${(pl(m) / 100).toFixed(4)}`, true)
      + tex(String.raw`\text{${T("盈亏平衡", "breakeven")}}: \ |\dd S| = S\sigma\sqrt{\dd t} = \frac{100 \times ${sigma.toFixed(2)}}{\sqrt{365}} = \$${be.toFixed(2)}`, true);
    $("#tb-stats").innerHTML = stats([
      ["Γ", g.gamma.toFixed(4)],
      [T("Gamma 租金（每张每天）", "Gamma rent (per contract per day)"), O.fmtUsd(-rent * 100, 2), "neg"],
      [T("今天对冲后的盈亏（每张）", "Today's hedged P&L (per contract)"), O.fmtUsd(pl(m), 2), pl(m) >= 0 ? "pos" : "neg"],
      [T("盈亏平衡日变动", "Breakeven daily move"), "±$" + be.toFixed(2), "acc"],
    ]);
    $("#tb-chart").innerHTML = lineChart({
      xmin: -3, xmax: 3, H: 250, xlabel: T("当天股价变动 dS（美元）", "Today's stock move dS ($)"), ylabel: T("每张对冲后盈亏（美元）", "Hedged P&L per contract ($)"),
      series: [{ f: pl, cls: 0, label: T(`${days} 天平值看涨，对冲后`, `${days}-day ATM call, hedged`) }],
      markers: [{ x: -be, label: "−BE" }, { x: be, label: "+BE" }],
      points: [{ x: m, y: pl(m), cls: pl(m) >= 0 ? 3 : 2, label: O.fmtUsd(pl(m), 2) }],
    });
  });
  onSeg(root, "tb-d", (x) => { days = +x; run(); });
}
