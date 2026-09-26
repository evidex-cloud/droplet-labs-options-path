// Inline demo for lesson earnings-events: extract the base vol and the earnings step from two implied vols
// (both expiries contain the event), then compare the implied event move with a historical average move.
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("从期限结构里挖出财报台阶", "Dig the earnings step out of the term structure")}</div>
    <div class="demo-grid">
      ${slider("eex-s1", T("近月 IV（含财报）", "Front IV (contains earnings)"), 15, 70, 1, 30)}
      ${slider("eex-d1", T("近月天数", "Front days"), 5, 45, 1, 30)}
      ${slider("eex-s2", T("远月 IV（也含财报）", "Back IV (also contains earnings)"), 15, 60, 1, 25)}
      ${slider("eex-d2", T("远月天数", "Back days"), 20, 120, 1, 60)}
      ${slider("eex-e", T("财报在第几天", "Earnings on day"), 1, 44, 1, 21)}
      ${slider("eex-h", T("历史平均绝对财报波动", "Historical average absolute move"), 1, 15, 0.1, 4.5)}
    </div>
    <div class="demo-math" id="eex-f"></div>
    <div id="eex-stats"></div>
    <div id="eex-chart"></div>
    <p class="demo-tip">${T("看什么：近月 IV 比远月高得越多，挖出的台阶越高；把远月 IV 调得远高于近月，挖出的台阶会变成负数——说明“两个到期日共享同一个事件”的假设不成立，或者报价有问题。最后拿隐含的事件波动和历史平均比一比。", "What to notice: the more the front IV exceeds the back, the taller the extracted step; push the back IV high enough and the step turns negative — a sign that the “both expiries share one event” assumption fails or a quote is off. Then compare the implied event move with the historical average.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  bindSliders(root, { "eex-s1": (x) => x + "%", "eex-d1": (x) => x + T(" 天", " days"), "eex-s2": (x) => x + "%", "eex-d2": (x) => x + T(" 天", " days"), "eex-e": (x) => T("第 ", "day ") + x + T(" 天", ""), "eex-h": (x) => (+x).toFixed(1) + "%" }, (v) => {
    const s1 = v["eex-s1"] / 100, d1 = v["eex-d1"], s2 = v["eex-s2"] / 100, d2 = Math.max(v["eex-d2"], d1 + 5), hist = v["eex-h"] / 100;
    const ev = Math.min(v["eex-e"], d1 - 1);
    if (v["eex-d2"] < d1 + 5) { $("#eex-d2").value = String(d2); $("#eex-d2-v").textContent = d2 + T(" 天", " days"); }
    if (v["eex-e"] > d1 - 1) { $("#eex-e").value = String(ev); $("#eex-e-v").textContent = T("第 ", "day ") + ev + T(" 天", ""); }
    const T1 = d1 / 365, T2 = d2 / 365, w1 = s1 * s1 * T1, w2 = s2 * s2 * T2;
    const b2 = (w2 - w1) / (T2 - T1), E = w1 - Math.max(b2, 0) * T1;
    const ok = b2 > 0 && E > 0;
    const sdE = ok ? Math.sqrt(E) : NaN, mv = sdE * Math.sqrt(2 / Math.PI);
    $("#eex-f").innerHTML = tex(String.raw`\begin{gathered}\sigma_{\text{base}}^2 = \frac{\sigma_2^2T_2 - \sigma_1^2T_1}{T_2 - T_1} = ${b2.toFixed(4)} \\ \sigma_{\text{event}}^2 = \sigma_1^2T_1 - \sigma_{\text{base}}^2T_1 = ${E.toFixed(5)}\end{gathered}`, true);
    $("#eex-stats").innerHTML = stats([
      [T("基础波动率", "Base vol"), b2 > 0 ? (Math.sqrt(b2) * 100).toFixed(1) + "%" : T("负方差", "negative"), b2 > 0 ? "" : "neg"],
      [T("事件标准差", "Event std. dev."), ok ? (sdE * 100).toFixed(2) + "%" : "–", "acc"],
      [T("隐含的事件平均绝对波动（≈0.8σ）", "Implied average absolute event move (≈0.8σ)"), ok ? (mv * 100).toFixed(2) + "%" : "–"],
      [T("隐含 ÷ 历史", "Implied ÷ historical"), ok ? (mv / hist).toFixed(2) + "×" : "–", ok ? (mv / hist > 1 ? "neg" : "pos") : ""],
    ]);
    const bb = Math.max(b2, 0);
    const pts = [[0, 0], [ev, bb * ev / 365], [ev, bb * ev / 365 + Math.max(E, 0)], [d2, bb * d2 / 365 + Math.max(E, 0)]];
    $("#eex-chart").innerHTML = lineChart({
      series: [
        { points: pts, cls: 0, label: T("累计总方差（斜坡 + 台阶）", "cumulative total variance (slope + step)") },
        { points: [[d1, w1], [d2, w2]], cls: 2, dotsOnly: true, r: 5, label: T("两个报价", "the two quotes") },
      ],
      xmin: 0, xmax: d2, ymin: 0, xlabel: T("从今天起的天数", "days from today"), ylabel: T("总方差 σ²T", "total variance σ²T"), H: 230, yfmt: (y) => y.toFixed(3),
      markers: [{ x: ev, label: T("财报", "earnings") }],
    });
  });
}
