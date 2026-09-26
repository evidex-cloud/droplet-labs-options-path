// Main demo for lesson python-pricing: the lesson's Python functions, mirrored live in JS.
// Change the inputs and see exactly what the Python calls would print, plus the live formula and a Greek plot.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, tex, esc } from "./_viz.js";

// Python's repr of round(x, 4): 0.114 (not 0.1140), 1.0 (not 1), -0.0, nan
export function pyRound4(x) {
  if (!isFinite(x)) return "nan";
  const r = Number(x.toFixed(4));
  if (r === 0) return x < 0 ? "-0.0" : "0.0";
  return Number.isInteger(r) ? r.toFixed(1) : String(r);
}
const pyNum = (x) => String(+x);

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let kind = "call", plot = "gamma";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("Python 控制台（用 JS 实时镜像）", "The Python console, mirrored live in JS")}</div>
    <div class="demo-row">${seg("pyp-kind", [["call", T("看涨", "Call")], ["put", T("看跌", "Put")]], "call")}
      <div class="demo-btns" style="margin:0"><button type="button" class="demo-btn" data-pre="book">${T("教科书例子", "Textbook check")}</button><button type="button" class="demo-btn" data-pre="kai1y">${T("小凯 1 年期", "Kai's 1-year")}</button><button type="button" class="demo-btn" data-pre="kai105">${T("小凯的 105 看涨", "Kai's 105 call")}</button></div></div>
    <div class="demo-grid">
      ${slider("pyp-s", "S", 50, 150, 0.5, 100)}
      ${slider("pyp-k", "K", 50, 150, 0.5, 105)}
      ${slider("pyp-d", T("到期天数", "Days to expiry"), 1, 730, 1, 30)}
      ${slider("pyp-v", "σ", 5, 100, 1, 20)}
      ${slider("pyp-r", "r", 0, 10, 0.25, 4)}
      ${slider("pyp-q", "q", 0, 6, 0.25, 0)}
    </div>
    <pre class="demo-out" id="pyp-code" style="white-space:pre-wrap"></pre>
    <div class="demo-math" id="pyp-f"></div>
    <div class="demo-row">${seg("pyp-plot", [["price", T("价格", "price")], ["delta", "delta"], ["gamma", "gamma"], ["theta", "theta"], ["vega", "vega"]], "gamma")}</div>
    <div id="pyp-chart"></div>
    <p class="demo-tip">${T("试试：按“教科书例子”，控制台第一行正是 10.4506；切到看跌得到 5.5735。再把天数拉短，看 Gamma 曲线变尖——这就是 matplotlib 那段代码画出来的样子。", "Try this: press “Textbook check” and the first console line reads 10.4506; switch to the put for 5.5735. Then shorten the days and watch the gamma curve sharpen — exactly what the matplotlib code draws.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const S = v["pyp-s"], K = v["pyp-k"], days = v["pyp-d"], sigma = v["pyp-v"] / 100, r = v["pyp-r"] / 100, q = v["pyp-q"] / 100, Tm = days / 365;
    const o = { S, K, T: Tm, r, q, sigma, type: kind };
    const g = O.greeks(o);
    const quote = Math.round(g.price * 100) / 100;
    const iv = O.impliedVol(quote, o);
    const other = O.bsPrice({ ...o, type: kind === "call" ? "put" : "call" });
    const C = kind === "call" ? g.price : other, P = kind === "call" ? other : g.price;
    const gap = C - P - (S * Math.exp(-q * Tm) - K * Math.exp(-r * Tm));
    const argsOf = (qt) => `${pyNum(S)}, ${pyNum(K)}, ${days} / 365, ${pyNum(r)}, ${pyNum(sigma)}, ${qt}${kind}${qt}${q ? `, q=${pyNum(q)}` : ""}`;
    const args = argsOf('"');
    const lines = [
      `>>> print(f"{bs_price(${argsOf("'")}):.4f}")`,
      g.price.toFixed(4),
      `>>> g = greeks(${args})`,
      `>>> print({k: round(float(v), 4) for k, v in g.items()})`,
      `{'delta': ${pyRound4(g.delta)}, 'gamma': ${pyRound4(g.gamma)}, 'vega': ${pyRound4(g.vega)}, 'theta': ${pyRound4(g.theta)}, 'rho': ${pyRound4(g.rho)}}`,
      `>>> print(round(implied_vol(${quote.toFixed(2)}, ${pyNum(S)}, ${pyNum(K)}, ${days} / 365, ${pyNum(r)}, "${kind}"${q ? `, q=${pyNum(q)}` : ""}), 4))   # ${T("报价取到美分", "quote rounded to the cent")}`,
      pyRound4(iv),
      `>>> S, K, T, r, q = ${pyNum(S)}, ${pyNum(K)}, ${days} / 365, ${pyNum(r)}, ${pyNum(q)}`,
      `>>> call, put = bs_price(S, K, T, r, ${pyNum(sigma)}, "call", q), bs_price(S, K, T, r, ${pyNum(sigma)}, "put", q)`,
      `>>> abs(call - put - (S*np.exp(-q*T) - K*np.exp(-r*T))) < 1e-10   # ${T("平价", "parity")}`,
      Math.abs(gap) < 1e-10 ? "True" : "False",
    ];
    $("#pyp-code").innerHTML = lines.map((l) => (l.startsWith(">>>") ? `<span style="color:var(--muted)">${esc(l)}</span>` : `<b>${esc(l)}</b>`)).join("\n");
    const call = kind === "call";
    $("#pyp-f").innerHTML = tex(String.raw`d_1 = \frac{\ln(${S}/${K}) + (${r.toFixed(4)} - ${q.toFixed(4)} + \tfrac12 \times ${sigma.toFixed(2)}^2) \times ${Tm.toFixed(4)}}{${sigma.toFixed(2)}\sqrt{${Tm.toFixed(4)}}} = ${g.d1.toFixed(4)}, \quad d_2 = ${g.d2.toFixed(4)}`, true)
      + tex(call ? String.raw`C = ${S}e^{-${q.toFixed(4)} \times ${Tm.toFixed(4)}}\N(${g.d1.toFixed(4)}) - ${K}e^{-${r.toFixed(4)} \times ${Tm.toFixed(4)}}\N(${g.d2.toFixed(4)}) = ${g.price.toFixed(4)}`
        : String.raw`P = ${K}e^{-${r.toFixed(4)} \times ${Tm.toFixed(4)}}\N(${(-g.d2).toFixed(4)}) - ${S}e^{-${q.toFixed(4)} \times ${Tm.toFixed(4)}}\N(${(-g.d1).toFixed(4)}) = ${g.price.toFixed(4)}`, true);
    const f = (x, t) => { const G = O.greeks({ ...o, S: x, T: t }); return plot === "price" ? G.price : G[plot]; };
    const T4 = Math.max(Tm / 4, 1 / 365);
    $("#pyp-chart").innerHTML = lineChart({
      xmin: Math.max(1, K * 0.6), xmax: K * 1.4, xlabel: T("标的价格 S", "Underlying price S"), ylabel: plot,
      series: [{ f: (x) => f(x, Tm), cls: 0, label: `${days} ${T("天", "days")}` }, { f: (x) => f(x, T4), cls: 2, dashed: true, label: `${Math.max(1, Math.round(days / 4))} ${T("天", "days")}` }],
      markers: [{ x: K, label: "K" }], points: [{ x: S, y: f(S, Tm), cls: 0 }],
    });
  };
  const spec = { "pyp-s": (x) => String(x), "pyp-k": (x) => String(x), "pyp-d": (x) => x + T(" 天", " days"), "pyp-v": (x) => x + "%", "pyp-r": (x) => x + "%", "pyp-q": (x) => x + "%" };
  const run = bindSliders(root, spec, draw);
  onSeg(root, "pyp-kind", (k) => { kind = k; run(); });
  onSeg(root, "pyp-plot", (k) => { plot = k; run(); });
  const set = (vals) => { for (const [id, x] of Object.entries(vals)) $("#" + id).value = x; run(); };
  root.querySelectorAll("[data-pre]").forEach((b) => b.addEventListener("click", () => {
    const p = b.dataset.pre;
    if (p === "book") set({ "pyp-s": 100, "pyp-k": 100, "pyp-d": 365, "pyp-v": 20, "pyp-r": 5, "pyp-q": 0 });
    else if (p === "kai1y") set({ "pyp-s": 100, "pyp-k": 100, "pyp-d": 365, "pyp-v": 20, "pyp-r": 4, "pyp-q": 0 });
    else set({ "pyp-s": 100, "pyp-k": 105, "pyp-d": 30, "pyp-v": 20, "pyp-r": 4, "pyp-q": 0 });
  }));
}
