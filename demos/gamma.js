// Main demo for lesson gamma: gamma curves across expiries, and "move the stock, watch delta change"
// (tangent lines on the price curve before and after the move).
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("Gamma：Delta 变得有多快", "Gamma: how fast delta changes")}</div>
    <div class="demo-btns"><button class="demo-btn" data-preset="kai">${T("小凯的 30 天 100 看涨", "Kai's 30-day 100 call")}</button><button class="demo-btn" data-preset="last">${T("最后一天", "The last day")}</button><button class="demo-btn" data-preset="leaps">${T("1 年期", "One year out")}</button></div>
    <div class="demo-grid">
      ${slider("gm2-s", T("现价 S", "Spot S"), 80, 120, 0.5, 100)}
      ${slider("gm2-d", T("到期天数", "Days to expiry"), 1, 365, 1, 30)}
      ${slider("gm2-v", T("波动率 σ", "Volatility σ"), 10, 60, 1, 20)}
      ${slider("gm2-m", T("股价变动 dS", "Stock move dS"), -10, 10, 0.5, 2)}
    </div>
    <div class="demo-math" id="gm2-f"></div>
    <div id="gm2-stats"></div>
    <div id="gm2-g"></div>
    <div id="gm2-p"></div>
    <p class="demo-tip">${T("试试：按“最后一天”，Gamma 的尖峰高出 30 天曲线 5 倍多，而且只集中在行权价附近；把 S 拉到 110，同一张期权的 Gamma 几乎为零。下图两条切线的斜率差，就是 Gamma 带来的 Delta 变化。", "Try this: press “The last day” — the gamma spike is over five times the 30-day curve and sits right on the strike; drag S to 110 and the same option's gamma is almost zero. In the lower chart, the change in slope between the two tangent lines is the delta change that gamma produced.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const K = 100, r = 0.04;
  const draw = (v) => {
    const S = v["gm2-s"], days = v["gm2-d"], sigma = v["gm2-v"] / 100, dS = v["gm2-m"];
    const Tm = days / 365, o = { S, K, T: Tm, r, sigma, type: "call" };
    const g = O.greeks(o), g1 = O.greeks({ ...o, S: S + dS });
    const den = S * sigma * Math.sqrt(Tm);
    $("#gm2-f").innerHTML = tex(String.raw`\Gamma = \frac{\varphi(d_1)}{S\sigma\sqrt{T}} = \frac{${O.normPdf(g.d1).toFixed(4)}}{${S} \times ${sigma.toFixed(2)} \times ${Math.sqrt(Tm).toFixed(4)}} = \frac{${O.normPdf(g.d1).toFixed(4)}}{${den.toFixed(3)}} = ${g.gamma.toFixed(4)}`, true)
      + tex(String.raw`\Delta_{\text{${T("新", "new")}}} \approx \Delta + \Gamma\,\dd S = ${g.delta.toFixed(3)} + ${g.gamma.toFixed(4)} \times (${dS}) = ${(g.delta + g.gamma * dS).toFixed(3)} \quad (\text{${T("精确", "exact")}}: ${g1.delta.toFixed(3)})`, true);
    $("#gm2-stats").innerHTML = stats([
      ["Γ " + T("（每股）", "(per share)"), g.gamma.toFixed(4), "acc"],
      [T("每张：股价每动 1 美元，Delta 变", "Per contract: delta change per $1"), (g.gamma * 100).toFixed(2) + T(" 股", " sh")],
      [T("美元 Gamma（1% 变动，每张）", "Dollar gamma (1% move, per contract)"), O.fmtUsd(g.gamma * S * S / 100 * 100, 0)],
      [T("凸性收益 ½Γ(dS)²（每张）", "Convexity ½Γ(dS)² (per contract)"), O.fmtUsd(0.5 * g.gamma * dS * dS * 100, 2), "pos"],
      [T("Theta（每张每天）", "Theta (per contract per day)"), O.fmtUsd(g.theta * 100, 2), "neg"],
    ]);
    // reference curves (7 and 180 days) unless they coincide with the chosen expiry
    const gam = (x, d) => O.greeks({ S: x, K, T: d / 365, r, sigma, type: "call" }).gamma;
    const refs = [[7, 2], [180, 1]].filter(([d]) => d !== days);
    const peak = Math.max(...[days, ...refs.map(([d]) => d)].map((d) => gam(K * Math.exp(-(r + 1.5 * sigma * sigma) * d / 365), d)), g.gamma);
    $("#gm2-g").innerHTML = lineChart({
      xmin: 80, xmax: 120, ymin: 0, ymax: peak * 1.15, H: 230, xlabel: T("XYZ 价格 S", "XYZ price S"), ylabel: T("Gamma Γ", "gamma Γ"),
      series: [
        ...refs.map(([d, c]) => ({ f: (x) => gam(x, d), cls: c, dashed: true, label: T(`${d} 天（参照）`, `${d} days (reference)`) })),
        { f: (x) => gam(x, days), cls: 0, label: T(`你选的 ${days} 天`, `your ${days} ${days === 1 ? "day" : "days"}`) },
      ],
      markers: [{ x: K, label: "K" }], points: [{ x: S, y: g.gamma, cls: 0, label: g.gamma.toFixed(3) }], samples: 200,
    });
    const lo = 80, hi = 120, p0 = g.price, p1 = O.bsPrice({ ...o, S: S + dS });
    $("#gm2-p").innerHTML = lineChart({
      xmin: lo, xmax: hi, H: 250, xlabel: T("XYZ 价格 S", "XYZ price S"), ylabel: T("期权价格", "Option price"),
      series: [
        { f: (x) => O.bsPrice({ ...o, S: x }), cls: 0, label: T("今天的价格曲线", "Price curve today") },
        { f: (x) => p0 + g.delta * (x - S), cls: 2, dashed: true, label: T(`起点切线：斜率 ${g.delta.toFixed(3)}`, `Tangent before: slope ${g.delta.toFixed(3)}`) },
        { f: (x) => p1 + g1.delta * (x - S - dS), cls: 3, dashed: true, label: T(`变动后切线：斜率 ${g1.delta.toFixed(3)}`, `Tangent after: slope ${g1.delta.toFixed(3)}`) },
      ],
      ymin: 0, ymax: Math.max(4, O.bsPrice({ ...o, S: hi }) * 1.05),
      points: [{ x: S, y: p0, cls: 2 }, { x: S + dS, y: p1, cls: 3 }],
    });
  };
  const spec = { "gm2-s": (x) => "$" + x, "gm2-d": (x) => x + T(" 天", x === 1 ? " day" : " days"), "gm2-v": (x) => x + "%", "gm2-m": (x) => (x >= 0 ? "+$" : "−$") + Math.abs(x) };
  const run = bindSliders(root, spec, draw);
  const set = (vals) => { for (const [id, x] of Object.entries(vals)) $("#" + id).value = x; run(); };
  root.querySelectorAll("[data-preset]").forEach((b) => b.addEventListener("click", () => {
    const p = b.dataset.preset;
    if (p === "kai") set({ "gm2-s": 100, "gm2-d": 30, "gm2-v": 20, "gm2-m": 2 });
    else if (p === "last") set({ "gm2-s": 100, "gm2-d": 1, "gm2-v": 20, "gm2-m": 1 });
    else set({ "gm2-s": 100, "gm2-d": 365, "gm2-v": 20, "gm2-m": 5 });
  }));
}
