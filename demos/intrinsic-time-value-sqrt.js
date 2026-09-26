// Inline demo for lesson intrinsic-time-value: the time value of XYZ's at-the-money call against days to expiry,
// with the rule of thumb 0.4·S·σ·√T. Shows the square-root shape and the accelerating daily melt.
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S = 100, K = 100, r = 0.04;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("平值期权的时间价值：随 √T 缩小", "At-the-money time value shrinks like √T")}</div>
    <div class="demo-grid">
      ${slider("its-d", T("离到期天数", "Days to expiry"), 1, 365, 1, 30)}
      ${slider("its-v", T("波动率 σ", "Volatility σ"), 5, 60, 1, 20)}
    </div>
    <div class="demo-math" id="its-f"></div>
    <div id="its-chart"></div>
    <div id="its-stats"></div>
    <p class="demo-tip">${T("试试：从 120 天拉到 30 天（时间变成 1/4），价格大约减半；再从 30 天拉到 7 天，又减半。曲线越靠近到期越陡：同样是“少一天”，最后一周丢得比第一个月多得多。", "Try this: go from 120 days to 30 (a quarter of the time) and the price roughly halves; from 30 to 7 it halves again. The curve steepens near expiry: “one day less” costs far more in the last week than in the first month.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const d = v["its-d"], sigma = v["its-v"] / 100, Tm = d / 365;
    const g = O.greeks({ S, K, T: Tm, r, sigma, type: "call" }), rule = 0.4 * S * sigma * Math.sqrt(Tm);
    $("#its-f").innerHTML = tex(String.raw`0.4\,S\sigma\sqrt{T} = 0.4 \times 100 \times ${sigma.toFixed(2)} \times \sqrt{${d}/365} = ${rule.toFixed(2)}`, true) + tex(String.raw`\text{${T("精确", "exact")}}\ C = ${g.price.toFixed(2)}`, true);
    $("#its-chart").innerHTML = lineChart({
      xmin: 0, xmax: 365, ymin: 0, xlabel: T("离到期天数", "Days to expiry"), ylabel: T("时间价值（美元/股）", "Time value ($ per share)"),
      series: [
        { f: (x) => (x <= 0 ? 0 : O.bsPrice({ S, K, T: x / 365, r, sigma, type: "call" })), cls: 0, label: T("Black-Scholes 精确值（r = 4%）", "Black-Scholes exact (r = 4%)") },
        { f: (x) => 0.4 * S * sigma * Math.sqrt(Math.max(x, 0) / 365), cls: 1, dashed: true, label: T("经验法则 0.4·S·σ·√T", "Rule of thumb 0.4·S·σ·√T") },
      ],
      points: [{ x: d, y: g.price, cls: 0, label: "$" + g.price.toFixed(2) }],
    });
    $("#its-stats").innerHTML = stats([
      [T("时间价值（每股）", "Time value per share"), "$" + g.price.toFixed(2), "acc"],
      [T("每张合约", "Per contract"), "$" + (g.price * 100).toFixed(0)],
      [T("明天会少（Θ/天）", "Lost by tomorrow (Θ/day)"), "−$" + Math.abs(g.theta).toFixed(3), "neg"],
      [T("每张每天", "Per contract per day"), "−$" + Math.abs(g.theta * 100).toFixed(2), "neg"],
    ]);
  };
  bindSliders(root, { "its-d": (x) => x + T(" 天", " days"), "its-v": (x) => x + "%" }, draw);
}
