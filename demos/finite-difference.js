// Main demo for lesson finite-difference: the engine's fdPrice on a real grid. Switch scheme (explicit / implicit /
// Crank–Nicolson), grid size M × N, European or American; watch the explicit scheme blow up when λ = σ²M²Δt > 1,
// read Δ and Γ straight off the grid, and run a convergence study.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex, texNum } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S = 100, K = 100, r = 0.04;
  let type = "call", scheme = "explicit", style = "eu", M = 200, N = 200;
  const amCache = new Map();

  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("有限差分实验室：三种格式，一张网格", "Finite-difference lab: three schemes, one grid")}</div>
    <div class="demo-row">${seg("fd-type", [["call", T("看涨", "Call")], ["put", T("看跌", "Put")]], type)}${seg("fd-style", [["eu", T("欧式", "European")], ["am", T("美式（投影）", "American (projection)")]], style)}</div>
    <div class="demo-row">${seg("fd-scheme", [["explicit", T("显式", "Explicit")], ["implicit", T("隐式", "Implicit")], ["cn", "Crank–Nicolson"]], scheme)}</div>
    <div class="demo-row"><span class="demo-label" style="margin:0">${T("价格格点 M", "Price nodes M")}</span>${seg("fd-m", [["50", "50"], ["100", "100"], ["200", "200"], ["400", "400"]], M)}</div>
    <div class="demo-row"><span class="demo-label" style="margin:0">${T("时间步 N", "Time steps N")}</span>${seg("fd-n", [["25", "25"], ["50", "50"], ["100", "100"], ["200", "200"], ["400", "400"], ["800", "800"], ["1600", "1.6k"], ["3200", "3.2k"]], N)}</div>
    <div class="demo-grid">
      ${slider("fd-v", T("波动率 σ", "Volatility σ"), 10, 60, 1, 20)}
      ${slider("fd-t", T("到期天数", "Days to expiry"), 30, 730, 5, 365)}
    </div>
    <div class="demo-math" id="fd-f"></div>
    <div id="fd-stats"></div>
    <div id="fd-msg"></div>
    <div id="fd-chart"></div>
    <div class="demo-btns"><button class="demo-btn" id="fd-conv">${T("收敛性研究：M = N = 50 → 400", "Convergence study: M = N = 50 → 400")}</button></div>
    <div id="fd-table"></div>
    <p class="demo-tip">${T("试试：显式格式、M = 200，把 N 从 200 一路加到 1.6k——λ 降到 1 以下的那一刻，天文数字突然变成 9.92。换成隐式或 Crank–Nicolson，N = 25 也稳稳当当。再切到“美式看跌”，看提前行权溢价（约 0.40）。", "Try this: explicit scheme, M = 200, raise N from 200 towards 1.6k — the moment λ drops below 1, an astronomical number suddenly becomes 9.92. Switch to implicit or Crank–Nicolson and even N = 25 is perfectly calm. Then pick an American put and read off the early-exercise premium (about 0.40).")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);

  const read = () => ({ sigma: +$("#fd-v").value / 100, Tm: +$("#fd-t").value / 365 });
  const refPrice = (o) => {
    if (style === "eu") return O.bsPrice(o);
    const key = [o.type, o.sigma, o.T].join("|");
    if (!amCache.has(key)) amCache.set(key, O.binomial({ ...o, steps: 1000, american: true }).price);
    return amCache.get(key);
  };
  const blown = (x) => !isFinite(x) || Math.abs(x) > 1e5;

  function render() {
    const { sigma, Tm } = read();
    const o = { S, K, T: Tm, r, sigma, type };
    const res = O.fdPrice({ ...o, M, N, scheme, american: style === "am" });
    const ref = refPrice(o), dt = Tm / N, lam = sigma * sigma * M * M * dt;
    const g = res.grid, dS = g.S[1] - g.S[0], i0 = Math.round(S / dS);
    const dGrid = (g.V[i0 + 1] - g.V[i0 - 1]) / (2 * dS), gGrid = (g.V[i0 + 1] - 2 * g.V[i0] + g.V[i0 - 1]) / (dS * dS);
    const bad = blown(res.price);
    const th = scheme === "explicit" ? 0 : scheme === "implicit" ? 1 : 0.5;
    $("#fd-f").innerHTML = tex(String.raw`\frac{V_i^{\,n+1} - V_i^{\,n}}{\Delta t} = \theta\,\mathcal{L}V^{\,n+1}_i + (1-\theta)\,\mathcal{L}V^{\,n}_i`, true) + tex(String.raw`\theta = ${th}\ (\text{${scheme === "explicit" ? T("显式", "explicit") : scheme === "implicit" ? T("隐式", "implicit") : "Crank--Nicolson"}})`, true)
      + tex(String.raw`\Delta S = ${dS.toFixed(2)},\quad \Delta t = \tfrac{${(Tm).toFixed(3)}}{${N}}`, true) + tex(String.raw`\lambda = \sigma^2 M^2 \Delta t = ${(sigma * sigma).toFixed(4)} \times ${M}^2 \times ${texNum(dt, 3)} = ${lam.toFixed(2)}`, true);
    const priceTxt = bad ? (isFinite(res.price) ? tex(texNum(res.price, 3)) : T("溢出", "overflow")) : "$" + res.price.toFixed(4);
    const items = [
      [T("网格价 V(100)", "Grid price V(100)"), priceTxt, bad ? "neg" : "acc"],
      [style === "eu" ? T("BS 精确值", "BS exact") : T("二叉树（1000 步）", "Tree (1,000 steps)"), "$" + ref.toFixed(4)],
      [T("误差", "Error"), bad ? "—" : (res.price - ref >= 0 ? "+" : "−") + Math.abs(res.price - ref).toFixed(4), bad ? "neg" : ""],
      ["λ", lam.toFixed(2), scheme === "explicit" ? (lam <= 1 ? "pos" : "neg") : ""],
      [T("网格 Δ", "Grid Δ"), bad ? "—" : dGrid.toFixed(4)],
      [T("网格 Γ", "Grid Γ"), bad ? "—" : gGrid.toFixed(4)],
    ];
    if (style === "eu") { const gr = O.greeks(o); items.push([T("BS Δ / Γ", "BS Δ / Γ"), `${gr.delta.toFixed(4)} / ${gr.gamma.toFixed(4)}`]); }
    else items.push([T("欧式 BS（对比）", "European BS (compare)"), "$" + O.bsPrice(o).toFixed(4)]);
    $("#fd-stats").innerHTML = stats(items);
    let msg = "";
    if (scheme === "explicit" && bad) msg = T(`λ = ${lam.toFixed(2)} > 1：显式格式在网格顶部（高股价处）给每一步的误差乘上一个绝对值大于 1 的因子，${N} 步之后价格变成天文数字。要稳定，需要 N ≥ σ²M²T ≈ ${Math.ceil(sigma * sigma * M * M * Tm - 1e-9)}。`, `λ = ${lam.toFixed(2)} > 1: near the top of the grid (high prices) the explicit scheme multiplies each step's error by a factor larger than 1 in size; after ${N} steps the price is astronomical. Stability needs N ≥ σ²M²T ≈ ${Math.ceil(sigma * sigma * M * M * Tm - 1e-9)}.`);
    else if (scheme === "explicit" && lam > 1) msg = T(`λ = ${lam.toFixed(2)} > 1，但这次没有爆：误差被放大需要先有“种子”，而这里的收益在高价区平滑到几乎没有噪声。这是运气，不是稳定——换个 M 或 N 就可能炸。`, `λ = ${lam.toFixed(2)} > 1, yet this run did not explode: amplification needs a seed, and here the payoff is so smooth at high prices that almost no noise reaches the unstable rows. That is luck, not stability — change M or N and it may blow up.`);
    else if (scheme === "explicit") msg = T(`λ = ${lam.toFixed(2)} ≤ 1：每个节点的新值都是三个邻居的正权重平均，误差不会被放大。代价是时间步必须很多。`, `λ = ${lam.toFixed(2)} ≤ 1: every new value is a positive-weight average of three neighbours, so errors cannot grow. The price you pay is a very large number of time steps.`);
    else if (scheme === "implicit") msg = T("隐式格式对任何 Δt 都稳定，但时间方向只有一阶精度：N 太小时误差明显。", "The implicit scheme is stable for any Δt, but only first-order accurate in time: with few steps the error shows.");
    else msg = T("Crank–Nicolson 在时间和价格两个方向都是二阶精度，通常是首选；收益在行权价处有折角，步长很大时可能出现小幅振荡。", "Crank–Nicolson is second-order in both time and price and usually the default; the kink in the payoff at the strike can cause small wiggles when time steps are very large.");
    if (style === "am") msg += " " + T(`美式：每一步之后取 max(继续持有值, 立即行权值)。提前行权溢价 ≈ ${(ref - O.bsPrice(o)).toFixed(2)}。`, `American: after every step take max(continuation, exercise now). Early-exercise premium ≈ ${(ref - O.bsPrice(o)).toFixed(2)}.`);
    $("#fd-msg").innerHTML = `<p class="demo-meta">${msg}</p>`;
    const pts = [];
    for (let i = 0; i < g.S.length; i++) if (g.S[i] >= 40 && g.S[i] <= 180) { const v = g.V[i]; pts.push([g.S[i], isFinite(v) ? Math.max(-1e4, Math.min(1e4, v)) : 1e4]); }
    const top = type === "call" ? 90 : 65;
    $("#fd-chart").innerHTML = lineChart({
      xmin: 40, xmax: 180, ymin: -10, ymax: top, H: 260, xlabel: T("股价 S", "Stock price S"), ylabel: T("今天的期权价值", "Option value today"),
      series: [
        { f: (x) => O.intrinsic(type, x, K), cls: 5, dashed: true, label: T("到期收益", "Payoff at expiry") },
        { f: (x) => O.bsPrice({ ...o, S: x }), cls: 1, dashed: true, label: T("欧式 BS", "European BS") },
        { points: pts, cls: bad ? 2 : 0, label: T("网格解", "Grid solution") },
      ],
      markers: [{ x: K, label: "K" }],
    });
  }

  function convergence() {
    const { sigma, Tm } = read();
    const o = { S, K, T: Tm, r, sigma, type };
    const ref = refPrice(o);
    let rows = "", prev = {};
    for (const m of [50, 100, 200, 400]) {
      const cells = ["implicit", "cn"].map((sc) => {
        const p = O.fdPrice({ ...o, M: m, N: m, scheme: sc, american: style === "am" }).price, e = p - ref;
        const ratio = prev[sc] ? Math.abs(prev[sc] / e) : null; prev[sc] = e;
        return `<td>${p.toFixed(4)}</td><td>${e >= 0 ? "+" : "−"}${Math.abs(e).toFixed(4)}${ratio && isFinite(ratio) ? ` <small>(÷${ratio.toFixed(1)})</small>` : ""}</td>`;
      }).join("");
      rows += `<tr><td>${m} × ${m}</td>${cells}</tr>`;
    }
    $("#fd-table").innerHTML = `<table><thead><tr><th>M × N</th><th>${T("隐式", "Implicit")}</th><th>${T("误差", "Error")}</th><th>Crank–Nicolson</th><th>${T("误差", "Error")}</th></tr></thead><tbody>${rows}</tbody></table>
      <p class="demo-meta">${T(`参考值 ${ref.toFixed(4)}。网格加密一倍时，二阶格式的误差应约 ÷4，一阶约 ÷2（格点 M = 50 太粗，S = 100 不在格点上，第一行不算数）。`, `Reference ${ref.toFixed(4)}. Doubling the grid should cut a second-order error by about 4 and a first-order one by about 2 (M = 50 is too coarse — S = 100 is not a node — so ignore the first row).`)}</p>`;
  }

  bindSliders(root, { "fd-v": (v) => v + "%", "fd-t": (v) => v + T(" 天", " days") }, render);
  onSeg(root, "fd-type", (v) => { type = v; render(); });
  onSeg(root, "fd-style", (v) => { style = v; render(); });
  onSeg(root, "fd-scheme", (v) => { scheme = v; render(); });
  onSeg(root, "fd-m", (v) => { M = +v; render(); });
  onSeg(root, "fd-n", (v) => { N = +v; render(); });
  $("#fd-conv").addEventListener("click", convergence);
}
