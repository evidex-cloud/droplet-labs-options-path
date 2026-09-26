// Inline demo for lesson common-traps: will the short call be exercised before the ex-dividend date?
// Compares exercise now (S − K, keeps the dividend) with holding through the drop (C at S − D), using the engine.
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const r = 0.04;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("除息前一天：持有人会不会行权？", "The day before the ex-date: will the holder exercise?")}</div>
    <div class="demo-grid">
      ${slider("ctd-s", T("除息前股价 S", "Stock price S (day before)"), 95, 125, 0.5, 112)}
      ${slider("ctd-k", T("行权价 K", "Strike K"), 90, 120, 1, 105)}
      ${slider("ctd-d", T("每股股息 D", "Dividend per share D"), 0.05, 2, 0.05, 0.5)}
      ${slider("ctd-t", T("除息后到到期的天数", "Days from ex-date to expiry"), 1, 60, 1, 3)}
      ${slider("ctd-v", T("隐含波动率 σ", "Implied vol σ"), 10, 60, 1, 20)}
    </div>
    <div class="demo-math" id="ctd-f"></div>
    <div id="ctd-stats"></div>
    <div id="ctd-chart"></div>
    <p class="demo-tip">${T("试试：把天数从 3 拉到 30，红色的“行权区”会退到很高的股价；把股息调大，它又会回来。离到期越近、越深度实值、股息越大，卖方越危险。", "Try this: drag the days from 3 to 30 and the exercise region retreats to much higher prices; raise the dividend and it comes back. Closer to expiry, deeper in the money and a bigger dividend all mean more danger for the short side.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const spec = { "ctd-s": (x) => "$" + x, "ctd-k": (x) => "$" + x, "ctd-d": (x) => "$" + (+x).toFixed(2), "ctd-t": (x) => x + T(" 天", " days"), "ctd-v": (x) => x + "%" };
  bindSliders(root, spec, (v) => {
    const S = v["ctd-s"], K = v["ctd-k"], Dv = v["ctd-d"], days = v["ctd-t"], sigma = v["ctd-v"] / 100, tau = days / 365;
    const hold = (s) => O.bsPrice({ S: Math.max(s - Dv, 0.01), K, T: tau, r, sigma, type: "call" });
    const P = O.bsPrice({ S: Math.max(S - Dv, 0.01), K, T: tau, r, sigma, type: "put" });
    const I = K * (1 - Math.exp(-r * tau));
    const tv = hold(S) - (S - Dv - K);
    const ex = S - K, h = hold(S), exercise = ex > h;
    // critical price where exercise starts to beat holding
    let crit = NaN, lo0 = K, hi0 = K * 2;
    if (hi0 - K > hold(hi0)) { for (let i = 0; i < 60; i++) { const m = (lo0 + hi0) / 2; if (m - K > hold(m)) hi0 = m; else lo0 = m; } crit = hi0; }
    const rel = exercise ? "<" : ">";
    $("#ctd-f").innerHTML = tex(String.raw`\underbrace{P + K(1 - e^{-r\tau})}_{\text{${T("时间价值", "time value")}}} = ${P.toFixed(3)} + ${I.toFixed(3)} = ${tv.toFixed(3)} \;${rel}\; D = ${Dv.toFixed(2)}`, true);
    $("#ctd-stats").innerHTML = stats([
      [T("现在行权：S − K", "Exercise now: S − K"), "$" + ex.toFixed(2)],
      [T("持有过除息：C(S − D)", "Hold through: C(S − D)"), "$" + h.toFixed(2)],
      [T("结论", "Verdict"), ex <= 0 ? T("虚值，不行权", "OTM, no exercise") : exercise ? T("提前行权", "Exercise early") : T("继续持有", "Keep holding"), exercise && ex > 0 ? "neg" : "pos"],
      [T("持有人每张多赚", "Holder's gain per contract"), exercise && ex > 0 ? "$" + ((ex - h) * 100).toFixed(2) : "$0.00"],
      [T("临界股价 S*", "Critical price S*"), isFinite(crit) ? "$" + crit.toFixed(2) : "–"],
    ]);
    const lo = Math.max(K - 15, 1), hi = K + 20;
    $("#ctd-chart").innerHTML = lineChart({
      xmin: lo, xmax: hi, xlabel: T("除息前一天的股价", "Stock price the day before the ex-date"), ylabel: T("每股价值", "Value per share"),
      series: [
        { f: (x) => Math.max(x - K, 0), cls: 5, label: T("现在行权 S − K", "Exercise now S − K") },
        { f: hold, cls: 0, label: T("持有过除息 C(S − D)", "Hold through C(S − D)") },
      ],
      bands: isFinite(crit) && crit < hi ? [{ x0: crit, x1: hi, cls: 2, label: T("行权区", "exercise region") }] : [],
      markers: [{ x: K, label: "K" }], points: [{ x: S, y: h, cls: 0, label: "$" + h.toFixed(2) }],
    });
  });
}
