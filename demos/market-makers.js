// Main demo for lesson market-makers: run a tiny options desk for five trading days.
// You set the half-spread around the theoretical value of XYZ's 30-day 100 call, choose how much of the order flow is
// informed, and switch delta hedging on or off. Every price is Black-Scholes from the shared engine.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

const N = 250;          // customer orders over the run (50 per trading day, 5 days)
const LOT = 10;         // contracts per order
const LEAD = 1;         // informed traders see the next fair value before anyone can react
const K = 100, r = 0.04, SIG = 0.2, T0 = 30 / 365, DT = 5 / 365 / N;
const STOCK_COST = 0.01; // hedging cost: $0.01 per share of stock traded (half the stock's spread)
const RUNS = 20;         // days averaged for the "expected" numbers

// Path and theoretical values depend only on the seed, so cache them.
const cache = new Map();
function world(seed) {
  if (cache.has(seed)) return cache.get(seed);
  const R = O.rng(1000 + seed);
  const S = [100];
  for (let i = 0; i < N + LEAD; i++) {
    const z = R.normal();
    S.push(S[i] * Math.exp((r - SIG * SIG / 2) * DT + SIG * Math.sqrt(DT) * z));
  }
  const theo = S.map((s, i) => O.bsPrice({ S: s, K, T: T0 - i * DT, r, sigma: SIG, type: "call" }));
  const delta = S.map((s, i) => O.greeks({ S: s, K, T: T0 - i * DT, r, sigma: SIG, type: "call" }).delta);
  const Ro = O.rng(5000 + seed);
  const draws = Array.from({ length: N }, () => [Ro(), Ro(), Ro()]);
  const w = { S, theo, delta, draws };
  cache.set(seed, w);
  return w;
}

