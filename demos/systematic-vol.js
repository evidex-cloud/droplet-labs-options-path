// Main demo for lesson systematic-vol.
// Tab 1: a simulated 20-year index; compare buy-and-hold, a PUT-style monthly ATM put-write and a BXM-style buy-write.
// Tab 2: dispersion (short index variance, long single-stock variance) P&L as realized correlation varies.
// All market data is simulated (illustrative); the premium is Black-Scholes at IV = last month's vol + a VRP.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export const R_F = 0.04, TENOR = 30 / 365;

export function history(seed = 4, years = 20, severity = 1) {
  const R = O.rng(seed), n = years * 12, dt = 1 / 12, S = [100], sig = [];
  let stress = 0;
  for (let t = 0; t < n; t++) {
    let s = 0.13, j = 0;
    if (stress > 0) { s = 0.3; stress--; }
    else if (R() < 0.012) { stress = 2; s = 0.4; j = -0.1 * severity; }
    sig.push(s);
    S.push(S[t] * Math.exp((0.085 - (s * s) / 2) * dt + s * Math.sqrt(dt) * R.normal() + j));
  }
  return { S, sig, n };
}

export function strategies(h, vrp = 0.03) {
  const { S, sig, n } = h, g = Math.exp(R_F / 12), out = { idx: [], put: [], bw: [] };
  for (let t = 0; t < n; t++) {
    const s0 = S[t], s1 = S[t + 1], iv = (t ? sig[t - 1] : 0.13) + vrp;
    const p = O.bsPrice({ S: s0, K: s0, T: TENOR, r: R_F, sigma: iv, type: "put" });
    const c = O.bsPrice({ S: s0, K: s0, T: TENOR, r: R_F, sigma: iv, type: "call" });
    out.idx.push(s1 / s0 - 1);
    out.put.push((p * g - Math.max(s0 - s1, 0)) / s0 + (g - 1)); // cash-secured ATM put, premium and collateral earn T-bill
    out.bw.push((Math.min(s1, s0) + c * g) / s0 - 1); // long index, short ATM call
  }
  return out;
}

