// Main demo for lesson basis-trades: a funding-carry simulator. Long 1 BTC spot + short 1 BTC perp, funding every 8h
// under different regimes; the short leg can be liquidated by a rally (isolated) or protected by unified margin.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S0 = 100000, SIG = 0.5, MMR = 0.005;
  const REG = {
    calm: { mu: 0, m0: 0.0001, m1: 0.0001 },
    hot: { mu: 0, m0: 0.0003, m1: 0.0003 },
    fade: { mu: 0, m0: 0.0003, m1: -0.0001 },
    neg: { mu: 0, m0: -0.00005, m1: -0.00005 },
  };
  let reg = "calm", mode = "iso", seed = 11, cloud = null;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("资金费套利模拟器：现货多头 1 BTC + 永续空头 1 BTC", "Funding-carry simulator: long 1 BTC spot + short 1 BTC perp")}</div>
    <div class="demo-row">${seg("bt-reg", [["calm", T("平静 +0.01%", "Calm +0.01%")], ["hot", T("火热 +0.03%", "Hot +0.03%")], ["fade", T("退潮：由热转负", "Fading: hot → negative")], ["neg", T("为负 −0.005%", "Negative −0.005%")]], reg)}</div>
    <div class="demo-row">${seg("bt-mode", [["iso", T("逐仓空单", "Isolated short")], ["uni", T("统一账户（现货当抵押）", "Unified (spot as collateral)")]], mode)}</div>
    <div class="demo-grid">
      ${slider("bt-lev", T("空单杠杆 L", "Short leverage L"), 1, 10, 1, 3)}
      ${slider("bt-days", T("持有天数", "Days held"), 30, 365, 5, 180)}
    </div>
    <div class="demo-math" id="bt-f"></div>
    <div id="bt-stats"></div>
    <div class="demo-btns"><button class="demo-btn" data-act="path">${T("换一条路径", "New path")}</button><button class="demo-btn" data-act="cloud">${T("跑 500 条路径", "Run 500 paths")}</button></div>
    <div id="bt-chart"></div>
    <div id="bt-cloud" class="demo-out-sm"></div>
    <p class="demo-tip">${T("试试：选“火热”，把空单杠杆拉到 8——标题年化很漂亮，可空单常被上涨强平，剩下的现货变成纯粹的方向押注，结果一下子分散开；再切到“统一账户”，同一条路径就活下来了（价格无漂移；真实平台还会对抵押品打折）。", "Try this: pick “Hot” and set short leverage to 8 — the headline APR looks great, but rallies often liquidate the short, the leftover spot becomes a pure bet on bitcoin and the outcomes scatter. Switch to “Unified” and the same path survives (prices have no drift; real venues also apply collateral haircuts).")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const usd = (x) => (x < 0 ? "−$" : "$") + Math.round(Math.abs(x)).toLocaleString("en-US");
  const pct = (x) => (x * 100).toFixed(1) + "%";

  // one simulated path; returns series and summary
  const simulate = (L, days, s) => {
    const R = O.rng(s), g = REG[reg], n = Math.round(days * 3), Tm = days / 365;
    const path = O.gbmPath(R, S0, g.mu, SIG, Tm, n);
    const M = S0 / L;
    let fundCum = 0, x = 0, liqAt = -1, first = 0;
    const book = [[0, 0]], fund = [[0, 0]];
    for (let i = 1; i <= n; i++) {
      const P = path[i - 1], mean = g.m0 + (g.m1 - g.m0) * (i / n);
      x = 0.9 * x + 0.000015 * R.normal();
      const f = i === 1 ? g.m0 : O.clamp(mean + x, -0.003, 0.003);   // opening print = the regime's quoted rate
      if (i === 1) first = f;
      if (liqAt < 0) fundCum += f * P;                       // short receives f × notional (pays if f < 0)
      const Pn = path[i];
      if (liqAt < 0 && mode === "iso" && M + (S0 - Pn) + fundCum <= MMR * Pn) liqAt = i;
      const shortPL = liqAt < 0 ? S0 - Pn + fundCum : -M;
      book.push([i / 3, Pn - S0 + shortPL]);
      fund.push([i / 3, fundCum]);
    }
    const pnl = book[book.length - 1][1];
    return { path, book, fund, pnl, fundCum, liqAt, first, M, cap: S0 + M, days };
  };

  let cur = null;
  const drawPath = () => {
    const L = +$("#bt-lev").value, days = +$("#bt-days").value;
    const s = simulate(L, days, seed); cur = s;
    const headline = O.fundingAPR(s.first, 3);
    const realized = (s.pnl / s.cap) * (365 / days);
    $("#bt-f").innerHTML = tex(String.raw`R = \text{APR} \times \frac{L}{L+1} = ${(headline * 100).toFixed(2)}\% \times \frac{${L}}{${L + 1}} = ${((headline * L) / (L + 1) * 100).toFixed(2)}\%\quad(\text{${T("用第一次读数“年化”", "headline from the first print")}})`, true);
    $("#bt-stats").innerHTML = stats([
      [T("标题年化（第一次读数 × 1,095）", "Headline APR (first print × 1,095)"), (headline * 100).toFixed(2) + "%", "acc"],
      [T("实际收到的资金费", "Funding actually received"), usd(s.fundCum), s.fundCum >= 0 ? "pos" : "neg"],
      [T("空单那条腿", "Short leg"), s.liqAt >= 0 ? T(`第 ${(s.liqAt / 3).toFixed(0)} 天被强平`, `liquidated on day ${(s.liqAt / 3).toFixed(0)}`) : T("幸存", "survived"), s.liqAt >= 0 ? "neg" : "pos"],
      [T("整本账盈亏", "Whole-book P&L"), usd(s.pnl), s.pnl >= 0 ? "pos" : "neg"],
      [T("资本年化收益（实际）", "Realized return on capital, annualized"), pct(realized), realized >= 0 ? "pos" : "neg"],
    ]);
    $("#bt-chart").innerHTML = lineChart({
      xmin: 0, xmax: days, xlabel: T("天", "days"), ylabel: T("美元", "dollars"), yfmt: (y) => Math.round(y / 1000) + "k",
      series: [
        { points: s.book, cls: 0, label: T("整本账（现货 + 空单 + 资金费）", "whole book (spot + short + funding)") },
        { points: s.fund, cls: 3, dashed: true, label: T("累计资金费", "cumulative funding") },
      ],
      markers: s.liqAt >= 0 ? [{ x: s.liqAt / 3, label: T("空单强平", "short liquidated") }] : [],
    });
  };
  const showCloud = () => {
    $("#bt-cloud").innerHTML = cloud ? stats([
      [T("500 条路径里空单被强平", "Short leg liquidated (of 500)"), pct(cloud.liq), cloud.liq > 0.2 ? "neg" : ""],
      [T("平均资本年化", "Average annualized return"), pct(cloud.avg)],
      [T("最差 5% 路径的年化", "Worst 5% of paths"), pct(cloud.p5), "neg"],
      [T("最好 5% 路径的年化", "Best 5% of paths"), pct(cloud.p95), "pos"],
    ]) : T("按“跑 500 条路径”，看同样的设置下结果能分散到多宽。", "Press “Run 500 paths” to see how widely the same settings can scatter.");
  };
  const runCloud = () => {
    const L = +$("#bt-lev").value, days = +$("#bt-days").value, out = [];
    let liq = 0;
    for (let k = 0; k < 500; k++) { const s = simulate(L, days, 7000 + k); if (s.liqAt >= 0) liq++; out.push((s.pnl / s.cap) * (365 / days)); }
    out.sort((a, b) => a - b);
    cloud = { liq: liq / 500, avg: out.reduce((a, b) => a + b, 0) / 500, p5: out[25], p95: out[474] };
    showCloud();
  };
  const redraw = () => { cloud = null; drawPath(); showCloud(); };
  bindSliders(root, { "bt-lev": (x) => x + "×", "bt-days": (x) => x + T(" 天", " days") }, redraw);
  onSeg(root, "bt-reg", (v) => { reg = v; redraw(); });
  onSeg(root, "bt-mode", (v) => { mode = v; redraw(); });
  root.querySelectorAll("[data-act]").forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.act === "path") { seed += 1; drawPath(); } else runCloud();
  }));
}
