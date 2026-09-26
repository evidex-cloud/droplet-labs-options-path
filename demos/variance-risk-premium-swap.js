// Inline demo for lesson variance-risk-premium: a variance swap's payoff, and why a short position in it
// has a capped gain and an open-ended, accelerating loss (compared with a volatility swap).
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let side = "short";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("方差互换：按实际方差结算的一纸合约", "Variance swap: a contract settled on realized variance")}</div>
    <div class="demo-row">${seg("vs-side", [["short", T("卖方（收溢价）", "Short (collects the premium)")], ["long", T("买方（买保险）", "Long (buys insurance)")]], side)}</div>
    <div class="demo-grid">
      ${slider("vs-k", T("执行波动率 K（点）", "Strike K (vol points)"), 10, 40, 1, 20)}
      ${slider("vs-r", T("到期时的实际波动率（点）", "Realized vol at maturity (points)"), 5, 90, 1, 15)}
      ${slider("vs-n", T("Vega 名义（美元 / 波动率点）", "Vega notional ($ per vol point)"), 500, 5000, 500, 1000)}
    </div>
    <div class="demo-math" id="vs-f"></div>
    <div id="vs-s"></div>
    <div id="vs-c"></div>
    <p class="demo-tip">${T("看什么：卖方最多赚到实际波动率为 0 时的那一点（K² × 方差名义），但实际波动率越高，亏损越是加速——曲线是抛物线，而波动率互换（虚线）只是直线。把实际波动率拉到 80，看看像 2008 年那样的月份对卖方意味着什么。", "What to notice: the seller's gain is capped (at realized vol 0 it earns K² × the variance notional), but the loss accelerates as realized vol rises — a parabola, while the volatility swap (dashed) is a straight line. Drag realized vol to 80 to see what a 2008-style month means for the seller.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const K = v["vs-k"], R = v["vs-r"], Nv = v["vs-n"];
    const Nvar = Nv / (2 * K), sg = side === "short" ? -1 : 1;
    const pay = sg * Nvar * (R * R - K * K), volPay = sg * Nv * (R - K);
    const texBig = (x) => (x < 0 ? "-" : "") + String(Math.round(Math.abs(x))).replace(/\B(?=(\d{3})+(?!\d))/g, "{,}");
    $("#vs-f").innerHTML = tex(String.raw`N_{\text{var}} = \frac{N_{\text{vega}}}{2K} = \frac{${texBig(Nv)}}{2 \times ${K}} = ${Nvar.toFixed(2)}`, true) +
      tex(String.raw`\Pi_{\text{${T("买方", "long")}}} = N_{\text{var}}\,(\sigma_R^2 - K^2)`, true) +
      tex(String.raw`= ${Nvar.toFixed(2)} \times (${R}^2 - ${K}^2) = ${texBig(Nvar * (R * R - K * K))}`, true);
    $("#vs-s").innerHTML = stats([
      [T("方差名义（美元 / 方差点）", "Variance notional ($ per variance point)"), "$" + Nvar.toFixed(2)],
      [T("你的方差互换损益", "Your variance-swap P&L"), (pay >= 0 ? "+$" : "−$") + Math.abs(pay).toLocaleString("en-US", { maximumFractionDigits: 0 }), pay >= 0 ? "pos" : "neg"],
      [T("同名义的波动率互换", "Same-notional volatility swap"), (volPay >= 0 ? "+$" : "−$") + Math.abs(volPay).toLocaleString("en-US", { maximumFractionDigits: 0 })],
      [T("卖方的最大收益", "Seller's maximum gain"), "$" + (Nvar * K * K).toLocaleString("en-US", { maximumFractionDigits: 0 }), "acc"],
    ]);
    $("#vs-c").innerHTML = lineChart({
      xmin: 0, xmax: 90, H: 240, xlabel: T("到期时的实际波动率（点）", "Realized volatility at maturity (points)"), ylabel: T("损益（美元）", "P&L ($)"),
      yfmt: (y) => (Math.abs(y) >= 1000 ? (y / 1000).toFixed(0) + "k" : y.toFixed(0)),
      series: [
        { f: (x) => sg * Nvar * (x * x - K * K), cls: sg < 0 ? 2 : 3, label: T("方差互换", "variance swap") },
        { f: (x) => sg * Nv * (x - K), cls: 5, dashed: true, label: T("波动率互换", "volatility swap") },
      ],
      markers: [{ x: K, label: "K" }],
      points: [{ x: R, y: pay, cls: 0 }],
    });
  };
  const run = bindSliders(root, { "vs-k": (x) => x, "vs-r": (x) => x, "vs-n": (x) => "$" + x }, draw);
  onSeg(root, "vs-side", (x) => { side = x; run(); });
}
