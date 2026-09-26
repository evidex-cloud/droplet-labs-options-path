// Inline demo for lesson vix: the VIX futures curve (contango vs backwardation) from a simple mean-reverting rule,
// and what a constant one-month long-futures position loses (or gains) to the roll if spot and the curve stay put.
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("VIX 期货曲线与展期损耗", "The VIX futures curve and the roll")}</div>
    <div class="demo-btns">
      <button class="demo-btn" data-preset="calm">${T("平静：现货 14", "Calm: spot 14")}</button>
      <button class="demo-btn" data-preset="stress">${T("恐慌：现货 40", "Stress: spot 40")}</button>
    </div>
    <div class="demo-grid">
      ${slider("vr-spot", T("现货 VIX", "Spot VIX"), 10, 80, 0.5, 14)}
      ${slider("vr-theta", T("长期水平（示意）", "Long-run level (illustrative)"), 12, 30, 0.5, 19)}
      ${slider("vr-k", T("回归速度（每月）", "Reversion speed (per month)"), 0.1, 1, 0.05, 0.3)}
      ${slider("vr-n", T("持有月数", "Months held"), 1, 24, 1, 12)}
    </div>
    <div class="demo-math" id="vr-f"></div>
    <div id="vr-stats"></div>
    <div class="demo-grid">
      <div id="vr-curve"></div>
      <div id="vr-path"></div>
    </div>
    <p class="demo-tip">${T("试试：现货低于长期水平时（升水），每个月都在“高买低卖”，一年下来损失惊人；点“恐慌”，展期变成正的——但那时现货通常正在快速回落。", "Try this: with spot below the long-run level (contango) every month buys high and sells low, and a year of it is brutal; press “Stress” and the roll turns positive — but that is exactly when spot tends to fall fast.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const spot = v["vr-spot"], th = v["vr-theta"], k = v["vr-k"], n = v["vr-n"];
    const fut = (m) => th + (spot - th) * Math.exp(-k * m);
    const F1 = fut(1), roll = spot / F1 - 1, total = Math.pow(spot / F1, n) - 1;
    $("#vr-f").innerHTML = tex(String.raw`F(m) = \theta + (S_{\text{VIX}} - \theta)e^{-\kappa m},\quad F_1 = ${F1.toFixed(2)},\qquad \frac{S_{\text{VIX}} - F_1}{F_1} = \frac{${spot} - ${F1.toFixed(2)}}{${F1.toFixed(2)}} = ${(roll * 100).toFixed(1)}\%\ \text{${T("每月", "per month")}}`, true);
    $("#vr-stats").innerHTML = stats([
      [T("曲线形态", "Curve shape"), spot < th ? T("升水", "contango") : spot > th ? T("贴水", "backwardation") : T("平", "flat"), spot < th ? "neg" : "pos"],
      [T("1 个月期货", "1-month future"), F1.toFixed(2)],
      [T("每月展期收益", "Roll return per month"), (roll >= 0 ? "+" : "") + (roll * 100).toFixed(1) + "%", roll < 0 ? "neg" : "pos"],
      [T("持有 ", "After ") + n + T(" 个月（曲线不变）", " months (curve frozen)"), (total >= 0 ? "+" : "") + (total * 100).toFixed(0) + "%", total < 0 ? "neg" : "pos"],
      [T("10,000 美元变成", "$10,000 becomes"), "$" + O.fmt(10000 * (1 + total), 0)],
    ]);
    const pts = []; for (let m = 0; m <= 8; m += 0.25) pts.push([m, fut(m)]);
    $("#vr-curve").innerHTML = lineChart({
      series: [{ points: pts, cls: spot < th ? 3 : 2, label: T("VIX 期货曲线", "VIX futures curve") }],
      xmin: 0, xmax: 8, H: 210, W: 320, xlabel: T("到期（月）", "expiry (months)"), yfmt: (y) => y.toFixed(0),
      hlines: [{ y: th, label: "θ" }], points: [{ x: 0, y: spot, cls: 1, label: T("现货", "spot") }, { x: 1, y: F1, cls: 0, label: "F₁" }],
    });
    const path = []; for (let m = 0; m <= n; m++) path.push([m, 10000 * Math.pow(spot / F1, m)]);
    $("#vr-path").innerHTML = lineChart({
      series: [{ points: path, cls: total < 0 ? 2 : 3, dots: true, label: T("持续做多 1 个月期货（曲线不变）", "rolling long 1-month futures (curve frozen)") }],
      xmin: 0, xmax: n, ymin: 0, H: 210, W: 320, xlabel: T("月", "months"), yfmt: (y) => "$" + O.fmt(y / 1000, 1) + "k",
      hlines: [{ y: 10000, label: "$10k" }],
    });
  };
  const run = bindSliders(root, { "vr-spot": (x) => (+x).toFixed(1), "vr-theta": (x) => (+x).toFixed(1), "vr-k": (x) => (+x).toFixed(2), "vr-n": (x) => x }, draw);
  const set = (vals) => { for (const [id, x] of Object.entries(vals)) $("#" + id).value = x; run(); };
  root.querySelectorAll("[data-preset]").forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.preset === "calm") set({ "vr-spot": 14, "vr-theta": 19, "vr-k": 0.3 });
    else set({ "vr-spot": 40, "vr-theta": 19, "vr-k": 0.3 });
  }));
}
