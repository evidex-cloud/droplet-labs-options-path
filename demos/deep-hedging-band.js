// Inline demo for lesson deep-hedging: one simulated path, the BS delta, a no-trade band around it,
// and the shares actually held. Counts trades and trading cost on this path for the band vs pure delta hedging.
import { makeWorld } from "./deep-hedging.js";
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let seed = 3;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("一条路径上的无交易带", "A no-trade band on one path")}</div>
    <div class="demo-grid">
      ${slider("dhb-b", T("带的半宽 b（Delta 单位）", "Band half-width b (delta units)"), 0, 0.15, 0.005, 0.035)}
      ${slider("dhb-k", T("交易成本 k", "Trading cost k"), 0, 0.5, 0.05, 0.1)}
    </div>
    <div class="demo-btns"><button class="demo-btn" data-new>${T("换一条路径", "New path")}</button></div>
    <div id="dhb-chart"></div>
    <div id="dhb-stats"></div>
    <div class="demo-math" id="dhb-f"></div>
    <p class="demo-tip">${T("看什么：细线是教科书 Delta（每天检查 4 次），虚线是带的上下沿，粗线是实际持股。持股只在碰到带的边缘时才动——b 越宽，交易越少、成本越低，但持股离 Delta 越远。", "What to notice: the thin line is the textbook delta (checked four times a day), the dashed lines are the band's edges, the thick line is the shares actually held. Holdings move only when they hit an edge — a wider b means fewer trades and lower cost, but holdings stray further from delta.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  let world = makeWorld({ n: 1, perDay: 4, seed });
  const simulate = (b, k) => {
    const { S, D } = world.P[0], steps = world.steps;
    let h = 0, trades = 0, cost = 0, turnover = 0;
    const H = [];
    for (let i = 0; i < steps; i++) {
      const lo = D[i] - b, hi = D[i] + b, nh = h < lo ? lo : h > hi ? hi : h;
      if (nh !== h) { trades++; turnover += S[i] * Math.abs(nh - h); cost += k * S[i] * Math.abs(nh - h); h = nh; }
      H.push(h);
    }
    return { H, trades, cost, turnover };
  };
  const draw = (v) => {
    const b = v["dhb-b"], k = v["dhb-k"] / 100;
    const { D, S } = world.P[0], steps = world.steps, day = (i) => (i * 30) / steps;
    const band = simulate(b, k), pure = simulate(0, k);
    const step = [];
    band.H.forEach((h, i) => { if (i) step.push([day(i), band.H[i - 1]]); step.push([day(i), h]); });
    step.push([30, band.H[steps - 1]]);
    const Dp = Array.from(D, (d, i) => [day(i), d]);
    $("#dhb-chart").innerHTML = lineChart({
      series: [
        { points: Dp, cls: 5, label: T("Black-Scholes Delta", "Black-Scholes delta") },
        { points: Dp.map(([x, d]) => [x, d + b]), cls: 1, dashed: true, label: T("带的边缘 Δ ± b", "band edges Δ ± b") },
        { points: Dp.map(([x, d]) => [x, d - b]), cls: 1, dashed: true },
        { points: step, cls: 0, label: T("实际持股（每股期权对应）", "shares held (per option)") },
      ],
      xmin: 0, xmax: 30, ymin: 0, ymax: 1.1, xlabel: T("天数", "Day"), ylabel: T("持股 / Delta", "Shares / delta"), H: 250,
    });
    $("#dhb-stats").innerHTML = stats([
      [T("到期股价", "XYZ at expiry"), "$" + S[steps].toFixed(2)],
      [T("交易次数：Delta / 带", "Trades: delta / band"), pure.trades + " / " + band.trades, "acc"],
      [T("成本（每张）：Delta", "Cost per contract: delta"), "$" + (pure.cost * 100).toFixed(2), "neg"],
      [T("成本（每张）：带", "Cost per contract: band"), "$" + (band.cost * 100).toFixed(2), band.cost < pure.cost ? "pos" : ""],
    ]);
    $("#dhb-f").innerHTML = tex(String.raw`\text{${T("成本", "cost")}} = k \times \underbrace{\sum_k S_k\,|\delta_k - \delta_{k-1}| \times 100}_{\text{${T("成交额", "traded value")}}}`, true)
      + tex(String.raw`= ${(k * 100).toFixed(2)}\% \times \$${Math.round(band.turnover * 100).toLocaleString("en-US").replace(/,/g, "{,}")} = \$${(band.cost * 100).toFixed(2)}`, true);
  };
  const run = bindSliders(root, { "dhb-b": (x) => (+x).toFixed(3), "dhb-k": (x) => (+x).toFixed(2) + "%" }, draw);
  $("[data-new]").addEventListener("click", () => { seed += 1; world = makeWorld({ n: 1, perDay: 4, seed }); run(); });
}
