// Main demo for lesson derivatives: a farmer and a baker agree a forward. Slide the harvest price and see
// each side's P&L, that they sum to zero, and that both end up with the agreed price. Switch to an option to see
// what "a right, not an obligation" changes.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let kind = "fwd";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("农夫与面包师：一份远期合约的两边", "The farmer and the baker: two sides of one forward")}</div>
    <div class="demo-row">${seg("dv-kind", [["fwd", T("远期（双方都有义务）", "Forward (both obligated)")], ["opt", T("看涨期权（面包师只有权利）", "Call option (baker holds a right)")]], kind)}</div>
    <div class="demo-grid">
      ${slider("dv-s", T("收获时的小麦价格", "Wheat price at harvest"), 50, 150, 1, 120)}
      ${slider("dv-f", T("约定价格 F（或行权价 K）", "Agreed price F (or strike K)"), 80, 120, 1, 100)}
      ${slider("dv-q", T("数量（吨）", "Quantity (tonnes)"), 100, 2000, 100, 1000)}
    </div>
    <div class="demo-math" id="dv-f1"></div>
    <div id="dv-stats"></div>
    <div id="dv-chart"></div>
    <p class="demo-tip">${T("试试：把收获价从 60 拉到 140。远期下，两条线永远一正一负、相加为零，而且双方的“实际成交价”都钉在约定价上；切换到期权后，面包师先付权利金，价格下跌时可以不履约——代价是那笔权利金。", "Try this: drag the harvest price from 60 to 140. With the forward the two P&Ls always cancel and both sides end up at the agreed price; switch to the option and the baker pays a premium up front and can walk away when prices fall — the premium is the price of that choice.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const usd = (x) => (x < 0 ? "−$" : x > 0 ? "+$" : "$") + Math.abs(Math.round(x)).toLocaleString("en-US");
  const tn = (x) => Math.abs(Math.round(x)).toLocaleString("en-US").replace(/,/g, "{,}");
  const draw = (v) => {
    const S = v["dv-s"], F = v["dv-f"], Q = v["dv-q"];
    // Illustrative option premium, priced with the engine: 6 months, σ 20%, r 4%, spot 100.
    const prem = O.bsPrice({ S: 100, K: F, T: 0.5, r: 0.04, sigma: 0.2, type: "call" });
    const longPL = kind === "fwd" ? (x) => x - F : (x) => Math.max(x - F, 0) - prem;
    const shortPL = (x) => -longPL(x);
    const bL = longPL(S) * Q, fS = shortPL(S) * Q;
    const bakerCost = S - longPL(S), farmerRev = S + shortPL(S);
    $("#dv-f1").innerHTML = kind === "fwd"
      ? tex(String.raw`\Pi_{\text{${T("面包师", "baker")}}} = (S_T - F)\,Q = (${S} - ${F}) \times ${Q} = ${bL < 0 ? "-" : ""}${tn(bL)}`, true) + tex(String.raw`\Pi_{\text{${T("农夫", "farmer")}}} = (F - S_T)\,Q = ${fS < 0 ? "-" : ""}${tn(fS)}, \quad \text{${T("合计", "sum")}} = 0`, true)
      : tex(String.raw`\Pi_{\text{${T("面包师", "baker")}}} = \big[\max(S_T - K, 0) - c\big]\,Q = \big[\max(${S} - ${F}, 0) - ${prem.toFixed(2)}\big] \times ${Q} = ${bL < 0 ? "-" : ""}${tn(bL)}`, true);
    $("#dv-stats").innerHTML = stats([
      [T("面包师（多头）损益", "Baker (long) P&L"), usd(bL), bL >= 0 ? "pos" : "neg"],
      [T("农夫（空头）损益", "Farmer (short) P&L"), usd(fS), fS >= 0 ? "pos" : "neg"],
      [T("两边相加", "Sum of both sides"), usd(bL + fS), "acc"],
      [T("面包师每吨实际成本", "Baker's all-in cost per tonne"), "$" + bakerCost.toFixed(2)],
      [T("农夫每吨实际收入", "Farmer's all-in revenue per tonne"), "$" + farmerRev.toFixed(2)],
      ...(kind === "opt" ? [[T("权利金（每吨，示意）", "Premium per tonne (illustrative)"), "$" + prem.toFixed(2)]] : []),
    ]);
    $("#dv-chart").innerHTML = lineChart({
      xmin: 50, xmax: 150, xlabel: T("收获时的小麦价格（美元/吨）", "Wheat price at harvest ($ per tonne)"), ylabel: T("损益（美元）", "P&L ($)"),
      series: [
        { f: (x) => longPL(x) * Q, cls: 0, label: T("面包师（买方/多头）", "Baker (buyer / long)") },
        { f: (x) => shortPL(x) * Q, cls: 1, label: T("农夫（卖方/空头）", "Farmer (seller / short)") },
        { f: () => 0, cls: 5, dashed: true, label: T("两边之和 = 0", "Sum of both = 0") },
      ],
      markers: [{ x: F, label: (kind === "fwd" ? "F = " : "K = ") + F }],
      points: [{ x: S, y: bL, cls: 0, label: usd(bL) }, { x: S, y: fS, cls: 1, label: usd(fS) }],
    });
  };
  const run = bindSliders(root, { "dv-s": (x) => "$" + x, "dv-f": (x) => "$" + x, "dv-q": (x) => x.toLocaleString("en-US") + T(" 吨", " t") }, draw);
  onSeg(root, "dv-kind", (k) => { kind = k; run(); });
}
