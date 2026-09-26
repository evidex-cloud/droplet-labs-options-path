// Main demo for lesson realized-vol: simulate a year of daily bars (open/high/low/close) under a chosen volatility regime,
// then watch three estimators — close-to-close, Parkinson high-low, EWMA — chase the true volatility.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

const DAYS_N = 250, STEPS = 20;

// true annual vol for day t under each scenario (regimes uses a pre-drawn Markov chain)
function volPath(scn, R) {
  const out = [];
  if (scn === "const") { for (let t = 0; t < DAYS_N; t++) out.push(0.2); return out; }
  if (scn === "storm") { for (let t = 0; t < DAYS_N; t++) out.push(t < 100 ? 0.12 : t < 140 ? 0.45 : 0.12 + 0.33 * Math.exp(-(t - 140) / 25)); return out; }
  let storm = false;
  for (let t = 0; t < DAYS_N; t++) { const u = R(); storm = storm ? u > 0.06 : u < 0.02; out.push(storm ? 0.4 : 0.14); }
  return out;
}

// daily bars; gapShare = fraction of each day's variance that happens overnight (invisible to the high-low range)
function simulate(scn, seed, gapShare) {
  const R = O.rng(seed), vols = volPath(scn, R);
  const bars = [];
  let prev = 100;
  for (let t = 0; t < DAYS_N; t++) {
    const dv = (vols[t] * vols[t]) / 252;
    const open = prev * Math.exp(Math.sqrt(dv * gapShare) * R.normal() - 0.5 * dv * gapShare);
    let p = open, hi = open, lo = open;
    const sv = Math.sqrt((dv * (1 - gapShare)) / STEPS);
    for (let k = 0; k < STEPS; k++) { p *= Math.exp(sv * R.normal() - 0.5 * sv * sv); if (p > hi) hi = p; if (p < lo) lo = p; }
    bars.push({ open, high: hi, low: lo, close: p, vol: vols[t] });
    prev = p;
  }
  return bars;
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let scn = "storm", gap = "0", seed = 7;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("一年的日线：三种估计量追赶真实波动率", "A year of daily bars: three estimators chase the true volatility")}</div>
    <div class="demo-row">${seg("rv-scn", [["storm", T("平静→风暴→平静", "Calm → storm → calm")], ["regimes", T("随机切换的状态", "Random regimes")], ["const", T("恒定 20%", "Constant 20%")]], scn)}</div>
    <div class="demo-row">${seg("rv-gap", [["0", T("无隔夜跳空", "No overnight gaps")], ["0.3", T("30% 的方差发生在隔夜", "30% of variance overnight")]], gap)}
      <div class="demo-btns" style="margin:0"><button class="demo-btn" data-act="new">${T("换一条路径", "New path")}</button></div></div>
    <div class="demo-grid">
      ${slider("rv-n", T("窗口长度 n（交易日）", "Window n (trading days)"), 5, 120, 1, 21)}
      ${slider("rv-lam", T("EWMA 衰减系数 λ", "EWMA decay λ"), 0.8, 0.99, 0.01, 0.94)}
    </div>
    <div id="rv-price"></div>
    <div id="rv-vol"></div>
    <div id="rv-stats"></div>
    <div class="demo-math" id="rv-f"></div>
    <p class="demo-tip">${T("试试：在“平静→风暴→平静”里把窗口从 21 拉到 5 和 120，看噪声与滞后怎样此消彼长；打开“隔夜跳空”，高低价（Parkinson）估计会系统性偏低，因为它看不见夜里的跳动。", "Try this: in “Calm → storm → calm”, drag the window from 21 to 5 and to 120 and watch noise trade off against lag. Switch on overnight gaps: the high-low (Parkinson) estimate now runs systematically low, because it never sees the moves that happen overnight.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  let bars = simulate(scn, seed, +gap);

  const draw = (v) => {
    const n = v["rv-n"], lam = v["rv-lam"];
    const closes = [100, ...bars.map((b) => b.close)];
    const rets = O.logReturns(closes);
    // rolling close-to-close and Parkinson over the last n days; EWMA recursively
    const cc = [], pk = [], ew = [], tv = [];
    let ev = (bars[0].vol * bars[0].vol) / 252;
    for (let t = 0; t < DAYS_N; t++) {
      tv.push([t + 1, bars[t].vol * 100]);
      ev = lam * ev + (1 - lam) * rets[t] * rets[t];
      ew.push([t + 1, Math.sqrt(ev * 252) * 100]);
      if (t + 1 >= n) {
        cc.push([t + 1, O.realizedVol(closes.slice(t + 1 - n, t + 2), 252) * 100]);
        const w = bars.slice(t + 1 - n, t + 1);
        pk.push([t + 1, O.parkinsonVol(w.map((b) => b.high), w.map((b) => b.low), 252) * 100]);
      }
    }
    $("#rv-price").innerHTML = lineChart({
      H: 190, xmin: 0, xmax: DAYS_N, xlabel: T("交易日", "Trading day"), ylabel: T("价格", "Price"),
      series: [{ points: closes.map((c, i) => [i, c]), cls: 5, label: T("收盘价", "Close") }],
    });
    $("#rv-vol").innerHTML = lineChart({
      H: 250, xmin: 0, xmax: DAYS_N, ymin: 0, xlabel: T("交易日", "Trading day"), ylabel: T("年化波动率 %", "Annualized vol %"), yfmt: (x) => x + "%",
      series: [
        { points: tv, cls: 5, dashed: true, label: T("真实波动率", "True vol") },
        { points: cc, cls: 0, label: T(`收盘到收盘（${n} 天）`, `Close-to-close (${n} days)`) },
        { points: pk, cls: 3, label: T(`高低价 Parkinson（${n} 天）`, `High-low Parkinson (${n} days)`) },
        { points: ew, cls: 1, label: `EWMA (λ = ${lam.toFixed(2)})` },
      ],
    });
    const last = (a) => a[a.length - 1][1];
    const full = O.realizedVol(closes, 252) * 100;
    $("#rv-stats").innerHTML = stats([
      [T("最后一天：真实", "Last day: true"), last(tv).toFixed(1) + "%"],
      [T("收盘到收盘", "Close-to-close"), last(cc).toFixed(1) + "%", "acc"],
      [T("Parkinson 高低价", "Parkinson high-low"), last(pk).toFixed(1) + "%"],
      ["EWMA", last(ew).toFixed(1) + "%"],
      [T("全年收盘到收盘", "Full-year close-to-close"), full.toFixed(1) + "%"],
    ]);
    const se = last(tv) / Math.sqrt(2 * n);
    $("#rv-f").innerHTML =
      tex(String.raw`\hat\sigma_{CC} = \sqrt{\frac{252}{n-1}\sum_{i}(r_i-\bar r)^2} = ${last(cc).toFixed(1)}\%\quad(n = ${n})`, true) +
      tex(String.raw`\operatorname{SE} \approx \frac{\sigma}{\sqrt{2n}} = \frac{${last(tv).toFixed(1)}\%}{\sqrt{${2 * n}}} = ${se.toFixed(1)}\ \text{${T("个波动率点", "vol points")}}`, true);
  };
  const run = bindSliders(root, { "rv-n": (x) => x + T(" 天", " days"), "rv-lam": (x) => (+x).toFixed(2) }, draw);
  const regen = () => { bars = simulate(scn, seed, +gap); run(); };
  onSeg(root, "rv-scn", (x) => { scn = x; regen(); });
  onSeg(root, "rv-gap", (x) => { gap = x; regen(); });
  root.querySelector('[data-act="new"]').addEventListener("click", () => { seed += 1; regen(); });
}