export function perf(rets) {
  const n = rets.length, m = rets.reduce((a, x) => a + x, 0) / n, sd = Math.sqrt(rets.reduce((a, x) => a + (x - m) ** 2, 0) / (n - 1));
  let eq = 1, pk = 1, dd = 0; const curve = [[0, 1]];
  rets.forEach((x, i) => { eq *= 1 + x; curve.push([(i + 1) / 12, eq]); pk = Math.max(pk, eq); dd = Math.min(dd, eq / pk - 1); });
  const rf = Math.exp(R_F / 12) - 1;
  return { cagr: eq ** (12 / n) - 1, vol: sd * Math.sqrt(12), sharpe: ((m - rf) / sd) * Math.sqrt(12), dd, curve, worst: Math.min(...rets) };
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let tab = "vrp", seed = 9;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("系统化卖波动率：两种“收割”方式", "Systematic short vol: two ways to harvest")}</div>
    ${seg("sv-tab", [["vrp", T("卖权 vs 买入持有", "Put-write vs buy-and-hold")], ["disp", T("离散度交易", "Dispersion trade")]], tab)}
    <div id="sv-pvrp">
      <div class="demo-grid">
        ${slider("sv-vrp", T("波动率风险溢价（隐含 − 已实现，波动率点）", "Volatility risk premium (implied − realized, vol pts)"), 0, 6, 0.5, 3)}
        ${slider("sv-sev", T("急跌的严重程度（×）", "Crash severity (×)"), 0, 2, 0.25, 1)}
      </div>
      <div class="demo-btns"><button type="button" class="demo-btn" id="sv-new">${T("换一段历史", "New history")}</button></div>
      <div id="sv-stats"></div>
      <div id="sv-chart"></div>
    </div>
    <div id="sv-pdisp" hidden>
      <div class="demo-grid">
        ${slider("sv-n", T("成分股数量 N（等权）", "Number of stocks N (equal weight)"), 5, 100, 5, 50)}
        ${slider("sv-ss", T("个股隐含波动率", "Single-stock implied vol"), 15, 50, 1, 30)}
        ${slider("sv-ix", T("指数隐含波动率", "Index implied vol"), 8, 30, 0.5, 20)}
        ${slider("sv-rr", T("实际实现的相关性", "Realized correlation"), 0, 100, 1, 30)}
      </div>
      <div class="demo-math" id="sv-df"></div>
      <div id="sv-dstats"></div>
      <div id="sv-dchart"></div>
    </div>
    <p class="demo-tip">${T("试试：把溢价调到 0，卖权策略就只剩下“替别人扛尾部”；把急跌严重度调到 2，看三条曲线在同一个月里一起掉。离散度页里把实现相关性拉到 0.8（危机时的样子），看收益如何翻成亏损。", "Try this: set the premium to 0 and put-writing is left with nothing but carrying someone else's tail; set crash severity to 2 and watch all three curves fall in the same month. On the dispersion tab, drag realized correlation to 0.8 (what crises look like) and watch the profit flip to a loss.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const pct = (x) => (x * 100).toFixed(1) + "%";

  const drawVrp = () => {
    const vrp = +$("#sv-vrp").value / 100, sev = +$("#sv-sev").value;
    const h = history(seed, 20, sev), st = strategies(h, vrp);
    const a = perf(st.idx), b = perf(st.put), c = perf(st.bw);
    $("#sv-stats").innerHTML = `<table><thead><tr><th></th><th>CAGR</th><th>${T("年化波动", "Volatility")}</th><th>${T("夏普", "Sharpe")}</th><th>${T("最大回撤", "Max DD")}</th><th>${T("最差月", "Worst month")}</th></tr></thead><tbody>${[
      [T("指数买入持有", "Index buy-and-hold"), a], [T("卖出平值看跌（PUT 式）", "ATM put-write (PUT-style)"), b], [T("备兑平值看涨（BXM 式）", "ATM buy-write (BXM-style)"), c],
    ].map(([l, p]) => `<tr><td>${l}</td><td>${pct(p.cagr)}</td><td>${pct(p.vol)}</td><td>${p.sharpe.toFixed(2)}</td><td>${pct(p.dd)}</td><td>${pct(p.worst)}</td></tr>`).join("")}</tbody></table>`;
    $("#sv-chart").innerHTML = lineChart({
      xmin: 0, xmax: 20, logY: true, xlabel: T("年", "Years"), ylabel: T("净值（对数刻度）", "Equity (log scale)"),
      series: [
        { points: a.curve, cls: 5, label: T("指数", "Index") },
        { points: b.curve, cls: 0, label: T("卖出看跌", "Put-write") },
        { points: c.curve, cls: 1, dashed: true, label: T("备兑看涨", "Buy-write") },
      ],
      yfmt: (v) => v.toFixed(1),
    });
  };
  const drawDisp = (v) => {
    const N = v["sv-n"], ss = v["sv-ss"] / 100, ix = v["sv-ix"] / 100, rr = v["sv-rr"] / 100;
    const w = 1 / N, own = N * w * w * ss * ss, cross = ss * ss * (1 - w * N * w); // Σw²σ² and Σ_{i≠j} w_i w_j σ²
    const rhoImp = (ix * ix - own) / cross;
    const pnl = (rho) => { const rvI = ss * ss * (w + (1 - w) * rho); return (ix * ix - rvI) * 1e4; }; // variance points, stock legs realize at implied
    const A = 1000; // $ per index variance point
    $("#sv-df").innerHTML =
      tex(String.raw`\rho_{\text{imp}} = \frac{\sigma_I^2 - \sum_i w_i^2\sigma_i^2}{\sum_{i \ne j} w_i w_j\sigma_i\sigma_j} = \frac{${ix.toFixed(3)}^2 - ${own.toFixed(5)}}{${cross.toFixed(5)}} = ${rhoImp.toFixed(3)}`, true) +
      tex(String.raw`\Pi \approx A\,\bar\sigma^2\Big(1 - \tfrac1N\Big)(\rho_{\text{imp}} - \rho_{\text{real}}) = ${A} \times ${(ss * ss * 1e4).toFixed(0)} \times ${(1 - w).toFixed(2)} \times (${rhoImp.toFixed(3)} - ${rr.toFixed(2)}) = ${(A * pnl(rr)).toFixed(0)}`, true);
    const ok = rhoImp > 0 && rhoImp < 1;
    $("#sv-dstats").innerHTML = stats([
      [T("隐含相关性", "Implied correlation"), ok ? rhoImp.toFixed(2) : T("超出 [0,1]：报价不一致", "outside [0,1]: inconsistent quotes"), ok ? "acc" : "neg"],
      [T("实现的指数波动率", "Realized index vol"), pct(Math.sqrt(ss * ss * (w + (1 - w) * rr)))],
      [T("离散度盈亏（示意，$）", "Dispersion P&L (illustrative, $)"), (A * pnl(rr) >= 0 ? "+$" : "−$") + Math.abs(A * pnl(rr)).toFixed(0), pnl(rr) >= 0 ? "pos" : "neg"],
    ]);
    $("#sv-dchart").innerHTML = lineChart({
      xmin: 0, xmax: 1, xlabel: T("实现相关性", "Realized correlation"), ylabel: T("盈亏 $", "P&L $"),
      series: [{ f: (x) => A * pnl(x), cls: 0, label: T("做空指数方差 + 做多个股方差", "Short index variance + long single-stock variance") }],
      markers: ok ? [{ x: rhoImp, label: T("隐含相关性", "implied ρ") }] : [], points: [{ x: rr, y: A * pnl(rr), cls: pnl(rr) >= 0 ? 3 : 2 }],
      yfmt: (v) => (v / 1000).toFixed(0) + "k",
    });
  };
  bindSliders(root, { "sv-vrp": (x) => x.toFixed(1), "sv-sev": (x) => x.toFixed(2) + "×" }, drawVrp);
  bindSliders(root, { "sv-n": String, "sv-ss": (x) => x + "%", "sv-ix": (x) => x + "%", "sv-rr": (x) => (x / 100).toFixed(2) }, drawDisp);
  $("#sv-new").addEventListener("click", () => { seed++; drawVrp(); });
  onSeg(root, "sv-tab", (v) => { tab = v; $("#sv-pvrp").hidden = v !== "vrp"; $("#sv-pdisp").hidden = v !== "disp"; });
}
