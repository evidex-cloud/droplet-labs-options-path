// Inline demo for lesson calendar-diagonal: forward volatility from two implied vols (total variance adds up).
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("远期波动率计算器：第二段时间被定了什么价？", "Forward-vol calculator: what is the second period priced at?")}</div>
    <div class="demo-grid">
      ${slider("fv-d1", T("近月天数 T₁", "Front days T₁"), 5, 60, 1, 30)}
      ${slider("fv-s1", T("近月 IV σ₁", "Front IV σ₁"), 10, 60, 1, 30)}
      ${slider("fv-d2", T("远月天数 T₂", "Back days T₂"), 20, 180, 1, 60)}
      ${slider("fv-s2", T("远月 IV σ₂", "Back IV σ₂"), 10, 60, 1, 25)}
    </div>
    <div class="demo-math" id="fv-f"></div>
    <div id="fv-stats"></div>
    <div id="fv-chart"></div>
    <p class="demo-tip">${T("看什么：近月 IV 越高于远月，远期波动率掉得越低；把近月再调高，远期方差会变成负数——那就是日历价差套利。曲线向上倾斜时，远期波动率反而高于两个报价。", "What to notice: the more the front IV exceeds the back, the lower the forward vol; push the front higher still and the forward variance turns negative — a calendar arbitrage. In an upward-sloping curve the forward vol is above both quotes.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  bindSliders(root, { "fv-d1": (x) => x + T(" 天", " days"), "fv-s1": (x) => x + "%", "fv-d2": (x) => x + T(" 天", " days"), "fv-s2": (x) => x + "%" }, (v) => {
    const d1 = v["fv-d1"], d2 = Math.max(v["fv-d2"], d1 + 5), s1 = v["fv-s1"] / 100, s2 = v["fv-s2"] / 100;
    if (v["fv-d2"] < d1 + 5) { $("#fv-d2").value = String(d2); $("#fv-d2-v").textContent = d2 + T(" 天", " days"); }
    const w1 = (s1 * s1 * d1) / 365, w2 = (s2 * s2 * d2) / 365;
    const f2 = (w2 - w1) / ((d2 - d1) / 365), ok = f2 > 0, fwd = ok ? Math.sqrt(f2) : NaN;
    $("#fv-f").innerHTML = tex(String.raw`\begin{gathered}\sigma_{\text{fwd}}^2 = \frac{\sigma_2^2 T_2 - \sigma_1^2 T_1}{T_2 - T_1} \\ = \frac{${(s2 * s2).toFixed(4)} \times ${d2} - ${(s1 * s1).toFixed(4)} \times ${d1}}{${d2 - d1}} = ${f2.toFixed(4)} \\ \Rightarrow\ \sigma_{\text{fwd}} = ${ok ? (fwd * 100).toFixed(1) + "\\%" : "\\text{" + T("无解（负方差）", "undefined (negative variance)") + "}"}\end{gathered}`, true);
    $("#fv-stats").innerHTML = stats([
      [T(`到 ${d1} 天的总方差`, `Total variance to ${d1} days`), w1.toFixed(5)],
      [T(`到 ${d2} 天的总方差`, `Total variance to ${d2} days`), w2.toFixed(5)],
      [T("远期波动率", "Forward vol"), ok ? (fwd * 100).toFixed(1) + "%" : T("套利！", "arbitrage!"), ok ? "acc" : "neg"],
    ]);
    $("#fv-chart").innerHTML = lineChart({
      series: [
        { points: [[0, 0], [d1, w1]], cls: 5, label: T(`近月段（${(s1 * 100).toFixed(0)}%）`, `front segment (${(s1 * 100).toFixed(0)}%)`) },
        { points: [[d1, w1], [d2, w2]], cls: ok ? 0 : 2, label: ok ? T(`远期段（${(fwd * 100).toFixed(1)}%）`, `forward segment (${(fwd * 100).toFixed(1)}%)`) : T("远期段向下：不可能", "forward segment slopes down: impossible") },
        { points: [[0, 0], [d2, w2]], cls: 1, dashed: true, label: T(`远月报价（${(s2 * 100).toFixed(0)}%）平均`, `back quote (${(s2 * 100).toFixed(0)}%) on average`) },
      ],
      xmin: 0, xmax: d2, ymin: 0, xlabel: T("到期天数", "days to expiry"), ylabel: T("总方差 σ²T", "total variance σ²T"), H: 230, yfmt: (y) => y.toFixed(3),
    });
  });
}
