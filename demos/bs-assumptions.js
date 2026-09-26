// Main demo for lesson bs-assumptions: sell the 30-day ATM XYZ call at the Black-Scholes price, delta-hedge it
// N times over its life, and look at the distribution of the final P&L over 400 simulated paths.
// Compares the spread with the Derman–Kamal approximation √(π/4)·ν·σ/√N, lets realized vol differ from implied,
// and can add an overnight earnings-style gap halfway through (which no rebalancing frequency can hedge).
// The simulation loop is written locally (like O.hedgeSim) so that a jump can be inserted.
import * as O from "./_opt.js";
import { barChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let N = 30, jump = 0;
  const PATHS = 400, S0 = 100, K = 100, Tm = 30 / 365, r = 0.04;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("离散对冲实验：卖出 30 天平值看涨期权，对冲 N 次", "Discrete hedging lab: sell the 30-day ATM call, hedge it N times")}</div>
    <div class="demo-row">${seg("ba-n", [["1", "N = 1"], ["5", "N = 5"], ["10", "N = 10"], ["30", T("N = 30（每天）", "N = 30 (daily)")], ["120", "N = 120"], ["250", "N = 250"]], "30")}</div>
    <div class="demo-row">${seg("ba-jump", [["0", T("没有跳空", "No gap")], ["-0.08", T("第 15 天跳空 −8%", "−8% gap on day 15")], ["0.08", T("第 15 天跳空 +8%", "+8% gap on day 15")]], "0")}</div>
    <div class="demo-grid">
      ${slider("ba-imp", T("定价用的隐含波动率", "Implied vol used to price and hedge"), 10, 40, 1, 20)}
      ${slider("ba-real", T("实际发生的波动率", "Volatility that actually happens"), 10, 40, 1, 20)}
    </div>
    <div class="demo-math" id="ba-f"></div>
    <div id="ba-stats"></div>
    <div class="demo-label">${T("对冲后最终盈亏的分布（每股，400 条路径）", "Final hedged P&L per share (400 paths)")}</div>
    <div id="ba-hist"></div>
    <p class="demo-tip">${T("试试：N 从 1 点到 250，分布越收越窄，但收得很慢（大约按 1/√N）。再把“实际波动率”调到 25%：整个分布左移——卖方为低估波动率付出代价。最后打开 −8% 跳空：无论 N 多大，分布都整体挪到约 −2 美元，频繁调仓救不了跳跃。", "Try this: click N from 1 to 250 and the distribution narrows, but slowly (about 1/√N). Now set the realized vol to 25%: the whole distribution shifts left as the seller pays for underpricing volatility. Finally switch on the −8% gap: whatever N you pick, the distribution moves to about −$2. Faster rebalancing can't hedge a jump.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  function sim(seed, sigImp, sigReal) {
    const R = O.rng(seed), dt = Tm / N, jumpStep = Math.max(1, Math.round(N / 2));
    let S = S0;
    let cash = O.bsPrice({ S, K, T: Tm, r, sigma: sigImp, type: "call" });
    let sh = O.greeks({ S, K, T: Tm, r, sigma: sigImp, type: "call" }).delta;
    cash -= sh * S;
    for (let i = 1; i <= N; i++) {
      S *= Math.exp((r - sigReal * sigReal / 2) * dt + sigReal * Math.sqrt(dt) * R.normal());
      if (jump && i === jumpStep && N > 1) S *= 1 + jump; // the gap happens just before this rebalance
      cash *= Math.exp(r * dt);
      if (i < N) { const nd = O.greeks({ S, K, T: Tm - i * dt, r, sigma: sigImp, type: "call" }).delta; cash -= (nd - sh) * S; sh = nd; }
    }
    if (jump && N === 1) S *= 1 + jump;
    return cash + sh * S - Math.max(S - K, 0);
  }
  const draw = (v) => {
    const sigImp = v["ba-imp"] / 100, sigReal = v["ba-real"] / 100;
    const g = O.greeks({ S: S0, K, T: Tm, r, sigma: sigImp, type: "call" });
    const pnl = [];
    for (let i = 0; i < PATHS; i++) pnl.push(sim(9000 + i, sigImp, sigReal));
    const mean = pnl.reduce((a, x) => a + x, 0) / PATHS;
    const sd = Math.sqrt(pnl.reduce((a, x) => a + (x - mean) ** 2, 0) / (PATHS - 1));
    const dk = Math.sqrt(Math.PI / 4) * g.vegaRaw * sigImp / Math.sqrt(N);
    const expVol = g.price - O.bsPrice({ S: S0, K, T: Tm, r, sigma: sigReal, type: "call" });
    $("#ba-f").innerHTML = tex(String.raw`\sqrt{\tfrac{\pi}{4}}\,\nu\,\sigma\,\frac{1}{\sqrt{N}} = 0.886 \times ${g.vegaRaw.toFixed(2)} \times ${sigImp.toFixed(2)} \times \frac{1}{\sqrt{${N}}} = ${dk.toFixed(3)}`, true) +
      tex(String.raw`\E[\Pi]_{\text{${T("波动率差", "vol gap")}}} \approx C(\sigma_{\text{imp}}) - C(\sigma_{\text{real}}) = ${g.price.toFixed(2)} - ${(g.price - expVol).toFixed(2)} = ${expVol.toFixed(2)}`, true);
    $("#ba-stats").innerHTML = stats([
      [T("卖出价（权利金）", "Premium received"), "$" + g.price.toFixed(2)],
      [T("模拟：平均盈亏", "Simulated mean P&L"), (mean >= 0 ? "+" : "−") + "$" + Math.abs(mean).toFixed(2), mean >= 0.05 ? "pos" : mean <= -0.05 ? "neg" : undefined],
      [T("模拟：标准差", "Simulated std. deviation"), "$" + sd.toFixed(3), "acc"],
      [T("近似公式（无跳空、σ 相同时）", "Approximation (no gap, same σ)"), "$" + dk.toFixed(3)],
      [T("标准差 / 权利金", "Std. dev. / premium"), ((sd / g.price) * 100).toFixed(0) + "%"],
    ]);
    const lo = -4.5, hi = 2.5, w = 0.25, n = Math.round((hi - lo) / w), c = new Array(n).fill(0);
    for (const x of pnl) c[Math.max(0, Math.min(n - 1, Math.floor((x - lo) / w)))]++;
    $("#ba-hist").innerHTML = barChart({ bars: c.map((k, i) => ({ label: (lo + i * w).toFixed(1), value: (100 * k) / PATHS, cls: lo + (i + 0.5) * w >= 0 ? 3 : 2 })), yfmt: (y) => y.toFixed(0) + "%", xlabel: T("每股盈亏（美元；两端各含更远的结果）", "P&L per share ($; end bins include anything further out)"), H: 220 });
  };
  const run = bindSliders(root, { "ba-imp": (x) => x + "%", "ba-real": (x) => x + "%" }, draw);
  onSeg(root, "ba-n", (x) => { N = +x; run(); });
  onSeg(root, "ba-jump", (x) => { jump = +x; run(); });
}
