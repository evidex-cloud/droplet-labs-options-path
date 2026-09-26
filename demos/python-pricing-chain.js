// Inline demo for lesson python-pricing: the vectorized chain. Prints the pandas table the lesson's code
// would print for the chosen inputs, with the parity check on every row.
import * as O from "./_opt.js";
import { slider, bindSliders, seg, onSeg, esc, tex } from "./_viz.js";

// pandas-style column formatting: every value in a column gets the same number of decimals (at least 1)
function fmtCol(vals) {
  const dec = (x) => { const s = String(Number(x.toFixed(4))); const i = s.indexOf("."); return i < 0 ? 0 : s.length - i - 1; };
  const d = Math.max(1, ...vals.map(dec));
  return vals.map((x) => Number(x.toFixed(4)).toFixed(d));
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let step = 5;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("一次调用算出整条期权链", "One call, a whole chain")}</div>
    <div class="demo-row">${seg("pch-step", [["5", T("行权价间隔 5", "strikes every 5")], ["2.5", T("间隔 2.5", "every 2.5")]], "5")}</div>
    <div class="demo-grid">
      ${slider("pch-d", T("到期天数 T×365", "Days to expiry (T × 365)"), 1, 365, 1, 30)}
      ${slider("pch-v", "σ", 5, 80, 1, 20)}
      ${slider("pch-r", "r", 0, 10, 0.25, 4)}
    </div>
    <pre class="demo-out" id="pch-out" style="white-space:pre;overflow-x:auto"></pre>
    <div class="demo-math" id="pch-f"></div>
    <p class="demo-tip">${T("看什么：默认输入下，这张表和课文里的输出逐位相同。拉长天数，看深度实值的 Delta 仍接近 1、Gamma 却在整条链上摊平；最后一行的 True 说明每一行都满足平价。", "What to notice: with the default inputs the table matches the lesson's printout digit for digit. Lengthen the expiry and watch gamma spread out across the chain; the final True means parity holds on every row.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const days = v["pch-d"], sigma = v["pch-v"] / 100, r = v["pch-r"] / 100, Tm = days / 365;
    const Ks = []; for (let k = 90; k <= 110 + 1e-9; k += step) Ks.push(k);
    const rows = Ks.map((K) => { const g = O.greeks({ S: 100, K, T: Tm, r, sigma, type: "call" }); return { K, call: g.price, put: O.bsPrice({ S: 100, K, T: Tm, r, sigma, type: "put" }), delta: g.delta, gamma: g.gamma }; });
    const cols = [["strike", fmtCol(rows.map((x) => x.K))], ["call", fmtCol(rows.map((x) => x.call))], ["put", fmtCol(rows.map((x) => x.put))], ["delta", fmtCol(rows.map((x) => x.delta))], ["gamma", fmtCol(rows.map((x) => x.gamma))]];
    const w = cols.map(([h, vals]) => Math.max(h.length, ...vals.map((s) => s.length)));
    const lines = [" " + cols.map(([h], i) => h.padStart(w[i])).join(" ")];
    rows.forEach((_, j) => lines.push(" " + cols.map(([, vals], i) => vals[j].padStart(w[i])).join(" ")));
    const ok = rows.every((x) => Math.abs(x.call - x.put - (100 - x.K * Math.exp(-r * Tm))) < 1e-8);
    $("#pch-out").innerHTML = `<span style="color:var(--muted)">${esc(`>>> T = ${days} / 365; strikes = np.arange(90, 111, ${step === 5 ? "5.0" : "2.5"})`)}\n${esc(">>> print(chain.round(4).to_string(index=False))")}</span>\n<b>${esc(lines.join("\n"))}</b>\n<span style="color:var(--muted)">${esc(">>> print(np.allclose(gap, 0))")}</span>\n<b>${ok ? "True" : "False"}</b>`;
    const atm = rows.find((x) => x.K === 100);
    $("#pch-f").innerHTML = tex(String.raw`\text{row } K = 100:\quad C - P = ${atm.call.toFixed(4)} - ${atm.put.toFixed(4)} = ${(atm.call - atm.put).toFixed(4)} = 100 - 100\,e^{-${r.toFixed(4)} \times ${Tm.toFixed(4)}}`, true);
  };
  const run = bindSliders(root, { "pch-d": (x) => x + T(" 天", " days"), "pch-v": (x) => x + "%", "pch-r": (x) => x + "%" }, draw);
  onSeg(root, "pch-step", (k) => { step = +k; run(); });
}
