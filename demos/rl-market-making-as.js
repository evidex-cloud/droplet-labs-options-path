// Inline demo for lesson rl-market-making: the two classic baselines RL is measured against.
// Tab 1 — Avellaneda–Stoikov quotes: reservation price and optimal spread as inventory, time and risk aversion change.
// Tab 2 — Almgren–Chriss execution: the optimal selling schedule versus TWAP as risk aversion changes.
import { asQuotes, MM } from "./rl-market-making.js";
import { lineChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

// Almgren–Chriss (temporary impact only): sell X shares over N intervals of length tau.
export function acSchedule({ X = 50000, N = 10, Tdays = 1, sigma = 1.26, eta = 2e-6, lambda = 1e-6 }) {
  const tau = Tdays / N, kt2 = (lambda * sigma * sigma) / eta;
  const kappa = kt2 > 0 ? Math.acosh(1 + (kt2 * tau * tau) / 2) / tau : 0;
  const x = [];
  for (let j = 0; j <= N; j++) { const t = j * tau; x.push(kappa > 1e-9 ? (X * Math.sinh(kappa * (Tdays - t))) / Math.sinh(kappa * Tdays) : X * (1 - t / Tdays)); }
  let E = 0, V = 0;
  for (let j = 1; j <= N; j++) { const n = x[j - 1] - x[j]; E += (eta * n * n) / tau; V += sigma * sigma * tau * x[j] * x[j]; }
  return { x, E, sd: Math.sqrt(V), kappa };
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let tab = "as";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("两条经典基准：做市报价与最优执行", "The two classic baselines: quoting and optimal execution")}</div>
    ${seg("rla-tab", [["as", T("Avellaneda–Stoikov 报价", "Avellaneda–Stoikov quotes")], ["ac", T("Almgren–Chriss 执行", "Almgren–Chriss execution")]], "as")}
    <div id="rla-as">
      <div class="demo-grid">
        ${slider("rla-q", T("库存 q（股）", "Inventory q (shares)"), -5, 5, 1, 2)}
        ${slider("rla-t", T("剩余时间 (T − t)/T", "Time left (T − t)/T"), 0, 1, 0.05, 1)}
        ${slider("rla-g", T("风险厌恶 γ", "Risk aversion γ"), 0.01, 0.5, 0.01, 0.1)}
      </div>
      <div id="rla-ladder"></div><div class="demo-math" id="rla-asf"></div>
    </div>
    <div id="rla-ac" hidden>
      <div class="demo-grid">${slider("rla-l", T("风险厌恶 λ（对数刻度）", "Risk aversion λ (log scale)"), -8, -4, 0.25, -5)}</div>
      <div id="rla-acchart"></div><div id="rla-acstats"></div><div class="demo-math" id="rla-acf"></div>
    </div>
    <p class="demo-tip">${T("看什么：AS 里库存一多，两个报价一起往下挪——更想卖、不太想买；离收盘越近，挪得越少。AC 里风险厌恶越大，越早卖得越多：冲击成本上升，价格风险下降。", "What to notice: in AS, a long inventory shifts both quotes down — keener to sell, less keen to buy — and the shift shrinks as the close nears. In AC, more risk aversion means selling more, earlier: impact cost rises, price risk falls.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const drawAS = (v) => {
    const q = v["rla-q"], tl = v["rla-t"], g = v["rla-g"], s2 = MM.sigma ** 2, k = MM.k;
    const res = -q * g * s2 * tl, half = 0.5 * g * s2 * tl + (1 / g) * Math.log(1 + g / k);
    const bid = 100 + res - half, ask = 100 + res + half;
    // price ladder: range adapts to the quotes; bid/ask labels above the axis, mid and reservation below, on separate rows
    const lo = Math.floor(Math.min(97, bid - 0.6)), hi = Math.ceil(Math.max(103, ask + 0.6)), W = 460, H = 150, X = (p) => 24 + ((p - lo) / (hi - lo)) * (W - 48);
    const ticks = []; for (let p = lo; p <= hi; p += Math.max(1, Math.round((hi - lo) / 6))) ticks.push(p);
    const line = (p, cls, dash) => `<line x1="${X(p).toFixed(1)}" y1="42" x2="${X(p).toFixed(1)}" y2="86" class="${cls}"${dash ? ' stroke-dasharray="4 3"' : ""} stroke-width="2.5"/>`;
    const lab = (p, text, y, cls = "lbl") => `<text x="${X(p).toFixed(1)}" y="${y}" text-anchor="middle" class="${cls}">${text}</text>`;
    const f2 = (p) => p.toFixed(2);
    $("#rla-ladder").innerHTML = `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${T("报价阶梯", "Quote ladder")}"><line x1="24" y1="64" x2="${W - 24}" y2="64" class="axis"/>`
      + ticks.map((p) => lab(p, p, H - 4, "lbl-axis")).join("")
      + line(100, "marker", true) + line(100 + res, "s1") + line(bid, "s3") + line(ask, "s2")
      + lab(bid, T("买价 ", "bid ") + f2(bid), 30) + lab(ask, T("卖价 ", "ask ") + f2(ask), 30)
      + lab(100, T("中间价 100", "mid 100"), 104) + lab(100 + res, T("保留价 ", "reservation ") + f2(100 + res), 122) + `</svg></div>`;
    $("#rla-asf").innerHTML = tex(String.raw`\begin{aligned} r &= s - q\gamma\sigma^2(T-t) \\ &= 100 - (${q})(${g.toFixed(2)})(4)(${tl.toFixed(2)}) = ${(100 + res).toFixed(2)} \end{aligned}`, true)
      + tex(String.raw`\begin{aligned} \delta^a + \delta^b &= \gamma\sigma^2(T-t) + \tfrac{2}{\gamma}\ln\!\Big(1 + \tfrac{\gamma}{k}\Big) \\ &= ${(g * s2 * tl).toFixed(3)} + ${((2 / g) * Math.log(1 + g / k)).toFixed(3)} = ${(2 * half).toFixed(3)} \end{aligned}`, true);
  };
  const drawAC = (v) => {
    const lambda = 10 ** v["rla-l"], ac = acSchedule({ lambda }), tw = acSchedule({ lambda: 0 });
    $("#rla-acchart").innerHTML = lineChart({
      series: [{ points: tw.x.map((x, j) => [j, x]), cls: 5, dashed: true, label: T("平均分配（TWAP）", "Even split (TWAP)") }, { points: ac.x.map((x, j) => [j, x]), cls: 0, dots: true, label: T("Almgren–Chriss 最优", "Almgren–Chriss optimal") }],
      xmin: 0, xmax: 10, ymin: 0, ymax: 52000, xlabel: T("时段（一天分 10 段）", "Interval (one day in 10 slices)"), ylabel: T("尚未卖出的股数", "Shares still to sell"), H: 230, yfmt: (y) => (y / 1000).toFixed(0) + "k",
    });
    const usd = (x) => "$" + Math.round(x).toLocaleString("en-US");
    $("#rla-acstats").innerHTML = stats([
      [T("预期冲击成本", "Expected impact cost"), usd(ac.E), "neg"],
      [T("收入的标准差（价格风险）", "Std. dev. of proceeds (price risk)"), usd(ac.sd)],
      ["TWAP " + T("成本 / 标准差", "cost / std. dev."), usd(tw.E) + " / " + usd(tw.sd)],
      [T("一次性全卖的成本", "Cost of selling it all at once"), usd((2e-6 * 50000 * 50000) / 0.1), "neg"],
    ]);
    $("#rla-acf").innerHTML = tex(String.raw`x_j = X\,\frac{\sinh\!\big(\kappa(T - t_j)\big)}{\sinh(\kappa T)}, \qquad \kappa \approx \sqrt{\lambda\sigma^2/\eta} = ${ac.kappa.toFixed(2)}\ \text{${T("（每天）", "per day")}}, \quad \lambda = 10^{${v["rla-l"].toFixed(2)}}`, true);
  };
  const runAS = bindSliders(root, { "rla-q": (x) => x, "rla-t": (x) => (+x).toFixed(2), "rla-g": (x) => (+x).toFixed(2) }, drawAS);
  const runAC = bindSliders(root, { "rla-l": (x) => "10^" + x }, drawAC);
  onSeg(root, "rla-tab", (v) => { tab = v; $("#rla-as").hidden = tab !== "as"; $("#rla-ac").hidden = tab !== "ac"; (tab === "as" ? runAS : runAC)(); });
}
