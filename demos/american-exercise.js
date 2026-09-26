// Main demo for lesson american-exercise: the early-exercise boundary S*(t) and the early-exercise premium.
// Prices come from the engine (binomial American tree, Black-Scholes European). The boundary is traced on a fixed
// log-price trinomial lattice (implemented locally): unlike a binomial tree started at today's spot, it has nodes at
// every price level at every date, so the frontier between "exercise" and "hold" can be read at every time step.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

// Trinomial lattice in x = ln S (Hull's parameters, Δx = σ√(3Δt)); returns boundary per step and V(S) today.
function lattice({ S, K, T, r, q, sigma, type, n = 1200 }) {
  const dt = T / n, dx = sigma * Math.sqrt(3 * dt), nu = r - q - 0.5 * sigma * sigma;
  const pu = Math.sqrt(dt / (12 * sigma * sigma)) * nu + 1 / 6, pd = -Math.sqrt(dt / (12 * sigma * sigma)) * nu + 1 / 6, pm = 2 / 3;
  const disc = Math.exp(-r * dt);
  const half = Math.max(5 * sigma * Math.sqrt(T), Math.abs(Math.log(S / K)) + 3 * sigma * Math.sqrt(T));
  const J = Math.ceil((2 * half) / dx), x0 = Math.log(K) - half;
  const Sx = Array.from({ length: J + 1 }, (_, j) => Math.exp(x0 + j * dx));
  const pay = (s) => (type === "put" ? Math.max(K - s, 0) : Math.max(s - K, 0));
  let V = Sx.map(pay);
  const bd = []; // [tau, S*]
  for (let k = 1; k <= n; k++) {
    const tau = k * dt, W = new Array(J + 1), gap = new Array(J + 1);
    for (let j = 1; j < J; j++) {
      const cont = disc * (pu * V[j + 1] + pm * V[j] + pd * V[j - 1]);
      gap[j] = cont - pay(Sx[j]);
      W[j] = Math.max(cont, pay(Sx[j]));
    }
    if (type === "put") { W[0] = Math.max(pay(Sx[0]), K * Math.exp(-r * tau) - Sx[0] * Math.exp(-q * tau)); W[J] = 0; }
    else { W[0] = 0; W[J] = Math.max(pay(Sx[J]), Sx[J] * Math.exp(-q * tau) - K * Math.exp(-r * tau)); }
    // locate the sign change of (continuation − exercise) among in-the-money nodes and interpolate
    let s = null;
    if (type === "put") {
      for (let j = 1; j < J; j++) if (Sx[j] < K && gap[j] <= 0 && gap[j + 1] > 0 && Sx[j + 1] <= K) { const w = -gap[j] / (gap[j + 1] - gap[j]); s = Math.exp(Math.log(Sx[j]) + w * dx); }
    } else {
      for (let j = J - 1; j > 1; j--) if (Sx[j] > K && gap[j] <= 0 && gap[j - 1] > 0 && Sx[j - 1] >= K) { const w = -gap[j] / (gap[j - 1] - gap[j]); s = Math.exp(Math.log(Sx[j]) - w * dx); }
    }
    if (s !== null) bd.push([tau, s]);
    V = W;
  }
  return { bd, Sx, V };
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const K = 100;
  let type = "put";

  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("提前行权边界：什么时候该提前", "The early-exercise boundary: when to go early")}</div>
    <div class="demo-row">${seg("am-type", [["put", T("美式看跌", "American put")], ["call", T("美式看涨", "American call")]], type)}
      <div class="demo-btns" style="margin:0"><button class="demo-btn" data-preset="xyz">${T("小凯的 1 年期看跌", "Kai's 1-year put")}</button><button class="demo-btn" data-preset="div">${T("高股息看涨", "High-dividend call")}</button></div></div>
    <div class="demo-grid">
      ${slider("am-s", T("现价 S", "Spot S"), 60, 140, 1, 100)}
      ${slider("am-v", T("波动率 σ", "Volatility σ"), 10, 60, 1, 20)}
      ${slider("am-r", T("无风险利率 r", "Risk-free rate r"), 0, 10, 0.25, 4)}
      ${slider("am-q", T("股息率 q", "Dividend yield q"), 0, 10, 0.25, 0)}
      ${slider("am-t", T("到期天数", "Days to expiry"), 30, 730, 5, 365)}
    </div>
    <div class="demo-math" id="am-f"></div>
    <div id="am-stats"></div>
    <p class="demo-meta" id="am-note"></p>
    <div id="am-bd"></div>
    <div id="am-val"></div>
    <p class="demo-tip">${T("试试：把利率 r 调到 0，看跌期权的边界整条消失——没有利息可赚，就永远不该提前行权。再切到看涨期权：股息率为 0 时同样没有边界；一加股息，边界就从高处出现：股息率 2% 时远在 200 美元上方，股息率超过 4% 的利率后，临近到期时一路降到行权价。", "Try this: set r to 0 and the put's boundary disappears entirely — with no interest to earn, early exercise never pays. Switch to the call: with no dividend there is no boundary either; add a dividend and a boundary appears from above — far away (above $200) at a 2% yield, reaching down to the strike near expiry once the yield beats the 4% rate.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);

  function draw(v) {
    const S = v["am-s"], sigma = v["am-v"] / 100, r = v["am-r"] / 100, q = v["am-q"] / 100, Tm = v["am-t"] / 365;
    const o = { S, K, T: Tm, r, q, sigma, type };
    const eu = O.bsPrice(o), am = O.binomial({ ...o, steps: 800, american: true }).price, eep = am - eu;
    const lat = lattice({ ...o, n: 1500 });
    const sStar = lat.bd.length ? lat.bd[lat.bd.length - 1][1] : null;
    const bdToday = lat.bd.length && Math.abs(lat.bd[lat.bd.length - 1][0] - Tm) < Tm * 0.02 ? sStar : null;
    const ex = O.intrinsic(type, S, K);
    const exerciseNow = type === "put" ? bdToday !== null && S <= bdToday : bdToday !== null && S >= bdToday;
    // one-node view: exercise now vs continuation (tree root)
    const cont = exerciseNow ? null : am;
    const holdTxt = exerciseNow ? "< " + ex.toFixed(2) : cont.toFixed(2);
    $("#am-f").innerHTML = tex(String.raw`V_{\text{Am}} = \max\!\Big(\underbrace{${ex.toFixed(2)}}_{\text{${T("立即行权", "exercise now")}}},\ \underbrace{${holdTxt}}_{\text{${T("继续持有", "hold")}}}\Big) = ${am.toFixed(2)}`, true) + tex(String.raw`V_{\text{Am}} - V_{\text{Eu}} = ${am.toFixed(2)} - ${eu.toFixed(2)} = ${eep.toFixed(2)}`, true);
    const items = [
      [T("欧式（BS）", "European (BS)"), "$" + eu.toFixed(2)],
      [T("美式（二叉树 800 步）", "American (tree, 800 steps)"), "$" + am.toFixed(2), "acc"],
      [T(`提前行权溢价（每张 $${(eep * 100).toFixed(0)}）`, `Early-exercise premium ($${(eep * 100).toFixed(0)} per contract)`), "$" + eep.toFixed(2)],
      [T("今天的边界 S*", "Boundary S* today"), bdToday !== null ? "$" + bdToday.toFixed(2) : T("无", "none")],
      [T("决定", "Decision"), exerciseNow ? T("现在行权", "exercise now") : T("继续持有", "hold"), exerciseNow ? "neg" : "pos"],
    ];
    $("#am-stats").innerHTML = stats(items);
    let note = "";
    if (type === "put") {
      const interest = K * (1 - Math.exp(-r * Tm)), callIn = O.bsPrice({ ...o, type: "call" });
      note = T(`粗略检验：行权能早拿到行权价，利息约 ${interest.toFixed(2)}；放弃的是看跌期权里“藏着的看涨期权”（欧式看涨价 ${callIn.toFixed(2)}）。利息更大时倾向行权——真实边界更低，因为继续持有还保留了以后再行权的权利。`, `Rough check: exercising brings the strike forward, worth about ${interest.toFixed(2)} of interest; it gives up the call hidden inside the put (European call ${callIn.toFixed(2)}). Exercise is tempting when the interest is larger — the true boundary is lower, because holding also keeps the right to exercise later.`);
      if (r === 0) note = T("r = 0：早拿行权价没有利息可赚，美式看跌 = 欧式看跌，没有边界。", "r = 0: receiving the strike early earns no interest, so the American put equals the European put and there is no boundary.");
    } else {
      note = q === 0 ? T("不分红的看涨期权永远不该提前行权：", "A call on a non-dividend stock should never be exercised early: ") + tex(String.raw`C \ge S - Ke^{-rT} > S - K`) + T("，卖掉比行权更值钱。美式 = 欧式。", ", so selling beats exercising. American = European.")
        : T(`行权能拿到股票和它的股息（股息率 ${(q * 100).toFixed(2)}%），代价是提前付出行权价、放弃保护。股息够高时，深度实值的看涨期权值得提前行权。`, `Exercising captures the stock and its dividends (yield ${(q * 100).toFixed(2)}%) at the cost of paying the strike early and giving up protection. When dividends are high enough, deep in-the-money calls are worth exercising early.`);
    }
    $("#am-note").innerHTML = note;
    // boundary chart over calendar time (days from today)
    const days = Tm * 365;
    const pts = lat.bd.map(([tau, s]) => [days - tau * 365, s]).sort((a, b) => a[0] - b[0]);
    const ylo = type === "put" ? Math.max(0, Math.min(60, ...pts.map((p) => p[1])) - 5) : 90, yhi = type === "put" ? 105 : Math.max(140, ...pts.map((p) => p[1]).filter((x) => x < 400)) + 5;
    $("#am-bd").innerHTML = lineChart({
      xmin: 0, xmax: days, ymin: ylo, ymax: Math.min(yhi, 300), H: 250,
      xlabel: T("从今天起的天数（右端 = 到期）", "Days from today (right end = expiry)"), ylabel: T("股价", "Stock price"),
      series: [
        { points: pts, cls: 0, area: type === "put", label: type === "put" ? T("边界 S*(t)，下方 = 立即行权", "Boundary S*(t); below it: exercise") : T("边界 S*(t)，上方 = 立即行权", "Boundary S*(t); above it: exercise") },
      ],
      hlines: Math.abs(S - K) < 4 ? [{ y: K, label: T("K = 100 = 今天的现价", "K = 100 = spot today") }] : [{ y: K, label: "K = 100" }, { y: S, label: T("今天的现价", "spot today") }],
    });
    // value today across spot (lattice) vs European and payoff
    const lo = type === "put" ? 50 : 70, hi = type === "put" ? 130 : 160;
    const curve = lat.Sx.map((s, j) => [s, lat.V[j]]).filter(([s]) => s >= lo && s <= hi);
    $("#am-val").innerHTML = lineChart({
      xmin: lo, xmax: hi, H: 250, xlabel: T("现价 S", "Spot S"), ylabel: T("今天的价值", "Value today"),
      series: [
        { f: (x) => O.intrinsic(type, x, K), cls: 5, dashed: true, label: T("立即行权价值", "Exercise value") },
        { f: (x) => O.bsPrice({ ...o, S: x }), cls: 1, label: T("欧式", "European") },
        { points: curve, cls: 0, label: T("美式", "American") },
      ],
      markers: bdToday !== null ? [{ x: bdToday, label: "S*" }] : [],
      points: [{ x: S, y: am, cls: 0 }],
    });
  }

  const run = bindSliders(root, { "am-s": (x) => "$" + x, "am-v": (x) => x + "%", "am-r": (x) => x + "%", "am-q": (x) => x + "%", "am-t": (x) => x + T(" 天", " days") }, draw);
  onSeg(root, "am-type", (v) => { type = v; run(); });
  const set = (vals) => { for (const [id, x] of Object.entries(vals)) $("#" + id).value = x; run(); };
  root.querySelectorAll("[data-preset]").forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.preset === "div") {
      type = "call"; root.querySelectorAll('[data-seg="am-type"] button').forEach((x) => x.classList.toggle("on", x.dataset.v === "call"));
      set({ "am-s": 120, "am-v": 20, "am-r": 4, "am-q": 8, "am-t": 365 });
    } else {
      type = "put"; root.querySelectorAll('[data-seg="am-type"] button').forEach((x) => x.classList.toggle("on", x.dataset.v === "put"));
      set({ "am-s": 100, "am-v": 20, "am-r": 4, "am-q": 0, "am-t": 365 });
    }
  }));
}
