// Main demo for lesson black-scholes: a full Black-Scholes calculator with the live formula.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let type = "call";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("Black-Scholes 计算器：五个输入，一个价格", "Black-Scholes calculator: five inputs, one price")}</div>
    <div class="demo-row">${seg("bs-type", [["call", T("看涨", "Call")], ["put", T("看跌", "Put")]], type)}
      <div class="demo-btns" style="margin:0"><button class="demo-btn" data-preset="xyz">${T("小凯的 XYZ（1 年）", "Kai's XYZ (1 year)")}</button><button class="demo-btn" data-preset="book">${T("教科书例子", "Textbook check")}</button></div></div>
    <div class="demo-grid">
      ${slider("bs-s", T("现价 S", "Spot S"), 50, 150, 0.5, 100)}
      ${slider("bs-k", T("行权价 K", "Strike K"), 50, 150, 1, 100)}
      ${slider("bs-t", T("到期天数", "Days to expiry"), 1, 730, 1, 365)}
      ${slider("bs-v", T("波动率 σ", "Volatility σ"), 5, 120, 1, 20)}
      ${slider("bs-r", T("无风险利率 r", "Risk-free rate r"), 0, 10, 0.25, 4)}
      ${slider("bs-q", T("股息率 q", "Dividend yield q"), 0, 6, 0.25, 0)}
    </div>
    <div class="demo-math" id="bs-f"></div>
    <div id="bs-stats"></div>
    <div id="bs-chart"></div>
    <p class="demo-tip">${T("试试：把 σ 拉到 40%，价格几乎翻倍；把天数拉到 1，曲线贴上“曲棍球杆”。按“教科书例子”可以核对 Hull 等教材里的 10.45。", "Try this: push σ to 40% and the price nearly doubles; drag days to 1 and the curve collapses onto the hockey stick. “Textbook check” reproduces the 10.45 found in Hull and other texts.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const pct = (v) => v + "%";
  const draw = (v) => {
    const S = v["bs-s"], K = v["bs-k"], Tm = v["bs-t"] / 365, sigma = v["bs-v"] / 100, r = v["bs-r"] / 100, q = v["bs-q"] / 100;
    const o = { S, K, T: Tm, r, q, sigma, type };
    const g = O.greeks(o);
    const Nd1 = O.normCdf(g.d1), Nd2 = O.normCdf(g.d2), dfr = Math.exp(-r * Tm), dfq = Math.exp(-q * Tm);
    const call = type === "call";
    const a = call ? S * dfq * Nd1 : K * dfr * O.normCdf(-g.d2), b = call ? K * dfr * Nd2 : S * dfq * O.normCdf(-g.d1);
    const f = call
      ? String.raw`C = \underbrace{S e^{-qT}\N(d_1)}_{${a.toFixed(2)}} - \underbrace{K e^{-rT}\N(d_2)}_{${b.toFixed(2)}} = ${g.price.toFixed(2)}`
      : String.raw`P = \underbrace{K e^{-rT}\N(-d_2)}_{${a.toFixed(2)}} - \underbrace{S e^{-qT}\N(-d_1)}_{${b.toFixed(2)}} = ${g.price.toFixed(2)}`;
    $("#bs-f").innerHTML = tex(f, true) + tex(String.raw`d_1 = ${g.d1.toFixed(3)},\quad d_2 = d_1 - \sigma\sqrt{T} = ${g.d2.toFixed(3)},\quad \N(d_1) = ${Nd1.toFixed(4)},\quad \N(d_2) = ${Nd2.toFixed(4)}`, true);
    $("#bs-stats").innerHTML = stats([
      [T("每股价格", "Price per share"), "$" + g.price.toFixed(2), "acc"],
      [T("一张合约（×100）", "Per contract (×100)"), "$" + (g.price * 100).toFixed(0)],
      [T("内在价值", "Intrinsic value"), "$" + O.intrinsic(type, S, K).toFixed(2)],
      [T("时间价值", "Time value"), "$" + (g.price - O.intrinsic(type, S, K)).toFixed(2)],
      ["Δ", g.delta.toFixed(3)],
      [T("风险中性 P(到期实值)", "Risk-neutral P(ITM)"), (g.probITM * 100).toFixed(1) + "%"],
    ]);
    const lo = Math.max(1, K * 0.5), hi = K * 1.5;
    $("#bs-chart").innerHTML = lineChart({
      xmin: lo, xmax: hi, xlabel: T("标的价格 S", "Underlying price S"), ylabel: T("期权价格", "Option price"),
      series: [
        { f: (x) => O.bsPrice({ ...o, S: x }), cls: 0, label: T("今天的理论价", "Value today (BS)") },
        { f: (x) => O.intrinsic(type, x, K), cls: 5, dashed: true, label: T("到期价值（内在价值）", "Value at expiry (intrinsic)") },
      ],
      markers: [{ x: K, label: "K" }], points: [{ x: S, y: g.price, cls: 0, label: "$" + g.price.toFixed(2) }],
    });
  };
  const spec = { "bs-s": (x) => "$" + x, "bs-k": (x) => "$" + x, "bs-t": (x) => x + T(" 天", " days"), "bs-v": pct, "bs-r": pct, "bs-q": pct };
  const run = bindSliders(root, spec, draw);
  onSeg(root, "bs-type", (v) => { type = v; run(); });
  const set = (vals) => { for (const [id, x] of Object.entries(vals)) $("#" + id).value = x; run(); };
  root.querySelectorAll("[data-preset]").forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.preset === "book") set({ "bs-s": 100, "bs-k": 100, "bs-t": 365, "bs-v": 20, "bs-r": 5, "bs-q": 0 });
    else set({ "bs-s": 100, "bs-k": 100, "bs-t": 365, "bs-v": 20, "bs-r": 4, "bs-q": 0 });
  }));
}
