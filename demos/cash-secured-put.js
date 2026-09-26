// Main demo for lesson cash-secured-put: a 12-month "wheel" simulator versus buy-and-hold.
// Start with $10,000 cash. Each 30-day cycle: with no shares, sell a cash-secured put; if assigned, own 100 shares and
// sell a covered call; if called away, go back to cash. Options are priced with Black-Scholes at the implied vol;
// the stock follows a seeded geometric Brownian motion with its own realized vol and drift. Cash earns r.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S0 = 100, r = 0.04, CYC = 12, D = 30, dt = 1 / 365;
  let seed = 7, rule = "basis", v = {};
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("轮动策略模拟器：12 个月，对比买入持有", "Wheel simulator: 12 months versus buy-and-hold")}</div>
    <div class="demo-grid">
      ${slider("csp-mp", T("卖出看跌的行权价（现价的 %）", "Put strike (% of current price)"), 88, 100, 1, 95)}
      ${slider("csp-mc", T("卖出看涨的行权价（现价的 %）", "Call strike (% of current price)"), 100, 112, 1, 105)}
      ${slider("csp-iv", T("隐含波动率（期权按它定价）", "Implied vol (options priced at)"), 10, 50, 1, 20)}
      ${slider("csp-rv", T("实际波动率（股价按它走）", "Realized vol (the stock moves with)"), 10, 60, 1, 20)}
      ${slider("csp-mu", T("股票的真实年化漂移", "Stock's real drift per year"), -30, 30, 1, 8)}
    </div>
    <div class="demo-row">${seg("csp-rule", [["basis", T("看涨行权价不低于持股成本", "Call strike never below cost basis")], ["pct", T("看涨行权价只看现价", "Call strike from current price only")]], rule)}
      <button type="button" class="demo-btn" id="csp-new">${T("换一条价格路径", "New price path")}</button></div>
    <div id="csp-chart"></div>
    <div id="csp-stats"></div>
    <div class="demo-label">${T("300 条路径的统计（同样的参数）", "Across 300 paths (same settings)")}</div>
    <div id="csp-sum"></div>
    <div class="demo-label">${T("这条路径的逐月记录（看跌行权价不超过“现金 ÷ 100”，保证始终有足额现金担保）", "Month-by-month log of this path (the put strike never exceeds cash ÷ 100, so the put is always fully cash-secured)")}</div>
    <div id="csp-log"></div>
    <p class="demo-tip">${T("试试：把实际波动率调到 40%、隐含波动率留在 20%——卖出的保险太便宜：轮动仍在约一半路径上胜出，但平均结果远低于持有，因为它错过大涨、却照单全收大跌。再反过来（隐含 30%、实际 20%）：平均结果超过持有，但最差的 5% 路径仍亏约一成。", "Try this: set realized vol to 40% and leave implied vol at 20% — the insurance you sell is too cheap: the wheel still wins on about half the paths, but its average ends far below holding, because it misses the big rallies and takes the big falls in full. Then flip it (implied 30%, realized 20%): the average now beats holding, yet the worst 5% of paths still lose around 10%.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const round = (x) => Math.round(x * 2) / 2;
  // one path of the wheel; returns final values and (optionally) the daily equity curve + a log
  function wheel(R, p, keep) {
    const path = O.gbmPath(R, S0, p.mu, p.rv, CYC * D * dt, CYC * D);
    let cash = 10000, sh = 0, basis = 0, prem = 0, assigned = 0, called = 0;
    const eq = keep ? [[0, 10000]] : null, bh = keep ? [[0, 10000]] : null, log = keep ? [] : null;
    for (let m = 0; m < CYC; m++) {
      const d0 = m * D, S = path[d0];
      let type, K;
      if (sh === 0) { type = "put"; K = Math.min(round(S * p.mp), Math.floor(cash / 100)); }
      else { type = "call"; K = round(S * p.mc); if (rule === "basis") K = Math.max(K, basis); }
      const px = O.bsPrice({ S, K, T: D * dt, r, sigma: p.iv, type });
      cash += px * 100; prem += px * 100;
      for (let d = 1; d <= D; d++) {
        cash *= Math.exp(r * dt);
        if (keep) { const St = path[d0 + d], left = (D - d) * dt; const opt = O.bsPrice({ S: St, K, T: left, r, sigma: p.iv, type }); eq.push([d0 + d, cash + sh * St - opt * 100]); bh.push([d0 + d, 100 * St]); }
      }
      const ST = path[d0 + D];
      let res;
      if (type === "put" && ST < K) { cash -= K * 100; sh = 100; basis = K; assigned++; res = T("被指派，买入 100 股", "assigned: bought 100 shares"); }
      else if (type === "call" && ST > K) { cash += K * 100; sh = 0; called++; res = T("被叫走，卖出 100 股", "called away: sold 100 shares"); }
      else res = T("作废，收下权利金", "expired: premium kept");
      if (keep) log.push([m + 1, S, type, K, px, ST, res]);
    }
    const Send = path[CYC * D];
    return { wheel: cash + sh * Send, bh: 100 * Send, prem, assigned, called, eq, bhc: bh, log, Send };
  }
  function draw() {
    const p = { mp: v["csp-mp"] / 100, mc: v["csp-mc"] / 100, iv: v["csp-iv"] / 100, rv: v["csp-rv"] / 100, mu: v["csp-mu"] / 100 };
    const one = wheel(O.rng(seed), p, true);
    $("#csp-chart").innerHTML = lineChart({
      xmin: 0, xmax: CYC * D, xlabel: T("天", "day"), ylabel: T("账户价值（美元）", "Account value ($)"), xstep: 60,
      series: [{ points: one.eq, cls: 0, label: T("轮动（含期权按市值计）", "Wheel (options marked to model)") }, { points: one.bhc, cls: 5, label: T("第 0 天买入 100 股并持有", "Buy 100 shares on day 0 and hold") }],
      hlines: [{ y: 10000, label: "$10,000" }],
    });
    $("#csp-stats").innerHTML = stats([
      [T("轮动：期末", "Wheel: final"), "$" + one.wheel.toFixed(0), one.wheel >= 10000 ? "pos" : "neg"],
      [T("持有：期末", "Hold: final"), "$" + one.bh.toFixed(0), one.bh >= 10000 ? "pos" : "neg"],
      [T("共收权利金", "Premium collected"), "$" + one.prem.toFixed(0), "acc"],
      [T("被指派 / 被叫走", "Assigned / called away"), one.assigned + " / " + one.called],
    ]);
    // Monte Carlo summary
    const R = O.rng(1000 + seed), W = [], B = [];
    let beat = 0;
    for (let i = 0; i < 300; i++) { const x = wheel(R, p, false); W.push(x.wheel); B.push(x.bh); if (x.wheel > x.bh) beat++; }
    const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
    const q = (a, f) => [...a].sort((x, y) => x - y)[Math.floor(f * (a.length - 1))];
    $("#csp-sum").innerHTML = stats([
      [T("平均期末：轮动 / 持有", "Mean final: wheel / hold"), "$" + mean(W).toFixed(0) + " / $" + mean(B).toFixed(0)],
      [T("最差 5%：轮动 / 持有", "Worst 5%: wheel / hold"), "$" + q(W, 0.05).toFixed(0) + " / $" + q(B, 0.05).toFixed(0), "neg"],
      [T("最好 5%：轮动 / 持有", "Best 5%: wheel / hold"), "$" + q(W, 0.95).toFixed(0) + " / $" + q(B, 0.95).toFixed(0), "pos"],
      [T("轮动胜出的路径", "Paths where the wheel wins"), (beat / 3).toFixed(0) + "%"],
    ]);
    const typ = (t) => (t === "put" ? T("卖看跌", "sell put") : T("卖看涨", "sell call"));
    $("#csp-log").innerHTML = `<table><tr><th>${T("月", "Month")}</th><th>${T("月初股价", "Price at start")}</th><th>${T("动作", "Action")}</th><th>K</th><th>${T("权利金/股", "Premium/sh")}</th><th>${T("月末股价", "Price at end")}</th><th>${T("结果", "Result")}</th></tr>`
      + one.log.map(([m, S, t, K, px, ST, res]) => `<tr><td>${m}</td><td>${S.toFixed(2)}</td><td>${typ(t)}</td><td>${K.toFixed(1)}</td><td>${px.toFixed(2)}</td><td>${ST.toFixed(2)}</td><td>${res}</td></tr>`).join("") + `</table>`;
  }
  bindSliders(root, { "csp-mp": (x) => x + "%", "csp-mc": (x) => x + "%", "csp-iv": (x) => x + "%", "csp-rv": (x) => x + "%", "csp-mu": (x) => (x > 0 ? "+" : "") + x + "%" }, (vals) => { v = vals; draw(); });
  onSeg(root, "csp-rule", (x) => { rule = x; draw(); });
  $("#csp-new").addEventListener("click", () => { seed += 1; draw(); });
}
