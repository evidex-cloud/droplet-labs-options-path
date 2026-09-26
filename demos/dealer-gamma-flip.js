// Inline demo for lesson dealer-gamma: slide XYZ's price across the "flip" and watch each strike's GEX contribution,
// the total, and the stylised shock multiplier 1 / (1 + G/D). Dealers long calls and short puts (the usual convention).
import * as O from "./_opt.js";
import { barChart, slider, bindSliders, stats, tex } from "./_viz.js";

const BOOK = [
  { type: "put", K: 90, n: -30000 }, { type: "put", K: 95, n: -40000 }, { type: "put", K: 100, n: -15000 },
  { type: "call", K: 100, n: 20000 }, { type: "call", K: 105, n: 40000 }, { type: "call", K: 110, n: 30000 },
];
const D = 2e6; // illustrative market depth: shares needed to move XYZ by $1

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("滑过翻转点：GEX 按行权价拆开", "Slide across the flip: GEX strike by strike")}</div>
    <div class="demo-grid">
      ${slider("dgf-s", T("XYZ 现价 S", "XYZ spot S"), 86, 114, 0.5, 100)}
      ${slider("dgf-d", T("离到期天数", "Days to expiry"), 1, 30, 1, 30)}
    </div>
    <div id="dgf-bars"></div>
    <div class="demo-math" id="dgf-f"></div>
    <div id="dgf-stats"></div>
    <p class="demo-tip">${T("看什么：股价跌向 95、90 这些做市商做空看跌的行权价时，负的柱子越来越长，合计翻负，冲击被放大。把天数调到 1，Gamma 全挤在现价附近的行权价上。", "What to notice: as XYZ falls toward 95 and 90, where dealers are short puts, the negative bars grow until the total turns negative and shocks get amplified. Set days to 1 and the gamma crowds onto the strikes nearest the spot.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  bindSliders(root, { "dgf-s": (x) => "$" + (+x).toFixed(1), "dgf-d": (x) => x + T(" 天", " days") }, (v) => {
    const S = v["dgf-s"], days = v["dgf-d"];
    const parts = BOOK.map((p) => {
      const g = O.greeks({ S, K: p.K, T: days / 365, r: 0.04, sigma: 0.2, type: p.type }).gamma;
      return { ...p, G: p.n * 100 * g, gex: p.n * 100 * g * S * S * 0.01 };
    });
    const G = parts.reduce((a, p) => a + p.G, 0), gex = parts.reduce((a, p) => a + p.gex, 0);
    $("#dgf-bars").innerHTML = barChart({
      bars: [...parts.map((p) => ({ label: p.K + (p.type === "call" ? "C" : "P"), value: p.gex / 1e6, cls: p.gex >= 0 ? 3 : 2 })), { label: T("合计", "Total"), value: gex / 1e6, cls: 0 }],
      yfmt: (y) => y.toFixed(0) + "M", xlabel: T("每个行权价的 GEX（百万美元/1% 波动）", "GEX by strike ($M per 1% move)"),
    });
    const m = 1 / Math.max(0.25, 1 + G / D);
    const big = (x) => Math.abs(Math.round(x)).toLocaleString("en-US").replace(/,/g, "{,}");
    $("#dgf-f").innerHTML = tex(String.raw`\begin{aligned} G &= \sum_i n_i \Gamma_i \times 100 = ${G < 0 ? "-" : ""}${big(G)}\ \text{${T("股/美元", "shares per \\$1")}} \\[6pt] \frac{1}{1 + G/D} &= \frac{1}{1 ${G < 0 ? "-" : "+"} ${big(G)}/2{,}000{,}000} = ${m.toFixed(2)} \end{aligned}`, true)
      + (1 + G / D < 0.25 ? `<p class="demo-meta">${T("反馈太强时，这个简单模型会发散，演示把乘数封顶在 4 倍。", "When the feedback is this strong the simple model blows up, so the demo caps the multiplier at 4×.")}</p>` : "");
    $("#dgf-stats").innerHTML = stats([
      [T("合计 GEX", "Total GEX"), (gex >= 0 ? "+$" : "−$") + (Math.abs(gex) / 1e6).toFixed(1) + "M", gex >= 0 ? "pos" : "neg"],
      [T("1 美元冲击变成", "A $1 shock becomes"), "$" + m.toFixed(2), m <= 1 ? "pos" : "neg"],
      [T("区域", "Zone"), G >= 0 ? T("刹车区：做市商逆势对冲", "Brake zone: dealers hedge against the move") : T("油门区：做市商顺势对冲", "Accelerator zone: dealers hedge with the move"), "acc"],
    ]);
  });
}
