// Main demo for lesson what-is-perp: linear (USDT-margined) vs inverse (coin-margined) perps at any leverage.
// Shows account equity in USD or in BTC across exit prices, the (simplified) liquidation price, and the live P&L formula.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const P0 = 100000, MMR = 0.005, MARGIN_USD = 1000;
  let kind = "linear", side = "long", unit = "usd";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("永续试算：正向 vs 反向，任意杠杆（BTC 演示价 100,000 美元）", "Perp calculator: linear vs inverse at any leverage (illustrative BTC $100,000)")}</div>
    <div class="demo-row">${seg("wip-kind", [["linear", T("正向（USDT 保证金）", "Linear (USDT margin)")], ["inverse", T("反向（BTC 保证金）", "Inverse (BTC margin)")]], kind)}
      ${seg("wip-side", [["long", T("做多", "Long")], ["short", T("做空", "Short")]], side)}
      ${seg("wip-unit", [["usd", T("按美元看账户", "Account in USD")], ["btc", T("按 BTC 看账户", "Account in BTC")]], unit)}</div>
    <div class="demo-grid">
      ${slider("wip-lev", T("杠杆 L", "Leverage L"), 1, 50, 1, 10)}
      ${slider("wip-exit", T("平仓价 P₁", "Exit price P₁"), 60000, 140000, 500, 105000)}
    </div>
    <div class="demo-math" id="wip-f"></div>
    <div id="wip-stats"></div>
    <div id="wip-chart"></div>
    <p class="demo-tip">${T("试试：把杠杆从 1 拉到 50，直线变陡、强平价（竖线）逼近 100,000。切到“反向 + 做空 + 杠杆 1”，再选“按美元看账户”：整条线是平的——币本位抵押被空单对冲成了“合成美元”。强平后的权益按 0 计（剩余维持保证金通常在强平过程中损失掉）。", "Try this: raise leverage from 1 to 50: the line steepens and the liquidation line (vertical marker) closes in on $100,000. Switch to Inverse + Short at 1× and view the account in USD: the line is flat, because the short hedges the bitcoin collateral into a synthetic dollar. After liquidation equity is shown as 0 (the leftover maintenance margin is usually lost in the liquidation process).")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const usd = (x, d = 0) => (x < 0 ? "−$" : "$") + Math.abs(x).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  const tn = (x, d = 0) => (x < 0 ? "-" : "") + Math.abs(x).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }).replace(/,/g, "{,}");

  const draw = (v) => {
    const L = v["wip-lev"], P1 = v["wip-exit"], s = side === "long" ? 1 : -1;
    const N = MARGIN_USD * L, Q = N / P0, Mb = MARGIN_USD / P0;
    let liq;
    if (kind === "linear") liq = O.liqPrice(P0, L, MMR, side);
    else liq = side === "long" ? (P0 * (1 + MMR)) / (1 + 1 / L) : L > 1 ? (P0 * (1 - MMR)) / (1 - 1 / L) : Infinity;
    const dead = (P) => (side === "long" ? P <= liq : P >= liq);
    // account equity in USD and BTC at price P (static path assumption: if P is beyond liq, the path crossed it)
    const eqUsd = (P) => {
      if (dead(P)) return 0;
      return kind === "linear" ? MARGIN_USD + s * (P - P0) * Q : (Mb + s * N * (1 / P0 - 1 / P)) * P;
    };
    const eqBtc = (P) => (dead(P) ? 0 : kind === "linear" ? eqUsd(P) / P : Mb + s * N * (1 / P0 - 1 / P));
    const f = unit === "usd" ? eqUsd : eqBtc;
    const pnlUsd = eqUsd(P1) - (kind === "linear" ? MARGIN_USD : Mb * P1);
    const pnlBtc = kind === "inverse" ? eqBtc(P1) - Mb : null;
    const liqTxt = isFinite(liq) ? usd(liq) : T("无（1 倍反向空单）", "none (1× inverse short)");
    // live formula
    let fx;
    if (kind === "linear") {
      fx = String.raw`\Pi = (P_1 - P_0) \times Q = (${tn(P1)} - ${tn(P0)}) \times ${side === "long" ? "" : "-"}${Q.toFixed(3)} = ${tn(s * (P1 - P0) * Q)}`;
    } else {
      const pb = s * N * (1 / P0 - 1 / P1);
      fx = String.raw`\Pi_{\text{BTC}} = ${side === "long" ? "" : "-"}N\left(\frac{1}{P_0} - \frac{1}{P_1}\right) = ${side === "long" ? "" : "-"}${tn(N)}\left(\frac{1}{${tn(P0)}} - \frac{1}{${tn(P1)}}\right) = ${pb >= 0 ? "+" : ""}${pb.toFixed(5)}\ \text{BTC} \approx ${tn(pb * P1)}\ \text{USD}`;
    }
    $("#wip-f").innerHTML = tex(fx, true) + (dead(P1) ? `<p class="demo-warn">${T("价格先穿过了强平价 " + liqTxt + "：仓位已被强平，保证金基本全部损失。", "The price crossed the liquidation price " + liqTxt + " on the way: the position was liquidated and the margin is essentially gone.")}</p>` : "");
    $("#wip-stats").innerHTML = stats([
      [T("名义价值 N", "Notional N"), usd(N), "acc"],
      [T("仓位大小", "Size"), Q.toFixed(3) + " BTC"],
      [T("保证金", "Margin"), kind === "linear" ? usd(MARGIN_USD) : Mb.toFixed(3) + " BTC"],
      [T("强平价（简化）", "Liquidation price (simplified)"), liqTxt, "neg"],
      [T("平仓盈亏（美元）", "P&L at exit (USD)"), usd(pnlUsd), pnlUsd >= 0 ? "pos" : "neg"],
      pnlBtc === null
        ? [T("保证金收益率", "Return on margin"), ((pnlUsd / MARGIN_USD) * 100).toFixed(1) + "%", pnlUsd >= 0 ? "pos" : "neg"]
        : [T("账户 BTC 数量变化", "Change in BTC held"), (pnlBtc >= 0 ? "+" : "") + pnlBtc.toFixed(5) + " BTC", pnlBtc >= 0 ? "pos" : "neg"],
    ]);
    const ref = unit === "usd" ? (P) => (MARGIN_USD * P) / P0 : () => Mb;
    const markers = [{ x: P0, label: T("开仓 100k", "entry 100k") }];
    if (isFinite(liq) && liq > 60000 && liq < 140000) markers.push({ x: liq, label: T("强平", "liq") });
    $("#wip-chart").innerHTML = lineChart({
      xmin: 60000, xmax: 140000, xlabel: T("BTC 价格", "BTC price"), ylabel: unit === "usd" ? T("账户价值（美元）", "Account value (USD)") : T("账户价值（BTC）", "Account value (BTC)"),
      xfmt: (x) => (x / 1000).toFixed(0) + "k", yfmt: unit === "usd" ? undefined : (y) => y.toFixed(3), samples: 320,
      series: [
        { f, cls: kind === "linear" ? 0 : 4, label: T("你的永续账户", "Your perp account") },
        { f: ref, cls: 5, dashed: true, label: T("对照：用同样的钱买现货 BTC（1 倍）", "Reference: same money in spot BTC (1×)") },
      ],
      markers, points: [{ x: P1, y: f(P1), cls: kind === "linear" ? 0 : 4 }],
    });
  };
  const run = bindSliders(root, { "wip-lev": (x) => x + "×", "wip-exit": (x) => usd(x) }, draw);
  onSeg(root, "wip-kind", (k) => { kind = k; run(); });
  onSeg(root, "wip-side", (k) => { side = k; run(); });
  onSeg(root, "wip-unit", (k) => { unit = k; run(); });
}
