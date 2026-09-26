// Inline demo for lesson monte-carlo: variance reduction you can see. Run 30 independent Monte Carlo estimates per method
// and compare the spread. Case 1: arithmetic-average Asian call (12 monthly fixings) — plain vs antithetic vs control
// variate (the discrete geometric-average Asian, which has a closed form; implemented locally). Case 2: deep OTM 150 call —
// plain vs importance sampling (shift the normal draws to the strike, reweight by the likelihood ratio).
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

// Discrete geometric-average Asian call, n equally spaced fixings t_i = iT/n (closed form: the log of the average is normal)
export function geoAsianCall(S, K, T, r, sigma, n) {
  const mu = Math.log(S) + (r - 0.5 * sigma * sigma) * T * (n + 1) / (2 * n);
  const v = sigma * sigma * T * (n + 1) * (2 * n + 1) / (6 * n * n), sv = Math.sqrt(v);
  const d1 = (mu - Math.log(K) + v) / sv, d2 = d1 - sv;
  return Math.exp(-r * T) * (Math.exp(mu + v / 2) * O.normCdf(d1) - K * O.normCdf(d2));
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S0 = 100, Tm = 1, r = 0.04, sigma = 0.2, nFix = 12, df = Math.exp(-r * Tm);
  const REPS = 30;
  let mode = "asian", seedBase = 1, refAsian = null;

  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("方差缩减：同样的路径数，更窄的散布", "Variance reduction: same number of paths, tighter spread")}</div>
    <div class="demo-row">${seg("mcv-mode", [["asian", T("亚式看涨 · 控制变量", "Asian call · control variate")], ["otm", T("深度虚值 150 看涨 · 重要性抽样", "Deep OTM 150 call · importance sampling")]], mode)}</div>
    <div class="demo-grid">${slider("mcv-n", T("每次估计用的路径数 N", "Paths per estimate N"), 500, 10000, 500, 1000)}
      <div class="demo-field"><div class="demo-btns" style="margin:18px 0 0"><button class="demo-btn on" id="mcv-run">${T("再跑 30 次", "Run 30 more estimates")}</button></div></div></div>
    <div class="demo-math" id="mcv-f"></div>
    <div id="mcv-chart"></div>
    <div id="mcv-stats"></div>
    <p class="demo-tip">${T("看什么：每一行是 30 个互相独立的估计。控制变量那一行几乎缩成一个点——几何平均亚式期权有公式，它的“抽样误差”告诉我们算术平均亚式的误差有多大，减掉就行。重要性抽样把一半路径送进实值区，所以同样 N 下误差小得多。", "What to notice: each row is 30 independent estimates. The control-variate row collapses almost to a point — the geometric Asian has a formula, so its sampling error tells us the arithmetic Asian's error, and we subtract it. Importance sampling sends half the paths into the money, so the same N gives a much smaller error.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);

  const meanSd = (a) => { const m = a.reduce((x, y) => x + y, 0) / a.length; const v = a.reduce((x, y) => x + (y - m) ** 2, 0) / (a.length - 1); return [m, Math.sqrt(v)]; };

  // one Asian run: returns plain, antithetic (same number of payoff evaluations), control-variate estimates and in-sample stats
  const geo = geoAsianCall(S0, 100, Tm, r, sigma, nFix);
  function asianRun(N, seed, withAnti = true) {
    const R = O.rng(seed), dt = Tm / nFix, a = (r - 0.5 * sigma * sigma) * dt, b = sigma * Math.sqrt(dt);
    const Y = new Float64Array(N), X = new Float64Array(N);
    for (let p = 0; p < N; p++) {
      let s = S0, sum = 0, ls = 0;
      for (let i = 0; i < nFix; i++) { s *= Math.exp(a + b * R.normal()); sum += s; ls += Math.log(s); }
      Y[p] = df * Math.max(sum / nFix - 100, 0); X[p] = df * Math.max(Math.exp(ls / nFix) - 100, 0);
    }
    let my = 0, mx = 0; for (let p = 0; p < N; p++) { my += Y[p]; mx += X[p]; } my /= N; mx /= N;
    let cxy = 0, vx = 0, vy = 0; for (let p = 0; p < N; p++) { cxy += (Y[p] - my) * (X[p] - mx); vx += (X[p] - mx) ** 2; vy += (Y[p] - my) ** 2; }
    const beta = cxy / vx, rho = cxy / Math.sqrt(vx * vy);
    const cv = my - beta * (mx - geo);
    // antithetic: N/2 pairs (Z, −Z) → N payoff evaluations
    const R2 = O.rng(seed + 7777); let anti = 0; const half = withAnti ? Math.max(1, Math.floor(N / 2)) : 1, z = new Float64Array(nFix);
    for (let p = 0; p < half; p++) {
      for (let i = 0; i < nFix; i++) z[i] = R2.normal();
      let s1 = S0, s2 = S0, u1 = 0, u2 = 0;
      for (let i = 0; i < nFix; i++) { s1 *= Math.exp(a + b * z[i]); s2 *= Math.exp(a - b * z[i]); u1 += s1; u2 += s2; }
      anti += 0.5 * df * (Math.max(u1 / nFix - 100, 0) + Math.max(u2 / nFix - 100, 0));
    }
    return { plain: my, anti: anti / half, cv, beta, rho };
  }
  // deep OTM call, one step: plain vs importance sampling with mean shift theta
  const K2 = 150, bsOTM = O.bsPrice({ S: S0, K: K2, T: Tm, r, sigma, type: "call" });
  const theta = (Math.log(K2 / S0) - (r - 0.5 * sigma * sigma) * Tm) / (sigma * Math.sqrt(Tm));
  function otmRun(N, seed) {
    const R = O.rng(seed), dr = (r - 0.5 * sigma * sigma) * Tm, v = sigma * Math.sqrt(Tm);
    let pl = 0, is = 0, hitP = 0, hitI = 0;
    for (let i = 0; i < N; i++) {
      const z = R.normal(); const a = Math.max(S0 * Math.exp(dr + v * z) - K2, 0); pl += a; if (a > 0) hitP++;
      const y = z + theta; const w = Math.exp(-theta * y + 0.5 * theta * theta); const c = Math.max(S0 * Math.exp(dr + v * y) - K2, 0) * w; is += c; if (c > 0) hitI++;
    }
    return { plain: df * pl / N, is: df * is / N, hitP: hitP / N, hitI: hitI / N };
  }

  const run = () => {
    const N = +$("#mcv-n").value;
    seedBase += REPS * 3;
    let rows, ref, f, extra;
    if (mode === "asian") {
      if (refAsian === null) refAsian = asianRun(10000, 99991, false).cv; // tight reference, computed once
      const res = Array.from({ length: REPS }, (_, k) => asianRun(N, seedBase + k));
      rows = [
        [T("普通", "plain"), res.map((x) => x.plain), 5],
        [T("对偶", "antithetic"), res.map((x) => x.anti), 1],
        [T("控制变量", "control variate"), res.map((x) => x.cv), 0],
      ];
      ref = refAsian;
      const beta = res.reduce((s, x) => s + x.beta, 0) / REPS, rho = res.reduce((s, x) => s + x.rho, 0) / REPS;
      f = [String.raw`\hat V_{\text{CV}} = \bar Y - \beta\,\big(\bar X - \underbrace{${geo.toFixed(3)}}_{\text{${T("几何平均公式", "geometric formula")}}}\big)`, String.raw`\beta \approx ${beta.toFixed(3)},\quad \rho \approx ${rho.toFixed(4)} \ \Rightarrow\ \frac{1}{1-\rho^2} \approx ${(1 / (1 - rho * rho)).toFixed(0)}`];
      extra = T(`参考值 ≈ ${ref.toFixed(3)}（1 万条路径的控制变量估计）`, `Reference ≈ ${ref.toFixed(3)} (control-variate run with 10,000 paths)`);
    } else {
      const res = Array.from({ length: REPS }, (_, k) => otmRun(N, seedBase + k));
      rows = [
        [T("普通", "plain"), res.map((x) => x.plain), 5],
        [T("重要性抽样", "importance"), res.map((x) => x.is), 0],
      ];
      ref = bsOTM;
      const hp = res.reduce((s, x) => s + x.hitP, 0) / REPS, hi = res.reduce((s, x) => s + x.hitI, 0) / REPS;
      f = [String.raw`\E\big[g(Z)\big] = \E\Big[g(Z+\theta)\,e^{-\theta (Z+\theta) + \frac12\theta^2}\Big],\quad \theta = ${theta.toFixed(3)}`, String.raw`\text{${T("实值路径占比：", "ITM share: ")}} ${(hp * 100).toFixed(1)}\% \to ${(hi * 100).toFixed(1)}\%`];
      extra = T(`参考值 = BS 公式 ${ref.toFixed(4)}`, `Reference = BS formula ${ref.toFixed(4)}`);
    }
    $("#mcv-f").innerHTML = f.map((x) => tex(x, true)).join("");
    const all = rows.flatMap((x) => x[1]);
    const sd0 = meanSd(rows[0][1])[1];
    const lo = Math.min(...all, ref), hi = Math.max(...all, ref), pad = (hi - lo) * 0.08 || 0.01;
    const nr = rows.length;
    $("#mcv-chart").innerHTML = lineChart({
      xmin: lo - pad, xmax: hi + pad, ymin: 0.4, ymax: nr + 0.6, H: 60 + 46 * nr,
      xlabel: T("30 个估计值（每个用 N 条路径）", "30 estimates (N paths each)"), xfmt: (v) => "$" + (+v.toPrecision(4)),
      yfmt: (v) => (Math.abs(v - Math.round(v)) < 1e-9 && v >= 1 && v <= nr ? rows[nr - v][0] : ""),
      series: rows.map(([label, ests, cls], k) => ({ points: ests.map((e) => [e, nr - k]), cls, dotsOnly: true, r: 3.5, label })),
      markers: [{ x: ref, label: T("参考值", "reference") }],
    });
    $("#mcv-stats").innerHTML = stats(rows.map(([label, ests], k) => {
      const [, sd] = meanSd(ests);
      const vr = (sd0 / sd) ** 2;
      return [label + T("：散布（标准差）", ": spread (sd)"), "±" + sd.toFixed(sd < 0.01 ? 4 : 3) + (k ? `  (${T("方差 ÷", "var ÷")}${vr >= 10 ? vr.toFixed(0) : vr.toFixed(1)})` : ""), k === nr - 1 ? "acc" : ""];
    })) + `<p class="demo-meta">${extra}</p>`;
  };

  bindSliders(root, { "mcv-n": (v) => v.toLocaleString("en-US") }, () => {});
  $("#mcv-run").addEventListener("click", run);
  onSeg(root, "mcv-mode", (v) => { mode = v; run(); });
  run();
}
