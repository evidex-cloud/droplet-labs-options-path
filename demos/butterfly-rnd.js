// Inline demo for lesson butterfly: price a row of butterflies across strikes and read the market's distribution
// (Breeden–Litzenberger). A skew slider bends the smile and shows how the implied distribution changes.
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("一排蝶式 = 市场的概率分布", "A row of butterflies = the market's distribution")}</div>
    <div class="demo-grid">
      ${slider("bfr-w", T("蝶式间距 ΔK", "Butterfly spacing ΔK"), 1, 8, 1, 4)}
      ${slider("bfr-b", T("偏斜强度（0 = 平坦 20%）", "Skew strength (0 = flat 20%)"), 0, 100, 5, 0)}
    </div>
    <div class="demo-math" id="bfr-f"></div>
    <div id="bfr-chart"></div>
    <p class="demo-tip">${T("看什么：偏斜为 0 时，蝶式点正好落在对数正态曲线上；加大偏斜，左侧远端的尾部变厚、现价略上方的峰变高，中间偏左的地方变薄。所有桶加起来始终约等于 1。", "What to notice: with zero skew the butterfly points sit on the lognormal curve; add skew and the far left tail fattens, the peak just above spot rises and the region in between thins. The buckets always add up to about 1.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const r = 0.04, Tm = 30 / 365, S0 = 100;
  bindSliders(root, { "bfr-w": (x) => "$" + x, "bfr-b": (x) => (x / 100).toFixed(2) }, (v) => {
    const w = v["bfr-w"], b = v["bfr-b"] / 100;
    const vol = (K) => Math.max(0.05, 0.2 - b * Math.log(K / S0) + 2 * b * Math.log(K / S0) ** 2);
    const C = (K) => O.bsPrice({ S: S0, K, T: Tm, r, sigma: vol(K), type: "call" });
    const pts = [];
    let total = 0, fly100 = 0;
    for (let K = 100 - w * Math.floor(40 / w); K <= 140; K += w) {
      if (K - w <= 0) continue;
      const fly = C(K - w) - 2 * C(K) + C(K + w);
      total += (fly / w) * Math.exp(r * Tm);
      pts.push([K, (fly / (w * w)) * Math.exp(r * Tm)]);
      if (K === 100) fly100 = fly;
    }
    $("#bfr-f").innerHTML = tex(String.raw`\begin{gathered}\hat f_{\Q}(K) = \frac{e^{rT}\,\text{Fly}(K)}{(\Delta K)^2} \\ \text{Fly}(100) = ${fly100.toFixed(3)} \\ \sum_K \frac{e^{rT}\,\text{Fly}(K)}{\Delta K} = ${total.toFixed(3)}\end{gathered}`, true);
    $("#bfr-chart").innerHTML = lineChart({
      series: [
        { f: (x) => O.lognormalPdf(x, S0, Tm, 0.2, r), cls: 5, dashed: true, label: T("对数正态（平坦 20%）", "Lognormal (flat 20%)") },
        { points: pts, cls: 0, dots: true, label: T("从蝶式价格读出的密度", "Density read from butterfly prices") },
      ],
      xmin: 60, xmax: 140, ymin: 0, xlabel: T("30 天后 XYZ 的价格", "XYZ price in 30 days"), ylabel: T("每 1 美元的概率", "probability per $1"), yfmt: (y) => (y * 100).toFixed(1) + "%", H: 250,
    });
  });
}
