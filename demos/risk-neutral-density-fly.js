// Inline demo for lesson risk-neutral-density: a butterfly's price is (almost) the probability of landing near its centre.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S = 100, r = 0.04, Tm = 30 / 365, F = O.forward(S, Tm, r), D = Math.exp(r * Tm);
  const svi = { a: 0.00254, b: 0.012, rho: -0.8, m: 0.01, s: 0.05 }; // the 30-day smile of lesson smile-skew
  let smile = "flat";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("蝶式价差 = 一小块概率的价格", "A butterfly = the price of a slice of probability")}</div>
    <div class="demo-row">${seg("rfly-sm", [["flat", T("平坦 20%", "Flat 20%")], ["skew", T("本课的偏斜微笑", "The lesson's skew")]], smile)}</div>
    <div class="demo-grid">
      ${slider("rfly-k", T("中心行权价 K", "Center strike K"), 85, 115, 0.5, 105)}
      ${slider("rfly-h", T("翼宽 h", "Wing width h"), 0.5, 5, 0.5, 1)}
    </div>
    <div class="demo-math" id="rfly-f"></div>
    <div id="rfly-stats"></div>
    <div id="rfly-chart"></div>
    <p class="demo-tip">${T("看什么：翼宽 h 越小，“蝶式价格 ÷ h × eʳᵀ”越接近真实的区间概率；切到偏斜微笑，把 K 拉到 85，看左尾的蝶式变贵了多少。", "What to notice: the narrower the wings h, the closer “fly price ÷ h × eʳᵀ” gets to the true band probability; switch to the skew and move K to 85 to see how much richer left-tail butterflies become.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const K = v["rfly-k"], h = v["rfly-h"];
    const vol = (x) => (smile === "flat" ? 0.2 : O.sviVol(Math.log(x / F), Tm, svi));
    const call = (x) => O.bsPrice({ S, K: x, T: Tm, r, sigma: vol(x), type: "call" });
    const c1 = call(K - h), c2 = call(K), c3 = call(K + h);
    const fly = c1 - 2 * c2 + c3;
    const approx = (fly / h) * D;
    const above = (x) => -(call(x + 0.005) - call(x - 0.005)) / 0.01 * D;
    const band = above(K - h / 2) - above(K + h / 2);
    const fK = O.rndFromCalls(call, K, Tm, r, 0.05);
    $("#rfly-f").innerHTML = tex(String.raw`\underbrace{${c1.toFixed(4)}}_{C(K-h)} - 2 \times \underbrace{${c2.toFixed(4)}}_{C(K)} + \underbrace{${c3.toFixed(4)}}_{C(K+h)} = ${fly.toFixed(4)} \;\Rightarrow\; \frac{${fly.toFixed(4)}}{${h}} \times e^{rT} = ${(approx * 100).toFixed(2)}\%`, true);
    $("#rfly-stats").innerHTML = stats([
      [T("蝶式成本（每股）", "Fly cost (per share)"), "$" + fly.toFixed(4), "acc"],
      [T("一张合约（×100）", "Per contract (×100)"), "$" + (fly * 100).toFixed(2)],
      [T("蝶式 ÷ h × eʳᵀ", "Fly ÷ h × eʳᵀ"), (approx * 100).toFixed(2) + "%"],
      [T("真实区间概率 K ± h/2", "True prob. within K ± h/2"), (band * 100).toFixed(2) + "%"],
      [T("密度 f(K)（每美元）", "Density f(K) (per $)"), fK.toFixed(4)],
      [T("K 处隐含波动率", "Implied vol at K"), (vol(K) * 100).toFixed(1) + "%"],
    ]);
    const pts = [], peak = { v: 0 };
    for (let x = 75; x <= 125; x += 0.25) { const f = O.rndFromCalls(call, x, Tm, r, 0.1); pts.push([x, f]); peak.v = Math.max(peak.v, f); }
    const tent = []; for (let x = K - h - 1; x <= K + h + 1; x += h / 20) tent.push([x, Math.max(0, 1 - Math.abs(x - K) / h) * peak.v]);
    $("#rfly-chart").innerHTML = lineChart({
      series: [{ points: pts, cls: 2, area: true, label: T("风险中性密度", "risk-neutral density") }, { points: tent, cls: 0, label: T("蝶式收益（按比例缩放）", "fly payoff (scaled)") }],
      xmin: 75, xmax: 125, ymin: 0, H: 220, xlabel: T("到期股价", "price at expiry"), yfmt: (y) => y.toFixed(3),
      bands: [{ x0: K - h / 2, x1: K + h / 2, cls: 0 }], markers: [{ x: K, label: "K" }],
    });
  };
  const run = bindSliders(root, { "rfly-k": (x) => "$" + x, "rfly-h": (x) => "$" + x }, draw);
  onSeg(root, "rfly-sm", (v) => { smile = v; run(); });
}
