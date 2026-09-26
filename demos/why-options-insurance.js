// Inline demo for lesson why-options: what a protective put costs Kai versus what it saves in a drop.
import * as O from "./_opt.js";
import { barChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const base = { S: 100, T: 30 / 365, r: 0.04, sigma: 0.2, type: "put" };
  let K = 95;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("给 100 股 XYZ 买一份 30 天的保险", "Insuring 100 XYZ shares for 30 days")}</div>
    <div class="demo-row"><span class="demo-label">${T("看跌期权行权价（“免赔额”）：", "Put strike (the “deductible”): ")}</span>${seg("woi-k", [[90, "90"], [95, "95"], [100, "100"]], K)}</div>
    ${slider("woi-m", T("30 天后 XYZ 的涨跌", "XYZ's move over 30 days"), -30, 20, 1, -15)}
    <div class="demo-math" id="woi-f"></div>
    <div id="woi-stats"></div>
    <div id="woi-bars"></div>
    <p class="demo-tip">${T("看什么：行权价越低，保费越便宜，但“免赔额”越大；XYZ 上涨时保险白买，损失的正好是保费。把跌幅拉到 −30%，再拉到 +10%，比较两种结局。", "What to notice: a lower strike is cheaper insurance with a bigger deductible; when XYZ rises the premium is simply spent. Compare −30% with +10%.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const usd = (x) => (x < 0 ? "−$" : x > 0 ? "+$" : "$") + Math.abs(Math.round(x)).toLocaleString("en-US");
  const tn = (x) => Math.abs(Math.round(x)).toLocaleString("en-US").replace(/,/g, "{,}");
  const draw = (v) => {
    const m = v["woi-m"] / 100, ST = 100 * (1 + m);
    const p = Math.round(O.bsPrice({ ...base, K }) * 100) / 100;
    const cost = p * 100, payout = Math.max(K - ST, 0) * 100;
    const bare = (ST - 100) * 100, hedged = bare + payout - cost;
    const floor = (K - 100 - p) * 100;
    $("#woi-f").innerHTML = tex(String.raw`\text{${T("保费占持仓", "cost as a share of the shares")}} = \frac{p \times 100}{S_0 \times 100} = \frac{${p.toFixed(2)} \times 100}{10{,}000} = ${(p).toFixed(2)}\%`, true) + tex(String.raw`\text{${T("最坏情况", "worst case")}} = (K - S_0 - p) \times 100 = -\$${tn(floor)}`, true);
    $("#woi-stats").innerHTML = stats([
      [T("保费（一张合约）", "Premium (one contract)"), "$" + cost.toFixed(0), "acc"],
      [T("看跌期权赔付", "Put payout"), usd(payout), payout > 0 ? "pos" : ""],
      [T("没买保险的损益", "P&L without the put"), usd(bare), bare >= 0 ? "pos" : "neg"],
      [T("买了保险的损益", "P&L with the put"), usd(hedged), hedged >= 0 ? "pos" : "neg"],
      [T("保险净作用", "Net effect of the put"), usd(hedged - bare), hedged - bare >= 0 ? "pos" : "neg"],
    ]);
    $("#woi-bars").innerHTML = barChart({
      bars: [
        { label: T("没有保险", "No put"), value: bare, cls: bare >= 0 ? 3 : 2 },
        { label: T(`有 ${K} 看跌`, `With the ${K} put`), value: hedged, cls: hedged >= 0 ? 3 : 0 },
      ],
      ymin: -3000, ymax: 2000, yfmt: (y) => (y < 0 ? "−$" : "$") + Math.abs(y).toLocaleString("en-US"), H: 200,
    });
  };
  const run = bindSliders(root, { "woi-m": (x) => (x > 0 ? "+" : "") + x + "%" }, draw);
  onSeg(root, "woi-k", (k) => { K = +k; run(); });
}
