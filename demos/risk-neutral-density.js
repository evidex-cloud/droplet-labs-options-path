// Main demo for lesson risk-neutral-density: shape an SVI smile, price every strike, and read the
// Breeden–Litzenberger density f(K) = e^{rT} ∂²C/∂K² against the flat-vol lognormal.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S = 100, r = 0.04;
  let days = 30, mShift = 0.01; // m (30-day units): 0.01 reproduces the smile of lesson smile-skew
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("从微笑到概率分布：Breeden–Litzenberger 实验台", "From smile to distribution: a Breeden–Litzenberger bench")}</div>
    <div class="demo-row">${seg("rnd-days", [[7, T("7 天", "7 days")], [30, T("30 天", "30 days")], [90, T("90 天", "90 days")]], days)}</div>
    <div class="demo-btns">
      <button class="demo-btn" data-preset="lesson">${T("本课的股票偏斜", "The lesson's equity skew")}</button>
      <button class="demo-btn" data-preset="flat">${T("平坦 20%", "Flat 20%")}</button>
      <button class="demo-btn" data-preset="crash">${T("陡峭的崩盘偏斜", "Steep crash skew")}</button>
      <button class="demo-btn" data-preset="smile">${T("对称微笑（外汇式）", "Symmetric smile (FX-like)")}</button>
      <button class="demo-btn" data-preset="arb">${T("有套利的微笑", "An arbitrageable smile")}</button>
    </div>
    <div class="demo-grid">
      ${slider("rnd-atm", T("平值波动率（100 行权价）", "ATM vol (100 strike)"), 8, 60, 0.5, 20)}
      ${slider("rnd-rho", T("偏斜 ρ（负 = 左边更高）", "Skew ρ (negative = left side higher)"), -0.95, 0.95, 0.05, -0.8)}
      ${slider("rnd-b", T("两翼斜率 b（30 天单位）", "Wing slope b (30-day units)"), 0, 0.08, 0.001, 0.012)}
      ${slider("rnd-s", T("底部圆滑度 s（30 天单位）", "Bottom roundness s (30-day units)"), 0.002, 0.2, 0.001, 0.05)}
      ${slider("rnd-lo", T("区间下限 a", "Range low a"), 70, 100, 1, 95)}
      ${slider("rnd-hi", T("区间上限 b", "Range high b"), 100, 130, 1, 105)}
    </div>
    <div class="demo-math" id="rnd-f"></div>
    <div id="rnd-stats"></div>
    <div id="rnd-warn"></div>
    <div class="demo-grid">
      <div id="rnd-smile"></div>
      <div id="rnd-dens"></div>
    </div>
    <p class="demo-tip">${T("试试：把 ρ 从 0 拉到 −0.9，看左尾怎样变肥、峰值怎样右移，而均值一直停在远期价；再点“有套利的微笑”，看密度在哪里跌破零。", "Try this: drag ρ from 0 to −0.9 and watch the left tail fatten and the peak slide right while the mean stays at the forward; then press “An arbitrageable smile” and see where the density dips below zero.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const Tm = days / 365, F = O.forward(S, Tm, r), D = Math.exp(r * Tm);
    // b and s are entered in 30-day units and scaled with √T so one set of sliders gives a sensible smile at every tenor
    const sc = Math.sqrt(Tm / (30 / 365));
    const atm = v["rnd-atm"] / 100, rho = v["rnd-rho"], b = v["rnd-b"] * sc, s = v["rnd-s"] * sc, m = mShift * sc;
    // a is chosen so that the 100 strike carries the ATM vol (as in lesson smile-skew)
    const k0 = Math.log(S / F), a = atm * atm * Tm - b * (rho * (k0 - m) + Math.sqrt((k0 - m) ** 2 + s * s));
    const p = { a, b, rho, m, s };
    const vol = (K) => O.sviVol(Math.log(K / F), Tm, p);
    const call = (K) => O.bsPrice({ S, K, T: Tm, r, sigma: Math.max(vol(K), 1e-4), type: "call" });
    const width = Math.max(12, 5 * atm * Math.sqrt(Tm) * 100);
    const lo = Math.max(1, F - width * 1.3), hi = F + width;
    const step = (hi - lo) / 200, h = step / 2;
    const dens = [], logn = [];
    let minD = Infinity, minAt = F;
    for (let K = lo; K <= hi + 1e-9; K += step) {
      const f = O.rndFromCalls(call, K, Tm, r, h);
      dens.push([K, f]); logn.push([K, O.lognormalPdf(K, S, Tm, atm, r)]);
      if (f < minD) { minD = f; minAt = K; }
    }
    // mass and mean on a wider, hidden grid so the tails are not cut off
    let mass = 0, mean = 0;
    const wlo = F * 0.35, whi = F * 1.9, wst = (whi - wlo) / 600;
    for (let K = wlo; K <= whi + 1e-9; K += wst) { const f = O.rndFromCalls(call, K, Tm, r, wst / 2); mass += f * wst; mean += K * f * wst; }
    const above = (K) => -(call(K + 0.01) - call(K - 0.01)) / 0.02 * D;
    const aK = Math.min(v["rnd-lo"], v["rnd-hi"] - 1), bK = Math.max(v["rnd-hi"], aK + 1);
    const qRange = above(aK) - above(bK);
    const flatAbove = (K) => O.probAbove(S, K, Tm, atm, r);
    const qRangeFlat = flatAbove(aK) - flatAbove(bK);
    const q90 = 1 - above(S * 0.9), q90f = 1 - flatAbove(S * 0.9);
    let minG = Infinity; for (let k = -0.4; k <= 0.3; k += 0.005) { const g = O.sviG(k, p); minG = Math.min(minG, isFinite(g) ? g : -1); }
    $("#rnd-f").innerHTML = tex(String.raw`f_{\Q}(K) \approx e^{rT}\,\frac{C(K-h) - 2C(K) + C(K+h)}{h^2}`, true) +
      tex(String.raw`\Q(${aK} < S_T < ${bK}) = e^{rT}\big[C'(${bK}) - C'(${aK})\big] = ${(qRange * 100).toFixed(1)}\%`, true);
    $("#rnd-stats").innerHTML = stats([
      [T("区间概率（微笑）", "Range prob. (smile)"), (qRange * 100).toFixed(1) + "%", "acc"],
      [T("区间概率（平坦）", "Range prob. (flat)"), (qRangeFlat * 100).toFixed(1) + "%"],
      [T("Q(S_T < 90)：微笑", "Q(S_T < 90): smile"), (q90 * 100).toFixed(1) + "%", q90 > q90f ? "neg" : ""],
      [T("Q(S_T < 90)：平坦", "Q(S_T < 90): flat"), (q90f * 100).toFixed(1) + "%"],
      [T("总概率（应 ≈ 100%）", "Total mass (should ≈ 100%)"), (mass * 100).toFixed(1) + "%"],
      [T("均值（远期价 ", "Mean (forward ") + F.toFixed(2) + T("）", ")"), mean.toFixed(2)],
      [T("90 看跌价格", "90 put price"), "$" + O.bsPrice({ S, K: 90, T: Tm, r, sigma: Math.max(vol(90), 1e-4), type: "put" }).toFixed(2)],
    ]);
    $("#rnd-warn").innerHTML = minD < -1e-4 || minG < 0 || a < 0
      ? `<div class="demo-warn">${T("这条微笑不是无套利的：", "This smile is not arbitrage-free: ")}${minD < -1e-4 ? T("密度在 ", "the density goes negative near ") + minAt.toFixed(1) + T(" 附近为负（那里的蝶式价格小于零）。", " (butterflies there cost less than zero).") : ""}${minG < 0 ? T(" Gatheral–Jacquier 条件 g(k) 的最小值为 ", " The Gatheral–Jacquier function g(k) reaches ") + minG.toFixed(2) + T("。", ".") : ""}${a < 0 ? T(" 参数 a < 0，远处的总方差可能为负。", " Parameter a < 0: total variance can turn negative far out.") : ""}</div>`
      : `<p class="demo-meta">${T("无套利检查通过：蝶式价格处处非负（g(k) 最小值 ", "No-arbitrage check passed: butterflies non-negative everywhere (min g(k) = ")}${minG.toFixed(2)}${T("）。", ").")}</p>`;
    const smile = []; for (let K = lo; K <= hi + 1e-9; K += step * 4) smile.push([K, vol(K) * 100]);
    $("#rnd-smile").innerHTML = lineChart({
      series: [{ points: smile, cls: 2, label: T("SVI 微笑", "SVI smile") }, { points: [[lo, atm * 100], [hi, atm * 100]], cls: 5, dashed: true, label: T("平坦", "flat") }],
      xmin: lo, xmax: hi, H: 220, W: 320, xlabel: T("行权价", "strike"), yfmt: (y) => y.toFixed(0) + "%", markers: [{ x: F, label: "F" }],
    });
    $("#rnd-dens").innerHTML = lineChart({
      series: [{ points: dens, cls: 2, label: T("隐含密度", "implied density"), area: true }, { points: logn, cls: 5, dashed: true, label: T("对数正态", "lognormal") }],
      xmin: lo, xmax: hi, H: 220, W: 320, xlabel: T("到期股价", "price at expiry"), yfmt: (y) => y.toFixed(3),
      bands: [{ x0: aK, x1: bK, cls: 0 }], markers: [{ x: F, label: "F" }],
    });
  };
  const spec = { "rnd-atm": (x) => (+x).toFixed(1) + "%", "rnd-rho": (x) => (+x).toFixed(2), "rnd-b": (x) => (+x).toFixed(3), "rnd-s": (x) => (+x).toFixed(3), "rnd-lo": (x) => "$" + x, "rnd-hi": (x) => "$" + x };
  const run = bindSliders(root, spec, draw);
  onSeg(root, "rnd-days", (d) => { days = +d; run(); });
  const set = (vals) => { for (const [id, x] of Object.entries(vals)) $("#" + id).value = x; run(); };
  root.querySelectorAll("[data-preset]").forEach((btn) => btn.addEventListener("click", () => {
    const k = btn.dataset.preset;
    mShift = k === "lesson" ? 0.01 : 0;
    if (k === "lesson") set({ "rnd-atm": 20, "rnd-rho": -0.8, "rnd-b": 0.012, "rnd-s": 0.05 });
    else if (k === "flat") set({ "rnd-atm": 20, "rnd-rho": 0, "rnd-b": 0, "rnd-s": 0.05 });
    else if (k === "crash") set({ "rnd-atm": 20, "rnd-rho": -0.8, "rnd-b": 0.035, "rnd-s": 0.04 });
    else if (k === "smile") set({ "rnd-atm": 20, "rnd-rho": 0, "rnd-b": 0.02, "rnd-s": 0.08 });
    else set({ "rnd-atm": 12, "rnd-rho": -0.95, "rnd-b": 0.08, "rnd-s": 0.004 });
  }));
}
