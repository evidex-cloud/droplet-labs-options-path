// Main demo for lesson rho-carry: rate and dividend sliders acting on 30-day, 1-year and 2-year XYZ options,
// with the forward, parity and rho shown live.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S = 100, K = 100, sigma = 0.2;
  const TEN = [[30, T("30 天", "30 days")], [365, T("1 年", "1 year")], [730, T("2 年", "2 years")]];
  let tenor = "365";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("利率与股息：谁在推动远期价，谁在推动期权", "Rates and dividends: they move the forward, the forward moves the options")}</div>
    <div class="demo-grid">
      ${slider("rc-r", T("无风险利率 r", "Risk-free rate r"), 0, 8, 0.25, 4)}
      ${slider("rc-q", T("股息率 q", "Dividend yield q"), 0, 6, 0.25, 0)}
    </div>
    <div class="demo-math" id="rc-f"></div>
    <div id="rc-table"></div>
    <div class="demo-row">${seg("rc-ten", TEN.map(([d, l]) => [String(d), l]), tenor)}</div>
    <div id="rc-chart"></div>
    <p class="demo-tip">${T("试试：把 r 从 0 拉到 8%，看 2 年期看涨和看跌像剪刀一样张开，而 30 天的几乎不动。再把 q 调到和 r 一样：远期价回到 100，看涨看跌又重新靠拢。", "Try this: drag r from 0 to 8% and watch the 2-year call and put open like scissors while the 30-day pair barely moves. Then set q equal to r: the forward returns to 100 and the call and put close up again.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const px = (Tm, r, q, type) => O.bsPrice({ S, K, T: Tm, r, q, sigma, type });
  const sg = (x) => (x >= 0 ? "+" : "−") + Math.abs(x).toFixed(2);
  const draw = (v) => {
    const r = v["rc-r"] / 100, q = v["rc-q"] / 100;
    const T1 = 1, F1 = O.forward(S, T1, r, q), c1 = px(T1, r, q, "call"), p1 = px(T1, r, q, "put");
    $("#rc-f").innerHTML =
      tex(String.raw`F_{1\text{y}} = S\,e^{(r-q)T} = 100\,e^{(${r.toFixed(4)} - ${q.toFixed(4)})\times 1} = ${F1.toFixed(2)}`, true) +
      tex(String.raw`C - P = ${c1.toFixed(2)} - ${p1.toFixed(2)} = ${(c1 - p1).toFixed(2)} \;=\; S e^{-qT} - K e^{-rT} = ${(S * Math.exp(-q) - K * Math.exp(-r)).toFixed(2)}`, true);
    let rows = "";
    for (const [d, lab] of TEN) {
      const Tm = d / 365;
      const c = px(Tm, r, q, "call"), p = px(Tm, r, q, "put"), c0 = px(Tm, 0.04, 0, "call"), p0 = px(Tm, 0.04, 0, "put");
      const gc = O.greeks({ S, K, T: Tm, r, q, sigma, type: "call" }), gp = O.greeks({ S, K, T: Tm, r, q, sigma, type: "put" });
      rows += `<tr${String(d) === tenor ? ' class="hl"' : ""}><td>${lab}</td><td>${O.forward(S, Tm, r, q).toFixed(2)}</td><td>$${c.toFixed(2)} <small>(${sg(c - c0)})</small></td><td>$${p.toFixed(2)} <small>(${sg(p - p0)})</small></td><td>${gc.rho.toFixed(3).replace("-", "−")}</td><td>${gp.rho.toFixed(3).replace("-", "−")}</td></tr>`;
    }
    $("#rc-table").innerHTML = `<table><thead><tr><th>${T("到期", "Expiry")}</th><th>${T("远期 F", "Forward F")}</th><th>${T("看涨", "Call")}</th><th>${T("看跌", "Put")}</th><th>${T("看涨 ρ", "Call ρ")}</th><th>${T("看跌 ρ", "Put ρ")}</th></tr></thead><tbody>${rows}</tbody></table><p class="demo-meta">${T("括号里是相对 r = 4%、q = 0 的变化；ρ 是利率每升 1 个百分点的价格变化（每股）。", "In brackets: change versus r = 4%, q = 0. ρ is the price change per 1-point rise in rates (per share).")}</p>`;
    const Tm = +tenor / 365;
    $("#rc-chart").innerHTML = lineChart({
      xmin: 0, xmax: 8, xlabel: T("无风险利率 r（%）", "Risk-free rate r (%)"), ylabel: T("期权价格（每股）", "Option price (per share)"),
      series: [
        { f: (x) => px(Tm, x / 100, q, "call"), cls: 3, label: T("看涨", "Call") },
        { f: (x) => px(Tm, x / 100, q, "put"), cls: 2, label: T("看跌", "Put") },
      ],
      markers: [{ x: v["rc-r"], label: "r" }],
      points: [{ x: v["rc-r"], y: px(Tm, r, q, "call"), cls: 3 }, { x: v["rc-r"], y: px(Tm, r, q, "put"), cls: 2 }],
    });
  };
  const run = bindSliders(root, { "rc-r": (x) => x.toFixed(2) + "%", "rc-q": (x) => x.toFixed(2) + "%" }, draw);
  onSeg(root, "rc-ten", (t) => { tenor = t; run(); });
}
