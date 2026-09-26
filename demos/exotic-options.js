// Main demo for lesson exotic-options: barrier (out / in), Asian, digital and lookback calls on XYZ.
// Analytic price (continuous monitoring) vs Monte Carlo with the chosen fixing frequency.
// Local helpers (not in the engine): a general down-and-out call for H above or below K (Reiner–Rubinstein / Haug),
// and the fixed-strike lookback call (Conze–Viswanathan). Both were checked against Monte Carlo.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

function downOut({ S, K, H, T, r, sigma }) {
  if (S <= H) return 0;
  if (K > H) return O.downOutCall({ S, K, H, T, r, sigma });
  const N = O.normCdf, sT = sigma * Math.sqrt(T), mu = (r - sigma * sigma / 2) / (sigma * sigma), dr = Math.exp(-r * T);
  const x2 = Math.log(S / H) / sT + (1 + mu) * sT, y2 = Math.log(H / S) / sT + (1 + mu) * sT;
  const B = S * N(x2) - K * dr * N(x2 - sT);
  const D = S * (H / S) ** (2 * (mu + 1)) * N(y2) - K * dr * (H / S) ** (2 * mu) * N(y2 - sT);
  return B - D;
}
function lookbackFixed({ S, K, T, r, sigma }) {
  const N = O.normCdf, sT = sigma * Math.sqrt(T), b = r;
  const f = (KK) => {
    const d1 = (Math.log(S / KK) + (b + sigma * sigma / 2) * T) / sT, d2 = d1 - sT;
    return S * N(d1) - KK * Math.exp(-r * T) * N(d2) + S * Math.exp(-r * T) * (sigma * sigma / (2 * b)) * (-((S / KK) ** (-2 * b / (sigma * sigma))) * N(d1 - (2 * b * Math.sqrt(T)) / sigma) + Math.exp(b * T) * N(d1));
  };
  return K >= S ? f(K) : Math.exp(-r * T) * (S - K) + f(S);
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let prod = "doc", freq = 252, mc = null;
  const r = 0.04, S0 = 100;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("奇异期权实验台：解析解 vs 蒙特卡洛", "Exotics lab: closed form vs Monte Carlo")}</div>
    <div class="demo-row">${seg("exo-p", [["doc", T("下跌敲出", "Down-and-out")], ["dic", T("下跌敲入", "Down-and-in")], ["asian", T("亚式（平均价）", "Asian (average)")], ["digital", T("数字（付 $100）", "Digital (pays $100)")], ["lookback", T("回望（最高价）", "Lookback (max)")]], prod)}</div>
    <div class="demo-grid">
      ${slider("exo-k", T("行权价 K", "Strike K"), 80, 120, 1, 100)}
      ${slider("exo-h", T("障碍 H（仅障碍期权）", "Barrier H (barriers only)"), 60, 99, 1, 90)}
      ${slider("exo-v", T("波动率 σ", "Volatility σ"), 10, 50, 1, 20)}
      ${slider("exo-t", T("到期天数", "Days to expiry"), 30, 730, 5, 365)}
    </div>
    <div class="demo-row"><span class="demo-label">${T("观察/取样频率", "Fixings (monitoring)")}</span>${seg("exo-f", [["12", T("每月", "Monthly")], ["52", T("每周", "Weekly")], ["252", T("每天", "Daily")]], "252")}
      <div class="demo-btns" style="margin:0"><button class="demo-btn" data-run="1">${T("跑蒙特卡洛（20,000 条路径）", "Run Monte Carlo (20,000 paths)")}</button></div></div>
    <div class="demo-math" id="exo-f"></div>
    <div id="exo-stats"></div>
    <div id="exo-chart"></div>
    <p class="demo-meta" id="exo-note"></p>
    <p class="demo-tip">${T("试试：把障碍从 90 拉到 97，敲出价暴跌、敲入价暴涨，但两者之和始终等于普通看涨；再把观察频率从“每天”换成“每月”，跑一次蒙特卡洛，敲出价明显变高。", "Try this: drag the barrier from 90 to 97 — the knock-out collapses and the knock-in soars, yet the two always add up to the vanilla. Then switch fixings from daily to monthly and rerun Monte Carlo: the knock-out is worth visibly more.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  let v = {};
  const inputs = () => ({ K: v["exo-k"], H: v["exo-h"], sigma: v["exo-v"] / 100, Tm: v["exo-t"] / 365 });

  function analytic() {
    const { K, H, sigma, Tm } = inputs();
    const van = O.bsPrice({ S: S0, K, T: Tm, r, sigma, type: "call" });
    const steps = Math.max(1, Math.round(freq * Tm)), dt = Tm / steps;
    const Hs = H * Math.exp(-0.5826 * sigma * Math.sqrt(dt)); // Broadie–Glasserman–Kou shift
    const out = { van, steps, Hs };
    if (prod === "doc") { out.cont = downOut({ S: S0, K, H, T: Tm, r, sigma }); out.disc = downOut({ S: S0, K, H: Hs, T: Tm, r, sigma }); }
    if (prod === "dic") { out.cont = van - downOut({ S: S0, K, H, T: Tm, r, sigma }); out.disc = van - downOut({ S: S0, K, H: Hs, T: Tm, r, sigma }); }
    if (prod === "asian") out.cont = O.asianGeometric({ S: S0, K, T: Tm, r, sigma, type: "call" });
    if (prod === "digital") out.cont = 100 * O.digital({ S: S0, K, T: Tm, r, sigma });
    if (prod === "lookback") out.cont = lookbackFixed({ S: S0, K, T: Tm, r, sigma });
    return out;
  }

  function runMC() {
    const { K, H, sigma, Tm } = inputs();
    const steps = Math.max(1, Math.round(freq * Tm)), n = 20000, R = O.rng(20260926), df = Math.exp(-r * Tm);
    const geo = O.asianGeometric({ S: S0, K, T: Tm, r, sigma, type: "call" });
    let s1 = 0, s2 = 0, g1 = 0, g2 = 0, ag = 0;
    const dt = Tm / steps, drift = (r - sigma * sigma / 2) * dt, vol = sigma * Math.sqrt(dt);
    for (let i = 0; i < n; i++) {
      let S = S0, mn = S0, mx = S0, sum = 0, lsum = 0;
      for (let j = 0; j < steps; j++) { S *= Math.exp(drift + vol * R.normal()); if (S < mn) mn = S; if (S > mx) mx = S; sum += S; lsum += Math.log(S); }
      let x = 0, y = 0;
      if (prod === "doc") x = mn <= H ? 0 : Math.max(S - K, 0);
      else if (prod === "dic") x = mn <= H ? Math.max(S - K, 0) : 0;
      else if (prod === "digital") x = S > K ? 100 : 0;
      else if (prod === "lookback") x = Math.max(mx - K, 0);
      else { x = Math.max(sum / steps - K, 0); y = Math.max(Math.exp(lsum / steps) - K, 0); }
      x *= df; y *= df;
      s1 += x; s2 += x * x; g1 += y; g2 += y * y; ag += x * y;
    }
    const m = s1 / n, va = Math.max(s2 / n - m * m, 0), res = { price: m, se: Math.sqrt(va / n), steps };
    if (prod === "asian") {
      const mg = g1 / n, vg = Math.max(g2 / n - mg * mg, 1e-16), cov = ag / n - m * mg, beta = cov / vg;
      res.cv = m - beta * (mg - geo); res.cvse = Math.sqrt(Math.max(va - 2 * beta * cov + beta * beta * vg, 0) / n); res.corr = cov / Math.sqrt(va * vg || 1);
    }
    return res;
  }

  function draw() {
    const a = analytic(), { K, H, sigma, Tm } = inputs();
    const f2 = (x) => x.toFixed(2);
    let f;
    if (prod === "doc") f = [String.raw`C_{\text{out}} = C - C_{\text{in}} = ${f2(a.van)} - ${f2(a.van - a.cont)} = ${f2(a.cont)}`, String.raw`H^{*} = H e^{-0.5826\,\sigma\sqrt{\Delta t}} = ${a.Hs.toFixed(2)}`];
    else if (prod === "dic") f = String.raw`C_{\text{in}} = C - C_{\text{out}} = ${f2(a.van)} - ${f2(a.van - a.cont)} = ${f2(a.cont)}`;
    else if (prod === "asian") f = String.raw`\sigma_G = \frac{\sigma}{\sqrt{3}} = \frac{${sigma.toFixed(2)}}{\sqrt{3}} = ${(sigma / Math.sqrt(3)).toFixed(4)} \;\Rightarrow\; C_{\text{geo}} = ${f2(a.cont)}`;
    else if (prod === "digital") { const { d2 } = O.d1d2({ S: S0, K, T: Tm, r, sigma }); f = String.raw`100\,e^{-rT}\N(d_2) = 100 \times ${Math.exp(-r * Tm).toFixed(4)} \times ${O.normCdf(d2).toFixed(4)} = ${f2(a.cont)}`; }
    else f = [String.raw`\text{${T("收益", "payoff")}} = \max(S_{\max} - K, 0)`, String.raw`C_{\text{${T("回望", "lookback")}}} = ${f2(a.cont)} = ${(a.cont / a.van).toFixed(2)} \times C`];
    $("#exo-f").innerHTML = [].concat(f).map((x) => tex(x, true)).join("");
    const rows = [
      [T("普通看涨 C", "Vanilla call C"), "$" + f2(a.van)],
      [T("解析解（连续观察）", "Closed form (continuous)"), "$" + f2(a.cont), "acc"],
      [T("相对普通看涨", "vs vanilla"), (a.cont / a.van * 100).toFixed(0) + "%"],
    ];
    if (a.disc != null) rows.push([T("离散观察修正（BGK）", "Discrete fixings (BGK)"), "$" + f2(a.disc)]);
    if (mc) {
      rows.push([T("蒙特卡洛 ± 标准误", "Monte Carlo ± SE"), "$" + f2(mc.price) + " ± " + mc.se.toFixed(3)]);
      if (mc.cv != null) rows.push([T("控制变量后 ± 标准误", "With control variate ± SE"), "$" + f2(mc.cv) + " ± " + mc.cvse.toFixed(4), "pos"]);
    }
    $("#exo-stats").innerHTML = stats(rows);
    // preview paths (cheap): 12 paths with the chosen number of fixings
    const steps = Math.max(1, Math.round(freq * Tm)), R = O.rng(7), days = v["exo-t"];
    const series = [];
    let hits = 0;
    for (let i = 0; i < 12; i++) {
      const p = O.gbmPath(R, S0, r, sigma, Tm, Math.min(steps, 260));
      const touched = Math.min(...p) <= H;
      if (touched) hits++;
      const isBar = prod === "doc" || prod === "dic";
      series.push({ points: p.map((s, j) => [(j / (p.length - 1)) * days, s]), cls: isBar ? (touched ? 2 : 0) : prod === "lookback" ? 1 : 0 });
    }
    const hl = [{ y: K, label: "K" }];
    if (prod === "doc" || prod === "dic") hl.push({ y: H, label: "H" });
    $("#exo-chart").innerHTML = lineChart({ series, xmin: 0, xmax: days, xlabel: T("天数", "Days"), ylabel: "XYZ", hlines: hl, H: 240 });
    let note;
    if (prod === "doc" || prod === "dic") note = T(`12 条示例路径里有 ${hits} 条碰到 H = ${H}（红色）：它们让敲出期权作废，让敲入期权生效。`, `${hits} of the 12 sample paths touch H = ${H} (red): they kill the knock-out and switch on the knock-in.`);
    else if (prod === "asian") note = mc ? T(`算术平均与几何平均的相关系数 ${mc.corr.toFixed(4)}：用已知精确解的几何亚式做控制变量，误差大幅缩小。`, `Arithmetic and geometric payoffs are ${mc.corr.toFixed(4)} correlated, so the exactly-priced geometric Asian makes a powerful control variate.`) : T("解析解是连续几何平均；合约用算术平均，要靠蒙特卡洛。", "The closed form is for a continuous geometric average; real contracts average arithmetically — run Monte Carlo.");
    else if (prod === "digital") note = T("数字期权只问“到期在不在 K 之上”，路径形状无关；蒙特卡洛只是在核对概率。", "A digital only asks whether the price ends above K; the path shape is irrelevant, so Monte Carlo is just checking a probability.");
    else note = T("解析解假设连续观察最高价；离散取样会漏掉路径中间的高点，所以蒙特卡洛价偏低。", "The closed form watches the maximum continuously; discrete fixings miss intraday highs, so the Monte Carlo price is lower.");
    $("#exo-note").textContent = note;
  }

  const spec = { "exo-k": (x) => "$" + x, "exo-h": (x) => "$" + x, "exo-v": (x) => x + "%", "exo-t": (x) => x + T(" 天", " days") };
  const run = bindSliders(root, spec, (vals) => { v = vals; mc = null; draw(); });
  onSeg(root, "exo-p", (x) => { prod = x; mc = null; run(); });
  onSeg(root, "exo-f", (x) => { freq = +x; mc = null; run(); });
  root.querySelector("[data-run]").addEventListener("click", () => { mc = runMC(); draw(); });
}
