// Inline demo for lesson systematic-vol: back out implied correlation from index and single-stock implied vols,
// and see how index variance splits into "own" terms and "cross" (correlation) terms.
import { slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("隐含相关性：指数期权比个股期权“便宜”多少", "Implied correlation: how much cheaper index options are than their parts")}</div>
    <div class="demo-grid">
      ${slider("svc-n", T("成分股数量 N（等权）", "Number of stocks N (equal weight)"), 2, 100, 1, 50)}
      ${slider("svc-s", T("个股隐含波动率（平均）", "Average single-stock implied vol"), 15, 60, 1, 30)}
      ${slider("svc-i", T("指数隐含波动率", "Index implied vol"), 5, 40, 0.5, 20)}
    </div>
    <div class="demo-math" id="svc-f"></div>
    <div id="svc-bars"></div>
    <div id="svc-stats"></div>
    <p class="demo-tip">${T("看什么：N 大时，指数方差几乎全部来自“交叉项”，也就是相关性；个股波动率不变、把指数波动率压低，隐含相关性就跟着降——离散度交易卖的正是这个数。", "What to notice: with many stocks, index variance comes almost entirely from the cross terms — correlation. Hold single-stock vol fixed and lower index vol, and implied correlation falls with it; that number is what a dispersion trade sells.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  bindSliders(root, { "svc-n": String, "svc-s": (x) => x + "%", "svc-i": (x) => x + "%" }, (v) => {
    const N = v["svc-n"], s = v["svc-s"] / 100, ix = v["svc-i"] / 100, w = 1 / N;
    const own = N * w * w * s * s, crossMax = s * s * (1 - w); // cross terms if correlation were 1
    const rho = (ix * ix - own) / crossMax;
    const ok = rho >= 0 && rho <= 1;
    $("#svc-f").innerHTML = tex(String.raw`\rho_{\text{imp}} = \frac{\sigma_I^2 - \sum_i w_i^2\sigma_i^2}{\sum_{i \ne j} w_i w_j \sigma_i\sigma_j}`, true) + tex(String.raw`= \frac{${(ix * ix).toFixed(4)} - ${own.toFixed(4)}}{${crossMax.toFixed(4)}} = ${rho.toFixed(3)}`, true);
    const tot = ix * ix, bar = (label, val, color) => `<div class="bar2"><span class="lab" style="width:170px">${label}</span><span class="track"><span class="fill" style="display:block;width:${Math.max(0, Math.min(100, (val / Math.max(tot, own + crossMax)) * 100))}%;background:${color}"></span></span><span class="val">${(val * 1e4).toFixed(0)}</span></div>`;
    $("#svc-bars").innerHTML =
      bar(T("指数方差 σ²（%²）", "Index variance σ² (%²)"), tot, "var(--orange)") +
      bar(T("其中“自身项”Σw²σ²", "Own terms Σw²σ²"), own, "var(--muted)") +
      bar(T("其中“交叉项”（相关性）", "Cross terms (correlation)"), Math.max(0, tot - own), "var(--blue)") +
      bar(T("若相关性 = 1 时的交叉项", "Cross terms if correlation = 1"), crossMax, "var(--line)");
    $("#svc-stats").innerHTML = stats([
      [T("隐含相关性", "Implied correlation"), ok ? rho.toFixed(2) : T("不在 0 到 1 之间", "not between 0 and 1"), ok ? "acc" : "neg"],
      [T("相关性为 0 时的指数波动率", "Index vol if correlation = 0"), (Math.sqrt(own) * 100).toFixed(1) + "%"],
      [T("相关性为 1 时的指数波动率", "Index vol if correlation = 1"), (s * 100).toFixed(1) + "%"],
    ]);
  });
}
