// Main demo for lesson linear-vs-convex: a two-outcome world. XYZ ends at 100 − s or 100 + s with equal odds.
// The stock's expected value never moves; the call's (and put's) expected payoff grows with the spread s.
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const PAY = {
    stock: { name: T("股票", "Stock"), f: (x) => x, tx: (a) => a, cls: 5 },
    call: { name: T("看涨（K = 100）", "Call (K = 100)"), f: (x) => Math.max(x - 100, 0), tx: (a) => String.raw`\max(${a} - 100,\,0)`, cls: 0 },
    put: { name: T("看跌（K = 100）", "Put (K = 100)"), f: (x) => Math.max(100 - x, 0), tx: (a) => String.raw`\max(100 - ${a},\,0)`, cls: 1 },
  };
  let w = "call";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("两个结局的世界：波动变大，谁的期望值会变？", "A two-outcome world: when the spread widens, whose average changes?")}</div>
    <div class="demo-row">${seg("lvc-w", Object.entries(PAY).map(([k, p]) => [k, p.name]), w)}</div>
    ${slider("lvc-s", T("两个结局离 100 的距离 s（波动的大小）", "Distance s of the two outcomes from 100 (how much it moves)"), 0, 40, 1, 20)}
    <div class="demo-math" id="lvc-f"></div>
    <div id="lvc-stats"></div>
    <div id="lvc-shape"></div>
    <div id="lvc-gap"></div>
    <p class="demo-tip">${T("试试：选“股票”，把 s 从 0 拉到 40——平均值纹丝不动；换成“看涨”或“看跌”，平均收益随 s 线性增长（正好是 s/2）。这就是为什么波动本身会让期权值钱。", "Try this: pick Stock and drag s from 0 to 40 — the average never moves. Switch to the call or the put and the average payoff grows in step with s (exactly s/2). That is why movement itself makes options valuable.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const s = v["lvc-s"], p = PAY[w], lo = 100 - s, hi = 100 + s;
    const Ef = (p.f(lo) + p.f(hi)) / 2, fE = p.f(100), gap = Ef - fE;
    $("#lvc-f").innerHTML = tex(String.raw`\E[f(S_T)] = \tfrac12\,${p.tx(lo)} + \tfrac12\,${p.tx(hi)} = ${Ef.toFixed(1)}`, true) + tex(String.raw`f(\E[S_T]) = ${p.tx(100)} = ${fE.toFixed(1)}`, true);
    $("#lvc-stats").innerHTML = stats([
      [T("两个结局", "The two outcomes"), `${lo} / ${hi}`],
      [T("平均价格", "Average price"), "100"],
      [T("收益的平均值", "Average of the payoffs"), Ef.toFixed(1), "acc"],
      [T("平均价格处的收益", "Payoff at the average price"), fE.toFixed(1)],
      [T("差值（Jensen 缺口）", "Gap (Jensen)"), gap.toFixed(1), gap > 0 ? "pos" : ""],
    ]);
    const lohi = [[lo, p.f(lo)], [hi, p.f(hi)]];
    $("#lvc-shape").innerHTML = lineChart({
      xmin: 55, xmax: 145, W: 600, H: 250, xlabel: T("到期价格", "Price at expiry"), ylabel: T("到期收益", "Payoff"),
      ymin: w === "stock" ? 50 : -2, ymax: w === "stock" ? 150 : 48,
      series: [
        { f: p.f, cls: p.cls, label: p.name },
        { points: lohi, cls: 3, dashed: true, label: T("两个结局的连线", "Chord between the outcomes") },
      ],
      points: [{ x: lo, y: p.f(lo), cls: 5 }, { x: hi, y: p.f(hi), cls: 5 }, { x: 100, y: Ef, cls: 3, label: T("平均收益 ", "avg ") + Ef.toFixed(1) }, { x: 100, y: fE, cls: 2, label: w === "stock" ? "" : "f(100) = " + fE.toFixed(0) }],
    });
    $("#lvc-gap").innerHTML = lineChart({
      xmin: 0, xmax: 40, W: 600, H: 200, ymin: -1, ymax: 22, xlabel: T("结局离 100 的距离 s", "Distance s from 100"), ylabel: T("Jensen 缺口", "Jensen gap"),
      series: [
        { f: () => 0, cls: 5, label: T("股票：永远 0", "Stock: always 0") },
        { f: (x) => x / 2, cls: 0, label: T("看涨或看跌：s/2", "Call or put: s/2") },
      ],
      points: [{ x: s, y: gap, cls: w === "stock" ? 5 : 0, label: gap.toFixed(1) }],
    });
  };
  const run = bindSliders(root, { "lvc-s": (x) => "±" + x }, draw);
  onSeg(root, "lvc-w", (k) => { w = k; run(); });
}
