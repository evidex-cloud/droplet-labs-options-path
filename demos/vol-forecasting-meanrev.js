// Inline demo for lesson vol-forecasting: after a shock, GARCH(1,1) forecasts decay back to the long-run level;
// EWMA's forecast stays flat at every horizon. Uses the engine's garch11 for the one-step update and forecast(h).
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("一次冲击之后：GARCH 的预测如何回到长期水平", "After a shock: how the GARCH forecast returns to its long-run level")}</div>
    <div class="demo-grid">
      ${slider("vfm-e", T("今天的收益率（冲击）", "Today's return (the shock)"), -6, 6, 0.5, -3)}
      ${slider("vfm-a", "α", 0.02, 0.2, 0.01, 0.08)}
      ${slider("vfm-b", "β", 0.6, 0.97, 0.01, 0.9)}
    </div>
    <div class="demo-math" id="vfm-f"></div>
    <div id="vfm-stats"></div>
    <div id="vfm-chart"></div>
    <p class="demo-tip">${T("看什么：α 决定冲击把明天的波动率推多高，α + β 决定它多慢回落。β 拉到 0.97 附近，半衰期会变成几个月；EWMA 没有长期水平，所以它的预测在所有期限上都是一条平线。", "What to notice: α sets how far a shock lifts tomorrow's vol; α + β sets how slowly it fades. Push β toward 0.97 and the half-life stretches to months. EWMA has no long-run level, so its forecast is a flat line at every horizon.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const lrVol = 0.2, PPY = 252, lr = (lrVol * lrVol) / PPY;
  bindSliders(root, { "vfm-e": (x) => (x > 0 ? "+" : "") + x.toFixed(1) + "%", "vfm-a": (x) => x.toFixed(2), "vfm-b": (x) => x.toFixed(2) }, (v) => {
    const a = v["vfm-a"], b = Math.min(v["vfm-b"], 0.995 - a), e = v["vfm-e"] / 100, omega = lr * (1 - a - b);
    const g = O.garch11([e], { omega, alpha: a, beta: b }); // starts at the long-run variance, then applies today's shock
    const ann = (x) => Math.sqrt(x * PPY) * 100;
    const ewNext = 0.94 * lr + 0.06 * e * e;
    const p = a + b, half = Math.log(0.5) / Math.log(p);
    $("#vfm-f").innerHTML =
      tex(String.raw`\sigma_{t+1}^2 = \omega + \alpha\,\varepsilon_t^2 + \beta\,\sigma_t^2`, true) + tex(String.raw`= ${(omega * 1e6).toFixed(2)}\times 10^{-6} + ${a.toFixed(2)} \times ${(e * e * 1e4).toFixed(2)}\times 10^{-4} + ${b.toFixed(2)} \times ${(lr * 1e4).toFixed(3)}\times 10^{-4}`, true) +
      tex(String.raw`\E_t\big[\sigma_{t+h}^2\big] = \bar\sigma^2 + (\alpha+\beta)^{h-1}\big(\sigma_{t+1}^2 - \bar\sigma^2\big)`, true) + tex(String.raw`\alpha + \beta = ${p.toFixed(3)}`, true);
    $("#vfm-stats").innerHTML = stats([
      [T("明天的波动率（年化）", "Tomorrow's vol (annualized)"), ann(g.next).toFixed(1) + "%", "acc"],
      [T("长期水平", "Long-run level"), ann(g.longRun).toFixed(1) + "%"],
      [T("半衰期（交易日）", "Half-life (trading days)"), half.toFixed(1)],
      [T("EWMA（λ = 0.94）明天", "EWMA (λ = 0.94) tomorrow"), ann(ewNext).toFixed(1) + "%"],
    ]);
    $("#vfm-chart").innerHTML = lineChart({
      xmin: 1, xmax: 250, xlabel: T("预测期限 h（交易日）", "Forecast horizon h (trading days)"), ylabel: T("年化波动率 %", "Annualized vol %"),
      series: [
        { f: (h) => ann(g.forecast(Math.round(h))), cls: 0, label: T("GARCH 预测", "GARCH forecast") },
        { f: () => ann(ewNext), cls: 1, dashed: true, label: T("EWMA 预测（平）", "EWMA forecast (flat)") },
        { f: () => ann(g.longRun), cls: 5, dashed: true, label: T("长期水平", "Long-run level") },
      ],
      markers: isFinite(half) && half < 250 ? [{ x: half, label: T("半衰期", "half-life") }] : [],
      yfmt: (x) => x.toFixed(0) + "%",
    });
  });
}
