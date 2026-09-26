// Main demo for lesson option-chain: an interactive XYZ option chain priced with Black-Scholes,
// quoted with realistic tick sizes and spreads; click a strike for the row's details and a live parity check.
import * as O from "./_opt.js";
import { seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

const r = 0.04;
// Penny Interval Program: $0.01 below $3.00, $0.05 at or above $3.00
const tickOf = (p) => (p < 3 ? 0.01 : 0.05);
function quote(theo, liq = 1) {
  const tick = tickOf(theo);
  const center = Math.round(theo / tick) * tick;
  const w = 2 * tick * Math.max(1, Math.round(((0.01 + 0.02 * theo) * liq) / (2 * tick)));
  let bid = center - w / 2, ask = center + w / 2;
  if (bid < 0.005) { bid = 0; ask = Math.max(ask, 0.02); }
  return { bid: Math.round(bid * 100) / 100, ask: Math.round(ask * 100) / 100 };
}
// deterministic illustrative open interest / volume (bigger near the money, calls heavier above, puts below)
function flow(K, S, type) {
  const d = (K - S) / 5;
  const side = type === "call" ? Math.exp(-((d - 0.8) ** 2) / 3) : Math.exp(-((d + 0.8) ** 2) / 3);
  const oi = Math.round((400 + 11000 * side) / 10) * 10;
  return { oi, vol: Math.round(oi * (0.12 + 0.25 * Math.exp(-(d * d) / 2))) };
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let days = 30, skew = "flat", sel = 100;
  const STRIKES = [90, 92.5, 95, 97.5, 100, 102.5, 105, 107.5, 110];
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("XYZ 期权链：点一个行权价看细节", "The XYZ option chain: click a strike for details")}</div>
    <div class="demo-row">
      <div><div class="demo-label">${T("到期", "Expiry")}</div>${seg("oc-days", [["7", T("7 天", "7 days")], ["30", T("30 天", "30 days")], ["60", T("60 天", "60 days")]], "30")}</div>
      <div><div class="demo-label">${T("波动率形状", "Vol shape")}</div>${seg("oc-skew", [["flat", T("一刀切 20%", "Flat 20%")], ["skew", T("股票式偏斜", "Equity skew")]], "flat")}</div>
    </div>
    <div class="demo-grid">
      ${slider("oc-s", T("XYZ 现价 S", "XYZ price S"), 90, 110, 0.5, 100)}
      ${slider("oc-v", T("平值隐含波动率", "At-the-money IV"), 10, 60, 1, 20)}
    </div>
    <div id="oc-table"></div>
    <div id="oc-detail"></div>
    <p class="demo-tip">${T("试试：把 S 拉到 104，看阴影（实值）和高亮（最接近平值）怎样移动；切到 60 天，每个价格都变高、平值跨式约变成 30 天的 √2 倍；打开“股票式偏斜”，低行权价看跌的 IV 高于高行权价看涨，但每一行的平价关系照样成立。",
      "Try this: drag S to 104 and watch the shading (in the money) and the highlight (nearest the money) move; switch to 60 days and every price rises, the ATM straddle growing by about √2; turn on equity skew and low-strike puts carry a higher IV than high-strike calls, yet parity still holds on every row.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  let S = 100, atmVol = 0.2;

  const volAt = (K, Tm) => {
    if (skew === "flat") return atmVol;
    const F = O.forward(S, Tm, r), k = Math.log(K / F) / Math.sqrt(Tm / (30 / 365));
    return Math.max(0.05, atmVol * (1 - 1.4 * k + 3 * k * k));
  };
  const row = (K) => {
    const Tm = days / 365, F = O.forward(S, Tm, r), sigma = volAt(K, Tm), liq = 1 + Math.abs(Math.log(K / F));
    const out = {};
    for (const type of ["call", "put"]) {
      const g = O.greeks({ S, K, T: Tm, r, sigma, type });
      const q = quote(g.price, liq), mid = (q.bid + q.ask) / 2;
      const iv = O.impliedVol(mid, { S, K, T: Tm, r, type });
      out[type] = { ...q, mid, theo: g.price, delta: g.delta, iv, ...flow(K, S, type) };
    }
    return out;
  };

  const draw = () => {
    const nearest = STRIKES.reduce((a, b) => (Math.abs(b - S) < Math.abs(a - S) ? b : a));
    const ivTxt = (x) => (isFinite(x) ? (x * 100).toFixed(1) + "%" : "—");
    const narrow = (root.clientWidth || 999) < 560; // phones: drop the IV columns (IV is still in the details below)
    const ivH = narrow ? "" : "<th>IV</th>", ivC = (x, st) => (narrow ? "" : `<td${st}>${ivTxt(x)}</td>`);
    const sg = (x) => x.toFixed(2).replace("-", "−");
    let h = `<table><thead><tr><th>${T("看涨 买价", "Call bid")}</th><th>${T("卖价", "Ask")}</th><th>Δ</th>${ivH}<th style="text-align:center">${T("行权价", "Strike")}</th><th>${T("看跌 买价", "Put bid")}</th><th>${T("卖价", "Ask")}</th><th>Δ</th>${ivH}</tr></thead><tbody>`;
    for (const K of STRIKES) {
      const q = row(K);
      const cls = K === nearest ? "hl" : "";
      const cItm = K < S ? ' style="background:var(--blue-soft)"' : "", pItm = K > S ? ' style="background:var(--blue-soft)"' : "";
      h += `<tr class="${cls}"><td${cItm}>${q.call.bid.toFixed(2)}</td><td${cItm}>${q.call.ask.toFixed(2)}</td><td${cItm}>${sg(q.call.delta)}</td>${ivC(q.call.iv, cItm)}
        <td style="text-align:center"><button type="button" class="demo-btn${K === sel ? " on" : ""}" data-k="${K}" style="min-height:30px;padding:4px 10px">${K}</button></td>
        <td${pItm}>${q.put.bid.toFixed(2)}</td><td${pItm}>${q.put.ask.toFixed(2)}</td><td${pItm}>${sg(q.put.delta)}</td>${ivC(q.put.iv, pItm)}</tr>`;
    }
    h += `</tbody></table><p class="demo-meta">${T(`现价 ${S.toFixed(1)} · ${days} 天 · r = 4% · 蓝底 = 实值 · 高亮行 = 最接近平值 · 价格为每股，一张合约 × 100 · IV 由每个中间价反推，报价按最小价位取整，所以会偏离设定值零点几个百分点`, `Spot ${S.toFixed(1)} · ${days} days · r = 4% · blue cells = in the money · highlighted row = nearest the money · prices per share, × 100 per contract · IV is backed out of each mid, and rounding quotes to the tick nudges it a few tenths away from the setting`)}</p>`;
    $("#oc-table").innerHTML = h;
    if (narrow) $("#oc-table").querySelectorAll("th, td, button").forEach((c) => { c.style.paddingLeft = "4px"; c.style.paddingRight = "4px"; });
    root.querySelectorAll("[data-k]").forEach((b) => b.addEventListener("click", () => { sel = +b.dataset.k; draw(); }));
    detail(nearest);
  };

  const detail = (nearest) => {
    const K = sel, Tm = days / 365, q = row(K), c = q.call, p = q.put;
    const pvK = K * Math.exp(-r * Tm), lhs = c.mid - p.mid, rhs = S - pvK;
    const a = row(nearest), straddle = a.call.mid + a.put.mid, em = O.expectedMove(S, atmVol, Tm);
    const pct = (x) => (x * 100).toFixed(1) + "%";
    const side = (o, name, type) => `<div class="cmp-cell"><h5>${name} K = ${K}</h5><div class="kv">
      <span class="k">${T("买价 / 卖价", "Bid / ask")}</span><span class="v">${o.bid.toFixed(2)} / ${o.ask.toFixed(2)}</span>
      <span class="k">${T("中间价", "Mid")}</span><span class="v hl">${o.mid.toFixed(3)}</span>
      <span class="k">${T("价差（占中间价）", "Spread (% of mid)")}</span><span class="v">${(o.ask - o.bid).toFixed(2)} (${o.mid > 0 ? pct((o.ask - o.bid) / o.mid) : "—"})</span>
      <span class="k">${T("买一张（按卖价）", "Buy 1 at the ask")}</span><span class="v">$${(o.ask * 100).toFixed(0)}</span>
      <span class="k">${T("到期盈亏平衡", "Breakeven at expiry")}</span><span class="v">${(type === "call" ? K + o.ask : K - o.ask).toFixed(2)}</span>
      <span class="k">Δ · IV</span><span class="v">${o.delta.toFixed(3).replace("-", "−")} · ${isFinite(o.iv) ? pct(o.iv) : "—"}</span>
      <span class="k">${T("未平仓量 · 今日成交", "Open interest · volume")}</span><span class="v">${o.oi.toLocaleString("en-US")} · ${o.vol.toLocaleString("en-US")}</span>
    </div></div>`;
    $("#oc-detail").innerHTML = `<div class="cmp">${side(c, T("看涨", "Call"), "call")}${side(p, T("看跌", "Put"), "put")}</div>
      <div class="demo-math">${tex(String.raw`\underbrace{C - P}_{\text{${T("中间价", "mids")}}} = ${c.mid.toFixed(3)} - ${p.mid.toFixed(3)} = ${lhs.toFixed(3)} \quad\text{vs}\quad S - Ke^{-rT} = ${S.toFixed(2)} - ${pvK.toFixed(2)} = ${rhs.toFixed(3)}`, true)}</div>
      ${stats([
        [T("平价偏差", "Parity gap"), (lhs - rhs >= 0 ? "+" : "−") + Math.abs(lhs - rhs).toFixed(3), Math.abs(lhs - rhs) <= (c.ask - c.bid + p.ask - p.bid) / 2 ? "pos" : "neg"],
        [T(`平值跨式（K = ${nearest}）`, `ATM straddle (K = ${nearest})`), "$" + straddle.toFixed(2), "acc"],
        [T("隐含波动幅度", "Implied move"), "±" + ((straddle / S) * 100).toFixed(1) + "%"],
        [T("1σ 波动幅度", "1σ move"), "$" + em.toFixed(2)],
      ])}
      <div class="demo-math">${tex(String.raw`C_{\text{ATM}} + P_{\text{ATM}} = ${straddle.toFixed(2)} \approx 0.8\,S\sigma\sqrt{T} = 0.8 \times ${em.toFixed(2)} = ${(0.8 * em).toFixed(2)}`, true)}</div>`;
  };

  const run = bindSliders(root, { "oc-s": (x) => "$" + (+x).toFixed(1), "oc-v": (x) => x + "%" }, (v) => { S = v["oc-s"]; atmVol = v["oc-v"] / 100; draw(); });
  onSeg(root, "oc-days", (v) => { days = +v; run(); });
  onSeg(root, "oc-skew", (v) => { skew = v; run(); });
}
