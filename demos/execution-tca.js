// Main demo for lesson execution-tca.
// Tab 1: where to put a limit order to BUY 10 XYZ 30-day 100 calls (quote 2.40 / 2.50): fill probability vs expected cost.
//        Toy market: the option mid moves each minute; a seller arrives with probability A·e^{−k·d} (d = distance below the ask
//        in half-spreads), a little more often just before the price drops (adverse selection). Unfilled at the deadline → buy at the ask.
// Tab 2: Almgren–Chriss: a dealer buys 26,700 XYZ shares over one day; risk aversion λ sets the trajectory, cost and risk.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export const M0 = 2.45, HALF = 0.05, SIG_MIN = 0.534 * 100 * 0.2 / Math.sqrt(252 * 390); // option-price move per minute

export function limitSim({ offset, minutes, runs = 1500, seed = 11, A = 0.8, k = 1.5, adverse = 0.5 }) {
  // offset: limit price relative to the arrival mid, in dollars (−0.05 = at the bid, +0.05 = at the ask)
  const R = O.rng(seed), L = M0 + offset;
  let filled = 0, sum = 0, sum2 = 0, mark = 0, tFill = 0;
  for (let i = 0; i < runs; i++) {
    let m = M0, price = null, t = 0;
    for (t = 0; t < minutes; t++) {
      const ask = m + HALF;
      if (L >= ask - 1e-12) { price = ask; break; } // marketable: take the ask now
      const dm = SIG_MIN * R.normal();
      const d = (ask - L) / HALF;
      const p = A * Math.exp(-k * d) * (1 + adverse * Math.tanh(-dm / SIG_MIN));
      if (R() < p) { price = L; m += dm; break; }
      m += dm;
    }
    if (price === null) { price = m + HALF; } else { filled++; tFill += t; }
    // 5-minute markout: where the mid goes after the fill
    let m5 = m; for (let j = 0; j < 5; j++) m5 += SIG_MIN * R.normal();
    const c = price - M0; sum += c; sum2 += c * c; mark += price - m5;
  }
  const mean = sum / runs;
  return { fillRate: filled / runs, cost: mean, sd: Math.sqrt(Math.max(sum2 / runs - mean * mean, 0)), markout: mark / runs, tFill: filled ? tFill / filled : NaN };
}

