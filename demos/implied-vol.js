// Main demo for lesson implied-vol: an implied-volatility solver that shows its work.
// Newton's method (with a bisection safeguard) or plain bisection, iteration by iteration, on the price-vs-σ curve.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

const S = 100, r = 0.04;

function solve(method, o, mkt, guess) {
  const rows = [];
  let lo = 1e-4, hi = 5;
  if (method === "bisect") {
    let a = 0.001, b = 3;
    for (let i = 0; i < 60; i++) {
      const m = (a + b) / 2, p = O.bsPrice({ ...o, sigma: m }), err = p - mkt;
      rows.push({ s: m, p, v: O.greeks({ ...o, sigma: m }).vegaRaw, err, note: "bisect" });
      if (Math.abs(err) < 1e-6) break;
      if (err > 0) b = m; else a = m;
    }
    return rows;
  }
  let s = guess;
  for (let i = 0; i < 25; i++) {
    const g = O.greeks({ ...o, sigma: s }), err = g.price - mkt;
    let note = rows.length && rows[rows.length - 1].fallback ? "bisect" : "newton";
    rows.push({ s, p: g.price, v: g.vegaRaw, err, note });
    if (Math.abs(err) < 1e-6) break;
    if (err > 0) hi = Math.min(hi, s); else lo = Math.max(lo, s);
    let next = g.vegaRaw > 1e-12 ? s - err / g.vegaRaw : NaN;
    const fallback = !(next > lo && next < hi);
    if (fallback) next = (lo + hi) / 2;
    rows[rows.length - 1].fallback = fallback;
    s = next;
  }
  return rows;
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let type = "call", method = "newton";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("隐含波动率求解器：把 Black-Scholes 倒过来用", "Implied-vol solver: Black-Scholes run backwards")}</div>
    <div class="demo-row">${seg("iv-type", [["call", T("看涨", "Call")], ["put", T("看跌", "Put")]], type)}
      ${seg("iv-meth", [["newton", T("牛顿法", "Newton")], ["bisect", T("二分法", "Bisection")]], method)}</div>
    <div class="demo-btns">
      <button class="demo-btn" data-p="kai">${T("小凯的 105 看涨：1.00 美元", "Kai's 105 call at $1.00")}</button>
      <button class="demo-btn" data-p="atm">${T("平值看涨：2.45 美元", "ATM call at $2.45")}</button>
      <button class="demo-btn" data-p="otm">${T("深度虚值 80 看跌：0.05 美元", "Deep OTM 80 put at $0.05")}</button>
      <button class="demo-btn" data-p="bad">${T("低于下界：90 看涨 10.20 美元", "Below the bound: 90 call at $10.20")}</button>
    </div>
    <div class="demo-grid">
      ${slider("iv-k", T("行权价 K", "Strike K"), 70, 130, 1, 105)}
      ${slider("iv-d", T("到期天数", "Days to expiry"), 1, 365, 1, 30)}
      ${slider("iv-p", T("市场价（每股）", "Market price (per share)"), 0.01, 30, 0.01, 1)}
      ${slider("iv-g", T("第一个猜测 σ₀", "First guess σ₀"), 5, 100, 1, 20)}
    </div>
    <div id="iv-warn"></div>
    <div class="demo-math" id="iv-f"></div>
    <div id="iv-stats"></div>
    <div id="iv-chart"></div>
    <div id="iv-table"></div>
    <p class="demo-tip">${T("试试：“小凯的 105 看涨”两步就精确到小数点后四位（第三步只是打磨）；换成“深度虚值 80 看跌”，Vega 小得几乎为零，牛顿法一步会跳出去，求解器只好退回二分法。再把方法切到二分法，数一数它要多少步。", "Try this: “Kai's 105 call” is right to four decimals after two steps (the third only polishes). Switch to the “deep OTM 80 put”: vega is almost zero, Newton's first step flies out of range and the solver falls back to bisection. Then switch the method to bisection and count how many steps it needs.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const K = v["iv-k"], Tm = v["iv-d"] / 365, mkt = v["iv-p"], guess = v["iv-g"] / 100;
    const o = { S, K, T: Tm, r, q: 0, type };
    const b = O.bounds(o);
    const inside = mkt > b.lower + 1e-9 && mkt < b.upper;
    $("#iv-warn").innerHTML = inside ? "" : `<div class="demo-warn">${T(
      `没有任何波动率能给出这个价格：这张期权必须在 ${b.lower.toFixed(2)} 美元（下界）和 ${b.upper.toFixed(2)} 美元（上界）之间。检查报价是否过时或错误。`,
      `No volatility can produce this price: the option must trade between $${b.lower.toFixed(2)} (lower bound) and $${b.upper.toFixed(2)} (upper bound). Check for a stale or bad quote.`)}</div>`;
    let sMax = 0.8;
    const series = [{ f: (x) => O.bsPrice({ ...o, sigma: Math.max(x / 100, 1e-6) }), cls: 0, label: T("Black-Scholes 价格", "Black-Scholes price") }];
    if (!inside) {
      $("#iv-f").innerHTML = ""; $("#iv-table").innerHTML = "";
      $("#iv-stats").innerHTML = stats([[T("隐含波动率", "Implied vol"), T("无解", "no solution"), "neg"], [T("下界", "Lower bound"), "$" + b.lower.toFixed(2)], [T("上界", "Upper bound"), "$" + b.upper.toFixed(2)]]);
      $("#iv-chart").innerHTML = lineChart({ xmin: 1, xmax: sMax * 100, ymin: 0, xlabel: T("波动率 σ（%）", "Volatility σ (%)"), ylabel: T("期权价格", "Option price"), series, hlines: [{ y: mkt, label: T("市场价", "market price") }] });
      return;
    }
    const rows = solve(method, o, mkt, guess);
    const last = rows[rows.length - 1], iv = last.s;
    // zoom the chart on the action: about 2.5× the answer (and the first guess), between 40% and 150%
    sMax = Math.min(1.5, Math.max(0.4, Math.ceil(Math.max(2.5 * iv, 1.5 * guess) * 10) / 10));
    const conv = Math.abs(last.err) < 1e-6;
    const r0 = rows[0];
    $("#iv-f").innerHTML = method === "newton"
      ? tex(String.raw`\sigma_1 = \sigma_0 - \frac{C_{BS}(\sigma_0) - C_{\text{mkt}}}{\nu(\sigma_0)} = ${(r0.s * 100).toFixed(2)}\% - \frac{${r0.p.toFixed(4)} - ${mkt.toFixed(2)}}{${r0.v.toFixed(3)}} = ${rows.length > 1 ? (rows[1].s * 100).toFixed(2) : (r0.s * 100).toFixed(2)}\%`, true)
      : tex(String.raw`\sigma \in [\sigma_{\text{lo}}, \sigma_{\text{hi}}] \;\Rightarrow\; \sigma_{\text{mid}} = \tfrac12(\sigma_{\text{lo}} + \sigma_{\text{hi}}),\ \text{${T("每步区间减半", "the bracket halves each step")}}`, true);
    const g = O.greeks({ ...o, sigma: iv });
    $("#iv-stats").innerHTML = stats([
      [T("隐含波动率", "Implied vol"), conv ? (iv * 100).toFixed(2) + "%" : "≈ " + (iv * 100).toFixed(2) + "%", "acc"],
      [T("迭代次数", "Iterations"), String(rows.length - 1)],
      [T("回代价格", "Price at that σ"), "$" + g.price.toFixed(4)],
      [T("Vega（每个波动率点）", "Vega (per vol point)"), g.vega.toFixed(4)],
      [T("一张合约", "Per contract"), "$" + (mkt * 100).toFixed(0)],
    ]);
    const pts = rows.slice(0, 12).map((rw, i) => ({ x: rw.s * 100, y: rw.p, cls: i === rows.length - 1 ? 3 : 1, label: i === 0 ? "σ₀" : "" })).filter((p) => p.x <= sMax * 100);
    $("#iv-chart").innerHTML = lineChart({
      xmin: 1, xmax: sMax * 100, ymin: 0, xlabel: T("波动率 σ（%）", "Volatility σ (%)"), ylabel: T("期权价格", "Option price"), series,
      hlines: [{ y: mkt, label: T("市场价 ", "market price ") + "$" + mkt.toFixed(2) }], markers: [{ x: iv * 100, label: "IV" }], points: pts,
    });
    const shown = rows.length > 10 ? [...rows.slice(0, 8), null, rows[rows.length - 1]] : rows;
    $("#iv-table").innerHTML = `<table><thead><tr><th>n</th><th>σₙ</th><th>${T("BS 价格", "BS price")}</th><th>${T("Vega（每 1.00）", "Vega (per 1.00)")}</th><th>${T("价格误差", "Price error")}</th><th>${T("这一步", "Step")}</th></tr></thead><tbody>${shown.map((rw) => {
      if (!rw) return `<tr><td colspan="6">… ${T(`共 ${rows.length - 1} 步`, `${rows.length - 1} steps in total`)}</td></tr>`;
      const i = rows.indexOf(rw);
      return `<tr${i === rows.length - 1 ? ' class="hl"' : ""}><td>${i}</td><td>${(rw.s * 100).toFixed(4)}%</td><td>${rw.p.toFixed(5)}</td><td>${rw.v.toFixed(4)}</td><td>${rw.err >= 0 ? "+" : "−"}${Math.abs(rw.err).toFixed(5)}</td><td>${rw.note === "bisect" ? T("二分", "bisection") : T("牛顿", "Newton")}</td></tr>`;
    }).join("")}</tbody></table>`;
  };
  const run = bindSliders(root, { "iv-k": (x) => "$" + x, "iv-d": (x) => x + T(" 天", " days"), "iv-p": (x) => "$" + (+x).toFixed(2), "iv-g": (x) => x + "%" }, draw);
  onSeg(root, "iv-type", (x) => { type = x; run(); });
  onSeg(root, "iv-meth", (x) => { method = x; run(); });
  const presets = {
    kai: { type: "call", k: 105, d: 30, p: 1.0 },
    atm: { type: "call", k: 100, d: 30, p: 2.45 },
    otm: { type: "put", k: 80, d: 30, p: 0.05 },
    bad: { type: "call", k: 90, d: 30, p: 10.2 },
  };
  root.querySelectorAll("[data-p]").forEach((btn) => btn.addEventListener("click", () => {
    const pr = presets[btn.dataset.p];
    type = pr.type;
    root.querySelectorAll('[data-seg="iv-type"] button').forEach((x) => x.classList.toggle("on", x.dataset.v === type));
    $("#iv-k").value = pr.k; $("#iv-d").value = pr.d; $("#iv-p").value = pr.p; $("#iv-g").value = 20;
    run();
  }));
}
