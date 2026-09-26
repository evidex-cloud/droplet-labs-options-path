// Inline demo for lesson python-backtest: the metrics function on 24 cycle returns, with one optional crash.
// Shows how a single tail cycle changes the Sharpe ratio, skew and drawdown — the reason short samples lie.
import * as O from "./_opt.js";
import { barChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let crashAt = "none";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("指标函数：一次崩盘改变了什么", "The metrics function: what one crash changes")}</div>
    <div class="demo-row">${seg("pbm-at", [["none", T("没有崩盘", "no crash")], ["6", T("第 6 个周期崩盘", "crash in cycle 6")], ["14", T("第 14 个周期", "cycle 14")], ["22", T("第 22 个周期", "cycle 22")]], "none")}</div>
    <div class="demo-grid">
      ${slider("pbm-base", T("正常周期的收益（权利金 + 利息）", "Normal cycle return (premium + interest)"), 0.4, 1.2, 0.02, 0.78)}
      ${slider("pbm-crash", T("崩盘周期的收益", "Crash cycle return"), -20, -1, 0.5, -10)}
    </div>
    <div id="pbm-bars"></div>
    <div id="pbm-stats"></div>
    <div class="demo-math" id="pbm-f"></div>
    <p class="demo-tip">${T("看什么：没有崩盘时，夏普比率高得离谱（波动很小）；放进一个 −10% 的周期，平均收益跌到接近无风险利率，偏度变成大幅负值。崩盘放在第 6 还是第 22 个周期，夏普完全一样，最大回撤和“看起来的感觉”却不同。", "What to notice: with no crash the Sharpe ratio is absurdly high (tiny volatility); add one −10% cycle and the mean drops to about the risk-free rate while skew turns sharply negative. Moving the crash from cycle 6 to cycle 22 leaves the Sharpe ratio identical, but not the drawdown or how the curve feels.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const run = bindSliders(root, { "pbm-base": (x) => x.toFixed(2) + "%", "pbm-crash": (x) => x + "%" }, (v) => {
    const R = O.rng(3), n = 24, base = v["pbm-base"] / 100;
    const cyc = Array.from({ length: n }, () => base + 0.002 * R.normal());
    if (crashAt !== "none") cyc[+crashAt - 1] = v["pbm-crash"] / 100;
    const m = cyc.reduce((a, b) => a + b, 0) / n, sd = Math.sqrt(cyc.reduce((a, b) => a + (b - m) ** 2, 0) / (n - 1));
    const rf = Math.exp((0.04 * 30) / 365) - 1, sharpe = ((m - rf) / sd) * Math.sqrt(365 / 30);
    const m2 = cyc.reduce((a, b) => a + (b - m) ** 2, 0) / n, m3 = cyc.reduce((a, b) => a + (b - m) ** 3, 0) / n;
    const skew = (m3 / m2 ** 1.5) * (Math.sqrt(n * (n - 1)) / (n - 2));
    let eq = 1, pk = 1, mdd = 0;
    for (const x of cyc) { eq *= 1 + x; pk = Math.max(pk, eq); mdd = Math.min(mdd, eq / pk - 1); }
    const cagr = eq ** (365 / (30 * n)) - 1;
    $("#pbm-bars").innerHTML = barChart({ bars: cyc.map((x, i) => ({ label: String(i + 1), value: x * 100, cls: x < 0 ? 2 : 3 })), yfmt: (x) => (Math.abs(x) < 2 ? x.toFixed(2) : x.toFixed(1)) + "%", xlabel: T("周期（每个 30 天）", "cycle (30 days each)"), H: 200 });
    $("#pbm-stats").innerHTML = stats([
      ["CAGR", (cagr * 100).toFixed(2) + "%"],
      [T("夏普", "Sharpe"), sharpe.toFixed(2), sharpe > 1 ? "pos" : sharpe < 0.3 ? "neg" : ""],
      [T("偏度", "Skew"), skew.toFixed(2), skew < -1 ? "neg" : ""],
      [T("最大回撤", "Max drawdown"), (mdd * 100).toFixed(1) + "%", mdd < -0.05 ? "neg" : ""],
      [T("最差周期", "Worst cycle"), (Math.min(...cyc) * 100).toFixed(2) + "%"],
    ]);
    $("#pbm-f").innerHTML = tex(String.raw`\text{SR} = \frac{\bar r - r_f}{s}\sqrt{\tfrac{365}{30}} = \frac{${(m * 100).toFixed(3)}\% - ${(rf * 100).toFixed(3)}\%}{${(sd * 100).toFixed(3)}\%} \times ${Math.sqrt(365 / 30).toFixed(3)} = ${sharpe.toFixed(2)}`, true);
  });
  onSeg(root, "pbm-at", (k) => { crashAt = k; run(); });
}
