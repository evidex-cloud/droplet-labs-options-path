// Main demo for lesson probability-ev: the probability distribution of XYZ in 30 days drawn above the position's
// expiry P&L. Options are priced at σ = 20% (the pricing world, drift r); the reader sets the "real world" drift and
// volatility and sees P(ITM), P(profit) and the expected value change (numerical integration over the lognormal).
import * as O from "./_opt.js";
import { lineChart, payoffChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const Tm = 30 / 365, r = O.XYZ.r, iv = O.XYZ.sigma, df = Math.exp(-r * Tm);
  const px = (K, type) => O.bsPrice({ S: 100, K, T: Tm, r, sigma: iv, type });
  const L = (type, side, K) => ({ type, side, K, premium: px(K, type) });
  const POS = {
    c100: [T("买 100 看涨", "Long 100 call"), [L("call", "long", 100)]],
    c105: [T("买 105 看涨", "Long 105 call"), [L("call", "long", 105)]],
    c110: [T("买 110 看涨", "Long 110 call"), [L("call", "long", 110)]],
    p95: [T("买 95 看跌", "Long 95 put"), [L("put", "long", 95)]],
    sp95: [T("卖 95 看跌", "Short 95 put"), [L("put", "short", 95)]],
    sc105: [T("卖 105 看涨", "Short 105 call"), [L("call", "short", 105)]],
    sd: [T("买入跨式 100", "Long straddle 100"), [L("call", "long", 100), L("put", "long", 100)]],
  };
  let pos = "c110";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("把概率画在损益图上面", "Put the probabilities on top of the payoff")}</div>
    <div class="demo-row">${seg("pev-pos", Object.entries(POS).map(([k, v]) => [k, v[0]]), pos)}</div>
    <div class="demo-grid">
      ${slider("pev-mu", T("你认为的年化漂移 μ", "Your drift μ (per year)"), -20, 30, 1, 4)}
      ${slider("pev-sig", T("你认为的真实波动率", "Your real volatility"), 10, 45, 1, 20)}
    </div>
    <div class="demo-meta">${T("期权按 30 天、隐含波动率 20%、r 4% 定价（定价世界：μ = r = 4%，波动率 20%）。", "Options are priced for 30 days at 20% implied vol and r 4% (the pricing world: μ = r = 4%, volatility 20%).")}</div>
    <div class="demo-math" id="pev-f"></div>
    <div id="pev-stats"></div>
    <div id="pev-dist"></div>
    <div id="pev-pay"></div>
    <p class="demo-tip">${T("先别动滑块：每个头寸的期望值都是 0——价格里已经算好了概率。再把真实波动率调到 16%：买方期望值变负，卖方变正。把漂移拉到 20%，变化小得多。", "Start without touching the sliders: every position's expected value is 0, because the price already contains the odds. Then set real volatility to 16%: buyers go negative, sellers positive. Pull the drift up to 20% and notice how much smaller that effect is.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const lo = 70, hi = 135;
  const draw = (v) => {
    const mu = v["pev-mu"] / 100, sig = v["pev-sig"] / 100, legs = POS[pos][1];
    const prem = legs.reduce((a, l) => a + (l.side === "long" ? 1 : -1) * l.premium, 0);
    // numerical integration on a fine grid
    const n = 4000, a0 = 20, b0 = 260, h = (b0 - a0) / n;
    let eP = 0, pProf = 0, win = 0, winP = 0, loss = 0, lossP = 0, pITM = 0;
    const single = legs.length === 1 ? legs[0] : null;
    for (let i = 0; i <= n; i++) {
      const x = a0 + i * h, w = O.lognormalPdf(x, 100, Tm, sig, mu) * h;
      const pl = O.netPL(legs, x);
      eP += (pl + prem) * w;
      if (pl > 0) { pProf += w; win += pl * w; winP += w; } else if (pl < 0) { loss += pl * w; lossP += w; }
      if (single && (single.type === "call" ? x > single.K : x < single.K)) pITM += w;
    }
    const ev0 = df * eP - prem, ev = Math.abs(ev0) < 0.0005 ? 0 : ev0;
    const f2 = (x) => (Math.abs(x) < 0.005 ? "" : x > 0 ? "+" : "−") + Math.abs(x).toFixed(2);
    $("#pev-f").innerHTML = tex(String.raw`\E[\Pi] = e^{-rT}\,\E[\text{${en ? "payoff" : "到期价值"}}] - \text{${en ? "net premium" : "净权利金"}} = ${(df * eP).toFixed(3)} - (${prem.toFixed(3)}) = ${ev >= 0 ? "" : "-"}${Math.abs(ev).toFixed(3)}`, true)
      + (single ? tex(String.raw`P(\text{ITM}) = \N(d_2) = ${(pITM * 100).toFixed(1)}\%\quad(\mu = ${(mu * 100).toFixed(0)}\%,\ \sigma = ${(sig * 100).toFixed(0)}\%)`, true) : "");
    $("#pev-stats").innerHTML = stats([
      [T("到期实值概率", "P(in the money)"), single ? (pITM * 100).toFixed(1) + "%" : "—"],
      [T("盈利概率", "P(profit)"), (pProf * 100).toFixed(1) + "%", "acc"],
      [T("赢时平均盈利/股", "Average win / share"), winP > 0 ? "+" + (win / winP).toFixed(2) : "—", "pos"],
      [T("亏时平均亏损/股", "Average loss / share"), lossP > 0 ? "−" + Math.abs(loss / lossP).toFixed(2) : "—", "neg"],
      [T("期望值/股（折现）", "Expected value / share (PV)"), f2(ev), ev >= 0.005 ? "pos" : ev <= -0.005 ? "neg" : ""],
      [T("期望值/张", "Expected value / contract"), (Math.abs(ev * 100) < 0.5 ? "$" : ev > 0 ? "+$" : "−$") + Math.abs(ev * 100).toFixed(0)],
    ]);
    // profit bands from the expiry P&L
    const bands = [];
    let start = null;
    for (let x = lo; x <= hi + 1e-9; x += 0.25) {
      const p = O.netPL(legs, x) > 0;
      if (p && start === null) start = x;
      if ((!p || x + 0.25 > hi) && start !== null) { bands.push({ x0: start, x1: p ? hi : x, cls: 3 }); start = null; }
    }
    const same = Math.abs(mu - r) < 1e-9 && Math.abs(sig - iv) < 1e-9;
    $("#pev-dist").innerHTML = lineChart({
      xmin: lo, xmax: hi, ymin: 0, H: 210, xlabel: T("30 天后的 XYZ 价格", "XYZ price in 30 days"), ylabel: T("概率密度", "Probability density"), yfmt: () => "",
      bands,
      series: [
        { f: (x) => O.lognormalPdf(x, 100, Tm, sig, mu), cls: 1, area: true, label: T("你的世界", "Your world") },
        ...(same ? [] : [{ f: (x) => O.lognormalPdf(x, 100, Tm, iv, r), cls: 5, dashed: true, label: T("定价世界", "Pricing world") }]),
      ],
      markers: [...new Set(legs.map((l) => l.K))].map((k) => ({ x: k, label: "K " + k })),
    });
    $("#pev-pay").innerHTML = payoffChart({
      legs, lo, hi, spot: 100, mult: 100, H: 220,
      xlabel: T("到期时的 XYZ 价格", "XYZ price at expiry"), ylabel: T("盈亏（美元/张）", "P&L ($ per contract)"),
      labels: { expiry: T("到期盈亏（绿色区间 = 上图的盈利区）", "P&L at expiry (green = the profit zone shaded above)"), spot: T("今天", "today"), be: T("平衡", "BE") },
    }).html;
  };
  const run = bindSliders(root, { "pev-mu": (x) => x + "%", "pev-sig": (x) => x + "%" }, draw);
  onSeg(root, "pev-pos", (k) => { pos = k; run(); });
}