// One run of the desk. h = half-spread per share, pi = share of informed orders, hedge = boolean.
export function run(seed, h, pi, hedge, keepSeries) {
  const { S, theo, delta, draws } = world(seed);
  let inv = 0, shares = 0, cash = 0, spread = 0, informed = 0, hcost = 0, fills = 0, infFills = 0, infMove = 0;
  const tot = [[0, 0]], spr = [[0, 0]], inf = [[0, 0]];
  const fillProb = Math.exp(-h / 0.06); // uninformed customers trade less when the spread is wider
  for (let t = 0; t < N; t++) {
    const [u1, u2, u3] = draws[t];
    const th = theo[t], bid = th - h, ask = th + h;
    let q = 0; // change in the desk's position, in contracts (+ = the desk bought)
    const isInf = u1 < pi;
    if (isInf) {
      const fut = theo[t + LEAD];
      if (fut > ask) q = -LOT; else if (fut < bid) q = LOT;
    } else if (u2 < fillProb) q = u3 < 0.5 ? LOT : -LOT;
    if (q) {
      fills++;
      cash -= q * 100 * (q > 0 ? bid : ask);
      inv += q;
      spread += Math.abs(q) * 100 * h;
      if (isInf) { infFills++; const mv = q * 100 * (theo[t + LEAD] - th); informed += mv; infMove += Math.abs(theo[t + LEAD] - th); }
    }
    // the stock moves before the desk's hedge order reaches the market: hedge at the next price
    if (hedge) {
      const target = -inv * 100 * delta[t + 1];
      const tr = target - shares;
      cash -= tr * S[t + 1] + Math.abs(tr) * STOCK_COST;
      hcost += Math.abs(tr) * STOCK_COST;
      shares = target;
    }
    if (keepSeries) {
      const val = cash + inv * 100 * theo[t + 1] + shares * S[t + 1];
      tot.push([t + 1, val]); spr.push([t + 1, spread]); inf.push([t + 1, informed]);
    }
  }
  const total = cash + inv * 100 * theo[N] + shares * S[N];
  return { total, spread, informed, hcost, other: total - spread - informed + hcost, fills, infFills, L: infFills ? infMove / infFills : 0, tot, spr, inf };
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let hedge = "on", seed = 1;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("开一张小小的做市台：报价、被成交、对冲", "Run a tiny options desk: quote, get filled, hedge")}</div>
    <p class="demo-meta">${T("标的：XYZ 30 天、行权价 100 的看涨期权（理论价 2.45，σ = 20%）。250 张客户订单，每张 10 张合约，跨 5 个交易日。知情交易者能提前看到下一刻的公允价，而做市台的对冲单要等股价动了之后才成交。", "Instrument: XYZ's 30-day 100 call (theo 2.45, σ = 20%). 250 customer orders of 10 contracts each over 5 trading days. Informed traders see the next fair value before it happens; the desk's hedge only fills after the stock has moved.")}</p>
    <div class="demo-row">${seg("mm-hedge", [["on", T("Delta 对冲", "Delta-hedge")], ["off", T("不对冲", "Don't hedge")]], hedge)}
      <div class="demo-btns" style="margin:0"><button type="button" class="demo-btn" data-act="new">${T("换一组行情（新种子）", "New market (new seed)")}</button></div></div>
    <div class="demo-grid">
      ${slider("mm-h", T("半价差 h（每股）", "Half-spread h (per share)"), 0.01, 0.2, 0.01, 0.05)}
      ${slider("mm-pi", T("知情订单占比 π", "Informed share of orders π"), 0, 50, 1, 10)}
    </div>
    <div class="demo-math" id="mm-quote"></div>
    <div id="mm-stats"></div>
    <div id="mm-chart"></div>
    <div class="demo-math" id="mm-f"></div>
    <p class="demo-tip">${T("试试：把 π 拉到 40%，默认 0.05 美元的半价差开始亏钱；把 h 调到 0.10 美元左右，又能回到盈利。切到“不对冲”，看同样的价差收入如何被股价方向淹没。", "Try this: push π to 40% and the default $0.05 half-spread starts losing; widen h to about $0.10 and the desk is back in the black. Switch to “Don't hedge” and watch the same spread income drown in the stock's direction.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const usd = (x) => (x < 0 ? "−$" : "$") + Math.abs(x).toLocaleString("en-US", { maximumFractionDigits: 0 });
  const draw = (v) => {
    const h = v["mm-h"], pi = v["mm-pi"] / 100, hg = hedge === "on";
    const th0 = world(seed).theo[0];
    $("#mm-quote").innerHTML = tex(String.raw`\text{${T("买价", "bid")}} / \text{${T("卖价", "ask")}} = ${th0.toFixed(2)} \mp ${h.toFixed(2)} = ${(th0 - h).toFixed(2)} / ${(th0 + h).toFixed(2)}`, true);
    const one = run(seed, h, pi, hg, true);
    let sumT = 0, sumS = 0, sumI = 0, sumH = 0, sumF = 0, sumIF = 0, sumL = 0, nL = 0;
    for (let k = 0; k < RUNS; k++) {
      const x = run(seed + k, h, pi, hg, false);
      sumT += x.total; sumS += x.spread; sumI += x.informed; sumH += x.hcost; sumF += x.fills; sumIF += x.infFills;
      if (x.infFills) { sumL += x.L * x.infFills; nL += x.infFills; }
    }
    const avgT = sumT / RUNS;
    $("#mm-stats").innerHTML = stats([
      [T("本组行情：成交笔数", "This run: fills"), String(one.fills)],
      [T("赚到的价差", "Spread earned"), usd(one.spread), "pos"],
      [T("输给知情单", "Lost to informed flow"), usd(one.informed), one.informed < 0 ? "neg" : ""],
      [T("对冲成本", "Hedging cost"), usd(-one.hcost), one.hcost > 0 ? "neg" : ""],
      [T("库存（方向、Gamma、Theta）", "Inventory (delta, gamma, theta)"), usd(one.other), one.other >= 0 ? "pos" : "neg"],
      [T("本组合计", "Total, this run"), usd(one.total), one.total >= 0 ? "pos" : "neg"],
      [T(`${RUNS} 组平均`, `Average of ${RUNS} runs`), usd(avgT), avgT >= 0 ? "acc" : "neg"],
    ]);
    $("#mm-chart").innerHTML = lineChart({
      xmin: 0, xmax: N, xlabel: T("客户订单序号", "Customer order number"), ylabel: T("累计盈亏（美元）", "Cumulative P&L ($)"),
      yfmt: (y) => (Math.abs(y) >= 1000 ? (y / 1000).toFixed(1) + "k" : y.toFixed(0)),
      series: [
        { points: one.tot, cls: 0, label: T("做市台总盈亏", "Desk total P&L") },
        { points: one.spr, cls: 3, dashed: true, label: T("累计价差收入", "Spread earned") },
        { points: one.inf, cls: 2, dashed: true, label: T("输给知情单", "Lost to informed flow") },
      ],
    });
    // the lesson's equation with this run's averages, per share per fill
    const perShare = (x) => x / Math.max(1, sumF * LOT * 100);
    const piFill = sumF ? sumIF / sumF : 0, L = nL ? sumL / nL : 0, c = perShare(sumH);
    const eq = h - piFill * L - c;
    $("#mm-f").innerHTML = tex(String.raw`\E[\Pi] \approx \underbrace{${h.toFixed(3)}}_{h} - \underbrace{${piFill.toFixed(2)}}_{\pi_{\text{${T("成交", "fills")}}}} \times \underbrace{${L.toFixed(3)}}_{L} - \underbrace{${c.toFixed(4)}}_{c} = ${eq.toFixed(4)}`, true)
      + `<p class="demo-meta">${T(`单位：美元/股/笔，按 ${RUNS} 组行情平均。π 在这里是“成交里知情单的比例”，它通常高于订单里的比例：价差越窄，知情者越愿意来。`, `Dollars per share per fill, averaged over ${RUNS} runs. Here π is the informed share of fills, usually higher than their share of orders: the tighter the quote, the more eagerly they trade.`)}</p>`;
  };
  const spec = { "mm-h": (x) => "$" + (+x).toFixed(2), "mm-pi": (x) => x + "%" };
  const rerun = bindSliders(root, spec, draw);
  onSeg(root, "mm-hedge", (v) => { hedge = v; rerun(); });
  root.querySelector('[data-act="new"]').addEventListener("click", () => { seed = (seed % 97) + RUNS; rerun(); });
}