export function ac({ X = 26700, Tday = 1, sigma = 100 * 0.2 / Math.sqrt(252), eta = 2e-6, gamma = 1e-7, lambda = 1e-6 }) {
  const kappa = Math.sqrt((lambda * sigma * sigma) / eta), kT = kappa * Tday;
  let E, V, x;
  if (kT < 1e-6) {
    E = 0.5 * gamma * X * X + (eta * X * X) / Tday; V = (sigma * sigma * X * X * Tday) / 3; x = (t) => X * (1 - t / Tday);
  } else {
    const sh2 = Math.sinh(kT) ** 2, a = Math.sinh(2 * kT) / (4 * kappa);
    E = 0.5 * gamma * X * X + (eta * X * X * kappa * kappa / sh2) * (a + Tday / 2);
    V = (sigma * sigma * X * X / sh2) * (a - Tday / 2);
    x = (t) => X * Math.sinh(kappa * (Tday - t)) / Math.sinh(kT);
  }
  return { kappa, E, sd: Math.sqrt(V), x };
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("执行的取舍：成交概率 vs 成本，速度 vs 风险", "Execution trade-offs: fill probability vs cost, speed vs risk")}</div>
    ${seg("ex-tab", [["lim", T("限价单放在哪", "Where to place the limit")], ["ac", "Almgren–Chriss"]], "lim")}
    <div id="ex-plim">
      <p class="demo-meta">${T("小凯要买 10 张 XYZ 30 天 100 看涨，报价 2.40 / 2.50（中间价 2.45）。玩具市场，示意参数。", "Kai wants to buy 10 XYZ 30-day 100 calls, quoted 2.40 / 2.50 (mid 2.45). Toy market, illustrative parameters.")}</p>
      <div class="demo-grid">
        ${slider("ex-off", T("限价（相对到达时中间价）", "Limit price (vs arrival mid)"), -0.05, 0.05, 0.01, 0)}
        ${slider("ex-min", T("愿意等待的分钟数", "Minutes you are willing to wait"), 1, 20, 1, 5)}
      </div>
      <div id="ex-lstats"></div>
      <div id="ex-lchart"></div>
      <div id="ex-lchart2"></div>
    </div>
    <div id="ex-pac" hidden>
      <p class="demo-meta">${T("做市商刚卖出 500 张看涨，需要买入约 26,700 股 XYZ 对冲（500 × 100 × 0.534），在一天内完成。冲击参数为示意。", "A dealer just sold 500 calls and must buy about 26,700 XYZ shares to hedge (500 × 100 × 0.534) within one day. Impact parameters are illustrative.")}</p>
      ${slider("ex-lam", T("风险厌恶 λ（log₁₀）", "Risk aversion λ (log₁₀)"), -8, -4, 0.25, -6)}
      <div class="demo-math" id="ex-af"></div>
      <div id="ex-astats"></div>
      <div id="ex-achart"></div>
      <div id="ex-achart2"></div>
    </div>
    <p class="demo-tip">${T("试试：限价放在买价，成交概率很低，没成交的单子最后只能追到卖价，平均成本反而不低；放在中间价附近往往最划算。Almgren–Chriss 页里把 λ 拉高，交易被“前置”，风险降下来，冲击成本升上去。", "Try this: a limit at the bid rarely fills, and the unfilled orders end up chasing the ask, so the average cost is not low; somewhere near the mid is usually cheapest. On the Almgren–Chriss tab, raise λ: trading is front-loaded, risk falls and impact cost rises.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const money = (x) => (x < 0 ? "−$" : "$") + Math.abs(x).toFixed(0);

  const drawLim = (v) => {
    const off = v["ex-off"], mins = v["ex-min"];
    const cur = limitSim({ offset: off, minutes: mins, runs: 3000 });
    const grid = O.range(-0.05, 0.05, 10).map((o) => ({ o, r: limitSim({ offset: o, minutes: mins, runs: 3000 }) }));
    $("#ex-lstats").innerHTML = stats([
      [T("限价", "Limit"), "$" + (M0 + off).toFixed(2), "acc"],
      [T("在时限内成交", "Filled in time"), (cur.fillRate * 100).toFixed(0) + "%"],
      [T("平均执行成本（对到达中间价）", "Average cost vs arrival mid"), (cur.cost >= 0 ? "+" : "−") + "$" + Math.abs(cur.cost).toFixed(3)],
      [T("10 张合计", "For 10 contracts"), money(cur.cost * 1000), cur.cost > 0 ? "neg" : "pos"],
      [T("成本的波动（每股）", "Cost st. dev. (per share)"), "$" + cur.sd.toFixed(3)],
    ]);
    $("#ex-lchart").innerHTML = lineChart({
      H: 220, xmin: 2.4, xmax: 2.5, xlabel: T("限价", "Limit price"), ylabel: T("平均成本 $/股", "Avg cost $/share"),
      series: [{ points: grid.map((g) => [M0 + g.o, g.r.cost]), cls: 0, dots: true, label: T("对到达中间价的平均成本", "Average cost vs arrival mid") }],
      markers: [{ x: M0 + off, label: T("你的限价", "your limit") }], hlines: [{ y: HALF, label: T("直接吃卖价 = +0.05", "cross now = +0.05") }],
      xfmt: (x) => x.toFixed(2), yfmt: (x) => x.toFixed(3),
    });
    $("#ex-lchart2").innerHTML = lineChart({
      H: 190, xmin: 2.4, xmax: 2.5, ymin: 0, ymax: 100, xlabel: T("限价", "Limit price"), ylabel: T("成交率 %", "Fill rate %"),
      series: [{ points: grid.map((g) => [M0 + g.o, g.r.fillRate * 100]), cls: 3, dots: true, label: T("时限内成交的比例", "Share filled before the deadline") }],
      markers: [{ x: M0 + off, label: "" }], xfmt: (x) => x.toFixed(2), yfmt: (x) => x.toFixed(0) + "%",
    });
  };
  const drawAC = (v) => {
    const lam = 10 ** v["ex-lam"];
    const cur = ac({ lambda: lam }), lin = ac({ lambda: 0 });
    $("#ex-af").innerHTML = tex(String.raw`x(t) = X\,\frac{\sinh\big(\kappa(T - t)\big)}{\sinh(\kappa T)}`, true) + tex(String.raw`\kappa = \sqrt{\frac{\lambda\sigma^2}{\eta}} = \sqrt{\frac{10^{${v["ex-lam"].toFixed(2)}} \times ${(1.26 ** 2).toFixed(2)}}{2 \times 10^{-6}}} = ${cur.kappa.toFixed(2)}`, true);
    $("#ex-astats").innerHTML = stats([
      [T("预期成本", "Expected cost"), money(cur.E), "neg"],
      [T("成本的标准差（风险）", "Cost st. dev. (risk)"), money(cur.sd)],
      [T("匀速执行：成本 / 风险", "Linear schedule: cost / risk"), money(lin.E) + " / " + money(lin.sd)],
      [T("前 1 小时完成的比例", "Done in the first hour"), ((1 - cur.x(1 / 6.5) / 26700) * 100).toFixed(0) + "%", "acc"],
    ]);
    $("#ex-achart").innerHTML = lineChart({
      H: 220, xmin: 0, xmax: 6.5, ymin: 0, xlabel: T("交易时间（小时）", "Trading time (hours)"), ylabel: T("剩余股数", "Shares left to buy"),
      series: [
        { f: (h) => cur.x(h / 6.5), cls: 0, label: T("最优轨迹", "Optimal trajectory") },
        { f: (h) => lin.x(h / 6.5), cls: 5, dashed: true, label: T("匀速（TWAP 式）", "Linear (TWAP-like)") },
      ], yfmt: (x) => (x / 1000).toFixed(0) + "k",
    });
    const fr = O.range(-8, -3.5, 36).map((l) => { const r = ac({ lambda: 10 ** l }); return [r.sd, r.E]; });
    $("#ex-achart2").innerHTML = lineChart({
      H: 220, xlabel: T("风险：成本标准差 $", "Risk: st. dev. of cost $"), ylabel: T("预期成本 $", "Expected cost $"),
      series: [{ points: fr, cls: 1, label: T("有效前沿", "Efficient frontier") }],
      points: [{ x: cur.sd, y: cur.E, cls: 0, label: "λ" }], xfmt: (x) => (x / 1000).toFixed(0) + "k", yfmt: (x) => (x / 1000).toFixed(1) + "k",
    });
  };
  bindSliders(root, { "ex-off": (x) => (x >= 0 ? "+" : "−") + "$" + Math.abs(x).toFixed(2), "ex-min": (x) => x + T(" 分钟", " min") }, drawLim);
  bindSliders(root, { "ex-lam": (x) => "10^" + x.toFixed(2) }, drawAC);
  onSeg(root, "ex-tab", (v) => { $("#ex-plim").hidden = v !== "lim"; $("#ex-pac").hidden = v !== "ac"; });
}
