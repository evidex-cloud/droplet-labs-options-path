// Inline demo for lesson position-sizing: risk of ruin (a −50% drawdown) as a function of the risk taken per trade.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

const PRESETS = { coin: [0.55, 1], seller: [0.8, 0.3], lottery: [0.2, 5] };

// Fraction of simulated traders whose account falls 50% below its peak at some point within n trades.
function ruin(f, p, b, n, paths, seed) {
  const R = O.rng(seed);
  let hit = 0, below = 0;
  const finals = [];
  for (let k = 0; k < paths; k++) {
    let w = 1, peak = 1, dd = false;
    for (let i = 0; i < n; i++) {
      w *= R() < p ? 1 + f * b : 1 - f;
      if (w > peak) peak = w; else if (w <= 0.5 * peak) dd = true;
    }
    if (dd) hit++;
    if (w < 1) below++;
    finals.push(w);
  }
  finals.sort((a, c) => a - c);
  return { pDD: hit / paths, pBelow: below / paths, median: finals[paths >> 1] };
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let pre = "coin";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("破产风险：每笔冒多少险？", "Risk of ruin: how much do you risk per trade?")}</div>
    <div class="demo-row">${seg("psr-pre", [["coin", T("55% 胜 · 1 赔 1", "55% win · 1:1")], ["seller", T("80% 胜 · 1 赔 0.3", "80% win · 0.3:1")], ["lottery", T("20% 胜 · 1 赔 5", "20% win · 5:1")]], pre)}</div>
    ${slider("psr-f", T("每笔交易冒险的本金比例", "Share of the account risked per trade"), 0.5, 30, 0.5, 2)}
    <div class="demo-math" id="psr-m"></div>
    <div id="psr-s"></div>
    <div id="psr-c"></div>
    <p class="demo-tip">${T("看什么：三种交易的期望都是正的，但“200 笔之内曾经腰斩”的概率随每笔风险急剧上升；1%–2% 时几乎为零，10% 以上往往过半。曲线在凯利比例附近已经很高——“最优增长”并不等于“安全”。", "What to notice: all three trades have positive expectancy, yet the chance of being cut in half at some point within 200 trades climbs steeply with the risk per trade — near zero at 1–2%, often above half beyond 10%. The curve is already high around the Kelly fraction: growth-optimal is not the same as safe.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const N = 200;
  let curve = null;
  const buildCurve = () => {
    const [p, b] = PRESETS[pre];
    const xs = [0.5, 1, 2, 3, 5, 7.5, 10, 12.5, 15, 20, 25, 30];
    curve = xs.map((x) => [x, ruin(x / 100, p, b, N, 500, 21).pDD * 100]);
  };
  const draw = (v) => {
    if (!curve) buildCurve();
    const [p, b] = PRESETS[pre];
    const f = v["psr-f"] / 100;
    const res = ruin(f, p, b, N, 2000, 5);
    const fStar = O.kellyFraction(p, b), ev = p * b - (1 - p);
    $("#psr-m").innerHTML = tex(String.raw`\mathrm{EV} = p\,b - (1-p) = ${p} \times ${b} - ${(1 - p).toFixed(2)} = ${ev.toFixed(2)}`, true) +
      tex(String.raw`f^* = p - \frac{1-p}{b} = ${(fStar * 100).toFixed(1)}\%`, true);
    $("#psr-s").innerHTML = stats([
      [T("每笔风险", "Risk per trade"), (f * 100).toFixed(1) + "%", "acc"],
      [T("200 笔内曾回撤 50%", "Hit −50% drawdown within 200 trades"), (res.pDD * 100).toFixed(1) + "%", res.pDD > 0.1 ? "neg" : "pos"],
      [T("200 笔后仍低于本金", "Still below the start after 200"), (res.pBelow * 100).toFixed(1) + "%"],
      [T("中位数终值", "Median final wealth"), "×" + res.median.toFixed(2), res.median >= 1 ? "pos" : "neg"],
    ]);
    $("#psr-c").innerHTML = lineChart({
      xmin: 0, xmax: 30, ymin: 0, ymax: 100, H: 220,
      xlabel: T("每笔风险（占本金 %）", "Risk per trade (% of account)"), ylabel: T("腰斩概率 %", "P(−50%) %"),
      xfmt: (x) => x + "%", yfmt: (y) => y + "%",
      series: [{ points: curve, cls: 2, dots: true, label: T("200 笔内出现 −50% 回撤的概率", "Chance of a −50% drawdown within 200 trades") }],
      markers: [{ x: fStar * 100, label: "f*" }],
      points: [{ x: f * 100, y: res.pDD * 100, cls: 0, label: (res.pDD * 100).toFixed(0) + "%" }],
    });
  };
  const run = bindSliders(root, { "psr-f": (x) => (+x).toFixed(1) + "%" }, draw);
  onSeg(root, "psr-pre", (v) => { pre = v; curve = null; run(); });
}
