// Main demo for lesson insurance-adl: the waterfall after a wave of bankruptcies.
// Bankrupt 10x longs (entry $100,000, bankruptcy $90,000) are sold at a fill price; surplus feeds the insurance fund,
// a hole is paid by the fund, and whatever is left is auto-deleveraged against the top of the short-side queue.
import { slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const P0 = 100000, L = 10, PBK = P0 * (1 - 1 / L);
  // illustrative opposite-side (short) accounts: [name, entry, leverage, size in BTC]
  const SHORTS = [["A", 100000, 20, 150], ["B", 100000, 10, 300], ["C", 92000, 10, 200], ["D", 95000, 5, 400], ["E", 100000, 2, 800], ["F", 86000, 3, 300]];
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("穿仓瀑布模拟器：保证金 → 保险基金 → ADL", "Waterfall simulator: margin → insurance fund → ADL")}</div>
    <div class="demo-grid">
      ${slider("ia-q", T("破产的 10 倍多单（BTC）", "Bankrupt 10× longs (BTC)"), 0, 3000, 50, 1000)}
      ${slider("ia-fill", T("引擎平均成交价", "Engine's average fill price"), 84000, 91000, 100, 88500)}
      ${slider("ia-fund", T("保险基金余额（百万美元）", "Insurance fund balance ($ millions)"), 0, 5, 0.1, 1)}
    </div>
    <div class="demo-math" id="ia-f"></div>
    <div id="ia-bars"></div>
    <div id="ia-stats"></div>
    <div class="demo-label" style="margin-top:10px">${T("对面的空单，按 ADL 分数排队（标记价取成交价）", "The short side, queued by ADL score (mark = fill price)")}</div>
    <div id="ia-queue"></div>
    <p class="demo-tip">${T("试试：把成交价拉到 90,000 以上，保险基金反而变多；再拉回 86,000、把基金调到 0.5 百万，看 ADL 从队首的 20 倍空单一路砍下去，2 倍空单几乎总能幸免。", "Try this: move the fill above $90,000 and the fund grows instead; then drop it to $86,000 with a $0.5M fund and watch ADL work down from the 20× short at the top — the 2× short almost always survives.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const usd = (x) => (x < 0 ? "−$" : "$") + Math.round(Math.abs(x)).toLocaleString("en-US");
  const kf = (x) => Math.round(x).toLocaleString("en-US").replace(/,/g, "{,}");
  const cUsd = (x) => (x < 0 ? "−$" : "$") + (Math.abs(x) >= 1e6 ? (Math.abs(x) / 1e6).toFixed(2) + "M" : Math.round(Math.abs(x) / 1000) + "k");
  const mUsd = (x) => "$" + (x / 1e6).toFixed(2) + "M";
  const bar = (label, val, max, color) => `<div class="bar2"><span class="lab" style="width:190px">${label}</span><span class="track"><span class="fill" style="display:block;width:${max > 0 ? Math.min(100, (val / max) * 100) : 0}%;background:${color}"></span></span><span class="val">${mUsd(val)}</span></div>`;

  bindSliders(root, { "ia-q": (x) => x + " BTC", "ia-fill": (x) => usd(x), "ia-fund": (x) => "$" + (+x).toFixed(1) + "M" }, (v) => {
    const Q = v["ia-q"], fill = v["ia-fill"], I = v["ia-fund"] * 1e6;
    const perBtc = fill - PBK, res = perBtc * Q;                  // Π_IF
    const H = Math.max(0, -res), fundPays = Math.min(H, I), rest = H - fundPays;
    const gap = PBK - fill, qAdl = rest > 0 && gap > 0 ? rest / gap : 0;
    const fundAfter = I + (res > 0 ? res : -fundPays);
    $("#ia-f").innerHTML =
      tex(String.raw`\Pi_{\text{IF}} = (P_{\text{fill}} - P_{\text{bk}})\,Q = (${kf(fill)} - ${kf(PBK)}) \times ${kf(Q)} = ${res < 0 ? "-" : ""}\$${kf(Math.abs(res))}`, true) +
      (H > 0 ? tex(String.raw`\text{${T("基金付", "fund pays")}} = \min(H, I) = ${(fundPays / 1e6).toFixed(2)}\text{M}, \quad q_{\text{ADL}} = \frac{H - I}{P_{\text{bk}} - P_{\text{fill}}} = \frac{${(rest / 1e6).toFixed(2)}\text{M}}{${kf(gap)}} = ${qAdl.toFixed(1)}\ \text{BTC}`, true) : "");
    const margins = Q * (P0 / L);
    const max = Math.max(margins, H, I, 1);
    $("#ia-bars").innerHTML =
      bar(T("① 破产者的保证金（全部亏掉）", "① Bankrupt traders' margin (all lost)"), margins, max, "var(--red)") +
      (res >= 0 ? bar(T("② 流入保险基金的盈余", "② Surplus into the fund"), res, max, "var(--green)")
        : bar(T("② 保险基金付出", "② Paid by the insurance fund"), fundPays, max, "var(--orange)") + bar(T("③ 留给 ADL", "③ Left for ADL"), rest, max, "var(--btc)"));
    $("#ia-stats").innerHTML = stats([
      [T("每 BTC 盈余 / 缺口", "Surplus / hole per BTC"), usd(perBtc), perBtc >= 0 ? "pos" : "neg"],
      [T("缺口总额 H", "Total hole H"), mUsd(H), H ? "neg" : ""],
      [T("事后基金余额", "Fund after the event"), mUsd(fundAfter), "acc"],
      [T("需要 ADL 的 BTC", "BTC to auto-deleverage"), qAdl.toFixed(1), qAdl ? "neg" : ""],
    ]);
    // rank shorts at mark = fill
    const rows = SHORTS.map(([n, e, lev, size]) => {
      const M = (e * size) / lev, u = (e - fill) * size, eq = M + u, notional = fill * size;
      const ratio = u / M, effLev = eq > 0 ? notional / eq : Infinity;
      const score = eq <= 0 ? -Infinity : ratio >= 0 ? ratio * effLev : ratio / effLev;
      return { n, e, lev, size, u, score };
    }).sort((a, b) => b.score - a.score);
    let left = qAdl;
    for (const r of rows) { const take = r.u > 0 ? Math.min(left, r.size) : 0; r.cut = take; left -= take; }
    $("#ia-queue").innerHTML = `<table><thead><tr><th>${T("账户（空单）", "Account (short)")}</th><th>BTC</th><th>${T("浮盈", "uPnL")}</th><th>${T("分数", "Score")}</th><th>${T("被 ADL", "ADL'd")}</th><th>${T("让出的利润", "Profit given up")}</th></tr></thead><tbody>${rows.map((r) => `<tr${r.cut > 0 ? ' class="hl"' : ""}><td style="white-space:nowrap"><b>${r.n}</b> ${r.lev}× @ ${Math.round(r.e / 1000)}k</td><td>${r.size}</td><td style="white-space:nowrap">${cUsd(r.u)}</td><td>${isFinite(r.score) ? r.score.toFixed(2) : "–"}</td><td>${r.cut > 0 ? `<span class="tag bad" style="white-space:nowrap">${r.cut.toFixed(1)} BTC</span>` : `<span class="tag ok">${T("不动", "untouched")}</span>`}</td><td style="white-space:nowrap">${r.cut > 0 ? cUsd(r.cut * gap) : "–"}</td></tr>`).join("")}</tbody></table>` +
      (left > 0.05 ? `<p class="demo-warn">${T("赢家一方的队列也不够用了：剩下的部分在有的设计里会被社会化分摊。", "Even the winning side's queue is exhausted: some designs would socialize the rest.")}</p>` : "");
  });
}
