// Inline demo for lesson gamma: the delta-hedged option's P&L for an instant stock move — exact reprice vs ½Γ(dS)².
// Long = long call + short Δ shares (smiles); short = the mirror image (frowns).
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let side = 1;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("对冲掉 Delta 之后，还剩什么？", "Hedge away delta — what is left?")}</div>
    ${seg("gc-side", [["1", T("买入看涨 + 卖出 Δ 股", "Long call + short Δ shares")], ["-1", T("卖出看涨 + 买入 Δ 股", "Short call + long Δ shares")]], "1")}
    <div class="demo-grid" style="margin-top:.5rem">
      ${slider("gc-d", T("到期天数", "Days to expiry"), 1, 90, 1, 30)}
      ${slider("gc-m", T("瞬间股价变动 dS", "Instant stock move dS"), -8, 8, 0.5, 2)}
    </div>
    <div class="demo-math" id="gc-f"></div>
    <div id="gc-stats"></div>
    <div id="gc-chart"></div>
    <p class="demo-tip">${T("看什么：对冲后的买方曲线是一个笑脸——涨跌都赚；卖方是一个哭脸——涨跌都亏。几美元以内，½Γ(dS)² 和精确值几乎重合；把天数调到 1，笑脸变得又窄又深。", "What to notice: the hedged buyer's curve is a smile — it gains on moves either way; the seller's is a frown. Within a few dollars ½Γ(dS)² sits right on the exact curve; set days to 1 and the smile becomes narrow and deep.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const base = { S: 100, K: 100, r: 0.04, sigma: 0.2, type: "call" };
  const run = bindSliders(root, { "gc-d": (x) => x + T(" 天", x === 1 ? " day" : " days"), "gc-m": (x) => (x >= 0 ? "+$" : "−$") + Math.abs(x) }, (v) => {
    const Tm = v["gc-d"] / 365, dS = v["gc-m"], o = { ...base, T: Tm };
    const g = O.greeks(o);
    const exact = (x) => side * (O.bsPrice({ ...o, S: 100 + x }) - g.price - g.delta * x);
    const est = (x) => side * 0.5 * g.gamma * x * x;
    $("#gc-f").innerHTML = tex(String.raw`${side > 0 ? "" : "-"}\tfrac12\Gamma(\dd S)^2 = ${side > 0 ? "" : "-"}\tfrac12 \times ${g.gamma.toFixed(4)} \times (${dS})^2 = ${est(dS).toFixed(4)} \quad \text{${T("精确", "exact")}}: ${exact(dS).toFixed(4)}`, true);
    $("#gc-stats").innerHTML = stats([
      [T("对冲后盈亏（每张，精确）", "Hedged P&L (per contract, exact)"), O.fmtUsd(exact(dS) * 100, 2), exact(dS) >= 0 ? "pos" : "neg"],
      [T("½Γ(dS)² 估算（每张）", "½Γ(dS)² estimate (per contract)"), O.fmtUsd(est(dS) * 100, 2)],
      [T("对照：一天的 Theta（每张）", "For comparison: one day of theta (per contract)"), O.fmtUsd(side * g.theta * 100, 2), side > 0 ? "neg" : "pos"],
    ]);
    $("#gc-chart").innerHTML = lineChart({
      xmin: -8, xmax: 8, H: 250, xlabel: T("瞬间股价变动 dS（美元）", "Instant stock move dS ($)"), ylabel: T("每股盈亏", "P&L per share"),
      series: [
        { f: exact, cls: side > 0 ? 3 : 2, label: T("精确重新定价", "Exact reprice") },
        { f: est, cls: 1, dashed: true, label: "½Γ(dS)²" },
      ],
      markers: [{ x: dS, label: "dS" }], points: [{ x: dS, y: exact(dS), cls: side > 0 ? 3 : 2 }],
    });
  });
  onSeg(root, "gc-side", (x) => { side = +x; run(); });
}
