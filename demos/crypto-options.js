// Main demo for lesson crypto-options: a bitcoin option pricer (illustrative BTC price), with the payoff shown in dollars
// (linear, stablecoin- or dollar-settled) or in bitcoin (inverse, coin-settled), and DVOL turned into expected moves.
// Priced with Black-Scholes at r = q = 0, i.e. off the forward (the forward and discounting are ignored for simplicity).
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let type = "call", side = "long", unit = "btc";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("比特币期权定价器：美元结算 vs 币本位结算", "Bitcoin option pricer: dollar-settled vs coin-settled")}</div>
    <p class="demo-meta">${T("BTC 价格仅为示意（100,000 美元不是当前价格）。按 r = 0 定价。", "The BTC price is illustrative ($100,000 is not a current price). Priced with r = 0.")}</p>
    <div class="demo-row">${seg("co-type", [["call", T("看涨", "Call")], ["put", T("看跌", "Put")]], type)}
      ${seg("co-side", [["long", T("买入", "Long")], ["short", T("卖出", "Short")]], side)}
      ${seg("co-unit", [["usd", T("按美元结算（线性）", "Settled in dollars (linear)")], ["btc", T("按 BTC 结算（反向）", "Settled in BTC (inverse)")]], unit)}</div>
    <div class="demo-grid">
      ${slider("co-s", T("BTC 价格（示意）", "BTC price (illustrative)"), 50000, 150000, 1000, 100000)}
      ${slider("co-k", T("行权价 K", "Strike K"), 50000, 150000, 1000, 100000)}
      ${slider("co-d", T("离到期天数", "Days to expiry"), 1, 90, 1, 30)}
      ${slider("co-v", T("隐含波动率（如 DVOL）", "Implied vol (e.g. DVOL)"), 20, 120, 1, 50)}
    </div>
    <div class="demo-math" id="co-f"></div>
    <div id="co-stats"></div>
    <div id="co-chart"></div>
    <p class="demo-tip">${T("试试：按 BTC 结算时，看涨的收益最多逼近 1 BTC；再选“看跌”和“卖出”，BTC 计价的亏损在价格趋近零时没有上限；切到“按美元结算”，又回到熟悉的曲棍球棒。把 σ 从 50% 拉到 100%，平值价格几乎翻倍，预期波动也翻倍。", "Try this: settled in BTC, the call's payoff can never quite reach 1 BTC; pick “Put” and “Short” and the loss measured in BTC has no ceiling as the price falls toward zero; switch to “Settled in dollars” and the familiar hockey stick returns. Push σ from 50% to 100% and the at-the-money price and the expected move both roughly double.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const S = v["co-s"], K = v["co-k"], days = v["co-d"], sigma = v["co-v"] / 100, Tm = days / 365;
    const g = O.greeks({ S, K, T: Tm, r: 0, sigma, type });
    const px = g.price, pxB = px / S, sg = side === "long" ? 1 : -1;
    const daily = S * sigma / Math.sqrt(365), toExp = S * sigma * Math.sqrt(Tm);
    const n = (x) => Math.round(x).toLocaleString("en-US").replace(/,/g, "{,}");
    const pay = type === "call" ? String.raw`\max(S_T - K,\,0)` : String.raw`\max(K - S_T,\,0)`;
    $("#co-f").innerHTML = (unit === "btc"
      ? tex(String.raw`\text{${T("到期收益（BTC）", "payoff in BTC")}} = \frac{${pay}}{S_T}`, true)
        + tex(String.raw`\text{${T("权利金", "premium")}} = \frac{${n(px)}}{${n(S)}} = ${pxB.toFixed(4)}\ \text{BTC}`, true)
      : tex(String.raw`\text{${T("到期收益（美元）", "payoff in USD")}} = ${pay},\qquad \text{${T("权利金", "premium")}} = \$${n(px)}`, true))
      + tex(String.raw`1\sigma_{\text{${T("每日", "daily")}}} \approx \frac{S \sigma}{\sqrt{365}} = \frac{${n(S)} \times ${sigma.toFixed(2)}}{19.1} = \$${n(daily)}`, true)
      + tex(String.raw`1\sigma_{\text{${T("到期", "to expiry")}}} = S\sigma\sqrt{T} = \$${n(toExp)}`, true);
    $("#co-stats").innerHTML = stats([
      [T("价格（美元）", "Price (USD)"), "$" + Math.round(px).toLocaleString("en-US"), "acc"],
      [T("价格（BTC）", "Price (BTC)"), pxB.toFixed(4)],
      [T("占现价比例", "As % of spot"), (pxB * 100).toFixed(2) + "%"],
      ["Δ", g.delta.toFixed(3)],
      [T("Vega（每波动率点）", "Vega (per vol point)"), "$" + g.vega.toFixed(0)],
      [T("Theta（每天，含周末）", "Theta (per day, weekends too)"), "−$" + Math.abs(g.theta).toFixed(0)],
    ]);
    const lo = Math.max(1000, Math.min(S, K) * 0.3), hi = Math.max(S, K) * 2.2;
    const payoffUsd = (x) => O.intrinsic(type, x, K);
    const f = unit === "btc" ? (x) => sg * (payoffUsd(x) / x - pxB) : (x) => sg * (payoffUsd(x) - px);
    $("#co-chart").innerHTML = lineChart({
      xmin: lo, xmax: hi, xlabel: T("到期时的 BTC 价格（美元）", "BTC price at expiry ($)"), ylabel: unit === "btc" ? T("盈亏（BTC）", "P&L (BTC)") : T("盈亏（美元）", "P&L ($)"),
      series: [{ f, cls: side === "long" ? 3 : 2, label: unit === "btc" ? T("以 BTC 计的到期盈亏", "P&L at expiry, in BTC") : T("以美元计的到期盈亏", "P&L at expiry, in dollars") }],
      markers: [{ x: K, label: "K" }, { x: S, label: "S" }], samples: 200,
      ...(unit === "btc" && type === "call" && side === "long" ? { hlines: [{ y: 1 - pxB, label: T("上限：1 BTC − 权利金", "ceiling: 1 BTC − premium") }] } : {}),
    });
  };
  const k = (x) => "$" + (+x).toLocaleString("en-US");
  const rerun = bindSliders(root, { "co-s": k, "co-k": k, "co-d": (x) => x + T(" 天", " days"), "co-v": (x) => x + "%" }, draw);
  onSeg(root, "co-type", (x) => { type = x; rerun(); });
  onSeg(root, "co-side", (x) => { side = x; rerun(); });
  onSeg(root, "co-unit", (x) => { unit = x; rerun(); });
}
