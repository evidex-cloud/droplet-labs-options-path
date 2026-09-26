// Inline demo for lesson vega: an earnings night split into three steps — IV crush, one day, the move.
import * as O from "./_opt.js";
import { barChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let kind = "call";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("财报之夜：IV 崩塌、一天时间、股价跳动", "Earnings night: IV crush, one day, the move")}</div>
    <div class="demo-row">${seg("vc-kind", [["call", T("30 天 100 看涨", "30d 100 call")], ["straddle", T("30 天 100 跨式", "30d 100 straddle")]], kind)}</div>
    <div class="demo-grid-3">
      ${slider("vc-iv0", T("财报前 IV", "IV before"), 20, 70, 1, 35)}
      ${slider("vc-iv1", T("财报后 IV", "IV after"), 10, 40, 1, 20)}
      ${slider("vc-mv", T("第二天股价变动", "Next-day move"), -12, 12, 0.5, 3)}
    </div>
    <div id="vc-bars"></div>
    <div class="demo-math" id="vc-f"></div>
    <div id="vc-stats"></div>
    <p class="demo-tip">${T("看什么：默认参数下，涨 3% 的收益几乎全被 IV 崩塌吃掉。把“财报后 IV”拉到和“财报前”一样，崩塌那一栏消失；再看跨式需要多大的跳动才能回本。", "What to notice: with the defaults, the gain from a 3% jump is almost all eaten by the crush. Set IV after equal to IV before and the crush bar disappears; then see how big a jump the straddle needs just to break even.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const r = 0.04, K = 100, S0 = 100, T0 = 30 / 365, T1 = 29 / 365;
  const val = (S, Tm, sig) => {
    const c = O.bsPrice({ S, K, T: Tm, r, sigma: sig, type: "call" });
    return kind === "call" ? c : c + O.bsPrice({ S, K, T: Tm, r, sigma: sig, type: "put" });
  };
  const draw = (v) => {
    const s0 = v["vc-iv0"] / 100, s1 = v["vc-iv1"] / 100, S1 = S0 * (1 + v["vc-mv"] / 100);
    const p0 = val(S0, T0, s0), pA = val(S0, T0, s1), pB = val(S0, T1, s1), p1 = val(S1, T1, s1);
    const crush = pA - p0, time = pB - pA, move = p1 - pB, tot = p1 - p0;
    const g = O.greeks({ S: S0, K, T: T0, r, sigma: s0, type: "call" });
    const vega = (kind === "call" ? 1 : 2) * g.vega, dvol = v["vc-iv1"] - v["vc-iv0"];
    $("#vc-bars").innerHTML = barChart({
      bars: [
        { label: T("IV 崩塌", "IV change"), value: crush * 100, cls: crush >= 0 ? 3 : 2 },
        { label: T("一天", "one day"), value: time * 100, cls: time >= 0 ? 3 : 2 },
        { label: T("股价变动", "the move"), value: move * 100, cls: move >= 0 ? 3 : 2 },
        { label: T("合计", "total"), value: tot * 100, cls: 0 },
      ],
      yfmt: (x) => (x < 0 ? "−$" : "$") + Math.abs(Math.round(x)), xlabel: T("每张合约的盈亏（美元）", "P&L per contract ($)"),
    });
    // breakeven next-day price (upside) after the crush
    let be = null;
    for (let S = S0; S <= S0 * 1.4; S += 0.01) if (val(S, T1, s1) >= p0) { be = S; break; }
    $("#vc-f").innerHTML = tex(String.raw`\Delta V_{\text{${T("崩塌", "crush")}}} \approx \nu \times \Delta\sigma = ${vega.toFixed(3)} \times (${dvol}) = ${(vega * dvol).toFixed(2)} \quad(\text{${T("精确", "exact")}}: ${crush.toFixed(2)})`, true);
    $("#vc-stats").innerHTML = stats([
      [T("买入价", "Paid"), "$" + p0.toFixed(2)],
      [T("第二天价值", "Worth next day"), "$" + p1.toFixed(2)],
      [T("每张盈亏", "P&L per contract"), (tot >= 0 ? "+$" : "−$") + Math.abs(tot * 100).toFixed(0), tot >= 0 ? "pos" : "neg"],
      [T("回本所需股价（上行）", "Breakeven price (upside)"), be ? "$" + be.toFixed(2) : T("超过 140", "above 140"), "acc"],
    ]);
  };
  const run = bindSliders(root, { "vc-iv0": (x) => x + "%", "vc-iv1": (x) => x + "%", "vc-mv": (x) => (x > 0 ? "+" : "") + x + "%" }, draw);
  onSeg(root, "vc-kind", (k) => { kind = k; run(); });
}
