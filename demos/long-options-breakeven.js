// Inline demo for lesson long-options: the breakeven hurdle rises as time passes.
// For a long call bought today, find the stock price at which the option is worth exactly what was paid, day by day.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S0 = 100, r = 0.04, sigma = 0.2;
  let K = 100, days = 60;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("盈亏平衡线：时间一过，门槛就抬高", "The breakeven hurdle rises with every day that passes")}</div>
    <div class="demo-row">${seg("lob-k", [["90", T("实值 90", "ITM 90")], ["100", T("平值 100", "ATM 100")], ["110", T("虚值 110", "OTM 110")]], "100")}
      ${seg("lob-d", [["30", T("30 天", "30 d")], ["60", T("60 天", "60 d")], ["120", T("120 天", "120 d")]], "60")}</div>
    <div class="demo-math" id="lob-f"></div>
    <div id="lob-stats"></div>
    <div id="lob-chart"></div>
    <p class="demo-tip">${T("看什么：买入当天，盈亏平衡价就是现价 100；之后每过一天，时间价值被 Θ 吃掉一点，股价必须更高才能回本。到期那天门槛等于 K + 权利金。", "What to notice: on the day you buy, breakeven is today's price of 100; each day after, theta eats some time value, so the stock must be higher just to get your money back. On expiry day the hurdle is K + premium.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  // stock price at which the call is worth `cost` with `left` years to go (bisection)
  const beAt = (cost, left) => { let lo = 1, hi = 400; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (O.bsPrice({ S: m, K, T: left, r, sigma, type: "call" }) > cost) hi = m; else lo = m; } return (lo + hi) / 2; };
  function draw() {
    const g = O.greeks({ S: S0, K, T: days / 365, r, sigma, type: "call" });
    const pts = O.range(0, days, 40).map((d) => [d, beAt(g.price, (days - d) / 365)]);
    const half = beAt(g.price, days / 2 / 365), end = K + g.price;
    $("#lob-f").innerHTML = tex(String.raw`\begin{gathered}C\big(S^{*}_t,\ T - t\big) = C_0 = ${g.price.toFixed(2)} \\ S^{*}_{\text{${T("到期", "expiry")}}} = K + C_0 = ${K} + ${g.price.toFixed(2)} = ${end.toFixed(2)}\end{gathered}`, true);
    $("#lob-stats").innerHTML = stats([
      [T("今天的平衡价", "Breakeven today"), "$" + S0.toFixed(2)],
      [T("过半时的平衡价", "Breakeven halfway"), "$" + half.toFixed(2), "acc"],
      [T("到期平衡价", "Breakeven at expiry"), "$" + end.toFixed(2), "neg"],
      [T("Θ（今天，每天）", "Θ today (per day)"), "−$" + Math.abs(g.theta).toFixed(3), "neg"],
    ]);
    $("#lob-chart").innerHTML = lineChart({
      xmin: 0, xmax: days, xlabel: T("买入后的天数", "Days since purchase"), ylabel: T("需要的 XYZ 价格", "XYZ price needed"),
      series: [{ points: pts, cls: 0, label: T("回本所需股价", "Stock price needed to break even") }],
      hlines: [{ y: S0, label: T("买入时 100", "100 at purchase") }, { y: end, label: T(`到期：K + C₀ = ${end.toFixed(2)}`, `at expiry: K + C₀ = ${end.toFixed(2)}`) }],
      points: [{ x: days, y: end, cls: 2 }],
    });
  }
  onSeg(root, "lob-k", (x) => { K = +x; draw(); });
  onSeg(root, "lob-d", (x) => { days = +x; draw(); });
  draw();
}
