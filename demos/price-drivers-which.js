// Inline demo for lesson price-drivers: which input matters most right now?
// Each input is moved by a "typical" amount and the Black-Scholes price change is shown as a bar.
import * as O from "./_opt.js";
import { barChart, seg, onSeg, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let days = 30, K = 100, type = "call";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("哪个旋钮最要紧？", "Which dial matters most right now?")}</div>
    <div class="demo-row">
      ${seg("pdw-t", [["7", T("7 天", "7 days")], ["30", T("30 天", "30 days")], ["365", T("1 年", "1 year")]], days)}
      ${seg("pdw-k", [["95", "K = 95"], ["100", "K = 100"], ["105", "K = 105"]], K)}
      ${seg("pdw-type", [["call", T("看涨", "Call")], ["put", T("看跌", "Put")]], type)}
    </div>
    <div id="pdw-chart"></div>
    <div class="demo-math" id="pdw-f"></div>
    <p class="demo-tip">${T("看什么：30 天期权里股价那根柱子最高；切到 1 年，波动率和利率的柱子明显变长，一天的时间损耗反而变短。", "What to notice: at 30 days the stock-price bar towers over the rest; switch to 1 year and the volatility and rate bars grow while one day of decay shrinks.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = () => {
    const o = { S: 100, K, T: days / 365, r: 0.04, q: 0, sigma: 0.2, type };
    const p = O.bsPrice(o);
    const moves = [
      [T("股价 +1%", "stock +1%"), { ...o, S: 101 }],
      [T("σ +1 点", "vol +1 pt"), { ...o, sigma: 0.21 }],
      [T("过 1 天", "1 day passes"), { ...o, T: Math.max(o.T - 1 / 365, 1e-6) }],
      [T("r +0.25", "rate +0.25"), { ...o, r: 0.0425 }],
      [T("q +0.25", "div +0.25"), { ...o, q: 0.0025 }],
    ].map(([label, x]) => ({ label, value: O.bsPrice(x) - p }));
    moves.forEach((m, i) => { m.cls = i === 0 ? 0 : i === 1 ? 1 : m.value < 0 ? 2 : 3; });
    $("#pdw-chart").innerHTML = barChart({ bars: moves, yfmt: (v) => (v < 0 ? "−" : "") + "$" + Math.abs(v).toFixed(2), H: 220 });
    const big = moves.reduce((a, m) => (Math.abs(m.value) > Math.abs(a.value) ? m : a), moves[0]);
    const sym = type === "call" ? "C" : "P";
    $("#pdw-f").innerHTML = tex(String.raw`${sym} = ${p.toFixed(2)},\quad \text{${T("最大", "largest")}}: ${big.value >= 0 ? "+" : "-"}${Math.abs(big.value).toFixed(3)}\ \ (\text{${T("每股", "per share")}}) \;=\; ${big.value >= 0 ? "+" : "-"}\$${Math.abs(big.value * 100).toFixed(0)}\ \text{${T("每张合约", "per contract")}}`, true)
      + `<div class="demo-meta">${T("最敏感的输入：", "Most sensitive input: ")}<b>${big.label}</b> · ${T("S = 100，σ = 20%，r = 4%，q = 0", "S = 100, σ = 20%, r = 4%, q = 0")}</div>`;
  };
  onSeg(root, "pdw-t", (v) => { days = +v; draw(); });
  onSeg(root, "pdw-k", (v) => { K = +v; draw(); });
  onSeg(root, "pdw-type", (v) => { type = v; draw(); });
  draw();
}
