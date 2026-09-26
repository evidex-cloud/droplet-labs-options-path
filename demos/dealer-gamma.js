// Main demo for lesson dealer-gamma: a stylised XYZ options market. Choose who holds what, compare the "vendor GEX"
// (open interest + the usual sign convention) with the dealers' true gamma, and simulate a month of prices in which
// the dealers' hedging feeds back into the stock: ΔS = ε / (1 + G/D).
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

// dealer net position per strike, in contracts (+ = dealers long). Illustrative, 30 days to expiry.
const PRESETS = {
  hedge: [ // customers sell calls (overwriting) and buy puts (protection): the textbook convention is right
    { type: "call", K: 100, n: 20000 }, { type: "call", K: 105, n: 40000 }, { type: "call", K: 110, n: 30000 },
    { type: "put", K: 100, n: -15000 }, { type: "put", K: 95, n: -40000 }, { type: "put", K: 90, n: -30000 },
  ],
  frenzy: [ // customers BUY upside calls: dealers are short them, but the convention still counts calls as dealer-long
    { type: "call", K: 105, n: -40000 }, { type: "call", K: 110, n: -50000 }, { type: "call", K: 100, n: -10000 },
    { type: "put", K: 95, n: -20000 }, { type: "put", K: 90, n: -10000 },
  ],
  income: [ // customers sell both calls and puts (income funds, put-writers): dealers long gamma everywhere
    { type: "call", K: 100, n: 30000 }, { type: "call", K: 105, n: 40000 },
    { type: "put", K: 100, n: 20000 }, { type: "put", K: 95, n: 30000 },
  ],
};
const r = 0.04, SIG = 0.2, DAYS0 = 30, STEPS_PER_DAY = 4, NSTEP = DAYS0 * STEPS_PER_DAY;

