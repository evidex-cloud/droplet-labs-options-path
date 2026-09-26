// Inline demo for lesson american-exercise: Longstaff–Schwartz (least-squares Monte Carlo) on 10 paths, one exercise
// date at a time, then the full method on 20,000 paths. Regression, exercise rule and pricing are implemented locally
// (the engine has no LSM); paths come from the engine's seeded RNG, reference prices from the engine's tree and BS.
import * as O from "./_opt.js";
import { lineChart, stats, tex } from "./_viz.js";

// least squares on basis [1, x, x²] (falls back to fewer terms when there are too few points)
function fit(xs, ys) {
  const n = xs.length, k = n >= 3 ? 3 : n;
  if (k === 0) return [0, 0, 0];
  const A = Array.from({ length: k }, () => new Array(k).fill(0)), b = new Array(k).fill(0);
  for (let i = 0; i < n; i++) { const f = [1, xs[i], xs[i] * xs[i]].slice(0, k); for (let a = 0; a < k; a++) { b[a] += f[a] * ys[i]; for (let c = 0; c < k; c++) A[a][c] += f[a] * f[c]; } }
  const M = A.map((row, i) => [...row, b[i]]);
  for (let c = 0; c < k; c++) {
    let p = c; for (let rr = c + 1; rr < k; rr++) if (Math.abs(M[rr][c]) > Math.abs(M[p][c])) p = rr;
    [M[c], M[p]] = [M[p], M[c]];
    if (Math.abs(M[c][c]) < 1e-12) return [ys.reduce((s, y) => s + y, 0) / n, 0, 0];
    for (let rr = 0; rr < k; rr++) { if (rr === c) continue; const f = M[rr][c] / M[c][c]; for (let j = c; j <= k; j++) M[rr][j] -= f * M[c][j]; }
  }
  const beta = M.map((row, i) => row[k] / row[i]);
  while (beta.length < 3) beta.push(0);
  return beta;
}
function paths(P, m, S0, T, r, sigma, seed) {
  const R = O.rng(seed), dt = T / m, out = [];
  for (let p = 0; p < P; p++) { const row = [S0]; let s = S0; for (let i = 1; i <= m; i++) { s *= Math.exp((r - 0.5 * sigma * sigma) * dt + sigma * Math.sqrt(dt) * R.normal()); row.push(s); } out.push(row); }
  return out;
}
function lsmFull({ S0, K, T, r, sigma, m, P, seed }) {
  const X = paths(P, m, S0, T, r, sigma, seed), dt = T / m;
  const cf = X.map((row) => Math.max(K - row[m], 0)), when = new Array(P).fill(m);
  for (let d = m - 1; d >= 1; d--) {
    const idx = [], xs = [], ys = [];
    for (let p = 0; p < P; p++) if (K - X[p][d] > 0) { idx.push(p); xs.push(X[p][d] / K); ys.push(cf[p] * Math.exp(-r * dt * (when[p] - d))); }
    const [b0, b1, b2] = fit(xs, ys);
    idx.forEach((p, k) => { const x = xs[k], c = b0 + b1 * x + b2 * x * x; if (K - X[p][d] > c) { cf[p] = K - X[p][d]; when[p] = d; } });
  }
  let s = 0, s2 = 0; for (let p = 0; p < P; p++) { const v = cf[p] * Math.exp(-r * dt * when[p]); s += v; s2 += v * v; }
  const mean = s / P;
  return { price: Math.max(mean, K - S0), se: Math.sqrt(Math.max(s2 / P - mean * mean, 0) / P) };
}
// Bermudan put by a CRR tree with exercise only on m equally spaced dates (reference for the 10-path toy)
function bermudanTree({ S0, K, T, r, sigma, m, n = 800 }) {
  const dt = T / n, u = Math.exp(sigma * Math.sqrt(dt)), d = 1 / u, p = (Math.exp(r * dt) - d) / (u - d), disc = Math.exp(-r * dt), every = n / m;
  let V = []; for (let j = 0; j <= n; j++) V.push(Math.max(K - S0 * u ** j * d ** (n - j), 0));
  for (let i = n - 1; i >= 0; i--) { const W = []; for (let j = 0; j <= i; j++) { const c = disc * (p * V[j + 1] + (1 - p) * V[j]); W.push(i > 0 && i % every === 0 ? Math.max(c, K - S0 * u ** j * d ** (i - j)) : c); } V = W; }
  return V[0];
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S0 = 100, K = 100, r = 0.04, sigma = 0.2, Tm = 1, m = 4, P = 10, dt = Tm / m;
  let seed = 12, X, cf, when, k, last, done, refs = null;

  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("Longstaff–Schwartz：10 条路径，一次一个行权日", "Longstaff–Schwartz: 10 paths, one exercise date at a time")}</div>
    <p class="demo-meta">${T("小凯的 1 年期 100 看跌（σ 20%，r 4%），只允许在 3、6、9、12 个月末行权。", "Kai's 1-year 100 put (σ 20%, r 4%), exercisable only at months 3, 6, 9 and 12.")}</p>
    <div class="demo-btns">
      <button class="demo-btn on" id="lsm-step">${T("往回走一个行权日", "Step back one date")}</button>
      <button class="demo-btn" id="lsm-reset">${T("重来", "Restart")}</button>
      <button class="demo-btn" id="lsm-new">${T("换一组路径", "New paths")}</button>
      <button class="demo-btn" id="lsm-full">${T("完整 LSM：20,000 条路径 × 50 个日期", "Full LSM: 20,000 paths × 50 dates")}</button>
    </div>
    <div class="demo-math" id="lsm-f"></div>
    <div id="lsm-table" style="overflow-x:auto"></div>
    <div id="lsm-chart"></div>
    <div id="lsm-stats"></div>
    <p class="demo-tip">${T("看什么：每一步只用“当前实值”的路径做回归——横轴是今天的股价，纵轴是这条路径未来实际拿到的现金流（贴现回来）。拟合曲线就是“继续持有值”的估计；在虚线（立即行权值 K − S）高于拟合曲线的地方，路径选择行权（红点），它后面的现金流被抹掉。10 条路径的价格很粗糙，完整版才会贴近二叉树的 6.40。", "What to notice: each step regresses only the paths that are in the money now — x is today's price, y is the cash the path actually received later (discounted back). The fitted curve estimates the value of holding; wherever the dashed exercise line K − S lies above the fitted curve, the path exercises (red) and its later cash flow is wiped. Ten paths give a crude price; the full run lands close to the tree's 6.40.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);

  const init = () => {
    X = paths(P, m, S0, Tm, r, sigma, seed);
    cf = X.map((row) => Math.max(K - row[m], 0)); when = X.map((row) => (K - row[m] > 0 ? m : 0));
    k = m; last = null; done = false;
  };
  const step = () => {
    if (done) return;
    if (k === 1) { done = true; return; }
    const d = k - 1, idx = [], xs = [], ys = [];
    for (let p = 0; p < P; p++) if (K - X[p][d] > 0) { idx.push(p); xs.push(X[p][d] / K); ys.push(when[p] ? cf[p] * Math.exp(-r * dt * (when[p] - d)) : 0); }
    const beta = fit(xs, ys), ex = [];
    idx.forEach((p, j) => { const x = xs[j], c = beta[0] + beta[1] * x + beta[2] * x * x; const e = K - X[p][d] > c; ex.push(e); if (e) { cf[p] = K - X[p][d]; when[p] = d; } });
    last = { d, idx, xs, ys, beta, ex };
    k = d;
  };

  const draw = () => {
    const tcol = (d) => (d * 3) + T(" 个月", " mo");
    let head = `<tr><th>${T("路径", "Path")}</th>` + [1, 2, 3, 4].map((d) => `<th>${tcol(d)}</th>`).join("") + `<th>${T("现金流", "Cash flow")}</th></tr>`;
    let body = "";
    for (let p = 0; p < P; p++) {
      body += `<tr><td>${p + 1}</td>`;
      for (let d = 1; d <= m; d++) {
        const s = X[p][d], itm = K - s > 0, isEx = when[p] === d && cf[p] > 0, active = d >= k;
        const style = isEx && active ? "background:var(--orange-soft);font-weight:600" : !itm ? "color:var(--muted)" : "";
        body += `<td style="${style}">${s.toFixed(2)}</td>`;
      }
      body += `<td>${when[p] && cf[p] > 0 ? "$" + cf[p].toFixed(2) + " @ " + tcol(when[p]) : "0"}</td></tr>`;
    }
    $("#lsm-table").innerHTML = `<table style="white-space:nowrap"><thead>${head}</thead><tbody>${body}</tbody></table>`;
    if (last && !done) {
      const [b0, b1, b2] = last.beta;
      $("#lsm-f").innerHTML = tex(String.raw`t = \text{${tcol(last.d)}}:\quad \hat C(S) = ${b0.toFixed(2)} ${b1 >= 0 ? "+" : "-"} ${Math.abs(b1).toFixed(2)}\,x ${b2 >= 0 ? "+" : "-"} ${Math.abs(b2).toFixed(2)}\,x^2,\quad x = S/K;\quad \text{${T("若", "exercise if")}}\ K - S > \hat C(S)\ \text{${T("则行权", "")}}`, true);
      const pts = last.idx.map((p, j) => [X[p][last.d], last.ys[j], last.ex[j]]);
      const lo = Math.min(...pts.map((q) => q[0]), K * 0.7) - 2;
      $("#lsm-chart").innerHTML = lineChart({
        xmin: lo, xmax: K + 2, ymin: 0, H: 240, xlabel: T(`${tcol(last.d)}时的股价 S（仅实值路径）`, `Price S at ${tcol(last.d)} (in-the-money paths only)`), ylabel: T("贴现后的未来现金流", "Discounted later cash flow"),
        series: [
          { f: (s) => K - s, cls: 5, dashed: true, label: T("立即行权 K − S", "Exercise now: K − S") },
          { f: (s) => { const x = s / K; return b0 + b1 * x + b2 * x * x; }, cls: 0, label: T("回归：继续持有值", "Regression: value of holding") },
          { points: pts.filter((q) => !q[2]).map((q) => [q[0], q[1]]), cls: 1, dotsOnly: true, r: 5, label: T("继续持有", "hold") },
          { points: pts.filter((q) => q[2]).map((q) => [q[0], q[1]]), cls: 2, dotsOnly: true, r: 5, label: T("行权", "exercise") },
        ],
      });
    } else if (!done) {
      $("#lsm-f").innerHTML = tex(String.raw`t = 12\ \text{${T("个月（到期）", "months (expiry)")}}:\quad \text{${T("现金流", "cash flow")}} = \max(K - S_T,\,0)`, true);
      $("#lsm-chart").innerHTML = `<p class="demo-meta">${T("从到期日开始：每条路径的现金流就是到期收益。按“往回走一个行权日”。", "Start at expiry: each path's cash flow is its payoff. Press “Step back one date”.")}</p>`;
    }
    if (done) {
      let s = 0; for (let p = 0; p < P; p++) s += when[p] ? cf[p] * Math.exp(-r * dt * when[p]) : 0;
      const price = s / P;
      if (!refs) refs = { berm: bermudanTree({ S0, K, T: Tm, r, sigma, m }), am: O.binomial({ S: S0, K, T: Tm, r, sigma, type: "put", steps: 800, american: true }).price, eu: O.bsPrice({ S: S0, K, T: Tm, r, sigma, type: "put" }) };
      $("#lsm-f").innerHTML = tex(String.raw`\hat V_0 = \frac{1}{10}\sum_{p=1}^{10} e^{-r\,t_p}\,\text{CF}_p = ${price.toFixed(2)}`, true);
      $("#lsm-chart").innerHTML = "";
      $("#lsm-stats").innerHTML = stats([
        [T("10 条路径的估计", "10-path estimate"), "$" + price.toFixed(2), "acc"],
        [T("百慕大（4 个日期，树）", "Bermudan (4 dates, tree)"), "$" + refs.berm.toFixed(2)],
        [T("美式（树）", "American (tree)"), "$" + refs.am.toFixed(2)],
        [T("欧式（BS）", "European (BS)"), "$" + refs.eu.toFixed(2)],
      ]) + `<p class="demo-meta">${T("10 条路径的误差大得离谱——这只是看清机制。换几组路径，估计值会大幅跳动。", "Ten paths are far too few for a price — this run is for seeing the mechanism. Try new paths and watch the estimate jump around.")}</p>`;
    } else if (!$("#lsm-stats").dataset.full) $("#lsm-stats").innerHTML = "";
    $("#lsm-step").disabled = done;
  };

  $("#lsm-step").addEventListener("click", () => { step(); draw(); });
  $("#lsm-reset").addEventListener("click", () => { init(); $("#lsm-stats").dataset.full = ""; draw(); });
  $("#lsm-new").addEventListener("click", () => { seed += 1; init(); $("#lsm-stats").dataset.full = ""; draw(); });
  $("#lsm-full").addEventListener("click", () => {
    const t0 = typeof performance !== "undefined" ? performance.now() : Date.now();
    const res = lsmFull({ S0, K, T: Tm, r, sigma, m: 50, P: 20000, seed: 5 });
    const ms = (typeof performance !== "undefined" ? performance.now() : Date.now()) - t0;
    const am = O.binomial({ S: S0, K, T: Tm, r, sigma, type: "put", steps: 800, american: true }).price;
    $("#lsm-stats").dataset.full = "1";
    $("#lsm-stats").innerHTML = stats([
      [T("LSM（20,000 × 50）", "LSM (20,000 × 50)"), "$" + res.price.toFixed(3) + " ± " + res.se.toFixed(3), "acc"],
      [T("美式（树 800 步）", "American (tree, 800 steps)"), "$" + am.toFixed(3)],
      [T("欧式（BS）", "European (BS)"), "$" + O.bsPrice({ S: S0, K, T: Tm, r, sigma, type: "put" }).toFixed(3)],
      [T("耗时", "Time"), ms.toFixed(0) + " ms"],
    ]) + `<p class="demo-meta">${T("50 个行权日的百慕大期权略低于真正的美式期权；回归得到的行权规则不是最优的，所以 LSM 估计通常略偏低（同一批路径上估计又会略偏高，两者部分抵消）。", "A 50-date Bermudan is worth slightly less than the true American; a regression-based rule is not quite optimal, which biases LSM low (fitting and pricing on the same paths biases it slightly high; the two partly offset).")}</p>`;
  });
  init();
  draw();
}
