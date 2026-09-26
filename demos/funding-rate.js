// Main demo for lesson funding-rate: simulate the premium index interval by interval under a market regime,
// turn it into funding with the engine's clamp formula, and add up what a long actually pays
// versus the "snapshot APR" built from the first print.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  // premium-index regimes, per 8 hours (mean, sd)
  const REG = {
    calm: { m: 0.0001, s: 0.0001 },
    hot: { m: 0.0008, s: 0.0003 },
    panic: { m: -0.0006, s: 0.0003 },
    flip: null,
  };
  let regime = "hot", clock = "8", seed = 5;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("资金费模拟：从溢价到你的账单", "Funding simulator: from premium to your bill")}</div>
    <div class="demo-row">${seg("fr-reg", [["calm", T("平静", "Calm")], ["hot", T("狂热（多头拥挤）", "Euphoric (crowded longs)")], ["panic", T("恐慌（空头拥挤）", "Panic (crowded shorts)")], ["flip", T("先狂热后恐慌", "Euphoria, then panic")]], regime)}
      ${seg("fr-clock", [["8", T("每 8 小时结算", "Paid every 8 h")], ["1", T("每小时结算（1/8 费率）", "Paid hourly (1/8 rate)")]], clock)}
      <div class="demo-btns" style="margin:0"><button class="demo-btn" data-act="seed">${T("换一段行情", "New sample")}</button></div></div>
    <div class="demo-grid">
      ${slider("fr-n", T("多单名义价值（美元）", "Long notional (USD)"), 1000, 100000, 1000, 10000)}
      ${slider("fr-lev", T("杠杆", "Leverage"), 1, 50, 1, 10)}
      ${slider("fr-days", T("持有天数", "Days held"), 1, 90, 1, 30)}
    </div>
    <div class="demo-math" id="fr-f"></div>
    <div id="fr-stats"></div>
    <div class="demo-label">${T("每期资金费（折合每 8 小时）与溢价指数", "Funding each interval (per-8-hour terms) and the premium index")}</div>
    <div id="fr-rate"></div>
    <div class="demo-label">${T("多头累计付出的资金费 vs 按第一期费率外推的“快照年化”", "Cumulative funding paid by the long vs the 'snapshot APR' projected from the first print")}</div>
    <div id="fr-cum"></div>
    <p class="demo-tip">${T("看什么：在“平静”里，溢价忽高忽低，资金费却几乎一直是 0.01%——那是夹逼的死区。“狂热”里费率被推到死区之外，账单迅速变大。选“先狂热后恐慌”：第一期费率外推出的年化（虚线）和真实累计（实线）差得很远——快照年化不是收益承诺。按小时结算只改变付款节奏，不改变总额。", "What to notice: in Calm the premium wobbles but funding sits at 0.01% almost every time: that is the clamp's dead zone. In Euphoric the rate is pushed outside the zone and the bill grows fast. Choose Euphoria then panic: the APR projected from the first print (dashed) and the real cumulative bill (solid) end far apart; a snapshot APR is not a promise. Hourly settlement changes the rhythm of payments, not the total.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const money = (x) => (x < 0 ? "−$" : "$") + Math.abs(x).toLocaleString("en-US", { maximumFractionDigits: 0 });
  const p4 = (x) => (x * 100).toFixed(4) + "%";

  const draw = (v) => {
    const N = v["fr-n"], L = v["fr-lev"], days = v["fr-days"], M = N / L;
    const k8 = days * 3; // number of 8-hour premium intervals
    const R = O.rng(seed);
    const prem = [], rate8 = [];
    let ar = 0;
    for (let k = 0; k < k8; k++) {
      const reg = REG[regime] || (k < k8 / 2 ? REG.hot : REG.panic);
      ar = 0.6 * ar + 0.8 * R.normal();
      const P = reg.m + reg.s * ar;
      prem.push(P);
      rate8.push(O.fundingRate(P, 0.0001, 0.0005));
    }
    // payments: 8-hour clock pays rate8 once; hourly clock pays rate8/8 eight times over the same window
    const perPay = clock === "8" ? 1 : 8;
    let paid = 0;
    const cum = [[0, 0]], snap = [[0, 0]];
    const first = rate8[0];
    for (let k = 0; k < k8; k++) {
      for (let j = 0; j < perPay; j++) paid += O.fundingPayment(N, rate8[k] / perPay);
      cum.push([(k + 1) / 3, paid]);
      snap.push([(k + 1) / 3, O.fundingPayment(N, first) * (k + 1)]);
    }
    const dead = rate8.filter((f) => Math.abs(f - 0.0001) < 1e-12).length;
    const realAPR = paid / N / (days / 365), snapAPR = O.fundingAPR(first, 3);
    const lastP = prem[k8 - 1], lastF = rate8[k8 - 1];
    const div = clock === "1" ? " / 8" : "";
    const payLabel = clock === "1" ? T("最后一期每小时付款", "last hourly payment") : T("最后一期付款", "last payment");
    $("#fr-f").innerHTML = tex(String.raw`F = P + \operatorname{clamp}(I - P,\,-0.05\%,\,+0.05\%) = ${(lastP * 100).toFixed(4)}\% + \underbrace{\operatorname{clamp}(${((0.0001 - lastP) * 100).toFixed(4)}\%)}_{${((lastF - lastP) * 100).toFixed(4)}\%} = ${(lastF * 100).toFixed(4)}\%`, true) +
      tex(String.raw`\text{${payLabel}} = N \times F${div} = ${N.toLocaleString("en-US").replace(/,/g, "{,}")} \times ${((lastF / perPay) * 100).toFixed(perPay > 1 ? 5 : 4)}\% = \$${((N * lastF) / perPay).toFixed(2)}`, true);
    $("#fr-stats").innerHTML = stats([
      [T("多头累计付出", "Total paid by the long"), money(paid), paid > 0 ? "neg" : "pos"],
      [T("占保证金", "Share of margin"), ((paid / M) * 100).toFixed(1) + "%", paid > 0 ? "neg" : "pos"],
      [T("实际年化", "Realised APR"), (realAPR * 100).toFixed(1) + "%"],
      [T("第一期快照年化", "Snapshot APR from print 1"), (snapAPR * 100).toFixed(1) + "%", "acc"],
      [T("正好 0.01% 的期数", "Intervals at exactly 0.01%"), dead + " / " + k8],
    ]);
    const xs = (arr) => arr.map((y, k) => [(k + 0.5) / 3, y * 100]);
    $("#fr-rate").innerHTML = lineChart({
      xmin: 0, xmax: days, xlabel: T("天", "Day"), ylabel: "%", H: 220, yfmt: (y) => y.toFixed(2),
      series: [
        { points: xs(prem), cls: 5, label: T("溢价指数 P", "Premium index P"), dashed: true },
        { points: xs(rate8), cls: 0, label: T("资金费 F（每 8 小时口径）", "Funding F (per 8 hours)") },
      ],
      hlines: [{ y: 0.01, label: "0.01%" }],
    });
    $("#fr-cum").innerHTML = lineChart({
      xmin: 0, xmax: days, xlabel: T("天", "Day"), ylabel: T("美元", "USD"), H: 220,
      series: [
        { points: cum, cls: 4, label: T("真实累计（多头付出）", "Actual cumulative (paid by long)") },
        { points: snap, cls: 5, dashed: true, label: T("按第一期费率外推", "Projected from the first print") },
      ],
    });
  };
  const run = bindSliders(root, { "fr-n": (x) => "$" + x.toLocaleString("en-US"), "fr-lev": (x) => x + "×", "fr-days": (x) => x + T(" 天", " days") }, draw);
  onSeg(root, "fr-reg", (r) => { regime = r; run(); });
  onSeg(root, "fr-clock", (c) => { clock = c; run(); });
  $("[data-act=seed]").addEventListener("click", () => { seed = (seed * 17 + 3) % 1013; run(); });
}
