// Inline demo for lesson contract-specs: premium paid vs the notional value a position controls.
// XYZ at $100; 30-day calls priced with Black-Scholes (σ 20%, r 4%).
import * as O from "./_opt.js";
import { seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S = 100;
  const prem = (K) => Math.round(O.bsPrice({ S, K, T: 30 / 365, r: 0.04, sigma: 0.2, type: "call" }) * 100) / 100;
  let K = 100;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("付的是权利金，管的是名义价值", "You pay the premium; you control the notional")}</div>
    <div class="demo-row"><span class="demo-label">${T("30 天看涨，行权价", "30-day call, strike")}</span>
      ${seg("csn-k", [[95, "95"], [100, "100"], [105, "105"], [110, "110"]], K)}</div>
    ${slider("csn-n", T("合约张数", "Contracts"), 1, 20, 1, 1)}
    <div class="demo-math" id="csn-f"></div>
    <div id="csn-bars"></div>
    <div id="csn-stats"></div>
    <p class="demo-tip">${T("看什么：张数翻倍，权利金和名义价值一起翻倍，但两者的比例不变。行权价越高，权利金越小，同样的钱能买的张数越多——名义价值被放大的倍数也越高。", "What to notice: double the contracts and both the premium and the notional double, but their ratio stays put. A higher strike is cheaper, so the same money buys more contracts — and controls far more notional.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const n = v["csn-n"], c = prem(K), paid = c * 100 * n, notional = S * 100 * n;
    const usd = (x) => "$" + x.toLocaleString("en-US", { maximumFractionDigits: 0 });
    $("#csn-f").innerHTML = tex(String.raw`\underbrace{${c.toFixed(2)} \times 100 \times ${n}}_{\text{${T("权利金", "premium")}}} = \$${paid.toLocaleString("en-US", { maximumFractionDigits: 0 }).replace(/,/g, "{,}")} \qquad \underbrace{100 \times 100 \times ${n}}_{\text{${T("名义价值", "notional")}}} = \$${notional.toLocaleString("en-US").replace(/,/g, "{,}")}`, true);
    const max = notional;
    const bar = (label, val, color) => `<div class="bar2"><span class="lab">${label}</span><span class="track"><span class="fill" style="display:block;width:${Math.max((val / max) * 100, 0.6)}%;background:${color}"></span></span><span class="val">${usd(val)}</span></div>`;
    $("#csn-bars").innerHTML = bar(T("权利金", "Premium"), paid, "var(--orange)") + bar(T("名义价值", "Notional"), notional, "var(--blue)");
    $("#csn-stats").innerHTML = stats([
      [T("权利金 ÷ 名义价值", "Premium ÷ notional"), ((paid / notional) * 100).toFixed(2) + "%", "acc"],
      [T("名义价值是权利金的", "Notional is premium ×"), (notional / paid).toFixed(0) + "×"],
      [T("XYZ 每动 1%，名义价值变动", "Each 1% XYZ move changes notional by"), usd(notional * 0.01)],
      [T("最多亏损（买方）", "Most the buyer can lose"), usd(paid), "neg"],
    ]);
  };
  const run = bindSliders(root, { "csn-n": (x) => x + T(" 张", "") }, draw);
  onSeg(root, "csn-k", (v) => { K = +v; run(); });
}
