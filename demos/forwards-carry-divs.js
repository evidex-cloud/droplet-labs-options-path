// Inline demo for lesson forwards-carry: discrete dividends. The forward for every delivery date,
// with a jump down at each dividend date, versus the smooth dividend-yield approximation.
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S = 100, r = 0.04;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("离散股息：远期在除息日跳一下", "Discrete dividends: the forward jumps at each dividend")}</div>
    <div class="demo-grid">
      ${slider("fd-T", T("交割天数 T", "Delivery in (days) T"), 30, 730, 1, 365)}
      ${slider("fd-d1", T("第 1 笔股息", "Dividend 1"), 0, 5, 0.25, 1)}
      ${slider("fd-t1", T("第 1 笔在第几天", "Dividend 1 on day"), 1, 730, 1, 182)}
      ${slider("fd-d2", T("第 2 笔股息", "Dividend 2"), 0, 5, 0.25, 0)}
      ${slider("fd-t2", T("第 2 笔在第几天", "Dividend 2 on day"), 1, 730, 1, 547)}
    </div>
    <div class="demo-math" id="fd-f"></div>
    <div id="fd-stats"></div>
    <div id="fd-chart"></div>
    <p class="demo-tip">${T("看什么：把交割日拖过第一笔股息的日期，远期立刻往下跳大约一笔股息的金额。平滑的股息率近似只在交割日 T 那一点正好对上。", "What to notice: drag the delivery date past the first dividend date and the forward drops by about the dividend. The smooth-yield approximation only matches exactly at the chosen delivery date T.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  bindSliders(root, { "fd-T": (x) => x + T(" 天", " days"), "fd-d1": (x) => "$" + (+x).toFixed(2), "fd-t1": (x) => T("第 ", "day ") + x + T(" 天", ""), "fd-d2": (x) => "$" + (+x).toFixed(2), "fd-t2": (x) => T("第 ", "day ") + x + T(" 天", "") }, (v) => {
    const Td = v["fd-T"], Tm = Td / 365;
    const divs = [[v["fd-d1"], v["fd-t1"]], [v["fd-d2"], v["fd-t2"]]].filter(([d]) => d > 0);
    const pvUpTo = (days) => divs.filter(([, t]) => t < days).reduce((a, [d, t]) => a + d * Math.exp(-r * t / 365), 0);
    const fwd = (days) => (S - pvUpTo(days)) * Math.exp(r * days / 365);
    const pv = pvUpTo(Td), F = fwd(Td), F0 = S * Math.exp(r * Tm);
    const qEq = pv > 0 ? -Math.log((S - pv) / S) / Tm : 0;
    const inside = divs.filter(([, t]) => t < Td);
    const pvTerms = inside.length ? inside.map(([d, t]) => String.raw`${d.toFixed(2)}e^{-0.04\times ${(t / 365).toFixed(3)}}`).join(" + ") : "0";
    $("#fd-f").innerHTML = tex(String.raw`\mathrm{PV}(D) = ${pvTerms} = ${pv.toFixed(4)}`, true)
      + tex(String.raw`F = \big(S - \mathrm{PV}(D)\big)e^{rT} = (100 - ${pv.toFixed(4)})\,e^{0.04\times ${Tm.toFixed(3)}} = ${F.toFixed(2)}`, true);
    $("#fd-stats").innerHTML = stats([
      [T("无股息的远期", "Forward with no dividend"), "$" + F0.toFixed(2)],
      [T("有股息的远期", "Forward with dividends"), "$" + F.toFixed(2), "acc"],
      [T("股息让远期降低", "Dividends lower it by"), "$" + (F0 - F).toFixed(2)],
      [T("等价的连续股息率", "Equivalent dividend yield"), (qEq * 100).toFixed(2) + "%"],
    ]);
    $("#fd-chart").innerHTML = lineChart({
      xmin: 1, xmax: 730, samples: 365, xlabel: T("交割天数", "Days to delivery"), ylabel: T("远期价格", "Forward price"),
      series: [
        { f: (d) => S * Math.exp(r * d / 365), cls: 5, dashed: true, label: T("无股息", "no dividend") },
        { f: (d) => fwd(d), cls: 0, label: T("离散股息（精确）", "discrete dividends (exact)") },
        { f: (d) => S * Math.exp((r - qEq) * d / 365), cls: 1, dashed: true, label: T("按 T 校准的平滑股息率", "smooth yield fitted at T") },
      ],
      markers: [...divs.map(([d, t], i) => ({ x: t, label: "D" + (i + 1) })), { x: Td, label: "T" }],
      points: [{ x: Td, y: F, cls: 0, label: "$" + F.toFixed(2) }],
    });
  });
}
