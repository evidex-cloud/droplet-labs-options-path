// Inline demo for lesson what-is-perp: two ways to hold $10,000 of long BTC exposure for 180 days with spot flat.
// Dated futures charge the carry through convergence (and a roll every 90 days); the perp charges it as funding every 8 hours.
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("同一份多头敞口，两种付费方式：到期期货 vs 永续", "Same long exposure, two ways to pay: dated future vs perp")}</div>
    <div class="demo-grid">
      ${slider("wpf-b", T("90 天期货的年化基差", "Annualised basis of the 90-day future"), -5, 30, 0.5, 11)}
      ${slider("wpf-f", T("永续资金费（每 8 小时）", "Perp funding (per 8 hours)"), -0.03, 0.1, 0.005, 0.01)}
    </div>
    <div class="demo-math" id="wpf-f-out"></div>
    <div id="wpf-stats"></div>
    <div id="wpf-chart"></div>
    <p class="demo-tip">${T("看什么：现货全程不动（演示价 100,000），两条线都往下走——都是持有杠杆多头的成本。期货的成本藏在价格收敛里，第 90 天展期后重新开始；永续的成本是每 8 小时一笔现金。把资金费调到 0.01%（年化约 10.95%）、基差调到 11%，两条路线几乎重合。", "What to notice: spot never moves (illustrative $100,000), yet both lines fall: both are the cost of holding leveraged long exposure. The future's cost hides in its price converging, restarting after the roll on day 90; the perp's cost is cash every 8 hours. With funding at 0.01% (about 10.95% a year) and the basis at 11%, the two routes nearly coincide.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  bindSliders(root, { "wpf-b": (x) => x + "%", "wpf-f": (x) => x.toFixed(3) + "%" }, (v) => {
    const b = v["wpf-b"] / 100, f = v["wpf-f"] / 100, N = 10000, S = 100000, H = 180, tenor = 90;
    // dated-future route: $10,000 notional, rolled every 90 days; value change from convergence with spot flat
    const futPts = [[0, 0]];
    let realised = 0, Fk = S * Math.exp((b * tenor) / 365), Qk = N / Fk;
    for (let day = 1; day <= H; day++) {
      const tau = day % tenor === 0 ? tenor : day % tenor; // days elapsed in current contract
      const Ft = S * Math.exp((b * (tenor - tau)) / 365);
      const pnl = realised + Qk * (Ft - Fk);
      futPts.push([day, pnl]);
      if (tau === tenor) { realised = pnl; Fk = S * Math.exp((b * tenor) / 365); Qk = N / Fk; }
    }
    // perp route: funding every 8 hours on $10,000 notional (spot flat, so notional stays $10,000)
    const perpPts = [[0, 0]];
    let paid = 0;
    for (let k = 1; k <= H * 3; k++) { paid -= f * N; if (k % 3 === 0) perpPts.push([k / 3, paid]); }
    const futTotal = futPts[H][1], perpTotal = paid, apr = f * 3 * 365;
    $("#wpf-f-out").innerHTML = tex(String.raw`\text{APR}_{\text{funding}} = f \times 3 \times 365 = ${(f * 100).toFixed(3)}\% \times 1{,}095 = ${(apr * 100).toFixed(2)}\% \quad\text{vs}\quad b_{\text{ann}} = ${(b * 100).toFixed(1)}\%`, true);
    $("#wpf-stats").innerHTML = stats([
      [T("到期期货路线，180 天", "Dated-future route, 180 days"), (futTotal < 0 ? "−$" : "$") + Math.abs(futTotal).toFixed(0), futTotal < 0 ? "neg" : "pos"],
      [T("永续路线，180 天", "Perp route, 180 days"), (perpTotal < 0 ? "−$" : "$") + Math.abs(perpTotal).toFixed(0), perpTotal < 0 ? "neg" : "pos"],
      [T("资金费结算次数", "Number of funding payments"), String(H * 3)],
      [T("展期次数", "Rolls"), "1"],
    ]);
    $("#wpf-chart").innerHTML = lineChart({
      xmin: 0, xmax: H, xlabel: T("天数（现货不动）", "Days (spot flat)"), ylabel: T("累计持有成本（美元）", "Cumulative carry (USD)"),
      series: [
        { points: futPts, cls: 0, label: T("到期期货，每 90 天展期", "Dated future, rolled every 90 days") },
        { points: perpPts, cls: 4, label: T("永续，每 8 小时付资金费", "Perp, funding every 8 hours") },
      ],
      markers: [{ x: 90, label: T("展期", "roll") }],
    });
  });
}
