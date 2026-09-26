// Main demo for lesson perps-vs-options: same bullish view, two tools. Simulates bitcoin paths and tracks a leveraged
// long perp (funding, liquidation on the first touch) against a 30-day call bought at 50% implied vol.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S0 = 100000, IV = 0.5, r = 0.04, D = 30, STEPS = 360, FUND = 0.0001, MMR = 0.005, BUDGET = 10000;
  let size = "one", K = 100000, seed = 21, cloud = null;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("同一个看涨观点：杠杆永续 vs 看涨期权（30 天路径模拟）", "One bullish view: leveraged perp vs call (30-day path simulator)")}</div>
    <div class="demo-row">${seg("pvo-size", [["one", T("同样规模：1 BTC", "Same size: 1 BTC")], ["budget", T("同样预算：10,000 美元", "Same budget: $10,000")]], size)}
      ${seg("pvo-k", [["90000", "K = 90k"], ["100000", "K = 100k"], ["110000", "K = 110k"]], K)}</div>
    <div class="demo-grid">
      ${slider("pvo-lev", T("永续杠杆", "Perp leverage"), 2, 50, 1, 10)}
      ${slider("pvo-rv", T("实际波动率（期权按 50% 定价）", "Realized vol (option priced at 50%)"), 20, 100, 5, 50)}
      ${slider("pvo-mu", T("年化漂移（你的观点有多对）", "Annual drift (how right your view is)"), -100, 150, 10, 0)}
    </div>
    <div class="demo-math" id="pvo-f"></div>
    <div id="pvo-setup"></div>
    <div class="demo-btns"><button class="demo-btn" data-act="path">${T("换一条路径", "New path")}</button><button class="demo-btn" data-act="cloud">${T("跑 2,000 条路径", "Run 2,000 paths")}</button></div>
    <div id="pvo-chart"></div>
    <div id="pvo-one"></div>
    <div id="pvo-cloud"></div>
    <p class="demo-tip">${T("试试：漂移调到 +50%（你的观点是对的），跑 2,000 条路径——两者平均盈利差不多，但 10 倍永续有四成以上的路径在途中被强平；再把实际波动率拉到 80%，看期权的平均收益上升、永续的强平比例也跟着上升。", "Try this: set drift to +50% (your view is right) and run 2,000 paths — the two average about the same, yet the 10× perp is liquidated on the way in more than 40% of paths. Then raise realized vol to 80%: the call's average result rises, and so does the perp's liquidation rate.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const usd = (x) => (x < 0 ? "−$" : "$") + Math.round(Math.abs(x)).toLocaleString("en-US");

  const setup = () => {
    const L = +$("#pvo-lev").value, C = O.bsPrice({ S: S0, K, T: D / 365, r, sigma: IV, type: "call" });
    const Qp = size === "one" ? 1 : (L * BUDGET) / S0, M = (Qp * S0) / L;
    const Qc = size === "one" ? 1 : BUDGET / C;
    const liq = O.liqPrice(S0, L, MMR);
    return { L, C, Qp, M, Qc, liq, cost: Qc * C };
  };
  // simulate one path; returns final P&Ls (and series if wanted)
  const run = (R, st, withSeries) => {
    const sig = +$("#pvo-rv").value / 100, mu = +$("#pvo-mu").value / 100;
    const path = O.gbmPath(R, S0, mu, sig, D / 365, STEPS);
    let fund = 0, liqAt = -1;
    const perp = [[0, 0]], call = [[0, 0]];
    for (let i = 1; i <= STEPS; i++) {
      const P = path[i];
      if (liqAt < 0) {
        fund += FUND * 3 * (D / STEPS) * st.Qp * path[i - 1];
        if (st.M + st.Qp * (P - S0) - fund <= MMR * st.Qp * P) liqAt = i;
      }
      if (withSeries && (i % 6 === 0 || i === liqAt)) {
        const t = (i / STEPS) * D;
        perp.push([t, liqAt >= 0 ? -st.M : st.Qp * (P - S0) - fund]);
        call.push([t, st.Qc * (O.bsPrice({ S: P, K, T: Math.max(0, (D - t) / 365), r, sigma: IV, type: "call" }) - st.C)]);
      }
    }
    const ST = path[STEPS];
    const perpPL = liqAt >= 0 ? -st.M : st.Qp * (ST - S0) - fund;
    const callPL = st.Qc * (Math.max(ST - K, 0) - st.C);
    return { perpPL, callPL, liqAt, ST, perp, call, path };
  };

  const drawOne = () => {
    const st = setup();
    $("#pvo-f").innerHTML = tex(String.raw`P_{\text{liq}} = 100{,}000\left(1 - \tfrac{1}{${st.L}} + 0.005\right) = ${Math.round(st.liq).toLocaleString("en-US").replace(/,/g, "{,}")}, \qquad C = ${Math.round(st.C).toLocaleString("en-US").replace(/,/g, "{,}")} \ (\sigma_{\text{imp}} = 50\%,\ K = ${K / 1000}\text{k})`, true);
    $("#pvo-setup").innerHTML = stats([
      [T("永续规模 / 保证金", "Perp size / margin"), `${st.Qp.toFixed(2)} BTC / ${usd(st.M)}`],
      [T("永续强平价", "Perp liquidation price"), usd(st.liq), "neg"],
      [T("期权规模 / 权利金", "Call size / premium"), `${st.Qc.toFixed(2)} BTC / ${usd(st.cost)}`],
      [T("期权盈亏平衡", "Call breakeven"), usd(K + st.C)],
    ]);
    const res = run(O.rng(seed), st, true);
    $("#pvo-chart").innerHTML = lineChart({
      xmin: 0, xmax: D, xlabel: T("天", "days"), ylabel: T("盈亏（美元）", "P&L ($)"), yfmt: (y) => Math.round(y / 1000) + "k", xstep: 5,
      series: [
        { points: res.perp, cls: 4, label: T(`${st.L} 倍永续`, `${st.L}× perp`) },
        { points: res.call, cls: 0, label: T("看涨期权（按 50% 波动率估值）", "call (marked at 50% vol)") },
      ],
      markers: res.liqAt >= 0 ? [{ x: (res.liqAt / STEPS) * D, label: T("永续被强平", "perp liquidated") }] : [],
    });
    $("#pvo-one").innerHTML = stats([
      [T("第 30 天比特币", "Bitcoin on day 30"), usd(res.ST), "acc"],
      [T("永续结果", "Perp result"), usd(res.perpPL) + (res.liqAt >= 0 ? T("（被强平）", " (liquidated)") : ""), res.perpPL >= 0 ? "pos" : "neg"],
      [T("期权结果", "Call result"), usd(res.callPL), res.callPL >= 0 ? "pos" : "neg"],
    ]);
  };

  const showCloud = () => {
    if (!cloud) { $("#pvo-cloud").innerHTML = `<p class="demo-meta">${T("按“跑 2,000 条路径”，比较两种工具的结果分布。", "Press “Run 2,000 paths” to compare the two distributions of outcomes.")}</p>`; return; }
    const row = (lab, a, b) => `<tr><td>${lab}</td><td>${a}</td><td>${b}</td></tr>`;
    const q = (arr, p) => arr[Math.min(arr.length - 1, Math.floor(p * arr.length))];
    $("#pvo-cloud").innerHTML = `<table><thead><tr><th></th><th>${T("永续", "Perp")}</th><th>${T("看涨期权", "Call")}</th></tr></thead><tbody>` +
      row(T("平均盈亏", "Average P&L"), usd(cloud.mp), usd(cloud.mc)) +
      row(T("最差 5%", "Worst 5%"), usd(q(cloud.p, 0.05)), usd(q(cloud.c, 0.05))) +
      row(T("中位数", "Median"), usd(q(cloud.p, 0.5)), usd(q(cloud.c, 0.5))) +
      row(T("最好 5%", "Best 5%"), usd(q(cloud.p, 0.95)), usd(q(cloud.c, 0.95))) +
      row(T("亏掉 90% 以上本金的路径", "Paths losing ≥ 90% of the stake"), (cloud.bp * 100).toFixed(1) + "%", (cloud.bc * 100).toFixed(1) + "%") +
      row(T("途中被强平", "Liquidated on the way"), (cloud.liq * 100).toFixed(1) + "%", "–") +
      `</tbody></table>`;
  };
  const runCloud = () => {
    const st = setup(), R = O.rng(90000 + seed), N = 2000, p = [], c = [];
    let liq = 0, bp = 0, bc = 0;
    for (let k = 0; k < N; k++) {
      const res = run(R, st, false);
      p.push(res.perpPL); c.push(res.callPL);
      if (res.liqAt >= 0) liq++;
      if (res.perpPL <= -0.9 * st.M) bp++;
      if (res.callPL <= -0.9 * st.cost) bc++;
    }
    p.sort((a, b) => a - b); c.sort((a, b) => a - b);
    cloud = { p, c, mp: p.reduce((a, b) => a + b, 0) / N, mc: c.reduce((a, b) => a + b, 0) / N, liq: liq / N, bp: bp / N, bc: bc / N };
    showCloud();
  };

  const redraw = () => { cloud = null; drawOne(); showCloud(); };
  bindSliders(root, { "pvo-lev": (x) => x + "×", "pvo-rv": (x) => x + "%", "pvo-mu": (x) => (x > 0 ? "+" : "") + x + "%" }, redraw);
  onSeg(root, "pvo-size", (v) => { size = v; redraw(); });
  onSeg(root, "pvo-k", (v) => { K = +v; redraw(); });
  root.querySelectorAll("[data-act]").forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.act === "path") { seed += 1; drawOne(); } else runCloud();
  }));
}
