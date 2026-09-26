// Main demo for lesson moneyness: an XYZ strike grid 80–120 (30-day options, σ 20%, r 4%).
// Slide the stock price; each call and put is tagged ITM / ATM / OTM and shown with a chosen moneyness measure.
import * as O from "./_opt.js";
import { seg, onSeg, slider, bindSliders, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const Tm = 30 / 365, r = 0.04, sigma = 0.2, strikes = [80, 85, 90, 95, 100, 105, 110, 115, 120];
  let measure = "delta";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("XYZ 行权价表：谁在实值，谁在虚值", "The XYZ strike grid: who is in the money, who is out")}</div>
    ${slider("mn-s", T("XYZ 现价 S", "XYZ price S"), 80, 120, 0.5, 100)}
    <div class="demo-row"><span class="demo-label">${T("价内程度用什么量", "Measure")}</span>
      ${seg("mn-m", [["ratio", "S/K"], ["logm", "ln(K/F)"], ["z", T("标准化 z", "standardized z")], ["delta", "Δ"]], measure)}</div>
    <div class="demo-math" id="mn-f"></div>
    <div id="mn-table"></div>
    <p class="demo-tip">${T("试试：把 S 从 100 拉到 110。100 行权价的看涨从“平值”变成“实值”，同一行的看跌则变成“虚值”。切到 Δ：实值期权的 Δ 接近 ±1，虚值期权接近 0——所以交易员常直接说“25-Delta 看跌”。", "Try this: slide S from 100 to 110. The 100 call turns from ATM to ITM while the 100 put on the same row turns OTM. Switch to Δ: ITM options sit near ±1, OTM options near 0 — which is why traders simply say “the 25-delta put”.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const formula = {
    ratio: String.raw`\text{moneyness} = \frac{S}{K}`,
    logm: String.raw`k = \ln\frac{K}{F}, \qquad F = S e^{rT}`,
    z: String.raw`z = \frac{\ln(K/F)}{\sigma\sqrt{T}}`,
    delta: String.raw`\Delta_{\text{call}} = \N(d_1), \qquad \Delta_{\text{put}} = \N(d_1) - 1`,
  };
  const draw = (v) => {
    const S = v["mn-s"], F = O.forward(S, Tm, r), sd = sigma * Math.sqrt(Tm);
    const atmK = strikes.reduce((a, k) => (Math.abs(k - S) < Math.abs(a - S) ? k : a), strikes[0]);
    $("#mn-f").innerHTML = tex(formula[measure], true) + tex(String.raw`S = ${S.toFixed(1)},\quad F = ${F.toFixed(2)},\quad \sigma\sqrt{T} = ${sd.toFixed(4)}`, true);
    const tag = (type, K) => {
      const itm = type === "call" ? S > K : S < K;
      if (K === atmK && Math.abs(S - K) <= 2.5) return `<span class="tag hl">${T("平值", "ATM")}</span>`;
      return itm ? `<span class="tag ok">${T("实值", "ITM")}</span>` : `<span class="tag">${T("虚值", "OTM")}</span>`;
    };
    const meas = (type, K) => {
      if (measure === "ratio") return (S / K).toFixed(3);
      if (measure === "logm") return Math.log(K / F).toFixed(4);
      if (measure === "z") return (Math.log(K / F) / sd).toFixed(2) + "σ";
      const d = O.greeks({ S, K, T: Tm, r, sigma, type }).delta;
      return (Math.abs(d) < 0.0005 ? 0 : d).toFixed(3);
    };
    const price = (type, K) => O.bsPrice({ S, K, T: Tm, r, sigma, type }).toFixed(2);
    const mh = { ratio: "S/K", logm: "ln(K/F)", z: "z", delta: "Δ" }[measure];
    const same = measure === "ratio" || measure === "logm" || measure === "z";
    let rows = "";
    for (const K of strikes) {
      rows += `<tr class="${K === atmK ? "hl" : ""}"><td>${tag("call", K)}</td><td>$${price("call", K)}</td>${same ? "" : `<td>${meas("call", K)}</td>`}<td style="text-align:center"><b>${K}</b></td>${same ? `<td>${meas("call", K)}</td>` : `<td>${meas("put", K)}</td>`}<td>$${price("put", K)}</td><td>${tag("put", K)}</td></tr>`;
    }
    $("#mn-table").innerHTML = `<div style="overflow-x:auto"><table style="width:100%;white-space:nowrap"><thead><tr><th>${T("看涨", "Call")}</th><th>${T("价格", "Price")}</th>${same ? "" : `<th>${mh}</th>`}<th style="text-align:center">K</th><th>${mh}</th><th>${T("价格", "Price")}</th><th>${T("看跌", "Put")}</th></tr></thead><tbody>${rows}</tbody></table></div>
      <div class="demo-out-sm">${same ? T("S/K、ln(K/F)、z 只取决于行权价，不分看涨看跌，所以放在中间一列。", "S/K, ln(K/F) and z depend on the strike only, not on call vs put, so they sit in one middle column.") : T("看涨的 Δ 在 0 到 1 之间，看跌的 Δ 在 −1 到 0 之间。", "Call deltas run from 0 to 1, put deltas from −1 to 0.")}</div>`;
  };
  const run = bindSliders(root, { "mn-s": (x) => "$" + x.toFixed(1) }, draw);
  onSeg(root, "mn-m", (v) => { measure = v; run(); });
}
