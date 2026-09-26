// Inline demo for lesson market-makers: inventory skews the quotes (Avellaneda–Stoikov reservation price, illustrative units).
import * as O from "./_opt.js";
import { slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const s = O.bsPrice({ S: 100, K: 100, T: 30 / 365, r: 0.04, sigma: 0.2, type: "call" }); // 2.45
  const h = 0.05;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("库存把报价推歪：保留价", "Inventory tilts the quote: the reservation price")}</div>
    <div class="demo-grid">
      ${slider("mmq-q", T("库存 q（合约，正 = 多头）", "Inventory q (contracts, + = long)"), -20, 20, 2, 10)}
      ${slider("mmq-g", T("风险厌恶 γ", "Risk aversion γ"), 0, 0.1, 0.01, 0.05)}
      ${slider("mmq-s", T("期权价格的波动 σ（美元/√天）", "Option-price volatility σ ($ per √day)"), 0.1, 0.6, 0.05, 0.4)}
      ${slider("mmq-t", T("剩余时间 T − t（天）", "Time left T − t (days)"), 0.25, 2, 0.25, 1)}
    </div>
    <div class="demo-math" id="mmq-f"></div>
    <div id="mmq-svg"></div>
    <div id="mmq-stats"></div>
    <p class="demo-tip">${T("看什么：多头库存越大，整组报价越往下挪，卖价甚至低于原来的中间价——做市商在“打折清仓”。把 q 拉成负数，报价往上挪，去吸引卖家。", "What to notice: the longer the inventory, the further the whole quote slides down; the ask can drop below the old mid — the dealer is running a clearance sale. Make q negative and the quote slides up to attract sellers.")}</p>
  </div>`;
  const $ = (x) => root.querySelector(x);
  const opt = { S: 100, K: 100, T: 30 / 365, r: 0.04, type: "call" };
  bindSliders(root, { "mmq-q": (x) => (x > 0 ? "+" : "") + x, "mmq-g": (x) => (+x).toFixed(2), "mmq-s": (x) => "$" + (+x).toFixed(2), "mmq-t": (x) => x }, (v) => {
    const q = v["mmq-q"], g = v["mmq-g"], sg = v["mmq-s"], tau = v["mmq-t"];
    const shift = q * g * sg * sg * tau, res = s - shift, bid = res - h, ask = res + h;
    $("#mmq-f").innerHTML = tex(String.raw`\begin{aligned} r &= s - q\gamma\sigma^2(T-t) \\ &= ${s.toFixed(2)} - (${q})(${g.toFixed(2)})(${sg.toFixed(2)})^2(${tau}) = ${res.toFixed(3)} \end{aligned}`, true)
      + tex(String.raw`\text{${T("报价", "quotes")}}: ${bid.toFixed(2)}\ /\ ${ask.toFixed(2)}\qquad (r \mp ${h.toFixed(2)})`, true);
    // price ladder: old quote vs skewed quote
    // the price range adapts to the quotes, so the ladder stays readable at every slider setting
    const W = 460, H = 230, top = 34, bot = H - 14;
    let lo = Math.min(bid, s - h), hi = Math.max(ask, s + h);
    const pad = Math.max(0.05, (hi - lo) * 0.2); lo -= pad; hi += pad;
    const Y = (p) => top + ((hi - p) / (hi - lo)) * (bot - top);
    const step = [0.02, 0.05, 0.1, 0.2, 0.25, 0.5, 1].find((st) => (hi - lo) / st <= 7) || 1;
    let axis = `<line x1="46" y1="${top}" x2="46" y2="${bot}" class="fx-axis"/>`;
    for (let p = Math.ceil(lo / step) * step; p <= hi + 1e-9; p += step) {
      axis += `<line x1="42" y1="${Y(p)}" x2="46" y2="${Y(p)}" class="fx-axis"/><text x="38" y="${Y(p) + 4}" text-anchor="end" class="fx-t-sm">${p.toFixed(2)}</text>`;
    }
    const col = (x, b, m, a, title, cls) => {
      let ya = Y(a), yb = Y(b);
      if (yb - ya < 16) { const mid = (ya + yb) / 2; ya = mid - 8; yb = mid + 8; } // keep the two labels apart
      return `<text x="${x}" y="16" text-anchor="middle" class="fx-t-b">${title}</text>
      <rect x="${x - 45}" y="${Y(a)}" width="90" height="${Math.max(2, Y(b) - Y(a))}" rx="4" class="${cls}"/>
      <line x1="${x - 52}" y1="${Y(m)}" x2="${x + 52}" y2="${Y(m)}" class="fx-line fx-dash"/>
      <text x="${x + 52}" y="${ya + 4}" class="fx-t-sm">${T("卖", "ask")} ${a.toFixed(2)}</text>
      <text x="${x + 52}" y="${yb + 4}" class="fx-t-sm">${T("买", "bid")} ${b.toFixed(2)}</text>`;
    };
    $("#mmq-svg").innerHTML = `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${T("报价梯", "quote ladder")}">${axis}
      <line x1="46" y1="${Y(s)}" x2="${W - 6}" y2="${Y(s)}" class="fx-line-hl fx-dash"/>
      <text x="${W - 6}" y="${Y(s) - 5}" text-anchor="end" class="fx-t-hl">${T("理论价", "theo")} ${s.toFixed(2)}</text>
      ${col(165, s - h, s, s + h, T("库存为 0", "Flat inventory"), "fx-box2")}
      ${col(330, bid, res, ask, T("现在（中线 = r）", "Now (mid = r)"), q > 0 ? "fx-bad" : q < 0 ? "fx-ok" : "fx-hl")}</svg></div>`;
    const ivb = O.impliedVol(bid, opt), iva = O.impliedVol(ask, opt);
    const ivs = (x) => (isFinite(x) ? (x * 100).toFixed(1) + "%" : "–");
    $("#mmq-stats").innerHTML = stats([
      [T("报价整体平移", "Whole quote shifts by"), (shift > 0 ? "−" : "+") + "$" + Math.abs(shift).toFixed(3), shift > 0 ? "neg" : shift < 0 ? "pos" : ""],
      [T("用波动率报价", "Quoted in vol"), ivs(ivb) + " / " + ivs(iva), "acc"],
      [T("更可能成交的一侧", "Side more likely to trade"), q > 0 ? T("客户买入（做市商卖出，库存下降）", "customers buy (desk sells, inventory falls)") : q < 0 ? T("客户卖出（做市商买入，库存回升）", "customers sell (desk buys, inventory rises)") : T("两侧一样", "both sides equally")],
    ]);
  });
}
