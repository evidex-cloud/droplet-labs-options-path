// Inline demo for lesson finite-difference: a coarse explicit grid you can step backwards one column at a time.
// 11 price levels (S = 0, 20, …, 200), K = 100, T = 1, r = 4%. The explicit update is implemented locally (the engine's
// fdPrice returns only the final column); it uses the same discretisation as demos/_opt.js fdPrice(scheme: "explicit").
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const M = 10, Smax = 200, dS = Smax / M, K = 100, Tm = 1, r = 0.04;
  let type = "put", cols = [], shown = 0, N = 20, sigma = 0.4;

  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("从到期往回走：显式格式的粗网格", "Stepping back from expiry: a coarse explicit grid")}</div>
    <div class="demo-row">${seg("fdg-type", [["put", T("看跌", "Put")], ["call", T("看涨", "Call")]], type)}
      <div class="demo-btns" style="margin:0"><button class="demo-btn" id="fdg-step">${T("后退一列", "Step back one column")}</button><button class="demo-btn on" id="fdg-all">${T("一直解到今天", "Solve to today")}</button><button class="demo-btn" id="fdg-reset">${T("回到到期日", "Back to expiry")}</button></div></div>
    <div class="demo-grid">
      ${slider("fdg-v", T("波动率 σ", "Volatility σ"), 10, 80, 5, 40)}
      ${slider("fdg-n", T("时间步数 N（Δt = 1/N 年）", "Time steps N (Δt = 1/N year)"), 4, 60, 1, 20)}
    </div>
    <div class="demo-math" id="fdg-f"></div>
    <div id="fdg-heat"></div>
    <div id="fdg-stats"></div>
    <div id="fdg-chart"></div>
    <p class="demo-tip">${T("试试：σ 拉到 60%、N 降到 12，再按“一直解到今天”——高价位那几行开始正负交替、越摆越大，这就是不稳定。把 N 加到 36 以上（λ ≤ 1），锯齿消失。注意 S = 100 那一行的三个权重始终是正的，出问题的是网格顶部。", "Try this: set σ to 60% and N to 12, then “Solve to today” — the high-price rows start alternating in sign and growing: that is instability. Raise N above 36 (λ ≤ 1) and the sawtooth disappears. Notice that the three weights at S = 100 stay positive; the trouble starts at the top of the grid.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);

  const weights = (i, dt) => {
    const s2 = sigma * sigma * i * i;
    return [dt * 0.5 * (s2 - r * i), 1 - dt * (s2 + r), dt * 0.5 * (s2 + r * i)];
  };
  const solve = () => {
    const dt = Tm / N;
    let V = []; for (let i = 0; i <= M; i++) V.push(O.intrinsic(type, i * dS, K));
    cols = [V];
    for (let n = 1; n <= N; n++) {
      const tau = n * dt, W = new Array(M + 1);
      W[0] = type === "put" ? K * Math.exp(-r * tau) : 0;
      W[M] = type === "call" ? Smax - K * Math.exp(-r * tau) : 0;
      for (let i = 1; i < M; i++) { const [a, b, c] = weights(i, dt); W[i] = a * V[i - 1] + b * V[i] + c * V[i + 1]; }
      V = W; cols.push(V);
    }
  };
  const fmtV = (v) => (!isFinite(v) ? "∞" : Math.abs(v) >= 1e4 ? v.toExponential(1) : v.toFixed(1));

  const draw = () => {
    const dt = Tm / N, lam = sigma * sigma * M * M * dt, tau = shown * dt;
    const [a5, b5, c5] = weights(5, dt), [a9, b9, c9] = weights(9, dt);
    const verdict = lam <= 1 ? String.raw`\le 1\ \text{(${T("稳定", "stable")})}` : String.raw`> 1\ \text{(${T("不稳定", "unstable")})}`;
    $("#fdg-f").innerHTML = tex(String.raw`V_i^{\,n+1} = w_{\text{d}}V_{i-1}^{\,n} + w_{\text{m}}V_i^{\,n} + w_{\text{u}}V_{i+1}^{\,n}`, true)
      + tex(String.raw`\begin{aligned} S = 100:&\quad (w_{\text{d}}, w_{\text{m}}, w_{\text{u}}) = (${a5.toFixed(3)},\ ${b5.toFixed(3)},\ ${c5.toFixed(3)}) \\ S = 180:&\quad (w_{\text{d}}, w_{\text{m}}, w_{\text{u}}) = (${a9.toFixed(3)},\ ${b9.toFixed(3)},\ ${c9.toFixed(3)}) \end{aligned}`, true)
      + tex(String.raw`\lambda = \sigma^2 M^2 \Delta t = ${(sigma * sigma).toFixed(2)} \times 100 \times \tfrac{1}{${N}} = ${lam.toFixed(2)}\ ${verdict}`, true);
    // heatmap: x = column n (time to expiry), y = S (top = 200)
    const W = 600, H = 250, mL = 44, mR = 10, mT = 10, mB = 34, cw = (W - mL - mR) / (N + 1), ch = (H - mT - mB) / (M + 1);
    const cur = cols[shown] || cols[0];
    const scale = Math.max(1, ...cols.slice(0, shown + 1).flatMap((c) => c.map((v) => (isFinite(v) ? Math.min(Math.abs(v), 250) : 250))));
    let g = "";
    for (let n = 0; n <= N; n++) for (let i = 0; i <= M; i++) {
      const x = mL + n * cw, y = mT + (M - i) * ch;
      if (n > shown) { g += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(cw - 1).toFixed(1)}" height="${(ch - 1).toFixed(1)}" class="fx-box2"/>`; continue; }
      const v = cols[n][i], neg = v < 0, op = isFinite(v) ? Math.min(1, 0.08 + Math.min(Math.abs(v), 250) / scale * 0.92) : 1;
      g += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(cw - 1).toFixed(1)}" height="${(ch - 1).toFixed(1)}" class="${neg ? "fx-fill-red" : "fx-fill-orange"}" fill-opacity="${op.toFixed(2)}"><title>S = ${i * dS}, τ = ${(n * dt).toFixed(3)}: ${fmtV(v)}</title></rect>`;
    }
    if (shown > 0) { const x = mL + shown * cw, y = mT + (M - 6) * ch; g += `<rect x="${(x - cw).toFixed(1)}" y="${y.toFixed(1)}" width="${(cw - 1).toFixed(1)}" height="${(3 * ch - 1).toFixed(1)}" class="fx-line" /><rect x="${x.toFixed(1)}" y="${(y + ch).toFixed(1)}" width="${(cw - 1).toFixed(1)}" height="${(ch - 1).toFixed(1)}" class="fx-line"/>`; }
    for (let i = 0; i <= M; i += 2) g += `<text x="${mL - 6}" y="${(mT + (M - i) * ch + ch * 0.7).toFixed(1)}" text-anchor="end" class="fx-t-sm">${i * dS}</text>`;
    g += `<text x="${mL}" y="${H - 16}" class="fx-t-sm">${T("到期（τ = 0，已知收益）", "expiry (τ = 0, known payoff)")}</text><text x="${W - mR}" y="${H - 16}" text-anchor="end" class="fx-t-sm">${T("今天（τ = 1 年）", "today (τ = 1 year)")}</text>`;
    g += `<text x="${(mL + W - mR) / 2}" y="${H - 2}" text-anchor="middle" class="fx-t-sm">${T("每按一次，向右多解一列（时间往回走）→", "each step solves one more column (time runs backwards) →")}</text>`;
    $("#fdg-heat").innerHTML = `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img">${g}</svg></div>`;
    const bsAt = (S) => (tau > 0 ? O.bsPrice({ S: Math.max(S, 1e-9), K, T: tau, r, sigma, type }) : O.intrinsic(type, S, K));
    const v100 = cur[5];
    $("#fdg-stats").innerHTML = stats([
      [T("已解到 τ", "Solved to τ"), tau.toFixed(3) + T(" 年", " yr")],
      [T("网格值 V(100)", "Grid V(100)"), fmtV(v100), "acc"],
      [T("BS 值 V(100)", "BS V(100)"), bsAt(100).toFixed(2)],
      [T("网格值 V(180)", "Grid V(180)"), fmtV(cur[9]), isFinite(cur[9]) && Math.abs(cur[9] - bsAt(180)) > 1 ? "neg" : ""],
      ["λ", lam.toFixed(2), lam <= 1 ? "pos" : "neg"],
    ]);
    const hi = type === "put" ? 110 : 120;
    $("#fdg-chart").innerHTML = lineChart({
      xmin: 0, xmax: Smax, ymin: -40, ymax: hi, H: 230, xlabel: T("股价 S", "Stock price S"), ylabel: T("期权价值", "Option value"),
      series: [
        { f: bsAt, cls: 5, dashed: true, label: T("BS 精确值（同一 τ）", "BS exact (same τ)") },
        { points: cur.map((v, i) => [i * dS, isFinite(v) ? Math.max(-1e4, Math.min(1e4, v)) : 1e4]), cls: 0, dots: true, label: T("网格值", "Grid values") },
      ],
      markers: [{ x: K, label: "K" }],
    });
  };
  const rebuild = () => { solve(); shown = N; draw(); };
  bindSliders(root, { "fdg-v": (v) => v + "%", "fdg-n": (v) => String(v) }, (v) => { sigma = v["fdg-v"] / 100; N = v["fdg-n"]; rebuild(); });
  onSeg(root, "fdg-type", (v) => { type = v; rebuild(); });
  $("#fdg-step").addEventListener("click", () => { if (shown < N) shown++; draw(); });
  $("#fdg-all").addEventListener("click", () => { shown = N; draw(); });
  $("#fdg-reset").addEventListener("click", () => { shown = 0; draw(); });
}
