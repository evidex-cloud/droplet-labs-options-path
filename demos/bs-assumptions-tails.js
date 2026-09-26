// Inline demo for lesson bs-assumptions: how often a −kσ day should happen under the normal distribution
// (Black-Scholes) versus a fat-tailed Student-t with ν degrees of freedom scaled to the same variance.
// The Student-t CDF is implemented locally (regularised incomplete beta; the engine has no t distribution).
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, stats, tex, texNum } from "./_viz.js";

function lgamma(x) {
  const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  let y = x, t = x + 5.5; t -= (x + 0.5) * Math.log(t);
  let s = 1.000000000190015; for (const k of c) s += k / ++y;
  return -t + Math.log((2.5066282746310005 * s) / x);
}
function betacf(a, b, x) {
  const FP = 1e-300; let qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - (qab * x) / qap;
  if (Math.abs(d) < FP) d = FP; d = 1 / d; let h = d;
  for (let m = 1; m <= 300; m++) {
    const m2 = 2 * m; let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d; if (Math.abs(d) < FP) d = FP; c = 1 + aa / c; if (Math.abs(c) < FP) c = FP; d = 1 / d; h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d; if (Math.abs(d) < FP) d = FP; c = 1 + aa / c; if (Math.abs(c) < FP) c = FP; d = 1 / d;
    const del = d * c; h *= del; if (Math.abs(del - 1) < 3e-16) break;
  }
  return h;
}
function ibeta(a, b, x) {
  if (x <= 0) return 0; if (x >= 1) return 1;
  const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  return x < (a + 1) / (a + b + 2) ? (bt * betacf(a, b, x)) / a : 1 - (bt * betacf(b, a, 1 - x)) / b;
}
// P(X < −k) for a Student-t with ν d.f. scaled to unit variance
const tTail = (k, nu) => { const t = k * Math.sqrt(nu / (nu - 2)); return 0.5 * ibeta(nu / 2, 0.5, nu / (nu + t * t)); };

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("“不可能”的一天，到底多久来一次？", "How often does an “impossible” day come?")}</div>
    <div class="demo-grid">
      ${slider("bat-k", T("单日跌幅（标准差 k）", "One-day drop (k standard deviations)"), 2, 12, 0.5, 7)}
      ${slider("bat-nu", T("肥尾分布的自由度 ν（越小越肥）", "Fat-tail degrees of freedom ν (smaller = fatter)"), 3, 30, 1, 3)}
    </div>
    <div id="bat-chart"></div>
    <div class="demo-math" id="bat-f"></div>
    <div id="bat-stats"></div>
    <p class="demo-tip">${T("看什么：在 2σ、3σ 附近两条线差不多；越往右，正态分布的概率坠得越快，差距变成几百万倍。把 ν 调大，肥尾分布就慢慢变回正态。一年按 252 个交易日算；两种分布方差相同。", "What to notice: near 2σ or 3σ the two lines are close; further right the normal probability plunges and the gap grows to factors of millions. Raise ν and the fat-tailed curve slowly turns back into the normal. A year is 252 trading days; both distributions have the same variance.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const yearsTxt = (y) => y < 1 ? (y * 12).toFixed(1) + T(" 个月", " months") : y < 100 ? y.toFixed(1) + T(" 年", " years") : y < 1e5 ? Math.round(y).toLocaleString("en-US") + T(" 年", " years") : tex(texNum(y, 2)) + T(" 年", " years");
  bindSliders(root, { "bat-k": (x) => x.toFixed(1) + "σ", "bat-nu": (x) => String(x) }, (v) => {
    const k = v["bat-k"], nu = v["bat-nu"];
    const pN = O.normCdf(-k), pT = tTail(k, nu);
    const yN = 1 / (252 * pN), yT = 1 / (252 * pT);
    $("#bat-chart").innerHTML = lineChart({
      xmin: 1, xmax: 12, ymin: -34, ymax: 0, xlabel: T("单日跌幅（标准差）", "One-day drop (standard deviations)"), ylabel: T("单日概率（10 的几次方）", "One-day probability (power of 10)"),
      yfmt: (y) => "1e" + Math.round(y),
      series: [
        { f: (x) => Math.log10(O.normCdf(-x)), cls: 0, label: T("正态（Black-Scholes）", "Normal (Black-Scholes)") },
        { f: (x) => Math.log10(tTail(x, nu)), cls: 2, label: T(`Student-t，ν = ${nu}`, `Student-t, ν = ${nu}`) },
      ],
      markers: [{ x: k, label: k.toFixed(1) + "σ" }],
    });
    $("#bat-f").innerHTML = tex(String.raw`\text{${T("正态", "normal")}}: P(z < -${k.toFixed(1)}) = \N(-${k.toFixed(1)}) = ${texNum(pN, 3)} \qquad \text{${T("肥尾", "fat-tailed")}}: ${texNum(pT, 3)}`, true) +
      tex(String.raw`\text{${T("平均间隔", "years between")}} = \frac{1}{252 \times P}`, true);
    $("#bat-stats").innerHTML = stats([
      [T("正态：平均每隔", "Normal: once every"), yearsTxt(yN)],
      [T("肥尾：平均每隔", "Fat-tailed: once every"), yearsTxt(yT), "neg"],
      [T("肥尾 / 正态 概率之比", "Fat-tailed / normal odds"), tex(texNum(pT / pN, 2)) + "×", "acc"],
    ]);
  });
}
