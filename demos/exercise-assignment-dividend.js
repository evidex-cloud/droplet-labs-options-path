// Inline demo for lesson exercise-assignment: should an American call be exercised the day before the ex-dividend date?
// Compare the dividend D with the time value left after the dividend: P(S − D, K, τ) + K(1 − e^{−rτ}).
import * as O from "./_opt.js";
import { slider, bindSliders, stats, tex, lineChart } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S = 100, r = 0.04, sigma = 0.2;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("除息前夜：行权还是继续持有？", "The night before ex-dividend: exercise or hold?")}</div>
    <div class="demo-grid">
      ${slider("ed-d", T("股息 D（假设）", "Dividend D (hypothetical)"), 0, 2, 0.05, 1)}
      ${slider("ed-k", T("看涨行权价 K", "Call strike K"), 80, 105, 1, 90)}
      ${slider("ed-t", T("除息日到到期的天数 τ", "Days from ex-date to expiry τ"), 5, 120, 1, 30)}
    </div>
    <div class="demo-math" id="ed-f"></div>
    <div id="ed-stats"></div>
    <div id="ed-chart"></div>
    <p class="demo-tip">${T("看什么：曲线是“除息后还剩多少时间价值”，横线是股息。曲线低于横线的行权价（深度实值）值得在除息前行权——这些看涨的卖方今晚最可能被指派。拉长 τ 或调低股息，门槛向更深的实值方向移动。XYZ = 100，σ = 20%，r = 4%。",
      "What to notice: the curve is the time value left after the dividend, the flat line is the dividend. Strikes where the curve sits below the line (deep in the money) are worth exercising before the ex-date — their writers are the likeliest to be assigned tonight. Lengthen τ or shrink the dividend and the threshold moves deeper in the money. XYZ = 100, σ = 20%, r = 4%.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const tvLeft = (K, D, tau) => O.bsPrice({ S: S - D, K, T: tau, r, sigma, type: "put" }) + K * (1 - Math.exp(-r * tau));
  const draw = (v) => {
    const D = v["ed-d"], K = v["ed-k"], tau = v["ed-t"] / 365;
    const put = O.bsPrice({ S: S - D, K, T: tau, r, sigma, type: "put" }), intr = K * (1 - Math.exp(-r * tau)), tv = put + intr;
    const ex = D > tv;
    $("#ed-f").innerHTML = tex(String.raw`\underbrace{P(${(S - D).toFixed(2)},\,${K},\,\tau)}_{${put.toFixed(3)}} + \underbrace{${K}\left(1 - e^{-0.04 \times ${v["ed-t"]}/365}\right)}_{${intr.toFixed(3)}} = ${tv.toFixed(3)} \quad ${ex ? "<" : ">"} \quad D = ${D.toFixed(2)}`, true);
    $("#ed-stats").innerHTML = stats([
      [T("除息后剩余时间价值", "Time value left after dividend"), tv.toFixed(2)],
      [T("股息", "Dividend"), D.toFixed(2)],
      [T("决定", "Decision"), ex ? T("除息前行权", "Exercise before ex-date") : T("继续持有", "Keep the call"), ex ? "neg" : "pos"],
      [T("每张行权多得 / 少得", "Gain from exercising, per contract"), ((D - tv) >= 0 ? "+$" : "−$") + Math.abs((D - tv) * 100).toFixed(0)],
    ]);
    $("#ed-chart").innerHTML = lineChart({
      xmin: 80, xmax: 110, ymin: 0, xlabel: T("看涨行权价 K", "Call strike K"), ylabel: T("每股美元", "$ per share"),
      series: [{ f: (k) => tvLeft(k, D, tau), cls: 0, label: T("除息后剩余时间价值", "Time value left after the dividend") }],
      hlines: [{ y: D, label: T(`股息 ${D.toFixed(2)}`, `dividend ${D.toFixed(2)}`) }],
      points: [{ x: K, y: tv, cls: ex ? 2 : 3, label: `K = ${K}` }], H: 230,
    });
  };
  bindSliders(root, { "ed-d": (x) => "$" + (+x).toFixed(2), "ed-k": (x) => String(x), "ed-t": (x) => x + T(" 天", " days") }, draw);
}
