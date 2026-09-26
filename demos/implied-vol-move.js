// Inline demo for lesson implied-vol: read the implied move from the at-the-money straddle.
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S = 100, K = 100, r = 0.04;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("从跨式价格读出“隐含波动幅度”", "Read the implied move from the straddle")}</div>
    <div class="demo-grid">
      ${slider("ivm-p", T("平值跨式价格（看涨 + 看跌）", "ATM straddle price (call + put)"), 0.5, 15, 0.01, 4.57)}
      ${slider("ivm-d", T("到期天数", "Days to expiry"), 1, 120, 1, 30)}
    </div>
    <div class="demo-math" id="ivm-f"></div>
    <div id="ivm-stats"></div>
    <div id="ivm-chart"></div>
    <p class="demo-tip">${T("看什么：默认的 4.57 美元就是 XYZ 30 天跨式，对应 20% 波动率、±5.73 美元的一个标准差。把价格拉到 6 美元（财报前常见的抬价），隐含波动率跳到约 26%；天数不变时，隐含波动幅度约等于跨式价格的 1.25 倍。", "What to notice: the default $4.57 is XYZ's 30-day straddle — 20% vol and a ±$5.73 one-standard-deviation move. Drag the price to $6 (a typical pre-earnings bid) and implied vol jumps to about 26%. For a given expiry, the implied move is about 1.25 times the straddle price.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  bindSliders(root, { "ivm-p": (x) => "$" + (+x).toFixed(2), "ivm-d": (x) => x + T(" 天", " days") }, (v) => {
    const px = v["ivm-p"], Tm = v["ivm-d"] / 365, sq = Math.sqrt(Tm);
    const strad = (s) => O.bsPrice({ S, K, T: Tm, r, sigma: s, type: "call" }) + O.bsPrice({ S, K, T: Tm, r, sigma: s, type: "put" });
    const floor = strad(1e-6);
    let iv = NaN;
    if (px > floor + 1e-6) { let a = 1e-4, b = 5; for (let i = 0; i < 80; i++) { const m = (a + b) / 2; if (strad(m) > px) b = m; else a = m; } iv = (a + b) / 2; }
    if (!isFinite(iv)) {
      $("#ivm-f").innerHTML = ""; $("#ivm-chart").innerHTML = "";
      $("#ivm-stats").innerHTML = stats([[T("隐含波动率", "Implied vol"), T("价格太低，无解", "price too low: no solution"), "neg"]]);
      return;
    }
    const approx = px / (0.8 * S * sq), move = S * iv * sq, beL = K - px, beH = K + px;
    const pOut = 1 - (O.probAbove(S, beL, Tm, iv, r) - O.probAbove(S, beH, Tm, iv, r));
    const pIn = O.probAbove(S, S - move, Tm, iv, r) - O.probAbove(S, S + move, Tm, iv, r);
    $("#ivm-f").innerHTML =
      tex(String.raw`\sigma_{\text{imp}} \approx \frac{\text{straddle}}{0.8\,S\sqrt{T}} = \frac{${px.toFixed(2)}}{0.8 \times 100 \times ${sq.toFixed(4)}} = ${(approx * 100).toFixed(1)}\%\quad(\text{${T("精确", "exact")}}: ${(iv * 100).toFixed(1)}\%)`, true) +
      tex(String.raw`S\,\sigma_{\text{imp}}\sqrt{T} = 100 \times ${iv.toFixed(4)} \times ${sq.toFixed(4)} = \$${move.toFixed(2)} \approx 1.25 \times ${px.toFixed(2)}`, true);
    $("#ivm-stats").innerHTML = stats([
      [T("隐含波动率", "Implied vol"), (iv * 100).toFixed(1) + "%", "acc"],
      [T("一个标准差的幅度", "1-sd implied move"), "±$" + move.toFixed(2)],
      [T("盈亏平衡点", "Breakevens"), "$" + beL.toFixed(2) + " / $" + beH.toFixed(2)],
      [T("收在盈亏平衡点之外", "Finishes beyond a breakeven"), (pOut * 100).toFixed(0) + "%"],
      [T("落在 ±1 个标准差内", "Within ±1 sd"), (pIn * 100).toFixed(0) + "%"],
    ]);
    const lo = Math.max(1, S - 4.5 * move), hi = S + 4.5 * move;
    let peak = 0; for (let x = lo; x <= hi; x += (hi - lo) / 200) peak = Math.max(peak, O.lognormalPdf(x, S, Tm, iv, r));
    $("#ivm-chart").innerHTML = lineChart({
      H: 220, xmin: lo, xmax: hi, ymin: 0, ymax: peak * 1.3, xlabel: T("到期时的 XYZ 价格（风险中性）", "XYZ at expiry (risk-neutral)"), yfmt: () => "",
      series: [{ f: (x) => O.lognormalPdf(x, S, Tm, iv, r), cls: 0, area: true, label: T("隐含分布", "Implied distribution") }],
      bands: [{ x0: S - move, x1: S + move, cls: 0, label: "±1 sd" }],
      markers: [{ x: beL, label: "BE" }, { x: beH, label: "BE" }],
    });
  });
}
