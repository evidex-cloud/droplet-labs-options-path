// Inline demo for lesson ratios-risk-reversals: shape a smile with a skew and a curvature slider,
// find the 25-delta strikes, and read RR25 / BF25 plus what the skew does to the 95 put, the 105 call and Kai's collar.
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("塑造一条微笑：读出 RR₂₅ 与 BF₂₅", "Shape a smile: read RR₂₅ and BF₂₅")}</div>
    <div class="demo-grid">
      ${slider("rks-b", T("偏斜（倾斜）", "Skew (tilt)"), 0, 100, 5, 50)}
      ${slider("rks-c", T("弯曲（两翼）", "Curvature (wings)"), 0, 300, 10, 100)}
    </div>
    <div class="demo-math" id="rks-f"></div>
    <div id="rks-stats"></div>
    <div id="rks-chart"></div>
    <p class="demo-tip">${T("看什么：只加倾斜，RR₂₅ 变负、BF₂₅ 几乎不动；只加弯曲，两翼一起变贵，RR₂₅ 不动。倾斜越大，95 看跌越贵、105 看涨越便宜，小凯的领口从收钱变成付钱。", "What to notice: tilt alone makes RR₂₅ negative and barely moves BF₂₅; curvature alone lifts both wings and leaves RR₂₅ alone. The more tilt, the richer the 95 put and the cheaper the 105 call — Kai's collar flips from a credit to a debit.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const r = 0.04, Tm = 30 / 365, S0 = 100;
  bindSliders(root, { "rks-b": (x) => (x / 100).toFixed(2), "rks-c": (x) => (x / 100).toFixed(1) }, (v) => {
    const b = v["rks-b"] / 100, c = v["rks-c"] / 100;
    const vol = (K) => Math.max(0.05, 0.2 - b * Math.log(K / S0) + c * Math.log(K / S0) ** 2);
    const delta = (K, type) => O.greeks({ S: S0, K, T: Tm, r, sigma: vol(K), type }).delta;
    const find = (type, target) => { let lo = 70, hi = 130; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2, d = delta(m, type); if (type === "call" ? d > target : d > target) lo = m; else hi = m; } return (lo + hi) / 2; };
    const kc = find("call", 0.25), kp = find("put", -0.25);
    const sc = vol(kc), sp = vol(kp), sa = vol(S0);
    const rr = (sc - sp) * 100, bf = ((sc + sp) / 2 - sa) * 100;
    $("#rks-f").innerHTML = tex(String.raw`\begin{gathered}RR_{25} = \sigma_{25C} - \sigma_{25P} = ${(sc * 100).toFixed(1)} - ${(sp * 100).toFixed(1)} = ${rr.toFixed(1)} \\ BF_{25} = \tfrac12(${(sc * 100).toFixed(1)} + ${(sp * 100).toFixed(1)}) - ${(sa * 100).toFixed(1)} = ${bf.toFixed(2)}\end{gathered}`, true);
    const p95 = O.bsPrice({ S: S0, K: 95, T: Tm, r, sigma: vol(95), type: "put" }), c105 = O.bsPrice({ S: S0, K: 105, T: Tm, r, sigma: vol(105), type: "call" });
    const p95f = O.bsPrice({ S: S0, K: 95, T: Tm, r, sigma: 0.2, type: "put" }), c105f = O.bsPrice({ S: S0, K: 105, T: Tm, r, sigma: 0.2, type: "call" });
    const collar = p95 - c105;
    $("#rks-stats").innerHTML = stats([
      [T("25Δ 看跌：行权价 / IV", "25Δ put: strike / IV"), `${kp.toFixed(1)} / ${(sp * 100).toFixed(1)}%`],
      [T("25Δ 看涨：行权价 / IV", "25Δ call: strike / IV"), `${kc.toFixed(1)} / ${(sc * 100).toFixed(1)}%`],
      [T("95 看跌（平坦 → 偏斜）", "95 put (flat → skew)"), `${p95f.toFixed(2)} → ${p95.toFixed(2)}`],
      [T("105 看涨（平坦 → 偏斜）", "105 call (flat → skew)"), `${c105f.toFixed(2)} → ${c105.toFixed(2)}`],
      [T("小凯的领口（买 95P 卖 105C）", "Kai's collar (buy 95P, sell 105C)"), (collar > 0 ? T("付 $", "pay $") : T("收 $", "receive $")) + Math.abs(collar * 100).toFixed(0), collar > 0 ? "neg" : "pos"],
    ]);
    $("#rks-chart").innerHTML = lineChart({
      series: [
        { f: () => 20, cls: 5, dashed: true, label: T("平坦 20%", "flat 20%") },
        { f: (K) => vol(K) * 100, cls: 0, label: T("示意性微笑", "illustrative smile") },
      ],
      xmin: 80, xmax: 120, xlabel: T("行权价（30 天，XYZ = 100）", "strike (30 days, XYZ = 100)"), ylabel: T("隐含波动率 %", "implied vol %"), H: 240,
      points: [{ x: kp, y: sp * 100, cls: 2, label: "25Δ P" }, { x: kc, y: sc * 100, cls: 3, label: "25Δ C" }],
    });
  });
}
