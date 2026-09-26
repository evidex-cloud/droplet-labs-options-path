// Inline demo for lesson zero-dte: the same instant move in XYZ at 09:30 and at 15:30, for three common 0DTE positions.
// Session clock (the day's variance lives in the 6.5-hour session), σ = 20%, r = 4%, positions valued with Black-Scholes.
import * as O from "./_opt.js";
import { barChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

const Ty = (h) => h / 6.5 / 365;
const P = (S, K, h, type) => O.bsPrice({ S, K, T: Ty(h), r: 0.04, sigma: 0.2, type });
const POS = {
  call: { legs: [[+1, "call", 100]] },
  straddle: { legs: [[-1, "call", 100], [-1, "put", 100]] },
  condor: { legs: [[-1, "put", 99], [+1, "put", 98], [-1, "call", 101], [+1, "call", 102]] },
};
const value = (pos, S, h) => POS[pos].legs.reduce((a, [n, type, K]) => a + n * P(S, K, h, type), 0);
const gammaOf = (pos, S, h) => POS[pos].legs.reduce((a, [n, type, K]) => a + n * O.greeks({ S, K, T: Ty(h), r: 0.04, sigma: 0.2, type }).gamma, 0);

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let pos = "call";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("同样一美元，早上和下午不是一回事", "The same dollar, morning versus afternoon")}</div>
    <div class="demo-row">${seg("zp-pos", [["call", T("买平值看涨", "Long ATM call")], ["straddle", T("卖平值跨式", "Short ATM straddle")], ["condor", T("卖 99/101 铁鹰", "Short 99/101 iron condor")]], pos)}</div>
    ${slider("zp-m", T("XYZ 瞬间波动（美元）", "Instant move in XYZ ($)"), -2, 2, 0.25, 1)}
    <div id="zp-bars"></div>
    <div class="demo-math" id="zp-f"></div>
    <div id="zp-stats"></div>
    <p class="demo-tip">${T("看什么：对平值头寸，同样一次波动在 15:30 的盈亏比 9:30 大得多，因为只剩半小时时平值 Gamma 是开盘时的约 3.6 倍。铁鹰在 15:30 看似“几乎到手”，一次 2 美元的波动就能把它推到接近最大亏损。", "What to notice: for the at-the-money positions the same move does far more at 15:30 than at 9:30, because with half an hour left at-the-money gamma is about 3.6 times its opening level. At 15:30 the iron condor looks almost banked, yet a $2 move takes it close to its maximum loss.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const run = bindSliders(root, { "zp-m": (x) => (x > 0 ? "+$" : x < 0 ? "−$" : "$") + Math.abs(x).toFixed(2) }, (v) => {
    const m = v["zp-m"];
    const rows = [[6.5, "9:30"], [0.5, "15:30"]].map(([h, lab]) => {
      const v0 = value(pos, 100, h), v1 = value(pos, 100 + m, h);
      return { h, lab, v0, v1, pnl: (v1 - v0) * 100, gamma: gammaOf(pos, 100, h) };
    });
    $("#zp-bars").innerHTML = barChart({
      bars: rows.map((x) => ({ label: x.lab, value: x.pnl, cls: x.pnl >= 0 ? 3 : 2 })),
      yfmt: (y) => (y < 0 ? "−$" : "$") + Math.abs(y).toFixed(0), xlabel: T("一张合约的即时盈亏", "Instant P&L per contract"), H: 200,
    });
    const [a, b] = rows;
    const n = (x) => (x < 0 ? `(${x.toFixed(3)})` : x.toFixed(3));
    $("#zp-f").innerHTML = tex(String.raw`\begin{aligned} \Pi_{9:30} &= 100 \times (${n(a.v1)} - ${n(a.v0)}) = ${a.pnl.toFixed(1)} \\ \Pi_{15:30} &= 100 \times (${n(b.v1)} - ${n(b.v0)}) = ${b.pnl.toFixed(1)} \end{aligned}`, true);
    $("#zp-stats").innerHTML = stats([
      [T("9:30 的持仓 Γ", "Position Γ at 9:30"), a.gamma.toFixed(3)],
      [T("15:30 的持仓 Γ", "Position Γ at 15:30"), b.gamma.toFixed(3), "acc"],
      [T("9:30 持仓价值（每张）", "Position value at 9:30 (per contract)"), (a.v0 < 0 ? "−$" : "$") + Math.abs(a.v0 * 100).toFixed(1)],
      [T("15:30 持仓价值（每张）", "Position value at 15:30 (per contract)"), (b.v0 < 0 ? "−$" : "$") + Math.abs(b.v0 * 100).toFixed(1)],
    ]);
  });
  onSeg(root, "zp-pos", (x) => { pos = x; run(); });
}
