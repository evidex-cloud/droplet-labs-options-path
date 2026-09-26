// Inline demo for lesson delta: delta N(d1) vs the risk-neutral ITM probability N(d2) vs a real-world probability
// under a drift you choose. The gap grows with σ√T.
import * as O from "./_opt.js";
import { barChart, slider, bindSliders, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("Delta 是概率吗？三个数放在一起比", "Is delta a probability? Three numbers side by side")}</div>
    <div class="demo-grid">
      ${slider("dp-k", T("看涨行权价 K", "Call strike K"), 80, 150, 1, 105)}
      ${slider("dp-d", T("到期天数", "Days to expiry"), 7, 730, 1, 30)}
      ${slider("dp-v", T("波动率 σ", "Volatility σ"), 10, 80, 1, 20)}
      ${slider("dp-m", T("你相信的真实年化收益 μ", "Real-world expected return μ you believe"), -10, 25, 1, 10)}
    </div>
    <div class="demo-math" id="dp-f"></div>
    <div id="dp-bars"></div>
    <p class="demo-tip">${T("看什么：短期、低波动时三个数挨得很近，用 Delta 粗估“到期实值的机会”问题不大；把天数和 σ 都拉大，Delta 和 N(d₂) 的差距迅速拉开——Delta 明显高估了风险中性概率。", "What to notice: for short, low-vol options the three numbers sit close together, so delta is a fair rough guess of the chance of finishing in the money. Push days and σ up and delta pulls away from N(d₂) — it clearly overstates the risk-neutral probability.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  bindSliders(root, { "dp-k": (x) => "$" + x, "dp-d": (x) => x + T(" 天", x === 1 ? " day" : " days"), "dp-v": (x) => x + "%", "dp-m": (x) => x + "%" }, (v) => {
    const K = v["dp-k"], Tm = v["dp-d"] / 365, sigma = v["dp-v"] / 100, mu = v["dp-m"] / 100;
    const g = O.greeks({ S: 100, K, T: Tm, r: 0.04, sigma, type: "call" });
    const rn = g.probITM, rw = O.probAbove(100, K, Tm, sigma, mu);
    const sT = sigma * Math.sqrt(Tm);
    $("#dp-f").innerHTML = tex(String.raw`\Delta = \N(d_1) = ${g.delta.toFixed(3)}, \quad \N(d_2) = \N(d_1 - \sigma\sqrt{T}) = ${rn.toFixed(3)}, \quad \sigma\sqrt{T} = ${sT.toFixed(3)}`, true);
    $("#dp-bars").innerHTML = barChart({
      bars: [
        { label: T("Delta = N(d₁)", "Delta = N(d₁)"), value: g.delta * 100, cls: 0 },
        { label: T("风险中性 N(d₂)", "Risk-neutral N(d₂)"), value: rn * 100, cls: 1 },
        { label: T(`真实世界（μ = ${v["dp-m"]}%）`, `Real world (μ = ${v["dp-m"]}%)`), value: rw * 100, cls: 3 },
      ],
      ymin: 0, ymax: 100, H: 210, yfmt: (x) => Math.round(x) + "%",
      xlabel: T("S = 100，r = 4%：到期收在 K 以上的“机会”", "S = 100, r = 4%: the “chance” of finishing above K"),
    });
  });
}
