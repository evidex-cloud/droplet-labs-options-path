// Inline demo for lesson surface-calibration: move the five raw-SVI parameters and watch the butterfly-arbitrage
// function g(k) (Gatheral–Jacquier) and the implied risk-neutral density. Preset: Vogt's example with g < 0.
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const presets = {
    eq: { "sg-a": 0.02, "sg-b": 0.1, "sg-r": -0.5, "sg-m": 0.05, "sg-s": 0.2 },
    vogt: { "sg-a": -0.041, "sg-b": 0.133, "sg-r": 0.306, "sg-m": 0.359, "sg-s": 0.415 },
  };
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("SVI 的五个旋钮与蝶式套利检查 g(k)", "Five SVI knobs and the butterfly check g(k)")}</div>
    <div class="demo-btns"><button class="demo-btn" data-pre="eq">${T("股票式切片（无套利）", "Equity-like slice (arbitrage-free)")}</button><button class="demo-btn" data-pre="vogt">${T("Vogt 的例子（有套利）", "Vogt's example (arbitrage)")}</button></div>
    <div class="demo-grid">
      ${slider("sg-a", T("a：整体水平", "a: level"), -0.06, 0.1, 0.001, 0.02)}
      ${slider("sg-b", T("b：两翼张开", "b: wing opening"), 0.01, 0.5, 0.001, 0.1)}
      ${slider("sg-r", T("ρ：旋转/偏斜", "ρ: rotation / skew"), -0.95, 0.95, 0.001, -0.5)}
      ${slider("sg-m", T("m：左右平移", "m: shift"), -0.5, 0.5, 0.001, 0.05)}
      ${slider("sg-s", T("s：顶点圆滑度", "s: smoothness of the vertex"), 0.01, 0.8, 0.001, 0.2)}
    </div>
    <div class="demo-math" id="sg-f"></div>
    <div id="sg-stats"></div>
    <div id="sg-c1"></div>
    <div id="sg-c2"></div>
    <p class="demo-tip">${T("看什么：按“Vogt 的例子”，总方差曲线看上去平平无奇，g(k) 却在 k ≈ 0.65 到 1.25 之间跌到零下——那里的隐含密度为负，买一组蝶式就能白赚。再慢慢加大 s 或减小 b，看 g 何时回到零以上。", "What to notice: press “Vogt's example” — the total-variance curve looks innocent, yet g(k) dips below zero between k ≈ 0.65 and 1.25, where the implied density is negative and a butterfly would be free money. Then raise s or lower b slowly and see when g recovers.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const f3 = (x) => x.toFixed(3);
  const run = bindSliders(root, { "sg-a": f3, "sg-b": f3, "sg-r": f3, "sg-m": f3, "sg-s": f3 }, (v) => {
    const p = { a: v["sg-a"], b: v["sg-b"], rho: v["sg-r"], m: v["sg-m"], s: v["sg-s"] };
    const minVar = p.a + p.b * p.s * Math.sqrt(1 - p.rho * p.rho);
    let gmin = Infinity, kg = 0, negLo = null, negHi = null;
    for (let k = -1.5; k <= 1.5001; k += 0.005) {
      const g = O.sviW(k, p) > 0 ? O.sviG(k, p) : -1;
      if (g < gmin) { gmin = g; kg = k; }
      if (g < 0) { if (negLo === null) negLo = k; negHi = k; }
    }
    const wl = p.b * (1 - p.rho), wr = p.b * (1 + p.rho);
    $("#sg-f").innerHTML = tex(String.raw`g(k) = \Big(1 - \frac{k\,w'}{2w}\Big)^{2} - \frac{w'^{2}}{4}\Big(\frac{1}{w} + \frac14\Big) + \frac{w''}{2} \;\ge\; 0`, true) + tex(String.raw`\min_k g = ${gmin.toFixed(4)} \text{ at } k = ${kg.toFixed(2)}`, true);
    $("#sg-stats").innerHTML = stats([
      [T("蝶式检查", "Butterfly check"), gmin >= 0 ? T("✓ 通过", "✓ passes") : T("✗ g < 0：", "✗ g < 0: ") + negLo.toFixed(2) + " … " + negHi.toFixed(2), gmin >= 0 ? "pos" : "neg"],
      [T("最小总方差 a + bs√(1−ρ²)", "Min total variance a + bs√(1−ρ²)"), minVar.toFixed(4), minVar >= 0 ? "" : "neg"],
      [T("左翼斜率 b(1−ρ)", "Left wing slope b(1−ρ)"), wl.toFixed(3), wl <= 2 ? "" : "neg"],
      [T("右翼斜率 b(1+ρ)", "Right wing slope b(1+ρ)"), wr.toFixed(3), wr <= 2 ? "" : "neg"],
      [T("平值波动率（T = 1）", "ATM vol (T = 1)"), (Math.sqrt(Math.max(O.sviW(0, p), 0)) * 100).toFixed(1) + "%"],
    ]);
    const bands = negLo !== null ? [{ x0: negLo, x1: negHi, cls: 2, label: T("g < 0", "g < 0") }] : [];
    $("#sg-c1").innerHTML = lineChart({
      xmin: -1.5, xmax: 1.5, H: 210, xlabel: T("对数价内程度 k", "Log-moneyness k"), ylabel: T("总方差 w(k)", "Total variance w(k)"), yfmt: (x) => x.toFixed(2),
      series: [{ f: (k) => O.sviW(k, p), cls: 0, label: "w(k)" }], bands,
    });
    $("#sg-c2").innerHTML = lineChart({
      xmin: -1.5, xmax: 1.5, H: 210, xlabel: T("对数价内程度 k", "Log-moneyness k"), ylabel: "g(k)",
      series: [{ f: (k) => (O.sviW(k, p) > 0 ? Math.max(-0.5, Math.min(2, O.sviG(k, p))) : NaN), cls: gmin >= 0 ? 3 : 2, label: T("g(k)，必须 ≥ 0", "g(k), must be ≥ 0") }],
      hlines: [{ y: 0, label: "0" }], bands,
    });
  });
  root.querySelectorAll("[data-pre]").forEach((b) => b.addEventListener("click", () => {
    for (const [id, x] of Object.entries(presets[b.dataset.pre])) $("#" + id).value = x;
    run();
  }));
}
