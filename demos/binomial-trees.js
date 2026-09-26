// Main demo for lesson binomial-trees: draw a CRR tree with 1–6 steps (stock price and option value at every node),
// toggle European/American, highlight early-exercise nodes, and compare with a 500-step tree and Black-Scholes.
import * as O from "./_opt.js";
import { seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let type = "put", american = true, N = 3;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("二叉树实验台：画树、倒推、提前行权", "Tree workbench: build, roll back, exercise early")}</div>
    <div class="demo-row">${seg("bt-type", [["call", T("看涨", "Call")], ["put", T("看跌", "Put")]], type)}
      ${seg("bt-style", [["eu", T("欧式", "European")], ["am", T("美式", "American")]], "am")}
      ${seg("bt-n", [1, 2, 3, 4, 5, 6].map((k) => [String(k), T(`${k} 步`, `${k} step${k > 1 ? "s" : ""}`)]), "3")}</div>
    <div class="demo-grid">
      ${slider("bt-s", T("现价 S", "Spot S"), 60, 140, 1, 100)}
      ${slider("bt-k", T("行权价 K", "Strike K"), 60, 140, 1, 100)}
      ${slider("bt-v", T("波动率 σ", "Volatility σ"), 5, 60, 1, 20)}
      ${slider("bt-r", T("利率 r", "Rate r"), 0, 10, 0.25, 4)}
      ${slider("bt-t", T("到期天数", "Days to expiry"), 30, 730, 5, 365)}
    </div>
    <div class="demo-math" id="bt-f"></div>
    <div id="bt-tree"></div>
    <div id="bt-stats"></div>
    <p class="demo-tip">${T("试试：选美式看跌，把 S 往下拉，橙色的提前行权节点会从右下角向左蔓延；换成看涨（不分红），无论怎么拉都不会出现橙色节点。步数从 1 点到 6，树价在 500 步的值上下摆动。", "Try this: with an American put, drag S down and the orange early-exercise nodes spread in from the bottom right; switch to a call (no dividends) and no orange node ever appears. Click from 1 to 6 steps and watch the tree price swing around the 500-step value.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const S = v["bt-s"], K = v["bt-k"], sigma = v["bt-v"] / 100, r = v["bt-r"] / 100, Tm = v["bt-t"] / 365;
    const o = { S, K, T: Tm, r, sigma, type };
    const small = O.binomial({ ...o, steps: N, american, keepTree: true });
    const big = O.binomial({ ...o, steps: 500, american });
    const bigEu = american ? O.binomial({ ...o, steps: 500, american: false }) : big;
    const bs = O.bsPrice(o);
    $("#bt-f").innerHTML = tex(String.raw`\Delta t = \tfrac{T}{N} = ${small.dt.toFixed(4)},\quad u = e^{\sigma\sqrt{\Delta t}} = ${small.u.toFixed(4)},\quad d = \tfrac1u = ${small.d.toFixed(4)}`, true) +
      tex(String.raw`q = \frac{e^{r\Delta t} - d}{u - d} = ${small.p.toFixed(4)},\qquad e^{-r\Delta t} = ${Math.exp(-r * small.dt).toFixed(4)}`, true);
    // draw the tree
    const W = 660, h = N <= 2 ? 50 : N <= 4 ? 32 : 22, H = 2 * N * h + 70, cy = N * h + 20, dx = (W - 100) / N, bw = 84, bh = 32;
    const X = (i) => 50 + i * dx, Y = (i, j) => cy - (2 * j - i) * h;
    let edges = "", nodes = "";
    small.tree.forEach((row, i) => row.forEach((nd, j) => {
      if (i < N) for (const jj of [j, j + 1]) edges += `<line x1="${X(i) + bw / 2}" y1="${Y(i, j)}" x2="${X(i + 1) - bw / 2}" y2="${Y(i + 1, jj)}" class="fx-line-muted"/>`;
      const last = i === N, itm = O.intrinsic(type, nd.S, K) > 0;
      const cls = i === 0 ? "fx-hl" : !last && nd.ex ? "fx-btc" : last && itm ? "fx-ok" : nd.V > 1e-9 ? "fx-box" : "fx-box2";
      nodes += `<rect x="${X(i) - bw / 2}" y="${Y(i, j) - bh / 2}" width="${bw}" height="${bh}" rx="5" class="${cls}"/>` +
        `<text x="${X(i)}" y="${Y(i, j) - 3}" text-anchor="middle" class="fx-t-sm">S ${nd.S.toFixed(2)}</text>` +
        `<text x="${X(i)}" y="${Y(i, j) + 11}" text-anchor="middle" class="fx-t-sm">V ${nd.V.toFixed(2)}${!last && nd.ex ? " ★" : ""}</text>`;
    }));
    const lab = `<text x="${X(0) - bw / 2}" y="${H - 8}" class="fx-t-sm">${T("今天", "today")}</text><text x="${X(N) + bw / 2}" y="${H - 8}" text-anchor="end" class="fx-t-sm">${T("到期", "expiry")}</text>` +
      (american && type === "put" ? `<text x="${W / 2}" y="${H - 8}" text-anchor="middle" class="fx-t-btc">${T("★ 橙色 = 提前行权节点", "★ orange = early-exercise node")}</text>` : "");
    $("#bt-tree").innerHTML = `<div class="chart" style="overflow-x:auto"><svg viewBox="0 0 ${W} ${H}" role="img" style="min-width:540px">${edges}${nodes}${lab}</svg></div>`;
    const nEx = small.tree.slice(0, N).flat().filter((n) => n.ex).length;
    const items = [
      [T(`${N} 步树价格`, `${N}-step tree price`), "$" + small.price.toFixed(2), "acc"],
      [T("500 步树价格", "500-step tree price"), "$" + big.price.toFixed(2)],
      [T("Black-Scholes（欧式）", "Black-Scholes (European)"), "$" + bs.toFixed(2)],
      [T("树上的 Δ（500 步）", "Tree Δ (500 steps)"), big.delta.toFixed(3)],
    ];
    if (american) items.push([T("提前行权溢价（500 步）", "Early-exercise premium (500 steps)"), "$" + (big.price - bigEu.price).toFixed(2), big.price - bigEu.price > 0.005 ? "pos" : undefined]);
    items.push([T("小树里的提前行权节点", "Early-exercise nodes in the small tree"), String(nEx)]);
    $("#bt-stats").innerHTML = stats(items);
  };
  const run = bindSliders(root, { "bt-s": (x) => "$" + x, "bt-k": (x) => "$" + x, "bt-v": (x) => x + "%", "bt-r": (x) => x + "%", "bt-t": (x) => x + T(" 天", " days") }, draw);
  onSeg(root, "bt-type", (x) => { type = x; run(); });
  onSeg(root, "bt-style", (x) => { american = x === "am"; run(); });
  onSeg(root, "bt-n", (x) => { N = +x; run(); });
}
