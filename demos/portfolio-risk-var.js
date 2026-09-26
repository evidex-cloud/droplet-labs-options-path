// Inline demo for lesson portfolio-risk: Value at Risk three ways — delta-normal (linear), delta-gamma, and full revaluation
// by Monte Carlo — for a small XYZ book over a chosen horizon.
import * as O from "./_opt.js";
import { barChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

const r = 0.04, Tm = 30 / 365, S0 = 100, IV = 0.2, N = 4000;
const px = (type, K) => O.bsPrice({ S: S0, K, T: Tm, r, sigma: IV, type });
const L = (type, side, K, qty = 1) => (type === "stock" ? { type, side, entry: S0, qty } : { type, side, K, qty, T: Tm, premium: px(type, K) });
const BOOKS = {
  income: [L("stock", "long"), L("call", "short", 105), L("put", "short", 95, 2)],
  strangle: [L("call", "short", 105), L("put", "short", 95)],
  straddle: [L("call", "long", 100), L("put", "long", 100)],
};

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let book = "income", conf = "0.99";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("风险价值（VaR）三种算法：线性、Delta-Gamma、完整重估", "Value at Risk three ways: linear, delta-gamma, full revaluation")}</div>
    <div class="demo-row">${seg("pv-book", [["income", T("小凯的收入账", "Kai's income book")], ["strangle", T("卖宽跨", "Short strangle")], ["straddle", T("买跨式", "Long straddle")]], book)}
      ${seg("pv-c", [["0.95", "95%"], ["0.99", "99%"]], conf)}</div>
    ${slider("pv-h", T("持有期（天）", "Horizon (days)"), 1, 20, 1, 10)}
    <div class="demo-math" id="pv-f"></div>
    <div id="pv-s"></div>
    <div id="pv-h2"></div>
    <p class="demo-tip">${T("看什么：对卖期权的账，线性 VaR 明显低估左尾，持有期越长低估越多；对买跨式的账，线性 VaR 反而把风险说大了——因为它看不见 Gamma。", "What to notice: for books that sell options, linear VaR clearly understates the left tail, more so as the horizon lengthens; for the long straddle it overstates the risk — because it cannot see gamma.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const usd = (x) => "$" + x.toLocaleString("en-US", { maximumFractionDigits: 0 });
  const draw = (v) => {
    const h = v["pv-h"], t = h / 365, c = +conf, z = O.normInv(c);
    const legs = BOOKS[book];
    const g = O.positionGreeks(legs, S0, { sigma: IV, r });
    const d = g.delta * 100, gm = g.gamma * 100;
    const base = O.netPLAt(legs, S0, { elapsed: t, sigma: IV, r }) * 100; // removes pure time decay from the comparison
    const R = O.rng(17), full = [], dgs = [];
    for (let i = 0; i < N; i++) {
      const S = S0 * Math.exp(-0.5 * IV * IV * t + IV * Math.sqrt(t) * R.normal()), dS = S - S0;
      full.push(O.netPLAt(legs, S, { elapsed: t, sigma: IV, r }) * 100 - base);
      dgs.push(d * dS + 0.5 * gm * dS * dS);
    }
    const q = (a) => { const s = a.slice().sort((x, y) => x - y); return -s[Math.floor(N * (1 - c))]; };
    const lin = Math.abs(d) * S0 * IV * Math.sqrt(t) * z, vDG = q(dgs), vFull = q(full);
    $("#pv-f").innerHTML = tex(String.raw`\text{VaR}_{\text{${T("线性", "linear")}}} = z_{${(c * 100).toFixed(0)}\%}\,|\Delta|\,S\,\sigma\sqrt{h}`, true) + tex(String.raw`= ${z.toFixed(2)} \times ${Math.abs(d).toFixed(1)} \times 100 \times 0.2 \times \sqrt{${h}/365} = \$${lin.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, "{,}")}`, true);
    $("#pv-s").innerHTML = stats([
      [T("线性（只用 Delta）", "Linear (delta only)"), usd(lin)],
      ["Delta-Gamma", usd(Math.max(vDG, 0))],
      [T("完整重估（蒙特卡洛）", "Full revaluation (Monte Carlo)"), usd(Math.max(vFull, 0)), "acc"],
      [T("线性 ÷ 完整", "Linear ÷ full"), vFull > 0 ? (lin / vFull).toFixed(2) + "×" : "–"],
    ]);
    const lo = Math.min(...full), hi = Math.max(...full), nb = 30, w = (hi - lo) / nb || 1, counts = new Array(nb).fill(0);
    for (const x of full) counts[Math.min(nb - 1, Math.floor((x - lo) / w))]++;
    $("#pv-h2").innerHTML = barChart({
      H: 200, xlabel: T(`${h} 天后的损益分布（完整重估，美元；红 = 低于 VaR 线）`, `P&L after ${h} days (full revaluation, $; red = beyond the VaR line)`),
      bars: counts.map((k, i) => { const mid = lo + (i + 0.5) * w; return { label: (mid < 0 ? "−" : "") + Math.abs(Math.round(mid)).toLocaleString("en-US"), value: k, cls: mid < -vFull ? 2 : 5 }; }),
    });
  };
  const run = bindSliders(root, { "pv-h": (x) => x + T(" 天", " days") }, draw);
  onSeg(root, "pv-book", (x) => { book = x; run(); });
  onSeg(root, "pv-c", (x) => { conf = x; run(); });
}
