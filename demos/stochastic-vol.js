// Main demo for lesson stochastic-vol: a Heston smile generator.
// Heston prices come from the engine (hestonPrice, Fourier integral), then are inverted to Black-Scholes implied vols
// on a coarse grid of 9 strikes. Results are cached by parameter set and recomputed after a short pause in slider input.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let mat = "0.25", timer = null;
  const cache = new Map();
  const S = 100, r = 0.04;
  const presets = {
    equity: { "hv-v0": 20, "hv-th": 20, "hv-k": 2, "hv-xi": 0.5, "hv-rho": -0.7 },
    fx: { "hv-v0": 10, "hv-th": 10, "hv-k": 1.5, "hv-xi": 0.3, "hv-rho": 0 },
    commodity: { "hv-v0": 30, "hv-th": 30, "hv-k": 2, "hv-xi": 0.6, "hv-rho": 0.4 },
    calm: { "hv-v0": 20, "hv-th": 20, "hv-k": 2, "hv-xi": 0.1, "hv-rho": -0.7 },
  };
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("Heston 微笑生成器：五个参数，一条微笑", "Heston smile generator: five parameters, one smile")}</div>
    <div class="demo-row">${seg("hv-T", [["0.0822", T("1 个月", "1 month")], ["0.25", T("3 个月", "3 months")], ["1", T("1 年", "1 year")]], mat)}
      <div class="demo-btns" style="margin:0">
        <button class="demo-btn" data-pre="equity">${T("股指式偏斜", "Equity skew")}</button>
        <button class="demo-btn" data-pre="fx">${T("对称（外汇式）", "Symmetric (FX-like)")}</button>
        <button class="demo-btn" data-pre="commodity">${T("上偏（商品式）", "Upside skew (commodity)")}</button>
        <button class="demo-btn" data-pre="calm">${T("波动率几乎不随机", "Almost constant vol")}</button>
      </div></div>
    <div class="demo-grid">
      ${slider("hv-v0", T("当前波动率 √v₀", "Current vol √v₀"), 5, 60, 1, 20)}
      ${slider("hv-th", T("长期波动率 √θ", "Long-run vol √θ"), 5, 60, 1, 20)}
      ${slider("hv-k", T("均值回归速度 κ", "Mean-reversion speed κ"), 0.2, 6, 0.1, 2)}
      ${slider("hv-xi", T("波动率的波动率 ξ", "Vol of vol ξ"), 0.05, 1.5, 0.05, 0.5)}
      ${slider("hv-rho", T("相关系数 ρ", "Correlation ρ"), -0.95, 0.95, 0.05, -0.7)}
    </div>
    <div class="demo-math" id="hv-f"></div>
    <div id="hv-stats"></div>
    <div id="hv-chart"></div>
    <p class="demo-tip">${T("试试：只动 ρ，微笑整体倾斜；只动 ξ，两翼一起翘起；再在 1 个月和 1 年之间切换——同一组参数，期限越长，微笑越平。", "Try this: move only ρ and the smile tilts; move only ξ and both wings lift; then switch between 1 month and 1 year — the same parameters give a flatter smile at longer maturities.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  let v = {};

  function smile(p, Tm) {
    const key = JSON.stringify([p, Tm]);
    if (cache.has(key)) return cache.get(key);
    const F = S * Math.exp(r * Tm), width = 0.2 * Math.sqrt(Tm / 0.25) * Math.max(0.6, Math.sqrt(p.theta) / 0.2);
    const pts = [];
    for (let i = -4; i <= 4; i++) {
      const K = Math.round(F * Math.exp((i / 2) * width * 0.5) * 100) / 100;
      const type = K >= F ? "call" : "put";
      const price = O.hestonPrice({ S, K, T: Tm, r, q: 0, ...p, type, n: 1200, umax: 200 });
      const iv = O.impliedVol(price, { S, K, T: Tm, r, type });
      if (isFinite(iv)) pts.push([K, iv * 100]);
    }
    const res = { pts, F };
    if (cache.size > 200) cache.clear();
    cache.set(key, res);
    return res;
  }

  function draw() {
    const Tm = +mat;
    const p = { v0: (v["hv-v0"] / 100) ** 2, theta: (v["hv-th"] / 100) ** 2, kappa: v["hv-k"], xi: v["hv-xi"], rho: v["hv-rho"] };
    const { pts, F } = smile(p, Tm);
    const feller = 2 * p.kappa * p.theta > p.xi * p.xi;
    $("#hv-f").innerHTML = tex(String.raw`\dd v_t = ${p.kappa.toFixed(1)}\,\big(${p.theta.toFixed(4)} - v_t\big)\,\dd t + ${p.xi.toFixed(2)}\sqrt{v_t}\,\dd W^{v}_t`, true) + tex(String.raw`\rho = ${p.rho.toFixed(2)}, \quad v_0 = ${p.v0.toFixed(4)}`, true)
      + tex(String.raw`2\kappa\theta = ${(2 * p.kappa * p.theta).toFixed(3)} \;${feller ? ">" : "<"}\; \xi^{2} = ${(p.xi * p.xi).toFixed(3)} \quad (\text{Feller ${feller ? "OK" : "fails"}})`, true);
    if (pts.length < 3) { $("#hv-stats").innerHTML = stats([[T("状态", "Status"), T("价格过小，无法反推隐含波动率", "prices too small to invert")]]); $("#hv-chart").innerHTML = ""; return; }
    const lo = pts[0], hi = pts[pts.length - 1];
    let atm = pts[0];
    for (const q of pts) if (Math.abs(q[0] - F) < Math.abs(atm[0] - F)) atm = q;
    const curv = (lo[1] + hi[1]) / 2 - atm[1];
    $("#hv-stats").innerHTML = stats([
      [T("平值隐含波动率", "ATM implied vol"), atm[1].toFixed(2) + "%", "acc"],
      [T("低行权价 IV", "Low-strike IV") + " (K " + lo[0].toFixed(0) + ")", lo[1].toFixed(2) + "%"],
      [T("高行权价 IV", "High-strike IV") + " (K " + hi[0].toFixed(0) + ")", hi[1].toFixed(2) + "%"],
      [T("偏斜（低 − 高）", "Skew (low − high)"), (lo[1] - hi[1]).toFixed(2) + T(" 点", " pts"), lo[1] > hi[1] ? "neg" : "pos"],
      [T("曲率（两翼均值 − 平值）", "Curvature (wings − ATM)"), curv.toFixed(2) + T(" 点", " pts")],
    ]);
    const flat = Math.sqrt(p.v0) * 100;
    $("#hv-chart").innerHTML = lineChart({
      xmin: lo[0] - 1, xmax: hi[0] + 1, xlabel: T("行权价 K", "Strike K"), ylabel: T("隐含波动率（%）", "Implied vol (%)"),
      series: [
        { points: pts, cls: 0, dots: true, label: T("Heston 隐含波动率", "Heston implied vol") },
        { points: [[lo[0] - 1, flat], [hi[0] + 1, flat]], cls: 5, dashed: true, label: T("Black-Scholes：一个 σ = √v₀", "Black-Scholes: one σ = √v₀") },
      ],
      markers: [{ x: F, label: "F" }],
    });
  }

  const pct = (x) => x + "%";
  const spec = { "hv-v0": pct, "hv-th": pct, "hv-k": (x) => x.toFixed(1), "hv-xi": (x) => x.toFixed(2), "hv-rho": (x) => x.toFixed(2) };
  let first = true;
  const run = bindSliders(root, spec, (vals) => {
    v = vals;
    if (first) { first = false; draw(); return; }
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => { timer = null; if (root.isConnected) draw(); }, 60);
  });
  onSeg(root, "hv-T", (x) => { mat = x; draw(); });
  root.querySelectorAll("[data-pre]").forEach((b) => b.addEventListener("click", () => {
    for (const [id, x] of Object.entries(presets[b.dataset.pre])) $("#" + id).value = x;
    run();
  }));
}
