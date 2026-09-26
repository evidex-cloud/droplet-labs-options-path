// Inline demo for lesson stochastic-vol: Merton (1976) jump-diffusion smiles at 7 days, 30 days and 1 year.
// Price = Poisson-weighted sum of Black-Scholes prices (implemented here; the engine has no jump model), then inverted
// to implied vol with the engine's impliedVol.
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

function merton({ S, K, T, r, sigma, lam, muJ, delJ, type }) {
  const mbar = Math.exp(muJ + (delJ * delJ) / 2) - 1, lp = lam * (1 + mbar);
  let p = 0, w = Math.exp(-lp * T);
  for (let n = 0; n < 40; n++) {
    if (n > 0) w *= (lp * T) / n;
    if (n > 3 && w < 1e-12) break;
    const sn = Math.sqrt(sigma * sigma + (n * delJ * delJ) / T), rn = r - lam * mbar + (n * Math.log(1 + mbar)) / T;
    p += w * O.bsPrice({ S, K, T, r: rn, sigma: sn, type });
  }
  return p;
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S = 100, r = 0.04;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("跳跃扩散：短期两翼为什么那么陡", "Jump-diffusion: why short-dated wings are so steep")}</div>
    <div class="demo-grid">
      ${slider("mj-s", T("扩散波动率 σ", "Diffusion vol σ"), 5, 40, 1, 15)}
      ${slider("mj-l", T("每年平均跳跃次数 λ", "Jumps per year λ"), 0, 3, 0.1, 0.5)}
      ${slider("mj-m", T("平均跳跃幅度 μ_J", "Mean jump μ_J"), -25, 10, 1, -10)}
      ${slider("mj-d", T("跳跃幅度标准差 δ", "Jump std dev δ"), 1, 25, 1, 10)}
    </div>
    <div class="demo-math" id="mj-f"></div>
    <div id="mj-stats"></div>
    <div id="mj-chart"></div>
    <p class="demo-tip">${T("看什么：7 天的微笑两翼高高翘起，1 年的几乎是平的——跳跃的影响集中在短期。把 λ 拉到 0，三条线都塌成一条水平线（回到 Black-Scholes）。", "What to notice: the 7-day smile has towering wings while the 1-year smile is nearly flat — jump risk concentrates at short maturities. Set λ to 0 and all three collapse to one flat line (back to Black-Scholes).")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const mats = [[7, 2], [30, 0], [365, 1]];
  bindSliders(root, { "mj-s": (x) => x + "%", "mj-l": (x) => x.toFixed(1), "mj-m": (x) => x + "%", "mj-d": (x) => x + "%" }, (v) => {
    const P = { S, r, sigma: v["mj-s"] / 100, lam: v["mj-l"], muJ: v["mj-m"] / 100, delJ: v["mj-d"] / 100 };
    const iv = (K, Tm) => { const F = S * Math.exp(r * Tm), type = K >= F ? "call" : "put"; const x = O.impliedVol(merton({ ...P, K, T: Tm, type }), { S, K, T: Tm, r, type }); return isFinite(x) ? x * 100 : NaN; };
    const series = mats.map(([d, cls]) => {
      const pts = []; for (let K = 80; K <= 120.001; K += 2.5) { const y = iv(K, d / 365); if (isFinite(y)) pts.push([K, y]); }
      return { points: pts, cls, dots: true, label: d === 365 ? T("1 年", "1 year") : d + T(" 天", " days") };
    });
    const mbar = Math.exp(P.muJ + P.delJ * P.delJ / 2) - 1;
    const put30 = merton({ ...P, K: 90, T: 30 / 365, type: "put" });
    $("#mj-f").innerHTML = tex(String.raw`C = \sum_{n} \frac{e^{-\lambda' T}(\lambda' T)^{n}}{n!}\,C_{\text{BS}}(\sigma_n, r_n)`, true) + tex(String.raw`\lambda = ${P.lam.toFixed(1)}, \; \bar m = e^{\mu_J + \delta^2/2} - 1 = ${(mbar * 100).toFixed(2)}\%`, true);
    const a30 = iv(100, 30 / 365), w30 = iv(90, 30 / 365), a7 = iv(100, 7 / 365), w7 = iv(85, 7 / 365);
    const f = (x) => (isFinite(x) ? x.toFixed(1) + "%" : "–");
    $("#mj-stats").innerHTML = stats([
      [T("30 天 90 看跌价格", "30-day 90 put price"), "$" + put30.toFixed(3), "acc"],
      [T("30 天：90 看跌 IV / 平值 IV", "30 days: 90-put IV / ATM IV"), f(w30) + " / " + f(a30)],
      [T("7 天：85 看跌 IV / 平值 IV", "7 days: 85-put IV / ATM IV"), f(w7) + " / " + f(a7)],
      [T("总波动率（年化）", "Total vol (annualised)"), (Math.sqrt(P.sigma ** 2 + P.lam * (P.muJ ** 2 + P.delJ ** 2)) * 100).toFixed(1) + "%"],
    ]);
    $("#mj-chart").innerHTML = lineChart({ series, xmin: 80, xmax: 120, xlabel: T("行权价 K", "Strike K"), ylabel: T("隐含波动率（%）", "Implied vol (%)"), markers: [{ x: 100, label: "S" }] });
  });
}
