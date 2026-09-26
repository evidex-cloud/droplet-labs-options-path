// Inline demo for lesson product-map: covering the same S&P 500 exposure with SPX, XSP or SPY options —
// contracts needed (n = N / (m × S)), rounding, and the contract features that differ.
import * as O from "./_opt.js";
import { slider, bindSliders, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("同一份标普 500 敞口：SPX、XSP 还是 SPY？", "One S&P 500 exposure: SPX, XSP or SPY?")}</div>
    <div class="demo-grid">
      ${slider("pc-l", T("标普 500 点位（2026 年 9 月 25 日收于 7,743）", "S&P 500 level (closed at 7,743 on Sep 25, 2026)"), 6000, 8000, 1, 7743)}
      ${slider("pc-n", T("要覆盖的敞口（美元）", "Exposure to cover ($)"), 20000, 2000000, 1000, 77000)}
    </div>
    <div class="demo-math" id="pc-f"></div>
    <div id="pc-t"></div>
    <p class="demo-tip">${T("看什么：敞口小于约 77 万美元时，SPX 连一张都“太大”，四舍五入后要么过度对冲、要么不对冲；XSP 和 SPY 能贴得更近。权利金按 30 天、平值、σ 20%、r 4% 示意计算（未计 SPY 的股息）。SPY 价格按指数的十分之一近似。",
      "What to notice: below roughly $774,000, even one SPX contract is too big — rounding means over-hedging or no hedge; XSP and SPY fit much closer. Premiums are illustrative: 30-day at-the-money puts, σ 20%, r 4% (SPY's dividend ignored). SPY is approximated as one-tenth of the index.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const L = v["pc-l"], N = v["pc-n"], Tm = 30 / 365;
    const prods = [
      { id: "SPX", S: L, ex: T("欧式", "European"), st: T("现金（月度上午 / 周度下午结算）", "cash (monthly AM / weekly PM)"), early: T("否", "no"), tax: T("第 1256 条", "Sec. 1256") },
      { id: "XSP", S: L / 10, ex: T("欧式", "European"), st: T("现金", "cash"), early: T("否", "no"), tax: T("第 1256 条", "Sec. 1256") },
      { id: "SPY", S: L / 10, ex: T("美式", "American"), st: T("100 份 ETF", "100 ETF shares"), early: T("可能", "possible"), tax: T("股权期权", "equity option") },
    ];
    const rows = prods.map((p) => {
      const notional = 100 * p.S, exact = N / notional, n = Math.round(exact), cover = n * notional;
      const prem = O.bsPrice({ S: p.S, K: p.S, T: Tm, r: 0.04, sigma: 0.2, type: "put" }) * 100;
      return { ...p, notional, exact, n, cover, prem };
    });
    $("#pc-f").innerHTML = tex(String.raw`n_{\text{SPX}} = \frac{${N.toLocaleString("en-US").replace(/,/g, "{,}")}}{100 \times ${L.toLocaleString("en-US").replace(/,/g, "{,}")}} = ${rows[0].exact.toFixed(2)}, \qquad n_{\text{XSP}} = \frac{${N.toLocaleString("en-US").replace(/,/g, "{,}")}}{100 \times ${(L / 10).toFixed(1)}} = ${rows[1].exact.toFixed(2)}`, true);
    $("#pc-t").innerHTML = `<table><thead><tr><th></th>${rows.map((r) => `<th>${r.id}</th>`).join("")}</tr></thead><tbody>
      <tr><td>${T("每张名义价值", "Notional per contract")}</td>${rows.map((r) => `<td>$${Math.round(r.notional).toLocaleString("en-US")}</td>`).join("")}</tr>
      <tr><td>${T("需要张数（四舍五入）", "Contracts (rounded)")}</td>${rows.map((r) => `<td>${r.n} (${r.exact.toFixed(2)})</td>`).join("")}</tr>
      <tr class="hl"><td>${T("实际覆盖 / 目标", "Covered / target")}</td>${rows.map((r) => `<td>${((r.cover / N) * 100).toFixed(0)}%</td>`).join("")}</tr>
      <tr><td>${T("平值看跌权利金合计（示意）", "ATM put premium, total (illustrative)")}</td>${rows.map((r) => `<td>$${Math.round(r.prem * r.n).toLocaleString("en-US")}</td>`).join("")}</tr>
      <tr><td>${T("行权方式", "Exercise")}</td>${rows.map((r) => `<td>${r.ex}</td>`).join("")}</tr>
      <tr><td>${T("交割", "Settlement")}</td>${rows.map((r) => `<td>${r.st}</td>`).join("")}</tr>
      <tr><td>${T("提前指派", "Early assignment")}</td>${rows.map((r) => `<td>${r.early}</td>`).join("")}</tr>
      <tr><td>${T("美国税务类别", "US tax category")}</td>${rows.map((r) => `<td>${r.tax}</td>`).join("")}</tr>
    </tbody></table>`;
  };
  bindSliders(root, { "pc-l": (x) => (+x).toLocaleString("en-US"), "pc-n": (x) => "$" + (+x).toLocaleString("en-US") }, draw);
}
