// Inline demo for lesson binomial-trees: tree price vs number of steps (1–150) for the 1-year XYZ option,
// with the Black-Scholes value and the "average of N and N+1" fix for the even/odd zigzag.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let K = 100, type = "call";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("步数越多，越接近 Black-Scholes——但走的是锯齿", "More steps, closer to Black-Scholes — in a zigzag")}</div>
    <div class="demo-row">${seg("btc-k", [["90", "K = 90"], ["100", "K = 100"], ["110", "K = 110"]], "100")}
      ${seg("btc-type", [["call", T("看涨", "Call")], ["put", T("看跌（欧式）", "Put (European)")]], "call")}</div>
    <div id="btc-chart"></div>
    <div class="demo-math" id="btc-f"></div>
    <div id="btc-stats"></div>
    <p class="demo-tip">${T("看什么：蓝点在 Black-Scholes 水平线上下跳，偶数步和奇数步各站一边；绿线把相邻两步平均，几乎立刻贴上水平线。换一个行权价，锯齿的节奏会变。XYZ：S = 100，σ = 20%，r = 4%，T = 1 年。", "What to notice: the blue dots hop above and below the Black-Scholes line, even and odd step counts on opposite sides; the green line averages neighbours and hugs the line almost at once. Change the strike and the zigzag's rhythm changes. XYZ: S = 100, σ = 20%, r = 4%, T = 1 year.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = () => {
    const o = { S: 100, K, T: 1, r: 0.04, sigma: 0.2, type };
    const bs = O.bsPrice(o);
    const Nmax = 150, px = [];
    for (let n = 1; n <= Nmax + 1; n++) px.push(O.binomial({ ...o, steps: n }).price);
    const pts = px.slice(0, Nmax).map((p, i) => [i + 1, p]);
    const avg = px.slice(0, Nmax).map((p, i) => [i + 1, (p + px[i + 1]) / 2]);
    const lo = Math.min(...px.slice(1)), hi = Math.max(...px.slice(1));
    const pad = Math.max(0.05, (hi - lo) * 0.15);
    $("#btc-chart").innerHTML = lineChart({
      xmin: 1, xmax: Nmax, ymin: lo - pad, ymax: hi + pad, xlabel: T("步数 N", "Steps N"), ylabel: T("期权价格", "Option price"),
      yfmt: (y) => y.toFixed(2),
      series: [
        { points: pts, cls: 0, dots: true, r: 2, label: T("N 步树价格", "N-step tree price") },
        { points: avg, cls: 3, label: T("N 与 N+1 的平均", "Average of N and N+1") },
      ],
      hlines: [{ y: bs, label: "Black-Scholes " + bs.toFixed(2) }],
    });
    const at = (n) => px[n - 1];
    $("#btc-f").innerHTML = tex(String.raw`N = 10:\ ${at(10).toFixed(3)} \quad N = 11:\ ${at(11).toFixed(3)} \quad N = 100:\ ${at(100).toFixed(3)} \quad N = 101:\ ${at(101).toFixed(3)} \quad \text{BS}:\ ${bs.toFixed(3)}`, true);
    $("#btc-stats").innerHTML = stats([
      [T("100 步的误差", "Error at 100 steps"), (at(100) - bs >= 0 ? "+" : "−") + Math.abs(at(100) - bs).toFixed(3)],
      [T("150 步的误差", "Error at 150 steps"), (at(150) - bs >= 0 ? "+" : "−") + Math.abs(at(150) - bs).toFixed(3)],
      [T("100/101 平均的误差", "Error of 100/101 average"), ((at(100) + at(101)) / 2 - bs >= 0 ? "+" : "−") + Math.abs((at(100) + at(101)) / 2 - bs).toFixed(3), "acc"],
    ]);
  };
  onSeg(root, "btc-k", (x) => { K = +x; draw(); });
  onSeg(root, "btc-type", (x) => { type = x; draw(); });
  draw();
}
