// Inline demo for lesson perps-vs-options: the two kinds of rent — funding on a 1 BTC perp versus the time decay
// of a 30-day at-the-money call, if bitcoin sits still at $100,000.
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S = 100000, K = 100000, r = 0.04, D = 30;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("两种租金：资金费 vs Theta（1 BTC，比特币原地不动）", "Two kinds of rent: funding vs theta (1 BTC, bitcoin sits still)")}</div>
    <div class="demo-grid-3">
      ${slider("pvc-f", T("资金费率（每 8 小时）", "Funding rate (per 8h)"), -0.02, 0.1, 0.005, 0.01)}
      ${slider("pvc-iv", T("期权隐含波动率", "Option implied vol"), 20, 100, 5, 50)}
      ${slider("pvc-d", T("已持有天数", "Days held"), 1, 30, 1, 10)}
    </div>
    <div class="demo-math" id="pvc-f1"></div>
    <div id="pvc-stats"></div>
    <div id="pvc-chart"></div>
    <p class="demo-tip">${T("看什么：资金费是一条直线，期权的时间损耗是一条越来越陡的曲线，最后一天把剩下的全部吃掉；把资金费拉到 0.05%，或拉成负数，看哪条线在上面。", "What to notice: funding is a straight line; the option's decay is a curve that steepens and eats everything left on the last day. Push funding to 0.05%, or below zero, and watch which line is on top.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const usd = (x) => (x < 0 ? "−$" : "$") + Math.round(Math.abs(x)).toLocaleString("en-US");
  bindSliders(root, { "pvc-f": (x) => (+x).toFixed(3) + "%", "pvc-iv": (x) => x + "%", "pvc-d": (x) => x + T(" 天", " days") }, (v) => {
    const kn = (x) => Math.round(x).toLocaleString("en-US").replace(/,/g, "{,}");
    const f = v["pvc-f"] / 100, sigma = v["pvc-iv"] / 100, d = v["pvc-d"];
    const C0 = O.bsPrice({ S, K, T: D / 365, r, sigma, type: "call" });
    const callLeft = (t) => (D - t > 0 ? O.bsPrice({ S, K, T: (D - t) / 365, r, sigma, type: "call" }) : 0);
    const perpCost = (t) => f * 3 * t * S, callCost = (t) => C0 - callLeft(t);
    const g = D - d > 0 ? O.greeks({ S, K, T: (D - d) / 365, r, sigma, type: "call" }) : { theta: -callLeft(D - 1) };
    $("#pvc-f1").innerHTML = tex(String.raw`\underbrace{f \times 3 \times ${d} \times 100{,}000}_{\text{${T("永续累计资金费", "perp funding so far")}}} = ${perpCost(d) < 0 ? "-" : ""}\$${kn(Math.abs(perpCost(d)))} \qquad \underbrace{C_{30} - C_{${D - d}}}_{\text{${T("期权累计时间损耗", "call decay so far")}}} = ${kn(C0)} - ${kn(callLeft(d))} = \$${kn(callCost(d))}`, true);
    $("#pvc-stats").innerHTML = stats([
      [T("期权权利金（30 天）", "Call premium (30 days)"), usd(C0), "acc"],
      [T("永续今天每日租金", "Perp rent per day now"), usd(f * 3 * S), f >= 0 ? "neg" : "pos"],
      [T("期权今天每日 Theta", "Call theta per day now"), usd(g.theta), "neg"],
      [T(`${d} 天后谁花得多`, `Who has paid more after ${d} days`), perpCost(d) > callCost(d) ? T("永续", "the perp") : T("期权", "the call")],
    ]);
    const pts = (fn) => Array.from({ length: D + 1 }, (_, t) => [t, fn(t)]);
    $("#pvc-chart").innerHTML = lineChart({
      xmin: 0, xmax: D, xlabel: T("持有天数", "days held"), ylabel: T("累计成本（美元）", "cumulative cost ($)"), xstep: 5,
      series: [
        { points: pts(perpCost), cls: 4, label: T("永续：资金费", "perp: funding") },
        { points: pts(callCost), cls: 0, label: T("看涨期权：时间损耗", "call: time decay") },
      ],
      markers: [{ x: d, label: T(`第 ${d} 天`, `day ${d}`) }],
    });
  });
}
