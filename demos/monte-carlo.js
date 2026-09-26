// Main demo for lesson monte-carlo: a Monte Carlo pricing lab. Pick a payoff (European call/put, digital, arithmetic
// Asian, down-and-out barrier), the number of paths and time steps, antithetic on/off; run; compare with the closed form
// where one exists (Black-Scholes, digital, continuous-barrier formula, geometric-Asian control variate).
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

function geoAsianCall(S, K, T, r, sigma, n) {
  const mu = Math.log(S) + (r - 0.5 * sigma * sigma) * T * (n + 1) / (2 * n);
  const v = sigma * sigma * T * (n + 1) * (2 * n + 1) / (6 * n * n), sv = Math.sqrt(v);
  const d1 = (mu - Math.log(K) + v) / sv, d2 = d1 - sv;
  return Math.exp(-r * T) * (Math.exp(mu + v / 2) * O.normCdf(d1) - K * O.normCdf(d2));
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const r = 0.04, BUDGET = 3e6;
  let kind = "call", paths = 10000, steps = 12, anti = true, seed = 5;

  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("蒙特卡洛定价实验室", "Monte Carlo pricing lab")}</div>
    <div class="demo-row">${seg("mc-kind", [["call", T("欧式看涨", "European call")], ["put", T("欧式看跌", "European put")], ["digital", T("数字看涨（付 1 美元）", "Digital call (pays $1)")], ["asian", T("算术平均亚式看涨", "Arithmetic Asian call")], ["barrier", T("向下敲出看涨", "Down-and-out call")]], kind)}</div>
    <div class="demo-grid">
      ${slider("mc-s", T("现价 S", "Spot S"), 70, 130, 1, 100)}
      ${slider("mc-k", T("行权价 K", "Strike K"), 70, 150, 1, 100)}
      ${slider("mc-v", T("波动率 σ", "Volatility σ"), 10, 60, 1, 20)}
      ${slider("mc-t", T("到期天数", "Days to expiry"), 30, 730, 5, 365)}
      ${slider("mc-h", T("敲出线 H（仅障碍期权）", "Barrier H (barrier only)"), 60, 99, 1, 90)}
    </div>
    <div class="demo-row">
      <span class="demo-label" style="margin:0">${T("路径数 N", "Paths N")}</span>${seg("mc-n", [["1000", "1k"], ["10000", "10k"], ["50000", "50k"], ["200000", "200k"]], paths)}
      <span class="demo-label" style="margin:0">${T("时间步（观察日）", "Time steps (fixings)")}</span>${seg("mc-steps", [["12", "12"], ["52", "52"], ["252", "252"]], steps)}
    </div>
    <div class="demo-row">
      <label class="demo-check"><input type="checkbox" id="mc-anti" checked> ${T("对偶变量（Z 与 −Z 成对）", "Antithetic (pair Z with −Z)")}</label>
      <div class="demo-btns" style="margin:0"><button class="demo-btn on" id="mc-run">${T("运行模拟", "Run simulation")}</button><button class="demo-btn" id="mc-seed">${T("换种子再跑", "New seed and run")}</button></div>
    </div>
    <div class="demo-math" id="mc-f"></div>
    <div id="mc-stats"></div>
    <p class="demo-meta" id="mc-note"></p>
    <div id="mc-conv"></div>
    <div id="mc-paths"></div>
    <p class="demo-tip">${T("试试：欧式看涨从 1k 换到 200k，误差条缩小约 14 倍（√200）。向下敲出看涨用 12 个观察日会明显高于连续监控公式——漏看了两次观察之间的触线；换成 252 步，差距缩小，但加路径数一点用都没有。数字期权的“逐路径 Δ”恒为 0，要用似然比法。", "Try this: switch the European call from 1k to 200k paths and the error bar shrinks about 14× (√200). With 12 fixings the down-and-out call sits well above the continuous-barrier formula — the simulation misses crossings between fixings; 252 steps narrows the gap, while adding paths does nothing for it. For the digital, the pathwise delta is always 0; the likelihood-ratio estimator still works.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const pct = (v) => v + "%";

  function simulate() {
    const S = +$("#mc-s").value, K = +$("#mc-k").value, sigma = +$("#mc-v").value / 100, Tm = +$("#mc-t").value / 365, H = +$("#mc-h").value;
    const df = Math.exp(-r * Tm), pathLike = kind === "asian" || kind === "barrier";
    const nSteps = pathLike ? steps : 1;
    let N = paths; let capped = false;
    if (N * nSteps > BUDGET) { N = Math.max(1000, Math.floor(BUDGET / nSteps / 1000) * 1000); capped = true; }
    const R = O.rng(seed), dt = Tm / nSteps, a = (r - 0.5 * sigma * sigma) * dt, b = sigma * Math.sqrt(dt);
    const t0 = (typeof performance !== "undefined" ? performance.now() : Date.now());
    // payoff of one path from a vector of normals (sign = ±1 for antithetic); returns [discounted payoff, pathwise Δ, LR Δ, cv]
    const z = new Float64Array(nSteps);
    const one = (sgn) => {
      let s = S, sum = 0, ls = 0, alive = true, W = 0;
      for (let i = 0; i < nSteps; i++) { const e = sgn * z[i]; W += e; s *= Math.exp(a + b * e); sum += s; ls += Math.log(s); if (s <= H) alive = false; }
      const lr = W * Math.sqrt(dt) / (S * sigma * Tm); // score for dS0 (likelihood ratio)
      if (kind === "call") return [df * Math.max(s - K, 0), df * (s > K ? s / S : 0), df * Math.max(s - K, 0) * lr, 0];
      if (kind === "put") return [df * Math.max(K - s, 0), -df * (s < K ? s / S : 0), df * Math.max(K - s, 0) * lr, 0];
      if (kind === "digital") return [df * (s > K ? 1 : 0), 0, df * (s > K ? 1 : 0) * lr, 0];
      if (kind === "asian") return [df * Math.max(sum / nSteps - K, 0), 0, 0, df * Math.max(Math.exp(ls / nSteps) - K, 0)];
      return [alive && S > H ? df * Math.max(s - K, 0) : 0, 0, 0, 0];
    };
    let n = 0, mean = 0, m2 = 0, pw = 0, lrs = 0, lr2 = 0, pw2 = 0, cvx = 0, cvxx = 0, cvxy = 0;
    const conv = []; let mark = 100;
    const units = anti ? Math.floor(N / 2) : N;
    const Ys = kind === "asian" ? new Float64Array(units) : null, Xs = kind === "asian" ? new Float64Array(units) : null;
    for (let u = 0; u < units; u++) {
      for (let i = 0; i < nSteps; i++) z[i] = R.normal();
      let v = one(1);
      if (anti) { const w = one(-1); v = v.map((x, k) => 0.5 * (x + w[k])); }
      n++; const d = v[0] - mean; mean += d / n; m2 += d * (v[0] - mean);
      pw += v[1]; pw2 += v[1] * v[1]; lrs += v[2]; lr2 += v[2] * v[2];
      if (Ys) { Ys[u] = v[0]; Xs[u] = v[3]; cvx += v[3]; }
      const evals = anti ? 2 * n : n;
      if (evals >= mark) { conv.push([Math.log10(evals), mean, Math.sqrt(m2 / Math.max(n - 1, 1) / n)]); mark = Math.ceil(mark * 1.25); }
    }
    const se = Math.sqrt(m2 / Math.max(n - 1, 1) / n);
    const ms = ((typeof performance !== "undefined" ? performance.now() : Date.now()) - t0);
    let ref = null, refLabel = "", refPlain = "", cv = null;
    if (kind === "call" || kind === "put") { ref = O.bsPrice({ S, K, T: Tm, r, sigma, type: kind }); refLabel = refPlain = T("BS 公式", "BS formula"); }
    if (kind === "digital") { ref = df * O.normCdf(O.d1d2({ S, K, T: Tm, r, sigma }).d2); refLabel = T("公式 ", "Formula ") + tex(String.raw`e^{-rT}\N(d_2)`); refPlain = T("公式", "Formula"); }
    if (kind === "barrier") { ref = K > H ? O.downOutCall({ S, K, H, T: Tm, r, sigma }) : null; refLabel = refPlain = T("连续监控公式", "Continuous-barrier formula"); }
    if (kind === "asian") {
      const G = geoAsianCall(S, K, Tm, r, sigma, nSteps); const mx = cvx / n;
      let sxy = 0, sxx = 0; for (let u = 0; u < n; u++) { sxy += (Ys[u] - mean) * (Xs[u] - mx); sxx += (Xs[u] - mx) ** 2; }
      const beta = sxx > 0 ? sxy / sxx : 0; let vv = 0; const vals = new Float64Array(n);
      for (let u = 0; u < n; u++) vals[u] = Ys[u] - beta * (Xs[u] - G);
      const cm = mean - beta * (mx - G); for (let u = 0; u < n; u++) vv += (vals[u] - cm) ** 2;
      cv = { price: cm, se: Math.sqrt(vv / Math.max(n - 1, 1) / n), beta, G };
      ref = cm; refLabel = refPlain = T("控制变量估计", "Control-variate estimate");
    }
    return { S, K, sigma, Tm, H, N: anti ? 2 * n : n, capped, nSteps, mean, se, ms, ref, refLabel, refPlain, cv, conv,
      pw: pw / n, pwSe: Math.sqrt(Math.max(pw2 / n - (pw / n) ** 2, 0) / n), lr: lrs / n, lrSe: Math.sqrt(Math.max(lr2 / n - (lrs / n) ** 2, 0) / n), df };
  }

  function render() {
    const res = simulate();
    const { S, K, sigma, Tm, H, mean, se, ref } = res;
    const names = { call: String.raw`\max(S_T-K,0)`, put: String.raw`\max(K-S_T,0)`, digital: String.raw`\mathbf{1}_{S_T>K}`, asian: String.raw`\max\!\big(\tfrac{1}{m}\textstyle\sum_{j} S_{t_j}-K,\,0\big)`, barrier: String.raw`\max(S_T-K,0)\,\mathbf{1}_{\min_j S_{t_j} > H}` };
    $("#mc-f").innerHTML = tex(String.raw`\hat V = e^{-rT}\,\frac{1}{N}\sum_{i=1}^{N} ${names[kind]}`, true) + tex(String.raw`= ${mean.toFixed(4)} \pm ${se.toFixed(4)} \quad (N = ${res.N.toLocaleString("en-US").replace(/,/g, "{,}")})`, true);
    const inCI = ref != null && kind !== "asian" && kind !== "barrier" ? Math.abs(mean - ref) <= 1.96 * se : null;
    const items = [
      [T("蒙特卡洛估计", "Monte Carlo estimate"), "$" + mean.toFixed(4), "acc"],
      [T("标准误 SE", "Standard error"), "±" + se.toFixed(4)],
      [T("95% 区间", "95% interval"), `${(mean - 1.96 * se).toFixed(3)} – ${(mean + 1.96 * se).toFixed(3)}`],
    ];
    if (ref != null) items.push([res.refLabel, "$" + ref.toFixed(4) + (res.cv ? " ± " + res.cv.se.toFixed(4) : ""), inCI === false ? "neg" : inCI ? "pos" : ""]);
    if (kind === "call" || kind === "put") { const g = O.greeks({ S, K, T: Tm, r, sigma, type: kind }); items.push([T("逐路径 Δ（BS Δ）", "Pathwise Δ (BS Δ)"), `${res.pw.toFixed(3)} ± ${res.pwSe.toFixed(3)} (${g.delta.toFixed(3)})`]); }
    if (kind === "digital") { const d2 = O.d1d2({ S, K, T: Tm, r, sigma }).d2; const exact = res.df * O.normPdf(d2) / (S * sigma * Math.sqrt(Tm)); items.push([T("Δ：逐路径 / 似然比（精确）", "Δ: pathwise / likelihood ratio (exact)"), `0 / ${res.lr.toFixed(4)} ± ${res.lrSe.toFixed(4)} (${exact.toFixed(4)})`]); }
    items.push([T("耗时", "Time"), res.ms.toFixed(0) + " ms"]);
    $("#mc-stats").innerHTML = stats(items);
    let note = "";
    if (res.capped) note += T(`为保持流畅，路径数 × 步数上限约 300 万，这次只跑了 ${res.N.toLocaleString("en-US")} 条路径。`, `To stay responsive, paths × steps is capped at about 3 million; this run used ${res.N.toLocaleString("en-US")} paths. `);
    if (kind === "barrier") note += K > H ? T(`模拟只在 ${res.nSteps} 个观察日检查是否触线；公式假设连续监控，所以模拟价偏高 ${(mean - ref).toFixed(3)}。这是离散化偏差，加路径不会让它消失。`, `The simulation checks the barrier only on ${res.nSteps} fixings; the formula assumes continuous monitoring, so the simulated price is higher by ${(mean - ref).toFixed(3)}. That is discretisation bias — more paths will not remove it.`) : T("此处需要 K > H 才有公式可比。", "The closed form here needs K > H.");
    if (kind === "asian" && res.cv) note += T(`控制变量：几何平均亚式公式价 ${res.cv.G.toFixed(4)}，β = ${res.cv.beta.toFixed(3)}；同样的路径，标准误从 ${se.toFixed(4)} 降到 ${res.cv.se.toFixed(4)}。`, `Control variate: geometric-Asian formula ${res.cv.G.toFixed(4)}, β = ${res.cv.beta.toFixed(3)}; on the same paths the standard error falls from ${se.toFixed(4)} to ${res.cv.se.toFixed(4)}.`);
    if (inCI === false) note += T(" 这次公式价落在 95% 区间外——20 次里约有 1 次会这样，换种子再跑看看。", " This time the formula lies outside the 95% interval — expect that about once in twenty runs; try a new seed.");
    $("#mc-note").textContent = note;
    const c = res.conv;
    const lo = Math.min(...c.map((x) => x[1] - 2 * x[2]), ref ?? Infinity), hi = Math.max(...c.map((x) => x[1] + 2 * x[2]), ref ?? -Infinity);
    const span = Math.max(hi - lo, 1e-6);
    $("#mc-conv").innerHTML = lineChart({
      xmin: 2, xmax: Math.max(3, Math.log10(res.N)), ymin: lo - span * 0.05, ymax: hi + span * 0.05, xstep: 1,
      xlabel: T("已用路径数（对数刻度）", "Paths used so far (log scale)"), ylabel: T("估计值", "Estimate"),
      xfmt: (v) => { const x = 10 ** v; return x >= 1000 ? x / 1000 + "k" : String(x); }, yfmt: (v) => (+v.toPrecision(4)).toString(),
      series: [
        { points: c.map(([x, m, s]) => [x, m + 1.96 * s]), cls: 5, dashed: true, label: "± 1.96 SE" },
        { points: c.map(([x, m, s]) => [x, m - 1.96 * s]), cls: 5, dashed: true },
        { points: c.map(([x, m]) => [x, m]), cls: 0, label: T("累计估计", "Running estimate") },
      ],
      hlines: ref != null ? [{ y: ref, label: res.refPlain }] : [],
    });
    // a few sample paths
    const R = O.rng(seed + 1), ns = 52, dt = Tm / ns, pts = [];
    for (let p = 0; p < 16; p++) { let s = S; const row = [[0, s]]; for (let i = 1; i <= ns; i++) { s *= Math.exp((r - 0.5 * sigma * sigma) * dt + sigma * Math.sqrt(dt) * R.normal()); row.push([i * dt * 365, s]); } pts.push(row); }
    const hl = [{ y: K, label: "K" }]; if (kind === "barrier") hl.push({ y: H, label: "H" });
    $("#mc-paths").innerHTML = lineChart({
      xmin: 0, xmax: Tm * 365, H: 220, xlabel: T("天数", "Days"), ylabel: T("风险中性路径（示意 16 条）", "Risk-neutral paths (16 shown)"),
      series: pts.map((row, k) => ({ points: row, cls: k === 0 ? 0 : 5 })), hlines: hl, yfmt: (v) => "$" + v,
    });
  }

  let ready = false;
  const stale = () => { if (ready) $("#mc-note").textContent = T("设置已改变——按“运行模拟”更新结果。", "Settings changed — press Run simulation to update the results."); };
  bindSliders(root, { "mc-s": (v) => "$" + v, "mc-k": (v) => "$" + v, "mc-v": pct, "mc-t": (v) => v + T(" 天", " days"), "mc-h": (v) => "$" + v }, stale);
  onSeg(root, "mc-kind", (v) => { kind = v; render(); });
  onSeg(root, "mc-n", (v) => { paths = +v; stale(); });
  onSeg(root, "mc-steps", (v) => { steps = +v; stale(); });
  $("#mc-anti").addEventListener("change", (e) => { anti = e.target.checked; stale(); });
  $("#mc-run").addEventListener("click", render);
  $("#mc-seed").addEventListener("click", () => { seed = (seed * 48271 + 11) % 2147483647; render(); });
  render();
  ready = true;
}
