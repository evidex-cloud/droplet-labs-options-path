// Main demo for lesson mark-index-last: a 10-minute tape with index, mark and last price.
// Inject a wick in the perp book and/or a real move in spot, and see which leveraged longs are liquidated
// by an engine that watches the last price versus one that watches the mark.
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const LEVS = [3, 5, 10, 20, 25, 50, 75, 100], P0 = 100000, MMR = 0.005, N = 600, PREM = 60;
  let seed = 11;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("插针模拟器：按最新价强平 vs 按标记价强平", "Wick simulator: liquidate on last vs liquidate on mark")}</div>
    <div class="demo-grid">
      ${slider("mil-depth", T("插针深度（永续订单簿）", "Wick depth (perp book)"), 0, 15, 0.5, 10.2)}
      ${slider("mil-dur", T("插针持续秒数", "Wick duration (seconds)"), 1, 60, 1, 1)}
      ${slider("mil-spot", T("现货真实下跌（所有交易所）", "Real spot move (all venues)"), -12, 0, 0.5, 0)}
      ${slider("mil-win", T("标记价平滑窗口（秒）", "Mark smoothing window (seconds)"), 10, 300, 10, 300)}
    </div>
    <div class="demo-btns"><button class="demo-btn" data-act="noise">${T("换一段随机噪音", "New random noise")}</button></div>
    <div class="demo-math" id="mil-f"></div>
    <div id="mil-stats"></div>
    <div id="mil-chart"></div>
    <div id="mil-table"></div>
    <p class="demo-tip">${T("试试：默认是一根 1 秒、约 10% 的插针——按最新价，10 倍及以上的多单全灭；按标记价，一个都没事。再把“现货真实下跌”拉到 −11%：指数和标记价一起下滑，两种引擎都会强平。最后把插针持续时间拉长到 60 秒、平滑窗口缩短到 10 秒，看标记价也开始被插针拖动。所有价格均为演示。", "Try this: the default is a 1-second wick of about 10%: on a last-price engine every long at 10× and above is wiped out, on a mark engine none are. Now drag the real spot move to −11%: index and mark slide together and both engines liquidate. Finally stretch the wick to 60 seconds and shrink the smoothing window to 10 seconds, and watch the wick start to drag the mark too. All prices are illustrative.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const f0 = (x) => Math.round(x).toLocaleString("en-US");
  const tn = (x, d = 0) => x.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }).replace(/,/g, "{,}");

  const draw = (v) => {
    const depth = v["mil-depth"] / 100, dur = v["mil-dur"], spot = v["mil-spot"] / 100, W = v["mil-win"];
    const R = O.rng(seed);
    const index = [], last = [], mark = [];
    let walk = 0, sum = PREM * W; // pre-history: the premium was PREM for the whole window
    const prem = [];
    for (let t = 0; t < N; t++) {
      walk += 6 * R.normal();
      const move = t < 240 ? 0 : t < 420 ? spot * ((t - 240) / 180) : spot;
      const I = P0 * (1 + move) + walk;
      let L = I + PREM + 12 * R.normal();
      if (t >= 300 && t < 300 + dur) L = I * (1 - depth);
      const p = L - I;
      prem.push(p);
      sum += p - (t - W >= 0 ? prem[t - W] : PREM);
      index.push(I); last.push(L); mark.push(I + sum / W);
    }
    const minL = Math.min(...last), minM = Math.min(...mark), minI = Math.min(...index);
    const tMin = mark.indexOf(minM), tWick = 300 + Math.min(dur, N - 300) - 1;
    const rows = LEVS.map((L) => {
      const liq = O.liqPrice(P0, L, MMR, "long");
      return { L, liq, onLast: minL <= liq, onMark: minM <= liq };
    });
    const nLast = rows.filter((r) => r.onLast).length, nMark = rows.filter((r) => r.onMark).length;
    $("#mil-f").innerHTML = tex(String.raw`M_t = I_t + \bar b_t:\quad \text{${T("插针末尾", "end of wick")}}\ ${tn(mark[tWick])} = ${tn(index[tWick])} + ${tn(mark[tWick] - index[tWick], 1)},\qquad \text{last}_t = ${tn(last[tWick])}`, true);
    $("#mil-stats").innerHTML = stats([
      [T("最新价最低", "Lowest last"), "$" + f0(minL), "neg"],
      [T("标记价最低", "Lowest mark"), "$" + f0(minM), "acc"],
      [T("指数价最低", "Lowest index"), "$" + f0(minI)],
      [T("被强平（按最新价）", "Liquidated (last engine)"), nLast + " / " + LEVS.length, nLast ? "neg" : "pos"],
      [T("被强平（按标记价）", "Liquidated (mark engine)"), nMark + " / " + LEVS.length, nMark ? "neg" : "pos"],
    ]);
    const pts = (arr) => arr.map((y, t) => [t, y]);
    $("#mil-chart").innerHTML = lineChart({
      xmin: 0, xmax: N - 1, xlabel: T("秒", "Seconds"), ylabel: T("价格", "Price"), yfmt: (y) => (y / 1000).toFixed(1) + "k", samples: N,
      series: [
        { points: pts(last), cls: 4, label: T("最新价", "Last") },
        { points: pts(index), cls: 5, label: T("指数价", "Index") },
        { points: pts(mark), cls: 0, label: T("标记价", "Mark") },
      ],
      hlines: [{ y: O.liqPrice(P0, 10, MMR, "long"), label: T("10 倍多单强平价", "10× long liquidation") }],
      points: [{ x: tMin, y: minM, cls: 0 }],
    });
    const cell = (hit) => `<td class="${hit ? "" : ""}"><span class="pill ${hit ? "bad" : "ok"}">${hit ? T("强平", "liquidated") : T("存活", "survives")}</span></td>`;
    $("#mil-table").innerHTML = `<table><thead><tr><th>${T("杠杆（多单，开仓 100,000）", "Leverage (long from 100,000)")}</th><th>${T("强平价", "Liquidation price")}</th><th>${T("按最新价", "Last engine")}</th><th>${T("按标记价", "Mark engine")}</th></tr></thead><tbody>${rows
      .map((r) => `<tr${r.L === 10 ? ' class="hl"' : ""}><td>${r.L}×${r.L === 10 ? T("（小凯）", " (Kai)") : ""}</td><td>$${f0(r.liq)}</td>${cell(r.onLast)}${cell(r.onMark)}</tr>`)
      .join("")}</tbody></table>`;
  };
  const run = bindSliders(root, { "mil-depth": (x) => x + "%", "mil-dur": (x) => x + T(" 秒", " s"), "mil-spot": (x) => x + "%", "mil-win": (x) => x + T(" 秒", " s") }, draw);
  $("[data-act=noise]").addEventListener("click", () => { seed = (seed * 13 + 7) % 1009; run(); });
}
