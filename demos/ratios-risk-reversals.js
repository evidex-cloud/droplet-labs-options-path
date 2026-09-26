// Main demo for lesson ratios-risk-reversals: ratio spreads, backspreads, risk reversals and the collar priced
// with and without an illustrative equity skew, plus a spot × vol stress after a few days (sticky strike).
import * as O from "./_opt.js";
import { payoffChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let kind = "put12";
  const names = {
    call12: T("看涨 1×2", "Call 1×2"), put12: T("看跌 1×2", "Put 1×2"), callback: T("看涨反向价差", "Call backspread"),
    putback: T("看跌反向价差", "Put backspread"), rr: T("偏多风险逆转", "Bullish risk reversal"), collar: T("领口（含 100 股）", "Collar (with 100 shares)"),
  };
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("偏斜交易台：同一结构，平坦与偏斜两种价格", "Skew desk: one structure, flat-vol and skewed prices")}</div>
    <div class="demo-row">${seg("rrr-kind", Object.entries(names), kind)}</div>
    <div class="demo-grid">
      ${slider("rrr-b", T("偏斜强度（0 = 平坦 20%）", "Skew strength (0 = flat 20%)"), 0, 100, 5, 50)}
      ${slider("rrr-w", T("行权价间距", "Strike spacing"), 3, 10, 1, 5)}
      ${slider("rrr-ds", T("压力：股价变动", "Stress: stock move"), -25, 25, 1, -10)}
      ${slider("rrr-dv", T("压力：所有 IV 变动", "Stress: all IVs move"), -10, 15, 1, 5)}
      ${slider("rrr-h", T("压力：几天之后", "Stress: days later"), 1, 25, 1, 5)}
    </div>
    <div class="demo-math" id="rrr-f"></div>
    <div id="rrr-legs"></div>
    <div id="rrr-stats"></div>
    <div id="rrr-chart"></div>
    <p class="demo-tip">${T("试试：在“看跌 1×2”上把偏斜从 0 拉到 1，成本一路下降——你在被付钱卖出贵的看跌；再把压力设成股价 −15%、IV +10，看虚线（几天后的损益）掉到哪里。换成“看涨反向价差”，偏斜反而让它更便宜。", "Try this: on the put 1×2, slide the skew from 0 to 1 and the cost keeps falling — you are being paid to sell rich puts; then set the stress to −15% and IV +10 and see where the dashed curve (P&L a few days later) lands. Switch to the call backspread and the skew makes it cheaper instead.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const r = 0.04, Tm = 30 / 365, S0 = 100;
  const build = (w) => ({
    call12: [["call", 100, 1], ["call", 100 + w, -2]],
    put12: [["put", 100, 1], ["put", 100 - w, -2]],
    callback: [["call", 100, -1], ["call", 100 + w, 2]],
    putback: [["put", 100, -1], ["put", 100 - w, 2]],
    rr: [["call", 100 + w, 1], ["put", 100 - w, -1]],
    collar: [["stock", 0, 1], ["put", 100 - w, 1], ["call", 100 + w, -1]],
  }[kind]);
  const draw = (v) => {
    const b = v["rrr-b"] / 100, w = v["rrr-w"], dS = v["rrr-ds"] / 100, dv = v["rrr-dv"] / 100, h = v["rrr-h"];
    const vol = (K) => Math.max(0.05, 0.2 - b * Math.log(K / S0) + 2 * b * Math.log(K / S0) ** 2);
    const spec = build(w);
    const px = (ty, K, s) => O.bsPrice({ S: S0, K, T: Tm, r, sigma: s, type: ty });
    let flat = 0, skew = 0; const rows = [];
    for (const [ty, K, q] of spec) {
      if (ty === "stock") { rows.push(`<tr><td>${q > 0 ? "+" : ""}${q * 100} ${T("股 XYZ", "shares XYZ")}</td><td>–</td><td>100.00</td><td>100.00</td></tr>`); continue; }
      const pf = px(ty, K, 0.2), ps = px(ty, K, vol(K));
      flat += q * pf; skew += q * ps;
      rows.push(`<tr><td>${q > 0 ? "+" : ""}${q} × ${K} ${ty === "call" ? T("看涨", "call") : T("看跌", "put")}</td><td>${(vol(K) * 100).toFixed(1)}%</td><td>${pf.toFixed(2)}</td><td>${ps.toFixed(2)}</td></tr>`);
    }
    $("#rrr-legs").innerHTML = `<table><thead><tr><th>${T("腿", "Leg")}</th><th>${T("该行权价 IV", "IV at strike")}</th><th>${T("平坦 20% 价格", "Flat-20% price")}</th><th>${T("偏斜价格", "Skewed price")}</th></tr></thead><tbody>${rows.join("")}</tbody></table>`;
    const cash = (x) => (x > 0 ? T("付 ", "pay ") : T("收 ", "receive ")) + Math.abs(x).toFixed(2);
    $("#rrr-f").innerHTML = tex(String.raw`\begin{gathered}\text{${T("净权利金", "Net premium")}} = \sum_i n_i\,V_i\big(\sigma(K_i)\big) = ${skew >= 0 ? "" : "-"}${Math.abs(skew).toFixed(3)} \\ (\text{${T("平坦 20\\% 时", "flat 20\\%")}}: ${flat >= 0 ? "" : "-"}${Math.abs(flat).toFixed(3)})\end{gathered}`, true);
    const legs = spec.map(([ty, K, q]) => ty === "stock"
      ? { type: "stock", side: "long", entry: S0, qty: q }
      : { type: ty, side: q > 0 ? "long" : "short", qty: Math.abs(q), K, premium: px(ty, K, vol(K)), T: Tm, sigma: Math.max(0.03, vol(K) + dv) });
    const Sx = S0 * (1 + dS);
    const stress = O.netPLAt(legs, Sx, { elapsed: h / 365, sigma: 0.2, r });
    const st = O.payoffStats(legs, 1, 250);
    const legs0 = legs.map((l) => (l.type === "stock" ? l : { ...l, sigma: vol(l.K) }));
    const g = O.positionGreeks(legs0, S0, { sigma: 0.2, r });
    let vanna = 0; for (const [ty, K, q] of spec) if (ty !== "stock") vanna += q * O.greeks({ S: S0, K, T: Tm, r, sigma: vol(K), type: ty }).vanna;
    $("#rrr-stats").innerHTML = stats([
      [T("平坦 20% 时", "At flat 20%"), cash(flat)],
      [T("有偏斜时", "With the skew"), cash(skew), "acc"],
      [T("到期最大利润", "Max profit at expiry"), isFinite(st.maxProfit) ? "$" + (st.maxProfit * 100).toFixed(0) : "∞", "pos"],
      [Math.abs(st.maxLoss - st.atZero) < 1e-9 ? T("到期最坏（XYZ 跌到 0）", "Worst at expiry (XYZ to 0)") : T("到期最大亏损", "Max loss at expiry"), isFinite(st.maxLoss) ? "−$" + Math.abs(st.maxLoss * 100).toFixed(0) : T("无上限", "unlimited"), "neg"],
      [T(`压力：${h} 天后 XYZ ${Sx.toFixed(0)}、IV ${dv >= 0 ? "+" : "−"}${Math.abs(dv * 100).toFixed(0)}`, `Stress: day ${h}, XYZ ${Sx.toFixed(0)}, IV ${dv >= 0 ? "+" : "−"}${Math.abs(dv * 100).toFixed(0)}`), (stress >= 0 ? "+$" : "−$") + Math.abs(stress * 100).toFixed(0), stress >= 0 ? "pos" : "neg"],
      [T("Δ / Vega", "Δ / vega"), `${(g.delta >= 0 ? "+" : "−") + Math.abs(g.delta).toFixed(2)} / ${(g.vega >= 0 ? "+" : "−") + Math.abs(g.vega).toFixed(3)}`],
      ["Vanna", vanna.toFixed(2)],
    ]);
    const { html } = payoffChart({
      legs, lo: 72, hi: 128, spot: Sx, mult: 100, today: { elapsed: h / 365, sigma: 0.2, r },
      xlabel: T("XYZ 价格", "XYZ price"), ylabel: T("每组损益（美元）", "P&L per set ($)"),
      labels: { expiry: T("到期（偏斜价格）", "At expiry (skewed prices)"), today: T(`${h} 天后，IV 变动 ${(dv * 100).toFixed(0)} 点`, `After ${h} days, IV ${dv >= 0 ? "+" : ""}${(dv * 100).toFixed(0)} pts`), spot: T("压力点", "stress"), be: T("平衡", "BE") },
    });
    $("#rrr-chart").innerHTML = html;
  };
  const run = bindSliders(root, { "rrr-b": (x) => (x / 100).toFixed(2), "rrr-w": (x) => "$" + x, "rrr-ds": (x) => (x > 0 ? "+" : x < 0 ? "−" : "") + Math.abs(x) + "%", "rrr-dv": (x) => (x > 0 ? "+" : x < 0 ? "−" : "") + Math.abs(x) + T(" 点", " pts"), "rrr-h": (x) => x + T(" 天", " days") }, draw);
  onSeg(root, "rrr-kind", (v) => { kind = v; run(); });
}
