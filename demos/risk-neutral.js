// Main demo for lesson risk-neutral: sell the 1-year XYZ call at its Black-Scholes price and simulate 300 years
// of XYZ with a chosen REAL drift μ. The unhedged seller's result depends on μ; the delta-hedged seller's does not.
import * as O from "./_opt.js";
import { barChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let steps = 52, seed0 = 500;
  const PATHS = 300, S = 100, K = 100, Tm = 1, r = 0.04;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("漂移被对冲吃掉：300 个模拟年份", "The hedge eats the drift: 300 simulated years")}</div>
    <p class="demo-meta">${T("交易商按 Black-Scholes 价卖出 1 年期、行权价 100 的 XYZ 看涨期权（S = 100，r = 4%），然后要么放着不管，要么持有 Δ 股并定期调整。", "A dealer sells the 1-year, 100-strike XYZ call at its Black-Scholes price (S = 100, r = 4%), then either leaves it unhedged or holds Δ shares and rebalances on a schedule.")}</p>
    <div class="demo-row">${seg("rn-steps", [["12", T("每月调仓", "Monthly")], ["52", T("每周调仓", "Weekly")], ["252", T("每天调仓", "Daily")]], "52")}
      <div class="demo-btns" style="margin:0"><button class="demo-btn" data-new="1">${T("换一批路径", "New paths")}</button></div></div>
    <div class="demo-grid">
      ${slider("rn-mu", T("真实漂移 μ", "Real drift μ"), -10, 25, 1, 10)}
      ${slider("rn-v", T("波动率 σ（真实 = 定价用）", "Volatility σ (real = priced)"), 10, 40, 1, 20)}
    </div>
    <div class="demo-math" id="rn-f"></div>
    <div id="rn-stats"></div>
    <div class="demo-grid">
      <div><div class="demo-label">${T("不对冲的卖方：每股盈亏分布（横轴约 −50 到 +12）", "Unhedged seller: P&L per share (x-axis about −50 to +12)")}</div><div id="rn-h1"></div></div>
      <div><div class="demo-label">${T("对冲的卖方：每股盈亏分布（横轴只有 −4 到 +4）", "Hedged seller: P&L per share (x-axis only −4 to +4)")}</div><div id="rn-h2"></div></div>
    </div>
    <p class="demo-tip">${T("试试：把 μ 从 −10% 拖到 25%。左图整体滑动、平均值跟着 μ 大变；右图始终挤在 0 附近。再把调仓从每月换成每天，右图变得更窄——剩下的只是离散调仓的误差。", "Try this: drag μ from −10% to 25%. The left histogram slides and its average swings with μ; the right one stays bunched around 0. Switch from monthly to daily rebalancing and the right one narrows further: what remains is just the error from hedging in discrete steps.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const sgnf = (x, d = 2) => (x >= 0 ? "+" : "−") + Math.abs(x).toFixed(d);
  const hist = (xs, lo, hi, w, cls) => {
    const n = Math.round((hi - lo) / w), c = new Array(n).fill(0);
    for (const x of xs) c[Math.max(0, Math.min(n - 1, Math.floor((x - lo) / w)))]++;
    return barChart({ bars: c.map((k, i) => ({ label: (lo + i * w).toFixed(w < 1 ? 1 : 0), value: (100 * k) / xs.length, cls })), yfmt: (v) => v.toFixed(0) + "%", W: 330, H: 210 });
  };
  const draw = (v) => {
    const mu = v["rn-mu"] / 100, sigma = v["rn-v"] / 100;
    const prem = O.bsPrice({ S, K, T: Tm, r, sigma, type: "call" });
    const grown = prem * Math.exp(r * Tm);
    // exact real-world expected payoff: S e^{μT} N(d1) − K N(d2) with drift μ  (= bsPrice with r = 0, q = −μ)
    const eP = O.bsPrice({ S, K, T: Tm, r: 0, q: -mu, sigma, type: "call" });
    const hedged = [], unhedged = [];
    for (let i = 0; i < PATHS; i++) {
      const h = O.hedgeSim({ S0: S, K, T: Tm, r, sigmaImp: sigma, sigmaReal: sigma, steps, seed: seed0 + i, mu });
      hedged.push(h.pnl);
    }
    // the unhedged seller only needs the end price, so sample it directly (10,000 antithetic pairs) for a sharp average
    const RU = O.rng(seed0 + 77), m = (mu - sigma * sigma / 2) * Tm, s = sigma * Math.sqrt(Tm);
    for (let i = 0; i < 10000; i++) {
      const z = RU.normal();
      for (const e of [z, -z]) unhedged.push(grown - Math.max(S * Math.exp(m + s * e) - K, 0));
    }
    const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
    const sd = (a) => { const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };
    const mh = mean(hedged), sh = sd(hedged), mu_ = mean(unhedged), su = sd(unhedged);
    $("#rn-f").innerHTML = tex(String.raw`\underbrace{e^{-rT}\E^{\Q}[\text{payoff}]}_{\text{${T("价格", "price")}}} = ${prem.toFixed(2)}`, true) + tex(String.raw`\underbrace{e^{-rT}\E^{\P}[\text{payoff}]}_{\text{${T("混搭（错）", "mixed (wrong)")}}} = e^{-0.04} \times ${eP.toFixed(2)} = ${(eP * Math.exp(-r * Tm)).toFixed(2)}`, true);
    $("#rn-stats").innerHTML = stats([
      [T("卖出价（ℚ，不随 μ 变）", "Sale price (ℚ, ignores μ)"), "$" + prem.toFixed(2), "acc"],
      [T("不对冲：期望盈亏（精确）", "Unhedged: expected P&L (exact)"), sgnf(grown - eP), grown - eP >= 0 ? "pos" : "neg"],
      [T("不对冲：模拟平均 ± 标准误", "Unhedged: simulated mean ± s.e."), `${sgnf(mu_)} ± ${(su / Math.sqrt(unhedged.length / 2)).toFixed(2)}`],
      [T("对冲：模拟平均", "Hedged: simulated mean"), sgnf(mh)],
      [T("对冲：标准差", "Hedged: std. deviation"), sh.toFixed(2)],
      [T("不对冲：标准差", "Unhedged: std. deviation"), su.toFixed(2)],
    ]);
    $("#rn-h1").innerHTML = hist(unhedged, -52, 12, 4, 2);
    $("#rn-h2").innerHTML = hist(hedged, -4, 4, 0.5, 3);
  };
  const run = bindSliders(root, { "rn-mu": (x) => x + "%", "rn-v": (x) => x + "%" }, draw);
  onSeg(root, "rn-steps", (x) => { steps = +x; run(); });
  root.querySelector("[data-new]").addEventListener("click", () => { seed0 += PATHS; run(); });
}