// gamma in shares per $1 of the dealers' book: true (their actual positions) and vendor (OI with calls +, puts −)
function bookGamma(pos, S, days, vendor) {
  if (days <= 0) return 0;
  let g = 0;
  for (const p of pos) {
    const gm = O.greeks({ S, K: p.K, T: days / 365, r, sigma: SIG, type: p.type }).gamma;
    const n = vendor ? (p.type === "call" ? 1 : -1) * Math.abs(p.n) : p.n;
    g += n * 100 * gm;
  }
  return g;
}
function flip(pos, days, vendor) {
  // scan from 80 to 120 for the sign change closest to 100
  let best = null, prev = bookGamma(pos, 80, days, vendor);
  for (let S = 80.5; S <= 120; S += 0.5) {
    const g = bookGamma(pos, S, days, vendor);
    if ((prev < 0 && g >= 0) || (prev > 0 && g <= 0)) {
      let lo = S - 0.5, hi = S;
      for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; const gm = bookGamma(pos, m, days, vendor); if ((gm >= 0) === (g >= 0)) hi = m; else lo = m; }
      const x = (lo + hi) / 2;
      if (best == null || Math.abs(x - 100) < Math.abs(best - 100)) best = x;
    }
    prev = g;
  }
  return best;
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let preset = "hedge", seed = 7;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("做市商 Gamma 实验室：GEX 估计 vs 真实持仓，以及它对价格路径的影响", "Dealer-gamma lab: estimated GEX vs true positions, and what they do to the price path")}</div>
    <div class="demo-row">${seg("dg-p", [["hedge", T("客户卖看涨、买看跌", "Customers sell calls, buy puts")], ["frenzy", T("客户疯买看涨", "Call-buying frenzy")], ["income", T("客户卖出一切（收益型）", "Customers sell everything (income)")]], preset)}</div>
    <div id="dg-table"></div>
    <div class="demo-grid">
      ${slider("dg-d", T("市场深度 D（推动 1 美元需要的股数，百万）", "Market depth D (shares to move XYZ $1, millions)"), 0.5, 6, 0.5, 2)}
      ${slider("dg-s", T("看 GEX 的现价 S", "Spot for the GEX reading S"), 85, 115, 0.5, 100)}
    </div>
    <div class="demo-math" id="dg-f"></div>
    <div id="dg-stats"></div>
    <div id="dg-curve"></div>
    <div class="demo-btns"><button type="button" class="demo-btn" data-act="seed">${T("换一组随机冲击", "New random shocks")}</button></div>
    <div id="dg-path"></div>
    <div id="dg-stats2"></div>
    <p class="demo-tip">${T("试试：在“客户疯买看涨”里，供应商式 GEX 显示为正（看似稳定），真实 Gamma 却为负——路径被放大。把深度 D 调小，反馈更强；到期前几天，价格在大持仓行权价附近的行为最明显。", "Try this: under “Call-buying frenzy” the vendor-style GEX reads positive (looks calm) while the true gamma is negative, and the path gets amplified. Shrink the depth D to strengthen the feedback; the effect is strongest near large strikes in the last few days.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const M = (x) => (x / 1e6).toFixed(1) + "M";
  const draw = (v) => {
    const pos = PRESETS[preset], D = v["dg-d"] * 1e6, S0 = v["dg-s"];
    $("#dg-table").innerHTML = `<table><thead><tr><th>${T("合约", "Contract")}</th><th>${T("未平仓量（OI）", "Open interest")}</th><th>${T("做市商真实持仓", "Dealers actually hold")}</th><th>${T("惯例假设", "Convention assumes")}</th></tr></thead><tbody>${pos.map((p) => `<tr${(p.type === "call") !== (p.n > 0) ? ' class="hl"' : ""}><td>${p.K} ${p.type === "call" ? T("看涨", "call") : T("看跌", "put")}</td><td>${Math.abs(p.n).toLocaleString("en-US")}</td><td>${p.n > 0 ? T("多 ", "long ") : T("空 ", "short ")}${Math.abs(p.n).toLocaleString("en-US")}</td><td>${p.type === "call" ? T("多", "long") : T("空", "short")}</td></tr>`).join("")}</tbody></table>`;
    const gT = bookGamma(pos, S0, DAYS0, false), gV = bookGamma(pos, S0, DAYS0, true);
    const gexT = gT * S0 * S0 * 0.01, gexV = gV * S0 * S0 * 0.01;
    const mult = 1 / Math.max(0.25, 1 + gT / D);
    $("#dg-f").innerHTML = tex(String.raw`\begin{aligned} \text{GEX}_{\text{${T("真实", "true")}}} &= \sum_i n_i\,\Gamma_i \times 100 \times S^2 \times 1\% \\ &= ${(gexT / 1e6).toFixed(1)}\text{M}\ \text{${T("美元/1\\% 波动", "per 1\\% move")}} \end{aligned}`, true)
      + tex(String.raw`\begin{aligned} \Delta S &= \frac{\varepsilon}{1 + G/D} \\[6pt] &= \frac{\varepsilon}{1 ${gT < 0 ? "-" : "+"} ${(Math.abs(gT) / 1e6).toFixed(3)}/${(D / 1e6).toFixed(1)}} = ${mult.toFixed(2)}\,\varepsilon \end{aligned}`, true)
      + `<p class="demo-meta">${T("G 和 D 都以百万股计。", "G and D in millions of shares.")}${1 + gT / D < 0.25 ? T("反馈太强时，这个简单模型会发散，演示把乘数封顶在 4 倍。", " When the feedback is this strong the simple model blows up, so the demo caps the multiplier at 4×.") : ""}</p>`;
    const fT = flip(pos, DAYS0, false), fV = flip(pos, DAYS0, true);
    $("#dg-stats").innerHTML = stats([
      [T("供应商式 GEX（按惯例）", "Vendor-style GEX (convention)"), (gexV >= 0 ? "+" : "−") + "$" + M(Math.abs(gexV)), gexV >= 0 ? "pos" : "neg"],
      [T("真实 GEX", "True GEX"), (gexT >= 0 ? "+" : "−") + "$" + M(Math.abs(gexT)), gexT >= 0 ? "pos" : "neg"],
      [T("真实翻转点", "True flip level"), fT == null ? T("无", "none") : "$" + fT.toFixed(1), "acc"],
      [T("惯例翻转点", "Convention flip level"), fV == null ? T("无", "none") : "$" + fV.toFixed(1)],
      [T("此处冲击被乘以", "Shocks here are multiplied by"), mult.toFixed(2) + "×", mult < 1 ? "pos" : "neg"],
    ]);
    $("#dg-curve").innerHTML = lineChart({
      xmin: 85, xmax: 115, xlabel: T("XYZ 现价（30 天到期）", "XYZ spot (30 days to expiry)"), ylabel: T("GEX（百万美元/1%）", "GEX ($M per 1% move)"),
      series: [
        { f: (x) => bookGamma(pos, x, DAYS0, false) * x * x * 0.01 / 1e6, cls: 0, label: T("真实 GEX", "True GEX") },
        { f: (x) => bookGamma(pos, x, DAYS0, true) * x * x * 0.01 / 1e6, cls: 5, dashed: true, label: T("惯例 GEX（只看 OI）", "Convention GEX (OI only)") },
      ],
      samples: 90, markers: [{ x: S0, label: "S" }, ...(fT != null ? [{ x: fT, label: T("翻转", "flip") }] : [])],
    });
    // simulate 30 days, 4 steps a day, with and without dealer hedging feedback (same shocks)
    const R = O.rng(seed), sd = 100 * SIG / Math.sqrt(365 * STEPS_PER_DAY);
    let Sa = 100, Sb = 100;
    const pa = [[0, 100]], pb = [[0, 100]];
    let va = 0, vb = 0;
    for (let i = 0; i < NSTEP; i++) {
      const e = sd * R.normal(), days = DAYS0 - i / STEPS_PER_DAY;
      const G = bookGamma(pos, Sa, days, false);
      const na = Math.max(1, Sa + e / Math.max(0.25, 1 + G / D));
      const nb = Math.max(1, Sb + e);
      va += Math.log(na / Sa) ** 2; vb += Math.log(nb / Sb) ** 2;
      Sa = na; Sb = nb;
      pa.push([(i + 1) / STEPS_PER_DAY, Sa]); pb.push([(i + 1) / STEPS_PER_DAY, Sb]);
    }
    const ann = (v) => Math.sqrt((v / NSTEP) * 365 * STEPS_PER_DAY);
    const strikes = [...new Set(pos.map((p) => p.K))];
    $("#dg-path").innerHTML = lineChart({
      xmin: 0, xmax: DAYS0, xlabel: T("天数（到期日在第 30 天）", "Day (expiry on day 30)"), ylabel: "XYZ",
      series: [
        { points: pb, cls: 5, dashed: true, label: T("没有做市商对冲", "No dealer hedging") },
        { points: pa, cls: 0, label: T("有做市商对冲反馈", "With dealer hedging feedback") },
      ],
      hlines: strikes.map((k) => ({ y: k, label: "K " + k })),
    });
    const rvA = ann(va), rvB = ann(vb);
    $("#dg-stats2").innerHTML = stats([
      [T("实现波动率：无对冲", "Realized vol: no hedging"), (rvB * 100).toFixed(1) + "%"],
      [T("实现波动率：有反馈", "Realized vol: with feedback"), (rvA * 100).toFixed(1) + "%", rvA < rvB ? "pos" : "neg"],
      [T("到期价：有反馈", "Price at expiry: with feedback"), "$" + Sa.toFixed(2), "acc"],
      [T("到期价：无对冲", "Price at expiry: no hedging"), "$" + Sb.toFixed(2)],
    ]);
  };
  const spec = { "dg-d": (x) => (+x).toFixed(1) + "M", "dg-s": (x) => "$" + (+x).toFixed(1) };
  const rerun = bindSliders(root, spec, draw);
  onSeg(root, "dg-p", (v) => { preset = v; rerun(); });
  root.querySelector('[data-act="seed"]').addEventListener("click", () => { seed = (seed * 17 + 3) % 1000; rerun(); });
}
