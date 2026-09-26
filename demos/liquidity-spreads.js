// Main demo for lesson liquidity-spreads: what the bid-ask spread costs on a round trip, how far the stock must move
// to pay it back, and how the spread (as % of the mid) changes across strikes on a liquid vs a thin underlying.
import * as O from "./_opt.js";
import { seg, onSeg, slider, bindSliders, stats, tex, barChart } from "./_viz.js";

const r = 0.04, S = 100, sigma = 0.2, days = 30;
const tickOf = (p) => (p < 3 ? 0.01 : 0.05);
// liquid (XYZ) vs thin (QRS) quote model: same fair value, different width
function quote(theo, K, thin) {
  const tick = tickOf(theo), F = O.forward(S, days / 365, r);
  const center = Math.round(theo / tick) * tick;
  const raw = thin ? (0.09 + 0.25 * theo) * (1 + 2 * Math.abs(Math.log(K / F))) : (0.01 + 0.02 * theo) * (1 + Math.abs(Math.log(K / F)));
  const w = 2 * tick * Math.max(1, Math.round(raw / (2 * tick)));
  let bid = center - w / 2, ask = center + w / 2;
  if (bid < 0.005) { bid = 0; ask = Math.max(ask, 0.02); }
  return { bid: Math.round(bid * 100) / 100, ask: Math.round(ask * 100) / 100 };
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let und = "xyz", type = "call";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("价差的账单：一个来回要付多少，股价要走多远", "The spread's bill: what a round trip costs and how far the stock must move")}</div>
    <div class="demo-row">${seg("ls-und", [["xyz", T("XYZ（流动性好）", "XYZ (liquid)")], ["qrs", T("QRS（冷门）", "QRS (thin)")]], und)}
      ${seg("ls-type", [["call", T("看涨", "Call")], ["put", T("看跌", "Put")]], type)}</div>
    <div class="demo-grid">
      ${slider("ls-k", T("行权价 K", "Strike K"), 85, 115, 2.5, 100)}
      ${slider("ls-n", T("合约张数", "Contracts"), 1, 50, 1, 10)}
      ${slider("ls-c", T("每张每边佣金（示意）", "Commission per contract per side (illustrative)"), 0, 1.5, 0.05, 0.65)}
      ${slider("ls-m", T("你预期股价朝有利方向走", "Stock move you expect in your favour"), 0, 5, 0.1, 1)}
    </div>
    <div id="ls-q"></div>
    <div class="demo-math" id="ls-f"></div>
    <div id="ls-stats"></div>
    <div class="demo-label" style="margin-top:12px">${T("各行权价的价差占中间价百分比（30 天，同一只股票）", "Spread as % of mid across strikes (30 days, same stock)")}</div>
    <div id="ls-bars"></div>
    <p class="demo-tip">${T("试试：把行权价拉到 115 的看涨，价差只有两分钱，却可能占中间价一大截；再切到 QRS，同样的期权，要走超过一天典型波动（约 1.05 美元）的幅度才能打平价差。预期收益这里只用 Delta 粗算，没算时间损耗。",
      "Try this: pick the 115 call — the spread is two cents yet a big slice of the mid; switch to QRS and the same option needs more than a typical day's move (about $1.05) just to pay back the spread. The expected gain here is a rough delta-only estimate that ignores time decay.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const K = v["ls-k"], n = v["ls-n"], c = v["ls-c"], move = v["ls-m"], thin = und === "qrs", Tm = days / 365;
    const g = O.greeks({ S, K, T: Tm, r, sigma, type });
    const q = quote(g.price, K, thin), mid = (q.bid + q.ask) / 2, spr = q.ask - q.bid;
    const cost = spr * 100 * n + 2 * c * n, pos = mid * 100 * n;
    const beMove = Math.abs(g.delta) > 1e-4 ? spr / Math.abs(g.delta) : Infinity;
    const gain = Math.abs(g.delta) * move * 100 * n;
    $("#ls-q").innerHTML = `<div class="kv">
      <span class="k">${T("报价（买 / 卖）", "Quote (bid / ask)")}</span><span class="v">${q.bid.toFixed(2)} / ${q.ask.toFixed(2)}</span>
      <span class="k">${T("中间价 · 理论价", "Mid · model value")}</span><span class="v">${mid.toFixed(3)} · ${g.price.toFixed(3)}</span>
      <span class="k">Δ</span><span class="v">${g.delta.toFixed(3)}</span></div>`;
    $("#ls-f").innerHTML = tex(String.raw`\text{${T("价差", "spread")}}\ \% = \frac{${q.ask.toFixed(2)} - ${q.bid.toFixed(2)}}{${mid.toFixed(3)}} = ${mid > 0 ? ((spr / mid) * 100).toFixed(1) : "\\infty"}\%`, true)
      + tex(String.raw`\text{${T("来回成本", "round trip")}} = ${spr.toFixed(2)} \times 100 \times ${n} + 2 \times ${c.toFixed(2)} \times ${n} = \$${cost.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, "{,}")}`, true)
      + tex(String.raw`\Delta S_{\text{${T("打平", "cost")}}} \approx \frac{${spr.toFixed(2)}}{${Math.abs(g.delta).toFixed(3)}} = ${isFinite(beMove) ? "\\$" + beMove.toFixed(2) : "\\infty"}`, true);
    $("#ls-stats").innerHTML = stats([
      [T("头寸价值（中间价）", "Position at mid"), "$" + Math.round(pos).toLocaleString("en-US")],
      [T("来回成本占比", "Round trip as % of position"), pos > 0 ? ((cost / pos) * 100).toFixed(1) + "%" : "—", cost / pos > 0.1 ? "neg" : ""],
      [T("预期毛收益（Δ 粗算）", "Expected gross gain (Δ estimate)"), "$" + Math.round(gain).toLocaleString("en-US"), "acc"],
      [T("扣成本后", "After costs"), (gain - cost >= 0 ? "+$" : "−$") + Math.round(Math.abs(gain - cost)).toLocaleString("en-US"), gain - cost >= 0 ? "pos" : "neg"],
    ]);
    const bars = [];
    for (let k = 85; k <= 115; k += 5) {
      const p = O.bsPrice({ S, K: k, T: Tm, r, sigma, type }), qq = quote(p, k, thin), m = (qq.bid + qq.ask) / 2;
      bars.push({ label: String(k), value: m > 0 ? ((qq.ask - qq.bid) / m) * 100 : 0, cls: k === K ? 0 : thin ? 2 : 1 });
    }
    $("#ls-bars").innerHTML = barChart({ bars, yfmt: (x) => x.toFixed(0) + "%", xlabel: T(`行权价（${type === "call" ? "看涨" : "看跌"}）`, `strike (${type}s)`), H: 200 });
  };
  const run = bindSliders(root, { "ls-k": (x) => String(x), "ls-n": (x) => String(x), "ls-c": (x) => "$" + (+x).toFixed(2), "ls-m": (x) => "$" + (+x).toFixed(1) }, draw);
  onSeg(root, "ls-und", (v) => { und = v; run(); });
  onSeg(root, "ls-type", (v) => { type = v; run(); });
}
