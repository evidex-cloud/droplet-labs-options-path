// Inline demo for lesson exotic-options: a digital call (pays $100 if XYZ > 105) vs the call spread that replicates it,
// and how the hedge (delta, in shares per $100 payout) explodes near the strike as expiry approaches.
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("数字期权 ≈ 很窄的看涨价差", "A digital ≈ a very tight call spread")}</div>
    <div class="demo-grid-3 demo-grid">
      ${slider("dg-s", T("XYZ 现价 S", "XYZ spot S"), 95, 115, 0.5, 100)}
      ${slider("dg-d", T("剩余天数", "Days left"), 1, 60, 1, 30)}
      ${slider("dg-w", T("价差宽度 2ε", "Spread width 2ε"), 0.2, 10, 0.2, 5)}
    </div>
    <div class="demo-math" id="dg-f"></div>
    <div id="dg-stats"></div>
    <div id="dg-c1"></div>
    <div id="dg-c2"></div>
    <p class="demo-tip">${T("看什么：把宽度缩小，价差价格贴近数字期权；再把剩余天数拉到 1、现价放在 105 附近，对冲股数会冲到三四十股——这就是“钉住风险”。", "What to notice: shrink the width and the spread's price hugs the digital's; then drag days left to 1 with spot near 105 — the hedge jumps to 30–40 shares per $100 of payout. That is pin risk.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const K = 105, r = 0.04, sigma = 0.2;
  const dig = (S, Tm) => 100 * O.digital({ S, K, T: Tm, r, sigma });
  const spr = (S, Tm, w) => (100 * (O.bsCall(S, K - w / 2, Tm, r, sigma) - O.bsCall(S, K + w / 2, Tm, r, sigma))) / w;
  const dlt = (f, S) => (f(S + 0.01) - f(S - 0.01)) / 0.02;
  bindSliders(root, { "dg-s": (x) => "$" + x, "dg-d": (x) => x + T(" 天", " days"), "dg-w": (x) => "$" + x.toFixed(1) }, (v) => {
    const S = v["dg-s"], Tm = v["dg-d"] / 365, w = v["dg-w"];
    const { d2 } = O.d1d2({ S, K, T: Tm, r, sigma });
    const D = dig(S, Tm), C = spr(S, Tm, w);
    const dD = dlt((x) => dig(x, Tm), S), dC = dlt((x) => spr(x, Tm, w), S);
    $("#dg-f").innerHTML = tex(String.raw`100\,e^{-rT}\N(d_2) = 100 \times ${Math.exp(-r * Tm).toFixed(4)} \times ${O.normCdf(d2).toFixed(4)} = ${D.toFixed(2)}`, true) + tex(String.raw`\frac{100}{2\varepsilon}\big[C(K-\varepsilon) - C(K+\varepsilon)\big] = ${C.toFixed(2)}`, true);
    $("#dg-stats").innerHTML = stats([
      [T("数字期权（付 $100）", "Digital (pays $100)"), "$" + D.toFixed(2), "acc"],
      [T("看涨价差复制", "Call-spread replica"), "$" + C.toFixed(2)],
      [T("差额", "Difference"), "$" + (C - D).toFixed(2)],
      [T("数字期权对冲股数", "Digital hedge (shares)"), dD.toFixed(1), dD > 20 ? "neg" : ""],
      [T("价差对冲股数", "Spread hedge (shares)"), dC.toFixed(1)],
    ]);
    $("#dg-c1").innerHTML = lineChart({
      xmin: 90, xmax: 120, ymin: 0, ymax: 100, H: 220, xlabel: T("XYZ 现价", "XYZ spot"), ylabel: T("价值（$）", "Value ($)"),
      series: [
        { f: (x) => dig(x, Tm), cls: 0, label: T("数字期权", "Digital") },
        { f: (x) => spr(x, Tm, w), cls: 1, dashed: true, label: T("看涨价差", "Call spread") },
        { f: (x) => (x > K ? 100 : 0), cls: 5, label: T("到期收益（台阶）", "Payoff at expiry (step)") },
      ],
      markers: [{ x: K, label: "K = 105" }], points: [{ x: S, y: D, cls: 0 }],
    });
    $("#dg-c2").innerHTML = lineChart({
      xmin: 90, xmax: 120, ymin: 0, H: 200, xlabel: T("XYZ 现价", "XYZ spot"), ylabel: T("对冲股数 / $100", "Shares per $100"),
      series: [
        { f: (x) => dlt((y) => dig(y, Tm), x), cls: 0, label: T("数字期权 Delta", "Digital delta") },
        { f: (x) => dlt((y) => spr(y, Tm, w), x), cls: 1, dashed: true, label: T("价差 Delta", "Spread delta") },
      ],
      markers: [{ x: K, label: "K" }],
    });
  });
}
