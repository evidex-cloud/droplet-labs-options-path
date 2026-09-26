// Inline demo for lesson term-structure: an illustrative volatility surface σ(K, T) as a heatmap,
// with a horizontal slice (the smile at one expiry) and vertical slices (term structures at fixed moneyness).
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, tex } from "./_viz.js";

const TENORS = [7, 14, 30, 60, 90, 180, 365];
const STRIKES = [80, 85, 90, 95, 100, 105, 110, 115, 120];
const S = 100, r = 0.04, T30 = 30 / 365;
// the 30-day smile is the SVI smile of lesson smile-skew (90 strike 25.2%, ATM 20%)
const SVI = { a: 0.00254, b: 0.012, rho: -0.8, m: 0.01, s: 0.05 };
const k0 = (d) => Math.log(S / O.forward(S, d / 365, r));
const dev30 = (k30) => O.sviVol(k30, T30, SVI) - O.sviVol(k0(30), T30, SVI);

// ATM (100-strike) vol by regime
function atmVol(regime, d) {
  const T = d / 365;
  if (regime === "earn") return Math.sqrt(0.18 * 0.18 + (d > 21 ? 0.000625 / T : 0));
  const v0 = regime === "calm" ? 0.14 * 0.14 : 0.45 * 0.45, th = 0.04, k = 3;
  return Math.sqrt(th + (v0 - th) * (1 - Math.exp(-k * T)) / (k * T));
}
// skew: the 30-day smile read in standardised moneyness, so a tenor of d days sees ln(K/F) stretched by √(30/d)
function surf(regime, K, d) {
  const k = Math.log(K / O.forward(S, d / 365, r)), k30 = k0(30) + (k - k0(d)) * Math.sqrt(30 / d);
  const tilt = regime === "stress" ? 1.4 : 1;
  return O.clamp(atmVol(regime, d) + tilt * dev30(k30), 0.03, 1.5);
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let regime = "earn", tenor = 30;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("波动率曲面：横着看是微笑，竖着看是期限结构", "The vol surface: read across for a smile, down for a term structure")}</div>
    <div class="demo-row">${seg("tss-reg", [["earn", T("XYZ 财报前", "XYZ before earnings")], ["calm", T("平静市场", "Calm market")], ["stress", T("恐慌市场", "Stressed market")]], regime)}</div>
    <div class="demo-row"><span class="demo-label">${T("选一个到期日（高亮一行）：", "Pick an expiry (highlights a row):")}</span>${seg("tss-ten", TENORS.map((d) => [d, d === 365 ? T("1 年", "1y") : d + T(" 天", "d")]), tenor)}</div>
    <div id="tss-grid" style="overflow-x:auto"></div>
    <div class="demo-grid">
      <div id="tss-smile"></div>
      <div id="tss-term"></div>
    </div>
    <div class="demo-math" id="tss-f"></div>
    <p class="demo-tip">${T("看什么：在“恐慌市场”里，每一列从上到下都在变小（期限结构倒挂）；在任何状态下，最上面几行的左右两端差得最多——短期的偏斜在行权价尺度上最陡。", "What to notice: in the stressed market every column shrinks from top to bottom (an inverted term structure); in every regime the top rows differ most from left to right — short-dated skew is steepest in strike terms.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = () => {
    const all = TENORS.flatMap((d) => STRIKES.map((m) => surf(regime, m, d)));
    const lo = Math.min(...all), hi = Math.max(...all);
    const cell = (v, on) => {
      const p = Math.round(8 + 72 * ((v - lo) / (hi - lo || 1)));
      return `<td style="text-align:center;padding:4px 2px;background:color-mix(in srgb, var(--orange) ${p}%, var(--surface));${on ? "outline:2px solid var(--ink);outline-offset:-2px;font-weight:700" : ""}">${(v * 100).toFixed(1)}</td>`;
    };
    $("#tss-grid").innerHTML = `<table style="width:100%;font-size:12px;border-collapse:collapse"><thead><tr><th style="white-space:nowrap">${T("到期 / 行权价", "Expiry / strike")}</th>${STRIKES.map((m) => `<th>${m}</th>`).join("")}</tr></thead><tbody>${TENORS.map((d) => `<tr${d === tenor ? ' class="hl"' : ""}><th style="text-align:right;padding-right:6px;white-space:nowrap">${d === 365 ? T("1 年", "1y") : d + T(" 天", "d")}</th>${STRIKES.map((m) => cell(surf(regime, m, d), d === tenor)).join("")}</tr>`).join("")}</tbody></table>`;
    const smile = []; for (let m = 80; m <= 120; m += 1) smile.push([m, surf(regime, m, tenor) * 100]);
    $("#tss-smile").innerHTML = lineChart({
      series: [{ points: smile, cls: 0, label: T("微笑：", "Smile: ") + (tenor === 365 ? T("1 年", "1y") : tenor + T(" 天", "d")) }],
      xmin: 80, xmax: 120, H: 200, W: 320, xlabel: T("行权价（XYZ = 100）", "strike (XYZ = 100)"), yfmt: (y) => y.toFixed(0) + "%",
      markers: [{ x: 100, label: "ATM" }],
    });
    const term = (m) => TENORS.map((d) => [d, surf(regime, m, d) * 100]);
    $("#tss-term").innerHTML = lineChart({
      series: [{ points: term(90), cls: 2, label: T("行权价 90", "strike 90"), dots: true }, { points: term(100), cls: 0, label: "ATM", dots: true }, { points: term(110), cls: 3, label: T("行权价 110", "strike 110"), dots: true }],
      xmin: 0, xmax: 365, H: 200, W: 320, xlabel: T("到期天数", "days to expiry"), yfmt: (y) => y.toFixed(0) + "%",
      markers: [{ x: tenor, label: "" }],
    });
    const a = surf(regime, 100, tenor), p90 = surf(regime, 90, tenor);
    $("#tss-f").innerHTML = tex(String.raw`\sigma_{\text{${tenor === 365 ? T("1 年", "1y") : tenor + T(" 天", "d")}}}(K{=}90) - \sigma_{\text{${tenor === 365 ? T("1 年", "1y") : tenor + T(" 天", "d")}}}(K{=}100) = ${(p90 * 100).toFixed(1)}\% - ${(a * 100).toFixed(1)}\% = ${((p90 - a) * 100).toFixed(1)}\ \text{${T("个波动率点", "vol pts")}},\qquad w = \sigma^2 T = ${(a * a * tenor / 365).toFixed(4)}`, true);
  };
  onSeg(root, "tss-reg", (v) => { regime = v; draw(); });
  onSeg(root, "tss-ten", (v) => { tenor = +v; draw(); });
  draw();
}
