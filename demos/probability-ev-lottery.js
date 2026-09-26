// Inline demo for lesson probability-ev: buy one out-of-the-money 30-day call every month for 1,000 months.
// Prices come from Black-Scholes at σ = 20%; outcomes are simulated from a lognormal with the chosen "real" volatility.
// Stratified sampling (one normal draw per 1/1000 slice of probability, in random order) keeps the totals close to the
// model's expectation, so the 16% / 20% / 25% comparison is not swamped by the noise of a 5%-probability event.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const Tm = 30 / 365, r = O.XYZ.r, iv = O.XYZ.sigma, N = 1000;
  let K = "110", world = "20", seed = 1;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("连续 1,000 个月，每月买一张虚值看涨", "Buy one out-of-the-money call every month, 1,000 months in a row")}</div>
    <div class="demo-row">${seg("pel-k", [["105", T("105 看涨", "105 call")], ["110", T("110 看涨", "110 call")], ["115", T("115 看涨", "115 call")]], K)}</div>
    <div class="demo-row">${seg("pel-w", [["16", T("真实波动率 16%", "Real vol 16%")], ["20", T("真实波动率 20%（= 定价）", "Real vol 20% (= pricing)")], ["25", T("真实波动率 25%", "Real vol 25%")]], world)}</div>
    <div class="demo-btns"><button class="demo-btn" id="pel-run">${T("再跑 1,000 个月（换一组随机数）", "Run another 1,000 months (new random draws)")}</button></div>
    <div class="demo-math" id="pel-f"></div>
    <div id="pel-stats"></div>
    <div id="pel-chart"></div>
    <p class="demo-tip">${T("看什么：在“真实波动率 = 定价”的世界里，累计盈亏在零附近上下漂，偶尔被一次大赢拉起，再被一长串小亏慢慢磨掉。改成 16%，线会稳定地往下走；改成 25%，往上走。决定输赢的是波动率，不是倍数。", "What to notice: when real volatility equals the priced 20%, the running total wanders around zero, jerked up by rare big wins and ground down by long runs of small losses. At 16% it drifts steadily down; at 25%, up. Volatility, not the payoff multiple, decides who wins.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = () => {
    const k = +K, sig = +world / 100, price = O.bsPrice({ S: 100, K: k, T: Tm, r, sigma: iv, type: "call" });
    const R = O.rng(1000 * seed + k + +world), drift = (r - (sig * sig) / 2) * Tm, vol = sig * Math.sqrt(Tm);
    let wins = 0, back = 0, best = 0, run = 0;
    const path = [[0, 0]];
    const slot = Array.from({ length: N }, (_, i) => i);
    for (let i = N - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [slot[i], slot[j]] = [slot[j], slot[i]]; }
    for (let i = 1; i <= N; i++) {
      const z = O.normInv((slot[i - 1] + R()) / N);
      const ST = 100 * Math.exp(drift + vol * z), pay = Math.max(ST - k, 0);
      if (pay > price) wins++;
      back += pay; best = Math.max(best, pay);
      run += (pay - price) * 100;
      if (i % 5 === 0) path.push([i, run]);
    }
    const spent = price * N * 100, got = back * 100, pITM = O.probAbove(100, k, Tm, iv, r);
    $("#pel-f").innerHTML = tex(String.raw`\text{${en ? "price" : "价格"}} = ${price.toFixed(3)}\ \ (\$${(price * 100).toFixed(0)}),\qquad \E[\Pi] = e^{-rT}\,\E[\max(S_T - ${k},\,0)] - ${price.toFixed(3)} = 0\ \ (\sigma = 20\%)`, true);
    $("#pel-stats").innerHTML = stats([
      [T("赚钱的月份", "Winning months"), `${wins} / ${N}`, "acc"],
      [T("定价世界里的实值概率", "P(ITM), pricing world"), (pITM * 100).toFixed(1) + "%"],
      [T("花掉的权利金", "Premium spent"), "$" + Math.round(spent).toLocaleString("en-US")],
      [T("拿回的钱", "Paid back"), "$" + Math.round(got).toLocaleString("en-US")],
      [T("净盈亏", "Net P&L"), (got - spent >= 0 ? "+$" : "−$") + Math.round(Math.abs(got - spent)).toLocaleString("en-US"), got - spent >= 0 ? "pos" : "neg"],
      [T("最大一次回报", "Best single payoff"), best > 0 ? (best / price).toFixed(0) + "× " + T("权利金", "premium") : "—"],
    ]);
    $("#pel-chart").innerHTML = lineChart({
      series: [{ points: path, cls: 0, label: T("累计盈亏（美元）", "Running P&L ($)") }],
      xmin: 0, xmax: N, H: 230, xlabel: T("第几个月", "Month"), ylabel: T("累计盈亏（美元）", "Running P&L ($)"),
      hlines: [{ y: 0, label: T("不赚不亏", "break-even") }],
    });
  };
  onSeg(root, "pel-k", (v) => { K = v; draw(); });
  onSeg(root, "pel-w", (v) => { world = v; draw(); });
  $("#pel-run").addEventListener("click", () => { seed++; draw(); });
  draw();
}
