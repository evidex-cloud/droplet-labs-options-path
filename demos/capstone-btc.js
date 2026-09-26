// Inline demo for lesson capstone: the bitcoin variant. Four ways to express "BTC higher in 30 days", each sized so that
// its worst case equals the same budget; then deterministic paths and (on demand) a Monte Carlo of 2,000 paths.
import * as O from "./_opt.js";
import { slider, bindSliders, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const P0 = 100000, r = 0.04, days = 30, Ty = days / 365, mmr = 0.005, fund = 0.0001 * 3; // funding per day (baseline)
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("同一个最坏情形：永续 vs 期权（示意数字）", "Same worst case: perp vs option (illustrative numbers)")}</div>
    <div class="demo-grid">
      ${slider("cb-b", T("风险预算（最坏情形）", "Risk budget (worst case)"), 200, 3000, 50, 600)}
      ${slider("cb-v", T("BTC 隐含波动率", "BTC implied vol"), 30, 90, 1, 50)}
      ${slider("cb-l", T("激进永续的杠杆", "Leverage of the aggressive perp"), 3, 25, 1, 10)}
      ${slider("cb-c", T("压力测试的暴跌幅度", "Stress crash depth"), 10, 40, 1, 20)}
      ${slider("cb-t", T("目标价（价差上限）", "Target (spread cap)"), 105000, 150000, 5000, 115000)}
      ${slider("cb-d", T("途中的回撤低点", "Dip low along the way"), 80000, 99000, 500, 89000)}
    </div>
    <div class="demo-math" id="cb-f"></div>
    <div id="cb-table"></div>
    <div class="demo-btns"><button class="demo-btn" data-mc="1">${T("模拟 2,000 条路径（无漂移）", "Simulate 2,000 paths (no drift)")}</button></div>
    <div id="cb-mc" class="demo-out-sm"></div>
    <p class="demo-tip">${T("看什么：杠杆越高，永续在同样预算下能买的比特币越少，而最坏情形发生的概率却越大。把回撤低点拉到强平价之上，永续就活下来了——路径决定了它的命运，期权只看终点。", "What to notice: the higher the leverage, the less bitcoin the perp can hold for the same budget, and the more likely its worst case becomes. Move the dip above the liquidation price and the perp survives — its fate depends on the path; the option's only on the end point.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  let cfg = null;
  const build = (v) => {
    const B = v["cb-b"], sig = v["cb-v"] / 100, L = v["cb-l"], crash = v["cb-c"] / 100, K2 = v["cb-t"], dip = v["cb-d"];
    const call = O.bsPrice({ S: P0, K: P0, T: Ty, r, sigma: sig, type: "call" });
    const spr = call - O.bsPrice({ S: P0, K: K2, T: Ty, r, sigma: sig, type: "call" });
    const perp = (lev) => {
      const liq = O.liqPrice(P0, lev, mmr), liqDrop = 1 - liq / P0;
      const worstPerBtc = crash >= liqDrop ? P0 / lev : P0 * crash + P0 * fund * days;
      return { lev, liq, worstPerBtc, liquidatesInCrash: crash >= liqDrop };
    };
    const hi = perp(L), lo = perp(3);
    const c = [
      { key: "call", name: T("10 万看涨", "100k call"), Q: B / call, worst: call, kind: "opt", K: P0, cap: Infinity, prem: call },
      { key: "spr", name: T(`10 万/${K2 / 10000} 万价差`, `100k/${K2 / 1000}k spread`), Q: B / spr, worst: spr, kind: "opt", K: P0, cap: K2, prem: spr },
      { key: "p1", name: T(`${L} 倍永续`, `${L}× perp`), Q: B / hi.worstPerBtc, kind: "perp", p: hi },
      { key: "p2", name: T("3 倍永续", "3× perp"), Q: B / lo.worstPerBtc, kind: "perp", p: lo },
    ];
    cfg = { B, sig, L, crash, K2, dip, c, call, spr };
    return cfg;
  };
  // P&L of candidate x on a path summarized by (minimum, final)
  const pnl = (x, pathMin, final, heldDays = days) => {
    if (x.kind === "opt") return x.Q * (Math.min(Math.max(final - x.K, 0), x.cap - x.K) - x.prem);
    if (pathMin <= x.p.liq) return -x.Q * (P0 / x.p.lev); // liquidated: margin gone (fees ignored)
    return x.Q * (final - P0 - P0 * fund * heldDays);
  };
  const fmt$ = (y) => (y >= 0 ? "+$" : "−$") + Math.abs(y).toLocaleString("en-US", { maximumFractionDigits: 0 });
  const k = (x) => (x / 1000).toLocaleString("en-US", { maximumFractionDigits: 1 }) + "k";
  const draw = (v) => {
    const { c, K2, dip, crash, sig } = build(v);
    const scen = [
      [T(`先跌到 ${k(dip)}，<br>再到 ${k(K2)}`, `dip to ${k(dip)},<br>end ${k(K2)}`), dip, K2],
      [T("停在<br>100k", "flat at<br>100k"), P0, P0],
      [T(`一路涨到<br>${k(K2)}`, `rise to<br>${k(K2)}`), P0, K2],
      [T(`暴跌<br>−${(crash * 100).toFixed(0)}%`, `crash<br>−${(crash * 100).toFixed(0)}%`), P0 * (1 - crash), P0 * (1 - crash)],
    ];
    const pWorst = (x) => x.kind === "opt" ? 1 - O.probAbove(P0, P0, Ty, sig, 0) : (x.p.liq >= P0 * (1 - crash) ? O.probTouch(P0, x.p.liq, Ty, sig, 0) : NaN);
    $("#cb-f").innerHTML = tex(String.raw`Q = \frac{\text{${T("预算", "budget")}}}{\text{${T("每 BTC 最坏亏损", "worst loss per BTC")}}}`, true) + tex(String.raw`P_{\text{liq}}(${cfg.L}\times) = 100{,}000\left(1 - \tfrac{1}{${cfg.L}} + 0.005\right) = ${Math.round(c[2].p.liq).toLocaleString("en-US").replace(/,/g, "{,}")}`, true);
    $("#cb-table").innerHTML = `<div style="overflow-x:auto"><table style="font-size:.86em;white-space:nowrap"><thead><tr><th>${T("候选", "Candidate")}</th><th>${T("仓位<br>BTC", "Size<br>BTC")}</th><th>${T("最坏<br>概率", "P<br>(worst)")}</th>${scen.map((s) => `<th>${s[0]}</th>`).join("")}</tr></thead><tbody>${c.map((x) => {
      const pw = pWorst(x);
      return `<tr><td>${x.name}</td><td>${x.Q.toFixed(3)}</td><td>${isFinite(pw) ? (pw * 100).toFixed(0) + "%" : T("仅暴跌时", "crash only")}</td>${scen.map((s) => { const y = pnl(x, s[1], s[2]); return `<td class="${y >= 0 ? "" : "itm"}" style="white-space:nowrap">${fmt$(y)}</td>`; }).join("")}</tr>`;
    }).join("")}</tbody></table></div>`;
    $("#cb-mc").innerHTML = T("按上面的按钮，在同样设置下模拟 2,000 条路径。", "Press the button to simulate 2,000 paths with these settings.");
  };
  const run = bindSliders(root, { "cb-b": (x) => "$" + x, "cb-v": (x) => x + "%", "cb-l": (x) => x + "×", "cb-c": (x) => "−" + x + "%", "cb-t": (x) => "$" + (+x).toLocaleString("en-US"), "cb-d": (x) => "$" + (+x).toLocaleString("en-US") }, draw);
  root.querySelector("[data-mc]").addEventListener("click", () => {
    if (!cfg) run();
    const R = O.rng(11), N = 2000, steps = days * 6;
    const res = cfg.c.map(() => []);
    for (let i = 0; i < N; i++) {
      const path = O.gbmPath(R, P0, 0, cfg.sig, Ty, steps);
      let m = Infinity; for (const x of path) if (x < m) m = x;
      const fin = path[steps];
      cfg.c.forEach((x, k) => res[k].push(pnl(x, m, fin)));
    }
    $("#cb-mc").innerHTML = `<div style="overflow-x:auto"><table style="font-size:.86em"><thead><tr><th>${T("候选", "Candidate")}</th><th>${T("平均盈亏", "Mean P&L")}</th><th>${T("亏损的比例", "Share of paths losing")}</th><th>${T("最差 5%", "Worst 5%")}</th><th>${T("最好 5%", "Best 5%")}</th></tr></thead><tbody>${cfg.c.map((x, k) => {
      const a = res[k].slice().sort((p, q) => p - q), mean = a.reduce((s, y) => s + y, 0) / a.length;
      return `<tr><td>${x.name}</td><td>${fmt$(mean)}</td><td>${(a.filter((y) => y < 0).length / a.length * 100).toFixed(0)}%</td><td>${fmt$(a[Math.floor(0.05 * a.length)])}</td><td>${fmt$(a[Math.floor(0.95 * a.length)])}</td></tr>`;
    }).join("")}</tbody></table></div><div class="demo-meta">${T("无漂移、每 4 小时一步；永续按基准资金费率计费，强平时损失全部保证金（不计手续费）。期权平均略为负，因为定价用了 4% 利率——这是模型，不是预测。", "No drift, one step every 4 hours; perps pay baseline funding and lose their whole margin if liquidated (fees ignored). The options' mean is slightly negative because they are priced with a 4% rate — a model, not a forecast.")}</div>`;
  });
}
